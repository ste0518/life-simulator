(function () {
  "use strict";

  /**
   * 工作 / 租房 / 求职 / 年度收支 / 育儿事件 / 意外事件库
   * ------------------------------------------------------------
   * 手动改数值、文案、事件：优先改本文件与 window.LIFE_WORK_LIFE_CONFIG。
   * 引擎读取：performCustomAction（job_application_roll / apply_work_location / apply_housing_choice）、
   * applyAnnualEconomyTicks（按年龄跨年结算）。
   */

  function toList(value) {
    return Array.isArray(value) ? value.slice() : [];
  }

  function toStats(value) {
    return value && typeof value === "object" ? { ...value } : {};
  }

  function condition(value) {
    const source = value && typeof value === "object" ? value : {};
    return {
      minAge: typeof source.minAge === "number" ? source.minAge : null,
      maxAge: typeof source.maxAge === "number" ? source.maxAge : null,
      minStats: toStats(source.minStats),
      maxStats: toStats(source.maxStats),
      requiredFlags: toList(source.requiredFlags),
      excludedFlags: toList(source.excludedFlags),
      requiredTags: toList(source.requiredTags),
      excludedTags: toList(source.excludedTags),
      careerRouteIds: toList(source.careerRouteIds),
      excludedCareerRouteIds: toList(source.excludedCareerRouteIds),
      educationRouteIds: toList(source.educationRouteIds),
      excludedEducationRouteIds: toList(source.excludedEducationRouteIds),
      minChildCount: typeof source.minChildCount === "number" ? source.minChildCount : null,
      maxChildCount: typeof source.maxChildCount === "number" ? source.maxChildCount : null,
      someFlags: toList(source.someFlags)
    };
  }

  function mutation(value) {
    const source = value && typeof value === "object" ? value : {};
    const effects = source.effects && typeof source.effects === "object" ? source.effects : {};
    return {
      effects: {
        age: typeof effects.age === "number" ? effects.age : 0,
        stats: toStats(effects.stats)
      },
      addFlags: toList(source.addFlags),
      removeFlags: toList(source.removeFlags),
      addTags: toList(source.addTags),
      removeTags: toList(source.removeTags),
      log: typeof source.log === "string" ? source.log : ""
    };
  }

  function choice(value) {
    const source = value && typeof value === "object" ? value : {};
    const normalized = mutation(source);
    const out = {
      text: typeof source.text === "string" ? source.text : "继续",
      effects: normalized.effects,
      addFlags: normalized.addFlags,
      removeFlags: normalized.removeFlags,
      addTags: normalized.addTags,
      removeTags: normalized.removeTags,
      log: normalized.log,
      conditions: condition(source.conditions || {}),
      customAction: typeof source.customAction === "string" ? source.customAction : "",
      customPayload: source.customPayload && typeof source.customPayload === "object" ? { ...source.customPayload } : null,
      next: Object.prototype.hasOwnProperty.call(source, "next") ? source.next : undefined
    };
    if (Object.prototype.hasOwnProperty.call(source, "setCareerRoute")) {
      out.setCareerRoute = typeof source.setCareerRoute === "string" ? source.setCareerRoute : null;
    }
    if (Object.prototype.hasOwnProperty.call(source, "setEducationRoute")) {
      out.setEducationRoute = typeof source.setEducationRoute === "string" ? source.setEducationRoute : null;
    }
    if (Object.prototype.hasOwnProperty.call(source, "setActiveRelationship")) {
      out.setActiveRelationship = typeof source.setActiveRelationship === "string" ? source.setActiveRelationship : null;
    }
    if (Object.prototype.hasOwnProperty.call(source, "relationshipEffects")) {
      out.relationshipEffects = Array.isArray(source.relationshipEffects) ? source.relationshipEffects : [];
    }
    return out;
  }

  function event(value) {
    const source = value && typeof value === "object" ? value : {};
    return {
      id: typeof source.id === "string" ? source.id : "",
      stage: typeof source.stage === "string" ? source.stage : "misc",
      title: typeof source.title === "string" ? source.title : "事件",
      text: typeof source.text === "string" ? source.text : "",
      minAge: typeof source.minAge === "number" ? source.minAge : null,
      maxAge: typeof source.maxAge === "number" ? source.maxAge : null,
      weight: typeof source.weight === "number" ? source.weight : 1,
      repeatable: Boolean(source.repeatable),
      cooldownChoices: typeof source.cooldownChoices === "number" ? source.cooldownChoices : undefined,
      tags: toList(source.tags),
      conditions: condition(source.conditions || {}),
      effectsOnEnter: mutation(source.effectsOnEnter || {}),
      choices: Array.isArray(source.choices) ? source.choices.map(choice) : []
    };
  }

  /** 年薪按 0 处理、且跳过年度工资入账的路线（求职过渡态）；其余路线用 salaryByCareerRouteId 中的年薪 */
  window.LIFE_CAREER_NON_EARNING_IDS = ["career_in_job_search"];

  /**
   * 求职概率配置（引擎内读取）
   * baseAcceptProbability：基础录取率（约 0.4 → 拒绝约 60%）
   */
  window.LIFE_JOB_APPLICATION_CONFIG = {
    baseAcceptProbability: 0.38,
    minAcceptProbability: 0.07,
    maxAcceptProbability: 0.88,
    statWeights: {
      intelligence: 0.001,
      social: 0.0012,
      career: 0.0009,
      mental: 0.0008,
      familySupport: 0.0007
    },
    stressPenalty: 0.0011,
    referralBonus: 0.16,
    familyJobBonus: 0.12,
    topSchoolBonus: 0.1,
    overseasEduBonus: 0.11,
    vocationalFitBonus: 0.08,
    directWorkBonus: 0.05,
    trackBonus: {
      corporate: 0,
      system: 0.03,
      startup: -0.04,
      freelance: -0.02,
      trades: 0.04,
      foreign: 0.05
    }
  };

  window.LIFE_WORK_LIFE_CONFIG = {
    annualLivingCostBase: 7,
    /** 有「住家」类 flag 时从年支出里减免 */
    liveWithParentsLivingDiscount: 5,

    /**
     * 工作地点与「住自己家」是否同时成立：仅当 workLocationId 在列表内时，住房里程碑才出现该选项。
     * （引擎与 UI 选项过滤共用）
     */
    housingEligibilityRules: {
      parentsHomeAllowedWorkLocationIds: ["loc_stay_local", "loc_hometown_return"]
    },

    /**
     * 年房租 = 年度名义工资收入（与年度结算同一套：career 年薪 × 地点 salaryMult）× annualSalaryFraction × 住房档位倍数。
     * 住父母家倍数为 0。改比例只改 annualSalaryFraction。
     */
    rentConfig: {
      annualSalaryFraction: 0.4,
      housingRentTierMultipliers: {
        housing_parents_home: 0,
        housing_share_room: 0.88,
        housing_company_dorm: 0.58,
        housing_studio_plain: 1,
        housing_one_bedroom: 1.14,
        housing_nicer_upgrade: 1.32
      }
    },
    layoffProbabilityPerYear: 0.035,
    bonusProbabilityPerYear: 0.065,
    bonusMoneyRange: [2, 8],
    layoffStress: 14,
    workLocations: [
      {
        id: "loc_stay_local",
        label: "留在熟悉城市（学校/老家半径）",
        salaryMult: 0.94,
        livingCostAdd: 0,
        stats: { stress: -1, happiness: 2, familySupport: 1 }
      },
      {
        id: "loc_tier1_hustle",
        label: "去一线或强省会拼机会",
        salaryMult: 1.18,
        livingCostAdd: 5,
        stats: { stress: 5, career: 2, social: 2, happiness: -1 }
      },
      {
        id: "loc_overseas_return_hub",
        label: "驻外/港澳/跨境通勤带（高回报高消耗）",
        salaryMult: 1.22,
        livingCostAdd: 6,
        stats: { stress: 6, money: 1, happiness: -2 },
        requiresFlags: ["globalized_resume", "career_foreign_track"]
      },
      {
        id: "loc_hometown_return",
        label: "回老家或更低线城降速生活",
        salaryMult: 0.82,
        livingCostAdd: -2,
        stats: { stress: -3, happiness: 3, career: -2, familySupport: 3 }
      }
    ],
    housingOptions: [
      {
        id: "housing_parents_home",
        label: "住家里 / 不额外租房",
        stats: { happiness: -1, stress: 3, familySupport: 2 },
        addFlags: ["housing_parents_roof"]
      },
      {
        id: "housing_share_room",
        label: "合租小房间（便宜、边界感弱）",
        stats: { stress: 3, happiness: -2, health: -1 }
      },
      {
        id: "housing_company_dorm",
        label: "单位宿舍 / 公司周转房（有名额时）",
        stats: { stress: 2, happiness: -1, social: 1 },
        addFlags: ["housing_company_dorm"]
      },
      {
        id: "housing_studio_plain",
        label: "普通单间/开间",
        stats: { happiness: 1, stress: 1 }
      },
      {
        id: "housing_one_bedroom",
        label: "一居室（独立空间）",
        stats: { happiness: 3, stress: -2, money: -1 }
      },
      {
        id: "housing_nicer_upgrade",
        label: "条件更好的小区/公寓",
        stats: { happiness: 5, stress: -3, money: -2 }
      }
    ],
    /** 与 careerRoute.id 对应名义年薪（游戏财富单位，与商店价格同刻度） */
    salaryByCareerRouteId: {
      stable_office_job: 15,
      system_job: 14,
      high_pay_pressure_job: 28,
      startup_route: 18,
      freelance_route: 13,
      family_arranged_job: 17,
      further_study_route: 4,
      unemployed_drift_route: 2,
      career_vocational_trades: 14,
      career_early_labor_market: 11,
      career_foreign_firm_or_return: 24,
      career_gap_year_after_degree: 3,
      career_family_supported_home: 2,
      career_in_job_search: 0
    }
  };

  /** 恋爱对象家庭背景（未达亲密度仅显示 vague；达到后显示完整）——可逐人改 */
  window.LIFE_PARTNER_FAMILY_BY_ID = {
    _default: {
      vague: "你对 Ta 的家底只有零碎印象：饭桌上偶尔提起的语气、花钱时的习惯、以及 Ta 刻意绕开的话题。",
      revealedTitle: "家庭背景",
      revealedSummary:
        "走近之后，Ta 才愿意把成长环境说细：普通中国城市家庭，关系不戏剧，但有自己的松紧与期待。",
      revealedDetails: [
        "父母职业与收入：你不确定具体数字，但能感到「稳」或「紧」其中一种更偏哪边。",
        "家庭观念：对婚姻、面子、孝顺各有默认答案，不一定说出来，但会在冲突里露出来。"
      ],
      revealedFlags: ["partner_family_known_generic"]
    },
    song_qinghe: {
      vague: "你知道她家里不算阔，也不算紧；她很少抱怨，但会下意识把「别添麻烦」写得很重。",
      revealedTitle: "宋清禾的家庭底色",
      revealedSummary:
        "父亲是基层公务员，母亲是小学老师；小城体面、规矩多、情绪表达克制。家里更看重「稳定与清白」而不是暴富。",
      revealedDetails: [
        "教育期待：从小被鼓励读书，但不许太张扬；考上好学校是面子，也是她给自己的枷锁。",
        "对亲密关系：默认要「靠谱、能过日子」；对浪漫不排斥，但更怕失控与闲话。",
        "潜在张力：若你路线太野或消费太跳，她会更先担心「家里怎么说」而不是立刻跟你吵。"
      ],
      revealedFlags: ["partner_family_song_revealed", "inlaw_expect_stability"]
    },
    jiang_xun: {
      vague: "他家里的事你听来的多是碎片：早年做过小生意，后来起落过，所以他花钱有时大方有时抠。",
      revealedTitle: "江循的家庭底色",
      revealedSummary:
        "父母在本地做过餐饮与小买卖，家境曾经好过也紧过；他从小就被教会「要会做人、要能扛事」。",
      revealedDetails: [
        "家庭氛围：热闹、直给、但也容易把情绪用呛的方式说出来。",
        "对感情：更看重「站不站得住」与「够不够义气」；你若退缩，他会比你还急。",
        "婚姻观：偏向先把日子撑起来，再谈浪漫；对门当户对不挂在嘴边，但会在关键时刻拿现实砸你。"
      ],
      revealedFlags: ["partner_family_jiang_revealed", "inlaw_pragmatic"]
    },
    lin_xiaonan: {
      vague: "她几乎不提家里，只在压力大时漏一两句：有人对她期望很高，也有人并不真正懂她。",
      revealedTitle: "林小楠的家庭底色",
      revealedSummary:
        "父亲是工程师，母亲是会计；典型中产理性家庭，成绩与路径被精密计算过，她的敏感很少被当作「需要被照顾的事」。",
      revealedDetails: [
        "成长关键词：证明、排名、别掉队；她擅长扛，但不擅长求助。",
        "对亲密关系：一旦信任，会把脆弱摊开；若你轻视那份脆弱，她会迅速收回。",
        "对未来：默认要「可计算的安全边际」；你若长期不确定，她会先焦虑、再冷淡。"
      ],
      revealedFlags: ["partner_family_lin_revealed", "inlaw_middle_class_pressure"]
    },
    zhou_mingyue: {
      vague: "你看出来她家里条件不差，但她刻意不让任何人用「家境」定义她；朋友圈也比学生时代更杂。",
      revealedTitle: "周明月的家庭底色",
      revealedSummary:
        "父母一方在文化行业，一方做生意；从小见过场面，也见过人情冷暖。她擅长社交，也更警惕被利用。",
      revealedDetails: [
        "家庭资源：关键时刻能托一把，但代价往往是话语权与评价。",
        "对感情：要「并肩」不要「附属」；你若让她感到被收纳，她会逃。",
        "婚姻态度：不迷信门第，但极在意尊重与边界；家长反对时，她会比你想的更撕裂。"
      ],
      revealedFlags: ["partner_family_zhou_revealed", "inlaw_mixed_class"]
    }
  };

  /** 与玩家学历/留学状态拼接的「对象近况」补句（引擎追加在分阶段简介后） */
  window.LIFE_PARTNER_BIO_SNIPPETS = {
    _default: {
      byEducationRouteId: {
        elite_city_university: "你们若不同校，她/他会更用力地证明自己没有掉队；同城时则更像在比较里偷偷对齐你。",
        ordinary_university: "普通平台并没有让她/他变钝，只是把野心换了一种更隐忍的节奏。",
        local_university: "离家近的那几年，她/他把很多决定让给了「方便」与「家里放心」，但心里未必完全服气。",
        overseas_research_path: "若走过海外研究路线，她/他的表达会更谨慎、更国际化，也更常在夜里算时差与归属。",
        overseas_practical_path: "实用型留学背景让她/他更会把「留下/回去」当成现金流与签证题，而不是浪漫题。",
        direct_work_route: "早入社会的那边往往更早学会看脸色与看账本；你再谈校园那套，有时会碰钉。"
      },
      byCareerArc: {
        cold_success: "成功上升后，她/他的礼貌更像流程，温柔更像额度。",
        warm_stable: "关系越深，她/他越愿意把日常摊开给你看——包括那些不漂亮的部分。",
        volatile_drift: "情绪起伏变大时，她/他会用忙、用玩笑、用消失来挡真正的难言之隐。"
      }
    },
    song_qinghe: {
      byEducationRouteId: {
        elite_city_university: "若你在高平台，她会更小心自己的出处与措辞，怕被你无意看轻。",
        overseas_research_path: "异国那几年若错开，她会用长文字维持联系；回国后第一句往往是「你变了吗」。"
      }
    }
  };

  const extra = [
    event({
      id: "job_search_cycle",
      stage: "young_adult",
      title: "求职回合：投递、笔试、面试与回音",
      text: "招聘软件的通知、测评链接、面试官的礼貌疏离，以及那封写得很标准的拒信——你把自尊反复折成简历格式。你也可以找关系、托内推，或换一个更现实的赛道再投一次。",
      minAge: 22,
      maxAge: 40,
      weight: 22,
      repeatable: true,
      cooldownChoices: 3,
      tags: ["career", "work", "job_hunt"],
      conditions: condition({
        careerRouteIds: ["career_in_job_search"]
      }),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "这一回合，你把希望又押进一封邮件发送成功的提示音里。"
      }),
      choices: [
        choice({
          text: "海投大厂/平台岗：简历、笔试、群面一路硬闯（无内推）。",
          customAction: "job_application_roll",
          customPayload: { targetCareerRouteId: "high_pay_pressure_job", track: "corporate", referral: false },
          effects: { age: 1, stats: { stress: 2, career: 1 } },
          log: "",
          conditions: condition({})
        }),
        choice({
          text: "找学长/亲戚内推，把简历递进人事系统里。",
          customAction: "job_application_roll",
          customPayload: { targetCareerRouteId: "high_pay_pressure_job", track: "corporate", referral: true },
          effects: { age: 1, stats: { social: 1, stress: 2 } },
          conditions: condition({ minStats: { social: 22 } })
        }),
        choice({
          text: "主攻体制内/事业单位考试路线（更慢、更卷、更确定感）。",
          customAction: "job_application_roll",
          customPayload: { targetCareerRouteId: "system_job", track: "system", referral: false },
          effects: { age: 1, stats: { intelligence: 1, stress: 3 } },
          conditions: condition({})
        }),
        choice({
          text: "投中小公司与稳定职能岗：先接住生活。",
          customAction: "job_application_roll",
          customPayload: { targetCareerRouteId: "stable_office_job", track: "corporate", referral: false },
          effects: { age: 1, stats: { stress: 1 } },
          conditions: condition({})
        }),
        choice({
          text: "赌一把创业团队/高波动岗位。",
          customAction: "job_application_roll",
          customPayload: { targetCareerRouteId: "startup_route", track: "startup", referral: false },
          effects: { age: 1, stats: { stress: 4, career: 2 } },
          conditions: condition({ someFlags: ["risk_taker", "startup_path", "ambition_realized"] })
        }),
        choice({
          text: "接自由职业/项目制（收入不稳但更自由）。",
          customAction: "job_application_roll",
          customPayload: { targetCareerRouteId: "freelance_route", track: "freelance", referral: false },
          effects: { age: 1, stats: { discipline: 1, stress: 2 } },
          conditions: condition({ someFlags: ["portfolio_path", "freelance_seed", "signature_work"] })
        }),
        choice({
          text: "走家里安排的关系入口（更快，也更欠人情）。",
          customAction: "job_application_roll",
          customPayload: { targetCareerRouteId: "family_arranged_job", track: "corporate", referral: true, familyLine: true },
          effects: { age: 1, stats: { stress: 2, familySupport: 1 } },
          conditions: condition({
            someFlags: ["family_wealth_high", "merchant_home", "parents_close", "parental_support", "living_at_parents_after_school"]
          })
        }),
        choice({
          text: "技能岗/持证岗：把证书与实操摆上桌。",
          customAction: "job_application_roll",
          customPayload: { targetCareerRouteId: "career_vocational_trades", track: "trades", referral: false },
          effects: { age: 1, stats: { career: 2, health: -1 } },
          conditions: condition({
            educationRouteIds: ["gaokao_vocational_college", "non_gaokao_skill_path", "direct_work_route"]
          })
        }),
        choice({
          text: "早入劳动力市场路线：继续找能立刻上手的岗位。",
          customAction: "job_application_roll",
          customPayload: { targetCareerRouteId: "career_early_labor_market", track: "trades", referral: false },
          effects: { age: 1, stats: { stress: 2, money: 1 } },
          conditions: condition({ educationRouteIds: ["direct_work_route"] })
        }),
        choice({
          text: "外企/跨境带：把语言与履历押上国际筛选。",
          customAction: "job_application_roll",
          customPayload: { targetCareerRouteId: "career_foreign_firm_or_return", track: "foreign", referral: false },
          effects: { age: 1, stats: { stress: 3, social: 1 } },
          conditions: condition({
            educationRouteIds: ["overseas_research_path", "overseas_practical_path", "overseas_art_path"]
          })
        }),
        choice({
          text: "暂时停止这一轮回合，先去处理情绪与生活（不投这一份）。",
          effects: { age: 1, stats: { mental: 2, stress: -1 } },
          addFlags: ["job_hunt_paused_once"],
          log: "你把手机摁灭，允许自己先从不被评价的地方喘一口气。"
        })
      ]
    }),
    event({
      id: "work_location_pick_milestone",
      stage: "young_adult",
      title: "offer 之后：你要把生活安放在哪座城市节奏里？",
      text: "工资数字只是前半句，房租、通勤、离谁近、离谁远，才是后半句。你要决定工作半径落在哪种生活里。",
      minAge: 22,
      maxAge: 55,
      weight: 0,
      repeatable: false,
      tags: ["career", "housing", "milestone"],
      conditions: condition({
        requiredFlags: ["pending_work_location_pick"]
      }),
      effectsOnEnter: mutation({ log: "工作地点会改写你的花销曲线与关系距离。" }),
      choices: [
        choice({
          text: "留在熟悉城市（学校/老家半径），先把生活接稳。",
          customAction: "apply_work_location",
          customPayload: { locationId: "loc_stay_local" },
          effects: { age: 0, stats: {} },
          log: ""
        }),
        choice({
          text: "去一线或强省会，把职业天花板押上去。",
          customAction: "apply_work_location",
          customPayload: { locationId: "loc_tier1_hustle" },
          effects: { age: 0, stats: {} },
          log: ""
        }),
        choice({
          text: "回老家或更低线城，把速度降下来。",
          customAction: "apply_work_location",
          customPayload: { locationId: "loc_hometown_return" },
          effects: { age: 0, stats: {} },
          log: ""
        }),
        choice({
          text: "驻外/港澳/跨境通勤（仅适合已有跨境履历者）。",
          customAction: "apply_work_location",
          customPayload: { locationId: "loc_overseas_return_hub" },
          effects: { age: 0, stats: {} },
          conditions: condition({ someFlags: ["globalized_resume", "career_foreign_track"] })
        })
      ]
    }),
    event({
      id: "housing_pick_milestone",
      stage: "young_adult",
      title: "住哪里：合租、独居、宿舍，还是暂时住家里？",
      text: "房租会按你的年薪水平折算成每年的固定支出，从财富里扣——工资高，租金负担也会跟着上去。选一个你能承受、也能说服自己住得下去的方案。若工作不在老家附近，通常没法每天住回父母家。",
      minAge: 22,
      maxAge: 60,
      weight: 0,
      repeatable: false,
      tags: ["career", "housing", "milestone"],
      conditions: condition({
        requiredFlags: ["pending_housing_pick"]
      }),
      effectsOnEnter: mutation({ log: "住房方案会进入年度结算：工资入账、日常支出与租金一并计算。" }),
      choices: [
        choice({
          text: "住家里/不额外租房（省租金，边界变复杂）。",
          customAction: "apply_housing_choice",
          customPayload: { housingId: "housing_parents_home" },
          effects: { age: 0, stats: {} }
        }),
        choice({
          text: "合租小房间。",
          customAction: "apply_housing_choice",
          customPayload: { housingId: "housing_share_room" },
          effects: { age: 0, stats: {} }
        }),
        choice({
          text: "单位宿舍 / 公司周转房（有名额时）。",
          customAction: "apply_housing_choice",
          customPayload: { housingId: "housing_company_dorm" },
          effects: { age: 0, stats: {} }
        }),
        choice({
          text: "普通单间/开间。",
          customAction: "apply_housing_choice",
          customPayload: { housingId: "housing_studio_plain" },
          effects: { age: 0, stats: {} }
        }),
        choice({
          text: "一居室（独立空间）。",
          customAction: "apply_housing_choice",
          customPayload: { housingId: "housing_one_bedroom" },
          effects: { age: 0, stats: {} }
        }),
        choice({
          text: "条件更好的小区/公寓（租金显著更高）。",
          customAction: "apply_housing_choice",
          customPayload: { housingId: "housing_nicer_upgrade" },
          effects: { age: 0, stats: {} }
        })
      ]
    }),
    event({
      id: "switch_to_job_search_from_gap",
      stage: "young_adult",
      title: "暂缓之后：准备重新进入就业市场",
      text: "空白期不会自动变成答案，但你可以把下一段走得更清醒一点。",
      minAge: 22,
      maxAge: 45,
      weight: 6,
      repeatable: true,
      cooldownChoices: 5,
      tags: ["career", "job_hunt"],
      conditions: condition({
        careerRouteIds: ["career_gap_year_after_degree", "career_family_supported_home", "unemployed_drift_route"]
      }),
      choices: [
        choice({
          text: "认真开始投递与面试（进入求职循环）。",
          setCareerRoute: "career_in_job_search",
          addFlags: ["job_pipeline_active"],
          removeFlags: ["employment_deferred"],
          effects: { age: 0, stats: { stress: 2 } },
          log: "你重新打开招聘软件，像重新打开一条更硬的生存线。"
        }),
        choice({
          text: "再给自己一点时间。",
          effects: { age: 1, stats: { mental: 1, stress: 1 } },
          log: "你仍没把自己签出去，但也不算逃。"
        })
      ]
    }),
    /* ——— 育儿：可持续随机事件（有孩子后出现） ——— */
    event({
      id: "childcare_newborn_adjust",
      stage: "family",
      title: "新生儿的第一段夜与白天",
      text: "睡眠被切碎，账单变厚，你会反复问自己：到底要把自己放到多近，才算「在场」。",
      minAge: 24,
      maxAge: 45,
      weight: 8,
      repeatable: true,
      cooldownChoices: 6,
      tags: ["children", "parenting"],
      conditions: condition({ minChildCount: 1 }),
      choices: [
        choice({
          text: "尽量亲自带睡，把自己熬到极限也要靠近 Ta。",
          effects: { age: 1, stats: { happiness: 3, health: -6, stress: 6, career: -2 } },
          addFlags: ["parenting_primary_self"],
          log: "你在夜里听见自己的心跳比哭声还响。"
        }),
        choice({
          text: "请父母过来搭手，家里多三个人也多三条线。",
          effects: { age: 1, stats: { familySupport: 2, stress: 4, happiness: 2 } },
          addFlags: ["parenting_grandparent_help"],
          log: "厨房、沙发与育儿观念同时变得拥挤。"
        }),
        choice({
          text: "请保姆/月嫂，买一点可执行的睡眠。",
          effects: { age: 1, stats: { money: -6, stress: -3, happiness: 2 } },
          addFlags: ["parenting_nanny_used"],
          log: "你把一部分愧疚换成合同与工资条。"
        })
      ]
    }),
    event({
      id: "childcare_illness",
      stage: "family",
      title: "孩子发烧的那一夜",
      text: "温度计比任何 KPI 都更直接。你会在急诊排队里看见自己的恐惧与钱包同时变薄。",
      minAge: 1,
      maxAge: 55,
      weight: 7,
      repeatable: true,
      cooldownChoices: 5,
      tags: ["children", "parenting", "health"],
      conditions: condition({ minChildCount: 1 }),
      choices: [
        choice({
          text: "立刻去医院，把钱和班都先放下。",
          effects: { age: 0, stats: { money: -5, stress: 5, happiness: 1, health: -2 } },
          log: "你在走廊里来回走，突然理解「责任」不是名词，是停不下来的动词。"
        }),
        choice({
          text: "先居家观察，同时疯狂查资料（更省，也更焦虑）。",
          effects: { age: 0, stats: { stress: 7, mental: -2, money: -1 } },
          log: "你在搜索框里输入的都是害怕。"
        })
      ]
    }),
    event({
      id: "childcare_kindergarten",
      stage: "family",
      title: "幼儿园门口的新战争",
      text: "接送、攀比、兴趣班与「别让孩子输在起跑线」——你发现自己开始用成年人的焦虑替孩子跑。",
      minAge: 25,
      maxAge: 50,
      weight: 7,
      repeatable: true,
      cooldownChoices: 6,
      tags: ["children", "parenting", "education"],
      conditions: condition({ minChildCount: 1 }),
      choices: [
        choice({
          text: "选离家近的普惠园，先把节奏稳住。",
          effects: { age: 1, stats: { money: -3, stress: -1, happiness: 1 } },
          log: "你告诉自己，稳定也是一种教育。"
        }),
        choice({
          text: "咬咬牙上更贵的园，赌更好的照护与圈层。",
          effects: { age: 1, stats: { money: -10, stress: 3, career: -1 } },
          log: "账单上的数字让你更不敢停。"
        })
      ]
    }),
    event({
      id: "childcare_couple_clash",
      stage: "family",
      title: "育儿观念在餐桌上炸开",
      text: "一句「你怎么又这样」背后，是两个人对风险、体面与爱的不同算法。",
      minAge: 24,
      maxAge: 55,
      weight: 6,
      repeatable: true,
      cooldownChoices: 5,
      tags: ["children", "romance", "parenting"],
      conditions: condition({ minChildCount: 1, minStats: { stress: 30 } }),
      choices: [
        choice({
          text: "把规则谈清楚：钱、时间、谁兜底。",
          effects: { age: 1, stats: { stress: 2, happiness: 1 } },
          log: "谈清楚很疼，但比互相猜更省命。"
        }),
        choice({
          text: "先冷处理，结果夜里更堵。",
          effects: { age: 1, stats: { stress: 5, mental: -2 } },
          log: "沉默并不会让矛盾消失，只会让它换地方长出来。"
        })
      ]
    }),
    event({
      id: "childcare_job_tradeoff",
      stage: "family",
      title: "为孩子调整工作节奏",
      text: "你想保留上升空间，也想保留接送与陪伴；现实却常常逼你做减法。",
      minAge: 26,
      maxAge: 50,
      weight: 5,
      repeatable: true,
      cooldownChoices: 7,
      tags: ["children", "work", "parenting"],
      conditions: condition({ minChildCount: 1 }),
      choices: [
        choice({
          text: "换更稳但更慢的岗位。",
          effects: { age: 1, stats: { career: -3, happiness: 2, stress: -2, money: -2 } },
          addFlags: ["parenting_career_slowed"],
          log: "你把野心往回收了一点，换回可预期的下班时间。"
        }),
        choice({
          text: "坚持冲刺，把陪伴交给他人与碎片时间。",
          effects: { age: 1, stats: { career: 2, stress: 5, happiness: -3 } },
          addFlags: ["parenting_absent_risk"],
          log: "你在会议室里也会突然走神，想起今天谁接孩子。"
        })
      ]
    }),
    /* ——— 意外事件（按年龄段分散，权重偏低） ——— */
    event({
      id: "accident_child_fever_rush",
      stage: "family",
      title: "突发：孩子夜里急热",
      text: "电话、挂号、请假三连击，你的人生像被临时改了日程表。",
      minAge: 24,
      maxAge: 50,
      weight: 4,
      repeatable: true,
      cooldownChoices: 8,
      tags: ["accident", "children"],
      conditions: condition({ minChildCount: 1 }),
      effectsOnEnter: mutation({ addTags: ["crisis"] }),
      choices: [
        choice({
          text: "全力处理，先把工作往后推。",
          effects: { age: 0, stats: { money: -4, career: -1, stress: 4 } },
          log: "你在医院走廊里回工作消息，觉得自己被撕成两半。"
        })
      ]
    }),
    event({
      id: "accident_layoff_shock",
      stage: "career",
      title: "结构性优化落到你头上",
      text: "通知来得很礼貌，后果很硬。你突然要重新解释自己是谁。",
      minAge: 28,
      maxAge: 55,
      weight: 3,
      repeatable: true,
      cooldownChoices: 12,
      tags: ["accident", "work"],
      conditions: condition({ excludedCareerRouteIds: ["career_in_job_search", "unemployed_drift_route", "further_study_route"] }),
      choices: [
        choice({
          text: "拿赔偿礼包，先稳住现金流再谋下一步。",
          effects: { age: 1, stats: { money: 6, stress: 10, career: -4, mental: -3 } },
          addFlags: ["laid_off_once", "career_in_job_search"],
          setCareerRoute: "career_in_job_search",
          log: "你走出门时，天还是那天，但身份少了一块。"
        })
      ]
    }),
    event({
      id: "accident_windfall_small",
      stage: "misc",
      title: "意外的一笔小钱",
      text: "退税、旧账追回、项目奖金或一次性的幸运——不足以改命，但足够让你松一口气。",
      minAge: 18,
      maxAge: 70,
      weight: 4,
      repeatable: true,
      cooldownChoices: 10,
      tags: ["accident", "money"],
      choices: [
        choice({
          text: "存起来，当缓冲。",
          effects: { age: 0, stats: { money: 5, happiness: 2, stress: -2 } },
          log: "你第一次觉得「多一点」也能改变呼吸。"
        })
      ]
    }),
    event({
      id: "accident_ill_young",
      stage: "school",
      title: "小时候的一场病",
      text: "发烧、输液、几天没去上学。身体提醒你还没那么硬。",
      minAge: 6,
      maxAge: 11,
      weight: 5,
      repeatable: true,
      cooldownChoices: 8,
      tags: ["accident", "health"],
      choices: [
        choice({
          text: "好好休养。",
          effects: { age: 0, stats: { health: -4, happiness: -1, familySupport: 1 } },
          log: "父母在床边忙前忙后，你第一次看见担心具体长什么样。"
        })
      ]
    }),
    event({
      id: "accident_school_teacher_favor",
      stage: "school",
      title: "老师突然多看了你一眼",
      text: "一次公开表扬、一次额外机会，让你在集体里短暂发光。",
      minAge: 7,
      maxAge: 11,
      weight: 4,
      repeatable: true,
      cooldownChoices: 9,
      tags: ["accident", "education"],
      choices: [
        choice({
          text: "接住机会，把自己推前一步。",
          effects: { age: 0, stats: { intelligence: 2, happiness: 3, social: 1 } },
          log: "你突然发现「被看见」会让人更想用点力。"
        })
      ]
    }),
    event({
      id: "accident_teen_fallout",
      stage: "adolescence",
      title: "运动或打闹中的意外受伤",
      text: "崴脚、磕破、短暂坐轮椅——青春不只有热血，也有石膏味。",
      minAge: 12,
      maxAge: 14,
      weight: 4,
      repeatable: true,
      cooldownChoices: 10,
      tags: ["accident", "health"],
      choices: [
        choice({
          text: "老实养伤，顺便把躁气压一压。",
          effects: { age: 0, stats: { health: -5, discipline: 2, stress: 2 } },
          log: "慢下来的几周，你反而听见了自己脑子里更吵的声音。"
        })
      ]
    }),
    event({
      id: "accident_college_contest_win",
      stage: "college",
      title: "比赛/课题意外拿奖",
      text: "你原本只是凑队，结果证书上印了你的名字。",
      minAge: 18,
      maxAge: 24,
      weight: 4,
      repeatable: true,
      cooldownChoices: 10,
      tags: ["accident", "education"],
      choices: [
        choice({
          text: "把奖当成下一步的门票。",
          effects: { age: 0, stats: { career: 3, happiness: 4, stress: 1 } },
          log: "你开始相信努力偶尔会被世界点名。"
        })
      ]
    }),
    event({
      id: "accident_college_scam_loss",
      stage: "college",
      title: "一次轻信带来的损失",
      text: "兼职、刷单、培训贷——年轻人第一次被社会上课，往往不贵也不便宜。",
      minAge: 17,
      maxAge: 26,
      weight: 3,
      repeatable: true,
      cooldownChoices: 12,
      tags: ["accident", "money"],
      choices: [
        choice({
          text: "咬牙认栽，把教训写进心里。",
          effects: { age: 0, stats: { money: -8, mental: -3, stress: 5 } },
          log: "你后来每一次转账都会多停三秒。"
        })
      ]
    }),
    event({
      id: "accident_adult_theft",
      stage: "young_adult",
      title: "丢手机 / 被摸包",
      text: "报警、挂失、补卡，一整天都在证明「我还是我」。",
      minAge: 20,
      maxAge: 60,
      weight: 3,
      repeatable: true,
      cooldownChoices: 12,
      tags: ["accident", "money"],
      choices: [
        choice({
          text: "收拾残局，继续走。",
          effects: { age: 0, stats: { money: -6, stress: 4, mental: -2 } },
          log: "城市很大，恶意很小，但很疼。"
        })
      ]
    }),
    event({
      id: "accident_family_row",
      stage: "family",
      title: "家里突然吵翻天",
      text: "钱、老人、房子、谁付出更多——旧账新账一起翻。",
      minAge: 14,
      maxAge: 65,
      weight: 5,
      repeatable: true,
      cooldownChoices: 8,
      tags: ["accident", "family"],
      choices: [
        choice({
          text: "试图调解，把自己也卷进去。",
          effects: { age: 0, stats: { stress: 6, familySupport: -2, mental: -2 } },
          log: "你发现亲情不是永远温柔，有时更像共同体债务。"
        }),
        choice({
          text: "躲开现场，保一点自己的边界。",
          effects: { age: 0, stats: { stress: 3, familySupport: -3, mental: 1 } },
          log: "你走开后仍听见心跳很快。"
        })
      ]
    }),
    event({
      id: "accident_lottery_tiny",
      stage: "misc",
      title: "一张奇怪的好运",
      text: "彩票、抽奖、活动红包——像玩笑一样落在你手里，却让你笑出来。",
      minAge: 10,
      maxAge: 80,
      weight: 2,
      repeatable: true,
      cooldownChoices: 18,
      tags: ["accident", "money"],
      choices: [
        choice({
          text: "收下这份小运气。",
          effects: { age: 0, stats: { money: 12, happiness: 5 } },
          log: "你把它当成宇宙给你的小补丁。"
        })
      ]
    }),
    event({
      id: "accident_missed_chance",
      stage: "career",
      title: "错过一次关键机会",
      text: "等你回复邮件时，岗位已经关了；等你鼓起勇气时，窗口已经换了规则。",
      minAge: 22,
      maxAge: 55,
      weight: 4,
      repeatable: true,
      cooldownChoices: 10,
      tags: ["accident", "work"],
      choices: [
        choice({
          text: "承认遗憾，重新找战场。",
          effects: { age: 0, stats: { stress: 5, career: -2, mental: 1 } },
          log: "你学会把「来不及」也当成一种常态。"
        })
      ]
    }),
    event({
      id: "accident_promotion_opening",
      stage: "career",
      title: "突然出现的晋升窗口",
      text: "老板把你叫进会议室，语气像在试探你也像在押注。",
      minAge: 26,
      maxAge: 55,
      weight: 3,
      repeatable: true,
      cooldownChoices: 12,
      tags: ["accident", "work"],
      conditions: condition({ excludedCareerRouteIds: ["career_in_job_search"] }),
      choices: [
        choice({
          text: "接下锅，扛住更重的指标。",
          effects: { age: 1, stats: { career: 6, stress: 6, money: 4, health: -2 } },
          log: "你往上走了一步，也默认接受了更锋利的期待。"
        })
      ]
    }),
    event({
      id: "accident_romance_misread",
      stage: "family",
      title: "误会像玻璃碴",
      text: "一句话没说完，手机亮了一下，眼神偏了一次——关系里最小的裂缝也能割人。",
      minAge: 16,
      maxAge: 45,
      weight: 4,
      repeatable: true,
      cooldownChoices: 9,
      tags: ["accident", "romance"],
      choices: [
        choice({
          text: "把话摊开。",
          effects: { age: 0, stats: { stress: 2, happiness: 1 } },
          log: "难听的真话，有时比漂亮的沉默更养人。"
        }),
        choice({
          text: "冷着，各自猜。",
          effects: { age: 0, stats: { stress: 5, mental: -2 } },
          log: "你们在同一个房间里，把距离拉成海峡。"
        })
      ]
    }),
    event({
      id: "accident_travel_mishap",
      stage: "young_adult",
      title: "旅途中的狼狈",
      text: "延误、丢行李、订错房——旅行教你谦卑。",
      minAge: 18,
      maxAge: 70,
      weight: 3,
      repeatable: true,
      cooldownChoices: 12,
      tags: ["accident", "money"],
      choices: [
        choice({
          text: "花钱摆平，继续行程。",
          effects: { age: 0, stats: { money: -5, stress: 3 } },
          log: "你用现金买回一点秩序。"
        })
      ]
    }),
    event({
      id: "accident_elder_emergency",
      stage: "midlife",
      title: "家里长辈突然出事",
      text: "电话那头的语气让你立刻明白：有些责任不会等你准备好。",
      minAge: 30,
      maxAge: 70,
      weight: 4,
      repeatable: true,
      cooldownChoices: 10,
      tags: ["accident", "family"],
      choices: [
        choice({
          text: "立刻回去/请假处理。",
          effects: { age: 1, stats: { money: -8, stress: 8, familySupport: 4, career: -2 } },
          log: "你在医院走廊里同时看见衰老与爱。"
        })
      ]
    })
  ];

  window.LIFE_EXTRA_EVENTS = [...(Array.isArray(window.LIFE_EXTRA_EVENTS) ? window.LIFE_EXTRA_EVENTS : []), ...extra];
})();

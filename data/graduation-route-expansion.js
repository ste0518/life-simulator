/**
 * 毕业后五条主路线的专属事件池（与 route-events「毕业之后」选项对应）。
 * 手动改路线：改 window.LIFE_GRADUATION_ROUTE_CONFIG.branches 与下方各事件的 careerRouteIds / requiredFlags。
 */
(function () {
  "use strict";

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
    return {
      text: typeof source.text === "string" ? source.text : "继续",
      effects: normalized.effects,
      addFlags: normalized.addFlags,
      removeFlags: normalized.removeFlags,
      addTags: normalized.addTags,
      removeTags: normalized.removeTags,
      addRomanceFlags: toList(source.addRomanceFlags),
      removeRomanceFlags: toList(source.removeRomanceFlags),
      log: normalized.log,
      conditions: condition(source.conditions || {}),
      customAction: typeof source.customAction === "string" ? source.customAction : "",
      customPayload: source.customPayload && typeof source.customPayload === "object" ? { ...source.customPayload } : null,
      next: Object.prototype.hasOwnProperty.call(source, "next") ? source.next : undefined,
      setCareerRoute: Object.prototype.hasOwnProperty.call(source, "setCareerRoute") ? source.setCareerRoute : undefined,
      relationshipEffects: Array.isArray(source.relationshipEffects) ? source.relationshipEffects : undefined
    };
  }

  function event(value) {
    const source = value && typeof value === "object" ? value : {};
    return {
      id: typeof source.id === "string" ? source.id : "",
      stage: typeof source.stage === "string" ? source.stage : "young_adult",
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

  /** 与「毕业之后」五个选项对应的 careerRouteId；选项上还可挂 addFlags 做更细条件 */
  window.LIFE_GRADUATION_ROUTE_CONFIG = {
    branches: [
      { routeId: "career_in_job_search", label: "进入就业市场", narrativeTag: "postgrad_job_pool" },
      { routeId: "further_study_route", label: "继续深造", narrativeTag: "postgrad_study_pool" },
      { routeId: "career_gap_year_after_degree", label: "暂缓工作/空白期", narrativeTag: "postgrad_gap_pool" },
      { routeId: "career_family_supported_home", label: "回家/家庭支持", narrativeTag: "postgrad_home_pool" },
      { routeId: "unemployed_drift_route", label: "迷茫/未命名状态", narrativeTag: "postgrad_drift_pool" }
    ],
    /** 下列路线在「已入职叙事」类事件里应排除，避免与专属线重复 */
    excludeFromGenericEmployedYoungAdult: [
      "career_in_job_search",
      "further_study_route",
      "career_gap_year_after_degree",
      "career_family_supported_home",
      "unemployed_drift_route"
    ]
  };

  const EXCL_GENERIC = window.LIFE_GRADUATION_ROUTE_CONFIG.excludeFromGenericEmployedYoungAdult;

  const gradPool = [
    /* ——— 就业市场：求职链 ——— */
    event({
      id: "postgrad_job_resume_machine",
      stage: "young_adult",
      title: "简历与海投：把自尊折成 PDF",
      text: "同一份项目经历被改成七种表述，投递记录像账单一样滚动。你知道这是游戏的一部分，但每次「已读不回」仍会在胃里沉一下。",
      minAge: 22,
      maxAge: 32,
      weight: 16,
      repeatable: true,
      cooldownChoices: 2,
      tags: ["career", "work", "postgrad_branch_job"],
      conditions: condition({ careerRouteIds: ["career_in_job_search"] }),
      effectsOnEnter: mutation({ log: "招聘软件把你的时间切成一段段等待。" }),
      choices: [
        choice({
          text: "继续硬投热门岗，把拒绝当样本量。",
          effects: { age: 1, stats: { stress: 3, career: 2, mental: -1 } },
          addFlags: ["job_hunt_grind_mode"],
          log: "你把情绪调成静音，只留下「下一封」的按钮。"
        }),
        choice({
          text: "改投更现实的中小平台，先换回音率。",
          effects: { age: 1, stats: { stress: 1, career: 1, happiness: 1 } },
          log: "你把「体面」往后挪了一位，把「落地」挪到前面。"
        }),
        choice({
          text: "停两天改作品与作品集，暂缓海投。",
          effects: { age: 1, stats: { mental: 2, discipline: 2, stress: -1 } },
          log: "你允许自己从流水线上下来一会儿，把材料改成更像你的版本。"
        })
      ]
    }),
    event({
      id: "postgrad_job_written_exam_day",
      stage: "young_adult",
      title: "笔试日：机房、行测与倒计时的蜂鸣",
      text: "屏幕上的题目和教室里的空调一样冷。你突然理解，所谓「能力」很多时候是被标准化后的剩余物。",
      minAge: 22,
      maxAge: 35,
      weight: 14,
      repeatable: true,
      cooldownChoices: 3,
      tags: ["career", "work", "postgrad_branch_job"],
      conditions: condition({ careerRouteIds: ["career_in_job_search"] }),
      choices: [
        choice({
          text: "硬扛到底，把能写的全写上。",
          effects: { age: 1, stats: { intelligence: 2, stress: 4, health: -2 } },
          log: "你在交卷前手指发麻，但至少没有提前放弃。"
        }),
        choice({
          text: "考完立刻复盘，调整下一轮目标。",
          effects: { age: 1, stats: { discipline: 3, stress: 2, career: 1 } },
          log: "你把失败也当成数据，而不是判决书。"
        })
      ]
    }),
    event({
      id: "postgrad_job_interview_panel",
      stage: "young_adult",
      title: "面试间：礼貌的审视像灯打在脸上",
      text: "自我介绍说到第三遍时，你会分不清哪一句更像真的自己。对方点头并不代表认可，只是流程。",
      minAge: 22,
      maxAge: 35,
      weight: 15,
      repeatable: true,
      cooldownChoices: 3,
      tags: ["career", "work", "postgrad_branch_job"],
      conditions: condition({ careerRouteIds: ["career_in_job_search"] }),
      choices: [
        choice({
          text: "把话术练到不心虚，先换 offer 再谈真诚。",
          effects: { age: 1, stats: { social: 2, stress: 3, career: 2 } },
          log: "你学会了在十分钟里交付一个「可用」的自己。"
        }),
        choice({
          text: "故意留一点真实破绽，赌遇到识货的人。",
          effects: { age: 1, stats: { mental: 1, stress: 2, happiness: 1 } },
          log: "你不想把自己抛光成完全陌生的产品。"
        })
      ]
    }),
    event({
      id: "postgrad_job_silence_after_interview",
      stage: "young_adult",
      title: "面试后的沉默：像悬在半空的台阶",
      text: "他们说「一周内给答复」。你刷新邮箱的次数比吃饭还规律。等待会把人变薄。",
      minAge: 22,
      maxAge: 35,
      weight: 14,
      repeatable: true,
      cooldownChoices: 2,
      tags: ["career", "work", "postgrad_branch_job"],
      conditions: condition({ careerRouteIds: ["career_in_job_search"] }),
      choices: [
        choice({
          text: "继续并行投别的，不把希望押在一扇门上。",
          effects: { age: 1, stats: { stress: 2, discipline: 2, career: 1 } },
          log: "你用数量对抗不确定性，虽然更累。"
        }),
        choice({
          text: "找朋友吃饭吐槽，把焦虑泄一点出去。",
          effects: { age: 1, stats: { mental: 2, social: 2, stress: -1 } },
          log: "笑声盖不住全部，但至少让你睡得好一点。"
        })
      ]
    }),

    /* ——— 深造链 ——— */
    event({
      id: "postgrad_study_kaoyan_calendar",
      stage: "young_adult",
      title: "备考日历：把一年切成章节",
      text: "时间表贴满墙，娱乐像偷来的。你知道这是延迟满足，但延迟太久会像永远到不了岸。",
      minAge: 22,
      maxAge: 30,
      weight: 16,
      repeatable: true,
      cooldownChoices: 2,
      tags: ["education", "pressure", "postgrad_branch_study"],
      conditions: condition({ careerRouteIds: ["further_study_route"] }),
      choices: [
        choice({
          text: "加量刷题，用疲惫换确定感。",
          effects: { age: 1, stats: { intelligence: 3, stress: 5, health: -3, money: -2 } },
          addFlags: ["exam_grind_deep"],
          log: "你把身体也押进日程表里。"
        }),
        choice({
          text: "保留固定休息，不让效率被愧疚拖垮。",
          effects: { age: 1, stats: { intelligence: 2, mental: 2, discipline: 2, stress: 2 } },
          log: "你试着把长跑当成策略，而不是自虐。"
        })
      ]
    }),
    event({
      id: "postgrad_study_second_degree_choice",
      stage: "young_adult",
      title: "第二学位 / 交叉路径：多读一年换一张门票",
      text: "有人劝你「别读了」，也有人劝你「再押一年」。账单和年龄都会说话。",
      minAge: 22,
      maxAge: 30,
      weight: 13,
      repeatable: true,
      cooldownChoices: 4,
      tags: ["education", "postgrad_branch_study"],
      conditions: condition({ careerRouteIds: ["further_study_route"] }),
      choices: [
        choice({
          text: "继续把学分读满，赌长期回报。",
          effects: { age: 1, stats: { intelligence: 4, career: 3, money: -4, stress: 3 } },
          log: "你把就业再往后推了一格，也推高了期待与成本。"
        }),
        choice({
          text: "改走更短的职业证书路线，尽快变现。",
          effects: { age: 1, stats: { career: 2, money: -2, stress: 2, happiness: 1 } },
          log: "你承认自己想要更快看见反馈。"
        })
      ]
    }),
    event({
      id: "postgrad_study_abroad_or_domestic_fork",
      stage: "young_adult",
      title: "国内卷研还是出国：账本先开口",
      text: "汇率、房租、奖学金与「留下或回去」一起堆在桌上。选哪条路都像在签一份长期合同。",
      minAge: 22,
      maxAge: 29,
      weight: 12,
      repeatable: true,
      cooldownChoices: 5,
      tags: ["education", "postgrad_branch_study"],
      conditions: condition({ careerRouteIds: ["further_study_route"] }),
      choices: [
        choice({
          text: "押国内升学，把生活半径留在熟悉语言里。",
          effects: { age: 1, stats: { stress: 4, familySupport: 1, money: -3, intelligence: 2 } },
          addFlags: ["domestic_advanced_track"],
          log: "你选择离家的距离小一点，竞争密度大一点。"
        }),
        choice({
          text: "准备出国材料与语言考试，把人生调到硬模式。",
          effects: { age: 1, stats: { stress: 5, social: 2, money: -5, career: 2 } },
          addFlags: ["abroad_prep_active"],
          log: "你开始同时应付现实题与外语题。"
        })
      ]
    }),
    event({
      id: "postgrad_study_lab_crush",
      stage: "young_adult",
      title: "课题组里的心动：同门与边界",
      text: "熬夜与数据把人与人拉近了。你会怀疑这是陪伴还是依赖，是喜欢还是只是同步焦虑。",
      minAge: 22,
      maxAge: 30,
      weight: 11,
      repeatable: true,
      cooldownChoices: 4,
      tags: ["romance", "education", "postgrad_branch_study"],
      conditions: condition({ careerRouteIds: ["further_study_route"] }),
      choices: [
        choice({
          text: "把线划清楚：感情不搅进论文与署名。",
          effects: { age: 1, stats: { mental: 2, discipline: 2, happiness: -1 } },
          log: "你很想要亲密，但更怕失控。"
        }),
        choice({
          text: "试着走近一点，赌两个人能扛住压力。",
          effects: { age: 1, stats: { happiness: 4, stress: 2, social: 2 } },
          addRomanceFlags: ["campus_late_night_bond"],
          log: "你们在走廊的咖啡味里交换过几次真心话。"
        })
      ]
    }),

    /* ——— 暂缓工作 / 空白 ——— */
    event({
      id: "postgrad_gap_slow_travel",
      stage: "young_adult",
      title: "慢启动：把地图摊开，也把钱包摊开",
      text: "旅行、短住、试错——听起来像自由，但银行卡会先教你什么叫边界。",
      minAge: 22,
      maxAge: 32,
      weight: 15,
      repeatable: true,
      cooldownChoices: 3,
      tags: ["selfhood", "postgrad_branch_gap"],
      conditions: condition({ careerRouteIds: ["career_gap_year_after_degree"] }),
      choices: [
        choice({
          text: "省着走，用青旅与慢车换呼吸感。",
          effects: { age: 1, stats: { happiness: 3, money: -3, stress: -1, mental: 2 } },
          log: "你学会在便宜里找宽阔。"
        }),
        choice({
          text: "冲动订一次贵一点的行程，当作对自己的补偿。",
          effects: { age: 1, stats: { happiness: 5, money: -7, stress: 2 } },
          log: "快乐真实，账单也真实。"
        })
      ]
    }),
    event({
      id: "postgrad_gap_peer_speed_anxiety",
      stage: "young_adult",
      title: "朋友圈里的「都已入职」",
      text: "社交媒体像一场无声的排位赛。你告诉自己不在乎，但手指还是会划回去再看一眼。",
      minAge: 22,
      maxAge: 32,
      weight: 16,
      repeatable: true,
      cooldownChoices: 2,
      tags: ["pressure", "postgrad_branch_gap"],
      conditions: condition({ careerRouteIds: ["career_gap_year_after_degree"] }),
      choices: [
        choice({
          text: "屏蔽一批动态，先把比较源掐断。",
          effects: { age: 1, stats: { mental: 2, stress: -2, social: -1 } },
          log: "你不是逃避世界，只是先保住自己的节奏。"
        }),
        choice({
          text: "硬看下去，把刺痛当燃料。",
          effects: { age: 1, stats: { stress: 5, career: 2, mental: -3 } },
          log: "你逼自己承认落后感，也逼自己别躺平。"
        })
      ]
    }),
    event({
      id: "postgrad_gap_trial_job",
      stage: "young_adult",
      title: "短期试水：零工、实习与不确定的日薪",
      text: "你不想立刻签长期卖身契，于是用短合同试探市场。钱不多，但让你重新摸到「被需要」的温度。",
      minAge: 22,
      maxAge: 32,
      weight: 14,
      repeatable: true,
      cooldownChoices: 3,
      tags: ["work", "postgrad_branch_gap"],
      conditions: condition({ careerRouteIds: ["career_gap_year_after_degree"] }),
      choices: [
        choice({
          text: "多接几份碎活，先把现金流续上。",
          effects: { age: 1, stats: { money: 2, career: 1, stress: 3, health: -2 } },
          log: "你把日子切成按日结算的小块。"
        }),
        choice({
          text: "只做与兴趣沾边的试岗，宁少勿滥。",
          effects: { age: 1, stats: { career: 2, happiness: 2, money: -1, stress: 2 } },
          log: "你保护的是方向感，不是银行卡数字。"
        })
      ]
    }),
    event({
      id: "postgrad_gap_self_doubt_night",
      stage: "young_adult",
      title: "空白期的夜里：自我怀疑来得比闹钟准",
      text: "你会反复问：是不是在浪费窗口期？答案不会天亮就出现。",
      minAge: 22,
      maxAge: 32,
      weight: 14,
      repeatable: true,
      cooldownChoices: 3,
      tags: ["mental", "postgrad_branch_gap"],
      conditions: condition({ careerRouteIds: ["career_gap_year_after_degree"] }),
      choices: [
        choice({
          text: "写下来：三个月内要完成的最低限度动作。",
          effects: { age: 1, stats: { discipline: 3, mental: 2, stress: -1 } },
          log: "你把虚无感钉在纸上，至少有了抓手。"
        }),
        choice({
          text: "放任一夜，第二天再把自己捞起来。",
          effects: { age: 1, stats: { mental: -2, stress: 2, happiness: 1 } },
          log: "崩溃不体面，但也不必被审判。"
        })
      ]
    }),

    /* ——— 回家 / 家庭支持 ——— */
    event({
      id: "postgrad_home_dinner_interrogation",
      stage: "young_adult",
      title: "餐桌审讯：工作找得怎样了",
      text: "菜是热的，话是凉的。你知道他们担心，但担心说出口常常像催促。",
      minAge: 22,
      maxAge: 35,
      weight: 16,
      repeatable: true,
      cooldownChoices: 2,
      tags: ["family", "postgrad_branch_home"],
      conditions: condition({ careerRouteIds: ["career_family_supported_home"] }),
      choices: [
        choice({
          text: "摊牌自己的节奏，争取把边界谈出来。",
          effects: { age: 1, stats: { familySupport: -1, mental: 2, stress: 2 } },
          log: "谈完不一定愉快，但至少不是假装没事。"
        }),
        choice({
          text: "先敷衍过去，避免在饭桌上爆炸。",
          effects: { age: 1, stats: { stress: 3, mental: -2, familySupport: 1 } },
          log: "和平的代价是把你真实的难又咽回去一截。"
        })
      ]
    }),
    event({
      id: "postgrad_home_low_cost_routine",
      stage: "young_adult",
      title: "低成本生活：屋檐省下房租，也省下解释",
      text: "家里的饭、旧房间、熟悉的街——花钱变少，心理账户却更复杂。",
      minAge: 22,
      maxAge: 35,
      weight: 14,
      repeatable: true,
      cooldownChoices: 3,
      tags: ["family", "stability", "postgrad_branch_home"],
      conditions: condition({ careerRouteIds: ["career_family_supported_home"] }),
      choices: [
        choice({
          text: "主动承担家务与杂费，换一点理直气壮。",
          effects: { age: 1, stats: { familySupport: 2, stress: 1, money: -1, discipline: 2 } },
          log: "你用行动告诉父母：这不是白住。"
        }),
        choice({
          text: "尽量减少开销，把钱攒成下一步的启动金。",
          effects: { age: 1, stats: { money: 3, happiness: -1, stress: 2 } },
          log: "数字往上走时，自尊也会好谈一点。"
        })
      ]
    }),
    event({
      id: "postgrad_home_relationship_renegotiation",
      stage: "young_adult",
      title: "与父母的关系：从供养到谈判",
      text: "他们给你房间，也给你期待。你要学的是如何把感谢和拒绝放在同一张桌上。",
      minAge: 22,
      maxAge: 35,
      weight: 13,
      repeatable: true,
      cooldownChoices: 4,
      tags: ["family", "postgrad_branch_home"],
      conditions: condition({ careerRouteIds: ["career_family_supported_home"] }),
      choices: [
        choice({
          text: "约定时间表：何时搬出、何时汇报进展。",
          effects: { age: 1, stats: { discipline: 3, familySupport: 2, stress: -1 } },
          log: "规则清楚后，爱反而没那么刺。"
        }),
        choice({
          text: "先拖着，内心知道这不是长久之计。",
          effects: { age: 1, stats: { stress: 4, mental: -2, happiness: -1 } },
          log: "拖延让你暂时安全，也让不确定继续长大。"
        })
      ]
    }),
    event({
      id: "postgrad_home_replan_city",
      stage: "young_adult",
      title: "重新规划：要不要再次离开家",
      text: "你看见过外面的难，也看见过家里的紧。重新出发不是背叛，但有时会被说成不懂事。",
      minAge: 22,
      maxAge: 35,
      weight: 12,
      repeatable: true,
      cooldownChoices: 5,
      tags: ["life", "postgrad_branch_home"],
      conditions: condition({ careerRouteIds: ["career_family_supported_home"] }),
      choices: [
        choice({
          text: "准备搬出去，哪怕先租小一点的房。",
          effects: { age: 1, stats: { stress: 3, mental: 2, money: -4, career: 1 } },
          removeFlags: ["living_at_parents_after_school"],
          log: "你用距离买回一部分自主权。"
        }),
        choice({
          text: "再住一阵，把下一张牌攒稳。",
          effects: { age: 1, stats: { familySupport: 1, stress: 2, happiness: 1 } },
          log: "你选择用时间换把握，而不是用冲动换后悔。"
        })
      ]
    }),

    /* ——— 迷茫 / 漂移 ——— */
    event({
      id: "postgrad_drift_gig_scroll",
      stage: "young_adult",
      title: "临时工单：在碎片里找存在感",
      text: "日结、跑腿、代课、群里的急单——你像在不断切换窗口，却很难拼出一张完整履历。",
      minAge: 22,
      maxAge: 35,
      weight: 16,
      repeatable: true,
      cooldownChoices: 2,
      tags: ["work", "pressure", "postgrad_branch_drift"],
      conditions: condition({ careerRouteIds: ["unemployed_drift_route"] }),
      choices: [
        choice({
          text: "有活就干，先把下个月的洞补上。",
          effects: { age: 1, stats: { money: 1, stress: 4, career: 1, health: -2 } },
          log: "你把羞耻感调低，把生存调高。"
        }),
        choice({
          text: "拒掉太碎的活，宁可少赚一点也要留思考空档。",
          effects: { age: 1, stats: { money: -2, mental: 2, stress: 3, career: -1 } },
          log: "你在穷和空之间做艰难取舍。"
        })
      ]
    }),
    event({
      id: "postgrad_drift_procrastination_spiral",
      stage: "young_adult",
      title: "拖延螺旋：越拖越怕，越怕越拖",
      text: "你知道该改简历、该出门、该打电话。但身体像被灌了铅。拖延不只是懒，有时是恐惧换了形。",
      minAge: 22,
      maxAge: 35,
      weight: 15,
      repeatable: true,
      cooldownChoices: 2,
      tags: ["mental", "postgrad_branch_drift"],
      conditions: condition({ careerRouteIds: ["unemployed_drift_route"] }),
      choices: [
        choice({
          text: "把任务切成 10 分钟块，骗自己先启动。",
          effects: { age: 1, stats: { discipline: 2, mental: 1, stress: -1 } },
          log: "启动最难，但一旦动起来，羞耻会退一点。"
        }),
        choice({
          text: "继续躲，代价是账单与自责一起涨。",
          effects: { age: 1, stats: { mental: -4, stress: 5, money: -3 } },
          log: "逃避的利息往往比你想的高。"
        })
      ]
    }),
    event({
      id: "postgrad_drift_money_bleed",
      stage: "young_adult",
      title: "看不见的消费：把焦虑刷成订单",
      text: "小额支出像漏水。你后来才看懂，那不只是买东西，是在买一点点控制感。",
      minAge: 22,
      maxAge: 35,
      weight: 14,
      repeatable: true,
      cooldownChoices: 3,
      tags: ["money", "postgrad_branch_drift"],
      conditions: condition({ careerRouteIds: ["unemployed_drift_route"] }),
      choices: [
        choice({
          text: "停掉自动扣费，把账本摊开面对。",
          effects: { age: 1, stats: { discipline: 3, stress: 2, happiness: 1 } },
          log: "疼一下，比一直麻着好。"
        }),
        choice({
          text: "继续用消费填洞，直到数字逼你抬头。",
          effects: { age: 1, stats: { happiness: 2, money: -5, stress: 3, mental: -2 } },
          log: "爽感很短，尾款很长。"
        })
      ]
    }),
    event({
      id: "postgrad_drift_direction_fog",
      stage: "young_adult",
      title: "方向感像雾：今天想的明天就不算数",
      text: "你试过很多念头，每个都浅尝辄止。你知道问题在哪，却像站在转盘中央。",
      minAge: 22,
      maxAge: 35,
      weight: 13,
      repeatable: true,
      cooldownChoices: 4,
      tags: ["selfhood", "postgrad_branch_drift"],
      conditions: condition({ careerRouteIds: ["unemployed_drift_route"] }),
      choices: [
        choice({
          text: "找一个人把话说透：朋友、前辈或咨询师。",
          effects: { age: 1, stats: { social: 2, mental: 2, stress: -2 } },
          log: "叙述本身会把雾拨开一条缝。"
        }),
        choice({
          text: "继续自己闷想，害怕被人看穿空白。",
          effects: { age: 1, stats: { mental: -3, stress: 4 } },
          log: "孤独保护你，也困住你。"
        })
      ]
    })
  ];

  window.LIFE_EXTRA_EVENTS = [...(Array.isArray(window.LIFE_EXTRA_EVENTS) ? window.LIFE_EXTRA_EVENTS : []), ...gradPool];

  /** 供引擎/事件引用：与 LIFE_GRADUATION_ROUTE_CONFIG.excludeFromGenericEmployedYoungAdult 同步 */
  window.LIFE_POSTGRAD_GENERIC_EXCLUDED_CAREER_IDS = EXCL_GENERIC;
})();

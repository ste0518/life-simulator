(function () {
  "use strict";

  function toList(value) {
    return Array.isArray(value) ? value.slice() : [];
  }

  function toStats(value) {
    return value && typeof value === "object" ? { ...value } : {};
  }

  function toObject(value) {
    return value && typeof value === "object" ? { ...value } : {};
  }

  function condition(value) {
    const source = value && typeof value === "object" ? value : {};

    return {
      minAge: typeof source.minAge === "number" ? source.minAge : null,
      maxAge: typeof source.maxAge === "number" ? source.maxAge : null,
      minChoices: typeof source.minChoices === "number" ? source.minChoices : null,
      maxChoices: typeof source.maxChoices === "number" ? source.maxChoices : null,
      minStats: toStats(source.minStats),
      maxStats: toStats(source.maxStats),
      requiredFlags: toList(source.requiredFlags),
      excludedFlags: toList(source.excludedFlags),
      requiredTags: toList(source.requiredTags),
      excludedTags: toList(source.excludedTags),
      requiredRomanceFlags: toList(source.requiredRomanceFlags),
      excludedRomanceFlags: toList(source.excludedRomanceFlags),
      someFlags: toList(source.someFlags),
      visited: toList(source.visited),
      notVisited: toList(source.notVisited),
      knownRelationships: toList(source.knownRelationships),
      unknownRelationships: toList(source.unknownRelationships),
      activeRelationshipIds: toList(source.activeRelationshipIds),
      activeRelationshipStatuses: toList(source.activeRelationshipStatuses),
      anyRelationshipStatuses: toList(source.anyRelationshipStatuses),
      relationshipStatuses: toObject(source.relationshipStatuses),
      excludedRelationshipStatuses: toObject(source.excludedRelationshipStatuses),
      requiredRelationshipFlags: toObject(source.requiredRelationshipFlags),
      excludedRelationshipFlags: toObject(source.excludedRelationshipFlags),
      requiredSharedHistory: toObject(source.requiredSharedHistory),
      excludedSharedHistory: toObject(source.excludedSharedHistory),
      minAffection: toObject(source.minAffection),
      maxAffection: toObject(source.maxAffection),
      minFamiliarity: toObject(source.minFamiliarity),
      minTrust: toObject(source.minTrust),
      minAmbiguity: toObject(source.minAmbiguity),
      minPlayerInterest: toObject(source.minPlayerInterest),
      minTheirInterest: toObject(source.minTheirInterest),
      maxTension: toObject(source.maxTension),
      minCommitment: toObject(source.minCommitment),
      minContinuity: toObject(source.minContinuity),
      minInteractionCount: toObject(source.minInteractionCount),
      familyBackgroundIds: toList(source.familyBackgroundIds),
      excludedFamilyBackgroundIds: toList(source.excludedFamilyBackgroundIds),
      educationRouteIds: toList(source.educationRouteIds),
      excludedEducationRouteIds: toList(source.excludedEducationRouteIds),
      careerRouteIds: toList(source.careerRouteIds),
      excludedCareerRouteIds: toList(source.excludedCareerRouteIds),
      anyRelationshipMinAffection:
        typeof source.anyRelationshipMinAffection === "number" ? source.anyRelationshipMinAffection : null,
      activeRelationshipMinAffection:
        typeof source.activeRelationshipMinAffection === "number" ? source.activeRelationshipMinAffection : null,
      activeRelationshipMaxAffection:
        typeof source.activeRelationshipMaxAffection === "number" ? source.activeRelationshipMaxAffection : null,
      requiredActiveRelationshipFlags: toList(source.requiredActiveRelationshipFlags),
      excludedActiveRelationshipFlags: toList(source.excludedActiveRelationshipFlags),
      activeRelationshipRequiredSharedHistory: toList(source.activeRelationshipRequiredSharedHistory),
      activeRelationshipExcludedSharedHistory: toList(source.activeRelationshipExcludedSharedHistory),
      noCurrentPartner: Boolean(source.noCurrentPartner)
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
      addRomanceFlags: toList(source.addRomanceFlags),
      removeRomanceFlags: toList(source.removeRomanceFlags),
      relationshipEffects: toList(source.relationshipEffects),
      setActiveRelationship: typeof source.setActiveRelationship === "string" ? source.setActiveRelationship : null,
      clearActiveRelationship: Boolean(source.clearActiveRelationship),
      setEducationRoute: typeof source.setEducationRoute === "string" ? source.setEducationRoute : null,
      setCareerRoute: typeof source.setCareerRoute === "string" ? source.setCareerRoute : null,
      customAction: typeof source.customAction === "string" ? source.customAction : "",
      customPayload: toObject(source.customPayload),
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
      addRomanceFlags: normalized.addRomanceFlags,
      removeRomanceFlags: normalized.removeRomanceFlags,
      relationshipEffects: normalized.relationshipEffects,
      setActiveRelationship: normalized.setActiveRelationship,
      clearActiveRelationship: normalized.clearActiveRelationship,
      setEducationRoute: normalized.setEducationRoute,
      setCareerRoute: normalized.setCareerRoute,
      customAction: normalized.customAction,
      customPayload: normalized.customPayload,
      log: normalized.log,
      conditions: condition(source.conditions),
      next: Object.prototype.hasOwnProperty.call(source, "next") ? source.next : undefined
    };
  }

  function event(value) {
    const source = value && typeof value === "object" ? value : {};

    return {
      id: typeof source.id === "string" ? source.id : "",
      stage: typeof source.stage === "string" ? source.stage : "misc",
      title: typeof source.title === "string" ? source.title : "未命名事件",
      text: typeof source.text === "string" ? source.text : "",
      minAge: typeof source.minAge === "number" ? source.minAge : null,
      maxAge: typeof source.maxAge === "number" ? source.maxAge : null,
      weight: typeof source.weight === "number" ? source.weight : 1,
      repeatable: Boolean(source.repeatable),
      maxVisits: typeof source.maxVisits === "number" ? source.maxVisits : undefined,
      cooldownChoices: typeof source.cooldownChoices === "number" ? source.cooldownChoices : undefined,
      tags: toList(source.tags),
      conditions: condition(source.conditions),
      effectsOnEnter: mutation(source.effectsOnEnter),
      choices: Array.isArray(source.choices) ? source.choices.map(choice) : []
    };
  }

  function route(value) {
    const source = value && typeof value === "object" ? value : {};
    return {
      id: typeof source.id === "string" ? source.id : "",
      name: typeof source.name === "string" ? source.name : "未命名路线",
      category: typeof source.category === "string" ? source.category : "",
      summary: typeof source.summary === "string" ? source.summary : "",
      description: typeof source.description === "string" ? source.description : "",
      optionText: typeof source.optionText === "string" ? source.optionText : "",
      details: toList(source.details),
      meta: toObject(source.meta),
      conditions: condition(source.conditions),
      apply: mutation(source.apply)
    };
  }

  window.LIFE_GAOKAO_CONFIG = {
    totalScore: 750,
    baseScore: {
      minimum: 285,
      maximum: 660,
      statWeights: {
        intelligence: 0.54,
        discipline: 0.16,
        mental: 0.08,
        health: 0.06,
        familySupport: 0.04,
        social: 0.02,
        stressResistance: 0.1
      }
    },
    regionSelection: {
      defaultRegionId: "jiangnan",
      weightedRegions: [
        {
          id: "jiangnan",
          weight: 3,
          modifiers: [
            { conditions: { someFlags: ["resource_rich_home", "upward_mobility_home"] }, add: 2 }
          ]
        },
        {
          id: "beifang",
          weight: 2,
          modifiers: [
            { conditions: { someFlags: ["family_expectation_high", "structured_growth"] }, add: 2 }
          ]
        },
        {
          id: "xinan",
          weight: 2,
          modifiers: [
            { conditions: { someFlags: ["financial_tight_home", "migrant_home", "caregiver_role"] }, add: 2 }
          ]
        }
      ]
    },
    trajectoryBonuses: [
      { conditions: { someFlags: ["mentor_support", "resilient_under_pressure"] }, add: 16 },
      { conditions: { someFlags: ["study_system_built", "structured_growth"] }, add: 12 },
      { conditions: { someFlags: ["exam_anxiety", "emotional_shutdown"] }, add: -14 },
      { conditions: { someFlags: ["caregiver_role", "burnout_seed"] }, add: -10 }
    ],
    performanceProfiles: {
      normal: {
        probability: 0.6,
        label: "正常发挥",
        offsetRange: [-20, 24],
        fallbackText: "考场里没有神奇逆转，也没有突然失控。你只是把自己平时能写出来的那部分，尽量稳稳写了出来。",
        narratives: [
          {
            weight: 2,
            conditions: { minStats: { discipline: 45 } },
            text: "前一晚睡得不算完美，但你在第一门稳住了呼吸。后面几场虽然也紧，可节奏一直没乱。"
          },
          {
            weight: 2,
            conditions: { minStats: { mental: 42 } },
            text: "你知道自己也会慌，只是没有让慌把整场考试接管。很多题不是超常发挥，而是把会的都尽量做对了。"
          }
        ]
      },
      underperform: {
        probability: 0.2,
        label: "发挥失常",
        offsetRange: [-115, -38],
        fallbackText: "题目并没有难到离谱，可你的节奏被某个环节打乱了。真正拖垮人的，往往是心态、睡眠和身体没有一起站在你这边。",
        narratives: [
          {
            weight: 3,
            conditions: { someFlags: ["exam_anxiety", "family_pressure"] },
            text: "进场前那种胸口发紧的感觉一直没散。第一科某个熟题没写顺以后，你后面几场都在拼命把心态往回拽。"
          },
          {
            weight: 2,
            conditions: { maxStats: { health: 48 } },
            text: "临近考试那几天睡眠很碎，身体也有点撑不住。真正坐进考场以后，你能感觉到脑子比平时慢半拍。"
          }
        ]
      },
      overperform: {
        probability: 0.2,
        label: "超常发挥",
        offsetRange: [36, 108],
        fallbackText: "不是所有题都会，但你在最关键的两天里，把情绪、记忆和手感都接到了一个比平时更高的位置。",
        narratives: [
          {
            weight: 3,
            conditions: { someFlags: ["mentor_support", "resilient_under_pressure"] },
            text: "真正进场以后，你反而比模考更稳。尤其某一科像忽然踩准了节拍，很多原本模糊的点都连起来了。"
          },
          {
            weight: 2,
            conditions: { minStats: { discipline: 50, intelligence: 50 } },
            text: "前期打下的底子终于在那两天成了底气。你不是凭运气逆天改命，而是把积累在关键时刻完整兑现了。"
          }
        ]
      }
    }
  };

  window.LIFE_GAOKAO_REGIONS = [
    {
      id: "jiangnan",
      name: "江南省",
      summary: "教育资源密集，头部竞争更卷，但普通本科和职业路线也都很成熟。",
      scoreBands: [
        { id: "elite", label: "顶尖区间", min: 658 },
        { id: "key", label: "重点大学区间", min: 610 },
        { id: "general", label: "普通本科区间", min: 545 },
        { id: "borderline", label: "边缘本科区间", min: 505 },
        { id: "vocational", label: "专科 / 高职区间", min: 420 },
        { id: "fail", label: "落榜区间", min: 0 }
      ]
    },
    {
      id: "beifang",
      name: "北方省份",
      summary: "分数线偏稳，家里对学校层次和体面感的讨论往往更直接。",
      scoreBands: [
        { id: "elite", label: "顶尖区间", min: 650 },
        { id: "key", label: "重点大学区间", min: 600 },
        { id: "general", label: "普通本科区间", min: 530 },
        { id: "borderline", label: "边缘本科区间", min: 490 },
        { id: "vocational", label: "专科 / 高职区间", min: 405 },
        { id: "fail", label: "落榜区间", min: 0 }
      ]
    },
    {
      id: "xinan",
      name: "西南县域",
      summary: "外出读书与成本压力常常绑定在一起，离家远近和奖助学金会更影响去向。",
      scoreBands: [
        { id: "elite", label: "顶尖区间", min: 640 },
        { id: "key", label: "重点大学区间", min: 590 },
        { id: "general", label: "普通本科区间", min: 515 },
        { id: "borderline", label: "边缘本科区间", min: 475 },
        { id: "vocational", label: "专科 / 高职区间", min: 390 },
        { id: "fail", label: "落榜区间", min: 0 }
      ]
    }
  ];

  window.LIFE_UNIVERSITY_POOLS = {
    elite: [
      {
        id: "elite_big_city",
        routeId: "gaokao_elite_track",
        label: "顶尖名校路线",
        weight: 5,
        preferenceTags: ["academic", "leave_home", "ambition"],
        modifiers: [
          { conditions: { someFlags: ["family_expectation_high", "resource_rich_home"] }, add: 2 },
          { conditions: { minStats: { intelligence: 68 } }, add: 2 }
        ]
      },
      {
        id: "elite_research_local",
        routeId: "gaokao_key_university",
        label: "重点大学中的王牌专业路线",
        weight: 3,
        preferenceTags: ["stable", "stay_close", "practical"]
      }
    ],
    key: [
      {
        id: "key_city_route",
        routeId: "gaokao_key_university",
        label: "重点大学路线",
        weight: 5,
        preferenceTags: ["academic", "leave_home", "practical"]
      },
      {
        id: "key_local_route",
        routeId: "local_university",
        label: "离家较近的重点 / 强势本科路线",
        weight: 3,
        preferenceTags: ["stable", "stay_close", "family"]
      }
    ],
    general: [
      {
        id: "general_city",
        routeId: "gaokao_general_university",
        label: "普通本科路线",
        weight: 5,
        preferenceTags: ["practical", "leave_home"]
      },
      {
        id: "general_local",
        routeId: "local_university",
        label: "本地普通本科路线",
        weight: 4,
        preferenceTags: ["stable", "stay_close", "family"]
      }
    ],
    borderline: [
      {
        id: "borderline_private",
        routeId: "gaokao_private_college",
        label: "民办 / 独立院校路线",
        weight: 4,
        preferenceTags: ["stable", "family"],
        modifiers: [
          { conditions: { someFlags: ["resource_rich_home", "upward_mobility_home"] }, add: 2 }
        ]
      },
      {
        id: "borderline_vocational_upgrade",
        routeId: "gaokao_vocational_college",
        label: "高职专科再升学路线",
        weight: 4,
        preferenceTags: ["practical", "stay_close"]
      }
    ],
    vocational: [
      {
        id: "vocational_skill",
        routeId: "gaokao_vocational_college",
        label: "高职专科路线",
        weight: 6,
        preferenceTags: ["practical", "stay_close"]
      },
      {
        id: "vocational_replan",
        routeId: "non_gaokao_gap_replan",
        label: "先工作或调整，再决定升学",
        weight: 3,
        preferenceTags: ["family", "stable"]
      }
    ],
    fail: [
      {
        id: "fail_repeat",
        routeId: "repeat_exam_route",
        label: "复读路线",
        weight: 4,
        preferenceTags: ["ambition", "family"]
      },
      {
        id: "fail_pause",
        routeId: "non_gaokao_gap_replan",
        label: "不升学，先重新规划",
        weight: 4,
        preferenceTags: ["stable", "family"]
      },
      {
        id: "fail_skill_work",
        routeId: "non_gaokao_skill_path",
        label: "技能学习 / 尽快就业路线",
        weight: 4,
        preferenceTags: ["practical", "stay_close"]
      }
    ]
  };

  window.LIFE_NON_GAOKAO_ROUTES = {
    directWork: "direct_work_route",
    skillPath: "non_gaokao_skill_path",
    familyArranged: "non_gaokao_family_arranged",
    confusedGap: "non_gaokao_gap_replan",
    startupTry: "non_gaokao_startup_try",
    retakePlan: "repeat_exam_route"
  };

  window.LIFE_OVERSEAS_ROUTE_CONFIG = {
    defaultDestination: "海外城市",
    supportLevels: ["家里全力支持", "家里勉强撑着", "半工半读"]
  };

  window.LIFE_EDUCATION_ROUTES = [
    ...(Array.isArray(window.LIFE_EDUCATION_ROUTES) ? window.LIFE_EDUCATION_ROUTES : []),
    route({
      id: "gaokao_elite_track",
      name: "顶尖名校路线",
      category: "college",
      summary: "按地区参考线和成绩区间，进入头部高校池，再把平台、城市和后续野心一起拉高。",
      description: "这不是点名某一所真实学校，而是一整个更高平台、更强资源、更重比较的大学池。",
      details: ["资源密集", "竞争更陡", "实习与跨城市机会更早"],
      meta: { poolType: "gaokao", tier: "elite" },
      apply: {
        effects: {
          stats: { intelligence: 6, career: 7, social: 3, happiness: -2, stress: 8 }
        },
        addFlags: ["gaokao_destination_elite", "top_school", "big_city"],
        addTags: ["ambition", "pressure"],
        log: "你被送进了头部高校池。平台抬起来了，比较和机会也会一起抬起来。"
      }
    }),
    route({
      id: "gaokao_key_university",
      name: "重点大学路线",
      category: "college",
      summary: "成绩足够支撑更稳的重点大学池，平台、专业和离家远近之间开始真正权衡。",
      description: "这是一条兼顾体面、资源和现实可持续性的大学路线。",
      details: ["专业和城市选择空间更平衡", "资源不错", "仍需承担明确竞争"],
      meta: { poolType: "gaokao", tier: "key" },
      apply: {
        effects: {
          stats: { intelligence: 4, career: 4, social: 2, happiness: 1, stress: 4 }
        },
        addFlags: ["gaokao_destination_key"],
        addTags: ["growth", "stability"],
        log: "你进了一条更稳更体面的重点大学路线，后面几年会在积累和比较里一起推进。"
      }
    }),
    route({
      id: "gaokao_general_university",
      name: "普通本科路线",
      category: "college",
      summary: "以普通本科池为落点，更看重专业适配、城市成本和自己能不能持续发力。",
      description: "它不靠名校光环撑着，但可以给人完整的大学几年和重新定义自己的空间。",
      details: ["可持续性更强", "更适合自己慢慢把基础打稳", "专业选择会更务实"],
      meta: { poolType: "gaokao", tier: "general" },
      apply: {
        effects: {
          stats: { intelligence: 3, happiness: 3, social: 3, stress: 2 }
        },
        addFlags: ["gaokao_destination_general"],
        addTags: ["growth", "stability"],
        log: "你落进了普通本科池。不是最亮的选项，但仍然是一条完整且可持续的大学路。"
      }
    }),
    route({
      id: "gaokao_private_college",
      name: "民办 / 独立院校路线",
      category: "college",
      summary: "更多要考虑学费、性价比、家庭是否愿意托底，以及你愿不愿意继续押这段学历。",
      description: "这条路的张力不在分数本身，而在值不值得继续为校园身份付这笔账。",
      details: ["学费和家庭压力更明显", "学历缓冲仍在", "现实计算更重"],
      meta: { poolType: "gaokao", tier: "borderline" },
      apply: {
        effects: {
          stats: { intelligence: 2, happiness: -1, money: -4, familySupport: -2, stress: 5 }
        },
        addFlags: ["gaokao_destination_private"],
        addTags: ["pressure", "family"],
        log: "你仍然留在升学体系里，但这次选择背后，家里的账和自己的犹豫都比以前更清楚。"
      }
    }),
    route({
      id: "gaokao_vocational_college",
      name: "高职专科路线",
      category: "college",
      summary: "从技能和就业率出发重新看升学，让路线更务实，也更早碰见社会节奏。",
      description: "这条路不等于失败，而是把重心从名校叙事改成技能、资格证和尽快站稳。",
      details: ["技能和就业导向更强", "更早接触现实需求", "仍保留后续专升本等再规划空间"],
      meta: { poolType: "gaokao", tier: "vocational" },
      apply: {
        effects: {
          stats: { intelligence: 2, career: 3, money: 1, stress: 3, discipline: 2 }
        },
        addFlags: ["gaokao_destination_vocational"],
        addTags: ["practical", "independence"],
        log: "你没有继续追名校叙事，而是把路线转向了更直接的技能和就业。"
      }
    }),
    route({
      id: "non_gaokao_skill_path",
      name: "技能学习 / 职校路线",
      category: "work",
      summary: "不参加高考以后，把时间押在更快进入岗位的技能学习上。",
      description: "这条线靠证书、实操和岗位经验慢慢把自己抬起来。",
      details: ["更早接触行业", "成长速度很看自律", "不是单纯差路线"],
      meta: { poolType: "non_gaokao" },
      apply: {
        effects: {
          stats: { intelligence: 2, career: 4, money: 2, discipline: 3, stress: 2 }
        },
        addFlags: ["non_gaokao_skill_track"],
        addTags: ["practical", "growth"],
        log: "你没有坐进高考考场，而是把时间换成了更具体的技能和岗位经验。"
      }
    }),
    route({
      id: "non_gaokao_family_arranged",
      name: "家里安排路线",
      category: "work",
      summary: "不参加高考以后，去向更多被家里资源、人情和现实需求牵着走。",
      description: "它会给你落点，也会让你更早思考边界和依赖的代价。",
      details: ["短期更稳", "自主性更受考验", "家庭关系影响更深"],
      meta: { poolType: "non_gaokao" },
      apply: {
        effects: {
          stats: { money: 3, familySupport: 5, happiness: -1, stress: 3 }
        },
        addFlags: ["non_gaokao_family_track"],
        addTags: ["family", "stability"],
        log: "家里替你铺出了一条先能走的路，稳是真的稳，牵引也是真的强。"
      }
    }),
    route({
      id: "non_gaokao_gap_replan",
      name: "重新规划 / 间隔期",
      category: "pause",
      summary: "不参加高考以后，先不急着把自己塞进下一站，给自己一段重整和试错的时间。",
      description: "这条线的重点不是停着，而是重新判断自己到底想把什么当成以后。",
      details: ["有迷茫，也有重新校准的空间", "可能转工作，也可能次年再考", "更吃自我管理"],
      meta: { poolType: "non_gaokao" },
      apply: {
        effects: {
          stats: { mental: 2, happiness: 1, stress: 2, discipline: 1 }
        },
        addFlags: ["non_gaokao_gap_track"],
        addTags: ["selfhood", "growth"],
        log: "你没有立即回答所有问题，而是先给自己留出一个重新校准的间隔。"
      }
    }),
    route({
      id: "non_gaokao_startup_try",
      name: "创业尝试 / 小生意路线",
      category: "work",
      summary: "不参加高考以后，反而更早把自己丢进项目、流量和现金流的现实里。",
      description: "这条线很看胆量、人脉和执行力，也更容易在年轻时就经历大起大落。",
      details: ["上手快", "波动大", "很吃社交和抗压"],
      meta: { poolType: "non_gaokao" },
      apply: {
        effects: {
          stats: { career: 4, money: 3, social: 4, stress: 6, happiness: 1 }
        },
        addFlags: ["non_gaokao_startup_track"],
        addTags: ["risk", "independence"],
        log: "你没有等学历替自己背书，而是更早把名字和判断一起押进了现实。"
      }
    }),
    route({
      id: "overseas_research_path",
      name: "海外本科 / 研究型路线",
      category: "college",
      summary: "在国外走更看成绩、语言和长线规划的学习路线。",
      description: "平台会更大，语言和经济压力也会更实打实地压在自己身上。",
      details: ["语言环境变化大", "新圈层和新对象池会打开", "旧关系维持难度明显上升"],
      meta: { poolType: "overseas" },
      apply: {
        effects: {
          stats: { intelligence: 5, social: 3, stress: 7, familySupport: -2, discipline: 2 }
        },
        addFlags: ["overseas_research_track"],
        addTags: ["ambition", "selfhood"],
        log: "出国之后，你的人生节奏被真正换了一套坐标系。"
      }
    }),
    route({
      id: "overseas_practical_path",
      name: "海外应用型 / 半工半读路线",
      category: "college",
      summary: "更重视就业、落地和成本，学习、生活费和打工会长期缠在一起。",
      description: "这条路的成长速度很快，但孤独、钱和身份感都会反复来碰你。",
      details: ["生活成本真实", "适应速度更快", "恋爱和关系会更容易牵出价值观冲突"],
      meta: { poolType: "overseas" },
      apply: {
        effects: {
          stats: { intelligence: 3, career: 3, money: -2, stress: 8, discipline: 3 }
        },
        addFlags: ["overseas_practical_track"],
        addTags: ["practical", "independence"],
        log: "你出国读书的同时，也必须更早学会自己把生活撑起来。"
      }
    }),
    route({
      id: "overseas_art_path",
      name: "海外艺术 / 创作路线",
      category: "college",
      summary: "在更自由也更不稳定的环境里，把表达、圈层和关系复杂度都一起放大。",
      description: "它带来的不只是地点变化，而是整个生活方式、社交结构和感情结构的重排。",
      details: ["表达空间更大", "人际和恋爱对象池更复杂", "自我认同波动更强"],
      meta: { poolType: "overseas" },
      apply: {
        effects: {
          stats: { happiness: 4, social: 5, money: -3, stress: 7, intelligence: 3 }
        },
        addFlags: ["overseas_art_track"],
        addTags: ["craft", "selfhood"],
        log: "你去了一个会让表达和自我认同都被放大的环境，很多关系也因此变得不再简单。"
      }
    })
  ];

  const GRADUATION_EVENTS = [
    event({
      id: "score_and_volunteer",
      stage: "transition",
      title: "高中毕业之后，真正的第一道分叉来了",
      text: "毕业证拿到手以后，真正要改写后面几年生活结构的，不是一个默认播放的下一段，而是你要选哪一条主路线。\n\n家庭条件、成绩底子、父母态度、手里的钱、身边正在发生的感情，都会让这三个方向看起来完全不一样。\n\n你的高考地区会按这一局的人生背景默认为“{gaokaoRegionName}”。",
      minAge: 18,
      maxAge: 20,
      weight: 100,
      tags: ["transition", "milestone"],
      effectsOnEnter: mutation({
        customAction: "assign_gaokao_region",
        log: "高中结束以后，路不再只剩一条。你必须明确回答：参加高考，不参加高考，还是把人生直接搬到国外去读。"
      }),
      choices: [
        choice({
          text: "把命运先押进高考，再看分数能把门推开到什么位置。",
          addTags: ["ambition", "pressure"],
          customAction: "set_life_path",
          customPayload: {
            lifePath: "gaokao",
            addFlags: ["life_path_gaokao"]
          },
          next: "gaokao_day"
        }),
        choice({
          text: "不再把高考当唯一答案，直接去面对别的现实入口。",
          addTags: ["selfhood", "independence"],
          customAction: "set_life_path",
          customPayload: {
            lifePath: "non_gaokao",
            addFlags: ["life_path_non_gaokao"]
          },
          next: "non_gaokao_departure"
        }),
        choice({
          text: "把行李和未来一起往国外搬，去另一套环境里重新长。",
          addTags: ["selfhood", "risk"],
          customAction: "set_life_path",
          customPayload: {
            lifePath: "overseas",
            addFlags: ["life_path_overseas"]
          },
          next: "overseas_departure"
        })
      ]
    }),
    event({
      id: "gaokao_day",
      stage: "transition",
      title: "高考那几天",
      text: "你最后坐进了考场。分数不会凭空决定一切，但在这一局里，它仍然会先把你推到某个区间，再由你和现实一起决定下一站。\n\n这次结算会按 750 分模拟，核心由学业能力决定，自律、身心状态和压力只是在关键时刻放大或拖累你。",
      minAge: 18,
      maxAge: 20,
      weight: 100,
      tags: ["gaokao", "transition"],
      conditions: condition({
        requiredFlags: ["life_path_gaokao"]
      }),
      effectsOnEnter: mutation({
        log: "真正坐进考场以后，你会发现所谓临场发挥，从来都不是一句空话。"
      }),
      choices: [
        choice({
          text: "把呼吸和答题节奏先稳住，尽量不让情绪乱掉。",
          effects: {
            stats: { mental: 2, stress: -1 }
          },
          customAction: "simulate_gaokao",
          next: "gaokao_result"
        }),
        choice({
          text: "咬着牙顶过去，哪怕身体和心态都已经很紧。",
          effects: {
            stats: { discipline: 1, health: -2, stress: 2 }
          },
          customAction: "simulate_gaokao",
          next: "gaokao_result"
        }),
        choice({
          text: "把最后几天的作息和笔记彻底收束，只求关键时刻别崩。",
          effects: {
            stats: { discipline: 2, mental: 1, happiness: -1 }
          },
          customAction: "simulate_gaokao",
          next: "gaokao_result"
        })
      ]
    }),
    event({
      id: "gaokao_result",
      stage: "transition",
      title: "分数出来以后，真正要面对的是“去向池”",
      text: "参考地区：{gaokaoRegionName}\n\n基础实力约落在 {gaokaoBaseScore} 分，实际结算为 {gaokaoScore} 分，对应“{gaokaoTierLabel}”。\n\n这次属于：{gaokaoPerformanceLabel}\n\n{gaokaoPerformanceText}\n\n你不会被强行精确塞进某一所真实大学，而是要在这个成绩区间里，按离家远近、专业倾向、家庭承压和自己的想法，落进某个大学池或去向池。",
      minAge: 18,
      maxAge: 21,
      weight: 100,
      tags: ["gaokao", "transition"],
      conditions: condition({
        requiredFlags: ["gaokao_taken"]
      }),
      choices: [
        choice({
          text: "优先看平台和城市，能走远一点也愿意扛。",
          customAction: "resolve_gaokao_destination",
          customPayload: {
            willingnessToLeaveHome: true,
            majorPreference: "academic",
            familyPreference: "ambition"
          }
        }),
        choice({
          text: "把专业、成本和以后好不好落地一起算进去。",
          customAction: "resolve_gaokao_destination",
          customPayload: {
            willingnessToLeaveHome: true,
            majorPreference: "practical",
            familyPreference: "stable"
          }
        }),
        choice({
          text: "离家近一点、家里更能接得住，会更安心。",
          customAction: "resolve_gaokao_destination",
          customPayload: {
            willingnessToLeaveHome: false,
            majorPreference: "stable",
            familyPreference: "family"
          }
        }),
        choice({
          text: "这次先不急着继续升学，重新规划一次。",
          conditions: {
            someFlags: ["gaokao_tier_fail", "gaokao_tier_vocational", "exam_anxiety", "caregiver_role"]
          },
          customAction: "take_non_gaokao_route",
          customPayload: {
            routeId: "non_gaokao_gap_replan",
            log: "你没有继续被一次分数推着走，而是先把路线改成了重新规划。"
          }
        }),
        choice({
          text: "再压一年，想把这件事重新做一遍。",
          conditions: {
            someFlags: ["gaokao_tier_fail", "gaokao_tier_vocational", "family_expectation_high", "exam_anxiety"]
          },
          setEducationRoute: "repeat_exam_route"
        })
      ]
    }),
    event({
      id: "non_gaokao_departure",
      stage: "transition",
      title: "不参加高考以后，人生并没有只剩“失败”这一种解释",
      text: "你没有走进高考考场，但这不代表后面只剩一条下坡路。真正的问题变成了：你要把自己先放进哪一种现实里。\n\n钱、家里、社交圈、自律、情绪稳定度和当下有没有正在拉扯的关系，都会让这些选项的重量完全不同。",
      minAge: 18,
      maxAge: 20,
      weight: 100,
      tags: ["transition", "work"],
      conditions: condition({
        requiredFlags: ["life_path_non_gaokao"]
      }),
      choices: [
        choice({
          text: "先去工作，让收入和社会规则早点进场。",
          customAction: "take_non_gaokao_route",
          customPayload: {
            routeId: "direct_work_route",
            log: "你没有等学历身份替自己兜底，而是把自己更早地推到了工作和收入的现实里。"
          }
        }),
        choice({
          text: "去学一门实打实能吃饭的技能，把路线搭起来。",
          customAction: "take_non_gaokao_route",
          customPayload: {
            routeId: "non_gaokao_skill_path",
            log: "你把重点从考试换成了技能和岗位，成长方式完全变了。"
          }
        }),
        choice({
          text: "顺着家里的安排先落个脚，再慢慢看自己要不要拐弯。",
          customAction: "take_non_gaokao_route",
          customPayload: {
            routeId: "non_gaokao_family_arranged",
            log: "家里先替你接住了一段路，但之后怎么走，迟早还得自己回答。"
          }
        }),
        choice({
          text: "先停一下，承认自己现在就是还没想清楚。",
          customAction: "take_non_gaokao_route",
          customPayload: {
            routeId: "non_gaokao_gap_replan",
            log: "你先没有逼自己立刻给出一个漂亮答案。迷茫不是结局，只是另一种开头。"
          }
        }),
        choice({
          text: "拉上人脉和胆子，试着做点小生意或项目。",
          customAction: "take_non_gaokao_route",
          customPayload: {
            routeId: "non_gaokao_startup_try",
            log: "你把年轻、社交和执行力直接押进了现实，想看看不读大学能不能也冲出自己的路。"
          }
        }),
        choice({
          text: "先不考，不等于以后都不考，给自己留一个次年再试的窗口。",
          customAction: "take_non_gaokao_route",
          customPayload: {
            routeId: "repeat_exam_route",
            log: "你只是把考试从“现在必须”改成了“以后仍可能回来做的一件事”。"
          }
        })
      ]
    }),
    event({
      id: "overseas_departure",
      stage: "transition",
      title: "去国外念书，不只是换一个地点名称",
      text: "出国以后，原来的语言环境、消费习惯、社交方式和感情节奏都会一起被换掉。你会得到新的城市、新朋友圈和新对象池，也会同时面对更直接的经济压力、孤独感和文化差异。\n\n如果国内已经有人在你心里占了位置，这段关系不会自动消失，它只会被拖进更难维系的状态里。",
      minAge: 18,
      maxAge: 21,
      weight: 100,
      tags: ["transition", "overseas"],
      conditions: condition({
        requiredFlags: ["life_path_overseas"]
      }),
      choices: [
        choice({
          text: "家里愿意重押这条线，先去更讲平台和学术的环境。",
          conditions: {
            someFlags: ["resource_rich_home", "family_expectation_high", "mentor_support"]
          },
          customAction: "start_overseas_route",
          customPayload: {
            routeId: "overseas_research_path",
            routeName: "海外本科 / 研究型路线",
            destination: "国际化大城市",
            supportLevel: "家里全力支持",
            languagePressure: 32,
            loneliness: 28,
            financePressure: 24,
            exposureRisk: 6
          }
        }),
        choice({
          text: "更看重性价比和落地，准备半工半读把这条路撑住。",
          customAction: "start_overseas_route",
          customPayload: {
            routeId: "overseas_practical_path",
            routeName: "海外应用型 / 半工半读路线",
            destination: "生活成本更敏感的海外城市",
            supportLevel: "半工半读",
            languagePressure: 38,
            loneliness: 35,
            financePressure: 44,
            exposureRisk: 12
          }
        }),
        choice({
          text: "冲一个更自由也更复杂的创作或艺术环境。",
          conditions: {
            someFlags: ["long_term_hobby", "signature_work", "self_exploration_early"]
          },
          customAction: "start_overseas_route",
          customPayload: {
            routeId: "overseas_art_path",
            routeName: "海外艺术 / 创作路线",
            destination: "文化氛围更强的海外城市",
            supportLevel: "家里勉强撑着",
            languagePressure: 30,
            loneliness: 36,
            financePressure: 38,
            exposureRisk: 14
          }
        })
      ]
    }),
    event({
      id: "repeat_exam_year",
      stage: "transition",
      title: "复读这一年",
      text: "复读不是把高三复制一遍，而是在经历过一次偏差以后，再决定要不要把一年时间重新压回考试。它会更像一场意志、尊严和现实压力的混合战。",
      minAge: 19,
      maxAge: 21,
      weight: 12,
      tags: ["transition", "gaokao"],
      conditions: condition({
        educationRouteIds: ["repeat_exam_route"]
      }),
      choices: [
        choice({
          text: "把节奏重新搭好，成绩和心态都终于回到自己手里。",
          effects: {
            stats: { intelligence: 4, discipline: 3, stress: 2 }
          },
          customAction: "simulate_gaokao",
          next: "gaokao_result"
        }),
        choice({
          text: "边打工边复习，把理想和现实同时扛着走。",
          effects: {
            stats: { money: 3, discipline: 2, health: -2, stress: 3 }
          },
          customAction: "simulate_gaokao",
          next: "gaokao_result"
        }),
        choice({
          text: "后来想清楚了，真正舍不得的不是这张卷子，而是输的感觉。",
          customAction: "take_non_gaokao_route",
          customPayload: {
            routeId: "non_gaokao_gap_replan",
            log: "你没有继续跟那次考试死磕，而是把力气改放在了别的路上。"
          }
        })
      ]
    }),
    event({
      id: "non_gaokao_skill_apprentice",
      stage: "young_adult",
      title: "技能学到一半，真正难的是能不能熬过前面的笨拙期",
      text: "证书、实操、带教、挨骂和重复，都会在这段时间里一起出现。你会很快发现，不参加高考并不等于不需要学习，只是学习内容换成了更直接的现实手感。",
      minAge: 18,
      maxAge: 24,
      weight: 8,
      tags: ["work", "growth"],
      conditions: condition({
        educationRouteIds: ["non_gaokao_skill_path", "gaokao_vocational_college"]
      }),
      choices: [
        choice({
          text: "把前面的笨拙期咬下来，慢慢做出手感。",
          effects: {
            age: 1,
            stats: { career: 4, discipline: 3, happiness: 1, stress: 2 }
          },
          addFlags: ["craft_seed", "hands_on_path"],
          log: "你开始明白，真正能养活人的能力，往往都要穿过一段很不体面的生涩期。"
        }),
        choice({
          text: "先找一份能练手也能挣钱的岗，把成长和生存并在一起。",
          effects: {
            age: 1,
            stats: { money: 4, career: 3, health: -1, stress: 2 }
          },
          addFlags: ["early_worker", "self_built_structure"],
          log: "你学技能的同时也尽快站进了岗位，成长速度变快了，辛苦程度也变得很具体。"
        })
      ]
    }),
    event({
      id: "non_gaokao_family_arranged_tension",
      stage: "young_adult",
      title: "家里安排的路，稳得住，也最容易卡住边界",
      text: "有人脉、有位置、有人提前替你说好话，这些都很真实。但你也越来越清楚地感觉到，很多决定不像是你自己做的。",
      minAge: 18,
      maxAge: 24,
      weight: 7,
      tags: ["family", "work"],
      conditions: condition({
        educationRouteIds: ["non_gaokao_family_arranged"]
      }),
      choices: [
        choice({
          text: "先借这份稳定站住，再慢慢攒自己的底气。",
          effects: {
            age: 1,
            stats: { familySupport: 3, money: 3, career: 2, happiness: -1 }
          },
          addFlags: ["family_buffer_used"],
          log: "你没有急着翻脸，而是先把家里的托举变成自己以后能抽身的底气。"
        }),
        choice({
          text: "越走越觉得窒息，想把边界重新谈清楚。",
          effects: {
            age: 1,
            stats: { mental: 2, social: 2, stress: 1 }
          },
          addFlags: ["boundary_awareness", "self_defined_goal"],
          log: "你第一次认真意识到，稳定并不自动等于适合，边界也得自己谈出来。"
        })
      ]
    }),
    event({
      id: "non_gaokao_gap_rebuild",
      stage: "young_adult",
      title: "暂时迷茫并不会自动结束，你得亲手把节奏重新搭起来",
      text: "间隔期最怕的不是别人看不起，而是自己也慢慢失去对时间的掌控感。能不能把日常重新搭起来，会决定这段停顿是缓冲，还是下坠。",
      minAge: 18,
      maxAge: 24,
      weight: 7,
      tags: ["growth", "pressure"],
      conditions: condition({
        educationRouteIds: ["non_gaokao_gap_replan"]
      }),
      choices: [
        choice({
          text: "给自己定作息、打零工、补信息，把人重新拉回轨道。",
          effects: {
            age: 1,
            stats: { discipline: 4, money: 2, mental: 2, stress: 1 }
          },
          addFlags: ["self_built_structure", "support_seeking"],
          log: "迷茫没有立刻消失，但你至少重新把生活的方向盘抓回了手里。"
        }),
        choice({
          text: "先让自己喘一阵，慢慢承认有些答案就是不会一下出现。",
          effects: {
            age: 1,
            stats: { happiness: 2, mental: 1, stress: -1 }
          },
          addFlags: ["self_definition_seed"],
          log: "你没有把停顿全都当成失败，而是开始允许自己在不确定里慢慢长出判断。"
        })
      ]
    }),
    event({
      id: "overseas_language_shock",
      stage: "college",
      title: "真正住进去以后，语言和孤独感一起变得非常具体",
      text: "课堂、超市、租房、邮件、群聊和路边闲聊，会让你明白“在国外生活”不是一个浪漫概念，而是一套时时刻刻都要调动反应的系统。\n\n现在这条线上的压力概况是：{overseasPressureSummary}",
      minAge: 18,
      maxAge: 24,
      weight: 8,
      tags: ["overseas", "college"],
      conditions: condition({
        requiredFlags: ["life_path_overseas"]
      }),
      choices: [
        choice({
          text: "硬着头皮多开口，把陌生环境一点点练成熟悉。",
          effects: {
            age: 1,
            stats: { social: 4, intelligence: 2, stress: 2, discipline: 1 }
          },
          customAction: "adjust_overseas_pressures",
          customPayload: {
            languagePressure: -10,
            loneliness: -4
          },
          log: "你没有等自己完全准备好才融入，而是在一次次开口和出错里把环境慢慢摸熟。"
        }),
        choice({
          text: "表面适应，回到住处以后却常常整个人被空掉。",
          effects: {
            age: 1,
            stats: { mental: -2, happiness: -2, stress: 3 }
          },
          customAction: "adjust_overseas_pressures",
          customPayload: {
            loneliness: 10,
            languagePressure: 4
          },
          log: "你白天看起来还算撑得住，真正难受的往往是夜里和周末那些没人兜底的时段。"
        })
      ]
    }),
    event({
      id: "overseas_identity_split",
      stage: "college",
      title: "新环境给你的，不只是新朋友，也是一种身份重新被拎出来审视的感觉",
      text: "你会开始频繁想一个问题：自己到底是在逃离原来的生活，还是终于接近想成为的人。文化差异、消费差异、表达方式和感情边界，都会一起让这种身份感更复杂。",
      minAge: 19,
      maxAge: 26,
      weight: 7,
      tags: ["overseas", "selfhood"],
      conditions: condition({
        requiredFlags: ["life_path_overseas"]
      }),
      choices: [
        choice({
          text: "把这种撕裂当成成长的一部分，慢慢练出自己的新边界。",
          effects: {
            age: 1,
            stats: { mental: 3, happiness: 2, social: 2 }
          },
          addFlags: ["self_definition_seed", "boundary_awareness"],
          log: "你没有急着把自己塞回旧版本，而是在新的环境里慢慢练出更能站稳的样子。"
        }),
        choice({
          text: "有时会强烈怀念以前那个不用一直解释自己的自己。",
          effects: {
            age: 1,
            stats: { mental: -1, happiness: -1, familySupport: 1 }
          },
          customAction: "adjust_overseas_pressures",
          customPayload: {
            loneliness: 6
          },
          addFlags: ["homesick_phase"],
          log: "你不是后悔来了，只是会在某些很普通的时刻，突然很想念那个不用时时翻译自己的环境。"
        })
      ]
    })
  ];

  window.LIFE_EXTRA_EVENTS = [
    ...(Array.isArray(window.LIFE_EXTRA_EVENTS) ? window.LIFE_EXTRA_EVENTS : []),
    ...GRADUATION_EVENTS
  ];
})();

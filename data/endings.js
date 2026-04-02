(function () {
  "use strict";

  function toList(value) {
    return Array.isArray(value) ? value.slice() : [];
  }

  function toStats(value) {
    return value && typeof value === "object" ? { ...value } : {};
  }

  function toMap(value) {
    return value && typeof value === "object" ? { ...value } : {};
  }

  function requirement(value) {
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
      relationshipStatuses: toMap(source.relationshipStatuses),
      excludedRelationshipStatuses: toMap(source.excludedRelationshipStatuses),
      requiredRelationshipFlags: toMap(source.requiredRelationshipFlags),
      excludedRelationshipFlags: toMap(source.excludedRelationshipFlags),
      minAffection: toMap(source.minAffection),
      maxAffection: toMap(source.maxAffection),
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
      noCurrentPartner: Boolean(source.noCurrentPartner),
      debtPrisonOrFlag: Boolean(source.debtPrisonOrFlag),
      debtToMoneyPrison:
        source.debtToMoneyPrison && typeof source.debtToMoneyPrison === "object"
          ? {
              debtAbove:
                typeof source.debtToMoneyPrison.debtAbove === "number"
                  ? source.debtToMoneyPrison.debtAbove
                  : 50,
              moneyMultiple:
                typeof source.debtToMoneyPrison.moneyMultiple === "number"
                  ? source.debtToMoneyPrison.moneyMultiple
                  : 5
            }
          : null
    };
  }

  function modifier(value) {
    const source = value && typeof value === "object" ? value : {};

    return {
      weight: typeof source.weight === "number" ? source.weight : 0,
      when: requirement(source.when)
    };
  }

  function ending(value) {
    const source = value && typeof value === "object" ? value : {};

    return {
      id: typeof source.id === "string" ? source.id : "",
      title: typeof source.title === "string" ? source.title : "未命名结局",
      text: typeof source.text === "string" ? source.text : "",
      instant: Boolean(source.instant),
      baseWeight: typeof source.baseWeight === "number" ? source.baseWeight : 1,
      require: requirement(source.require),
      weightModifiers: Array.isArray(source.weightModifiers) ? source.weightModifiers.map(modifier) : []
    };
  }

  const LATE_GAME_REQUIREMENT = {
    minAge: 64,
    minChoices: 118
  };

  window.LIFE_ENDINGS = [
    ending({
      id: "terminal_health_zero",
      title: "结局：身体这项硬指标，终于跌到尽头",
      text: "不是某一天突然发生的意外，而是无数次「先顶过去」之后，身体再也没有给你下一次缓冲。到了这一步，年龄、计划和未完成的愿望都得让路——因为最底层的那一格血条，已经见底了。",
      instant: true,
      baseWeight: 520,
      require: requirement({
        maxStats: { health: 0 }
      })
    }),
    ending({
      id: "terminal_debt_collapse",
      title: "结局：负债高到人生在现实里再也转不动",
      text: "数字堆到某个临界点以后，就不再只是账面上的压力：它会接管你的选择、关系和自尊。你会发现自己连「先缓一缓」的空间都被收走，只能面对结构性的崩塌。",
      instant: true,
      baseWeight: 500,
      require: requirement({
        minStats: { debt: 94 },
        maxStats: { money: 12 }
      })
    }),
    ending({
      id: "terminal_incarceration",
      title: "结局：高墙之内，人生被强行按下暂停",
      text: "手续、指印、随身物品被收走的那一刻，你从熟悉的轨道上被摘了出去。外面的人继续按日历生活，而你学会用另一种时间感数日子——错误、侥幸和代价，终于以法律的形式对上了账。",
      instant: true,
      baseWeight: 510,
      require: requirement({
        requiredFlags: ["incarcerated"]
      })
    }),
    ending({
      id: "early_health_collapse",
      title: "结局：身体先一步垮下去",
      text: "你不是突然倒下的，而是在很多次“先扛过去再说”的累积里，把身体一路透支到了再也顶不住的边缘。",
      instant: true,
      baseWeight: 120,
      require: requirement({
        minAge: 30,
        minChoices: 72,
        minStats: { stress: 78 },
        maxStats: { health: 6 },
        someFlags: ["chronic_condition", "health_warning", "overworked", "chronic_stress"]
      })
    }),
    ending({
      id: "burnout_breakdown",
      title: "结局：长期高压之后，整个人都被压垮了",
      text: "你长期靠意志力把生活往前拧，工作、成绩和责任都没有立刻输，可身心先失去了继续运转的能力。",
      instant: true,
      baseWeight: 110,
      require: requirement({
        minAge: 32,
        minChoices: 80,
        minStats: { stress: 88 },
        maxStats: { mental: 12, happiness: 14 },
        someFlags: ["chronic_stress", "overworked", "career_first", "emotional_shutdown"]
      })
    }),
    ending({
      id: "debt_crash",
      title: "结局：债务失控，人生在现实压力里突然塌了",
      text: "很多问题并不是在一夜之间坏掉的，只是债务滚到一定程度以后，生活结构会开始连锁断裂，留下来的不只是钱的问题。",
      instant: true,
      baseWeight: 115,
      require: requirement({
        minAge: 28,
        minChoices: 75,
        minStats: { debt: 88, stress: 76 },
        maxStats: { money: 18 }
      })
    }),
    ending({
      id: "prison_route",
      title: "结局：灰色路径翻车，最后把自己送进了更窄的地方",
      text: "你原本以为那只是一次更快的解法，可当风险、侥幸和现实后果真正对上账时，代价会比你当初想象得更重。",
      instant: true,
      baseWeight: 105,
      require: requirement({
        minAge: 28,
        minChoices: 76,
        minStats: { debt: 82, stress: 76 },
        requiredFlags: ["debt_rollover"],
        someFlags: ["speculative_route", "major_bet_loss", "bad_company"]
      })
    }),
    ending({
      id: "career_summit",
      title: "结局：把能力和平台都推到了高处",
      text: "你把很多年的学习、判断、执行和机会，真的慢慢熬成了足够有分量的位置。人生未必轻松，但确实做出了高度。",
      baseWeight: 6,
      require: requirement({
        ...LATE_GAME_REQUIREMENT,
        minStats: { career: 76, intelligence: 64 }
      }),
      weightModifiers: [
        modifier({ weight: 16, when: { requiredTags: ["ambition"] } }),
        modifier({ weight: 12, when: { educationRouteIds: ["elite_city_university"] } }),
        modifier({ weight: 10, when: { careerRouteIds: ["high_pay_pressure_job", "further_study_route"] } }),
        modifier({ weight: 8, when: { someFlags: ["mentor_support", "top_school", "advanced_degree"] } })
      ]
    }),
    ending({
      id: "steady_life",
      title: "结局：稳定、普通，但把日子接得很稳",
      text: "你没有把每一步都押在最陡的上升线上，而是把很多选择做成了可持续的生活结构。稳定本身，也是一种很难得的能力。",
      baseWeight: 8,
      require: requirement({
        ...LATE_GAME_REQUIREMENT,
        minStats: { happiness: 58, health: 58, mental: 56 }
      }),
      weightModifiers: [
        modifier({ weight: 16, when: { requiredTags: ["stability"] } }),
        modifier({ weight: 12, when: { careerRouteIds: ["stable_office_job", "system_job"] } }),
        modifier({ weight: 8, when: { educationRouteIds: ["ordinary_university", "local_university"] } })
      ]
    }),
    ending({
      id: "love_fulfilled",
      title: "结局：把喜欢过成了真正能一起生活的关系",
      text: "到最后，感情对你来说不再只是某段年轻时的心动，而是一起扛现实、修冲突、留时间、并且愿意继续靠近的生活能力。",
      baseWeight: 6,
      require: requirement({
        ...LATE_GAME_REQUIREMENT,
        minStats: { happiness: 64, social: 58 },
        anyRelationshipStatuses: ["steady", "married", "reconnected"],
        anyRelationshipMinAffection: 60
      }),
      weightModifiers: [
        modifier({ weight: 14, when: { requiredRomanceFlags: ["relationship_committed", "relationship_maintained"] } }),
        modifier({ weight: 10, when: { someFlags: ["long_term_partner", "future_planned", "rules_reworked"] } }),
        modifier({ weight: 8, when: { requiredTags: ["family"] } }),
        modifier({ weight: 8, when: { requiredRomanceFlags: ["romance_future_aligned", "romance_domestic_anchor"] } }),
        modifier({ weight: 6, when: { requiredRomanceFlags: ["romance_coparent_team", "romance_care_bond"] } })
      ]
    }),
    ending({
      id: "love_regret",
      title: "结局：感情里始终留着没补上的空",
      text: "你不是没有认真喜欢过谁，只是在很多该靠近、该解释、该留下或该说出口的时候，现实、迟疑和旧的防备总是先一步挡在前面。",
      baseWeight: 5,
      require: requirement({
        ...LATE_GAME_REQUIREMENT,
        someFlags: ["missed_love", "solo_pattern", "emotionally_guarded", "trust_break"]
      }),
      weightModifiers: [
        modifier({ weight: 12, when: { maxStats: { happiness: 56 } } }),
        modifier({ weight: 10, when: { noCurrentPartner: true } }),
        modifier({ weight: 8, when: { requiredRomanceFlags: ["relationship_neglected", "romance_held_back"] } }),
        modifier({ weight: 7, when: { requiredRomanceFlags: ["romance_distance_cost", "romance_neglected_for_child"] } })
      ]
    }),
    ending({
      id: "maker_path",
      title: "结局：把兴趣、作品和手艺熬成了人生底色",
      text: "你没有让真正喜欢的东西只停留在年轻时，而是把表达、作品和长期投入一点点熬成了可被看见的生活方式。",
      baseWeight: 5,
      require: requirement({
        ...LATE_GAME_REQUIREMENT,
        requiredTags: ["craft"]
      }),
      weightModifiers: [
        modifier({ weight: 16, when: { educationRouteIds: ["art_free_path"] } }),
        modifier({ weight: 12, when: { careerRouteIds: ["freelance_route"] } }),
        modifier({ weight: 10, when: { someFlags: ["signature_work", "portfolio_path"] } })
      ]
    }),
    ending({
      id: "founder_arc",
      title: "结局：在创业和高波动里起落，也活成了自己的牌子",
      text: "你的人生里有过几次像是翻盘的时刻。你比很多人更早、更狠地押注机会，也承担了更真实的代价。无论输赢，你都把风险熬成了判断力。",
      baseWeight: 4,
      require: requirement({
        ...LATE_GAME_REQUIREMENT,
        someFlags: ["entrepreneurship", "founder_pivot", "company_survived", "risk_taker"]
      }),
      weightModifiers: [
        modifier({ weight: 16, when: { careerRouteIds: ["startup_route"] } }),
        modifier({ weight: 12, when: { requiredTags: ["risk"] } }),
        modifier({ weight: 8, when: { minStats: { career: 70 } } })
      ]
    }),
    ending({
      id: "recovery_arc",
      title: "结局：绕了很多弯，最后还是把自己慢慢捞了回来",
      text: "你的人生不是一条很整齐的线。你走过弯路、停过、乱过，也被现实和情绪逼停过几次，但最后还是一点点把自己的生活重新搭了起来。",
      baseWeight: 6,
      require: requirement({
        ...LATE_GAME_REQUIREMENT,
        someFlags: ["recovery_turn", "therapy_started", "family_repair", "relationship_rebuilt", "self_acceptance_seed"]
      }),
      weightModifiers: [
        modifier({ weight: 14, when: { minStats: { mental: 62, happiness: 60 } } }),
        modifier({ weight: 8, when: { requiredTags: ["selfhood"] } }),
        modifier({ weight: 8, when: { someFlags: ["boundary_awareness", "emotional_honesty"] } })
      ]
    }),
    ending({
      id: "ordinary_ending",
      title: "结局：普通但真实的一生",
      text: "你的人生并没有被某一种标签完全概括。它有做对的时候，也有拧巴和遗憾；有阶段性的得意，也有很多不想重来的片段。可正因为它不够整齐，反而更像真实生活本身。",
      baseWeight: 2,
      require: requirement({
        ...LATE_GAME_REQUIREMENT
      }),
      weightModifiers: [
        modifier({ weight: 8, when: { minStats: { happiness: 50 } } }),
        modifier({ weight: 6, when: { requiredFlags: ["overseas_study_loan", "study_abroad_debt"] } }),
        modifier({ weight: 5, when: { requiredFlags: ["has_child", "parent_active"] } })
      ]
    })
  ];
})();

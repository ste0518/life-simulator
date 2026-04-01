(function () {
  "use strict";

  /*
    结局数据手动编辑说明：
    - require: 基础门槛，先过滤“有资格进入”的结局。
    - baseWeight: 基础权重。
    - weightModifiers: 满足 when 条件时，给该结局增加权重。
    - 最终会在所有满足条件的结局里按权重抽取，而不是固定命中第一个。
    - minChoices 用来拉长一局人生的平均选择次数。
  */

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
      anyRelationshipMinAffection:
        typeof source.anyRelationshipMinAffection === "number" ? source.anyRelationshipMinAffection : null,
      activeRelationshipMinAffection:
        typeof source.activeRelationshipMinAffection === "number" ? source.activeRelationshipMinAffection : null,
      activeRelationshipMaxAffection:
        typeof source.activeRelationshipMaxAffection === "number" ? source.activeRelationshipMaxAffection : null,
      requiredActiveRelationshipFlags: toList(source.requiredActiveRelationshipFlags),
      excludedActiveRelationshipFlags: toList(source.excludedActiveRelationshipFlags),
      noCurrentPartner: Boolean(source.noCurrentPartner),
    };
  }

  function modifier(value) {
    const source = value && typeof value === "object" ? value : {};

    return {
      weight: typeof source.weight === "number" ? source.weight : 0,
      when: requirement(source.when),
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
      weightModifiers: Array.isArray(source.weightModifiers) ? source.weightModifiers.map(modifier) : [],
    };
  }

  const LATE_GAME_REQUIREMENT = {
    minAge: 58,
    minChoices: 108,
  };

  window.LIFE_ENDINGS = [
    ending({
      id: "health_collapse",
      title: "结局：身体先一步倒下",
      text: "你很会扛，也很会把眼前的事先做完，却没能及时承认自己早就在透支。后来生活用一种近乎粗暴的方式让你停下，你才真正明白，健康不是附属品，而是所有野心、关系和未来的底座。",
      instant: true,
      baseWeight: 1000,
      require: requirement({
        minAge: 30,
        minChoices: 80,
        maxStats: {
          health: 0,
        },
      }),
    }),
    ending({
      id: "empty_heart",
      title: "结局：心越来越空",
      text: "你不是没有得到过什么，只是一路走来，很多情绪都被你压进了“先别管”里。等真正安静下来时，你发现自己已经很久没有认真感受过喜欢、难过、期待或靠近，人生像是被过完了，心却没跟上。",
      instant: true,
      baseWeight: 900,
      require: requirement({
        minAge: 30,
        minChoices: 80,
        maxStats: {
          happiness: 0,
        },
      }),
    }),
    ending({
      id: "career_summit",
      title: "结局：把能力、机会和长期积累都推到了高处",
      text: "你后来的很多年都没有白熬。那些早期形成的学习习惯、判断力、野心和执行力，最后被你慢慢熬成了真正能换来位置与影响力的东西。你的人生未必轻松，但确实做出了分量。",
      baseWeight: 6,
      require: requirement({
        ...LATE_GAME_REQUIREMENT,
        minStats: {
          career: 76,
          intelligence: 62,
        },
      }),
      weightModifiers: [
        modifier({ weight: 24, when: { requiredTags: ["ambition"] } }),
        modifier({ weight: 12, when: { someFlags: ["mentor_support", "mentor_legacy", "advanced_degree", "city_seen_early"] } }),
        modifier({ weight: 10, when: { minStats: { money: 65 } } }),
        modifier({ weight: 8, when: { someFlags: ["study_system_built", "goal_planner", "adolescent_self_discipline"] } }),
        modifier({ weight: 8, when: { minStats: { discipline: 70 } } }),
        modifier({ weight: 6, when: { someFlags: ["family_expectation_high", "resource_rich_home"] } }),
      ],
    }),
    ending({
      id: "steady_ordinary",
      title: "结局：稳定、普通，但把日子接得很稳",
      text: "你没有把每一步都押在最陡的上升线上，而是选择了更可持续的秩序。稳定、边界感、按部就班的积累，最终让你拥有了一种很多人中途就丢掉的能力：稳稳地把生活接住。",
      baseWeight: 10,
      require: requirement({
        ...LATE_GAME_REQUIREMENT,
        minStats: {
          happiness: 58,
          health: 56,
        },
      }),
      weightModifiers: [
        modifier({ weight: 20, when: { requiredTags: ["stability"] } }),
        modifier({ weight: 8, when: { minStats: { social: 60 } } }),
        modifier({ weight: 8, when: { someFlags: ["stable_job", "stable_system_job", "homeowner", "small_world_comfort"] } }),
        modifier({ weight: 8, when: { someFlags: ["health_managed", "flexible_routine", "early_self_discipline"] } }),
        modifier({ weight: 8, when: { minStats: { mental: 62, familySupport: 58 } } }),
      ],
    }),
    ending({
      id: "founder_arc",
      title: "结局：在创业和高波动里起落，也活成了自己的牌子",
      text: "你的人生里有过几次像是翻盘的时刻。你比很多人更早、更狠地押注机会，也承担了更真实的代价。后来无论输赢，你都把风险、试错和重来，慢慢熬成了真正属于自己的判断力。",
      baseWeight: 4,
      require: requirement({
        ...LATE_GAME_REQUIREMENT,
        someFlags: ["entrepreneurship", "founder_pivot", "company_survived", "startup_first_loss", "side_project_nights"],
      }),
      weightModifiers: [
        modifier({ weight: 26, when: { minStats: { career: 72, money: 62 } } }),
        modifier({ weight: 12, when: { requiredTags: ["risk"] } }),
        modifier({ weight: 8, when: { someFlags: ["major_bet_loss", "second_growth"] } }),
      ],
    }),
    ending({
      id: "love_fulfilled",
      title: "结局：感情圆满，终于把喜欢过成了可依靠的生活",
      text: "你的人生里并不是没有现实压力，只是到最后，你还是让一段重要关系经得住了时间、城市、工作和疲惫。你没有把亲密只停在年轻时的心动上，而是把它一点点落到了真正的生活里。",
      baseWeight: 5,
      require: requirement({
        ...LATE_GAME_REQUIREMENT,
        minStats: {
          happiness: 66,
          social: 60,
        },
        anyRelationshipStatuses: ["steady", "married", "reconnected"],
        anyRelationshipMinAffection: 55,
      }),
      weightModifiers: [
        modifier({ weight: 18, when: { someFlags: ["long_term_partner", "married", "late_love"] } }),
        modifier({ weight: 10, when: { requiredTags: ["family"] } }),
        modifier({ weight: 8, when: { requiredRomanceFlags: ["kept_promise", "relationship_rebuilt"] } }),
        modifier({ weight: 12, when: { requiredRomanceFlags: ["relationship_committed", "relationship_maintained"] } }),
        modifier({ weight: 8, when: { activeRelationshipMinAffection: 72 } }),
        modifier({ weight: 8, when: { minStats: { mental: 60 } } }),
        modifier({ weight: 6, when: { someFlags: ["family_repair", "showed_up_consistently", "rules_reworked"] } }),
      ],
    }),
    ending({
      id: "love_regret",
      title: "结局：感情上始终留着一块没真正补上的空",
      text: "你不是没有认真喜欢过谁，也不是完全不懂亲密。只是很多次，在要不要更靠近、要不要留下、要不要坦白的时候，你都被现实、沉默、迟疑或惯性的退后拦住了。后来人生继续往前，但那块遗憾一直没有彻底消失。",
      baseWeight: 4,
      require: requirement({
        ...LATE_GAME_REQUIREMENT,
        someFlags: ["missed_love", "solo_pattern", "trust_break", "emotionally_guarded", "hollow_relationship"],
      }),
      weightModifiers: [
        modifier({ weight: 16, when: { maxStats: { happiness: 58 } } }),
        modifier({ weight: 10, when: { noCurrentPartner: true } }),
        modifier({ weight: 8, when: { someFlags: ["career_first", "solo_thirties"] } }),
        modifier({ weight: 10, when: { requiredRomanceFlags: ["relationship_neglected", "value_misaligned"] } }),
        modifier({ weight: 8, when: { maxStats: { mental: 44 } } }),
      ],
    }),
    ending({
      id: "family_anchor",
      title: "结局：把家庭放在很重的位置，也真的守住了它",
      text: "你也许没赢下所有外界意义上的竞争，却在日复一日的照顾、陪伴、修复和承担里，把一些关系真正守成了生活。很多年后回头看，你最有价值的，不是某一段高光，而是你确实让一些人因为你而拥有了更稳的日子。",
      baseWeight: 5,
      require: requirement({
        ...LATE_GAME_REQUIREMENT,
        requiredTags: ["family"],
        minStats: {
          happiness: 62,
          social: 62,
        },
      }),
      weightModifiers: [
        modifier({ weight: 22, when: { someFlags: ["family_priority", "parenting", "caregiver_role"] } }),
        modifier({ weight: 10, when: { someFlags: ["family_repair", "gentle_retirement"] } }),
        modifier({ weight: 8, when: { anyRelationshipStatuses: ["married", "steady"] } }),
        modifier({ weight: 8, when: { someFlags: ["family_dialogue", "warm_home"] } }),
        modifier({ weight: 8, when: { minStats: { familySupport: 68 } } }),
      ],
    }),
    ending({
      id: "health_breakdown",
      title: "结局：很多事都做成了一些，身体却被你长期放在最后",
      text: "你并不是突然垮掉的，而是在很多次“先忙完这阵再说”的累积里，一点点把自己消耗到了边缘。等人生慢下来时，你才发现，原来最先需要被照顾的，早就不是待办清单，而是你自己。",
      baseWeight: 4,
      require: requirement({
        ...LATE_GAME_REQUIREMENT,
        maxStats: {
          health: 44,
        },
        someFlags: ["chronic_stress", "overworked", "health_warning_midlife", "appearance_anxiety"],
      }),
      weightModifiers: [
        modifier({ weight: 20, when: { requiredTags: ["ambition"] } }),
        modifier({ weight: 14, when: { maxStats: { happiness: 52 } } }),
        modifier({ weight: 12, when: { minStats: { stress: 70 } } }),
        modifier({ weight: 8, when: { maxStats: { mental: 42 } } }),
      ],
    }),
    ending({
      id: "speculation_fall",
      title: "结局：投机失利，后半生都在为一次次押错注收拾残局",
      text: "你也抓到过机会，也不是没赢过。只是赌性、侥幸和对“再扛一下也许就过去了”的相信，让你的人生始终带着很强的不稳定感。等尘埃落下时，你会明白，输掉的从来不只是钱。",
      baseWeight: 4,
      require: requirement({
        ...LATE_GAME_REQUIREMENT,
        someFlags: ["speculative_route", "major_bet_loss", "debt_rollover", "last_gamble"],
      }),
      weightModifiers: [
        modifier({ weight: 22, when: { maxStats: { money: 52, happiness: 54 } } }),
        modifier({ weight: 12, when: { requiredTags: ["risk"] } }),
        modifier({ weight: 8, when: { someFlags: ["chronic_stress", "money_anxiety"] } }),
      ],
    }),
    ending({
      id: "growth_reconciliation",
      title: "结局：绕过很多弯，最后还是和自己与过去达成了和解",
      text: "你的人生不是一条笔直向上的线。你做过妥协、走过错路，也在中途被现实、健康或关系逼停过几次。但你没有一直停在原地。后来你最珍贵的，不是少犯错，而是终于学会在错误和失去之后，重新搭一套更像自己的生活。",
      baseWeight: 6,
      require: requirement({
        ...LATE_GAME_REQUIREMENT,
        someFlags: ["second_growth", "family_repair", "therapy_started", "late_love", "memoir_written", "recovery_turn"],
      }),
      weightModifiers: [
        modifier({ weight: 18, when: { requiredTags: ["selfhood"] } }),
        modifier({ weight: 12, when: { minStats: { happiness: 60 } } }),
        modifier({ weight: 10, when: { someFlags: ["emotional_honesty", "boundary_awareness"] } }),
        modifier({ weight: 10, when: { someFlags: ["self_acceptance_seed", "second_growth", "relationship_rebuilt"] } }),
        modifier({ weight: 8, when: { minStats: { mental: 60 } } }),
        modifier({ weight: 6, when: { someFlags: ["recovery_turn", "therapy_started"] } }),
      ],
    }),
    ending({
      id: "maker_path",
      title: "结局：把兴趣和手艺真的熬成了你的人生底色",
      text: "你没有让真正喜欢的东西只停留在年轻时。一路上它也许不是最赚钱、最稳或者最容易被理解的选择，但你还是把作品、手艺、表达和长期投入，慢慢变成了生活的一部分。它未必喧哗，却非常像你。",
      baseWeight: 5,
      require: requirement({
        ...LATE_GAME_REQUIREMENT,
        requiredTags: ["craft"],
      }),
      weightModifiers: [
        modifier({ weight: 20, when: { someFlags: ["signature_work", "long_term_hobby", "portfolio_path", "memoir_written"] } }),
        modifier({ weight: 10, when: { minStats: { happiness: 62, intelligence: 58 } } }),
        modifier({ weight: 8, when: { minStats: { discipline: 58 } } }),
      ],
    }),
    ending({
      id: "ordinary_ending",
      title: "结局：普通但真实的一生",
      text: "你的人生并没有被某一种标签完全概括。它有做对的时候，也有拧巴和遗憾；有阶段性的得意，也有很多不想重来的片段。可正因为它不够整齐，反而更像真实生活本身：由无数具体选择慢慢拼起来，最后成为了你。",
      baseWeight: 2,
      require: requirement({
        ...LATE_GAME_REQUIREMENT,
      }),
      weightModifiers: [
        modifier({ weight: 6, when: { minStats: { happiness: 50 } } }),
      ],
    }),
  ];
})();

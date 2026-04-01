(function () {
  "use strict";

  /*
    家庭背景手动编辑说明：
    - 每个 background({ ... }) 就是一种开局家庭条件模板。
    - dimensions 用于 UI 展示家庭画像。
    - apply 复用事件 mutation 结构，可直接改初始属性、flags、tags。
    - 后续事件可以通过这些 flags / tags 精准接入不同家庭路线。
  */

  function toList(value) {
    return Array.isArray(value) ? value.slice() : [];
  }

  function toStats(value) {
    return value && typeof value === "object" ? { ...value } : {};
  }

  function background(value) {
    const source = value && typeof value === "object" ? value : {};

    return {
      id: typeof source.id === "string" ? source.id : "",
      name: typeof source.name === "string" ? source.name : "普通家庭",
      summary: typeof source.summary === "string" ? source.summary : "",
      description: typeof source.description === "string" ? source.description : "",
      details: toList(source.details),
      dimensions: source.dimensions && typeof source.dimensions === "object" ? { ...source.dimensions } : {},
      weight: typeof source.weight === "number" ? source.weight : 1,
      apply: {
        effects: {
          age: 0,
          stats: toStats(source.apply && source.apply.effects ? source.apply.effects.stats : {})
        },
        addFlags: toList(source.apply && source.apply.addFlags),
        removeFlags: toList(source.apply && source.apply.removeFlags),
        addTags: toList(source.apply && source.apply.addTags),
        removeTags: toList(source.apply && source.apply.removeTags),
        addRomanceFlags: toList(source.apply && source.apply.addRomanceFlags),
        removeRomanceFlags: toList(source.apply && source.apply.removeRomanceFlags),
        relationshipEffects: toList(source.apply && source.apply.relationshipEffects),
        setActiveRelationship:
          source.apply && typeof source.apply.setActiveRelationship === "string"
            ? source.apply.setActiveRelationship
            : null,
        clearActiveRelationship: Boolean(source.apply && source.apply.clearActiveRelationship),
        log: source.apply && typeof source.apply.log === "string" ? source.apply.log : ""
      }
    };
  }

  window.LIFE_FAMILY_BACKGROUNDS = [
    background({
      id: "high_resource_high_pressure",
      name: "资源充足但要求极高",
      summary: "你出生在一个条件不差、眼界不低的家庭。资源并不缺，但很多支持都和成绩、体面、结果绑定在一起。",
      description: "在这样的家里，机会来得更早，比较也来得更早。你会更容易接触到好的教育和城市视野，但也更容易把“不够优秀”理解成一种危险。",
      details: [
        "补习、兴趣班、信息差和择校资源都相对充足。",
        "父母未必不爱你，只是表达爱的方式常常带着结果导向。",
        "你很早就会感受到被期待、被安排、被拿去比较。 "
      ],
      dimensions: {
        家庭财富: "较高",
        父母关系: "表面稳定",
        教育方式: "高要求",
        家庭支持: "有条件的支持",
        居住环境: "教育资源充足",
        情绪氛围: "紧绷"
      },
      weight: 1,
      apply: {
        effects: {
          stats: {
            money: 18,
            intelligence: 8,
            familySupport: 6,
            stress: 12,
            discipline: 8,
            mental: -4,
            happiness: -2
          }
        },
        addFlags: [
          "resource_rich_home",
          "family_wealth_high",
          "family_expectation_high",
          "parents_surface_stable",
          "comparison_ready_home"
        ],
        addTags: ["ambition", "pressure"],
        log: "你长大的地方不缺资源，但“做到更好”几乎一直是家里的默认语气。"
      }
    }),
    background({
      id: "warm_average_home",
      name: "经济普通但关系温暖",
      summary: "你出生在一个谈不上显赫、却常常愿意把情绪和饭桌都留给彼此的家里。很多支持未必值钱，却很稳。",
      description: "这个家庭不一定能替你铺最远的路，但会尽量让你在跌倒时知道自己不是一个人。它带来的底气，常常比额外一门补习更难得。",
      details: [
        "家里会认真听你说话，也愿意在能力范围内托住你。",
        "对成绩有期待，但很少用羞辱和比较来推进。",
        "你更可能在早期形成稳定的依恋感和表达能力。 "
      ],
      dimensions: {
        家庭财富: "普通",
        父母关系: "较稳定",
        教育方式: "支持型",
        家庭支持: "稳定而温和",
        居住环境: "普通但够用",
        情绪氛围: "温暖"
      },
      weight: 1.2,
      apply: {
        effects: {
          stats: {
            money: 4,
            happiness: 10,
            mental: 10,
            social: 5,
            familySupport: 18,
            stress: -4,
            discipline: 2
          }
        },
        addFlags: ["warm_home", "parents_close", "emotion_safe_home", "parental_support"],
        addTags: ["family", "stability"],
        log: "你从小更容易感受到被接住。那种底层的安心感，会慢慢影响你后来怎么看待关系和风险。"
      }
    }),
    background({
      id: "tight_but_lifting_home",
      name: "经济拮据但父母努力托举",
      summary: "家里并不宽裕，很多钱都要掰开花，但大人愿意把能省下来的部分尽量往你身上倾斜。",
      description: "你会更早理解钱的重量，也更早知道“机会”不是天然平均分配的。可你同样会看见，一些大人的努力是真正往上托人的力量。",
      details: [
        "家庭预算紧，但重要节点会尽力替你争取。",
        "你会更早接触责任感、节制和现实计算。",
        "这种背景容易同时催生上进心与压力感。 "
      ],
      dimensions: {
        家庭财富: "偏低",
        父母关系: "共同撑家",
        教育方式: "节制但投入",
        家庭支持: "吃力但真心",
        居住环境: "一般",
        情绪氛围: "克制而有韧性"
      },
      weight: 1.1,
      apply: {
        effects: {
          stats: {
            money: -8,
            happiness: 2,
            mental: 2,
            familySupport: 10,
            stress: 8,
            discipline: 8,
            intelligence: 3
          }
        },
        addFlags: [
          "financial_tight_home",
          "upward_mobility_home",
          "responsibility_seed",
          "parental_support"
        ],
        addTags: ["responsibility", "growth"],
        log: "你很早就知道日子不能乱花，也知道有人在背后用自己的辛苦托着你往上走。"
      }
    }),
    background({
      id: "conflict_heavy_home",
      name: "家庭冲突较多",
      summary: "这个家没有真正坏掉，却常常处在失衡边缘。争吵、冷战、指责、迁怒，都会比安稳更常见。",
      description: "你会更早学会看气氛、躲风险、替自己找角落，也可能更难相信关系真的可以温和长久。很多成年后的敏感和控制感，都可能从这里开始。",
      details: [
        "父母关系并不稳定，孩子很难真正置身事外。",
        "家里情绪起伏大，你会提早形成警觉和防备。",
        "你对亲密关系既可能更渴望，也可能更害怕。 "
      ],
      dimensions: {
        家庭财富: "不稳定",
        父母关系: "冲突频繁",
        教育方式: "情绪化",
        家庭支持: "忽高忽低",
        居住环境: "看运气",
        情绪氛围: "紧绷"
      },
      weight: 1,
      apply: {
        effects: {
          stats: {
            happiness: -10,
            mental: -10,
            familySupport: -14,
            stress: 14,
            intelligence: 2,
            social: -2
          }
        },
        addFlags: ["parents_conflict", "tense_home", "emotional_vigilance", "family_conflict_seed"],
        addTags: ["wound", "pressure"],
        log: "你从小就知道，一个家的空气不稳时，孩子会先学会沉默和警觉。"
      }
    }),
    background({
      id: "overcontrolled_home",
      name: "过度控制型家庭",
      summary: "家里对你的投入很明确，规则也很明确。只是很多安排并不真的问你想不想，而是默认“为你好”就足够成立。",
      description: "你会更容易长出执行力、自律和成绩感，也更可能在成长中经历边界混乱、表达困难，甚至很晚才知道自己真正想要什么。",
      details: [
        "家里会替你决定很多事，包括时间、兴趣和交友尺度。",
        "顺从往往能换来表扬，反抗则容易被视为不懂事。",
        "你容易在自律和压抑之间同时长大。 "
      ],
      dimensions: {
        家庭财富: "中等偏上",
        父母关系: "表面协调",
        教育方式: "控制型",
        家庭支持: "投入但强干预",
        居住环境: "较好",
        情绪氛围: "有序但压迫"
      },
      weight: 1,
      apply: {
        effects: {
          stats: {
            intelligence: 5,
            discipline: 12,
            familySupport: 4,
            stress: 10,
            happiness: -5,
            mental: -5
          }
        },
        addFlags: ["control_family", "family_expectation_high", "structured_home", "comparison_ready_home"],
        addTags: ["discipline", "pressure"],
        log: "你拥有一套很早建立起来的规则感，但“我的意愿”这件事，并没有被充分练习过。"
      }
    }),
    background({
      id: "free_range_home",
      name: "自由放养型家庭",
      summary: "家里对你不是没有爱，只是很少真的细管。你拥有比很多同龄人更多的自由，也更早知道很多事得靠自己补齐。",
      description: "这种家庭会给你空间，也会留下一些空白。你可能更独立、更会自我定义，但也可能在关键阶段缺乏稳定引导，需要自己摸出一条路。",
      details: [
        "规则不算多，但支持也常常不够具体。",
        "你更容易长出独立感和探索欲。",
        "一部分重要能力需要你自己慢慢练出来。 "
      ],
      dimensions: {
        家庭财富: "普通",
        父母关系: "各忙各的",
        教育方式: "放养型",
        家庭支持: "松散",
        居住环境: "普通",
        情绪氛围: "自由但有缺口"
      },
      weight: 1,
      apply: {
        effects: {
          stats: {
            happiness: 4,
            social: 4,
            familySupport: -4,
            discipline: -6,
            intelligence: 2,
            mental: 1,
            stress: -2
          }
        },
        addFlags: ["free_range_home", "emotionally_independent", "self_definition_seed"],
        addTags: ["selfhood", "independence"],
        log: "你从小就更像在自己长大。自由给了你空间，也把一部分兜底的工作留给了你自己。"
      }
    })
  ];
})();

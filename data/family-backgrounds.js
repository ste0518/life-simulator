(function () {
  "use strict";

  /*
    家庭背景手动编辑说明：
    - 每个 background({ ... }) 就是一种独立可改的开局模板。
    - dimensions 统一使用六个维度：
      家庭财富 / 父母关系 / 家庭教育方式 / 家庭支持度 / 教育资源 / 情绪氛围
    - apply 仍复用事件 mutation 结构，可直接改初始属性、flags、tags。
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
      name: "富裕但高压控制型家庭",
      summary: "资源和安排都不缺，要求也从来不低。很多支持都与结果绑定，很多爱都带着控制感。",
      description: "你会更早接触到好的学校、补习和城市信息，也会更早学会比较、竞争和对失败的敏感。这个家庭给你起跑优势，也让你不容易轻松。",
      details: [
        "补习、兴趣班、择校信息和视野都明显更充足。",
        "父母更关心结果是否体面，而不是你过程里有没有真正舒服。",
        "你很容易长出执行力，也很容易把爱误认成表现换来的东西。"
      ],
      dimensions: {
        家庭财富: "较高",
        父母关系: "表面稳定",
        家庭教育方式: "高压控制",
        家庭支持度: "强但有条件",
        教育资源: "很充足",
        情绪氛围: "紧绷"
      },
      apply: {
        effects: {
          stats: {
            money: 18,
            intelligence: 8,
            discipline: 10,
            familySupport: 6,
            stress: 14,
            mental: -6,
            happiness: -4
          }
        },
        addFlags: ["resource_rich_home", "family_wealth_high", "family_expectation_high", "control_family", "comparison_ready_home"],
        addTags: ["ambition", "pressure"],
        log: "你从小就知道，好的资源往往不是白拿的，它们常常连着期待、安排和被比较。"
      }
    }),
    background({
      id: "warm_average_home",
      name: "普通但温暖支持型家庭",
      summary: "家里不算富裕，却很愿意听你说话，也愿意在能力范围内托你一把。",
      description: "你拿到的不是最夸张的起跑线，而是一种更稳定的底层安全感。这会影响你后面怎么看待关系、风险和失败后的恢复能力。",
      details: [
        "成绩重要，但很少被拿来羞辱和比较。",
        "家人会在能力范围内替你兜底，也会认真听你的真实状态。",
        "你更容易在成长早期形成稳定表达和求助能力。"
      ],
      dimensions: {
        家庭财富: "普通",
        父母关系: "较稳定",
        家庭教育方式: "支持引导",
        家庭支持度: "稳定温和",
        教育资源: "中等",
        情绪氛围: "温暖"
      },
      weight: 1.15,
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
        log: "你小时候未必什么都能拿到，但比较容易感受到被接住。"
      }
    }),
    background({
      id: "tight_but_lifting_home",
      name: "经济困难但父母努力托举",
      summary: "家里钱紧，大人却在能省的地方都往自己身上省，尽量把机会留给你。",
      description: "你会更早理解钱的重量和阶层差异，也会更早明白，有人是真的在咬着牙往上托你。它会让你更现实，也更容易背上责任感。",
      details: [
        "重要节点会尽力替你争取，但每一步都要认真算。",
        "你很早就知道家里不是没有爱，只是余量很少。",
        "这种背景容易同时催生上进心、愧疚感和强责任感。"
      ],
      dimensions: {
        家庭财富: "偏低",
        父母关系: "一起撑家",
        家庭教育方式: "节制投入",
        家庭支持度: "吃力但真心",
        教育资源: "有限但尽力争取",
        情绪氛围: "克制而有韧性"
      },
      weight: 1.05,
      apply: {
        effects: {
          stats: {
            money: -10,
            happiness: 2,
            mental: 2,
            familySupport: 10,
            stress: 8,
            discipline: 8,
            intelligence: 4
          }
        },
        addFlags: ["financial_tight_home", "upward_mobility_home", "responsibility_seed", "parental_support"],
        addTags: ["responsibility", "growth"],
        log: "你很早就知道，很多看似普通的选择，对家里来说都是认真权衡过的。"
      }
    }),
    background({
      id: "conflict_heavy_home",
      name: "冲突频繁的家庭",
      summary: "争吵、冷战、压抑和迁怒几乎是这个家的常态，你很难真正置身事外。",
      description: "这种家庭会让孩子很早学会看气氛、躲风险、压情绪。它不只影响童年，也会深深影响你成年后如何靠近别人。",
      details: [
        "父母关系反复拉扯，家庭氛围常常不稳定。",
        "你很早形成警觉、退让或提前安抚他人的反应方式。",
        "亲密关系对你既可能很重要，也可能让你下意识想躲。"
      ],
      dimensions: {
        家庭财富: "不稳定",
        父母关系: "冲突频繁",
        家庭教育方式: "情绪化",
        家庭支持度: "忽高忽低",
        教育资源: "看运气",
        情绪氛围: "压迫"
      },
      apply: {
        effects: {
          stats: {
            happiness: -12,
            mental: -12,
            familySupport: -14,
            stress: 16,
            social: -2,
            intelligence: 2
          }
        },
        addFlags: ["parents_conflict", "tense_home", "emotional_vigilance", "family_conflict_seed"],
        addTags: ["wound", "pressure"],
        log: "你从很小就知道，家里的空气不稳时，孩子会先学会沉默。"
      }
    }),
    background({
      id: "free_range_home",
      name: "过度放养型家庭",
      summary: "自由是真自由，缺位也是真缺位。你被允许自己长大，也不得不自己长大。",
      description: "这种家会给你空间、探索欲和独立感，但关键阶段往往缺少足够具体的引导与兜底。你能更早定义自己，也更容易在秩序上吃亏。",
      details: [
        "规则不多，但支持往往不够细。",
        "你更容易发展兴趣和个人风格，也更容易缺乏稳定节奏。",
        "很多本该被教会的能力，需要你自己补。"
      ],
      dimensions: {
        家庭财富: "普通",
        父母关系: "各忙各的",
        家庭教育方式: "自由放养",
        家庭支持度: "松散",
        教育资源: "普通",
        情绪氛围: "自由但有缺口"
      },
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
        log: "自由给了你空间，也把一部分兜底和管理留给了你自己。"
      }
    }),
    background({
      id: "single_parent_absent_home",
      name: "单亲或照顾缺失型家庭",
      summary: "家里并非一定没有爱，但照顾和在场明显不完整。很多时候，你得自己消化很多本该被分担的东西。",
      description: "这种背景可能让你更早独立，也可能让你在依恋、求助和安全感上留下空洞。它既不是纯粹坏运气，也会逼出很强的生存能力。",
      details: [
        "陪伴和照料容易出现长期缺口。",
        "家里可能很辛苦，也可能根本顾不上情绪支持。",
        "你容易同时拥有韧性和缺安全感。"
      ],
      dimensions: {
        家庭财富: "偏低到普通",
        父母关系: "分离或缺席",
        家庭教育方式: "现实求生",
        家庭支持度: "不稳定",
        教育资源: "有限",
        情绪氛围: "空缺感明显"
      },
      apply: {
        effects: {
          stats: {
            money: -4,
            happiness: -6,
            mental: -6,
            familySupport: -10,
            discipline: 4,
            social: -2,
            stress: 8
          }
        },
        addFlags: ["care_absence_home", "migrant_home", "emotionally_independent", "solo_pattern"],
        addTags: ["selfhood", "distance"],
        log: "你很早就对“缺席”不陌生，也因此比很多同龄人更早学会自己扛。"
      }
    }),
    background({
      id: "grade_first_repressed_home",
      name: "重成绩但情感压抑的家庭",
      summary: "家里很重学习，很少真正谈感受。很多评价都围着成绩、升学和体面转。",
      description: "这种家庭容易把你推成高功能的人，也容易让你把脆弱、羞耻和需求长期收起来。你在成绩上可能更有优势，在关系上却未必轻松。",
      details: [
        "情绪常被默认不重要，成绩是最常用的语言。",
        "家里会鼓励你赢，却不一定接得住你的低谷。",
        "你容易形成高自律和高内耗并存的状态。"
      ],
      dimensions: {
        家庭财富: "中等",
        父母关系: "功能性维持",
        家庭教育方式: "成绩导向",
        家庭支持度: "以结果为主",
        教育资源: "较好",
        情绪氛围: "压抑"
      },
      apply: {
        effects: {
          stats: {
            intelligence: 7,
            discipline: 10,
            happiness: -6,
            mental: -6,
            stress: 12,
            familySupport: 2
          }
        },
        addFlags: ["family_expectation_high", "emotion_suppressed_home", "achievement_compensation"],
        addTags: ["ambition", "pressure"],
        log: "你很早就知道怎么做一个看起来靠谱的人，却不一定知道怎么好好表达自己。"
      }
    }),
    background({
      id: "small_town_limited_home",
      name: "小城稳定但资源有限的家庭",
      summary: "家里整体不坏，日子也算稳，只是城市和资源边界摆在那里，很多可能性来得更晚。",
      description: "这种背景会给你稳定、熟人社会和较强的归属感，也会让你更早感受到信息差、平台差和见识半径的限制。",
      details: [
        "生活成本和家庭关系相对稳定。",
        "机会不一定少，但常常比大城市来得慢。",
        "你可能更重视稳妥，也可能更想往外走。"
      ],
      dimensions: {
        家庭财富: "普通",
        父母关系: "稳定",
        家庭教育方式: "务实保守",
        家庭支持度: "稳定",
        教育资源: "有限",
        情绪氛围: "平稳"
      },
      apply: {
        effects: {
          stats: {
            happiness: 4,
            familySupport: 8,
            social: 3,
            intelligence: 1,
            stress: -1
          }
        },
        addFlags: ["small_world_comfort", "hometown_tie", "resource_gap_seed"],
        addTags: ["stability", "family"],
        log: "你长大的地方让人安心，也让你很早就知道世界并不是同样大小地向每个人打开。"
      }
    }),
    background({
      id: "merchant_volatile_home",
      name: "经商家庭，财富波动大",
      summary: "家里有时很宽裕，有时又突然紧起来。你对钱和风险的理解，从来都不是线性的。",
      description: "在这种家里长大的人，往往更早见识机会和风险一起进场的样子。你可能更懂判断和胆量，也更容易被波动感塑造。",
      details: [
        "家里可能一阵轻松，一阵紧张，稳定感并不恒定。",
        "你更早听见生意、回款、周转和押注这些词。",
        "容易发展出冒险心态，也容易形成钱的焦虑。"
      ],
      dimensions: {
        家庭财富: "波动较大",
        父母关系: "围着生计运转",
        家庭教育方式: "现实实战型",
        家庭支持度: "随经营起伏",
        教育资源: "忽多忽少",
        情绪氛围: "起伏明显"
      },
      apply: {
        effects: {
          stats: {
            money: 8,
            discipline: 2,
            social: 4,
            stress: 6,
            mental: -2,
            career: 2
          }
        },
        addFlags: ["merchant_home", "risk_exposed_early", "money_sensitivity", "speculative_route"],
        addTags: ["risk", "growth"],
        log: "你很早就看见，钱不仅能带来自由，也会带来波动、判断和侥幸。"
      }
    }),
    background({
      id: "respectable_but_distant_home",
      name: "表面体面但关系疏离的家庭",
      summary: "家里看起来过得去，也讲体面和规矩，但真正亲密、松弛和被理解的部分并不多。",
      description: "这种家庭不一定制造剧烈创伤，却容易制造一种长期的疏离感。你学会体面、边界和自我要求，也容易在重要关系里感到不够被看见。",
      details: [
        "外人眼里家里没什么问题，内里却缺乏真正靠近。",
        "你会更懂分寸，也可能更难袒露需要。",
        "这种背景容易让你显得成熟，却不一定轻松。"
      ],
      dimensions: {
        家庭财富: "中等偏上",
        父母关系: "疏离克制",
        家庭教育方式: "讲体面与规矩",
        家庭支持度: "功能性支持",
        教育资源: "较好",
        情绪氛围: "冷淡"
      },
      apply: {
        effects: {
          stats: {
            money: 8,
            intelligence: 4,
            discipline: 4,
            happiness: -4,
            mental: -5,
            familySupport: -2,
            social: 1
          }
        },
        addFlags: ["parents_surface_stable", "emotionally_guarded", "respectability_home", "solo_pattern"],
        addTags: ["stability", "distance"],
        log: "你学会了体面和分寸，却不一定学会了怎样在重要关系里真正松下来。"
      }
    })
  ];
})();

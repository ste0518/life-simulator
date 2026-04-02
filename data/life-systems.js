(function () {
  "use strict";

  /**
   * 人生系统集中配置（便于手动改数值 / 商品 / 礼物规则）
   * - overseasCostConfig / loanConfig：留学花费与贷款
   * - shopItems：商店商品
   * - giftEffects：送礼结果（按礼物 id + 关系阶段粗分）
   * - relationshipMilestones：确认关系等阈值参考（引擎内也会用到部分逻辑）
   * - childSystem：子女系统默认参数
   * - educationToCareerHints：文档式映射说明（真正门槛在 routes.js 的 conditions 里维护）
   */

  const overseasCostConfig = {
    tuitionCost: 30,
    /** 可支配现金 ≥ 此值才允许「现款付首期留学开销」（会扣 tuitionCost） */
    cashLiquidityMin: 46,
    /** 每 5 点家庭支持，阈值 -1，最低不低于 absoluteCashFloor */
    familySupportThresholdDiscountPer5: 1,
    absoluteCashFloor: 34,
    /** 富裕家庭标签：再额外降低门槛 */
    wealthyHomeThresholdBonus: 8,
    wealthyHomeFlags: ["resource_rich_home", "family_wealth_high", "privileged_home_finance"]
  };

  const loanConfig = {
    loanAmount: 30,
    /** 贷款入学后叠加在海外 financePressure 上 */
    financePressureBonus: 28,
    /** 额外压力与负债感 */
    addStress: 4,
    addDebtStat: 30,
    minIntelligence: 24,
    minDiscipline: 18,
    minFamilySupport: 20,
    /** 满足任一标签时，家庭支持底线 -5 */
    familySupportBypassFlags: ["mentor_support", "parental_support", "family_expectation_high"],
    minFamilySupportWithBypass: 15
  };

  const childSystem = {
    minParentAge: 24,
    maxParentAgeForPrompt: 42,
    /** 触发「是否生育」讨论：需要稳定关系状态 */
    partnerStatuses: ["steady", "married", "dating", "passionate", "long_distance_dating"],
    minMoneySoft: 18,
    minCareerSoft: 12
  };

  const relationshipMilestones = {
    /** 确认关系节点：好感、信任、阶段 */
    confirmRelationship: {
      minAffection: 56,
      minTrust: 44,
      fromStatuses: ["ambiguous", "close", "mutual_crush", "familiar"],
      targetStatus: "dating"
    }
  };

  /** 送礼判定：expensiveThreshold 以上且关系浅可能让对方有压力 */
  const giftEffects = {
    gift_snack_hamper: {
      label: "零食礼盒",
      expensiveThreshold: 10,
      fitTraitTags: [],
      mismatchPenalty: { affection: -2, tension: 6 },
      goodBonus: { affection: 5, trust: 3, theirInterest: 4 },
      neutralBonus: { affection: 2, familiarity: 3 },
      expensiveEarlyPenalty: { affection: 1, tension: 8, trust: -2 }
    },
    gift_book_literature: {
      label: "精装文集",
      expensiveThreshold: 14,
      fitTraitTags: ["细腻", "安静", "阅读"],
      mismatchPenalty: { affection: 0, tension: 3 },
      goodBonus: { affection: 7, trust: 5, theirInterest: 5 },
      neutralBonus: { affection: 3, familiarity: 4 },
      expensiveEarlyPenalty: { affection: 2, tension: 5, trust: -1 }
    },
    gift_necklace_modest: {
      label: "不算张扬的小项链",
      expensiveThreshold: 18,
      fitTraitTags: [],
      mismatchPenalty: { affection: -4, tension: 10 },
      goodBonus: { affection: 8, trust: 4, commitment: 6 },
      neutralBonus: { affection: 4, tension: 2 },
      expensiveEarlyPenalty: { affection: -2, tension: 12, trust: -4 }
    }
  };

  const shopItems = [
    {
      id: "daily_bento_upgrade",
      name: "好好吃一顿热便当",
      category: "日常用品",
      price: 5,
      effects: { stats: { happiness: 2, health: 1, stress: -1 } },
      log: "你用一顿像样一点的饭，把自己从凑合里捞回来一小会儿。"
    },
    {
      id: "study_desk_lamp",
      name: "护眼台灯",
      category: "学习用品",
      price: 11,
      effects: { stats: { discipline: 2, intelligence: 1, money: -1 } },
      log: "你把学习环境收拾得更像样，熬夜时眼睛和心情都少受一点罪。"
    },
    {
      id: "hoodie_basic",
      name: "基础款外套",
      category: "服饰",
      price: 16,
      effects: { stats: { happiness: 2, social: 1, money: -2 } },
      log: "新衣服不解决所有问题，但至少让你在出门见人时少一分心虚。"
    },
    {
      id: "gift_snack_hamper",
      name: "零食礼盒（可送人）",
      category: "礼物",
      price: 9,
      grantInventory: { itemId: "gift_snack_hamper", count: 1 },
      effects: { stats: { happiness: 1 } },
      log: "你买下一份可以递到别人手里的甜。"
    },
    {
      id: "gift_book_literature",
      name: "精装文集（可送人）",
      category: "礼物",
      price: 15,
      grantInventory: { itemId: "gift_book_literature", count: 1 },
      effects: { stats: { intelligence: 1, happiness: 1 } },
      log: "你挑了一本像话的书，准备在某个时刻送出去。"
    },
    {
      id: "gift_necklace_modest",
      name: "小项链（可送人）",
      category: "礼物",
      price: 22,
      grantInventory: { itemId: "gift_necklace_modest", count: 1 },
      effects: { stats: { happiness: 1, stress: 1 } },
      log: "这件礼物不便宜，你清楚它自带分量。"
    },
    {
      id: "gym_month",
      name: "健身月卡",
      category: "健康",
      price: 14,
      effects: { stats: { health: 4, stress: -2, money: -1 } },
      log: "你把身体重新登记进日程里，哪怕只是短期。"
    },
    {
      id: "game_night_ticket",
      name: "演出 / 游戏之夜门票",
      category: "娱乐",
      price: 9,
      effects: { stats: { happiness: 3, social: 2, stress: -1, money: -1 } },
      log: "你允许自己浪费一晚在热闹里，给情绪找个出口。"
    }
  ];

  const educationToCareerHints = [
    "学历门槛在 data/routes.js 的 LIFE_CAREER_ROUTES 每条 route.conditions 里维护（educationRouteIds / excludedEducationRouteIds / someFlags）。",
    "留学路线 id：overseas_research_path、overseas_practical_path、overseas_art_path。",
    "职校 / 技能：gaokao_vocational_college、non_gaokao_skill_path。",
    "直接工作：direct_work_route。"
  ];

  function ev(source) {
    return source;
  }

  function ch(source) {
    return source;
  }

  /** 追加事件（加载顺序：须在 route-events 之后） */
  const lifeSystemExtraEvents = [
    ev({
      id: "life_shop_street",
      stage: "young_adult",
      title: "街边的店，总在你心软的时候招手",
      text: "你路过商场、便利店和网店弹窗，钱包并不厚，但有时候一笔小钱就能换来一点像样的安慰、效率，或者一份可以送出去的礼物。\n\n当前积蓄大致还能支撑你挑几样不同的东西——真正要紧的是，别在情绪最差的时候用刷卡当止痛。",
      minAge: 16,
      maxAge: 55,
      weight: 20,
      repeatable: true,
      tags: ["shop", "money", "misc"],
      choices: shopItems
        .map((item) =>
          ch({
            text: "买下「" + item.name + "」",
            customAction: "shop_purchase",
            customPayload: { itemId: item.id },
            conditions: {}
          })
        )
        .concat([
          ch({
            text: "什么也不买，空着手走开。",
            log: "你把钱攥回口袋里，决定别让消费替你做决定。"
          })
        ])
    }),
    ev({
      id: "life_gift_moment",
      stage: "family",
      title: "把礼物递出去之前，你会多想半拍",
      text: "你手里攥着准备好的东西，心里却在算：会不会太贵、会不会太轻、会不会在不合时宜的时候把关系推歪。\n\n{name}，如果你真的要送，就得承认这也是在把自己的心意放到秤上。",
      minAge: 16,
      maxAge: 50,
      weight: 11,
      repeatable: true,
      tags: ["romance", "gift", "social"],
      conditions: {
        activeRelationshipStatuses: [
          "ambiguous",
          "close",
          "dating",
          "passionate",
          "steady",
          "mutual_crush",
          "long_distance_dating"
        ]
      },
      choices: [
        ch({
          text: "把零食礼盒递过去，装作只是顺手。",
          customAction: "give_relationship_gift",
          customPayload: { itemId: "gift_snack_hamper" },
          conditions: { inventoryMin: { gift_snack_hamper: 1 } },
          log: "礼物递出去的那一刻，你反而比收礼的人更先松了口气。"
        }),
        ch({
          text: "把精装文集送出去，说你觉得对方会读。",
          customAction: "give_relationship_gift",
          customPayload: { itemId: "gift_book_literature" },
          conditions: { inventoryMin: { gift_book_literature: 1 } },
          log: "对方接过书时停顿的那一下，比任何节日贺词都更真实。"
        }),
        ch({
          text: "把小项链拿出来——你知道这很冒险。",
          customAction: "give_relationship_gift",
          customPayload: { itemId: "gift_necklace_modest" },
          conditions: { inventoryMin: { gift_necklace_modest: 1 } },
          log: "这件礼物把话说得很重，你们都得面对它带来的分量。"
        }),
        ch({
          text: "最后还是把东西收回去，改天再说。",
          effects: { stats: { stress: 1, mental: 1 } },
          log: "你告诉自己只是时机不对，但那份没送出去的东西会在心里多停一阵子。"
        })
      ]
    }),
    ev({
      id: "romance_confirm_relationship_ask",
      stage: "young_adult",
      title: "再往前走一步，就要给这段关系一个名字",
      text: "你们已经暧昧、拉扯、试探了很久。再拖下去，要么变成默认，要么在某次误会里突然断掉。\n\n{name}，如果你开口，就会把两个人一起推到必须正面回答的地方。",
      minAge: 17,
      maxAge: 32,
      weight: 16,
      tags: ["romance", "milestone"],
      conditions: {
        activeRelationshipMinAffection: 56,
        activeRelationshipMinTrust: 44,
        activeRelationshipStatuses: ["ambiguous", "close", "mutual_crush", "familiar"]
      },
      choices: [
        ch({
          text: "认真问一句：我们要不要正式在一起。",
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 4,
              commitment: 10,
              trust: 4,
              status: "dating",
              history: "你们把关系说破了，也把它接到了更亮的地方。"
            }
          ],
          addRomanceFlags: ["relationship_confirmed"],
          addFlags: ["milestone_confirmed_relationship"],
          log: "确认关系不是结局，只是把后面的难和幸福都提前合法化了。"
        }),
        ch({
          text: "再等等，你害怕一旦命名就会失去退路。",
          effects: { stats: { stress: 3, mental: -1 } },
          relationshipEffects: [
            {
              targetId: "$active",
              tension: 5,
              theirInterest: -2,
              history: "你想逃开那个必须回答的瞬间，对方眼里的光也暗了一点。"
            }
          ]
        })
      ]
    }),
    ev({
      id: "romance_dating_routine_pressure",
      stage: "family",
      title: "在一起之后，日常才开始真正磨损人",
      text: "约会、节日、吃醋、和好、时间分配……这些词不再浪漫，它们变成日历上的具体冲突。\n\n{activeLoveName} 和你都在学：怎么在忙碌、家庭和各自脾气里，把「我们」留出一席之地。",
      minAge: 18,
      maxAge: 40,
      weight: 12,
      repeatable: true,
      tags: ["romance", "dating"],
      conditions: {
        activeRelationshipStatuses: ["dating", "passionate", "steady", "long_distance_dating"]
      },
      choices: [
        ch({
          text: "把周末完整留给对方，工作邮件先静音。",
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 3,
              commitment: 4,
              trust: 3,
              history: "你用行动告诉对方：你在场，而且优先。"
            }
          ],
          effects: { stats: { career: -1, happiness: 3, stress: -1 } }
        }),
        ch({
          text: "起了一次硬冲突，但晚上还是把话说明白了。",
          relationshipEffects: [
            {
              targetId: "$active",
              tension: 6,
              trust: 4,
              continuity: 4,
              history: "吵得很真，也和得很真。"
            }
          ],
          effects: { stats: { stress: 2, mental: 1 } }
        }),
        ch({
          text: "用一次像样的约会补上缺席——钱花了，缝隙还在。",
          effects: { stats: { money: -6, happiness: 2, stress: 2 } },
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 2,
              tension: 3,
              history: "见面迟到、结束的拥抱却很用劲。"
            }
          ]
        })
      ]
    }),
    ev({
      id: "child_decision_partner_talk",
      stage: "family",
      title: "要不要孩子，从来不是一个人的念头",
      text: "你们站在成年人的中央：钱、房、双方父母、工作强度、感情底牌，全都会被卷进这个问题里。\n\n{activeLoveName} 看着你，等的不只是一个答案，而是一种共同生活的方向。",
      minAge: 24,
      maxAge: 42,
      weight: 15,
      tags: ["family", "child", "milestone"],
      conditions: {
        maxChildCount: 0,
        activeRelationshipStatuses: ["steady", "married", "dating", "passionate", "long_distance_dating"],
        minStats: { happiness: 30 }
      },
      choices: [
        ch({
          text: "认真说：想要，但希望把节奏握在自己手里。",
          customAction: "child_path_decision",
          customPayload: { path: "planning", addCount: 0 },
          effects: { stats: { familySupport: 2, stress: 2 } },
          addFlags: ["wants_child_planned"],
          log: "你们把「要孩子」从情绪话头拉成了可以一起算账、一起排队承担的决定。"
        }),
        ch({
          text: "坦白现在扛不住，想先稳住事业和钱。",
          customAction: "child_path_decision",
          customPayload: { path: "postpone", addCount: 0 },
          effects: { stats: { career: 2, stress: 3, happiness: -2 } },
          addFlags: ["child_postponed_money"],
          relationshipEffects: [
            {
              targetId: "$active",
              tension: 4,
              trust: 2,
              history: "关于孩子的讨论里，现实被摆上了桌，没有人轻松。"
            }
          ]
        }),
        ch({
          text: "意外来了——只能一起面对是否要留下。",
          conditions: {
            someFlags: ["relationship_confirmed", "milestone_confirmed_relationship"]
          },
          customAction: "child_path_decision",
          customPayload: { path: "unexpected", addCount: 1, tags: ["unexpected"] },
          effects: { stats: { stress: 8, mental: -3, happiness: -1 } },
          addFlags: ["child_unexpected_arrival"],
          log: "命运没有按你们的时间表敲门。"
        })
      ]
    }),
    ev({
      id: "child_life_first_years",
      stage: "family",
      title: "有孩子的日子，会把时间表撕碎再拼回去",
      text: "睡眠、花钱、争吵、温柔、愧疚、骄傲——它们会挤在同一天里。你会重新理解什么叫「顾不上自己」。",
      minAge: 22,
      maxAge: 50,
      weight: 14,
      repeatable: true,
      tags: ["family", "child"],
      conditions: { minChildCount: 1 },
      choices: [
        ch({
          text: "尽量多换尿布、多哄睡，把自己熬瘦一圈。",
          effects: { stats: { health: -2, happiness: 3, stress: 4, money: -2 } },
          addFlags: ["parent_heavy_presence"]
        }),
        ch({
          text: "和伴侣硬吵育儿分工，但最后达成了粗糙的轮班。",
          effects: { stats: { stress: 3, mental: 1, familySupport: 1 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              tension: 5,
              commitment: 3,
              history: "你们在育儿里吵过，也把责任掰开接过。"
            }
          ]
        }),
        ch({
          text: "常常缺席，只能用钱和礼物补偿心里的亏欠。",
          effects: { stats: { money: -3, happiness: -2, career: 2, stress: 5 } },
          addFlags: ["parent_absent_guilt"]
        })
      ]
    }),
    ev({
      id: "overseas_loan_finance_anxiety",
      stage: "college",
      title: "留学贷款压在账上，连呼吸都像在算汇率",
      text: "你不是在「体验世界」，你是在用未来的自己给现在的每一顿饭担保。账单、兼职信息和睡眠，会轮流把你叫醒。",
      minAge: 18,
      maxAge: 30,
      weight: 20,
      repeatable: true,
      tags: ["overseas", "money", "stress"],
      conditions: { requiredFlags: ["overseas_study_loan", "life_path_overseas"] },
      choices: [
        ch({
          text: "再接一份工，把社交缩到最小。",
          customAction: "adjust_overseas_pressures",
          customPayload: { financePressure: -4, loneliness: 3, burnout: 5 },
          effects: { stats: { stress: 3, health: -1, discipline: 2 } },
          addFlags: ["overseas_parttime_grind"]
        }),
        ch({
          text: "硬着头皮去参加一次高消费聚会，回来更焦虑。",
          conditions: { excludedFlags: ["overseas_study_loan"] },
          effects: { stats: { social: 2, happiness: 1, money: -5, stress: 2 } }
        }),
        ch({
          text: "给家里打电话要钱的话说不出口，只好继续硬撑。",
          effects: { stats: { mental: -2, stress: 4, familySupport: -1 } },
          customAction: "adjust_overseas_pressures",
          customPayload: { financePressure: 3, homesickness: 4 }
        })
      ]
    }),
    ev({
      id: "lin_xiaonan_highschool_math_corner",
      stage: "adolescence",
      title: "林小楠：讲台旁那道总是算不完的题",
      text: "林小楠坐得离讲台很近，草稿纸永远比课本厚。她不是班里最吵的那个，但你会在发卷子、对答案、晚自习铃响起来的时候，总是先看见她的侧脸。\n\n你们的故事，如果要有下文，得从一道题、一支笔、一次被点名一起上去写题开始。",
      minAge: 14,
      maxAge: 17,
      weight: 9,
      tags: ["romance", "school"],
      conditions: {
        unknownRelationships: ["lin_xiaonan"]
      },
      choices: [
        ch({
          text: "借她笔记，顺便把不懂的题问清楚。",
          relationshipEffects: [
            {
              targetId: "lin_xiaonan",
              familiarity: 8,
              theirInterest: 5,
              affection: 4,
              history: "你用「问题」当借口，靠她靠得更近了一点。"
            }
          ],
          setActiveRelationship: "lin_xiaonan",
          effects: { stats: { intelligence: 2, social: 1 } }
        }),
        ch({
          text: "只在远处看，怕自己打扰她的节奏。",
          relationshipEffects: [
            {
              targetId: "lin_xiaonan",
              playerInterest: 3,
              history: "你把喜欢压得很轻，轻到几乎没人察觉，包括她。"
            }
          ],
          effects: { stats: { mental: 1, stress: 1 } }
        })
      ]
    }),
    ev({
      id: "zhou_mingyue_track_meet",
      stage: "highschool",
      title: "周明玥：广播站里熟悉又陌生的声音",
      text: "周明玥在广播站念稿，声音比人先被你记住。后来在走廊、食堂、社团招新摊位，你才发现她比麦克风里更锋利一点——爱笑，也敢怼人。\n\n她不是那种等你暗恋三年的模板，她更像会把话直接扔回来的人。",
      minAge: 16,
      maxAge: 19,
      weight: 10,
      tags: ["romance", "school"],
      conditions: {
        unknownRelationships: ["zhou_mingyue"]
      },
      choices: [
        ch({
          text: "假装路过广播站门口，夸她今天读得好。",
          relationshipEffects: [
            {
              targetId: "zhou_mingyue",
              theirInterest: 6,
              affection: 5,
              ambiguity: 5,
              history: "你夸得很具体，她挑眉看了你一眼，像在给这句话打分。"
            }
          ],
          setActiveRelationship: "zhou_mingyue",
          effects: { stats: { social: 2, stress: 1 } }
        }),
        ch({
          text: "在群里接她的话茬，半开玩笑半认真。",
          relationshipEffects: [
            {
              targetId: "zhou_mingyue",
              familiarity: 6,
              tension: 2,
              affection: 3,
              history: "网络让胆子变大，也让误会变得更容易插队。"
            }
          ],
          setActiveRelationship: "zhou_mingyue",
          effects: { stats: { social: 2, happiness: 1 } }
        })
      ]
    })
  ];

  window.LIFE_OVERSEAS_FINANCE = {
    overseasCostConfig,
    loanConfig
  };
  window.LIFE_SHOP_ITEMS = shopItems;
  window.LIFE_GIFT_EFFECTS = giftEffects;
  window.LIFE_CHILD_SYSTEM = childSystem;
  window.LIFE_RELATIONSHIP_MILESTONES = relationshipMilestones;
  window.LIFE_EDUCATION_CAREER_HINTS = educationToCareerHints;

  window.LIFE_EXTRA_EVENTS = (Array.isArray(window.LIFE_EXTRA_EVENTS) ? window.LIFE_EXTRA_EVENTS : []).concat(
    lifeSystemExtraEvents
  );
})();

(function () {
  "use strict";

  /**
   * 恋爱路线扩充、求婚侧栏配置、好感 80 里程碑、婚后与离婚事件、家庭背景专属补充。
   * 手动改本文件即可调：概率、文案、条件、路线 id 列表。
   */

  function ev(source) {
    return source;
  }

  function ch(source) {
    return source;
  }

  var DOMESTIC_COLLEGE_ROUTE_IDS = [
    "elite_city_university",
    "ordinary_university",
    "local_university",
    "distant_university",
    "art_free_path",
    "gaokao_vocational_college",
    "non_gaokao_skill_path"
  ];

  var OVERSEAS_ROUTE_IDS = ["overseas_research_path", "overseas_practical_path", "overseas_art_path"];

  /** 侧栏求婚、好感 80 自动事件（引擎读取 window.LIFE_PROPOSAL_SIDEBAR_CONFIG） */
  window.LIFE_PROPOSAL_SIDEBAR_CONFIG = {
    minAffectionToShowButton: 40,
    affection80EventId: "milestone_affection80_marriage_discussion",
    affection80MilestoneMinPlayerAge: 17,
    maxProbabilityAdjust: 0.12,
    longDistancePenalty: 0.06,
    rockyStatusPenalty: 0.05,
    highTensionPenalty: 0.05,
    midTensionPenalty: 0.02,
    marriageEaseCoef: 0.001,
    stabilityCoef: 0.0008,
    breakupRiskCoef: 0.001,
    characterBiasScale: 0.45,
    conflictFlagScale: 0.6,
    lowMoneyPenalty: 0.04,
    playerStressPenalty: 0.04,
    minClamp: 0.05,
    maxClamp: 0.95,
    sidebarSuccessPayload: {
      addFlags: [],
      happiness: 2
    },
    sidebarFailPayload: {
      addFlags: ["sidebar_proposal_rejected", "marriage_proposal_cooling"],
      failTension: 11,
      failTrust: -6,
      failCommitment: -5,
      failAffection: -6,
      stats: { happiness: -6, stress: 8, mental: -4 }
    }
  };

  /** 离婚与婚后危机：供事件 customPayload 参考（引擎核心在 marriage_divorce_finalize） */
  window.LIFE_DIVORCE_SYSTEM_CONFIG = {
    marriageCrisisFlags: [
      "marriage_trust_crisis",
      "marriage_money_fight_loop",
      "marriage_inlaw_clash_active",
      "marriage_parenting_burnout",
      "marriage_infidelity_suspicion"
    ],
    postDivorceFlags: ["player_divorced", "post_divorce_rebuild", "coparenting_active"]
  };

  var expansionPack = [
    ev({
      id: "milestone_affection80_marriage_discussion",
      stage: "family",
      title: "好感第一次冲到很高时，你们站在婚姻的门口",
      text: "不是偶像剧里的单膝跪地，而是某次聊天里突然发现：你们已经习惯把对方算进「以后」里。\n\nTa 试探着把结婚说成半开玩笑，眼神却认真得让你没法糊弄过去。这一刻，答应或不答应，都会把关系推到一个新的刻度。",
      weight: 0,
      repeatable: false,
      skipNarrativeDedupe: true,
      minAge: 17,
      maxAge: 55,
      tags: ["romance", "marriage", "milestone"],
      conditions: {
        excludedFlags: ["player_married"]
      },
      choices: [
        ch({
          text: "认真点头：把婚约说实，一起承担接下来的具体。",
          effects: { age: 0, stats: { happiness: 4, stress: 3, mental: 2 } },
          addFlags: ["milestone_affection80_accepted"],
          relationshipEffects: [
            {
              targetId: "__active__",
              commitment: 10,
              trust: 6,
              affection: 4,
              history: "你们在好感第一次冲到很高的节点，把结婚说成了彼此都认的真。"
            }
          ],
          customAction: "marriage_commit",
          customPayload: {
            addFlags: ["player_married", "marriage_milestone_80_entry"],
            happiness: 5,
            stress: 2,
            partnerHistory: "婚约不是在仪式上临时起意，而是在感情已经很高的时候被认真接过。"
          }
        }),
        ch({
          text: "说「我爱你，但还需要一点时间」——暂缓，不把门关上。",
          effects: { age: 0, stats: { happiness: 1, stress: 4, mental: 3 } },
          addFlags: ["milestone_affection80_declined_soft", "marriage_talk_future"],
          relationshipEffects: [
            {
              targetId: "__active__",
              tension: 5,
              trust: 3,
              theirInterest: -2,
              history: "你没有拒绝 Ta，只是把「结婚」从当下挪开一点；Ta 点头了，但眼里有一瞬空掉。"
            }
          ],
          log: "关系还在，只是「婚姻」这个词被暂时放回中间地带，需要你们之后用更多日常去养。"
        }),
        ch({
          text: "诚实说还没准备好承担婚姻：可能会伤到 Ta，但不想骗。",
          effects: { age: 0, stats: { happiness: -3, stress: 6, mental: -2 } },
          addFlags: ["milestone_affection80_declined_hard"],
          relationshipEffects: [
            {
              targetId: "__active__",
              tension: 12,
              trust: -6,
              commitment: -5,
              affection: -6,
              history: "你把「不结」说得很清楚，对方的自尊和期待同时被敲了一下。"
            }
          ],
          log: "你说的是真话，可真话并不自动温柔。接下来是冷淡、试探，还是重新磨合，要看两个人还愿不愿意付成本。"
        })
      ]
    }),

    ev({
      id: "rom_domestic_campus_club_crush",
      stage: "college",
      title: "社团活动室很晚还亮着灯",
      text: "国内大学里，人和人常常是在「一起做事」里慢慢靠紧的。海报、排练、比赛、熬夜改策划——心动混在咖啡味和灰尘里，不容易说清楚什么时候开始算喜欢。",
      minAge: 18,
      maxAge: 24,
      weight: 9,
      repeatable: true,
      cooldownChoices: 10,
      dedupeKey: "route_romance_domestic_campus",
      dedupeSpacingChoices: 8,
      tags: ["romance", "school", "college"],
      conditions: {
        excludedFlags: ["player_married"],
        educationRouteIds: DOMESTIC_COLLEGE_ROUTE_IDS,
        minStats: { social: 18 }
      },
      choices: [
        ch({
          text: "主动约对方单独吃宵夜，把暧昧说清楚一点。",
          effects: { age: 0, stats: { social: 3, happiness: 2, stress: 1 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              affection: 5,
              ambiguity: 6,
              theirInterest: 5,
              interactions: 1,
              history: "社团灯还亮着的时候，你们第一次把「是不是喜欢」说近了一点。"
            }
          ]
        }),
        ch({
          text: "先维持并肩作战：怕恋爱把团队搅浑。",
          effects: { age: 0, stats: { discipline: 3, mental: 2, happiness: -1 } },
          addFlags: ["campus_romance_delayed"],
          relationshipEffects: [
            {
              targetId: "__active__",
              familiarity: 4,
              tension: 3,
              history: "你选择了先把集体扛住，暧昧被你自己按下去，但眼神骗不了人。"
            }
          ]
        }),
        ch({
          text: "开玩笑带过，却在群里被起哄——关系被迫曝光一角。",
          effects: { age: 0, stats: { social: 4, stress: 3 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              affection: 3,
              ambiguity: 8,
              tension: 4,
              history: "起哄让你们同时尴尬又同时确认：原来别人早就看见了。"
            }
          ]
        })
      ]
    }),
    ev({
      id: "rom_domestic_internship_city_love",
      stage: "young_adult",
      title: "实习城市的地铁与出租屋",
      text: "同城实习把你们从宿舍叙事拽进「通勤、房租、加班」里。恋爱不再只是校园散步，而是一起算路线、替对方带饭、在累瘫的夜里并排刷手机。",
      minAge: 20,
      maxAge: 28,
      weight: 9,
      repeatable: true,
      cooldownChoices: 10,
      dedupeKey: "route_romance_domestic_worklike",
      tags: ["romance", "career", "work"],
      conditions: {
        excludedFlags: ["player_married"],
        educationRouteIds: DOMESTIC_COLLEGE_ROUTE_IDS,
        minStats: { career: 14 }
      },
      choices: [
        ch({
          text: "一起租近一点：把「凑合过」过成像样的日常。",
          effects: { age: 0, stats: { happiness: 3, money: -3, stress: 2, familySupport: -1 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              commitment: 7,
              familiarity: 6,
              trust: 5,
              history: "实习城里，你们第一次用房租和通勤证明「在一起」不只是情绪。"
            }
          ]
        }),
        ch({
          text: "各住各的，只在周末见面：轻松，也更容易误会。",
          effects: { age: 0, stats: { mental: 2, happiness: 1, stress: 2 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              ambiguity: 4,
              tension: 5,
              history: "距离把浪漫留住了，也把不安养大了——消息晚回一小时都能吵。"
            }
          ]
        }),
        ch({
          text: "吵了一次「你到底要不要认真」后，反而把关系说死了一点。",
          effects: { age: 0, stats: { stress: 4, mental: -2 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              commitment: 6,
              tension: 6,
              trust: 4,
              history: "吵完很累，但你们终于不用互相猜了。"
            }
          ]
        })
      ]
    }),
    ev({
      id: "rom_domestic_ex_looms",
      stage: "young_adult",
      title: "旧人出现在同一座城",
      text: "国内路线里，城市不大，圈子更小。某个饭局、校友群或共同朋友婚礼上，旧人带着新故事出现——你心里那页以为翻过去的纸，又被风掀起来。",
      minAge: 22,
      maxAge: 36,
      weight: 7,
      repeatable: true,
      cooldownChoices: 14,
      tags: ["romance", "reflection"],
      conditions: {
        excludedFlags: ["player_married"],
        educationRouteIds: DOMESTIC_COLLEGE_ROUTE_IDS,
        minStats: { social: 20 }
      },
      choices: [
        ch({
          text: "把话说清：现在身边的人更重要。",
          effects: { age: 0, stats: { mental: 3, stress: 2 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              trust: 7,
              commitment: 5,
              history: "你在旧人面前把现在的关系护得很稳。"
            }
          ]
        }),
        ch({
          text: "私下聊了两句：没越界，却让对方不安了一阵子。",
          effects: { age: 0, stats: { happiness: -2, stress: 4 } },
          addFlags: ["ex_meetup_soft_jealousy"],
          relationshipEffects: [
            {
              targetId: "__active__",
              tension: 8,
              trust: -3,
              history: "你觉得自己很清白，可对方的难受也不是装的。"
            }
          ]
        }),
        ch({
          text: "旧人提出复合暗示，你拒绝得干脆。",
          effects: { age: 0, stats: { happiness: 2 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              affection: 4,
              theirInterest: 4,
              history: "你的拒绝像一张收据：证明你现在选的是谁。"
            }
          ]
        })
      ]
    }),

    ev({
      id: "rom_overseas_time_zone_love",
      stage: "college",
      title: "时差把「想你」拆成两段作息",
      text: "留学线里，恋爱常常先被时差考验。你在这边上课，Ta 在那边刚要睡；你想打电话，Ta 在开会。喜欢还在，但同步变得像抽签。",
      minAge: 19,
      maxAge: 30,
      weight: 10,
      repeatable: true,
      cooldownChoices: 9,
      dedupeKey: "route_romance_overseas_ld",
      tags: ["romance", "college"],
      conditions: {
        excludedFlags: ["player_married"],
        educationRouteIds: OVERSEAS_ROUTE_IDS,
        someFlags: ["life_path_overseas"]
      },
      choices: [
        ch({
          text: "固定「我们的小时」：哪怕短，也要可预期。",
          effects: { age: 0, stats: { discipline: 2, happiness: 2, stress: 1 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              trust: 6,
              commitment: 6,
              continuity: 5,
              history: "你们用日程对抗时差，把异国恋过得像项目也像情书。"
            }
          ]
        }),
        ch({
          text: "越来越依赖文字，却越来越怕已读不回。",
          effects: { age: 0, stats: { mental: -2, stress: 5 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              tension: 9,
              trust: -4,
              history: "屏幕里的爱像被压缩过，情绪却放大。"
            }
          ]
        }),
        ch({
          text: "在这边遇到很合拍的人——你开始不敢直视心里的动摇。",
          effects: { age: 0, stats: { happiness: 1, stress: 6, mental: -3 } },
          addFlags: ["overseas_local_attraction_guilt"],
          relationshipEffects: [
            {
              targetId: "__active__",
              ambiguity: 5,
              tension: 7,
              theirInterest: -3,
              history: "新的合拍不是罪，但它会逼你重新打量旧承诺。"
            }
          ]
        })
      ]
    }),
    ev({
      id: "rom_overseas_culture_clash_partner",
      stage: "young_adult",
      title: "文化差落在「怎么吵架」上",
      text: "出国后，恋爱不只是语言切换，更是价值观切换：边界、隐私、家庭介入、节日仪式感——你以为的小事，可能是对方的底线。",
      minAge: 20,
      maxAge: 34,
      weight: 8,
      repeatable: true,
      cooldownChoices: 11,
      tags: ["romance", "family"],
      conditions: {
        excludedFlags: ["player_married"],
        educationRouteIds: OVERSEAS_ROUTE_IDS
      },
      choices: [
        ch({
          text: "把误会摊开翻译：愿意学对方的「规则」。",
          effects: { age: 0, stats: { social: 3, mental: 2, stress: 2 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              trust: 7,
              familiarity: 6,
              history: "你们第一次证明：差异可以被当作题目，而不是判决。"
            }
          ]
        }),
        ch({
          text: "吵到摔门，却在超市又默默给对方买喜欢的零食。",
          effects: { age: 0, stats: { stress: 4, happiness: 1 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              tension: 8,
              affection: 3,
              history: "你们的和好方式很土，但很真。"
            }
          ]
        }),
        ch({
          text: "你觉得被冒犯，对方觉得被控制——冷战拉长。",
          effects: { age: 0, stats: { mental: -3, happiness: -3 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              tension: 12,
              trust: -6,
              commitment: -4,
              history: "文化差只是表面，真正卡的是谁都不愿意先软。"
            }
          ]
        })
      ]
    }),
    ev({
      id: "rom_work_no_degree_shift_love",
      stage: "young_adult",
      title: "没读大学的那条街，恋爱更贴地",
      text: "直接工作路线里，恋爱常发生在排班、夜班、合租、同事介绍和客户场里。浪漫要过工资、加班和家里电话三关——但也因此更清楚谁是真的能一起扛。",
      minAge: 19,
      maxAge: 32,
      weight: 10,
      repeatable: true,
      cooldownChoices: 9,
      dedupeKey: "route_romance_direct_work",
      tags: ["romance", "work", "career"],
      conditions: {
        excludedFlags: ["player_married"],
        someFlags: ["no_college", "early_worker", "education_direct_work"]
      },
      choices: [
        ch({
          text: "省一点、凑一点，给对方过个像样的生日。",
          effects: { age: 0, stats: { money: -4, happiness: 4, stress: 2 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              affection: 6,
              trust: 6,
              theirInterest: 7,
              history: "你用很具体的省吃俭用，替对方证明「我在乎你」。"
            }
          ]
        }),
        ch({
          text: "被家里催婚催钱，你们第一次吵到提分手。",
          effects: { age: 0, stats: { stress: 6, familySupport: -2, mental: -2 } },
          addFlags: ["work_route_family_money_fight"],
          relationshipEffects: [
            {
              targetId: "__active__",
              tension: 11,
              commitment: -3,
              history: "现实不是突然来的，是你们一直假装它很远。"
            }
          ]
        }),
        ch({
          text: "一起报班考证：把未来从「混着过」改成「往一处使」。",
          effects: { age: 0, stats: { career: 4, discipline: 4, stress: 2 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              commitment: 8,
              trust: 5,
              history: "你们用同一张课表，把爱情从情绪升级成合伙。"
            }
          ]
        })
      ]
    }),
    ev({
      id: "rom_work_double_shift_trust",
      stage: "career",
      title: "双班倒的日子里，信任是稀缺品",
      text: "你不读大学/早工作，恋爱里最怕的不是没话题，而是「你根本不在场」。消息回慢、约会爽约、房租谁多谁少——每件小事都能点燃委屈。",
      minAge: 22,
      maxAge: 38,
      weight: 8,
      repeatable: true,
      cooldownChoices: 10,
      tags: ["romance", "work", "pressure"],
      conditions: {
        excludedFlags: ["player_married"],
        someFlags: ["no_college", "early_worker", "hands_on_path"]
      },
      choices: [
        ch({
          text: "把工资条摊开谈：不体面，但少很多猜。",
          effects: { age: 0, stats: { stress: 3, mental: 2, happiness: 1 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              trust: 8,
              tension: 3,
              history: "钱谈清楚以后，爱反而更敢落地。"
            }
          ]
        }),
        ch({
          text: "冷战三天，最后靠一顿路边摊和好。",
          effects: { age: 0, stats: { happiness: 2, health: -1 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              affection: 3,
              tension: 6,
              history: "你们像两只累坏的动物，靠体温确认还在。"
            }
          ]
        }),
        ch({
          text: "真的累了：提出先分开一阵。",
          effects: { age: 0, stats: { mental: -2, stress: 4 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              status: "cooling",
              commitment: -8,
              history: "分开不是判决，是两个人都先要喘口气。"
            }
          ]
        })
      ]
    }),

    ev({
      id: "fa_rich_matchmaking_pressure_romance",
      stage: "young_adult",
      title: "家里介绍的局，像温柔刀",
      text: "富裕家庭里，恋爱很少只是两个人的事。饭局上轻描淡写的「门当户对」，其实是把你们的关系放到秤上称。",
      minAge: 22,
      maxAge: 35,
      weight: 11,
      repeatable: true,
      cooldownChoices: 12,
      tags: ["romance", "family", "money"],
      conditions: {
        excludedFlags: ["player_married"],
        familyBackgroundIds: ["second_gen_wealth_home", "old_money_home", "nouveau_riche_home"]
      },
      choices: [
        ch({
          text: "带现在的 Ta 硬进场：用存在感对抗安排。",
          effects: { age: 0, stats: { stress: 5, happiness: 2, social: 3 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              trust: 6,
              tension: 7,
              commitment: 5,
              history: "你把 Ta 拉进你的世界，也等于替 Ta 接了家里的目光。"
            }
          ]
        }),
        ch({
          text: "先敷衍家里，私下和恋人统一战线。",
          effects: { age: 0, stats: { mental: 2, familySupport: -2, stress: 3 } },
          addFlags: ["family_matchmaking_soft_resist"],
          relationshipEffects: [
            {
              targetId: "__active__",
              trust: 5,
              familiarity: 4,
              history: "你们像地下战友，把「应付家里」练成默契。"
            }
          ]
        }),
        ch({
          text: "被资源诱惑晃神了一瞬——你恨自己，也怕对方看出来。",
          effects: { age: 0, stats: { happiness: -4, mental: -3, stress: 5 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              tension: 10,
              trust: -5,
              history: "那一瞬的动摇不会立刻毁掉关系，但会在细节里返潮。"
            }
          ]
        })
      ]
    }),
    ev({
      id: "fa_power_network_job_and_love",
      stage: "young_adult",
      title: "人脉能开路，也能绑住你怎么爱",
      text: "资源型家庭默认你有「该走的台阶」：实习、调动、相亲对象的条件表。恋爱若不符合模板，就会被说成不懂事。",
      minAge: 21,
      maxAge: 34,
      weight: 11,
      repeatable: true,
      cooldownChoices: 12,
      tags: ["romance", "career", "family"],
      conditions: {
        excludedFlags: ["player_married"],
        familyBackgroundIds: ["power_resource_home", "intellectual_elite_home"]
      },
      choices: [
        ch({
          text: "用工作成绩换一点感情自主权。",
          effects: { age: 0, stats: { career: 4, stress: 4, discipline: 3 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              commitment: 4,
              tension: 5,
              history: "你把「我能扛」写进履历，也写给对方看。"
            }
          ]
        }),
        ch({
          text: "拒绝家里的安排相亲，场面难看但心里松了。",
          effects: { age: 0, stats: { familySupport: -4, mental: 3, stress: 4 } },
          addFlags: ["refused_network_matchmaking"],
          relationshipEffects: [
            {
              targetId: "__active__",
              trust: 7,
              affection: 3,
              history: "对方知道你付了什么代价才换来这句「我只要 Ta」。"
            }
          ]
        }),
        ch({
          text: "半推半就见了相亲对象——恋人从朋友圈蛛丝马迹里崩溃。",
          effects: { age: 0, stats: { stress: 6, happiness: -5 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              trust: -10,
              tension: 14,
              history: "你说只是走流程，可伤害从来不看动机。"
            }
          ]
        })
      ]
    }),
    ev({
      id: "fa_merchant_family_business_pull",
      stage: "young_adult",
      title: "家里想让你进生意圈，恋人被挤到第二页",
      text: "经商家庭的叙事常常是「先稳住盘子」。恋爱若不能帮衬，就会被当成分心；若能帮衬，又容易被怀疑动机。",
      minAge: 20,
      maxAge: 36,
      weight: 10,
      repeatable: true,
      cooldownChoices: 11,
      tags: ["romance", "career", "money"],
      conditions: {
        excludedFlags: ["player_married"],
        familyBackgroundIds: ["family_enterprise_home", "merchant_volatile_home"]
      },
      choices: [
        ch({
          text: "把恋人带进饭局：让 Ta 看见你的战场。",
          effects: { age: 0, stats: { social: 3, stress: 4 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              familiarity: 6,
              tension: 6,
              history: "Ta 第一次看见你在酒桌上怎么笑、怎么扛。"
            }
          ]
        }),
        ch({
          text: "坚持边界：生意是生意，感情不拿来换资源。",
          effects: { age: 0, stats: { mental: 3, familySupport: -3, stress: 3 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              trust: 8,
              commitment: 5,
              history: "你的拒绝很硬，却让 Ta 更敢信你。"
            }
          ]
        }),
        ch({
          text: "家里资金链一紧，你连约会都在算钱。",
          effects: { age: 0, stats: { money: -5, stress: 6, happiness: -3 } },
          addFlags: ["family_business_cash_crunch_love"],
          relationshipEffects: [
            {
              targetId: "__active__",
              tension: 9,
              commitment: -2,
              history: "穷不可怕，可怕的是穷得让人没力气温柔。"
            }
          ]
        })
      ]
    }),
    ev({
      id: "fa_warm_home_love_reassurance",
      stage: "young_adult",
      title: "普通温暖家庭给你的恋爱底气",
      text: "家里没有厚资源，但有热饭和实话。你会把恋人带回家时少一点表演，多一点「这就是我长大的地方」。",
      minAge: 20,
      maxAge: 34,
      weight: 9,
      repeatable: true,
      cooldownChoices: 11,
      tags: ["romance", "family"],
      conditions: {
        excludedFlags: ["player_married"],
        familyBackgroundIds: ["warm_average_home", "tight_but_lifting_home", "small_town_limited_home"]
      },
      choices: [
        ch({
          text: "父母喜欢 Ta：你松了一口气。",
          effects: { age: 0, stats: { happiness: 4, familySupport: 4, stress: -1 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              trust: 6,
              affection: 4,
              history: "被接纳的感觉，让你们少吵很多无谓的架。"
            }
          ]
        }),
        ch({
          text: "家里提醒你别飘：先稳住工作再谈以后。",
          effects: { age: 0, stats: { discipline: 3, stress: 2, career: 2 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              commitment: 5,
              tension: 3,
              history: "现实提醒不浪漫，但让你们少做冲动决定。"
            }
          ]
        }),
        ch({
          text: "你带 Ta 一起帮家里干活：关系更像合伙过日子。",
          effects: { age: 0, stats: { happiness: 3, stress: 2 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              familiarity: 7,
              commitment: 6,
              history: "共同劳动比情话更能预告婚姻。"
            }
          ]
        })
      ]
    }),
    ev({
      id: "fa_poor_part_time_love_guilt",
      stage: "college",
      title: "穷学生的恋爱，是时间表和愧疚感叠在一起",
      text: "经济困难家庭里，你打工、抢奖学金、给家里寄钱。恋爱像偷来的小时：既甜，又带着「我不该这么花」的自我责备。",
      minAge: 18,
      maxAge: 28,
      weight: 10,
      repeatable: true,
      cooldownChoices: 10,
      tags: ["romance", "money", "pressure"],
      conditions: {
        excludedFlags: ["player_married"],
        familyBackgroundIds: ["tight_but_lifting_home", "single_parent_absent_home", "small_town_limited_home"],
        minStats: { stress: 22 }
      },
      choices: [
        ch({
          text: "坦诚说清经济状况：不装阔。",
          effects: { age: 0, stats: { mental: 3, stress: -1 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              trust: 8,
              commitment: 5,
              history: "你把脆弱摊开，对方才有机会真正接住你。"
            }
          ]
        }),
        ch({
          text: "借钱撑场面一次——后来后悔到失眠。",
          effects: { age: 0, stats: { money: -3, debt: 4, stress: 7, mental: -4 } },
          addFlags: ["love_face_cost_debt"],
          relationshipEffects: [
            {
              targetId: "__active__",
              tension: 8,
              trust: -4,
              history: "体面买到了，信任却开始漏水。"
            }
          ]
        }),
        ch({
          text: "约会改成散步和图书馆：穷也能认真。",
          effects: { age: 0, stats: { happiness: 2, discipline: 2 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              affection: 5,
              familiarity: 5,
              history: "你们证明浪漫不一定要标价。"
            }
          ]
        })
      ]
    }),
    ev({
      id: "fa_control_home_mate_gatekeeping",
      stage: "young_adult",
      title: "控制型家庭对「你选的人」下手很快",
      text: "电话查岗、突然上门、用断生活费威胁——恋爱被拆成「听话」和「叛逆」两栏。你要么把 Ta 藏好，要么把战争打到底。",
      minAge: 20,
      maxAge: 32,
      weight: 11,
      repeatable: true,
      cooldownChoices: 12,
      tags: ["romance", "family", "pressure"],
      conditions: {
        excludedFlags: ["player_married"],
        familyBackgroundIds: ["conflict_heavy_home", "grade_first_repressed_home", "respectable_but_distant_home"],
        someFlags: ["control_family", "family_pressure", "high_expectation_child"]
      },
      choices: [
        ch({
          text: "明确站队：保护 Ta，也承担后果。",
          effects: { age: 0, stats: { familySupport: -5, mental: 3, stress: 6 } },
          addFlags: ["chose_partner_over_control_family"],
          relationshipEffects: [
            {
              targetId: "__active__",
              trust: 9,
              commitment: 7,
              tension: 6,
              history: "你第一次把「我成年了」说到带血带肉。"
            }
          ]
        }),
        ch({
          text: "让 Ta 暂时别出现：拖延战。",
          effects: { age: 0, stats: { happiness: -3, stress: 4 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              trust: -5,
              tension: 8,
              theirInterest: -4,
              history: "Ta 理解你的难，但不等于不受伤。"
            }
          ]
        }),
        ch({
          text: "分手换平静——你恨自己，也恨他们。",
          effects: { age: 0, stats: { mental: -6, happiness: -6, stress: 5 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              status: "breakup",
              affection: -15,
              history: "你把爱掐断，只为换一口呼吸；可呼吸里全是空。"
            }
          ]
        })
      ]
    }),

    ev({
      id: "post_marriage_chore_money_row",
      stage: "family",
      title: "婚后第一次为「谁多做了」翻脸",
      text: "结婚以后，浪漫会被水槽里的碗、地板上的头发和账单提醒音磨薄。你们不是不爱了，是第一次发现「公平」在婚姻里有多难算。",
      minAge: 25,
      maxAge: 50,
      weight: 9,
      repeatable: true,
      cooldownChoices: 8,
      tags: ["romance", "marriage", "family", "pressure"],
      conditions: {
        requiredFlags: ["player_married"],
        activeRelationshipStatuses: ["married"]
      },
      choices: [
        ch({
          text: "坐下来写分工表：土，但有用。",
          effects: { age: 0, stats: { stress: 2, happiness: 2, mental: 2 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              trust: 5,
              tension: -3,
              history: "你们用很笨的方法，把婚姻从情绪拉回到规则。"
            }
          ]
        }),
        ch({
          text: "吵到提离婚两个字，又都吓到收声。",
          effects: { age: 0, stats: { stress: 6, mental: -2 } },
          addFlags: ["marriage_trash_talk_scare"],
          relationshipEffects: [
            {
              targetId: "__active__",
              tension: 12,
              trust: -4,
              history: "那句话像雷，劈开的是幻想：原来你们也会走到这一步。"
            }
          ]
        }),
        ch({
          text: "先道歉的不是错更多那个，而是更怕失去那个。",
          effects: { age: 0, stats: { happiness: 1 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              affection: 4,
              commitment: 4,
              history: "婚姻里的台阶，常常要靠爱来铺。"
            }
          ]
        })
      ]
    }),
    ev({
      id: "post_marriage_inlaw_holiday_siege",
      stage: "family",
      title: "过节像过关：双方家庭轮流登场",
      text: "婚后节日从二人世界变成调度表：回谁家、带什么、谁说错一句话就能冷场。恋人变成队友，也可能变成替对方挡枪的盾。",
      minAge: 26,
      maxAge: 52,
      weight: 8,
      repeatable: true,
      cooldownChoices: 9,
      tags: ["romance", "marriage", "family"],
      conditions: {
        requiredFlags: ["player_married"],
        activeRelationshipStatuses: ["married"]
      },
      choices: [
        ch({
          text: "提前对齐策略：一人唱红脸一人唱白脸。",
          effects: { age: 0, stats: { stress: 3, social: 3 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              trust: 6,
              commitment: 5,
              history: "你们在亲戚面前第一次像真正的夫妻档。"
            }
          ]
        }),
        ch({
          text: "当场甩脸：年后冷战很久。",
          effects: { age: 0, stats: { familySupport: -3, stress: 7 } },
          addFlags: ["marriage_inlaw_clash_active"],
          relationshipEffects: [
            {
              targetId: "__active__",
              tension: 14,
              trust: -6,
              history: "体面碎了以后，修补比吵架更耗人。"
            }
          ]
        }),
        ch({
          text: "各回各家一次：争议暂停，孤独上场。",
          effects: { age: 0, stats: { mental: -1, happiness: -2 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              tension: 6,
              familiarity: 3,
              history: "分开过年像惩罚，也像喘息。"
            }
          ]
        })
      ]
    }),
    ev({
      id: "post_marriage_housing_fork",
      stage: "family",
      title: "买房、租房、还是搬回父母附近？",
      text: "婚后财务目标会从「一起吃饭」升级成「一起背贷」。每一次选择都在改写你们的压力曲线和亲密距离。",
      minAge: 26,
      maxAge: 48,
      weight: 8,
      repeatable: true,
      cooldownChoices: 10,
      tags: ["romance", "marriage", "money", "housing"],
      conditions: {
        requiredFlags: ["player_married"],
        activeRelationshipStatuses: ["married"]
      },
      choices: [
        ch({
          text: "咬牙上车：房贷一起扛。",
          effects: { age: 0, stats: { money: -12, stress: 8, happiness: 2, career: 2 } },
          addFlags: ["mortgage_couple_track"],
          relationshipEffects: [
            {
              targetId: "__active__",
              commitment: 8,
              tension: 5,
              history: "你们把未来押进同一本红本里。"
            }
          ]
        }),
        ch({
          text: "继续租：把钱留给缓冲与体验。",
          effects: { age: 0, stats: { money: -2, happiness: 2, stress: 1 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              trust: 4,
              familiarity: 4,
              history: "你们选择先不让房子定义人生。"
            }
          ]
        }),
        ch({
          text: "为首付来源吵到翻旧账。",
          effects: { age: 0, stats: { stress: 7, familySupport: -2 } },
          addFlags: ["marriage_money_fight_loop"],
          relationshipEffects: [
            {
              targetId: "__active__",
              tension: 13,
              trust: -5,
              history: "钱只是引信，真正炸的是「你到底站哪边」。"
            }
          ]
        })
      ]
    }),
    ev({
      id: "post_marriage_baby_timing_fight",
      stage: "family",
      title: "要不要孩子：从浪漫变成时间表",
      text: "一方觉得「该定了」，另一方觉得「我还没准备好」。婚姻里第一次出现无法妥协的分叉口时，连拥抱都像在谈判。",
      minAge: 26,
      maxAge: 42,
      weight: 9,
      repeatable: true,
      cooldownChoices: 10,
      tags: ["romance", "marriage", "children", "parenting"],
      conditions: {
        requiredFlags: ["player_married"],
        activeRelationshipStatuses: ["married"]
      },
      choices: [
        ch({
          text: "约定一年缓冲：用检查与储蓄换确定性。",
          effects: { age: 0, stats: { mental: 2, stress: 3, discipline: 2 } },
          addFlags: ["baby_timeline_negotiated"],
          relationshipEffects: [
            {
              targetId: "__active__",
              trust: 6,
              commitment: 6,
              history: "你们把「再等等」说成了共同计划，而不是逃避。"
            }
          ]
        }),
        ch({
          text: "强行推进：一方委屈配合。",
          effects: { age: 0, stats: { happiness: -3, stress: 6, mental: -3 } },
          addFlags: ["marriage_parenting_burnout"],
          relationshipEffects: [
            {
              targetId: "__active__",
              tension: 12,
              trust: -6,
              history: "配合不是同意，埋雷迟早会响。"
            }
          ]
        }),
        ch({
          text: "接受「可能不要孩子」：两人重新谈意义感。",
          effects: { age: 0, stats: { happiness: 1, stress: 4 } },
          addFlags: ["childfree_couple_talk"],
          relationshipEffects: [
            {
              targetId: "__active__",
              commitment: 5,
              trust: 7,
              history: "你们把人生从默认脚本里抠出来，重新写。"
            }
          ]
        })
      ]
    }),
    ev({
      id: "post_marriage_trust_phone_night",
      stage: "family",
      title: "手机亮一下，婚姻暗一下",
      text: "婚后信任有时不靠誓言，靠「你敢不敢把手机放桌上」。暧昧未必真发生，怀疑却可以先毁掉睡眠。",
      minAge: 27,
      maxAge: 50,
      weight: 7,
      repeatable: true,
      cooldownChoices: 12,
      tags: ["romance", "marriage", "mental"],
      conditions: {
        requiredFlags: ["player_married"],
        activeRelationshipStatuses: ["married"]
      },
      choices: [
        ch({
          text: "摊开聊天记录：羞辱，但止疑。",
          effects: { age: 0, stats: { stress: 5, mental: -2 } },
          addFlags: ["marriage_infidelity_suspicion"],
          relationshipEffects: [
            {
              targetId: "__active__",
              trust: 3,
              tension: 10,
              history: "清白未必能买回亲密，但至少买回一点秩序。"
            }
          ]
        }),
        ch({
          text: "拒绝被查：边界有了，裂缝也有了。",
          effects: { age: 0, stats: { stress: 6 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              tension: 11,
              trust: -7,
              history: "你要隐私，Ta 要安全感——两者撞在一起很难好听。"
            }
          ]
        }),
        ch({
          text: "约定「可问可说」的规则：慢，但体面。",
          effects: { age: 0, stats: { mental: 2, stress: 2 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              trust: 6,
              commitment: 4,
              history: "你们把敏感话题从偷袭改成预约。"
            }
          ]
        })
      ]
    }),

    ev({
      id: "divorce_crisis_counselor_fork",
      stage: "family",
      title: "婚姻危机：还要不要救？",
      text: "吵到不想回家、说到互相伤害、钱与孩子把你们绑死又撕开——有片刻你会问自己：这是低谷，还是终点。",
      minAge: 28,
      maxAge: 55,
      weight: 6,
      repeatable: true,
      cooldownChoices: 14,
      tags: ["romance", "marriage", "mental", "pressure"],
      conditions: {
        requiredFlags: ["player_married"],
        activeRelationshipStatuses: ["married"],
        someFlags: [
          "marriage_trash_talk_scare",
          "marriage_money_fight_loop",
          "marriage_inlaw_clash_active",
          "marriage_parenting_burnout",
          "marriage_infidelity_suspicion"
        ]
      },
      choices: [
        ch({
          text: "一起去做婚姻咨询：承认需要外援。",
          effects: { age: 0, stats: { money: -3, stress: 4, mental: 3 } },
          addFlags: ["marriage_counseling_attempt"],
          relationshipEffects: [
            {
              targetId: "__active__",
              trust: 4,
              tension: -4,
              commitment: 3,
              history: "你们把骄傲放下一点点，换一点点修复空间。"
            }
          ]
        }),
        ch({
          text: "冷静期分居：不见面反而能说话。",
          effects: { age: 0, stats: { stress: 5, happiness: -2, money: -2 } },
          addFlags: ["marriage_separation_cooling"],
          relationshipEffects: [
            {
              targetId: "__active__",
              tension: 8,
              familiarity: 2,
              history: "距离像药，也像刀；你们还在试它是哪一种。"
            }
          ]
        }),
        ch({
          text: "谈离婚：把伤害收束成可执行的结束。",
          effects: { age: 0, stats: { stress: 8, mental: -4, happiness: -5 } },
          customAction: "marriage_divorce_finalize",
          customPayload: {
            addFlags: ["divorce_by_mutual_talk", "post_divorce_rebuild"],
            removeGlobalFlags: ["marriage_counseling_attempt", "marriage_separation_cooling"],
            stats: { stress: 6, mental: -3, happiness: -6 },
            moneyDelta: -6,
            partnerHistory: "你们把婚姻收束成法律与文件上的句号，心里却还要很久才真的合上。"
          }
        })
      ]
    }),
    ev({
      id: "divorce_aftermath_coparent_stress",
      stage: "family",
      title: "离婚之后：如果孩子还在",
      text: "婚姻可以解散，责任却会被孩子重新捆在一起。抚养费、接送、家长会、前任的新对象——每一件都能把旧伤撕开。",
      minAge: 26,
      maxAge: 50,
      weight: 8,
      repeatable: true,
      cooldownChoices: 10,
      tags: ["children", "parenting", "family", "pressure"],
      conditions: {
        requiredFlags: ["player_divorced"],
        minChildCount: 1
      },
      choices: [
        ch({
          text: "尽量对孩子口径一致：不把成人战场烧到 Ta 面前。",
          effects: { age: 0, stats: { mental: 3, stress: 4, happiness: 1 } },
          addFlags: ["coparenting_active", "child_shield_divorce"],
          log: "你很累，但你知道孩子需要至少一个稳定的叙述。"
        }),
        ch({
          text: "争执抚养权：钱与情一起出血。",
          effects: { age: 0, stats: { money: -10, stress: 10, mental: -6, familySupport: -3 } },
          addFlags: ["custody_battle_scar"],
          log: "法庭与调解室把爱过的人变成对手，这种痛会跟很久。"
        }),
        ch({
          text: "减少探视逃避愧疚——你知道自己软弱。",
          effects: { age: 0, stats: { mental: -5, happiness: -4, stress: 5 } },
          addFlags: ["post_divorce_avoidant_parent"],
          log: "逃避换来短暂轻松，也换来更深的空洞。"
        })
      ]
    }),
    ev({
      id: "divorce_aftermath_new_love_slow",
      stage: "young_adult",
      title: "离婚后再喜欢人，会带着刹车",
      text: "你学会更快识别红旗，也更难全情投入。新的人很好，可你总会问自己：这次会不会又把谁拖进泥里。",
      minAge: 28,
      maxAge: 55,
      weight: 7,
      repeatable: true,
      cooldownChoices: 12,
      tags: ["romance", "reflection"],
      conditions: {
        requiredFlags: ["player_divorced"],
        excludedFlags: ["player_married"]
      },
      choices: [
        ch({
          text: "坦白过往：筛选掉接不住的人。",
          effects: { age: 0, stats: { social: 2, stress: 3, mental: 2 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              trust: 6,
              tension: 3,
              history: "你说得很慢，但说得很真。"
            }
          ]
        }),
        ch({
          text: "只敢暧昧不敢承诺：对方离开。",
          effects: { age: 0, stats: { happiness: -4, mental: -2 } },
          log: "你保护自己没错，但保护过头也会变成孤独。"
        }),
        ch({
          text: "先把日子过稳：爱情排到后面。",
          effects: { age: 0, stats: { career: 3, discipline: 3, happiness: 1 } },
          addFlags: ["post_divorce_rebuild"],
          log: "你把重建理解成顺序题，而不是情绪题。"
        })
      ]
    }),

    ev({
      id: "youth_gender_notice_classmate",
      stage: "adolescence",
      title: "你开始会「多看一眼」某个人",
      text: "初中教室很挤，心思也很挤。某个人的笑声、侧脸、跑步回来的气喘，突然会在你的注意力里占到不该占的份额。",
      minAge: 12,
      maxAge: 15,
      weight: 8,
      repeatable: true,
      cooldownChoices: 8,
      dedupeKey: "youth_opposite_sex_notice",
      dedupeSpacingChoices: 6,
      tags: ["romance", "adolescence", "school"],
      conditions: {
        excludedFlags: ["player_married"]
      },
      choices: [
        ch({
          text: "把心动写进日记：不敢让人知道。",
          effects: { age: 0, stats: { mental: 2, happiness: 1, discipline: 1 } },
          relationshipEffects: [
            {
              targetId: "gu_shuran",
              theirInterest: 2,
              playerInterest: 4,
              familiarity: 2,
              history: "你开始用很老派的方式，藏一件很年轻的心事。"
            }
          ]
        }),
        ch({
          text: "被同桌起哄你和某人——脸热到爆炸。",
          effects: { age: 0, stats: { social: 3, stress: 3, happiness: 1 } },
          relationshipEffects: [
            {
              targetId: "hao_yiming",
              ambiguity: 5,
              tension: 4,
              familiarity: 3,
              history: "起哄像恶作剧，也像替你说出不敢说的话。"
            }
          ]
        }),
        ch({
          text: "主动借一次笔记：关系有了正当理由靠近。",
          effects: { age: 0, stats: { intelligence: 2, social: 2 } },
          relationshipEffects: [
            {
              targetId: "gu_shuran",
              familiarity: 4,
              playerInterest: 3,
              history: "借笔记是最朴素的借口，也是最安全的靠近。"
            }
          ]
        })
      ]
    }),
    ev({
      id: "youth_crush_misread_message",
      stage: "adolescence",
      title: "一条消息读三遍：喜欢还是礼貌？",
      text: "群聊、空间和后来的私聊里，标点与表情都能被解读成爱情证据。误会在青春期像野草，一夜就能长满。",
      minAge: 13,
      maxAge: 17,
      weight: 7,
      repeatable: true,
      cooldownChoices: 8,
      tags: ["romance", "adolescence"],
      conditions: {
        excludedFlags: ["player_married"]
      },
      choices: [
        ch({
          text: "直接问清楚：尴尬，但少内耗。",
          effects: { age: 0, stats: { social: 2, stress: 2, mental: 2 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              trust: 4,
              tension: 3,
              history: "你把悬着的问题拽到地上，答案反而没那么可怕。"
            }
          ]
        }),
        ch({
          text: "憋着不说，自己演完一整部戏。",
          effects: { age: 0, stats: { mental: -2, stress: 4 } },
          relationshipEffects: [
            {
              targetId: "__active__",
              ambiguity: 5,
              playerInterest: 4,
              history: "你在心里把对方爱了很多遍，现实里却一动没动。"
            }
          ]
        }),
        ch({
          text: "误会解除：原来是群发祝福。",
          effects: { age: 0, stats: { happiness: -2, intelligence: 2 } },
          log: "你笑自己傻，也第一次知道心动会让人降智。"
        })
      ]
    })
  ];

  window.LIFE_EXTRA_EVENTS = (Array.isArray(window.LIFE_EXTRA_EVENTS) ? window.LIFE_EXTRA_EVENTS : []).concat(
    expansionPack
  );
})();

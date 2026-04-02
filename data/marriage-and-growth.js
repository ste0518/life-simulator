(function () {
  "use strict";

  /**
   * 结婚系统 + 恋爱对象分阶段简介 + 带倾向的随机成长库
   * ------------------------------------------------------------
   * 手动改这里即可调：触发条件、事件文案、每人每阶段简介、成长弧权重与修正。
   * 引擎侧读取：window.LIFE_MARRIAGE_CONFIG、LIFE_CHARACTER_GROWTH、本文件追加的 LIFE_EXTRA_EVENTS。
   */

  function ev(source) {
    return source;
  }

  function ch(source) {
    return source;
  }

  /** 全局结婚门槛（个体差异常用 growthModifiers.marriageEase 微调，见引擎） */
  const marriageConfig = {
    minPlayerAge: 26,
    /** 从确认恋爱状态起算的最少「一起经过的年数」（用年龄差近似） */
    minPartnerAgeSpan: 2,
    allowedStatuses: ["dating", "passionate", "steady", "long_distance_dating"],
    minCommitment: 58,
    minTrust: 52,
    minAffection: 55,
    maxTension: 48,
    /** growthModifiers.marriageEase 每 1 点，等效降低 minCommitment 约 0.35（在引擎内计算） */
    commitmentEaseFactor: 0.35
  };

  /**
   * 分阶段简介：key = 展示用人生段；引擎按年龄/婚否选用。
   * 可用占位 {name}；byArc 下可按 growthArcId 覆盖整段文本。
   */
  const defaultStageProfiles = {
    youth: "{name}在你记忆里还停留在更小的时候：话不多、轮廓也还没长开，但性格里那点底色已经能看出来。",
    adolescence: "{name}正处在会把小事看得很重的年纪，学业和同伴眼光压在同一个秤盘上。",
    highschool: "{name}被考试、排名和「以后去哪」追着跑，你们之间是熟是远，往往取决于同一间教室还能坐多久。",
    college: "{name}的生活被专业课、宿舍和新的城市半径重写，联系变少并不一定代表变心，更常代表节奏被拆散。",
    work_early: "{name}开始用工资单和加班时长说话，浪漫要让位于通勤、房租和下一次晋升窗口。",
    young_adult_deep: "{name}在「稳定下来」和「再拼一把」之间来回摆，对关系的耐心也和存款数字绑得更紧。",
    married: "{name}把「我们」写进日常开支表和家务分工里，亲密不再只是心动，而是能不能一起把日子过顺。",
    mature: "{name}更清楚自己要什么、能忍什么；有些温柔变沉了，有些棱角也被现实磨钝或磨尖。"
  };

  /** 为减少重复，未单独列出的角色回退到 _default */
  const characterStageProfiles = {
    _default: defaultStageProfiles,
    song_qinghe: {
      youth: "{name}小时候就像会把句子写得很干净的那种孩子，安静，却会把别人的话听进去。",
      adolescence: "{name}在班里不争吵不抢镜，却总能在作文和读书笔记里露出她的心思。",
      highschool: "{name}被文科、排名和「要不要冲更好的城市」反复拉扯，情绪常藏在很浅的笑后面。",
      college: "{name}去了让她能继续和文字相处的环境；联系变少时，她更习惯把话写长，而不是说满。",
      work_early: "{name}开始把表达换成工作内容：策划、文案、教育或出版边缘，总之离不开「把话说清楚」。",
      young_adult_deep: "{name}越来越看重可预测的温暖，也更怕那种忽冷忽热的浪漫。",
      married: "{name}会把婚姻当成长期文本：需要修订、批注和共同署名，而不是一次性的誓言。",
      mature: "{name}学会了把敏感收束成体贴，也可能因此更少说自己真正怕的东西。",
      byArc: {
        cold_success: {
          work_early: "{name}升得很快，谈吐更利，回消息越来越像在工作群里留痕。",
          mature: "{name}表面更成功，私下却更常失联——不是忙，是不知道怎么把软的那面递出来。"
        },
        warm_stable: {
          married: "{name}婚后更像家里的「稳定器」，吵架也会先把你的情绪按住再讲道理。"
        }
      }
    },
    jiang_xun: {
      youth: "{name}小时候就是球场和人群里那个会先笑出声的人，直来直去。",
      adolescence: "{name}把兄弟义气和面子看得很重，喜欢你也会先用「一起干点啥」当借口。",
      highschool: "{name}被训练赛、成绩波动和「要不要走体育/正常高考」缠着，情绪来得快也去得快。",
      college: "{name}如果还打球，伤与恢复会成为他的成人礼；如果不打了，他会拼命找新的存在感。",
      work_early: "{name}在应酬、业绩和熬夜之间切换，嘴上说没事，身体先抗议。",
      young_adult_deep: "{name}开始问「这样冲下去值不值」，但问完多半还是去冲。",
      married: "{name}婚后会想把家里也变成团队：分工明确，但容易忘了浪漫需要浪费一点时间。",
      mature: "{name}要么学会慢下来，要么把热情换成沉默的承担。",
      byArc: {
        volatile_drift: {
          work_early: "{name}混得不算差，却总觉得心里闷，喝多时才肯说两句真的。",
          mature: "{name}变得更客气，也更陌生——像对你好的同事，而不像曾经那个敢抢你球的人。"
        }
      }
    },
    lin_xiaonan: {
      adolescence: "{name}把草稿纸写得很满，像用公式挡住紧张；你愿意靠近时，她会更先相信「题」而不是「话」。",
      highschool: "{name}被排名和「女生学理科」的闲话夹击，坚强得很吃力。",
      college: "{name}若去读理工科，会把「证明自己」写进每一次考试；若换路，也会带着愧疚感。",
      work_early: "{name}更常穿正装出现在实验室、机房或报表前，温柔藏得很深。",
      married: "{name}婚后会认真算房贷与生育账，也偷偷希望有人告诉她「你可以不用一直扛」。",
      mature: "{name}可能更锐利，也可能终于肯承认自己也会累。",
      byArc: {
        warm_stable: {
          mature: "{name}长成了那种「说到做到」的人，对你的好不再热闹，但很沉。"
        }
      }
    },
    zhou_mingyue: {
      highschool: "{name}在广播站和人群之间切换自如，嘴快、好笑，也更怕被看穿软肋。",
      college: "{name}如果去了媒体、艺术或外向型专业，会如鱼得水；若被摁在不适合的赛道，会蔫也会炸。",
      work_early: "{name}把社交当资源，也把孤独藏得很深；凌晨朋友圈比白天更真。",
      married: "{name}婚后会坚持要有自己的舞台，也会试探你有没有把她当成「家属附件」。",
      mature: "{name}要么学会柔软，要么把锋利练成盔甲——中间态最折磨身边人。",
      byArc: {
        cold_success: {
          work_early: "{name}越做越大，笑得更标准，却越来越少问你「今天怎么样」。"
        }
      }
    }
  };

  /**
   * 成长随机库：arcs 为可选成年走向；roll 在引擎 17 岁首次触发（可改龄）。
   * weight：基础权重；virtueBias：少年「底色越好」时放大（0.5–1.5 左右）；viceBias：底色偏弱时放大。
   * modifiers 写入 relationship.growthModifiers，影响结婚门槛、推断稳定态等（见引擎）。
   * addArcFlags：写入 relationship.flags，便于事件 conditions（requiredActiveRelationshipFlags）。
   */
  const defaultGrowthArcs = [
    {
      id: "warm_stable",
      label: "更温柔稳重",
      weight: 22,
      virtueBias: 1.35,
      viceBias: 0.55,
      modifiers: { marriageEase: 10, stability: 12, warmth: 10, breakupRisk: -6, realism: 4 },
      addArcFlags: ["growth_arc_warm_stable"]
    },
    {
      id: "cold_success",
      label: "事业上升但疏离",
      weight: 14,
      virtueBias: 0.75,
      viceBias: 0.95,
      modifiers: { marriageEase: -6, stability: 4, warmth: -10, breakupRisk: 8, realism: 18, ambition: 14 },
      addArcFlags: ["growth_arc_cold_success"]
    },
    {
      id: "exhausted_realist",
      label: "被现实磨累",
      weight: 16,
      virtueBias: 0.65,
      viceBias: 1.2,
      modifiers: { marriageEase: -4, stability: 2, warmth: 2, breakupRisk: 4, realism: 16, stressVuln: 10 },
      addArcFlags: ["growth_arc_exhausted"]
    },
    {
      id: "volatile_drift",
      label: "情绪起伏变大",
      weight: 12,
      virtueBias: 0.45,
      viceBias: 1.25,
      modifiers: { marriageEase: -12, stability: -10, warmth: -4, breakupRisk: 14, stressVuln: 12 },
      addArcFlags: ["growth_arc_volatile"]
    },
    {
      id: "quiet_maturity",
      label: "沉默成熟",
      weight: 18,
      virtueBias: 1.1,
      viceBias: 0.85,
      modifiers: { marriageEase: 4, stability: 14, warmth: 6, breakupRisk: -2, realism: 10 },
      addArcFlags: ["growth_arc_quiet_mature"]
    },
    {
      id: "controlled_ambition",
      label: "更强控制欲与目标感",
      weight: 10,
      virtueBias: 0.7,
      viceBias: 1.05,
      modifiers: { marriageEase: -8, stability: 6, warmth: -6, breakupRisk: 10, realism: 14, control: 16 },
      addArcFlags: ["growth_arc_controlled"]
    }
  ];

  const characterGrowthPools = {
    _default: {
      rollAge: 17,
      arcs: defaultGrowthArcs
    },
    song_qinghe: {
      rollAge: 17,
      arcs: defaultGrowthArcs.map((a) =>
        a.id === "warm_stable" ? { ...a, weight: 34, virtueBias: 1.5 } : a.id === "volatile_drift" ? { ...a, weight: 8 } : a
      )
    },
    jiang_xun: {
      rollAge: 17,
      arcs: defaultGrowthArcs.map((a) =>
        a.id === "volatile_drift" ? { ...a, weight: 18 } : a.id === "warm_stable" ? { ...a, weight: 14 } : a
      )
    },
    lin_xiaonan: {
      rollAge: 17,
      arcs: defaultGrowthArcs.map((a) =>
        a.id === "quiet_maturity" ? { ...a, weight: 26, virtueBias: 1.4 } : a
      )
    },
    zhou_mingyue: {
      rollAge: 17,
      arcs: defaultGrowthArcs.map((a) =>
        a.id === "cold_success" ? { ...a, weight: 22 } : a.id === "volatile_drift" ? { ...a, weight: 16 } : a
      )
    }
  };

  const marriageEvents = [
    ev({
      id: "marriage_arc_future_talk",
      stage: "family",
      title: "聊到以后：你们到底把彼此放在计划的哪一行？",
      text: "关系走到这里，「喜欢」已经不够用来解释全部。你会开始听见一些更硬的问题：要不要同城、要不要孩子、要不要把父母接进决策里。说开了不一定舒服，但装没看见会更累。",
      minAge: 26,
      maxAge: 42,
      weight: 9,
      repeatable: true,
      tags: ["romance", "marriage", "family"],
      conditions: {
        excludedFlags: ["player_married"],
        activeRelationshipStatuses: ["dating", "passionate", "steady", "long_distance_dating"],
        activeRelationshipMinCommitment: 52,
        activeRelationshipMinTrust: 48,
        activeRelationshipMinAffection: 52,
        activeRelationshipMaxTension: 52,
        activeRelationshipMinPartnerAgeSpan: 2
      },
      choices: [
        ch({
          text: "认真谈一次「五年后想在哪、过什么日子」——把话说透，也听听对方的怕。",
          effects: { stats: { happiness: 2, stress: 2, mental: 2 } },
          addFlags: ["marriage_talk_future", "marriage_planning_open"],
          relationshipEffects: [
            {
              targetId: "__active__",
              trust: 6,
              commitment: 5,
              tension: 2,
              history: "你们第一次把「以后」从玩笑聊成具体坐标。"
            }
          ]
        }),
        ch({
          text: "先绕开婚姻这个词，只约定明年要不要同居试试。",
          effects: { stats: { happiness: 1, stress: 1 } },
          addFlags: ["marriage_cohab_trial"],
          relationshipEffects: [
            {
              targetId: "__active__",
              commitment: 4,
              familiarity: 5,
              history: "你们把「住到一起」当成实验，而不是誓言。"
            }
          ]
        }),
        ch({
          text: "笑说还早，把话题岔开——你知道自己在躲，但今晚先不想吵。",
          effects: { stats: { happiness: -1, stress: -1, mental: -1 } },
          addFlags: ["marriage_avoid_topic"],
          relationshipEffects: [
            {
              targetId: "__active__",
              theirInterest: -3,
              tension: 4,
              history: "对方眼里闪过一瞬失望，又很快被礼貌盖住。"
            }
          ]
        })
      ]
    }),
    ev({
      id: "marriage_arc_meet_parents",
      stage: "family",
      title: "见家长：饭桌像审判席，也像一次合伙谈判",
      text: "「带回家」三个字听起来浪漫，真正落地往往是菜很烫、话很尖、笑很勉强。你会突然意识到：你们不只是两个人喜欢彼此，还要把两个家庭的脾气拼到一张桌上。",
      minAge: 26,
      maxAge: 45,
      weight: 8,
      repeatable: true,
      tags: ["romance", "marriage", "family"],
      conditions: {
        excludedFlags: ["player_married"],
        someFlags: ["marriage_talk_future", "marriage_cohab_trial"],
        activeRelationshipStatuses: ["dating", "passionate", "steady", "long_distance_dating"],
        activeRelationshipMinCommitment: 54,
        activeRelationshipMinTrust: 50
      },
      choices: [
        ch({
          text: "提前对齐口径：工作、存款、打算——一起进门，不让对方独自挡枪。",
          effects: { stats: { stress: 3, happiness: 2, familySupport: 2 } },
          addFlags: ["marriage_met_parents", "marriage_united_front"],
          relationshipEffects: [
            {
              targetId: "__active__",
              trust: 8,
              commitment: 6,
              tension: 1,
              history: "你们在进门前先握了一次手：像队友，也像夫妻预演。"
            }
          ]
        }),
        ch({
          text: "饭桌上被问到彩礼/房子，你选择硬顶回去，场面一度很僵。",
          effects: { stats: { stress: 5, money: -2, familySupport: -2 } },
          addFlags: ["marriage_family_clash"],
          relationshipEffects: [
            {
              targetId: "__active__",
              tension: 8,
              commitment: 3,
              history: "你替两个人挡了最刺耳的那几句，关系也因此更像「共犯」。"
            }
          ]
        }),
        ch({
          text: "对方父母明显不满意，你们出门后在路灯下吵又和好。",
          effects: { stats: { stress: 4, mental: -2, happiness: 1 } },
          addFlags: ["marriage_parent_opposed", "marriage_repair_after_clash"],
          relationshipEffects: [
            {
              targetId: "__active__",
              tension: 6,
              trust: 4,
              commitment: 5,
              history: "反对没有把你们冲散，反而把「还要不要继续」问得更真。"
            }
          ]
        })
      ]
    }),
    ev({
      id: "marriage_arc_proposal_crossroads",
      stage: "family",
      title: "求婚、推迟、还是把话收回心里？",
      text: "有人把这一刻准备成仪式，有人只想在吃完外卖的沙发上把话说完。无论哪种，关键都是：你们愿不愿意把「我」默认改成「我们」，并接受它带来的失去与新增。",
      minAge: 27,
      maxAge: 48,
      weight: 7,
      repeatable: true,
      tags: ["romance", "marriage"],
      conditions: {
        excludedFlags: ["player_married"],
        someFlags: ["marriage_talk_future", "marriage_met_parents", "marriage_cohab_trial"],
        activeRelationshipStatuses: ["steady", "dating", "passionate", "long_distance_dating"],
        activeRelationshipMinCommitment: 58,
        activeRelationshipMinTrust: 52,
        activeRelationshipMinAffection: 55,
        activeRelationshipMaxTension: 48,
        activeRelationshipMinPartnerAgeSpan: 2
      },
      choices: [
        ch({
          text: "把戒指/承诺拿出来，认真问一句：愿不愿意一起把户口和人生绑近一点。",
          customAction: "marriage_commit",
          customPayload: {
            addFlags: ["player_married", "marriage_proposed_by_player", "marriage_accepted"],
            moneyCost: 6,
            happiness: 5,
            stress: 3,
            partnerHistory: "你在并不完美的条件下，仍然选择了把名字写进彼此的长期里。"
          }
        }),
        ch({
          text: "对方先开口问你「要不要结婚」——你点头，反而比想象中平静。",
          customAction: "marriage_commit",
          customPayload: {
            addFlags: ["player_married", "marriage_proposed_by_partner", "marriage_accepted"],
            moneyCost: 4,
            happiness: 6,
            stress: 2,
            partnerHistory: "轮到对方更勇敢。你才发现自己不是不想，只是一直在等一句明确的邀请。"
          }
        }),
        ch({
          text: "你说「再等等」：现实压力还在，你不想用婚礼遮住还没解决的账。",
          effects: { stats: { stress: 2, mental: 2, career: 2 } },
          addFlags: ["marriage_postponed_realism"],
          relationshipEffects: [
            {
              targetId: "__active__",
              tension: 5,
              trust: 3,
              commitment: 2,
              history: "推迟不是拒绝，却把「我们到底差什么」摆到了桌面上。"
            }
          ]
        }),
        ch({
          text: "你意识到彼此不同频，选择把关系停在恋人，不走进婚姻。",
          effects: { stats: { happiness: -4, stress: 4, mental: 3 } },
          addFlags: ["marriage_declined_path"],
          relationshipEffects: [
            {
              targetId: "__active__",
              status: "cooling",
              tension: 10,
              commitment: -6,
              history: "婚姻这扇门你们最终没有一起推。喜欢还在，但不够换成一辈子。"
            }
          ]
        })
      ]
    }),
    ev({
      id: "marriage_life_rhythm",
      stage: "family",
      title: "婚后的日常：钱、家务、亲密与脾气",
      text: "婚礼会结束，生活不会。你们开始为洗碗、账单、加班和「你为什么又不回消息」重复磨合。幸福不再是高光时刻，而是能不能在累的时候仍然不把对方推远。",
      minAge: 28,
      maxAge: 55,
      weight: 12,
      repeatable: true,
      tags: ["romance", "marriage", "family"],
      conditions: {
        requiredFlags: ["player_married"],
        activeRelationshipStatuses: ["married"],
        activeRelationshipMinCommitment: 50
      },
      choices: [
        ch({
          text: "开一次家庭小会：把钱怎么花、家务怎么分写清楚。",
          effects: { stats: { stress: -2, happiness: 2, discipline: 2 } },
          addFlags: ["marriage_household_contract"],
          relationshipEffects: [
            {
              targetId: "__active__",
              trust: 5,
              tension: -3,
              history: "你们用很土的方式，把浪漫换成可执行的规则。"
            }
          ]
        }),
        ch({
          text: "为了备孕/孩子，把工作节奏放慢一点，也接受收入缩水。",
          effects: { stats: { happiness: 3, stress: 4, money: -3, career: -2 } },
          addFlags: ["marriage_family_first_phase"],
          relationshipEffects: [
            {
              targetId: "__active__",
              commitment: 6,
              theirInterest: 4,
              history: "你们把「要不要孩子」从讨论变成行动，关系也随之变得更厚。"
            }
          ]
        }),
        ch({
          text: "吵到说出伤人的话，夜里还是去倒了杯水放在对方床头。",
          effects: { stats: { mental: 2, stress: 3 } },
          addFlags: ["marriage_conflict_repair"],
          relationshipEffects: [
            {
              targetId: "__active__",
              tension: 4,
              trust: 4,
              commitment: 5,
              history: "婚姻里没有赢的那一方，只有愿不愿意先低头的那一下。"
            }
          ]
        })
      ]
    }),
    ev({
      id: "overseas_study_loan_side_hustle",
      stage: "college",
      title: "账本紧的时候，连社交都像在花钱",
      text: "留学贷款还在，你会更敏感地听见每一次「一起去」背后的价格：打车、聚餐、旅行。你不是不想去，只是会自动先算汇率和还款。",
      minAge: 18,
      maxAge: 32,
      weight: 14,
      repeatable: true,
      tags: ["overseas", "money", "stress"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        someFlags: ["overseas_study_loan", "study_abroad_debt"]
      },
      choices: [
        ch({
          text: "接多一份零工，把娱乐预算砍到接近零。",
          effects: { stats: { money: 2, stress: 3, health: -1, discipline: 2 } },
          addFlags: ["overseas_loan_frugal_grind"],
          customAction: "adjust_overseas_pressures",
          customPayload: { financePressure: -3, loneliness: 2, burnout: 4 }
        }),
        ch({
          text: "拒绝一次远行邀约，坦诚说「我账上不允许」。",
          effects: { stats: { social: -2, mental: 1, stress: -1 } },
          addFlags: ["overseas_declined_spend_social"],
          customAction: "adjust_overseas_pressures",
          customPayload: { financePressure: -2, belonging: -2 }
        }),
        ch({
          text: "咬牙刷一次卡参加聚会，回来对着账单失眠。",
          conditions: { minStats: { money: 8 } },
          effects: { stats: { social: 3, happiness: 1, money: -6, stress: 5, mental: -2 } },
          addFlags: ["overseas_loan_splurge_guilt"],
          customAction: "adjust_overseas_pressures",
          customPayload: { financePressure: 5 }
        })
      ]
    })
  ];

  window.LIFE_MARRIAGE_CONFIG = marriageConfig;
  window.LIFE_CHARACTER_GROWTH = {
    marriageConfig,
    characterStageProfiles,
    characterGrowthPools,
    defaultStageProfiles,
    defaultGrowthArcs
  };

  window.LIFE_EXTRA_EVENTS = (Array.isArray(window.LIFE_EXTRA_EVENTS) ? window.LIFE_EXTRA_EVENTS : []).concat(marriageEvents);
})();

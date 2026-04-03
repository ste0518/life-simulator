(function () {
  "use strict";

  /**
   * 全阶段意外事件库（tags 含 accident，配合 timeline-rules 配额加权）
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

  function condition(value) {
    const source = value && typeof value === "object" ? value : {};
    return {
      minAge: typeof source.minAge === "number" ? source.minAge : null,
      maxAge: typeof source.maxAge === "number" ? source.maxAge : null,
      minStats: toStats(source.minStats),
      maxStats: toStats(source.maxStats),
      requiredFlags: toList(source.requiredFlags),
      excludedFlags: toList(source.excludedFlags),
      someFlags: toList(source.someFlags),
      minChildCount: typeof source.minChildCount === "number" ? source.minChildCount : null,
      maxChildCount: typeof source.maxChildCount === "number" ? source.maxChildCount : null,
      educationRouteIds: toList(source.educationRouteIds),
      excludedEducationRouteIds: toList(source.excludedEducationRouteIds),
      careerRouteIds: toList(source.careerRouteIds),
      excludedCareerRouteIds: toList(source.excludedCareerRouteIds),
      visited: toList(source.visited),
      notVisited: toList(source.notVisited)
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
    const n = mutation(source);
    return {
      text: typeof source.text === "string" ? source.text : "继续",
      effects: n.effects,
      addFlags: n.addFlags,
      removeFlags: n.removeFlags,
      addTags: n.addTags,
      removeTags: n.removeTags,
      log: n.log,
      conditions: condition(source.conditions || {})
    };
  }

  function event(value) {
    const source = value && typeof value === "object" ? value : {};
    return {
      id: typeof source.id === "string" ? source.id : "",
      stage: typeof source.stage === "string" ? source.stage : "misc",
      title: typeof source.title === "string" ? source.title : "意外",
      text: typeof source.text === "string" ? source.text : "",
      minAge: typeof source.minAge === "number" ? source.minAge : null,
      maxAge: typeof source.maxAge === "number" ? source.maxAge : null,
      weight: typeof source.weight === "number" ? source.weight : 3,
      repeatable: source.repeatable !== false,
      cooldownChoices: typeof source.cooldownChoices === "number" ? source.cooldownChoices : 8,
      tags: toList(source.tags),
      conditions: condition(source.conditions || {}),
      effectsOnEnter: mutation(source.effectsOnEnter || {}),
      choices: Array.isArray(source.choices) ? source.choices.map(choice) : []
    };
  }

  var STUDENT_IDS = (window.LIFE_TIMELINE_STUDENT_EDUCATION_IDS || []).slice();
  var OVERSEAS_UNI = ["overseas_research_path", "overseas_practical_path", "overseas_art_path"];

  var ACCIDENT_POOL = [
    event({
      id: "acc_exp_toddler_scald",
      stage: "childhood",
      title: "意外：碰翻热水，烫红一小块皮肤",
      text: "大人自责，你也哭个不停。身体第一次教你「疼」可以很具体。",
      minAge: 1,
      maxAge: 5,
      tags: ["accident", "health", "family"],
      choices: [
        choice({
          text: "及时处理后慢慢恢复，家里气氛紧了好几天。",
          effects: { age: 0, stats: { health: -3, familySupport: 2, stress: 2 } },
          addFlags: ["early_burn_memory"],
          log: "你很小就记住：危险常藏在日常里。"
        })
      ]
    }),
    event({
      id: "acc_exp_toddler_park_fall",
      stage: "childhood",
      title: "意外：在游乐场摔了一跤，膝盖见血",
      text: "消毒水的味道比伤口还冲。你一边哭一边被夸勇敢。",
      minAge: 2,
      maxAge: 5,
      tags: ["accident", "health"],
      choices: [
        choice({
          text: "休息几天，学会自己看路。",
          effects: { age: 0, stats: { health: -2, discipline: 1, happiness: 1 } },
          log: "疼痛过去，谨慎留下。"
        })
      ]
    }),
    event({
      id: "acc_exp_primary_lost_wallet",
      stage: "school",
      title: "意外：攒的零钱在操场丢了",
      text: "你翻遍口袋，像翻自己的信誉。有人笑你大惊小怪，你却很认真。",
      minAge: 7,
      maxAge: 11,
      tags: ["accident", "money"],
      choices: [
        choice({
          text: "接受损失，下次用更笨的办法保管。",
          effects: { age: 0, stats: { money: -2, mental: 1, discipline: 2 } },
          addFlags: ["money_care_habit"],
          log: "你学会把钱当成责任，而不只是数字。"
        }),
        choice({
          text: "怀疑同学，闹得不愉快又后悔。",
          effects: { age: 0, stats: { social: -3, stress: 3, mental: -2 } },
          addFlags: ["trust_scratch_primary"],
          log: "误会的代价，比丢钱更大。"
        })
      ]
    }),
    event({
      id: "acc_exp_primary_contest_honor",
      stage: "school",
      title: "意外：校级小比赛拿了个奖",
      text: "奖状不大，却足够让你走路带风几天。",
      minAge: 7,
      maxAge: 11,
      tags: ["accident", "education"],
      choices: [
        choice({
          text: "把兴奋化成下一次练习。",
          effects: { age: 0, stats: { happiness: 5, intelligence: 2, discipline: 2 } },
          addFlags: ["early_award_momentum"],
          log: "你尝到努力被点名的好味道。"
        })
      ]
    }),
    event({
      id: "acc_exp_primary_neighbor_help",
      stage: "school",
      title: "意外：邻居老人塞给你一包零食",
      text: "说是谢谢你帮忙拎过菜。善意来得突然，你有点不好意思。",
      minAge: 6,
      maxAge: 11,
      tags: ["accident", "family"],
      choices: [
        choice({
          text: "认真道谢，记住被需要的感觉。",
          effects: { age: 0, stats: { happiness: 3, social: 2, familySupport: 1 } },
          addFlags: ["kindness_received_memory"],
          log: "世界偶尔会用甜回报你。"
        })
      ]
    }),
    event({
      id: "acc_exp_ms_bike_crash",
      stage: "adolescence",
      title: "意外：骑车拐弯时擦伤手臂",
      text: "校服袖子磨破，皮肉火辣。你第一次感到「逞能」的账单。",
      minAge: 12,
      maxAge: 14,
      tags: ["accident", "health"],
      choices: [
        choice({
          text: "老实养伤，顺便把速度降下来。",
          effects: { age: 0, stats: { health: -4, discipline: 2, stress: 1 } },
          addFlags: ["risk_aware_teen"],
          log: "你在疼里学会留余地。"
        })
      ]
    }),
    event({
      id: "acc_exp_ms_rumor_spike",
      stage: "adolescence",
      title: "意外：关于你的谣言在班里传开",
      text: "真假掺半的话像墨水滴进清水。你愤怒，又不知道先找谁对质。",
      minAge: 12,
      maxAge: 14,
      tags: ["accident", "social"],
      choices: [
        choice({
          text: "找班主任和家长一起澄清边界。",
          effects: { age: 0, stats: { stress: 3, mental: 2, social: 1 } },
          addFlags: ["rumor_fought_back"],
          log: "你把委屈换成程序，而不是内伤。"
        }),
        choice({
          text: "冷处理，假装听不见。",
          effects: { age: 0, stats: { stress: 5, mental: -3, happiness: -2 } },
          addFlags: ["rumor_swallowed"],
          log: "沉默保护你，也让你更孤立。"
        })
      ]
    }),
    event({
      id: "acc_exp_ms_subsidy_letter",
      stage: "adolescence",
      title: "意外：一笔补助或助学金批下来",
      text: "钱不多，却像有人替你家松了一根绳。",
      minAge: 12,
      maxAge: 14,
      tags: ["accident", "money", "family"],
      choices: [
        choice({
          text: "把钱用在学习材料上，记一份人情。",
          effects: { age: 0, stats: { money: 4, intelligence: 2, stress: -2 } },
          addFlags: ["grant_gratitude_teen"],
          log: "你学会把帮助当成要还的体面。"
        })
      ]
    }),
    event({
      id: "acc_exp_hs_mock_crash",
      stage: "highschool",
      title: "意外：模考发挥失常，名次断崖",
      text: "卷子上的红叉像嘲笑。你怀疑是不是「状态」骗了你，还是底子露了馅。",
      minAge: 15,
      maxAge: 17,
      tags: ["accident", "education"],
      choices: [
        choice({
          text: "拆卷复盘，把失误分类而不是自责。",
          effects: { age: 0, stats: { intelligence: 2, stress: 2, mental: 2 } },
          addFlags: ["mock_recovery_method"],
          log: "你把崩溃改成工序。"
        }),
        choice({
          text: "几天学不进去，靠游戏逃避。",
          effects: { age: 0, stats: { stress: 4, intelligence: -2, mental: -2 } },
          addFlags: ["mock_avoidance_spiral"],
          log: "逃避很软，却会把洞挖大。"
        })
      ]
    }),
    event({
      id: "acc_exp_hs_competition_dark_horse",
      stage: "highschool",
      title: "意外：小学科竞赛爆冷拿奖",
      text: "连自己都没料到。老师看你的眼神多了一点东西——期待，也可能是压力。",
      minAge: 15,
      maxAge: 17,
      tags: ["accident", "education"],
      choices: [
        choice({
          text: "接住关注，也把期待谈判到合理范围。",
          effects: { age: 0, stats: { intelligence: 3, happiness: 4, stress: 2 } },
          addFlags: ["comp_dark_horse_managed"],
          log: "惊喜之后，要学会设边界。"
        })
      ]
    }),
    event({
      id: "acc_exp_hs_family_money_shock",
      stage: "highschool",
      title: "意外：家里突然宽裕或突然吃紧",
      text: "可能是奖金、拆迁消息，也可能是有人失业。你的人生预算表被外力改写了一行。",
      minAge: 15,
      maxAge: 17,
      tags: ["accident", "family", "money"],
      choices: [
        choice({
          text: "若变好：谨慎高兴，帮家里一起规划。",
          effects: { age: 0, stats: { money: 6, happiness: 3, familySupport: 2, stress: -1 } },
          addFlags: ["family_finance_upshift"],
          log: "钱来了，责任也会跟着进场。"
        }),
        choice({
          text: "若变差：收紧欲望，把焦虑说出来。",
          effects: { age: 0, stats: { money: -4, stress: 5, mental: -2, familySupport: 1 } },
          addFlags: ["family_finance_shock_hs"],
          log: "现实提前教你做取舍。"
        })
      ]
    }),
    event({
      id: "acc_exp_college_email_wrong",
      stage: "college",
      title: "意外：重要邮件发错人或错过截止",
      text: "补救邮件写得很卑微。你第一次理解「流程」比脾气大。",
      minAge: 18,
      maxAge: 24,
      tags: ["accident", "education"],
      conditions: condition({ educationRouteIds: STUDENT_IDS }),
      choices: [
        choice({
          text: "连夜补救并当面道歉，争取补交通道。",
          effects: { age: 0, stats: { stress: 4, discipline: 2, intelligence: 1 } },
          addFlags: ["admin_near_miss_lesson"],
          log: "你用尴尬换一次系统免疫。"
        })
      ]
    }),
    event({
      id: "acc_exp_college_wallet_back",
      stage: "college",
      title: "意外：丢的钱包被同学送回",
      text: "现金还在，证件也在。你相信世界又亮了一点。",
      minAge: 18,
      maxAge: 24,
      tags: ["accident", "money", "social"],
      conditions: condition({ educationRouteIds: STUDENT_IDS }),
      choices: [
        choice({
          text: "认真请客答谢，也把善意传下去。",
          effects: { age: 0, stats: { happiness: 5, social: 3, money: -2 } },
          addFlags: ["campus_trust_restored"],
          log: "你相信人与人之间还能靠信。"
        })
      ]
    }),
    event({
      id: "acc_exp_college_health_screen",
      stage: "college",
      title: "意外：体检查出一个要复查的指标",
      text: "医生语气平淡，你心里却起了浪。年轻不是无限透支的理由。",
      minAge: 18,
      maxAge: 28,
      tags: ["accident", "health"],
      conditions: condition({ educationRouteIds: STUDENT_IDS }),
      choices: [
        choice({
          text: "复查、调整作息，把恐慌换成行动。",
          effects: { age: 0, stats: { health: 3, stress: 2, discipline: 2 } },
          addFlags: ["health_screen_followup"],
          log: "身体用数据提醒你慢下来。"
        }),
        choice({
          text: "拖着不去，靠侥幸过日子。",
          effects: { age: 0, stats: { stress: 4, health: -3, mental: -2 } },
          addFlags: ["health_screen_avoided"],
          log: "拖延不会让问题消失。"
        })
      ]
    }),
    event({
      id: "acc_exp_young_job_interview_mess",
      stage: "young_adult",
      title: "意外：面试当天地铁故障 / 迟到",
      text: "你狂奔、道歉、补救。结果未必坏，但过程像被生活捉弄。",
      minAge: 18,
      maxAge: 24,
      tags: ["accident", "work"],
      conditions: condition({ excludedEducationRouteIds: STUDENT_IDS }),
      choices: [
        choice({
          text: "诚恳说明并提供作品集链接补救。",
          effects: { age: 0, stats: { career: 1, stress: 3, social: 2 } },
          addFlags: ["interview_recovery_try"],
          log: "体面有时是事后挣回来的。"
        }),
        choice({
          text: "自认倒霉，放弃跟进。",
          effects: { age: 0, stats: { stress: 2, career: -1, mental: -1 } },
          log: "一次意外，可能关掉一扇本可再敲的门。"
        })
      ]
    }),
    event({
      id: "acc_exp_os_visa_delay",
      stage: "college",
      title: "意外：签证或居留材料延误",
      text: "课要注册，房租要付，身份却悬在半空。你在合法与焦虑之间走钢丝。",
      minAge: 18,
      maxAge: 30,
      tags: ["accident", "money"],
      conditions: condition({
        requiredFlags: ["life_path_overseas"],
        educationRouteIds: OVERSEAS_UNI
      }),
      choices: [
        choice({
          text: "找国际处与律师模板信，按流程推进。",
          effects: { age: 0, stats: { stress: 4, mental: 2, money: -2 } },
          addFlags: ["visa_delay_managed"],
          log: "你把恐慌拆成可执行步骤。"
        })
      ]
    }),
    event({
      id: "acc_exp_os_stranger_kind",
      stage: "college",
      title: "意外：陌生人在迷路时把你送到站点",
      text: "一句带口音的「跟我走」让你差点哭出来。城市突然软了一点。",
      minAge: 17,
      maxAge: 30,
      tags: ["accident", "social"],
      conditions: condition({ requiredFlags: ["life_path_overseas"] }),
      choices: [
        choice({
          text: "记下这份善意，以后也帮人指一次路。",
          effects: { age: 0, stats: { happiness: 4, mental: 2, stress: -2 } },
          addFlags: ["overseas_stranger_grace"],
          log: "你被陌生人提醒：世界不只有规则。"
        })
      ]
    }),
    event({
      id: "acc_exp_work_landlord_hike",
      stage: "career",
      title: "意外：房东通知涨租",
      text: "合同条款你第一次读得那么认真。搬还是不搬，都是成本。",
      minAge: 22,
      maxAge: 45,
      tags: ["accident", "money"],
      conditions: condition({ excludedEducationRouteIds: STUDENT_IDS }),
      choices: [
        choice({
          text: "谈判续租或同步找备选房源。",
          effects: { age: 0, stats: { stress: 4, money: -3, career: 1 } },
          addFlags: ["rent_hike_negotiation"],
          log: "你把被动改成双向选择。"
        }),
        choice({
          text: "咬牙接受，压缩其他开支。",
          effects: { age: 0, stats: { money: -5, happiness: -2, stress: 3 } },
          addFlags: ["rent_hike_absorb"],
          log: "稳定很贵，你用自己的欲望买单。"
        })
      ]
    }),
    event({
      id: "acc_exp_work_bonus_unexpected",
      stage: "career",
      title: "意外：一笔计划外的奖金或项目分成",
      text: "钱到账时你愣了几秒。像生活在给你发一颗糖。",
      minAge: 24,
      maxAge: 50,
      tags: ["accident", "money", "work"],
      conditions: condition({
        excludedCareerRouteIds: ["career_in_job_search", "unemployed_drift_route"]
      }),
      choices: [
        choice({
          text: "大部分存起来，小部分奖励自己。",
          effects: { age: 0, stats: { money: 8, happiness: 4, stress: -2 } },
          addFlags: ["windfall_saved_split"],
          log: "你学会让好运变成长跑燃料。"
        }),
        choice({
          text: "立刻花掉庆祝，后面再想办法。",
          effects: { age: 0, stats: { money: 3, happiness: 6, stress: 1 } },
          addTags: ["risk"],
          log: "快乐很真，账本也很真。"
        })
      ]
    }),
    event({
      id: "acc_exp_work_misunderstood",
      stage: "career",
      title: "意外：被同事或客户当众误会",
      text: "解释像越描越黑。你感到职业尊严被擦了一下。",
      minAge: 23,
      maxAge: 55,
      tags: ["accident", "work"],
      conditions: condition({ excludedCareerRouteIds: ["career_in_job_search"] }),
      choices: [
        choice({
          text: "会后单独沟通，用事实和时间线复盘。",
          effects: { age: 0, stats: { career: 2, stress: 2, social: 1 } },
          addFlags: ["work_misunderstand_repair"],
          log: "体面不是当场赢，是事后把线理清。"
        }),
        choice({
          text: "心里记仇，效率与心情一起掉。",
          effects: { age: 0, stats: { stress: 5, career: -1, mental: -2 } },
          addFlags: ["work_grudge_carry"],
          log: "带着刺上班，最先流血的是自己。"
        })
      ]
    }),
    event({
      id: "acc_exp_work_travel_chance",
      stage: "career",
      title: "意外：抽中或获赠一次短途旅行机会",
      text: "时间很紧，但风景像把你从 KPI 里拽出来一口气。",
      minAge: 25,
      maxAge: 55,
      tags: ["accident", "happiness"],
      choices: [
        choice({
          text: "请假出发，把通知设置成静音。",
          effects: { age: 0, stats: { happiness: 6, stress: -3, money: -2, career: -1 } },
          addFlags: ["travel_gift_taken"],
          log: "你用几天空白换回来的电量很实在。"
        }),
        choice({
          text: "让给家里人或转卖折现。",
          effects: { age: 0, stats: { money: 4, familySupport: 2, happiness: 2 } },
          log: "你把机会换成另一种责任。"
        })
      ]
    }),
    event({
      id: "acc_exp_married_ring_lost",
      stage: "family",
      title: "意外：婚戒或纪念品找不到了",
      text: "不算天塌，却像心里缺了一小块。你们第一次为「象征」吵起来。",
      minAge: 24,
      maxAge: 50,
      tags: ["accident", "romance"],
      conditions: condition({ requiredFlags: ["player_married"] }),
      choices: [
        choice({
          text: "一起翻找，把情绪与事实分开谈。",
          effects: { age: 0, stats: { stress: 2, happiness: 1, familySupport: 2 } },
          addFlags: ["marriage_symbol_repair_talk"],
          log: "物件会丢，默契可以补。"
        }),
        choice({
          text: "互相指责，旧事一起翻上来。",
          effects: { age: 0, stats: { stress: 6, happiness: -3, mental: -2 } },
          addFlags: ["marriage_spike_fight"],
          log: "小事能引爆，是因为库存太多。"
        })
      ]
    }),
    event({
      id: "acc_exp_parent_kid_ill",
      stage: "family",
      title: "意外：孩子突然高烧，夜里折腾",
      text: "体温计比闹钟更响。工作和睡眠同时告急。",
      minAge: 22,
      maxAge: 50,
      tags: ["accident", "children", "health"],
      conditions: condition({ minChildCount: 1 }),
      choices: [
        choice({
          text: "两人轮流扛，先把就医路线走稳。",
          effects: { age: 0, stats: { stress: 4, health: -2, happiness: 1, money: -2 } },
          addFlags: ["parenting_night_crisis_team"],
          log: "育儿把「我们」写成动词。"
        }),
        choice({
          text: "一方硬顶，另一方脱节，事后互相埋怨。",
          effects: { age: 0, stats: { stress: 6, familySupport: -2, mental: -2 } },
          addFlags: ["parenting_night_crisis_solo"],
          log: "疲惫会让爱也变得锋利。"
        })
      ]
    }),
    event({
      id: "acc_exp_parent_daycare_cancel",
      stage: "family",
      title: "意外：托班临时停课一天",
      text: "会议和接送撞车。你只能临时改写一天的优先级。",
      minAge: 25,
      maxAge: 45,
      tags: ["accident", "children", "work"],
      conditions: condition({ minChildCount: 1 }),
      choices: [
        choice({
          text: "申请远程或调休，把孩子安顿好。",
          effects: { age: 0, stats: { career: -1, stress: 3, happiness: 2, familySupport: 2 } },
          addFlags: ["childcare_cancel_managed"],
          log: "你把「不可控」排进日程表。"
        }),
        choice({
          text: "硬送去老人处，心里愧疚一整天。",
          effects: { age: 0, stats: { stress: 4, familySupport: 1, happiness: -2 } },
          log: "临时方案救急，也会留下情绪尾款。"
        })
      ]
    }),
    event({
      id: "acc_exp_elder_checkup",
      stage: "midlife",
      title: "意外：体检报告亮起黄色提醒",
      text: "医生说「观察」，你听成「警告」。人生第一次认真想戒烟、早睡和保险。",
      minAge: 45,
      maxAge: 70,
      tags: ["accident", "health"],
      choices: [
        choice({
          text: "复查并改三项生活习惯。",
          effects: { age: 0, stats: { health: 4, stress: 2, discipline: 2 } },
          addFlags: ["midlife_health_course_correct"],
          log: "身体给你发的是修订意见，不是终稿。"
        }),
        choice({
          text: "焦虑几天又恢复原样。",
          effects: { age: 0, stats: { stress: 4, health: -2, mental: -1 } },
          addFlags: ["midlife_health_ignored"],
          log: "侥幸是熟悉的床，却越睡越软。"
        })
      ]
    }),
    event({
      id: "acc_exp_elder_old_friend",
      stage: "later_life",
      title: "意外：失联多年的老友辗转找到你",
      text: "电话那头声音老了，故事却一下子把你拽回很久以前。",
      minAge: 55,
      maxAge: 90,
      tags: ["accident", "social"],
      choices: [
        choice({
          text: "约见面或长聊，把空白慢慢填上。",
          effects: { age: 0, stats: { happiness: 6, mental: 3, stress: 1 } },
          addFlags: ["late_reunion_warmth"],
          log: "时间抢走很多，也偶尔还一点。"
        }),
        choice({
          text: "礼貌寒暄后保持距离。",
          effects: { age: 0, stats: { happiness: 2, stress: -1 } },
          log: "不是所有重逢都要续写。"
        })
      ]
    }),
    event({
      id: "acc_exp_elder_scam_call",
      stage: "later_life",
      title: "意外：一通几乎上当的诈骗电话",
      text: "对方话术太熟，你心里一紧。钱没出去，但信任被划了一道。",
      minAge: 50,
      maxAge: 85,
      tags: ["accident", "money", "mental"],
      choices: [
        choice({
          text: "报警备案并提醒家人互设暗号。",
          effects: { age: 0, stats: { stress: 2, mental: 2, familySupport: 2 } },
          addFlags: ["scam_near_miss_family_shield"],
          log: "警惕也可以很温柔。"
        }),
        choice({
          text: "吓得好几天睡不着，对外界更疑。",
          effects: { age: 0, stats: { stress: 5, mental: -3, happiness: -2 } },
          addFlags: ["scam_anxiety_linger"],
          log: "恐惧会让你把世界读得太窄。"
        })
      ]
    }),
    event({
      id: "acc_exp_rare_lottery_once",
      stage: "misc",
      title: "稀有意外：一张彩票或小奖真的中了",
      text: "金额不大，却像生活在开玩笑——你笑出来，又有点不真实。",
      minAge: 18,
      maxAge: 75,
      weight: 1,
      repeatable: false,
      cooldownChoices: 30,
      tags: ["accident", "money"],
      conditions: condition({ notVisited: ["acc_exp_rare_lottery_once"] }),
      choices: [
        choice({
          text: "存起来当幸运基金。",
          effects: { age: 0, stats: { money: 15, happiness: 5 } },
          log: "你相信偶尔该允许奇迹发生。"
        })
      ]
    })
  ];

  window.LIFE_EXTRA_EVENTS = [
    ...(Array.isArray(window.LIFE_EXTRA_EVENTS) ? window.LIFE_EXTRA_EVENTS : []),
    ...ACCIDENT_POOL
  ];
})();

(function () {
  "use strict";

  /**
   * 高资源 / 特定家室 archetype 剧情池
   * - 硬门槛用 conditions.someFlags（需对应 archetype_* / 组合 flags）
   * - 软倾向用 familyStoryHookTags 与家庭背景的 storyHookTags 交集加权（engine）
   */
  const FAMILY_ARCHETYPE_EVENTS = [
    {
      id: "fa_second_gen_gift_economy",
      stage: "highschool",
      title: "恋爱里的礼物，第一次让你意识到“大方”也是压力",
      text: "同龄人还在纠结要不要送手工贺卡的时候，你已经听过家里随口提起“别小气、别让人看轻”。\n\n可当你真喜欢上一个人，你突然分不清：对方回应的是你的人，还是你随手就能掏出的那层体面。",
      minAge: 16,
      maxAge: 20,
      weight: 11,
      tags: ["family", "romance", "money"],
      familyStoryHookTags: ["gift_economy", "luxury_social"],
      conditions: { someFlags: ["archetype_second_gen"] },
      choices: [
        {
          text: "照家里的方式办：礼物要到位，场面要好看。",
          effects: { stats: { social: 3, stress: 3, money: -2, happiness: -1 } },
          addFlags: ["gift_performance_habit"],
          log: "你把“被爱”和“被看得起”悄悄绑在了一起，后来要花很久才拆。"
        },
        {
          text: "故意选朴素一点的东西，想试对方会不会同样靠近你。",
          effects: { stats: { mental: 2, stress: 2, social: -1 } },
          addFlags: ["authentic_intimacy_test"],
          log: "你第一次用减法去谈恋爱：少一点包装，多一点真心。"
        },
        {
          text: "干脆拖着不送，怕自己一出手就把关系变成不对等。",
          effects: { stats: { stress: 4, mental: -2, happiness: -2 } },
          addFlags: ["privilege_shame_hook"],
          log: "你害怕自己的背景把对方推远，也害怕自己的真心被当成施舍。"
        }
      ]
    },
    {
      id: "fa_second_gen_abroad_dinner",
      stage: "highschool",
      title: "留学不是梦想，是饭桌上的默认选项",
      text: "中介宣传册、雅思课表和“某某学长去了哪”被摊在餐桌中央。父母语气很平静，仿佛你早就该点头。\n\n你当然知道这是机会。你也知道，拒绝它需要付出的不只是勇气，还有一整套家庭叙事的改写。",
      minAge: 15,
      maxAge: 19,
      weight: 12,
      tags: ["family", "education"],
      familyStoryHookTags: ["study_abroad_easy", "heir_arranged_track"],
      conditions: { someFlags: ["archetype_second_gen"] },
      choices: [
        {
          text: "顺着默认路线走：把出国当成升级包。",
          effects: { stats: { intelligence: 3, discipline: 2, familySupport: 3, stress: 2 } },
          addFlags: ["study_abroad_family_bias"],
          log: "你把人生下一章提前签上了家庭熟悉的封面。"
        },
        {
          text: "争取gap或国内路线，用成绩与计划换取谈判空间。",
          effects: { stats: { discipline: 4, stress: 5, familySupport: -2, intelligence: 2 } },
          addFlags: ["path_negotiation_youth"],
          log: "你开始学用成年人的证据去换一点点属于自己的顺序。"
        },
        {
          text: "嘴上答应，心里盘算怎么拖到人走茶凉再改口。",
          effects: { stats: { mental: -3, stress: 4, happiness: -2 } },
          addFlags: ["silent_resistance_home"],
          log: "你用拖延保护自己，也把自己推进更长的内耗里。"
        }
      ]
    },
    {
      id: "fa_power_network_holiday",
      stage: "adolescence",
      title: "过年过节的走动，让你更早看懂“人情即资源”",
      text: "礼品袋、称呼、谁先坐、话说到哪一层该停——这些细节在大人眼里像礼仪，在你眼里像一张看不见的网。\n\n你并不总喜欢这种场合，却也很难否认：它确实会在某些时刻替你挡雨，或替你开门。",
      minAge: 12,
      maxAge: 16,
      weight: 10,
      tags: ["family", "social"],
      familyStoryHookTags: ["bureau_network", "etiquette_gate"],
      conditions: { someFlags: ["archetype_power_network"] },
      choices: [
        {
          text: "认真学：把场面练成肌肉记忆。",
          effects: { stats: { social: 4, discipline: 3, stress: 2, mental: -1 } },
          addFlags: ["public_image_home"],
          log: "你越来越像家里期待的那种“懂事孩子”，也越来越难随便任性。"
        },
        {
          text: "礼貌应付，但心里划清界线：我以后不要活成饭局。",
          effects: { stats: { mental: 2, stress: 3, social: 1 } },
          addFlags: ["anti_performance_identity"],
          log: "你把反感写得很轻，却把逃离写得很重。"
        },
        {
          text: "借机观察谁真能办事，谁只在吹牛。",
          effects: { stats: { intelligence: 3, social: 2, career: 1 } },
          addFlags: ["network_literacy_early"],
          log: "你很早就明白，关系不是温情故事，是结构与交换。"
        }
      ]
    },
    {
      id: "fa_power_stable_job_push",
      stage: "young_adult",
      title: "家里把“稳妥”说成爱你，把冒险说成不懂事",
      text: "你刚露出一点想试试更野的路，电话那头的语气就会沉下来。\n\n他们不是不爱你，他们只是太清楚一次失手在公众视野里会被怎样放大——而你，恰好被默认要替全家扛住那放大。",
      minAge: 22,
      maxAge: 32,
      weight: 11,
      tags: ["family", "career"],
      familyStoryHookTags: ["stable_career_push", "public_image_pressure"],
      conditions: { someFlags: ["archetype_power_network"] },
      choices: [
        {
          text: "接受安排：先稳下来，再谈以后。",
          effects: { stats: { career: 4, familySupport: 4, stress: 3, happiness: -2 } },
          addFlags: ["stable_path_pressure"],
          log: "你用“听话”换安全感，也把自己暂时押进一条看得见的轨道。"
        },
        {
          text: "硬顶：哪怕吵翻也要把边界说清楚。",
          effects: { stats: { familySupport: -5, stress: 6, mental: 2, career: 1 } },
          addFlags: ["family_boundary_clash"],
          log: "你终于把成年人的“不”说出口，代价是家里冷了几度。"
        },
        {
          text: "表面顺从，暗地攒资本，准备有一天用结果换话语权。",
          effects: { stats: { discipline: 4, stress: 4, career: 2 } },
          addFlags: ["strategic_compliance"],
          log: "你把反抗推迟，却没有把它取消。"
        }
      ]
    },
    {
      id: "fa_enterprise_succession_whisper",
      stage: "college",
      title: "“以后回来帮忙”这句话，像温柔的绳子",
      text: "父母谈订单、谈人、谈回款时越来越顺口把你算进去。你知道那是信任，也听出那是期待。\n\n你开始算：如果拒绝，会不会像背叛；如果答应，会不会从此没有自己的名字。",
      minAge: 18,
      maxAge: 26,
      weight: 12,
      tags: ["family", "career"],
      familyStoryHookTags: ["succession_whisper", "family_business_friction"],
      conditions: { someFlags: ["archetype_family_enterprise"] },
      choices: [
        {
          text: "把接班当成责任接下来，先把本事学硬。",
          effects: { stats: { career: 5, discipline: 3, familySupport: 4, stress: 4 } },
          addFlags: ["succession_acceptance"],
          log: "你把自己写进家族叙事的主线，也接受了它对你的收编。"
        },
        {
          text: "坚持先做自己的事，用合同与分红把边界谈清楚。",
          effects: { stats: { career: 3, familySupport: -3, stress: 5, intelligence: 2 } },
          addFlags: ["succession_negotiation"],
          log: "你第一次在“家人”和“合伙人”之间找第三条路。"
        },
        {
          text: "逃避话题：用忙碌把绳子松一松。",
          effects: { stats: { stress: 5, mental: -3, happiness: -2 } },
          addFlags: ["succession_avoidance"],
          log: "拖延没有让期待消失，只是让它在暗处长出刺。"
        }
      ]
    },
    {
      id: "fa_enterprise_money_morals",
      stage: "young_adult",
      title: "恋爱里第一次谈钱，你们吵的不是数字，是出身",
      text: "对方一句“你怎么这么会算账”，你听出了嫌弃；你一句“这不是算计，是习惯”，对方听出了冷漠。\n\n家族生意家长大的你，很早就把风险写进感情；可感情要的不是风险表，它要的是被优先。",
      minAge: 21,
      maxAge: 30,
      weight: 10,
      tags: ["family", "romance"],
      familyStoryHookTags: ["money_first_lessons"],
      conditions: { someFlags: ["archetype_family_enterprise", "archetype_merchant_volatile"] },
      choices: [
        {
          text: "把账讲清楚，也努力把温柔留在账之外。",
          effects: { stats: { social: 2, mental: 2, stress: 2 } },
          addFlags: ["money_talk_maturity"],
          log: "你学着既不当冤大头，也不当冷血鬼。"
        },
        {
          text: "为关系让渡：宁可吃亏也想证明你不是功利。",
          effects: { stats: { happiness: 2, money: -3, stress: 3 } },
          addFlags: ["love_over_leverage"],
          log: "你用退让买亲密，心里却埋下委屈的种子。"
        },
        {
          text: "退后一步：你意识到价值观差太远的感情很难靠忍。",
          effects: { stats: { mental: 1, stress: 2, happiness: -2 } },
          addFlags: ["value_split_romance"],
          log: "你第一次承认，有些喜欢输在起跑的文化代码上。"
        }
      ]
    },
    {
      id: "fa_intellectual_dinner_debate",
      stage: "adolescence",
      title: "饭桌像答辩现场：你要会做题，也要会“像他们一样思考”",
      text: "话题从新闻滑到论文，再滑到“你将来要成为哪种人”。你被鼓励质疑，却也被提醒：质疑要有水平，不能像情绪化的小孩。\n\n你越来越会赢辩论，却越来越不确定自己到底累了什么。",
      minAge: 13,
      maxAge: 17,
      weight: 11,
      tags: ["family", "school"],
      familyStoryHookTags: ["elite_academic_circle", "comparison_parents_peer"],
      conditions: { someFlags: ["archetype_intellectual_elite"] },
      choices: [
        {
          text: "把自己练成他们的骄傲：赢到底。",
          effects: { stats: { intelligence: 4, discipline: 3, stress: 5, mental: -3 } },
          addFlags: ["elite_performance_child"],
          log: "你把优秀练成生存策略，也把脆弱练成违禁品。"
        },
        {
          text: "故意暴露一点不会：试探他们能不能接住不优秀的你。",
          effects: { stats: { familySupport: -2, mental: 2, stress: 4 } },
          addFlags: ["vulnerability_test_home"],
          log: "你用一点失败当探针，测的是爱还是评价。"
        },
        {
          text: "把锋芒收起来，只在卷面上赢。",
          effects: { stats: { intelligence: 3, happiness: -2, stress: 3 } },
          addFlags: ["split_self_academic"],
          log: "你学会在台面与台面下各活一半。"
        }
      ]
    },
    {
      id: "fa_intellectual_partner_gate",
      stage: "young_adult",
      title: "带恋人回家前，你先听见心里的打分表",
      text: "不是父母已经开口，而是你太早继承了那套“配不配”的语言。学历、谈吐、家庭、前途——它们像幽灵一样坐在约会旁边。\n\n你讨厌自己这样，却又害怕不带脑子去爱的人会把自己拖进真正的麻烦。",
      minAge: 23,
      maxAge: 34,
      weight: 10,
      tags: ["family", "romance"],
      familyStoryHookTags: ["knowledge_social", "self_worth_performance"],
      conditions: { someFlags: ["archetype_intellectual_elite"] },
      choices: [
        {
          text: "把标准摊开谈：你要的是同行者，不是崇拜者。",
          effects: { stats: { social: 2, stress: 2, mental: 1 } },
          addFlags: ["intellectual_couple_contract"],
          log: "你试着把精英的冷变成关系的清。"
        },
        {
          text: "压下打分冲动，允许自己谈一场“不体面”的喜欢。",
          effects: { stats: { happiness: 3, stress: 4, familySupport: -2 } },
          addFlags: ["anti_merit_romance"],
          log: "你用叛逆换了一点人味，也准备好承担家里的皱眉。"
        },
        {
          text: "提前分手：你怕自己最终会伤害那个“不够格”的人。",
          effects: { stats: { mental: -4, stress: 3, happiness: -4 } },
          addFlags: ["preemptive_gatekeeping_guilt"],
          log: "你把保护当成离开，却把离开当成爱。"
        }
      ]
    },
    {
      id: "fa_overseas_summer_abroad",
      stage: "school",
      title: "暑假不是休息，是一次被安排好的“见世面”",
      text: "签证、机票、寄宿家庭或亲戚家沙发——这些对你像换季一样平常。可你也发现，自己讲两种语言时，两种自我也对不上号。\n\n你开始怀疑：到底是世界变大了，还是你被要求同时变小去适配它。",
      minAge: 9,
      maxAge: 13,
      weight: 9,
      tags: ["family", "childhood"],
      familyStoryHookTags: ["cross_border_holiday", "intl_school_track"],
      conditions: { someFlags: ["archetype_overseas_resource"] },
      choices: [
        {
          text: "把每次出行都当成课程：学得快，也忘得慢。",
          effects: { stats: { intelligence: 3, social: 2, stress: 2 } },
          addFlags: ["global_mobility_child"],
          log: "你很小就学会在陌生里保持礼貌，这是礼物，也是壳。"
        },
        {
          text: "越来越想待在一个不用翻译自己的地方。",
          effects: { stats: { mental: 2, happiness: -1, stress: 2 } },
          addFlags: ["belonging_search_seed"],
          log: "你开始渴望一种不需要切换的亲密。"
        },
        {
          text: "用礼物与照片满足父母期待，把真实疲惫藏起来。",
          effects: { stats: { familySupport: 2, mental: -3, stress: 3 } },
          addFlags: ["cross_border_performance"],
          log: "你把“玩得开心”演成任务，也把累藏进行李箱。"
        }
      ]
    },
    {
      id: "fa_overseas_identity_partner",
      stage: "college",
      title: "恋人问你“你以后到底住哪”，你答不出来",
      text: "这不是异地恋的情话，是身份题。你知道家里默认你有更宽的地图，可你也知道，地图越宽，锚点越少。\n\n对方的恐惧很具体：怕被你留在原地，也怕被你带去一个他们够不着的世界。",
      minAge: 18,
      maxAge: 28,
      weight: 11,
      tags: ["family", "romance"],
      familyStoryHookTags: ["identity_split", "long_distance_family"],
      conditions: { someFlags: ["archetype_overseas_resource"] },
      choices: [
        {
          text: "承诺一起找第三城：不让任何一方单方面牺牲。",
          effects: { stats: { social: 2, stress: 4, happiness: 1 } },
          addFlags: ["third_city_love_plan"],
          log: "你把最难的题提前摊开，赌的是两个人愿不愿意一起解。"
        },
        {
          text: "顺着家庭默认走：先把前途钉住，再谈感情能不能跟上。",
          effects: { stats: { career: 3, familySupport: 3, happiness: -3, stress: 4 } },
          addFlags: ["career_first_attachment"],
          log: "你选择了更“正确”的顺序，也接受了它可能拆散谁。"
        },
        {
          text: "承认你不知道：请求慢一点，别逼你现在选边。",
          effects: { stats: { mental: 2, stress: 3 } },
          addFlags: ["identity_honesty_pause"],
          log: "你第一次允许自己在关系里不完美、不确定、不强大。"
        }
      ]
    },
    {
      id: "fa_nouveau_status_party",
      stage: "adolescence",
      title: "新家的暖房派对，让你同时感到阔与被观看",
      text: "大电视、进口水果、被反复提起的“以前哪敢想”。大人笑得很响，你笑得很努力。\n\n你突然明白：炫耀不只是虚荣，有时是全家刚从紧缩里逃出来后的喘息——只是这喘息，常常要你用表情陪着演。",
      minAge: 12,
      maxAge: 17,
      weight: 10,
      tags: ["family", "social"],
      familyStoryHookTags: ["conspicuous_spending", "status_anxiety"],
      conditions: { someFlags: ["archetype_nouveau_riche"] },
      choices: [
        {
          text: "加入表演：把面子当成家庭项目一起做。",
          effects: { stats: { social: 3, happiness: -2, stress: 3 } },
          addFlags: ["status_co_performance"],
          log: "你学会了用笑容维护家里的新身份，也学会了把真实往里缩。"
        },
        {
          text: "躲进房间：用沉默抗议这场把你当展品的聚会。",
          effects: { stats: { mental: 1, familySupport: -2, stress: 2 } },
          addFlags: ["status_rebellion_quiet"],
          log: "你没有掀桌，但你拒绝成为那盏最亮的灯。"
        },
        {
          text: "把观察写进心里：记下钱怎样改变说话的方式。",
          effects: { stats: { intelligence: 3, social: 1 } },
          addFlags: ["class_mobility_observer"],
          log: "你很早就把阶层当成可研究的对象，而不只是背景。"
        }
      ]
    },
    {
      id: "fa_nouveau_parents_flip",
      stage: "young_adult",
      title: "昨天还说你随便花，今天就说你别败家",
      text: "家里的价值观还在震荡期。风口、投资、亲戚借钱、面子消费——任何一阵风都能让规则改口。\n\n你站在中间，既享受阔，也害怕某天醒来一切回到旧日。恋爱里你更大方，也更敏感对方是不是在图你的新位置。",
      minAge: 20,
      maxAge: 30,
      weight: 10,
      tags: ["family", "money"],
      familyStoryHookTags: ["value_instability", "status_anxiety"],
      conditions: { someFlags: ["archetype_nouveau_riche"] },
      choices: [
        {
          text: "自己存钱设防火墙：不把安全感押在父母的情绪上。",
          effects: { stats: { discipline: 4, money: 2, stress: 2 } },
          addFlags: ["personal_financial_firewall"],
          log: "你开始把自己从家庭的震荡里拆出一块独立账户。"
        },
        {
          text: "用钱买关系稳定：请客、送礼、制造“我们很好”的证据。",
          effects: { stats: { social: 2, money: -4, stress: 4 } },
          addFlags: ["money_as_relationship_proof"],
          log: "你害怕失去，于是先用挥霍证明拥有。"
        },
        {
          text: "跟家里开一次硬谈：要规则，不要翻云覆雨。",
          effects: { stats: { familySupport: 2, stress: 5, mental: 2 } },
          addFlags: ["family_value_contract_talk"],
          log: "你把不稳定摊上桌，才可能谈出真正的底线。"
        }
      ]
    },
    {
      id: "fa_old_money_etiquette",
      stage: "school",
      title: "礼仪课不在培训班，在每一次被纠正的细节里",
      text: "餐具、坐姿、称呼、笑不露齿——错误会被轻声指出，像帮你整理领带一样自然。\n\n你学会体面，也学会把不舒服藏进体面里：因为失态的代价，从来不是当下那一秒。",
      minAge: 8,
      maxAge: 12,
      weight: 9,
      tags: ["family", "childhood"],
      familyStoryHookTags: ["etiquette_gate", "legacy_shell"],
      conditions: { someFlags: ["archetype_old_money"] },
      choices: [
        {
          text: "把规矩内化成自尊：做得漂亮也是你的骄傲。",
          effects: { stats: { discipline: 4, social: 2, stress: 2 } },
          addFlags: ["etiquette_cast_home"],
          log: "你用优雅换位置，也换到一层自我要求。"
        },
        {
          text: "心里逆反：越被纠正越想弄脏那条规矩。",
          effects: { stats: { happiness: -2, stress: 3, mental: 1 } },
          addFlags: ["etiquette_rebellion_seed"],
          log: "你把反抗藏得很小，却藏得很久。"
        },
        {
          text: "观察谁靠规矩上位，谁只靠规矩吓人。",
          effects: { stats: { intelligence: 2, social: 2 } },
          addFlags: ["class_rule_literacy"],
          log: "你很早就分清：体面可以是教养，也可以是武器。"
        }
      ]
    },
    {
      id: "fa_old_money_marriage_gate",
      stage: "family",
      title: "婚恋门槛被说得很轻，却重得像门闩",
      text: "没有人直接说“门不当户不对”，他们只说“合适”“稳妥”“别让自己难做”。\n\n你听得懂翻译：爱情可以开始，但婚姻是一场家族项目。你要么带人跨栏，要么把自己跨碎。",
      minAge: 26,
      maxAge: 42,
      weight: 12,
      tags: ["family", "romance"],
      familyStoryHookTags: ["marriage_class_bar", "family_gatekeeping"],
      conditions: { someFlags: ["archetype_old_money", "archetype_power_network"] },
      choices: [
        {
          text: "硬扛：把恋人带进规则里谈判。",
          effects: { stats: { stress: 6, familySupport: -4, happiness: 1 } },
          addFlags: ["marriage_gate_confrontation"],
          log: "你把感情从私密拉到台面，也把自己推到真正的成人战场。"
        },
        {
          text: "妥协分手：你不想让TA替你承受你家的重量。",
          effects: { stats: { mental: -5, happiness: -6, stress: 4 } },
          addFlags: ["sacrificial_break_for_class"],
          log: "你用离开完成一种扭曲的保护，也把遗憾写成长线。"
        },
        {
          text: "拖延：既不承诺对抗，也不承诺投降。",
          effects: { stats: { stress: 5, mental: -2 } },
          addFlags: ["marriage_gate_ambivalence"],
          log: "悬而未决最省力，也最耗人。"
        }
      ]
    },
    {
      id: "fa_luxury_peer_weekend",
      stage: "young_adult",
      title: "周末消费层级不同，友情也会悄悄分层",
      text: "同样的城市，有人把几千块当零花，有人把几百块当月命。你夹在中间：既不想炫耀，也不想被可怜。\n\n你开始明白，圈层不只决定你买什么，还决定你敢把脆弱说给谁听。",
      minAge: 20,
      maxAge: 35,
      weight: 9,
      tags: ["social", "money"],
      familyStoryHookTags: ["luxury_social", "conspicuous_spending"],
      conditions: { someFlags: ["archetype_second_gen", "archetype_nouveau_riche", "archetype_old_money"] },
      choices: [
        {
          text: "主动降级消费，努力让聚会留在同一平面。",
          effects: { stats: { social: 2, stress: 3, happiness: 1 } },
          addFlags: ["consumption_downshift_social"],
          log: "你用体贴掩盖差距，也把自己练得更会读空气。"
        },
        {
          text: "坦白差距：把钱说出来，把尴尬也说出来。",
          effects: { stats: { mental: 2, stress: 2 } },
          addFlags: ["money_honesty_friendship"],
          log: "你发现真正的朋友不怕听实话，怕的是你一直演。"
        },
        {
          text: "慢慢疏远：不是谁坏，只是节奏合不上。",
          effects: { stats: { social: -2, mental: -1, happiness: -2 } },
          addFlags: ["peer_drift_class"],
          log: "你经历了一种安静的告别：没有吵架，只有再也约不齐。"
        }
      ]
    },
    {
      id: "fa_resource_intro_matchmaking",
      stage: "young_adult",
      title: "家里介绍的相亲对象，简历漂亮得像合作方案",
      text: "这不是八卦，是资源配置：城市、行业、父母单位、房产与户口都被轻轻掂过。\n\n你反感被物化，却也清楚这套语言在你家意味着“负责”。你要么翻译它，要么撕碎它。",
      minAge: 24,
      maxAge: 36,
      weight: 10,
      tags: ["family", "romance"],
      conditions: { someFlags: ["archetype_power_network", "archetype_old_money", "archetype_family_enterprise"] },
      choices: [
        {
          text: "去见一面：把相亲当信息收集，不当判决。",
          effects: { stats: { social: 2, stress: 2 } },
          addFlags: ["matchmaking_pragmatic_trial"],
          log: "你用冷静换主动权，也保留说不的权利。"
        },
        {
          text: "拒绝模板：用激烈方式宣告你要自己选。",
          effects: { stats: { familySupport: -5, stress: 5, happiness: 1 } },
          addFlags: ["matchmaking_rejection_riot"],
          log: "你用冲突买自由，也买下后续漫长的修复成本。"
        },
        {
          text: "谈条件：可以见，但底线写清楚。",
          effects: { stats: { discipline: 2, familySupport: 1, stress: 3 } },
          addFlags: ["matchmaking_contract"],
          log: "你把亲密关系从浪漫拉回谈判桌，冷，但清楚。"
        }
      ]
    }
  ];

  window.LIFE_EXTRA_EVENTS = (Array.isArray(window.LIFE_EXTRA_EVENTS) ? window.LIFE_EXTRA_EVENTS : []).concat(
    FAMILY_ARCHETYPE_EVENTS
  );
})();

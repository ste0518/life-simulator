(function () {
  "use strict";

  /*
    家庭背景手动编辑说明
    --------------------
    每个 background({ ... }) 是一条可随机抽取的开局模板。

    统一维度（dimensions）：家庭财富 / 父母关系 / 家庭教育方式 / 家庭支持度 / 教育资源 / 情绪氛围

    apply：仍复用事件 mutation 结构（stats 为在默认开局上的增量、flags / tags / romanceFlags）。

    meta（可选，便于后续手改与 UI 展示）：
      tier          — 分层：high_resource | mid | strained | volatile 等（仅作分类，引擎可不读）
      advantages    — 优势条目（字符串数组）
      costs         — 代价条目（字符串数组）
      longTermBias  — 对恋爱 / 升学 / 工作 / 结局的叙事倾向说明（键值对象，可随意增删键）

    storyHookTags（可选）：
      — 与事件的 familyStoryHookTags 求交后提高抽中权重（见 js/engine.js），用于“同池里更常碰到某类剧情”，
        不替代 conditions.someFlags 的硬门槛事件。

    weight：随机权重。高资源模板默认略低于 1，避免人人富二代；困难/温暖略高，保证可玩性与多样性。
  */

  function toList(value) {
    return Array.isArray(value) ? value.slice() : [];
  }

  function toStats(value) {
    return value && typeof value === "object" ? { ...value } : {};
  }

  function normalizeMeta(source) {
    const m = source && typeof source === "object" ? source : {};
    const bias = m.longTermBias && typeof m.longTermBias === "object" ? m.longTermBias : {};
    return {
      tier: typeof m.tier === "string" ? m.tier : "",
      advantages: toList(m.advantages),
      costs: toList(m.costs),
      longTermBias: { ...bias }
    };
  }

  function normalizeStringArray(value) {
    return toList(value)
      .map((item) => String(item || "").trim())
      .filter(Boolean);
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
      storyHookTags: normalizeStringArray(source.storyHookTags),
      meta: normalizeMeta(source.meta),
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
      id: "second_gen_wealth_home",
      name: "富二代家庭",
      summary: "物质与圈层从不缺席，你的人生很早就被放进一条“该优秀、该体面、该听话”的轨道里。",
      description:
        "零花钱、礼物、旅行和留学信息对你并不陌生；与此同时，比较、安排、继承期待与“别给家里丢脸”也从不缺席。你熟悉高消费社交的语言，也熟悉被看见与被评价的压力。",
      details: [
        "家里习惯用资源解决问题：补习、兴趣班、择校、夏令营和人情饭局都很平常。",
        "父母的关心常常裹着规划：读哪条路、和谁来往、什么时候该“收心”。",
        "你很容易走出阔绰的一步，也很难分清哪些欲望属于自己，哪些属于被期待的模板。"
      ],
      dimensions: {
        家庭财富: "高",
        父母关系: "对外体面、对内控制感强",
        家庭教育方式: "资源拉满 + 路径安排",
        家庭支持度: "阔绰但带条件",
        教育资源: "顶尖一档",
        情绪氛围: "热闹下的紧绷"
      },
      weight: 0.62,
      storyHookTags: [
        "luxury_social",
        "heir_arranged_track",
        "study_abroad_easy",
        "gift_economy",
        "family_comparison"
      ],
      meta: {
        tier: "high_resource",
        advantages: [
          "起步现金与家庭支持明显更高，礼物、社交消费、兴趣班与见世面更容易被买单。",
          "更早接触圈层、留学与名校信息，默认路径里“出国/进好学校”更顺滑。",
          "社交场合里更不容易因寒酸露怯（也容易把大方当成习惯）。"
        ],
        costs: [
          "被比较、被安排、被继承期待：个人选择空间常被“家里已经铺好”挤压。",
          "控制与服从的隐形契约：不听话时，资源可能瞬间变成惩罚或冷处理。",
          "感情与消费观易带上表演性：既渴望真实亲密，又习惯用物质衡量诚意。"
        ],
        longTermBias: {
          romance: "更常碰到圈层恋爱、资源型暧昧与家长对家境的打量；带人回家往往等于进入评审。",
          education: "名校/国际路线/留学默认更靠前；拒绝安排需要额外勇气与代价叙事。",
          career: "家里既有助推也可能指定行业；自我证明常与“别浪费起点”绑定。",
          endings: "更容易走向阶层固化或反叛出走两类张力结局，而非平淡中庸。"
        }
      },
      apply: {
        effects: {
          stats: {
            money: 28,
            intelligence: 8,
            discipline: 8,
            familySupport: 14,
            social: 6,
            stress: 14,
            mental: -6,
            happiness: -4
          }
        },
        addFlags: [
          "privileged_home_finance",
          "resource_rich_home",
          "family_wealth_high",
          "archetype_second_gen",
          "control_family",
          "comparison_ready_home",
          "heir_arrangement_pressure",
          "study_abroad_family_bias"
        ],
        addTags: ["ambition", "pressure", "privilege"],
        log: "你从小就知道，卡与额度常常只是家庭话语权的另一种形状：能花，也意味着要听话、要争光、要比赢。"
      }
    }),
    background({
      id: "power_resource_home",
      name: "官二代 / 权力资源型家庭",
      summary: "人情、规矩与场面话从小就是必修课；你能借到力，也很难借到完全的自由。",
      description:
        "家里说话常留三分，办事讲流程、讲稳妥、讲影响。你更早看见资源如何流动，也更早学会把表情和选择都放到台面下衡量。公众形象、关系网与“别惹事”比个人情绪更常被强调。",
      details: [
        "节日走动、饭局座次、谁该叫叔叔，这些细节从小就被纠正。",
        "家里更在意你是否“稳”、是否“懂事”，而不是你是否痛快。",
        "你更容易拿到信息与机会，也更容易在关键路口被提醒：别选太跳的路。"
      ],
      dimensions: {
        家庭财富: "中上到高（含隐性资源）",
        父母关系: "克制、分工明确",
        家庭教育方式: "规训 + 场面训练",
        家庭支持度: "强但高度政治化",
        教育资源: "优质且偏体制内路径",
        情绪氛围: "谨慎、压抑的胜利感"
      },
      weight: 0.58,
      storyHookTags: ["bureau_network", "public_image_pressure", "stable_career_push", "etiquette_gate", "family_gatekeeping"],
      meta: {
        tier: "high_resource",
        advantages: [
          "人脉与信息优势：学校、工作与关键节点的“提醒”和托举更常见。",
          "家庭支持在现金与面子上都更硬，社交礼仪与场面适应起步更早。",
          "走稳妥路线时，阻力往往更小；体制相关叙事更容易被默认。"
        ],
        costs: [
          "规训重：言行边界、恋爱对象、职业选择都可能被上升为家庭形象问题。",
          "自由折价：越被保护，越被要求别冒险、别出格、别让人说闲话。",
          "亲密关系里更难彻底放松：你会下意识评估风险，也会害怕拖累家里。"
        ],
        longTermBias: {
          romance: "门户与背景审查更严；带人见家长像走流程也像走钢丝。",
          education: "更鼓励稳妥名校与主流路径；太张扬的出国或艺术路线易被否决。",
          career: "体制内/关联行业隐形加成；反叛型创业或曝光型职业更易引发冲突。",
          endings: "体面与真实的撕扯、牺牲个人换家族叙事，都是高频母题。"
        }
      },
      apply: {
        effects: {
          stats: {
            money: 24,
            intelligence: 6,
            discipline: 8,
            social: 8,
            familySupport: 12,
            career: 3,
            stress: 16,
            mental: -6,
            happiness: -5
          }
        },
        addFlags: [
          "privileged_home_finance",
          "family_wealth_high",
          "archetype_power_network",
          "public_image_home",
          "family_expectation_high",
          "stable_path_pressure",
          "gatekeeping_family_narrative"
        ],
        addTags: ["ambition", "pressure", "privilege"],
        log: "你很早就学会：有些话在家里不能说透，有些事在外面更不能说透。"
      }
    }),
    background({
      id: "family_enterprise_home",
      name: "家族生意 / 经商核心家庭",
      summary: "餐桌即会议室，现金流比情绪更常被讨论；你更早懂钱，也更早懂关系里的算计。",
      description:
        "父母的时间表常被订单、回款与人情切碎。你看见过宽裕，也看见过周转吃紧时的沉默。支持常常很实在，却也可能带着“以后谁来接”的期待与功利性的评价标准。",
      details: [
        "从小旁听电话里的讨价还价、酒桌上的客气与试探。",
        "家里更信结果：赚没赚到、稳不稳，往往比“你开不开心”更先被看见。",
        "你容易长出商业嗅觉与社交胆量，也容易把感情与利益缠在一起想。"
      ],
      dimensions: {
        家庭财富: "中高（与经营周期绑定）",
        父母关系: "共担风险型",
        家庭教育方式: "实战主义",
        家庭支持度: "肯投钱、也肯施压",
        教育资源: "舍得投入但不稳定",
        情绪氛围: "忙碌、结果导向"
      },
      weight: 0.62,
      storyHookTags: ["business_dinner", "succession_whisper", "money_first_lessons", "investment_story", "family_business_friction"],
      meta: {
        tier: "high_resource",
        advantages: [
          "现金与家庭支持在上升期更慷慨：补课、兴趣、旅行与创业试水更容易拿到预算。",
          "更早接触生意、投资与人情往来，职业起点的“社会课”超前。",
          "社交场合里更敢谈钱、谈交换，也更容易进入资源型圈子。"
        ],
        costs: [
          "家庭关系可能更功利：爱与付出常被换算成投入产出。",
          "财富与情绪同学波动：景气时阔，逆风时全家紧绷。",
          "接班/分家/股权叙事容易压进婚恋与人生选择。"
        ],
        longTermBias: {
          romance: "更常出现“对你这个人还是对你家底”的怀疑与试探；家长也更会评估对方家庭。",
          education: "实用主义强：商科、管理、海外文凭常被视为资产；纯理想路线易被嫌弃。",
          career: "创业、接班、家族资源牵引更强；打工叙事除非能证明“镀金”。",
          endings: "暴富与返贫、亲情与股权、成功与孤独的反差更容易被写成主线。"
        }
      },
      apply: {
        effects: {
          stats: {
            money: 26,
            familySupport: 14,
            career: 5,
            social: 6,
            discipline: 5,
            intelligence: 4,
            stress: 10,
            mental: -3,
            happiness: -2
          }
        },
        addFlags: [
          "privileged_home_finance",
          "family_wealth_high",
          "archetype_family_enterprise",
          "family_business_core",
          "succession_whisper_home",
          "money_socialization_early",
          "speculative_route"
        ],
        addTags: ["risk", "ambition", "privilege"],
        log: "你第一次听懂“周转”这个词，可能比第一次听懂“我爱你”还要早。"
      }
    }),
    background({
      id: "intellectual_elite_home",
      name: "高知高收入家庭",
      summary: "书架、讲座与论文式对话堆出视野，也堆出“你不能只是普通”的默认。",
      description:
        "父母用证据与逻辑说话，也用排名与校友网络衡量世界。你更容易被带去博物馆、科学营与海外夏校，也更容易在饭桌上被轻轻问一句：你将来想做什么级别的贡献？",
      details: [
        "家里更信知识与长期主义，情绪却常被当作需要自我管理的变量。",
        "成绩与能力被看得极重，脆弱与迷茫不一定有位置。",
        "你容易长成高功能的人，也容易把自我价值绑在表现上。"
      ],
      dimensions: {
        家庭财富: "高（脑力变现稳定）",
        父母关系: "理性合作型",
        家庭教育方式: "精英教育与辩论式沟通",
        家庭支持度: "强但苛刻",
        教育资源: "顶级",
        情绪氛围: "高压的清醒"
      },
      weight: 0.6,
      storyHookTags: ["elite_academic_circle", "comparison_parents_peer", "knowledge_social", "ivy_track_pressure", "self_worth_performance"],
      meta: {
        tier: "high_resource",
        advantages: [
          "教育资源拉满：名师、书单、科研与竞赛通道更触手可及。",
          "视野与表达训练强，社交里更吃得开知识型话题。",
          "家庭支持在升学与深造上更愿意长期押注。"
        ],
        costs: [
          "成绩与自我要求双高：休息、失败与平庸感都更刺。",
          "情感表达常被降级为“不成熟”：你会擅长讲道理，却不一定擅长要抱抱。",
          "亲密关系里容易过度分析或过度比较，难以容忍“配不上”的焦虑。"
        ],
        longTermBias: {
          romance: "更在意智识匹配与履历；也容易把恋人放进“是否够优秀”的隐性打分里。",
          education: "名校与研究生路径权重极高；gap 与试错空间更小。",
          career: "科研、专业精英、国际化岗位更顺；体力型或野路子更易被家庭看低。",
          endings: "高光职业与空心感、逃离精英模板，是常见对照组。"
        }
      },
      apply: {
        effects: {
          stats: {
            money: 26,
            intelligence: 12,
            discipline: 9,
            familySupport: 13,
            social: 4,
            stress: 16,
            mental: -7,
            happiness: -6
          }
        },
        addFlags: [
          "privileged_home_finance",
          "family_wealth_high",
          "archetype_intellectual_elite",
          "elite_education_expectation",
          "comparison_ready_home",
          "emotion_suppressed_home",
          "family_expectation_high"
        ],
        addTags: ["ambition", "pressure", "privilege"],
        log: "你家的爱常常穿着论文的语气：要有数据、要有规划、要有能写进履历的结果。"
      }
    }),
    background({
      id: "overseas_resource_home",
      name: "海外资源丰富家庭",
      summary: "护照、时差与跨国电话构成日常背景；你比同龄人更早会说“那边”，也更难说清自己属于哪边。",
      description:
        "亲戚、账户、学校与假期目的地常常在国外。留学不是梦想而是默认选项之一。与此同时，归属感、家庭距离与文化夹缝里的孤独，也会更早找上你。",
      details: [
        "你可能读过国际学校或双语路线，习惯在两种规则之间切换。",
        "家里讨论未来时，地图默认被摊开：国家、城市、身份与签证。",
        "你更容易走出国路线，也更容易在亲密关系里遇到跨阶层与跨文化的摩擦。"
      ],
      dimensions: {
        家庭财富: "高（含跨境资产与关系）",
        父母关系: "常分居或跨国协作",
        家庭教育方式: "国际化规划",
        家庭支持度: "远程但肯投入",
        教育资源: "国际导向极强",
        情绪氛围: "疏离与开阔并存"
      },
      weight: 0.55,
      storyHookTags: ["cross_border_holiday", "identity_split", "intl_school_track", "study_abroad_easy", "long_distance_family"],
      meta: {
        tier: "high_resource",
        advantages: [
          "留学、交换与旅行门槛显著更低；语言与跨文化适应起步更早。",
          "家庭在首期开销与海外生活上更愿意托底（仍可能附带控制条款）。",
          "恋爱池与社交圈更国际化，资源与信息量更大。"
        ],
        costs: [
          "归属感撕裂：你常被问“你到底是哪边人”，自己也不一定答得出来。",
          "物理距离让亲情更像项目：见面珍贵，也更容易停在表层。",
          "国内人情规则与国外个人主义冲突时，你会被两边一起误会。"
        ],
        longTermBias: {
          romance: "跨国/跨文化恋情概率更高；家长对身份与定居的干预更复杂。",
          education: "国际课程与出国强相关；高考叙事可能显得“陌生”。",
          career: "外派、海归、跨境业务更顺；纯本地草根路线反而别扭。",
          endings: "回流与留下、身份选择与家庭再连接，是长期主线。"
        }
      },
      apply: {
        effects: {
          stats: {
            money: 27,
            intelligence: 7,
            social: 7,
            familySupport: 11,
            mental: -5,
            stress: 9,
            happiness: -3,
            discipline: 4
          }
        },
        addFlags: [
          "privileged_home_finance",
          "family_wealth_high",
          "archetype_overseas_resource",
          "cross_border_family_ties",
          "study_abroad_family_bias",
          "identity_straddle_home"
        ],
        addTags: ["privilege", "distance", "selfhood"],
        log: "你很早就习惯在海关与安检之间切换身份：哪一个才是家，有时取决于当下哪一边更省事。"
      }
    }),
    background({
      id: "nouveau_riche_home",
      name: "新贵 / 暴富型家庭",
      summary: "生活水平一夜换档，规则与价值观却还在跌跌撞撞地重写；阔气很真，不安也很真。",
      description:
        "拆迁、风口、红利或一次赌对的生意，让家里突然阔起来。消费变大方了，但面子、炫耀与对“掉下去”的恐惧也一起进场。你更容易被带进高消费场景，也更容易在钱与尊严之间晕头转向。",
      details: [
        "家里爱谈房子、车子、牌子与“别让人看不起”。",
        "支持常常很豪爽，却不一定稳定：价值观可能在几年里剧烈摇摆。",
        "你既享受被托举，也害怕被说“暴发户”，更害怕回到从前。"
      ],
      dimensions: {
        家庭财富: "高但根基新",
        父母关系: "兴奋与焦虑并存",
        家庭教育方式: "补偿式投入",
        家庭支持度: "阔绰、偶发失控",
        教育资源: "靠砸钱追赶",
        情绪氛围: "浮夸与紧绷交替"
      },
      weight: 0.58,
      storyHookTags: ["conspicuous_spending", "status_anxiety", "value_instability", "luxury_social", "gift_economy"],
      meta: {
        tier: "high_resource",
        advantages: [
          "现金与短期支持强：礼物、消费、补课与见世面非常舍得。",
          "社交上更敢花钱换场面，恋爱里更容易制造“被重视”的仪式感。",
          "抓住机会窗口时，家庭愿赌一把支持你转型或出国。"
        ],
        costs: [
          "价值观震荡：父母可能今天宠你，明天用愧疚与面子绑架你。",
          "炫耀压力：你被期待“配得上新阶层”，也容易在攀比里迷失。",
          "风险意识薄弱时，家庭资产波动会直接砸在你的生活上。"
        ],
        longTermBias: {
          romance: "更容易出现资源型吸引与“是否图钱”的互不信任；家长也可能突然反对“门不当户不对”。",
          education: "砸钱路线明显；真正长期的学习习惯未必同步建立。",
          career: "投机、风口、家族生意扩张更常见；稳健型反而觉得无聊或被嘲笑。",
          endings: "返贫恐惧、身份焦虑与亲情撕裂的戏剧性更强。"
        }
      },
      apply: {
        effects: {
          stats: {
            money: 30,
            familySupport: 10,
            social: 7,
            happiness: 3,
            discipline: -3,
            stress: 12,
            mental: -5
          }
        },
        addFlags: [
          "privileged_home_finance",
          "family_wealth_high",
          "archetype_nouveau_riche",
          "status_display_pressure",
          "value_instability_home",
          "comparison_ready_home"
        ],
        addTags: ["pressure", "risk", "privilege"],
        log: "家里突然阔了以后，爱你的人和压你的人，有时会用同一叠钞票说话。"
      }
    }),
    background({
      id: "old_money_home",
      name: "老钱 / 传统体面家庭",
      summary: "礼仪、圈层与婚嫁门槛像空气一样自然；你生来就在一张看不见的座次表里。",
      description:
        "家里更信传承、体面与“像什么样子”。消费克制却贵，关系讲究互惠与名分。你拥有稳定平台与审美训练，也背负门当户对、家族脸面和不能失礼的沉重。",
      details: [
        "从小被纠正坐姿、用词、送礼与回礼的分寸。",
        "恋爱很少只是两个人的事，更像两个家庭的接口测试。",
        "你更容易进入高门槛圈层，也更容易感到被结构而不是被个人选择定义。"
      ],
      dimensions: {
        家庭财富: "高且代际沉淀",
        父母关系: "克制、重名分",
        家庭教育方式: "规矩与传承",
        家庭支持度: "稳定但带枷锁",
        教育资源: "优质且偏古典精英",
        情绪氛围: "冷淡的体面"
      },
      weight: 0.52,
      storyHookTags: ["etiquette_gate", "marriage_class_bar", "legacy_shell", "family_gatekeeping", "respectability_facet"],
      meta: {
        tier: "high_resource",
        advantages: [
          "平台稳：现金流与支持周期长，抗风险能力更强。",
          "人脉与婚恋市场里的“默认信用”更高，教育与圈层资源优质。",
          "审美、礼仪与社交细节训练好，更容易被高门槛环境接纳。"
        ],
        costs: [
          "门当户对不是口号，是日常筛选：偏离模板的关系要付更高代价。",
          "个人意志常被“家族形象”收编：你想做的，未必是你该做的。",
          "情感表达含蓄到冷漠：爱存在，却不一定好用。"
        ],
        longTermBias: {
          romance: "家长反对某类对象的概率高；资源型联姻叙事更近。",
          education: "名校与正统路线受青睐；太野的路子易被视作失格。",
          career: "金融、律所、家族事业、公共事务等“体面职业”更顺。",
          endings: "继承体面 vs 逃离镀金笼，对照强烈。"
        }
      },
      apply: {
        effects: {
          stats: {
            money: 25,
            intelligence: 5,
            discipline: 9,
            social: 5,
            familySupport: 10,
            stress: 14,
            mental: -7,
            happiness: -6
          }
        },
        addFlags: [
          "privileged_home_finance",
          "family_wealth_high",
          "archetype_old_money",
          "respectability_home",
          "marriage_gatekeeping_home",
          "etiquette_cast_home",
          "gatekeeping_family_narrative"
        ],
        addTags: ["stability", "pressure", "privilege"],
        log: "你学会的第一件事之一，是有些事不必说透，但必须做对：像样子，往往比像自己更优先。"
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
      weight: 0.6,
      storyHookTags: ["warm_support_beat", "emotion_safe_childhood"],
      meta: {
        tier: "mid",
        advantages: ["情绪安全垫厚，关系修复力强。", "家庭支持稳定，抗压与求助能力更好养。"],
        costs: ["物质与圈层上限清晰，重大跃迁仍要靠自己拼命换。"],
        longTermBias: {
          romance: "更重视相处质量与情绪回应，对资源型套路更敏感或更排斥。",
          education: "路径更依赖个人努力与政策节点，少捷径。",
          career: "稳扎稳打型更常见；暴富叙事更远但心态更平。",
          endings: "平凡幸福与自我实现之间的温和拉扯。"
        }
      },
      apply: {
        effects: {
          stats: {
            money: 18,
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
      weight: 0.7,
      storyHookTags: ["financial_scarcity_guilt", "upward_grit"],
      meta: {
        tier: "strained",
        advantages: ["责任感与生存智慧强；小机会也会被你用足。"],
        costs: ["资源天花板低；愧疚感与自我压缩常见。"],
        longTermBias: {
          romance: "更在意现实与负担分担；也更容易在“不配得”里退缩。",
          education: "每一步都像投资，容错低。",
          career: "搞钱与稳定优先；理想需要更晚、更辛苦地赎回。",
          endings: "逆袭与耗尽感并存。"
        }
      },
      apply: {
        effects: {
          stats: {
            money: -5,
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
      weight: 0.7,
      storyHookTags: ["emotional_vigilance_child", "conflict_home_echo"],
      meta: {
        tier: "strained",
        advantages: ["察言观色与危机嗅觉强；独立决断往往更早被迫上线。"],
        costs: ["安全感与信任底座薄；亲密关系易走极端。"],
        longTermBias: {
          romance: "拉扯、回避与强烈依恋可能交替出现。",
          education: "情绪内耗偷走专注；反弹型逆袭也可能发生。",
          career: "对冲突环境耐受高或过度逃避权威。",
          endings: "疗愈、重复创伤或决裂式新生。"
        }
      },
      apply: {
        effects: {
          stats: {
            money: 3,
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
      weight: 0.7,
      storyHookTags: ["self_taught_childhood", "low_structure_home"],
      meta: {
        tier: "mid",
        advantages: ["自主性与探索欲强；更少被安排人生。"],
        costs: ["关键节点易失导；自律与资源获取更吃个人运气。"],
        longTermBias: {
          romance: "更凭感觉；承诺节奏不稳定。",
          education: "两极分化：天才自学或掉队。",
          career: "野路子多；平台起点更随机。",
          endings: "自由职业、漂泊或晚成型叙事。"
        }
      },
      apply: {
        effects: {
          stats: {
            money: 10,
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
      weight: 0.7,
      storyHookTags: ["care_absence_echo", "early_independence"],
      meta: {
        tier: "strained",
        advantages: ["独立与抗压往往早熟。"],
        costs: ["依恋与求助模式易扭曲；家庭支持波动大。"],
        longTermBias: {
          romance: "既渴望被补全，也害怕依赖；边界课题重。",
          education: "看监护人精力与经济。",
          career: "早早扛责；也可能被家庭拖累节奏。",
          endings: "重建家庭感或选择与过去切割。"
        }
      },
      apply: {
        effects: {
          stats: {
            money: 2,
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
      weight: 0.7,
      storyHookTags: ["grade_pressure_home", "emotion_suppressed_child"],
      meta: {
        tier: "mid",
        advantages: ["学业与自律基线往往更高。"],
        costs: ["情绪压抑与自我价值单一化。"],
        longTermBias: {
          romance: "慢热、回避脆弱或过度证明自我价值。",
          education: "国内升学路径受益；心理成本累积。",
          career: "卷王潜质；倦怠与空心风险。",
          endings: "和解或崩断式解脱。"
        }
      },
      apply: {
        effects: {
          stats: {
            money: 14,
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
      weight: 0.7,
      storyHookTags: ["hometown_tie_story", "resource_lag_childhood"],
      meta: {
        tier: "mid",
        advantages: ["归属感与关系网稳定；生活可预期。"],
        costs: ["平台与信息差需要后天补课。"],
        longTermBias: {
          romance: "熟人社会介绍与舆论压力更明显。",
          education: "出走读书是常见跃迁手段。",
          career: "考编/本地产业/外出打拼分歧。",
          endings: "留下建设或一去不回。"
        }
      },
      apply: {
        effects: {
          stats: {
            money: 12,
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
      weight: 0.95,
      storyHookTags: ["business_dinner", "money_first_lessons", "risk_rollercoaster", "investment_story"],
      meta: {
        tier: "volatile",
        advantages: ["景气时支持与见识不输中产以上；商业嗅觉早熟。"],
        costs: ["逆风时全家情绪与资源一起缩水；功利对话多。"],
        longTermBias: {
          romance: "钱与诚意纠缠；家长对门当户对务实。",
          education: "投入随年景摇摆。",
          career: "创业/销售/生意缘强。",
          endings: "大起大落的人生曲线。"
        }
      },
      apply: {
        effects: {
          stats: {
            money: 24,
            discipline: 3,
            social: 5,
            stress: 8,
            mental: -3,
            career: 3,
            familySupport: 8
          }
        },
        addFlags: [
          "privileged_home_finance",
          "merchant_home",
          "archetype_merchant_volatile",
          "risk_exposed_early",
          "money_sensitivity",
          "speculative_route"
        ],
        addTags: ["risk", "growth", "privilege"],
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
      weight: 0.7,
      storyHookTags: ["respectability_facet", "emotionally_guarded_child"],
      meta: {
        tier: "mid",
        advantages: ["体面与社会适应力强；资源中上。"],
        costs: ["亲密恐惧与情感饥饿。"],
        longTermBias: {
          romance: "慢热、测试多、真正打开晚。",
          education: "稳定路线；自我驱动决定上限。",
          career: "白领精英样板的温吞版。",
          endings: "学会亲近或长期孤独。"
        }
      },
      apply: {
        effects: {
          stats: {
            money: 22,
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

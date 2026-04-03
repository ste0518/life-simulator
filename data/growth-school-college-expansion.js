(function () {
  "use strict";

  /**
   * 小学 / 初中 / 高中 / 国内本科日常 / 留学本科日常 — 追加事件池
   * 合并进 LIFE_EXTRA_EVENTS；条件与 data/timeline-rules.js、路线 id 对齐。
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
      familyBackgroundIds: toList(source.familyBackgroundIds),
      excludedFamilyBackgroundIds: toList(source.excludedFamilyBackgroundIds),
      educationRouteIds: toList(source.educationRouteIds),
      excludedEducationRouteIds: toList(source.excludedEducationRouteIds),
      careerRouteIds: toList(source.careerRouteIds),
      excludedCareerRouteIds: toList(source.excludedCareerRouteIds)
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
      addRomanceFlags: toList(source.addRomanceFlags),
      removeRomanceFlags: toList(source.removeRomanceFlags),
      relationshipEffects: toList(source.relationshipEffects),
      setActiveRelationship: typeof source.setActiveRelationship === "string" ? source.setActiveRelationship : null,
      clearActiveRelationship: Boolean(source.clearActiveRelationship),
      setEducationRoute: typeof source.setEducationRoute === "string" ? source.setEducationRoute : null,
      setCareerRoute: typeof source.setCareerRoute === "string" ? source.setCareerRoute : null,
      log: typeof source.log === "string" ? source.log : ""
    };
  }

  function choice(value) {
    const source = value && typeof value === "object" ? value : {};
    const normalized = mutation(source);
    return {
      text: typeof source.text === "string" ? source.text : "继续",
      effects: normalized.effects,
      addFlags: normalized.addFlags,
      removeFlags: normalized.removeFlags,
      addTags: normalized.addTags,
      removeTags: normalized.removeTags,
      addRomanceFlags: normalized.addRomanceFlags,
      removeRomanceFlags: normalized.removeRomanceFlags,
      relationshipEffects: normalized.relationshipEffects,
      setActiveRelationship: normalized.setActiveRelationship,
      clearActiveRelationship: normalized.clearActiveRelationship,
      setEducationRoute: normalized.setEducationRoute,
      setCareerRoute: normalized.setCareerRoute,
      log: normalized.log,
      conditions: condition(source.conditions),
      next: Object.prototype.hasOwnProperty.call(source, "next") ? source.next : undefined
    };
  }

  function event(value) {
    const source = value && typeof value === "object" ? value : {};
    return {
      id: typeof source.id === "string" ? source.id : "",
      stage: typeof source.stage === "string" ? source.stage : "misc",
      title: typeof source.title === "string" ? source.title : "未命名事件",
      text: typeof source.text === "string" ? source.text : "",
      minAge: typeof source.minAge === "number" ? source.minAge : null,
      maxAge: typeof source.maxAge === "number" ? source.maxAge : null,
      weight: typeof source.weight === "number" ? source.weight : 1,
      repeatable: Boolean(source.repeatable),
      tags: toList(source.tags),
      conditions: condition(source.conditions),
      effectsOnEnter: mutation(source.effectsOnEnter || {}),
      choices: Array.isArray(source.choices) ? source.choices.map(choice) : []
    };
  }

  var DOMESTIC_UNI_ROUTES = [
    "elite_city_university",
    "ordinary_university",
    "local_university",
    "distant_university",
    "art_free_path"
  ];

  var OVERSEAS_UNI_ROUTES = ["overseas_research_path", "overseas_practical_path", "overseas_art_path"];

  var VOCATIONAL_ROUTES = ["gaokao_vocational_college", "non_gaokao_skill_path"];

  var GROWTH_SCHOOL_COLLEGE_EVENTS = [
    event({
      id: "growth_sc_primary_deskmate_friend",
      stage: "school",
      title: "同桌把橡皮掰成两半给你",
      text: "那半块橡皮像一份不用签字的契约：从此课间有人替你望风，作业也有人小声对答案。友谊在小学往往就是这样具体起来的。",
      minAge: 7,
      maxAge: 11,
      weight: 6,
      repeatable: true,
      tags: ["school", "social"],
      choices: [
        choice({
          text: "也把秘密和零食分回去，认真经营这段同盟。",
          effects: { age: 0, stats: { social: 4, happiness: 3, discipline: -1 } },
          addFlags: ["primary_close_friend"],
          log: "你第一次尝到「我们」比「我」更暖和一点。"
        }),
        choice({
          text: "心里感激，但怕太黏，故意保持距离。",
          effects: { age: 0, stats: { social: 1, stress: 2, mental: 1 } },
          addTags: ["selfhood"],
          log: "你早早学会在靠近和自保之间留一条缝。"
        })
      ]
    }),
    event({
      id: "growth_sc_primary_grudge_peer",
      stage: "school",
      title: "和好朋友突然冷战的一周",
      text: "可能只是一句玩笑被听岔，也可能是谁多跟谁玩了一次。小孩子的绝交来得快，疼得也很真。",
      minAge: 7,
      maxAge: 11,
      weight: 5,
      repeatable: true,
      tags: ["school", "social"],
      choices: [
        choice({
          text: "写张小纸条把话说开。",
          effects: { age: 0, stats: { social: 2, happiness: 2, mental: 1 } },
          addFlags: ["conflict_repair_early"],
          log: "你发现道歉不丢人，失去才更难受。"
        }),
        choice({
          text: "硬扛着装没事，心里却反复咀嚼。",
          effects: { age: 0, stats: { stress: 4, mental: -2, happiness: -2 } },
          addFlags: ["rumination_seed"],
          log: "你把委屈咽下去，它却在夜里长大。"
        })
      ]
    }),
    event({
      id: "growth_sc_primary_grade_swing",
      stage: "school",
      title: "一次单元测，名次像过山车",
      text: "上一次还被点名表扬，这一次红叉密得像下雨。你开始怀疑自己是「聪明」还是只是「偶尔运气好」。",
      minAge: 8,
      maxAge: 11,
      weight: 6,
      repeatable: true,
      tags: ["school", "education"],
      choices: [
        choice({
          text: "把错题抄在本子上，承认波动是正常的。",
          effects: { age: 0, stats: { intelligence: 3, discipline: 3, stress: 1 } },
          addFlags: ["study_error_book_habit"],
          log: "你学会了用笨办法把自信找回来。"
        }),
        choice({
          text: "赌气几天不碰书，用逃避盖住羞耻。",
          effects: { age: 0, stats: { discipline: -3, stress: 3, happiness: -2 } },
          addTags: ["pressure"],
          log: "你用逃避换来短暂的轻松，却把焦虑留到以后结账。"
        })
      ]
    }),
    event({
      id: "growth_sc_primary_interest_class",
      stage: "school",
      title: "兴趣班：是出口，还是新的 KPI？",
      text: "钢琴、画画、球类、编程……名字听起来像礼物，日程表却像另一张成绩单。",
      minAge: 6,
      maxAge: 11,
      weight: 5,
      repeatable: true,
      tags: ["school", "family"],
      choices: [
        choice({
          text: "找到一样真心喜欢的事，哪怕练得慢也肯去。",
          effects: { age: 0, stats: { happiness: 4, discipline: 2, stress: 2 } },
          addTags: ["craft"],
          addFlags: ["interest_class_commit"],
          log: "你把兴趣从「加分项」慢慢变成「自己的地盘」。"
        }),
        choice({
          text: "为了证书和比赛硬撑，心里越来越烦。",
          effects: { age: 0, stats: { stress: 5, happiness: -3, familySupport: -1 } },
          addFlags: ["interest_burnout_seed"],
          log: "你很小就明白，被安排的热爱也会耗尽。"
        })
      ]
    }),
    event({
      id: "growth_sc_primary_teacher_shine",
      stage: "school",
      title: "班主任在全班面前夸了你",
      text: "那种被点名的好，像一束灯打在身上——暖和，也有点烫。有人真心鼓掌，也有人眼神飘开。",
      minAge: 7,
      maxAge: 11,
      weight: 5,
      repeatable: true,
      tags: ["school", "education"],
      choices: [
        choice({
          text: "把表扬当成责任，下一次更不敢失手。",
          effects: { age: 0, stats: { intelligence: 2, stress: 3, discipline: 2 } },
          addFlags: ["teacher_favorite_pressure"],
          log: "你开始把「别让老师失望」写进心里。"
        }),
        choice({
          text: "偷偷高兴，但不当回事，怕树大招风。",
          effects: { age: 0, stats: { happiness: 3, social: -1, mental: 1 } },
          log: "你学会在掌声里低头走路。"
        })
      ]
    }),
    event({
      id: "growth_sc_primary_teacher_ignore",
      stage: "school",
      title: "你发现自己总坐在「被老师忘记」的角落",
      text: "提问绕开你，目光也绕开你。你开始怀疑是不是安静就等于不重要。",
      minAge: 8,
      maxAge: 11,
      weight: 5,
      repeatable: true,
      tags: ["school", "education"],
      choices: [
        choice({
          text: "举手举到手酸，也要争一次被看见。",
          effects: { age: 0, stats: { social: 2, stress: 2, intelligence: 2 } },
          addFlags: ["self_advocacy_early"],
          log: "你第一次替自己出声。"
        }),
        choice({
          text: "更沉默，把情绪藏进本子和漫画里。",
          effects: { age: 0, stats: { mental: -2, happiness: -2, discipline: 1 } },
          addTags: ["selfhood"],
          log: "你在无人注视的地方，慢慢长出自己的小世界。"
        })
      ]
    }),
    event({
      id: "growth_sc_primary_allowance_first_buy",
      stage: "school",
      title: "第一次攒够零花钱，买下「自己的决定」",
      text: "钱不多，却让你第一次感到：喜欢可以不用经过大人点头——至少在这一小笔里不用。",
      minAge: 8,
      maxAge: 11,
      weight: 5,
      repeatable: true,
      tags: ["school", "family"],
      choices: [
        choice({
          text: "买一本期待很久的书或玩具，郑重地拆开。",
          effects: { age: 0, stats: { happiness: 4, money: -1, discipline: 2 } },
          addFlags: ["first_purchase_joy"],
          log: "你记住「拥有」也可以是自我选择。"
        }),
        choice({
          text: "最后买了更实用的东西，像小大人一样算账。",
          effects: { age: 0, stats: { money: -1, discipline: 3, happiness: 2 } },
          addTags: ["stability"],
          log: "你早早学会把欲望和账本放在同一天平上。"
        })
      ]
    }),
    event({
      id: "growth_sc_primary_clique_secret",
      stage: "school",
      title: "小团体里的「只跟你说」",
      text: "有人拉你进小群：共享贴纸、秘密和外号。被接纳很甜，被排斥别人的滋味却有点刺。",
      minAge: 9,
      maxAge: 11,
      weight: 5,
      repeatable: true,
      tags: ["school", "social"],
      choices: [
        choice({
          text: "守住底线，不当面嘲笑被排挤的同学。",
          effects: { age: 0, stats: { social: 2, stress: 2, mental: 2 } },
          addFlags: ["peer_ethics_early"],
          log: "你在小圈子里仍留了一点清醒。"
        }),
        choice({
          text: "为了合群，跟着起哄一次。",
          effects: { age: 0, stats: { social: 1, happiness: 1, mental: -3 } },
          addFlags: ["peer_guilt_memory"],
          log: "那笑声后来会在夜里回来找你。"
        })
      ]
    }),
    event({
      id: "growth_sc_ms_reclass",
      stage: "adolescence",
      title: "分班名单贴出来那天",
      text: "走廊里有人哭有人笑。熟悉的人被拆散，陌生的脸涌进教室——初中第一次让你感到，关系也会被制度重写。",
      minAge: 12,
      maxAge: 14,
      weight: 6,
      repeatable: true,
      tags: ["adolescence", "school"],
      choices: [
        choice({
          text: "主动跟新同桌搭话，把陌生当成起点。",
          effects: { age: 0, stats: { social: 3, stress: 1, happiness: 2 } },
          addFlags: ["reclass_social_push"],
          log: "你把不安换成第一句「你好」。"
        }),
        choice({
          text: "缩回熟悉的小圈子，对外面保持观察。",
          effects: { age: 0, stats: { stress: 2, social: -1, mental: 1 } },
          log: "你用慢热换一点可控感。"
        })
      ]
    }),
    event({
      id: "growth_sc_ms_puberty_body",
      stage: "adolescence",
      title: "身体先一步替你宣布「长大了」",
      text: "声音、身高、皮肤、体态……镜子里的变化比课本更难预习。你开始在意别人的目光。",
      minAge: 12,
      maxAge: 14,
      weight: 6,
      repeatable: true,
      tags: ["adolescence", "health"],
      choices: [
        choice({
          text: "查资料、问可信的大人，把变化当成科学而不是羞耻。",
          effects: { age: 0, stats: { mental: 2, health: 2, stress: -1 } },
          addFlags: ["puberty_informed_coping"],
          log: "你学会把不确定讲清楚，就不那么可怕。"
        }),
        choice({
          text: "独自别扭，怕被开玩笑，越来越不想举手发言。",
          effects: { age: 0, stats: { stress: 4, social: -2, mental: -2 } },
          addTags: ["pressure"],
          log: "身体在长大，你却想把自己藏起来。"
        })
      ]
    }),
    event({
      id: "growth_sc_ms_night_study",
      stage: "adolescence",
      title: "晚自习与补课：时间表里没有「无聊」",
      text: "教室灯亮到很晚，卷子堆成另一种身高。你开始算：睡五小时够不够，第二天会不会在课上栽倒。",
      minAge: 12,
      maxAge: 14,
      weight: 6,
      repeatable: true,
      tags: ["adolescence", "education"],
      choices: [
        choice({
          text: "咬牙跟上节奏，用咖啡和意志硬顶。",
          effects: { age: 0, stats: { intelligence: 3, health: -3, stress: 4, discipline: 2 } },
          addFlags: ["cramming_culture_embed"],
          log: "你把「累」当成常态，却忘了身体也会记账。"
        }),
        choice({
          text: "偷偷给自己留半小时发呆或走路回家。",
          effects: { age: 0, stats: { stress: -2, mental: 2, intelligence: -1 } },
          addTags: ["selfhood"],
          log: "你在缝隙里抢回一点呼吸。"
        })
      ]
    }),
    event({
      id: "growth_sc_ms_parent_clash",
      stage: "adolescence",
      title: "锁门、成绩和手机：家里的战争升级",
      text: "父母说你叛逆，你说他们不懂。同一屋檐下，语言像隔着玻璃。",
      minAge: 12,
      maxAge: 14,
      weight: 6,
      repeatable: true,
      tags: ["adolescence", "family"],
      choices: [
        choice({
          text: "试着把诉求说清楚：不是要对抗，是要空间。",
          effects: { age: 0, stats: { familySupport: 2, stress: 2, social: 1 } },
          addFlags: ["family_negotiation_attempt"],
          log: "吵过之后才出现第一句像样的对话。"
        }),
        choice({
          text: "冷战到底，用沉默当武器。",
          effects: { age: 0, stats: { familySupport: -4, stress: 5, mental: -2 } },
          addFlags: ["family_silent_war"],
          log: "家里安静得吓人，其实谁都没赢。"
        })
      ]
    }),
    event({
      id: "growth_sc_ms_crush_whisper",
      stage: "adolescence",
      title: "走廊里有人起哄一个名字",
      text: "脸一下子烫起来。你分不清是羞耻、好奇，还是一点点甜——但你知道，从这天起看 TA 的方式不一样了。",
      minAge: 12,
      maxAge: 14,
      weight: 5,
      repeatable: true,
      tags: ["adolescence", "romance"],
      conditions: condition({ excludedFlags: ["player_married"] }),
      choices: [
        choice({
          text: "把心思写进日记，谁也不告诉。",
          effects: { age: 0, stats: { happiness: 2, stress: 2, mental: 1 } },
          addRomanceFlags: ["teen_crush_secret"],
          log: "你让喜欢先在纸面上安全地长大。"
        }),
        choice({
          text: "故意表现得无所谓，怕被看穿。",
          effects: { age: 0, stats: { social: 1, stress: 3 } },
          addRomanceFlags: ["teen_crush_denial"],
          log: "你用玩笑盖住心跳。"
        })
      ]
    }),
    event({
      id: "growth_sc_ms_interest_vs_grade",
      stage: "adolescence",
      title: "喜欢的漫画和「该做的」卷子抢时间",
      text: "你心里清楚哪边让你活着，哪边决定你明天会不会被骂。拉扯从早到晚。",
      minAge: 12,
      maxAge: 14,
      weight: 5,
      repeatable: true,
      tags: ["adolescence", "education"],
      choices: [
        choice({
          text: "给兴趣定固定时段，当成奖励而不是敌人。",
          effects: { age: 0, stats: { discipline: 3, happiness: 2, intelligence: 2 } },
          addFlags: ["time_box_hobby"],
          log: "你学会跟欲望谈判，而不是消灭它。"
        }),
        choice({
          text: "彻底押卷子，把喜欢先冷冻。",
          effects: { age: 0, stats: { intelligence: 3, happiness: -3, stress: 3 } },
          addTags: ["pressure"],
          log: "你暂时赢了分数，却像把自己关进小号。"
        })
      ]
    }),
    event({
      id: "growth_sc_hs_rank_race",
      stage: "highschool",
      title: "月考排名贴在后墙，像公开处刑",
      text: "数字很小，杀伤力很大。有人装作不在意，有人一遍遍地看。你开始给自己贴标签：前几名、中游、掉队。",
      minAge: 15,
      maxAge: 17,
      weight: 7,
      repeatable: true,
      tags: ["highschool", "education"],
      choices: [
        choice({
          text: "只跟昨天的自己比，把排名当参考不当判决。",
          effects: { age: 0, stats: { mental: 2, stress: -1, intelligence: 2 } },
          addFlags: ["rank_perspective_health"],
          log: "你艰难地把自尊从榜单上撕下来一点。"
        }),
        choice({
          text: "被刺激到失眠，越追越怕掉下去。",
          effects: { age: 0, stats: { stress: 6, health: -2, intelligence: 2 } },
          addFlags: ["rank_anxiety_loop"],
          log: "你把恐惧也当成燃料，却不知道它能烧多久。"
        })
      ]
    }),
    event({
      id: "growth_sc_hs_gaokao_air",
      stage: "highschool",
      title: "高三的空气：连笑声都像偷来的",
      text: "倒计时、模考、家长会三连击。每个人都学会用「还行」掩盖真实分贝。",
      minAge: 16,
      maxAge: 17,
      weight: 7,
      repeatable: true,
      tags: ["highschool", "pressure"],
      choices: [
        choice({
          text: "找老师或朋友把压力说出来，哪怕只松一小口。",
          effects: { age: 0, stats: { mental: 2, stress: -2, social: 1 } },
          addFlags: ["gaokao_support_seek"],
          log: "你发现说出来并不会让努力贬值。"
        }),
        choice({
          text: "把自己锁进「必须扛住」的壳里。",
          effects: { age: 0, stats: { discipline: 2, stress: 5, mental: -3 } },
          addTags: ["pressure"],
          log: "硬撑看起来很勇敢，身体却先投降。"
        })
      ]
    }),
    event({
      id: "growth_sc_hs_club_committee",
      stage: "highschool",
      title: "竞赛、社团与班委：时间不够分",
      text: "机会很多，睡眠很少。你想证明自己是「全面的人」，又怕最后哪头都不顶尖。",
      minAge: 15,
      maxAge: 17,
      weight: 6,
      repeatable: true,
      tags: ["highschool", "education"],
      choices: [
        choice({
          text: "押一条主线，把别的当成调剂。",
          effects: { age: 0, stats: { career: 2, intelligence: 3, stress: 2 } },
          addFlags: ["hs_focus_pick"],
          log: "你学会拒绝，也学会深耕。"
        }),
        choice({
          text: "什么都接，把自己摊成薄饼。",
          effects: { age: 0, stats: { social: 2, stress: 5, health: -2, intelligence: -1 } },
          addFlags: ["hs_overcommit"],
          log: "简历看起来很满，人却很空。"
        })
      ]
    }),
    event({
      id: "growth_sc_hs_teacher_rel",
      stage: "highschool",
      title: "和科任老师起冲突之后",
      text: "一句批评在全班面前炸开。你感到羞辱，也感到不服——但你也知道，跟老师硬顶要付代价。",
      minAge: 15,
      maxAge: 17,
      weight: 5,
      repeatable: true,
      tags: ["highschool", "education"],
      choices: [
        choice({
          text: "课后单独沟通，把误会摊开。",
          effects: { age: 0, stats: { social: 2, stress: 1, intelligence: 1 } },
          addFlags: ["teacher_repair_talk"],
          log: "尊严有时要靠把话说完整来保住。"
        }),
        choice({
          text: "在心里记仇，成绩和情绪一起波动。",
          effects: { age: 0, stats: { stress: 4, intelligence: -2, mental: -2 } },
          addFlags: ["teacher_grudge_hs"],
          log: "你把课听成战场，伤的最重的是自己。"
        })
      ]
    }),
    event({
      id: "growth_sc_hs_friends_drift",
      stage: "highschool",
      title: "曾经形影不离的人，开始不同路",
      text: "有人走竞赛，有人走艺考，有人早早谈起了恋爱。你们的聊天从「一起回家」变成「有空约」。",
      minAge: 15,
      maxAge: 17,
      weight: 6,
      repeatable: true,
      tags: ["highschool", "social"],
      choices: [
        choice({
          text: "接受变化，偶尔约一顿饭也算延续。",
          effects: { age: 0, stats: { happiness: 1, mental: 2, stress: 1 } },
          addFlags: ["friend_drift_accepted"],
          log: "你学会把告别写得轻一点。"
        }),
        choice({
          text: "拼命想拽回旧关系，反而更尴尬。",
          effects: { age: 0, stats: { stress: 4, happiness: -3, social: -1 } },
          log: "你抓住的是影子，不是人。"
        })
      ]
    }),
    event({
      id: "growth_sc_hs_crush_vs_future",
      stage: "highschool",
      title: "喜欢的人与你想去的城市不在一张地图",
      text: "志愿、分数、家庭期待像绳子捆着你。喜欢很真，未来也很真——它们第一次正面撞在一起。",
      minAge: 16,
      maxAge: 17,
      weight: 6,
      repeatable: true,
      tags: ["highschool", "romance"],
      conditions: condition({ excludedFlags: ["player_married"] }),
      choices: [
        choice({
          text: "先把各自的路走稳，不把谁绑进牺牲里。",
          effects: { age: 0, stats: { mental: 2, stress: 2, discipline: 2 } },
          addFlags: ["crush_future_boundary"],
          addRomanceFlags: ["hs_love_pragmatic_pause"],
          log: "你把温柔和负责放在同一句里。"
        }),
        choice({
          text: "赌一把靠近，哪怕志愿很难两全。",
          effects: { age: 0, stats: { happiness: 3, stress: 4, familySupport: -1 } },
          addFlags: ["crush_future_gamble"],
          addRomanceFlags: ["hs_love_all_in"],
          log: "年轻让你敢押注，也让你提前看见代价。"
        })
      ]
    }),
    event({
      id: "growth_sc_hs_family_expect_volunteer",
      stage: "highschool",
      title: "饭桌上聊起「为你好」的志愿",
      text: "城市、专业、面子、稳定——每个词都像替你决定。你想反驳，又怕伤人的心比伤分数更疼。",
      minAge: 15,
      maxAge: 17,
      weight: 6,
      repeatable: true,
      tags: ["highschool", "family"],
      choices: [
        choice({
          text: "列数据、讲兴趣，争取一次平等对话。",
          effects: { age: 0, stats: { familySupport: 1, stress: 2, intelligence: 2 } },
          addFlags: ["volunteer_family_debate"],
          log: "你把对抗换成谈判桌。"
        }),
        choice({
          text: "先点头，心里另打算盘。",
          effects: { age: 0, stats: { stress: 4, mental: -1, happiness: -2 } },
          addFlags: ["volunteer_hidden_rebel"],
          log: "表面顺从的人，往往在心里走更远。"
        })
      ]
    }),
    event({
      id: "growth_sc_hs_breakdown_stabilize",
      stage: "highschool",
      title: "一次在洗手间里突然喘不上气",
      text: "可能是压力堆到阈值，也可能是长期睡眠不足的总账。你第一次怀疑：我是不是撑不住了？",
      minAge: 16,
      maxAge: 17,
      weight: 5,
      repeatable: true,
      tags: ["highschool", "health"],
      choices: [
        choice({
          text: "跟父母或校医开口，允许自己「先活下来再谈分数」。",
          effects: { age: 0, stats: { mental: 3, health: 3, stress: -3, intelligence: -1 } },
          addFlags: ["mental_health_hs_reachout"],
          log: "求助不是认输，是换一条路继续走。"
        }),
        choice({
          text: "洗把脸回去继续熬，当没发生过。",
          effects: { age: 0, stats: { discipline: 1, stress: 5, health: -4, mental: -3 } },
          addFlags: ["hs_panic_buried"],
          log: "你把崩溃压下去，它会在别处找出口。"
        })
      ]
    }),
    event({
      id: "growth_sc_uni_dorm_first_week",
      stage: "college",
      title: "宿舍第一夜：陌生城市从上下铺开始",
      text: "行李摊开像小型迁徙。有人热情，有人冷淡，有人半夜还在打游戏——你突然要和别人共享「家」的定义。",
      minAge: 17,
      maxAge: 24,
      weight: 7,
      repeatable: true,
      tags: ["college", "education"],
      conditions: condition({
        educationRouteIds: DOMESTIC_UNI_ROUTES,
        excludedFlags: ["life_path_overseas"]
      }),
      choices: [
        choice({
          text: "主动定几条寝室公约，温和但清楚。",
          effects: { age: 0, stats: { social: 3, stress: 1, discipline: 2 } },
          addFlags: ["dorm_rules_initiator"],
          log: "边界感是集体生活的救生圈。"
        }),
        choice({
          text: "先观察，把自己缩进床帘后面。",
          effects: { age: 0, stats: { stress: 2, mental: 1, social: -1 } },
          log: "慢热不是错，只是要防一直孤单。"
        })
      ]
    }),
    event({
      id: "growth_sc_uni_roommate_friction",
      stage: "college",
      title: "卫生、空调和深夜噪音：室友矛盾升级",
      text: "小事叠成大山。你在群里打字又删掉，怕撕破脸，又怕自己憋出病。",
      minAge: 18,
      maxAge: 24,
      weight: 6,
      repeatable: true,
      tags: ["college", "education"],
      conditions: condition({
        educationRouteIds: DOMESTIC_UNI_ROUTES,
        excludedFlags: ["life_path_overseas"]
      }),
      choices: [
        choice({
          text: "当面谈一次，把具体行为说清楚。",
          effects: { age: 0, stats: { stress: 2, social: 2, mental: 2 } },
          addFlags: ["roommate_direct_talk"],
          log: "尴尬五分钟，省心一学期。"
        }),
        choice({
          text: "申请换宿或往外租，花钱买距离。",
          effects: { age: 0, stats: { money: -4, stress: -2, happiness: 2 } },
          addFlags: ["roommate_exit_rent"],
          log: "你用租金换睡眠，也算一种自救。"
        })
      ]
    }),
    event({
      id: "growth_sc_uni_club_cycle",
      stage: "college",
      title: "社团招新：加三个群，退两个坑",
      text: "传单、面试、熬夜策划——你既想扩大圈子，又怕绩点掉队。",
      minAge: 18,
      maxAge: 24,
      weight: 6,
      repeatable: true,
      tags: ["college", "social"],
      conditions: condition({
        educationRouteIds: DOMESTIC_UNI_ROUTES,
        excludedFlags: ["life_path_overseas"]
      }),
      choices: [
        choice({
          text: "只留一个真正投入的组织，当长线社交。",
          effects: { age: 0, stats: { social: 4, career: 2, stress: 2 } },
          addFlags: ["club_one_deep"],
          log: "深度比广度更养人。"
        }),
        choice({
          text: "当「社恐观光客」，偶尔露面也算参与。",
          effects: { age: 0, stats: { happiness: 2, social: 1, career: -1 } },
          log: "你在人群边缘，也找到舒服的位置。"
        })
      ]
    }),
    event({
      id: "growth_sc_uni_major_doubt",
      stage: "college",
      title: "专业课第一节就把你听懵了",
      text: "你怀疑当年填志愿是不是太随便。转专业的念头像后台程序，一直占内存。",
      minAge: 18,
      maxAge: 24,
      weight: 6,
      repeatable: true,
      tags: ["college", "education"],
      conditions: condition({
        educationRouteIds: DOMESTIC_UNI_ROUTES,
        excludedFlags: ["life_path_overseas"]
      }),
      choices: [
        choice({
          text: "查培养方案、找学长问转系门槛，认真评估。",
          effects: { age: 0, stats: { intelligence: 3, stress: 3, discipline: 2 } },
          addFlags: ["transfer_major_research"],
          log: "你把迷茫换成信息，而不是空想。"
        }),
        choice({
          text: "先混着拿证，把兴趣留给自学和副业。",
          effects: { age: 0, stats: { stress: 2, happiness: -1, career: 2 } },
          addFlags: ["major_grit_sideline"],
          log: "你把人生改成双轨运行。"
        })
      ]
    }),
    event({
      id: "growth_sc_uni_intern_scratch",
      stage: "college",
      title: "第一份实习：打杂、被骂、也摸到行业边缘",
      text: "简历上多一行字，地铁上多两小时。你第一次理解「工作经验」不是名词，是体力活。",
      minAge: 19,
      maxAge: 25,
      weight: 6,
      repeatable: true,
      tags: ["college", "work"],
      conditions: condition({
        educationRouteIds: DOMESTIC_UNI_ROUTES,
        excludedFlags: ["life_path_overseas"]
      }),
      choices: [
        choice({
          text: "把杂活当地图，主动问「我还能学什么」。",
          effects: { age: 0, stats: { career: 4, stress: 2, social: 2 } },
          addFlags: ["intern_aggressive_learn"],
          log: "笨功夫里也能抠出机会。"
        }),
        choice({
          text: "熬满时长就跑，先保住绩点和睡眠。",
          effects: { age: 0, stats: { health: 2, stress: -1, career: 1 } },
          log: "你把实习当任务，不是当信仰。"
        })
      ]
    }),
    event({
      id: "growth_sc_uni_scholarship_near",
      stage: "college",
      title: "奖学金公示：差一名的那种遗憾",
      text: "你看见名单上熟悉的名字，也看见自己离线只差一点点。钱不多，却像被轻轻否定了一下。",
      minAge: 18,
      maxAge: 24,
      weight: 5,
      repeatable: true,
      tags: ["college", "education"],
      conditions: condition({
        educationRouteIds: DOMESTIC_UNI_ROUTES,
        excludedFlags: ["life_path_overseas"]
      }),
      choices: [
        choice({
          text: "把规则读透，下一年按加分项反推行动。",
          effects: { age: 0, stats: { discipline: 3, intelligence: 2, stress: 2 } },
          addFlags: ["scholarship_comeback_plan"],
          log: "你把遗憾改成下一局的攻略。"
        }),
        choice({
          text: "觉得评价体系太窄，转向赚钱或项目证明自己。",
          effects: { age: 0, stats: { career: 2, happiness: 1, stress: 2 } },
          addTags: ["ambition"],
          log: "你开始找课堂外的记分牌。"
        })
      ]
    }),
    event({
      id: "growth_sc_uni_living_cost_call",
      stage: "college",
      title: "生活费电话：数字背后是两代人的账本",
      text: "父母在电话里算房租、食堂和换季衣服。你想多要一点社交预算，话到嘴边又咽回去。",
      minAge: 18,
      maxAge: 24,
      weight: 6,
      repeatable: true,
      tags: ["college", "family"],
      conditions: condition({
        educationRouteIds: DOMESTIC_UNI_ROUTES,
        excludedFlags: ["life_path_overseas"]
      }),
      choices: [
        choice({
          text: "自己做兼职或接单子，分担一点现金流。",
          effects: { age: 0, stats: { money: 2, stress: 3, career: 2, discipline: 2 } },
          addFlags: ["uni_side_income"],
          log: "你第一次用劳动换「体面地社交」。"
        }),
        choice({
          text: "把开支砍到最低，减少愧疚感。",
          effects: { age: 0, stats: { money: 1, happiness: -2, stress: 2 } },
          addFlags: ["uni_frugal_mode"],
          log: "省钱能止痛，也会让你错过一些体验。"
        })
      ]
    }),
    event({
      id: "growth_sc_uni_grad_school_whisper",
      stage: "college",
      title: "考研还是就业：寝室夜聊像小型公投",
      text: "有人刷题，有人投简历，有人嘴上说着随缘。你知道选哪边都不是「正确答案」，只是不同的累法。",
      minAge: 20,
      maxAge: 26,
      weight: 6,
      repeatable: true,
      tags: ["college", "education"],
      conditions: condition({
        educationRouteIds: DOMESTIC_UNI_ROUTES,
        excludedFlags: ["life_path_overseas"]
      }),
      choices: [
        choice({
          text: "把考研当一年项目：信息、预算、身体一起排。",
          effects: { age: 0, stats: { intelligence: 3, stress: 4, discipline: 3 } },
          addFlags: ["grad_school_lean_in"],
          addTags: ["ambition"],
          log: "你把未来从口号拆成日程表。"
        }),
        choice({
          text: "先工作几年再决定要不要回来读。",
          effects: { age: 0, stats: { career: 3, stress: 2, happiness: 1 } },
          addFlags: ["work_first_grad_later"],
          log: "你把学历放回工具箱，而不是身份证。"
        })
      ]
    }),
    event({
      id: "growth_sc_uni_slip_semester",
      stage: "college",
      title: "有一学期你差点把自己「摆烂」进去",
      text: "游戏、短视频、熬夜——清醒时自责，糊涂时继续。绩点像滑梯，你抓着扶手不敢往下看。",
      minAge: 18,
      maxAge: 24,
      weight: 5,
      repeatable: true,
      tags: ["college", "education"],
      conditions: condition({
        educationRouteIds: DOMESTIC_UNI_ROUTES,
        excludedFlags: ["life_path_overseas"]
      }),
      choices: [
        choice({
          text: "找辅导员或朋友盯进度，把重修名单变短。",
          effects: { age: 0, stats: { discipline: 3, stress: 2, intelligence: 2, mental: 1 } },
          addFlags: ["academic_recovery_plan"],
          log: "爬起来很丑，但总比躺着诚实。"
        }),
        choice({
          text: "继续滑，直到现实用挂科敲你门。",
          effects: { age: 0, stats: { stress: 4, mental: -4, intelligence: -3 } },
          addFlags: ["academic_slump_deep"],
          log: "你用逃避赊账，利息迟早会来。"
        })
      ]
    }),
    event({
      id: "growth_sc_uni_campus_romance",
      stage: "college",
      title: "校园恋爱：课表、食堂和「以后怎么办」",
      text: "牵手很甜，争吵也很具体：小组作业、实习城市、消费差距。你们第一次把喜欢放进现实里称。",
      minAge: 18,
      maxAge: 24,
      weight: 5,
      repeatable: true,
      tags: ["college", "romance"],
      conditions: condition({
        educationRouteIds: DOMESTIC_UNI_ROUTES,
        excludedFlags: ["life_path_overseas", "player_married"]
      }),
      choices: [
        choice({
          text: "认真谈一次对未来的底线，不把默契当承诺。",
          effects: { age: 0, stats: { mental: 2, stress: 2, happiness: 2 } },
          addRomanceFlags: ["uni_love_explicit_future"],
          log: "你把浪漫和负责放在同一张桌上。"
        }),
        choice({
          text: "享受当下，问题留给以后的自己。",
          effects: { age: 0, stats: { happiness: 4, stress: 1 } },
          addRomanceFlags: ["uni_love_present_only"],
          log: "你赌的是青春，不是答案。"
        })
      ]
    }),
    event({
      id: "growth_sc_uni_vocational_floor",
      stage: "college",
      title: "实训车间里的油污比课本更真实",
      text: "手套、量具、师傅的骂与夸——你第一次感到「会做题」和「会干活」不是一回事。",
      minAge: 16,
      maxAge: 22,
      weight: 6,
      repeatable: true,
      tags: ["college", "work"],
      conditions: condition({
        educationRouteIds: VOCATIONAL_ROUTES,
        excludedFlags: ["life_path_overseas"]
      }),
      choices: [
        choice({
          text: "跟紧师傅，把每一次失误记成笔记。",
          effects: { age: 0, stats: { career: 4, discipline: 3, health: -1 } },
          addFlags: ["vocational_apprentice_mind"],
          log: "手艺是摔出来的，不是背出来的。"
        }),
        choice({
          text: "只想混满课时，心里盼着早点换赛道。",
          effects: { age: 0, stats: { career: -1, stress: 2, happiness: -2 } },
          addFlags: ["vocational_disengage"],
          log: "身体在车间，心思已经走远。"
        })
      ]
    }),
    event({
      id: "growth_sc_os_landing_shock",
      stage: "college",
      title: "落地第一周：时差、银行卡与「我在这儿算什么」",
      text: "机场到宿舍像穿越。你突然要独自处理一切，而母语不在身边。",
      minAge: 17,
      maxAge: 28,
      weight: 7,
      repeatable: true,
      tags: ["college", "travel"],
      conditions: condition({
        requiredFlags: ["life_path_overseas"],
        educationRouteIds: OVERSEAS_UNI_ROUTES
      }),
      choices: [
        choice({
          text: "按清单逐项搞定行政琐事，给自己小奖励。",
          effects: { age: 0, stats: { stress: 2, mental: 2, discipline: 3 } },
          addFlags: ["overseas_landing_systematic"],
          log: "你把恐慌拆成任务，就能一项项划掉。"
        }),
        choice({
          text: "崩溃几天后慢慢爬起，允许自己不体面。",
          effects: { age: 0, stats: { mental: -2, stress: 4, happiness: -1 } },
          addFlags: ["overseas_landing_rough"],
          log: "狼狈也是过程，不是判决。"
        })
      ]
    }),
    event({
      id: "growth_sc_os_lecture_wall",
      stage: "college",
      title: "全英文课堂：耳朵追不上 PPT",
      text: "你记笔记像抓蝌蚪，漏掉的比抓住的多。怀疑和自卑一起涌上来。",
      minAge: 17,
      maxAge: 28,
      weight: 6,
      repeatable: true,
      tags: ["college", "education"],
      conditions: condition({
        requiredFlags: ["life_path_overseas"],
        educationRouteIds: OVERSEAS_UNI_ROUTES
      }),
      choices: [
        choice({
          text: "录音、预习、找语言伙伴，把课当成训练场。",
          effects: { age: 0, stats: { intelligence: 4, stress: 3, discipline: 3 } },
          addFlags: ["overseas_language_grind"],
          log: "你把自己调慢一点，反而走得更远。"
        }),
        choice({
          text: "只追求及格，把精力留给打工和社交。",
          effects: { age: 0, stats: { stress: -1, intelligence: -1, career: 2, money: 2 } },
          addFlags: ["overseas_survival_pass"],
          log: "你先活下来，再谈优秀。"
        })
      ]
    }),
    event({
      id: "growth_sc_os_group_project",
      stage: "college",
      title: "小组作业：自由裁量与「谁拖后腿」",
      text: "有人消失，有人强势，有人用「文化差异」当挡箭牌。你在群里@ 人@ 到心累。",
      minAge: 18,
      maxAge: 28,
      weight: 6,
      repeatable: true,
      tags: ["college", "social"],
      conditions: condition({
        requiredFlags: ["life_path_overseas"],
        educationRouteIds: OVERSEAS_UNI_ROUTES
      }),
      choices: [
        choice({
          text: "写清分工与时间线，必要时抄送导师。",
          effects: { age: 0, stats: { career: 2, stress: 2, social: 2 } },
          addFlags: ["overseas_group_contract"],
          log: "规则感是跨文化团队的通用语。"
        }),
        choice({
          text: "自己扛大头，只求分数别掉。",
          effects: { age: 0, stats: { intelligence: 2, stress: 5, health: -2 } },
          addFlags: ["overseas_group_carry"],
          log: "你赢了成绩，却输了可持续。"
        })
      ]
    }),
    event({
      id: "growth_sc_os_part_time",
      stage: "college",
      title: "打工签与时薪：用时间换呼吸空间",
      text: "合法工时、税单、老板脾气——你在另一个体系里学会讨价还价。",
      minAge: 18,
      maxAge: 30,
      weight: 6,
      repeatable: true,
      tags: ["college", "work"],
      conditions: condition({
        requiredFlags: ["life_path_overseas"],
        educationRouteIds: OVERSEAS_UNI_ROUTES
      }),
      choices: [
        choice({
          text: "严格控制工时，不让打工吃掉睡眠和课。",
          effects: { age: 0, stats: { money: 3, stress: 2, discipline: 3, intelligence: 1 } },
          addFlags: ["overseas_pt_balance"],
          log: "你知道现金流的甜头，也守住了底线。"
        }),
        choice({
          text: "多排班还债或寄钱回家，身体先透支。",
          effects: { age: 0, stats: { money: 5, health: -4, stress: 4 } },
          addFlags: ["overseas_pt_overwork"],
          log: "你把责任背在肩上，肩膀会先响。"
        })
      ]
    }),
    event({
      id: "growth_sc_os_homesick",
      stage: "college",
      title: "视频里爸妈笑，你在这头憋眼泪",
      text: "想家的方式很土：想吃一碗很具体的面。你突然理解「熟悉」也是一种资源。",
      minAge: 17,
      maxAge: 30,
      weight: 6,
      repeatable: true,
      tags: ["college", "family"],
      conditions: condition({
        requiredFlags: ["life_path_overseas"],
        educationRouteIds: OVERSEAS_UNI_ROUTES
      }),
      choices: [
        choice({
          text: "定期联系，也把本地小仪式变成新锚点。",
          effects: { age: 0, stats: { mental: 2, happiness: 2, stress: -1 } },
          addFlags: ["overseas_homesick_ritual"],
          log: "你在两处之间搭了一座小桥。"
        }),
        choice({
          text: "断联一阵子，怕一说就崩。",
          effects: { age: 0, stats: { familySupport: -3, stress: 4, mental: -2 } },
          addFlags: ["overseas_contact_avoid"],
          log: "距离保护你，也伤两边。"
        })
      ]
    }),
    event({
      id: "growth_sc_os_finance_squeeze",
      stage: "college",
      title: "汇率、房租与意外账单同时敲门",
      text: "你第一次把「财务」当成每天都要开的 App。焦虑有具体的数字形状。",
      minAge: 18,
      maxAge: 32,
      weight: 6,
      repeatable: true,
      tags: ["college", "money"],
      conditions: condition({
        requiredFlags: ["life_path_overseas"],
        educationRouteIds: OVERSEAS_UNI_ROUTES
      }),
      choices: [
        choice({
          text: "重做预算，找校内资助或合法补助信息。",
          effects: { age: 0, stats: { stress: 2, money: 2, mental: 2 } },
          addFlags: ["overseas_finance_replan"],
          log: "你把羞耻换成行动清单。"
        }),
        choice({
          text: "借一点撑过去，先把眼前关过了再说。",
          effects: { age: 0, stats: { money: 4, debt: 5, stress: 4 } },
          addFlags: ["overseas_bridge_debt"],
          log: "短期解药，长期要还利息。"
        })
      ]
    }),
    event({
      id: "growth_sc_os_stay_or_return",
      stage: "college",
      title: "毕业前夜：留下、回去，还是第三国？",
      text: "签证、感情、父母期待、行业机会——每个变量都在摇晃。没有一种选择是「干净」的。",
      minAge: 21,
      maxAge: 32,
      weight: 5,
      repeatable: true,
      tags: ["college", "career"],
      conditions: condition({
        requiredFlags: ["life_path_overseas"],
        educationRouteIds: OVERSEAS_UNI_ROUTES
      }),
      choices: [
        choice({
          text: "做信息表：成本、风险、三年后的自己。",
          effects: { age: 0, stats: { career: 3, stress: 3, mental: 2 } },
          addFlags: ["overseas_decision_matrix"],
          addTags: ["ambition"],
          log: "你把情绪从决策里挪开一点。"
        }),
        choice({
          text: "听从直觉先赌一把，边走边改。",
          effects: { age: 0, stats: { happiness: 2, stress: 4, career: 1 } },
          addTags: ["risk"],
          log: "年轻允许试错，但代价要自己认。"
        })
      ]
    }),
    event({
      id: "growth_sc_os_romance_distance",
      stage: "college",
      title: "异国恋或本地恋：时区把「晚安」拉长",
      text: "有人喜欢你的口音，也有人只想要短暂陪伴。你在亲密里练习边界。",
      minAge: 18,
      maxAge: 30,
      weight: 5,
      repeatable: true,
      tags: ["college", "romance"],
      conditions: condition({
        requiredFlags: ["life_path_overseas"],
        educationRouteIds: OVERSEAS_UNI_ROUTES,
        excludedFlags: ["player_married"]
      }),
      choices: [
        choice({
          text: "把期待说清楚：学业优先还是关系优先。",
          effects: { age: 0, stats: { mental: 2, stress: 2 } },
          addRomanceFlags: ["overseas_love_explicit"],
          log: "透明一点，伤人会少一点。"
        }),
        choice({
          text: "享受暧昧，不急着命名。",
          effects: { age: 0, stats: { happiness: 3, stress: 2 } },
          addRomanceFlags: ["overseas_love_light"],
          log: "你在流动里找一点确定。"
        })
      ]
    })
  ];

  window.LIFE_EXTRA_EVENTS = [
    ...(Array.isArray(window.LIFE_EXTRA_EVENTS) ? window.LIFE_EXTRA_EVENTS : []),
    ...GROWTH_SCHOOL_COLLEGE_EVENTS
  ];
})();

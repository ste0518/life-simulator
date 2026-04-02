(function () {
  "use strict";

  function toList(value) {
    return Array.isArray(value) ? value.slice() : [];
  }

  function toStats(value) {
    return value && typeof value === "object" ? { ...value } : {};
  }

  function toObject(value) {
    return value && typeof value === "object" ? { ...value } : {};
  }

  function relationship(value) {
    const source = value && typeof value === "object" ? value : {};
    return {
      id: typeof source.id === "string" ? source.id : "",
      name: typeof source.name === "string" ? source.name : "未命名角色",
      gender: typeof source.gender === "string" ? source.gender : "",
      identity: typeof source.identity === "string" ? source.identity : "",
      stageTags: toList(source.stageTags),
      roleTags: toList(source.roleTags),
      traitTags: toList(source.traitTags),
      contactStyle: typeof source.contactStyle === "string" ? source.contactStyle : "",
      conflictStyle: typeof source.conflictStyle === "string" ? source.conflictStyle : "",
      initialAffection: typeof source.initialAffection === "number" ? source.initialAffection : 0,
      initialStatus: typeof source.initialStatus === "string" ? source.initialStatus : "unknown",
      initialMetrics: toObject(source.initialMetrics),
      appearance: toObject(source.appearance),
      availability: toObject(source.availability),
      romanceProfile: toObject(source.romanceProfile)
    };
  }

  function arc(value) {
    const source = value && typeof value === "object" ? value : {};
    return {
      characterId: typeof source.characterId === "string" ? source.characterId : "",
      arcId: typeof source.arcId === "string" ? source.arcId : "",
      title: typeof source.title === "string" ? source.title : "",
      summary: typeof source.summary === "string" ? source.summary : "",
      exclusiveEvents: toList(source.exclusiveEvents),
      historyLabels: toObject(source.historyLabels)
    };
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
      requiredTags: toList(source.requiredTags),
      excludedTags: toList(source.excludedTags),
      knownRelationships: toList(source.knownRelationships),
      unknownRelationships: toList(source.unknownRelationships),
      activeRelationshipIds: toList(source.activeRelationshipIds),
      activeRelationshipStatuses: toList(source.activeRelationshipStatuses),
      anyRelationshipStatuses: toList(source.anyRelationshipStatuses),
      relationshipStatuses: toObject(source.relationshipStatuses),
      excludedRelationshipStatuses: toObject(source.excludedRelationshipStatuses),
      minAffection: toObject(source.minAffection),
      minFamiliarity: toObject(source.minFamiliarity),
      minTrust: toObject(source.minTrust),
      minAmbiguity: toObject(source.minAmbiguity),
      minPlayerInterest: toObject(source.minPlayerInterest),
      minTheirInterest: toObject(source.minTheirInterest),
      minCommitment: toObject(source.minCommitment),
      requiredSharedHistory: toObject(source.requiredSharedHistory),
      activeRelationshipMinAffection:
        typeof source.activeRelationshipMinAffection === "number" ? source.activeRelationshipMinAffection : null,
      activeRelationshipMinTrust:
        typeof source.activeRelationshipMinTrust === "number" ? source.activeRelationshipMinTrust : null,
      activeRelationshipMinCommitment:
        typeof source.activeRelationshipMinCommitment === "number" ? source.activeRelationshipMinCommitment : null,
      activeRelationshipRequiredSharedHistory: toList(source.activeRelationshipRequiredSharedHistory),
      requiredActiveRelationshipFlags: toList(source.requiredActiveRelationshipFlags),
      excludedActiveRelationshipFlags: toList(source.excludedActiveRelationshipFlags)
    };
  }

  function relationshipEffect(value) {
    const source = value && typeof value === "object" ? value : {};
    return {
      targetId: typeof source.targetId === "string" ? source.targetId : "",
      affection: typeof source.affection === "number" ? source.affection : 0,
      familiarity: typeof source.familiarity === "number" ? source.familiarity : 0,
      trust: typeof source.trust === "number" ? source.trust : 0,
      ambiguity: typeof source.ambiguity === "number" ? source.ambiguity : 0,
      playerInterest: typeof source.playerInterest === "number" ? source.playerInterest : 0,
      theirInterest: typeof source.theirInterest === "number" ? source.theirInterest : 0,
      tension: typeof source.tension === "number" ? source.tension : 0,
      commitment: typeof source.commitment === "number" ? source.commitment : 0,
      continuity: typeof source.continuity === "number" ? source.continuity : 0,
      interactions: typeof source.interactions === "number" ? source.interactions : 0,
      status: typeof source.status === "string" ? source.status : "",
      addFlags: toList(source.addFlags),
      removeFlags: toList(source.removeFlags),
      addSharedHistory: toList(source.addSharedHistory),
      removeSharedHistory: toList(source.removeSharedHistory),
      history: typeof source.history === "string" ? source.history : "",
      setActive: Boolean(source.setActive),
      clearActive: Boolean(source.clearActive)
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
      relationshipEffects: Array.isArray(source.relationshipEffects)
        ? source.relationshipEffects.map(relationshipEffect)
        : [],
      setActiveRelationship: typeof source.setActiveRelationship === "string" ? source.setActiveRelationship : null,
      clearActiveRelationship: Boolean(source.clearActiveRelationship),
      customAction: typeof source.customAction === "string" ? source.customAction : "",
      customPayload: toObject(source.customPayload),
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
      customAction: normalized.customAction,
      customPayload: normalized.customPayload,
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
      maxVisits: typeof source.maxVisits === "number" ? source.maxVisits : undefined,
      cooldownChoices: typeof source.cooldownChoices === "number" ? source.cooldownChoices : undefined,
      tags: toList(source.tags),
      conditions: condition(source.conditions),
      effectsOnEnter: mutation(source.effectsOnEnter),
      choices: Array.isArray(source.choices) ? source.choices.map(choice) : []
    };
  }

  window.LIFE_RELATIONSHIPS = [
    ...(Array.isArray(window.LIFE_RELATIONSHIPS) ? window.LIFE_RELATIONSHIPS : []),
    relationship({
      id: "lin_xiawan",
      name: "林夏晚",
      gender: "female",
      identity: "初中开始在图书馆轮值、校刊组和社团活动里频繁碰见的人，表面轻松，真正熟了以后反而很会看人。",
      stageTags: ["adolescence", "highschool", "college", "young_adult", "family"],
      roleTags: ["图书馆轮值", "校刊组"],
      traitTags: ["机敏", "会观察人", "有边界"],
      contactStyle: "更容易在一起值日、借资料、做社团收尾这种重复场景里熟起来。",
      conflictStyle: "不会当场闹，但会先默默记住，再决定要不要继续信你。",
      appearance: {
        minAge: 13,
        firstStage: "adolescence",
        contexts: ["图书馆轮值", "校刊组", "晚自习后整理资料", "朋友转来的旧书"],
        sceneHooks: {
          notice: "图书馆角落、校刊组桌面和被翻旧的借阅登记本",
          contact: "一起整理书架和校刊组收尾",
          repeated: "晚自习后顺路去还书、借资料和被同学拉着一起帮忙",
          bond: "她总能记住你随口提过的小事，关系会在这些细节里慢慢变深",
          special: "别人开始默认你们会被分到同一组、同一摊杂事时",
          distance: "升学、社团散掉和谁都不肯先说破的迟疑把关系一点点拖远",
          reunion: "很多年后在书店活动、展览开幕或朋友局里又重新碰见"
        }
      },
      availability: {
        spansStages: ["adolescence", "highschool", "college", "young_adult", "family"],
        reconnectAges: [18, 24, 30],
        continuityBias: "steady"
      },
      romanceProfile: {
        arcType: "slowburn",
        futureFocus: "看重细节和真实回应，慢慢升温但不喜欢被糊弄。",
        longTermPotential: 84,
        volatility: 36,
        fitTags: ["literature", "stability", "mutual_support"],
        theirInterestConditions: {
          minStats: { mental: 38, intelligence: 26 }
        },
        warmingConditions: {
          minStats: { mental: 35, social: 24 }
        },
        breakupConditions: {
          someFlags: ["trust_break", "emotionally_guarded"],
          minStats: { stress: 56 }
        },
        canReconnect: true
      }
    }),
    relationship({
      id: "he_yucheng",
      name: "何予澄",
      gender: "male",
      identity: "初中起在球馆、社区活动和朋友局里反复碰见的人，嘴快但不坏，表面混不吝，真正上心时会很护人。",
      stageTags: ["adolescence", "highschool", "young_adult", "career"],
      roleTags: ["邻里圈子", "球馆常客"],
      traitTags: ["松弛", "直接", "护短"],
      contactStyle: "更容易在一起做事、一起回家和被朋友起哄的局里熟起来。",
      conflictStyle: "不喜欢被瞒着，感觉不对劲时会直接来问。",
      appearance: {
        minAge: 13,
        firstStage: "adolescence",
        contexts: ["社区球馆", "周末活动", "朋友带来的饭局", "雨天一起等车"],
        sceneHooks: {
          notice: "球馆边、便利店门口和热闹局里最先响起来的那阵笑声",
          contact: "帮忙拿东西、散场顺路和朋友临时凑局",
          repeated: "社团活动后一起回家和周末总能碰上的那些场合",
          bond: "他会在大家都在起哄时先替你挡掉一点尴尬",
          special: "你开始在热闹里下意识找他的反应时",
          distance: "成长节奏不同和谁都不想先低头的别扭把关系拖成了拉扯",
          reunion: "成年后在深夜接人、婚礼散场或临时聚会里又遇到"
        }
      },
      availability: {
        spansStages: ["adolescence", "highschool", "young_adult", "career"],
        reconnectAges: [18, 25, 31],
        continuityBias: "intense"
      },
      romanceProfile: {
        arcType: "intense",
        futureFocus: "很看在场感和真诚，暧昧拖太久反而会消磨他。",
        longTermPotential: 62,
        volatility: 74,
        fitTags: ["social", "passion", "action"],
        theirInterestConditions: {
          minStats: { social: 24, happiness: 28 }
        },
        warmingConditions: {
          minStats: { social: 28 }
        },
        breakupConditions: {
          someFlags: ["trust_break", "solo_pattern"],
          minStats: { stress: 50 }
        },
        canReconnect: true
      }
    }),
    relationship({
      id: "elias_wen",
      name: "Elias 温",
      gender: "male",
      identity: "出国后在课程项目和留学生混合圈子里认识的人，讲话稳，边界清楚，会先看你是不是诚实。",
      stageTags: ["college", "young_adult", "career"],
      roleTags: ["海外同学", "项目搭档"],
      traitTags: ["冷静", "边界感强", "善于共情"],
      contactStyle: "更容易在合作项目、深夜收尾和情绪被认真接住时靠近。",
      conflictStyle: "一旦发现自己被隐瞒，会先沉默，然后直接退出。",
      appearance: {
        minAge: 19,
        firstStage: "college",
        contexts: ["课程项目", "海外学生会活动", "共享厨房夜聊", "同城展演"],
        sceneHooks: {
          notice: "项目讨论室、共享厨房和总有人临时救火的夜里",
          contact: "一起补项目细节和深夜去买咖啡",
          repeated: "组会收尾以后留下来继续聊的那些时段",
          bond: "他会把你真正没说出口的疲惫听进去，这会让人很难不靠近",
          special: "你开始在手机弹出消息时下意识期待是他",
          distance: "真相和边界一旦错开，他会退得很干净",
          reunion: "几年后在另一座城市的转机或行业活动里偶然重逢"
        }
      },
      availability: {
        spansStages: ["college", "young_adult", "career"],
        reconnectAges: [24, 29],
        continuityBias: "regret"
      },
      romanceProfile: {
        arcType: "regret",
        futureFocus: "重视诚实和情绪成熟，不喜欢模糊地带里消耗。",
        longTermPotential: 78,
        volatility: 42,
        fitTags: ["depth", "respect", "healing"],
        theirInterestConditions: {
          minStats: { mental: 42, intelligence: 32 }
        },
        warmingConditions: {
          minStats: { mental: 40, social: 28 }
        },
        breakupConditions: {
          someFlags: ["overseas_double_track", "trust_break"],
          minStats: { stress: 58 }
        },
        canReconnect: true
      }
    }),
    relationship({
      id: "sofia_qi",
      name: "祁索菲",
      gender: "female",
      identity: "出国后在艺术馆、社交局和朋友带来的新圈子里熟起来的人，热烈、直接，也最讨厌自己被放在见不得光的位置。",
      stageTags: ["college", "young_adult", "career"],
      roleTags: ["海外朋友圈", "活动策划"],
      traitTags: ["热烈", "直接", "不肯委屈自己"],
      contactStyle: "一起参加活动、散场后继续聊和被她主动拉进新圈子里时会很快升温。",
      conflictStyle: "被忽视或被隐瞒时反应会很直接，不会慢慢猜。",
      appearance: {
        minAge: 19,
        firstStage: "college",
        contexts: ["海外朋友聚会", "展览和演出", "周末短途", "同城华人圈"],
        sceneHooks: {
          notice: "活动海报、展演门口和社交局里最显眼的那一点亮度",
          contact: "一起布置活动、散场后去吃夜宵",
          repeated: "被拉进同一群人以后越来越频繁的见面",
          bond: "她会很自然地把你卷进她的节奏，也很快看穿你在躲什么",
          special: "你开始分不清自己是喜欢热闹，还是喜欢热闹里总会出现的她",
          distance: "一旦发现自己不被坚定选择，她降温会很快",
          reunion: "很多年后在另一个城市的活动合作里再见"
        }
      },
      availability: {
        spansStages: ["college", "young_adult", "career"],
        reconnectAges: [24, 28],
        continuityBias: "intense"
      },
      romanceProfile: {
        arcType: "intense",
        futureFocus: "需要被坚定选择，也很在意关系是不是光明正大。",
        longTermPotential: 57,
        volatility: 80,
        fitTags: ["expression", "social", "passion"],
        theirInterestConditions: {
          minStats: { social: 30, happiness: 32 }
        },
        warmingConditions: {
          minStats: { social: 32 }
        },
        breakupConditions: {
          someFlags: ["overseas_double_track", "trust_break"],
          minStats: { stress: 50 }
        },
        canReconnect: true
      }
    })
  ];

  window.LIFE_RELATIONSHIP_ARCS = [
    ...(Array.isArray(window.LIFE_RELATIONSHIP_ARCS) ? window.LIFE_RELATIONSHIP_ARCS : []),
    arc({
      characterId: "lin_xiawan",
      arcId: "lin_xiawan_arc",
      title: "书页与迟到的心意线",
      summary: "从初中图书馆轮值到多年后书店重逢，强调很多小事积累出来的慢热关系。",
      historyLabels: {
        xiawan_library_notice: "图书馆轮值慢慢熟起来",
        xiawan_evening_chat: "晚自习后一起整理资料",
        xiawan_unsent_message: "毕业时没发出去的那条消息"
      }
    }),
    arc({
      characterId: "he_yucheng",
      arcId: "he_yucheng_arc",
      title: "球馆和顺路回家线",
      summary: "从朋友局和球馆熟起来，热烈、直接，也容易在成长节奏里拉扯。",
      historyLabels: {
        yucheng_weekend_court: "周末总在球馆碰见",
        yucheng_rain_walk: "雨天一起等车和回家",
        yucheng_direct_question: "他直白地问过你心里到底有没有人"
      }
    }),
    arc({
      characterId: "elias_wen",
      arcId: "elias_wen_arc",
      title: "项目室与真相线",
      summary: "海外项目合作里的慢慢靠近，最看重诚实，也最不能容忍被隐瞒。",
      historyLabels: {
        elias_project_night: "项目夜里一起收尾",
        elias_honest_talk: "关于旧关系的坦白",
        elias_exit_cleanly: "发现被隐瞒后抽身"
      }
    }),
    arc({
      characterId: "sofia_qi",
      arcId: "sofia_qi_arc",
      title: "热闹与选择线",
      summary: "海外新圈子里的热烈靠近，喜欢被坚定选择，不接受地下关系。",
      historyLabels: {
        sofia_afterparty: "活动散场后的夜聊",
        sofia_public_photo: "社交平台照片暴露",
        sofia_holiday_showdown: "回国前后的正面对峙"
      }
    })
  ];

  window.LIFE_RELATIONSHIP_STATES = {
    longDistance: ["long_distance_ambiguous", "cross_border_ambiguous", "long_distance_dating", "distance_cooling"],
    doubleTrack: ["triangle", "hidden_double_track", "exposed_double_track", "rebuilding_distance"]
  };

  const EARLY_RELATION_EVENTS = [
    event({
      id: "xiawan_library_rotation",
      stage: "adolescence",
      title: "图书馆轮值和校刊组，让一些关系不再只是“同学”",
      text: "很多青春期关系不是突然从天而降的，而是从一起搬书、借资料、做值日和收拾活动物料这些很小的重复里长出来的。你开始意识到，有些人会在日常里出现得越来越具体。",
      minAge: 13,
      maxAge: 15,
      weight: 7,
      tags: ["adolescence", "relationship"],
      conditions: condition({
        unknownRelationships: ["lin_xiawan"]
      }),
      choices: [
        choice({
          text: "一起把书架和校刊桌面收干净，顺手也多说了几句话。",
          relationshipEffects: [
            relationshipEffect({
              targetId: "lin_xiawan",
              affection: 12,
              familiarity: 18,
              trust: 8,
              playerInterest: 10,
              theirInterest: 8,
              interactions: 2,
              status: "familiar",
              addSharedHistory: ["xiawan_library_notice"],
              history: "你和林夏晚不是一下熟起来的，而是在图书馆和校刊组这种很普通的场景里慢慢靠近。"
            })
          ],
          addTags: ["relationship", "growth"],
          log: "有些关系的开头根本不戏剧化，只是你们从很多很普通的小事里慢慢记住了彼此。"
        }),
        choice({
          text: "表面照常做事，心里却开始有点在意她是不是也会注意到你。",
          relationshipEffects: [
            relationshipEffect({
              targetId: "lin_xiawan",
              affection: 10,
              familiarity: 12,
              trust: 6,
              ambiguity: 10,
              playerInterest: 12,
              interactions: 2,
              status: "crush",
              addSharedHistory: ["xiawan_library_notice"],
              history: "你并没有做什么太明显的事，只是开始偷偷留意，林夏晚会不会也把你放进眼里。"
            })
          ],
          addTags: ["relationship", "selfhood"]
        })
      ]
    }),
    event({
      id: "yucheng_weekend_court",
      stage: "adolescence",
      title: "周末球馆和朋友带来的新圈子，把人慢慢卷得更近",
      text: "青春期真正容易熟起来的关系，常常不在课桌正中间，而是在周末球馆、便利店门口和朋友带来的新圈子里。一次顺路、一次起哄、一次散场后还多待几分钟，就足够让人开始记住谁。",
      minAge: 13,
      maxAge: 16,
      weight: 7,
      tags: ["adolescence", "relationship"],
      conditions: condition({
        unknownRelationships: ["he_yucheng"]
      }),
      choices: [
        choice({
          text: "顺着朋友局和散场后的路，多让彼此出现在生活里一点。",
          relationshipEffects: [
            relationshipEffect({
              targetId: "he_yucheng",
              affection: 13,
              familiarity: 14,
              trust: 8,
              playerInterest: 8,
              theirInterest: 10,
              interactions: 2,
              status: "familiar",
              addSharedHistory: ["yucheng_weekend_court"],
              history: "你和何予澄熟起来的方式很具体：散场顺路、一起买水、朋友一句玩笑接一句玩笑。"
            })
          ],
          addTags: ["relationship", "social"]
        }),
        choice({
          text: "在热闹里先装作无所谓，其实已经会下意识找他的反应。",
          relationshipEffects: [
            relationshipEffect({
              targetId: "he_yucheng",
              affection: 11,
              familiarity: 10,
              ambiguity: 12,
              playerInterest: 12,
              theirInterest: 8,
              interactions: 1,
              status: "crush",
              addSharedHistory: ["yucheng_weekend_court"],
              history: "你嘴上没承认，可已经会在热闹里先去看何予澄是不是也在看你。"
            })
          ],
          addTags: ["relationship", "selfhood"]
        })
      ]
    }),
    event({
      id: "highschool_evening_chat",
      stage: "highschool",
      title: "晚自习后的那几分钟，往往比白天更容易把关系推过线",
      text: "真正让关系发生变化的，常常不是一句正式表白，而是晚自习后一起走一段路、留下来收尾、被同学误会关系特别好，然后谁都没有第一时间否认。",
      minAge: 15,
      maxAge: 18,
      weight: 8,
      tags: ["highschool", "relationship"],
      conditions: condition({
        anyRelationshipStatuses: ["familiar", "close", "mutual_crush", "crush", "ambiguous"]
      }),
      choices: [
        choice({
          text: "不急着说破，只把这种熟悉感再往前推一点。",
          effects: {
            age: 1,
            stats: { happiness: 2, social: 2 }
          },
          addRomanceFlags: ["adolescent_romance_deepening"],
          log: "你没有把关系一下推到最亮的地方，而是让很多细小互动自己把暧昧慢慢养大。"
        }),
        choice({
          text: "被起哄的时候没立刻否认，心里其实已经知道自己舍不得后退。",
          effects: {
            age: 1,
            stats: { happiness: 3, stress: 1 }
          },
          addRomanceFlags: ["ambiguity_normalized", "relationship_heat_school"],
          log: "你第一次意识到，自己不是单纯享受被在意，而是真的开始在意某一个具体的人了。"
        })
      ]
    })
  ];

  const OVERSEAS_RELATION_EVENTS = [
    event({
      id: "overseas_new_circle",
      stage: "college",
      title: "新朋友、新同学和新的暧昧对象，不会因为旧关系还在就自动缺席",
      text: "你在国外认识的人，往往和以前完全不同。新的语言环境、新的圈子和新的生活方式，会自然带来新的吸引力。\n\n国内仍然重要的人：{overseasDomesticSummary}",
      minAge: 19,
      maxAge: 26,
      weight: 9,
      tags: ["overseas", "relationship"],
      conditions: condition({
        requiredFlags: ["life_path_overseas"]
      }),
      choices: [
        choice({
          text: "和项目搭档越走越近，那种被认真接住的感觉很难忽略。",
          relationshipEffects: [
            relationshipEffect({
              targetId: "elias_wen",
              affection: 16,
              familiarity: 16,
              trust: 12,
              playerInterest: 10,
              theirInterest: 10,
              interactions: 2,
              status: "familiar",
              addSharedHistory: ["elias_project_night"],
              history: "你和 Elias 在项目收尾和深夜聊天里慢慢熟起来，他让你第一次感觉到在国外也有人能真的接住你。"
            })
          ],
          customAction: "register_overseas_connection",
          customPayload: {
            relationshipId: "elias_wen"
          },
          addTags: ["relationship", "overseas"]
        }),
        choice({
          text: "被一个热烈的新圈子拉进去，也开始频繁和她一起出现在热闹里。",
          relationshipEffects: [
            relationshipEffect({
              targetId: "sofia_qi",
              affection: 18,
              familiarity: 14,
              ambiguity: 12,
              playerInterest: 12,
              theirInterest: 10,
              interactions: 2,
              status: "ambiguous",
              addSharedHistory: ["sofia_afterparty"],
              history: "祁索菲把你卷进了她的节奏。很多热闹散场以后，你反而更容易记得她。"
            })
          ],
          customAction: "register_overseas_connection",
          customPayload: {
            relationshipId: "sofia_qi"
          },
          addTags: ["relationship", "social"]
        }),
        choice({
          text: "先把边界捏住，不想让新的心动把原本就难的关系拖得更乱。",
          effects: {
            age: 1,
            stats: { mental: 2, discipline: 2, stress: 1 }
          },
          log: "你看见了新的可能性，也看见了自己目前根本没有余力把两套关系一起撑住。"
        })
      ]
    }),
    event({
      id: "long_distance_call_frequency",
      stage: "college",
      title: "异国恋真正难的，往往不是爱不爱，而是时差、频率和解释成本",
      text: "联系频率、谁先找谁、什么时候回消息、节日和纪念日怎么过，都会开始变成具体问题。隔着时差以后，误会不会凭空少，只会更容易变大。",
      minAge: 19,
      maxAge: 28,
      weight: 8,
      tags: ["overseas", "relationship"],
      conditions: condition({
        anyRelationshipStatuses: ["long_distance_dating", "cross_border_ambiguous", "distance_cooling"]
      }),
      choices: [
        choice({
          text: "把固定通话和节日节点守住，哪怕麻烦，也尽量别让关系失重。",
          effects: {
            age: 1,
            stats: { happiness: 2, stress: 1, discipline: 1 }
          },
          relationshipEffects: [
            relationshipEffect({
              targetId: "$domestic_anchor",
              affection: 6,
              trust: 8,
              commitment: 10,
              continuity: 8,
              tension: -4,
              status: "long_distance_dating",
              addSharedHistory: ["distance_started"],
              history: "你们开始认真守住视频、节日和那些很琐碎却能让关系不至于失重的小仪式。"
            })
          ],
          log: "异国恋不是靠嘴上说坚持，而是靠很多很烦但必须做的小事把关系拴住。"
        }),
        choice({
          text: "联系开始稀下来，很多话都被留到“以后再说”。",
          effects: {
            age: 1,
            stats: { happiness: -2, stress: 2, mental: -1 }
          },
          relationshipEffects: [
            relationshipEffect({
              targetId: "$domestic_anchor",
              affection: -4,
              trust: -6,
              tension: 10,
              continuity: -4,
              status: "distance_cooling",
              history: "你们谁都没有正式说散，可联系频率和在场感都在一点点往下掉。"
            })
          ],
          addFlags: ["distance_cooling_phase"],
          log: "关系不是一下断的，而是在一次次“晚点再回”“改天再聊”里慢慢失温。"
        })
      ]
    }),
    event({
      id: "overseas_hidden_new_romance",
      stage: "college",
      title: "旧关系没有彻底结束时，新的心动更容易把人拖进双线拉扯",
      text: "国内的人还重要，国外的新关系又很具体，这种时候最难的往往不是选谁，而是你是不是还在用拖延替自己做决定。",
      minAge: 19,
      maxAge: 29,
      weight: 8,
      tags: ["overseas", "relationship", "affair"],
      conditions: condition({
        requiredFlags: ["life_path_overseas"],
        anyRelationshipStatuses: ["long_distance_dating", "cross_border_ambiguous", "distance_cooling"],
        someFlags: ["adolescent_romance_deepening", "relationship_heat_school"]
      }),
      choices: [
        choice({
          text: "把新关系按住，先去面对旧关系到底还要不要坚持。",
          effects: {
            age: 1,
            stats: { mental: 1, stress: 2 }
          },
          relationshipEffects: [
            relationshipEffect({
              targetId: "$domestic_anchor",
              trust: 2,
              commitment: 4,
              continuity: 3,
              history: "你没有让事情继续拖成双线，而是先回头面对那段原本就已经很难维系的关系。"
            })
          ],
          log: "你没有把选择权全丢给时间，而是先逼自己看清楚旧关系还有没有继续撑的意义。"
        }),
        choice({
          text: "还是让新的靠近发生了，嘴上却没准备好把旧的说清楚。",
          customAction: "activate_double_track",
          customPayload: {
            relationshipId: "elias_wen",
            domesticStatus: "triangle",
            overseasStatus: "hidden_double_track",
            exposureRisk: 20,
            domesticHistory: "你没有彻底放下国内那个人，却已经把另一段关系悄悄拉进了自己的生活。",
            overseasHistory: "Elias 明显感觉到你在靠近他，只是你没有把旧关系的真相一次说完。"
          },
          addFlags: ["trust_break"],
          addTags: ["pressure", "relationship"]
        }),
        choice({
          text: "热闹里那个人越来越近，你其实已经知道自己在把事情往更复杂的方向推。",
          customAction: "activate_double_track",
          customPayload: {
            relationshipId: "sofia_qi",
            domesticStatus: "triangle",
            overseasStatus: "hidden_double_track",
            exposureRisk: 24,
            domesticHistory: "你在国内和国外之间都没有彻底放手，于是感情开始从异国恋慢慢滑进双线拉扯。",
            overseasHistory: "祁索菲很快就能感觉到你心里不止一条线，可那份热度还是先发生了。"
          },
          addFlags: ["trust_break"],
          addTags: ["pressure", "relationship"]
        })
      ]
    })
  ];

  window.LIFE_AFFAIR_EVENTS = [
    event({
      id: "double_track_daily_pressure",
      stage: "college",
      title: "同时维持两条线以后，真正先垮的往往不是关系，而是你的日常",
      text: "不同聊天框、不同纪念日、不同解释版本，会先把你压得越来越紧。很多人不是因为不爱了才露馅，而是因为同时维持两边本来就很难不失手。",
      minAge: 20,
      maxAge: 30,
      weight: 9,
      tags: ["relationship", "affair", "pressure"],
      conditions: condition({
        requiredFlags: ["overseas_double_track"]
      }),
      choices: [
        choice({
          text: "继续瞒，想着只要再撑一阵就能自己处理好。",
          effects: {
            age: 1,
            stats: { stress: 6, mental: -3, happiness: -3, social: -1 }
          },
          relationshipEffects: [
            relationshipEffect({
              targetId: "$domestic_anchor",
              trust: -8,
              tension: 10,
              status: "hidden_double_track",
              history: "你开始越来越习惯删记录、改说法和晚回消息，这段关系的重量被你亲手拖向了更危险的位置。"
            }),
            relationshipEffect({
              targetId: "$overseas_flame",
              trust: -6,
              tension: 8,
              status: "hidden_double_track",
              history: "你没法真正让另一边安心，因为你始终没有把事情放在亮处。"
            })
          ],
          log: "同时维持两个人的代价先落在了你自己身上：紧张、内疚和反复圆谎。"
        }),
        choice({
          text: "主动把话说开，哪怕知道一定会有人受伤。",
          effects: {
            age: 1,
            stats: { mental: 1, stress: 4, social: -2 }
          },
          customAction: "resolve_double_track",
          customPayload: {
            domesticStatus: "conflict",
            overseasStatus: "conflict",
            domesticHistory: "你终于把真相讲了出来，这段关系没有立刻结束，但已经被推到了必须正面冲突的位置。",
            overseasHistory: "坦白之后，热烈不再能替你遮住问题，真正的信任考题才刚开始。"
          },
          addTags: ["courage", "pressure"],
          log: "你没有继续把决定权丢给拖延，而是亲手把最难的一次对话推到了台面上。"
        }),
        choice({
          text: "先结束其中一段，不再让事情继续烂下去。",
          effects: {
            age: 1,
            stats: { mental: 2, happiness: -1, stress: 2 }
          },
          customAction: "resolve_double_track",
          customPayload: {
            domesticStatus: "breakup",
            overseasStatus: "dating",
            domesticHistory: "你亲手结束了国内那条线，不是因为不痛，而是因为你知道再拖只会更烂。",
            overseasHistory: "你终于把另一边放回了光里，但关系也因此背上了很重的前史。",
            clearFlag: true
          },
          log: "有些选择不是更幸福，只是终于比继续拖着更诚实。"
        })
      ]
    })
  ];

  window.LIFE_EXPOSURE_EVENTS = [
    event({
      id: "double_track_exposure",
      stage: "young_adult",
      title: "聊天记录、照片和朋友视角，最终还是让真相自己长出来了",
      text: "社交平台的合照、朋友的一句提醒、聊天记录里的时间线，或者回国时不小心露出的细节，都可能让原本想藏住的双线关系被一起拎到台面上。被发现以后，事情不会再按照你一个人的节奏走。",
      minAge: 20,
      maxAge: 32,
      weight: 10,
      tags: ["relationship", "affair", "exposure"],
      conditions: condition({
        requiredFlags: ["overseas_double_track"]
      }),
      effectsOnEnter: mutation({
        log: "你原本以为自己还能再拖一阵，结果真相还是先一步自己露了出来。"
      }),
      choices: [
        choice({
          text: "被撞破以后先想补救，试图把最难看的部分解释过去。",
          effects: {
            age: 1,
            stats: { social: -5, happiness: -4, stress: 7, mental: -2 }
          },
          customAction: "resolve_double_track",
          customPayload: {
            domesticStatus: "exposed_double_track",
            overseasStatus: "exposed_double_track",
            domesticHistory: "对方不是完全不知道，只是直到这一刻才被迫直视你到底做到了什么程度。",
            overseasHistory: "照片和时间线一旦摆到明面上，很多解释都会显得太迟。"
          },
          addFlags: ["reputation_hit", "trust_break"],
          log: "事情一旦曝光，受损的不只是两段关系，还有别人看你的方式，和你看自己的方式。"
        }),
        choice({
          text: "不再圆谎，把该结束的结束，把该道歉的道歉。",
          effects: {
            age: 1,
            stats: { social: -3, mental: 1, stress: 4, happiness: -2 }
          },
          customAction: "resolve_double_track",
          customPayload: {
            domesticStatus: "broken",
            overseasStatus: "distance_cooling",
            domesticHistory: "这段关系最终还是被你亲手毁掉了，很多年后回想起来，最刺人的并不是吵架，而是自己当时明知不对还往前拖。",
            overseasHistory: "你把事情说清之后，这边没有立刻走散，但热度和信任都已经不可能回到原来的位置。"
          },
          addFlags: ["reputation_hit"],
          log: "你没有继续维护体面，而是把最难堪的责任先扛到了自己身上。"
        })
      ]
    }),
    event({
      id: "sofia_or_elias_reaction",
      stage: "young_adult",
      title: "不同的人，在知道自己不是唯一那一个以后，反应并不会一样",
      text: "有人会冷下来，有人会当场对峙，有人会先退后一步再也不给机会。真正难受的不只是失去谁，而是你会在他们完全不同的反应里，看见自己到底伤到了什么。",
      minAge: 20,
      maxAge: 32,
      weight: 8,
      tags: ["relationship", "exposure"],
      conditions: condition({
        anyRelationshipStatuses: ["exposed_double_track"]
      }),
      choices: [
        choice({
          text: "面对 Elias 的冷静抽离，你第一次知道“失望”可以安静得这么重。",
          conditions: {
            relationshipStatuses: {
              elias_wen: ["exposed_double_track", "hidden_double_track", "triangle"]
            }
          },
          relationshipEffects: [
            relationshipEffect({
              targetId: "elias_wen",
              trust: -14,
              tension: 10,
              status: "broken",
              history: "Elias 没有和你大吵，只是把边界拉得很干净。那种冷静的退出，反而更让人难受。"
            })
          ],
          addFlags: ["trust_break"],
          log: "不是所有伤害都会用很大的声音表达，有些人只是转身得特别彻底。"
        }),
        choice({
          text: "面对祁索菲的正面对峙，你终于被迫回答自己到底想让谁留在生活里。",
          conditions: {
            relationshipStatuses: {
              sofia_qi: ["exposed_double_track", "hidden_double_track", "triangle"]
            }
          },
          relationshipEffects: [
            relationshipEffect({
              targetId: "sofia_qi",
              trust: -10,
              tension: 14,
              status: "conflict",
              history: "祁索菲没有替你找台阶，她只是逼你把那些一直想拖过去的话在光下说完。"
            })
          ],
          addFlags: ["trust_break"],
          log: "热烈的人在受伤时也会很直接。她的愤怒让你第一次没法再躲在含糊后面。"
        })
      ]
    })
  ];

  window.LIFE_EXTRA_EVENTS = [
    ...(Array.isArray(window.LIFE_EXTRA_EVENTS) ? window.LIFE_EXTRA_EVENTS : []),
    ...EARLY_RELATION_EVENTS,
    ...OVERSEAS_RELATION_EVENTS,
    ...window.LIFE_AFFAIR_EVENTS,
    ...window.LIFE_EXPOSURE_EVENTS
  ];
})();

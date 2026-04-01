(function () {
  "use strict";

  /*
    恋爱对象手动编辑说明：
    - `appearance.minAge`：人物最早从几岁开始出现。
    - `appearance.contexts`：更容易通过哪些场景认识或熟悉。
    - `romanceProfile.theirInterestConditions`：对方更容易先对玩家产生好感的条件。
    - `romanceProfile.warmingConditions`：关系升温更容易发生的条件。
    - `romanceProfile.breakupConditions`：进入冷淡 / 分手危机的条件。
    - `romanceProfile.canReconnect`：这条线后续是否允许重逢或复合。
    - `availability.spansStages`：人物会贯穿哪些人生阶段。
  */

  function toList(value) {
    return Array.isArray(value) ? value.slice() : [];
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

  window.LIFE_RELATIONSHIPS = [
    relationship({
      id: "song_qinghe",
      name: "宋清禾",
      gender: "female",
      identity: "初中同班，字好看，写东西很细，常被老师点名念作文。",
      stageTags: ["adolescence", "highschool", "college", "young_adult", "family"],
      roleTags: ["班级干部", "语文强项"],
      traitTags: ["安静", "细腻", "观察力强"],
      contactStyle: "更容易在共同值日、传纸条和慢慢熟起来的聊天里靠近。",
      conflictStyle: "不喜欢被公开起哄，受伤时会先退回自己的角落。",
      appearance: {
        minAge: 13,
        firstStage: "adolescence",
        contexts: ["同班", "共同值日", "作文比赛", "晚自习后顺路"],
        introductionText: "她并不总在最热闹的地方，但很多人提起她时，都会想到那种安静、认真、让人不自觉想多看一眼的气质。",
        rumorText: "班里有人拿你们一起被老师夸这件事开玩笑，原本隐蔽的那点注意力忽然变得不太好藏。"
      },
      availability: {
        spansStages: ["adolescence", "highschool", "college", "young_adult", "family"],
        reconnectAges: [18, 23, 29],
        continuityBias: "steady"
      },
      romanceProfile: {
        arcType: "stable",
        futureFocus: "重视稳定、安全感和长期信任。",
        longTermPotential: 90,
        volatility: 25,
        fitTags: ["growth", "stability", "literature"],
        theirInterestConditions: {
          minStats: { mental: 45, social: 20 },
          excludedFlags: ["trust_break"]
        },
        warmingConditions: {
          minStats: { happiness: 35 },
          excludedFlags: ["career_first"]
        },
        breakupConditions: {
          someFlags: ["trust_break", "emotionally_guarded"],
          minStats: { stress: 55 }
        },
        canReconnect: true,
        reconnectConditions: {
          minStats: { mental: 40 }
        }
      }
    }),
    relationship({
      id: "jiang_xun",
      name: "江循",
      gender: "male",
      identity: "初中篮球队常客，课间总在人群边缘笑着接话。",
      stageTags: ["adolescence", "highschool", "young_adult", "career"],
      roleTags: ["校队", "人缘好"],
      traitTags: ["外向", "直接", "有行动力"],
      contactStyle: "会被自然的陪伴、一起去做事和不拧巴的回应打动。",
      conflictStyle: "不爱猜来猜去，关系不对劲时希望尽快说开。",
      appearance: {
        minAge: 13,
        firstStage: "adolescence",
        contexts: ["篮球场", "班级活动", "放学结伴", "朋友起哄"],
        introductionText: "他很容易被注意到，不只是因为热闹，而是因为他总有办法让自己和别人都显得不那么拘谨。",
        rumorText: "你们只是多说了几句话，周围的人却已经开始拿眼神和笑声替你们编故事。"
      },
      availability: {
        spansStages: ["adolescence", "highschool", "young_adult", "career"],
        reconnectAges: [18, 24, 30],
        continuityBias: "intense"
      },
      romanceProfile: {
        arcType: "intense",
        futureFocus: "更看重当下回应和并肩出现。",
        longTermPotential: 58,
        volatility: 72,
        fitTags: ["social", "passion", "action"],
        theirInterestConditions: {
          minStats: { social: 28, happiness: 30 }
        },
        warmingConditions: {
          minStats: { social: 25 },
          excludedFlags: ["emotionally_guarded"]
        },
        breakupConditions: {
          minStats: { stress: 50 },
          someFlags: ["career_first", "solo_pattern"]
        },
        canReconnect: true,
        reconnectConditions: {
          minStats: { social: 30 }
        }
      }
    }),
    relationship({
      id: "fang_ke",
      name: "方可",
      gender: "female",
      identity: "初中同桌型人物，理科不错，嘴上不算软，却会记得很多细节。",
      stageTags: ["adolescence", "highschool", "college", "young_adult", "family"],
      roleTags: ["同桌", "理科好"],
      traitTags: ["嘴硬", "聪明", "慢热"],
      contactStyle: "更容易在并肩写作业、互相帮忙和长期默契里升温。",
      conflictStyle: "表面像没事，其实会把失望记很久。",
      appearance: {
        minAge: 13,
        firstStage: "adolescence",
        contexts: ["同桌", "补课", "作业互帮", "竞赛备考"],
        introductionText: "你们的关系不是一眼就热起来的那种，更像是很多普通日子一层层叠起来，最后才发现已经很熟。",
        rumorText: "因为你们总被排在一起、总一起做题，连老师都开始默认你们会互相照应。"
      },
      availability: {
        spansStages: ["adolescence", "highschool", "college", "young_adult", "family"],
        reconnectAges: [18, 22, 28],
        continuityBias: "steady"
      },
      romanceProfile: {
        arcType: "slowburn",
        futureFocus: "更适合从长期陪伴发展成稳定关系。",
        longTermPotential: 87,
        volatility: 32,
        fitTags: ["study", "stability", "mutual_support"],
        theirInterestConditions: {
          minStats: { intelligence: 26, discipline: 18 }
        },
        warmingConditions: {
          minStats: { intelligence: 24, discipline: 15 }
        },
        breakupConditions: {
          someFlags: ["trust_break", "career_first"],
          minStats: { stress: 58 }
        },
        canReconnect: true,
        reconnectConditions: {
          minStats: { intelligence: 35 }
        }
      }
    }),
    relationship({
      id: "chen_yan",
      name: "陈砚",
      gender: "male",
      identity: "初中广播站成员，讲话不快，常带一点和同龄人不太一样的稳。",
      stageTags: ["adolescence", "highschool", "college", "young_adult"],
      roleTags: ["广播站", "声音好听"],
      traitTags: ["克制", "可靠", "有点距离感"],
      contactStyle: "会对愿意认真交流、也能尊重边界的人慢慢卸下防备。",
      conflictStyle: "不爱吵架，一旦冷下来就会明显拉远距离。",
      appearance: {
        minAge: 13,
        firstStage: "adolescence",
        contexts: ["广播站", "图书角", "演讲比赛", "朋友介绍"],
        introductionText: "他身上有种和同龄人不太一样的稳，像是很多话都会先在心里放一会儿，再决定要不要说出来。",
        rumorText: "你们并没有做什么太明显的事，可正因为总能在安静处碰上，别人反而更容易多想。"
      },
      availability: {
        spansStages: ["adolescence", "highschool", "college", "young_adult"],
        reconnectAges: [18, 24],
        continuityBias: "regret"
      },
      romanceProfile: {
        arcType: "regret",
        futureFocus: "在意边界和情绪成熟度，不轻易给承诺。",
        longTermPotential: 70,
        volatility: 48,
        fitTags: ["calm", "depth", "respect"],
        theirInterestConditions: {
          minStats: { mental: 42, intelligence: 24 }
        },
        warmingConditions: {
          minStats: { mental: 40 },
          excludedFlags: ["emotionally_guarded"]
        },
        breakupConditions: {
          someFlags: ["trust_break", "solo_pattern"],
          minStats: { stress: 52 }
        },
        canReconnect: true,
        reconnectConditions: {
          minStats: { mental: 48 }
        }
      }
    }),
    relationship({
      id: "luo_mingxi",
      name: "罗明汐",
      gender: "female",
      identity: "初中社团和学生会都很活跃，外表大方，实际上对在意的人很护短。",
      stageTags: ["adolescence", "highschool", "college", "young_adult"],
      roleTags: ["社团活跃", "主持人"],
      traitTags: ["亮眼", "护短", "情绪感染力强"],
      contactStyle: "容易在社团配合、排练和一起扛事的时候迅速熟起来。",
      conflictStyle: "热情来得快，失望时也会很直接地降温。",
      appearance: {
        minAge: 14,
        firstStage: "adolescence",
        contexts: ["社团", "主持排练", "班级活动", "朋友介绍"],
        introductionText: "她像那种会把普通校园生活撑得更热闹的人，靠近她时，你也会更容易被一起卷进某种亮度里。",
        rumorText: "因为你们总一起出现在活动准备里，大家已经开始半认真半玩笑地把你们凑成一对。"
      },
      availability: {
        spansStages: ["adolescence", "highschool", "college", "young_adult"],
        reconnectAges: [18, 23, 27],
        continuityBias: "intense"
      },
      romanceProfile: {
        arcType: "intense",
        futureFocus: "需要情绪回应，也很在意自己是不是被坚定选择。",
        longTermPotential: 54,
        volatility: 76,
        fitTags: ["expression", "social", "passion"],
        theirInterestConditions: {
          minStats: { social: 30, happiness: 35 }
        },
        warmingConditions: {
          minStats: { social: 30 }
        },
        breakupConditions: {
          minStats: { stress: 48 },
          someFlags: ["career_first", "emotionally_guarded"]
        },
        canReconnect: true,
        reconnectConditions: {
          minStats: { happiness: 38 }
        }
      }
    }),
    relationship({
      id: "tan_yu",
      name: "谭予",
      gender: "male",
      identity: "初中补课班认识的人，家里管得严，成绩很稳，但偶尔会露出一点少年气的莽撞。",
      stageTags: ["adolescence", "highschool", "college", "career"],
      roleTags: ["补课班", "成绩稳定"],
      traitTags: ["压抑", "认真", "偶尔冲动"],
      contactStyle: "更容易在补课、竞赛、分享秘密和一起对抗压力时熟起来。",
      conflictStyle: "习惯先扛住，真的扛不动时会突然一下子崩开。",
      appearance: {
        minAge: 14,
        firstStage: "adolescence",
        contexts: ["补课班", "竞赛训练", "家长比较", "雨天一起等车"],
        introductionText: "他不像那种会主动把情绪摆出来的人，但越相处，越能看到他在懂事和想挣脱之间反复拉扯。",
        rumorText: "补课结束后你们总是一起走一小段路，这种太固定的同行很难不被人注意。"
      },
      availability: {
        spansStages: ["adolescence", "highschool", "college", "career"],
        reconnectAges: [18, 24, 31],
        continuityBias: "reunion"
      },
      romanceProfile: {
        arcType: "reunion",
        futureFocus: "受家庭和前途影响很深，容易出现错过与重逢。",
        longTermPotential: 73,
        volatility: 57,
        fitTags: ["study", "pressure", "growth"],
        theirInterestConditions: {
          minStats: { intelligence: 28, mental: 38 }
        },
        warmingConditions: {
          minStats: { intelligence: 26 }
        },
        breakupConditions: {
          minStats: { stress: 60 },
          someFlags: ["career_first", "solo_pattern"]
        },
        canReconnect: true,
        reconnectConditions: {
          minStats: { career: 18, mental: 45 }
        }
      }
    }),
    relationship({
      id: "he_yuan",
      name: "何沅",
      gender: "female",
      identity: "高中转进来的同学，成绩稳定，说话有分寸，身上总带点清醒感。",
      stageTags: ["highschool", "college", "young_adult", "career"],
      roleTags: ["转学生", "竞赛班"],
      traitTags: ["冷静", "上进", "不失礼貌"],
      contactStyle: "欣赏能跟上节奏、又不会咄咄逼人的靠近方式。",
      conflictStyle: "遇到问题会先分析，再决定值不值得继续投入。",
      appearance: {
        minAge: 16,
        firstStage: "highschool",
        contexts: ["转学", "竞赛班", "晚自习", "志愿填报交流"],
        introductionText: "她像把自己的节奏收得很稳的人，刚靠近时会觉得有点距离，可越熟越会发现她的认真并不是冷淡。",
        rumorText: "新同学本来就容易被关注，而你恰好成了她最先熟起来的人之一。"
      },
      availability: {
        spansStages: ["highschool", "college", "young_adult", "career"],
        reconnectAges: [19, 24, 30],
        continuityBias: "steady"
      },
      romanceProfile: {
        arcType: "stable",
        futureFocus: "高度在意前途规划、边界和是否值得长期投入。",
        longTermPotential: 84,
        volatility: 34,
        fitTags: ["ambition", "discipline", "clarity"],
        theirInterestConditions: {
          minStats: { intelligence: 34, discipline: 22 }
        },
        warmingConditions: {
          minStats: { intelligence: 30, discipline: 20 }
        },
        breakupConditions: {
          minStats: { stress: 56 },
          someFlags: ["trust_break", "career_first"]
        },
        canReconnect: true,
        reconnectConditions: {
          minStats: { career: 20, intelligence: 38 }
        }
      }
    }),
    relationship({
      id: "pei_chuan",
      name: "裴川",
      gender: "male",
      identity: "高中里很容易被看见的人，擅长运动，也很会在大家紧张时活跃气氛。",
      stageTags: ["highschool", "college", "young_adult"],
      roleTags: ["体育特长", "气氛担当"],
      traitTags: ["热烈", "讲义气", "情绪来得快"],
      contactStyle: "喜欢有回应、愿意并肩出现的人，不太耐得住长期模糊。",
      conflictStyle: "当下就会表达不满，但转头也愿意和解。",
      appearance: {
        minAge: 16,
        firstStage: "highschool",
        contexts: ["运动会", "社团联谊", "课间打闹", "朋友局"],
        introductionText: "他是那种会把很多场合一下带热的人，很容易让人把注意力落过去，也很容易让关系进展得比想象更快。",
        rumorText: "你们明明只是一起出现过几次，可这种高存在感的人一旦靠近，误会总会跑得比解释快。"
      },
      availability: {
        spansStages: ["highschool", "college", "young_adult"],
        reconnectAges: [19, 23, 27],
        continuityBias: "intense"
      },
      romanceProfile: {
        arcType: "intense",
        futureFocus: "重视当下热度和被选择感，长期模糊最伤。",
        longTermPotential: 52,
        volatility: 78,
        fitTags: ["social", "sports", "passion"],
        theirInterestConditions: {
          minStats: { social: 32 }
        },
        warmingConditions: {
          minStats: { happiness: 36, social: 28 }
        },
        breakupConditions: {
          minStats: { stress: 50 },
          someFlags: ["solo_pattern", "career_first"]
        },
        canReconnect: true,
        reconnectConditions: {
          minStats: { social: 32 }
        }
      }
    }),
    relationship({
      id: "qiao_ning",
      name: "乔宁",
      gender: "female",
      identity: "高中社团核心成员，审美敏锐，也很会在细节里照顾别人。",
      stageTags: ["highschool", "college", "young_adult", "family"],
      roleTags: ["社团骨干", "审美在线"],
      traitTags: ["松弛", "有主见", "会照顾气氛"],
      contactStyle: "更相信日常感和舒服相处，不喜欢被过度用力地追赶。",
      conflictStyle: "不会立刻翻脸，但会悄悄收回热情。",
      appearance: {
        minAge: 16,
        firstStage: "highschool",
        contexts: ["社团", "校刊", "展板设计", "放学后买东西"],
        introductionText: "她让很多细节都显得很有分寸，和她熟起来时，很难分清那种舒服究竟只是投缘，还是已经开始有别的意味。",
        rumorText: "你们的互动并不轰烈，但正因为总显得很自然，周围人反而更像在悄悄观察。"
      },
      availability: {
        spansStages: ["highschool", "college", "young_adult", "family"],
        reconnectAges: [19, 24, 29],
        continuityBias: "stable"
      },
      romanceProfile: {
        arcType: "stable",
        futureFocus: "重视舒服相处和长期生活感。",
        longTermPotential: 86,
        volatility: 30,
        fitTags: ["life", "aesthetic", "stability"],
        theirInterestConditions: {
          minStats: { happiness: 32, social: 24 }
        },
        warmingConditions: {
          minStats: { happiness: 34 }
        },
        breakupConditions: {
          minStats: { stress: 56 },
          someFlags: ["emotionally_guarded", "career_first"]
        },
        canReconnect: true,
        reconnectConditions: {
          minStats: { happiness: 40, health: 40 }
        }
      }
    }),
    relationship({
      id: "gu_lin",
      name: "顾临",
      gender: "male",
      identity: "高中自习室常驻人物，目标感重，做题和安排都很硬。",
      stageTags: ["highschool", "college", "young_adult", "career"],
      roleTags: ["年级前列", "自习室常驻"],
      traitTags: ["自律", "理性", "野心强"],
      contactStyle: "容易在共同目标和长期并肩里建立好感。",
      conflictStyle: "会把很多关系问题也当成需要解决的任务。",
      appearance: {
        minAge: 16,
        firstStage: "highschool",
        contexts: ["自习室", "竞赛班", "班级前排", "志愿填报"],
        introductionText: "他几乎总在往前冲，和他接近时，吸引人的一部分恰好也是压力本身。",
        rumorText: "你们一起讨论题目和未来次数多了，连旁人都开始默认你们之间有某种特殊默契。"
      },
      availability: {
        spansStages: ["highschool", "college", "young_adult", "career"],
        reconnectAges: [19, 25, 32],
        continuityBias: "ambition"
      },
      romanceProfile: {
        arcType: "reunion",
        futureFocus: "目标和效率优先，适合并肩成长，也容易因路线不同走散。",
        longTermPotential: 74,
        volatility: 44,
        fitTags: ["ambition", "discipline", "career"],
        theirInterestConditions: {
          minStats: { intelligence: 35, discipline: 26 }
        },
        warmingConditions: {
          minStats: { intelligence: 32, discipline: 22 }
        },
        breakupConditions: {
          minStats: { stress: 58 },
          someFlags: ["career_first", "solo_pattern"]
        },
        canReconnect: true,
        reconnectConditions: {
          minStats: { career: 22, discipline: 28 }
        }
      }
    }),
    relationship({
      id: "wen_shuo",
      name: "闻朔",
      gender: "male",
      identity: "高中辩论社骨干，讲话锋利，反应快，私下反而有点怕被真正看透。",
      stageTags: ["highschool", "college", "young_adult"],
      roleTags: ["辩论社", "观点强"],
      traitTags: ["锋利", "机敏", "防备心重"],
      contactStyle: "容易在争论、合作和互相接招里快速靠近。",
      conflictStyle: "吵起来会很会说，但情绪真正受伤时反而沉默。",
      appearance: {
        minAge: 17,
        firstStage: "highschool",
        contexts: ["辩论赛", "演讲", "社团合作", "朋友转介绍"],
        introductionText: "他让人第一反应是难接近，可只要你真的接住他的节奏，就会发现这种锋利背后也藏着想被理解的部分。",
        rumorText: "你们总在公开场合针锋相对，私下却好像比别人更懂彼此，这种反差很容易惹来猜测。"
      },
      availability: {
        spansStages: ["highschool", "college", "young_adult"],
        reconnectAges: [20, 25],
        continuityBias: "regret"
      },
      romanceProfile: {
        arcType: "regret",
        futureFocus: "需要精神契合，但也容易因为防备心太强错过。",
        longTermPotential: 66,
        volatility: 60,
        fitTags: ["intelligence", "expression", "tension"],
        theirInterestConditions: {
          minStats: { intelligence: 32, social: 24 }
        },
        warmingConditions: {
          minStats: { intelligence: 30, mental: 38 }
        },
        breakupConditions: {
          minStats: { stress: 54 },
          someFlags: ["trust_break", "emotionally_guarded"]
        },
        canReconnect: true,
        reconnectConditions: {
          minStats: { mental: 46, intelligence: 36 }
        }
      }
    }),
    relationship({
      id: "an_xia",
      name: "安夏",
      gender: "female",
      identity: "高中美术方向的同学，家境不错，直觉很准，对关系里的真假特别敏感。",
      stageTags: ["highschool", "college", "young_adult", "family"],
      roleTags: ["艺术生", "直觉强"],
      traitTags: ["敏锐", "浪漫", "边界感强"],
      contactStyle: "喜欢在日常陪伴和共同审美里慢慢建立黏性。",
      conflictStyle: "不吃敷衍，一旦觉得被轻慢，会先把心收回去。",
      appearance: {
        minAge: 17,
        firstStage: "highschool",
        contexts: ["画室", "社团展览", "音乐节", "朋友介绍"],
        introductionText: "她看人很准，所以被她多看一眼会让人觉得受宠；但也正因为太敏锐，关系里很多勉强都骗不过她。",
        rumorText: "你们在公开场合并不总是粘在一起，可她对你有点不同这件事，还是慢慢被人看出来了。"
      },
      availability: {
        spansStages: ["highschool", "college", "young_adult", "family"],
        reconnectAges: [19, 24, 28],
        continuityBias: "stable"
      },
      romanceProfile: {
        arcType: "stable",
        futureFocus: "既要浪漫，也要真诚和被尊重。",
        longTermPotential: 82,
        volatility: 38,
        fitTags: ["art", "emotion", "honesty"],
        theirInterestConditions: {
          minStats: { happiness: 34, mental: 42 }
        },
        warmingConditions: {
          minStats: { happiness: 36, social: 22 }
        },
        breakupConditions: {
          minStats: { stress: 55 },
          someFlags: ["trust_break", "career_first"]
        },
        canReconnect: true,
        reconnectConditions: {
          minStats: { mental: 44, happiness: 42 }
        }
      }
    }),
    relationship({
      id: "lin_yue",
      name: "林月",
      gender: "female",
      identity: "擅长倾听、喜欢文字的人，常出现在图书馆和安静角落。",
      stageTags: ["college", "young_adult", "family"],
      roleTags: ["文学社", "图书馆常驻"],
      traitTags: ["细腻", "稳定", "表达欲低但很真诚"],
      contactStyle: "更愿意通过长谈、共享日常和细节记忆建立亲近感。",
      conflictStyle: "受伤时会先安静下来，如果你愿意认真解释，她也愿意慢慢说开。",
      appearance: {
        minAge: 18,
        firstStage: "college",
        contexts: ["图书馆", "文学社", "夜聊", "互相分享日常"]
      },
      availability: {
        spansStages: ["college", "young_adult", "family"],
        reconnectAges: [24, 30],
        continuityBias: "stable"
      },
      romanceProfile: {
        arcType: "stable",
        futureFocus: "适合长期、平稳、可一起生活的关系。",
        longTermPotential: 88,
        volatility: 24,
        fitTags: ["stability", "depth", "daily_life"],
        theirInterestConditions: {
          minStats: { mental: 42 }
        },
        warmingConditions: {
          minStats: { happiness: 36, mental: 40 }
        },
        breakupConditions: {
          minStats: { stress: 58 },
          someFlags: ["trust_break"]
        },
        canReconnect: true,
        reconnectConditions: {
          minStats: { mental: 45 }
        }
      }
    }),
    relationship({
      id: "su_wan",
      name: "苏晚",
      gender: "female",
      identity: "外表松弛，审美在线，很会把普通日子过出一点自己的节奏。",
      stageTags: ["college", "young_adult", "family"],
      roleTags: ["策展社", "生活玩家"],
      traitTags: ["会生活", "有主见", "慢热但不冷"],
      contactStyle: "喜欢自然相处和一点点建立默契，不太吃刻意表演出来的热情。",
      conflictStyle: "不喜欢情绪失控的拉扯，更愿意在冷静下来之后把边界和感受讲明白。",
      appearance: {
        minAge: 18,
        firstStage: "college",
        contexts: ["展览", "城市漫游", "探店", "社团活动"]
      },
      availability: {
        spansStages: ["college", "young_adult", "family"],
        reconnectAges: [24, 29],
        continuityBias: "stable"
      },
      romanceProfile: {
        arcType: "stable",
        futureFocus: "舒服、自然、可持续。",
        longTermPotential: 86,
        volatility: 30,
        fitTags: ["daily_life", "aesthetic", "stability"],
        theirInterestConditions: {
          minStats: { happiness: 34 }
        },
        warmingConditions: {
          minStats: { happiness: 36, health: 32 }
        },
        breakupConditions: {
          minStats: { stress: 56 },
          someFlags: ["emotionally_guarded"]
        },
        canReconnect: true,
        reconnectConditions: {
          minStats: { happiness: 40 }
        }
      }
    }),
    relationship({
      id: "xu_tang",
      name: "许棠",
      gender: "female",
      identity: "聪明敏感，反应很快，讲话有分寸，也有一点不容易被看透。",
      stageTags: ["college", "young_adult"],
      roleTags: ["专业前排", "辩论队"],
      traitTags: ["聪明", "克制", "有点距离感"],
      contactStyle: "欣赏能接住情绪又不冒犯边界的人，真正熟起来以后会很真诚。",
      conflictStyle: "表面不会立刻翻脸，但如果失望累积太久，会直接把门关上。",
      appearance: {
        minAge: 18,
        firstStage: "college",
        contexts: ["专业课", "辩论队", "深夜聊天", "共同项目"]
      },
      availability: {
        spansStages: ["college", "young_adult"],
        reconnectAges: [24],
        continuityBias: "regret"
      },
      romanceProfile: {
        arcType: "regret",
        futureFocus: "重视边界、精神连接和成熟表达。",
        longTermPotential: 72,
        volatility: 52,
        fitTags: ["intelligence", "respect", "depth"],
        theirInterestConditions: {
          minStats: { intelligence: 36, mental: 40 }
        },
        warmingConditions: {
          minStats: { intelligence: 34, mental: 38 }
        },
        breakupConditions: {
          minStats: { stress: 54 },
          someFlags: ["trust_break"]
        },
        canReconnect: true,
        reconnectConditions: {
          minStats: { intelligence: 38, mental: 44 }
        }
      }
    }),
    relationship({
      id: "shen_zhi",
      name: "沈枝",
      gender: "female",
      identity: "很有生命力，喜欢热闹和体验，做事带一点冲劲，也很护短。",
      stageTags: ["college", "young_adult"],
      roleTags: ["活动组织者", "社交核心"],
      traitTags: ["直接", "热烈", "有感染力"],
      contactStyle: "更相信一起经历事情带来的靠近，会被坦率和行动力打动。",
      conflictStyle: "不喜欢拐弯抹角，情绪到了会直接说，但说开后也愿意翻篇。",
      appearance: {
        minAge: 18,
        firstStage: "college",
        contexts: ["活动筹备", "旅行", "聚会", "社团合作"]
      },
      availability: {
        spansStages: ["college", "young_adult"],
        reconnectAges: [23, 27],
        continuityBias: "intense"
      },
      romanceProfile: {
        arcType: "intense",
        futureFocus: "高强度、强反馈，也容易因为节奏失衡受伤。",
        longTermPotential: 56,
        volatility: 74,
        fitTags: ["passion", "action", "social"],
        theirInterestConditions: {
          minStats: { social: 30, happiness: 35 }
        },
        warmingConditions: {
          minStats: { social: 30 }
        },
        breakupConditions: {
          minStats: { stress: 50 },
          someFlags: ["solo_pattern", "career_first"]
        },
        canReconnect: true,
        reconnectConditions: {
          minStats: { happiness: 38 }
        }
      }
    }),
    relationship({
      id: "zhou_yi",
      name: "周屿",
      gender: "male",
      identity: "目标感很强，做事利落，总把前途和效率看得很清楚。",
      stageTags: ["college", "young_adult", "career"],
      roleTags: ["学生项目负责人", "实习达人"],
      traitTags: ["上进", "理性", "对自己要求高"],
      contactStyle: "欣赏清晰、可靠和有执行力的人，会在并肩做事时更快产生好感。",
      conflictStyle: "遇到分歧时会直指问题，但也容易把关系处理得太像项目。",
      appearance: {
        minAge: 18,
        firstStage: "college",
        contexts: ["项目合作", "实习", "创业比赛", "求职"]
      },
      availability: {
        spansStages: ["college", "young_adult", "career"],
        reconnectAges: [24, 30],
        continuityBias: "ambition"
      },
      romanceProfile: {
        arcType: "reunion",
        futureFocus: "非常吃同步成长，也非常容易因路线分化走散。",
        longTermPotential: 76,
        volatility: 46,
        fitTags: ["career", "ambition", "clarity"],
        theirInterestConditions: {
          minStats: { intelligence: 34, career: 6 }
        },
        warmingConditions: {
          minStats: { intelligence: 32, discipline: 20 }
        },
        breakupConditions: {
          minStats: { stress: 58 },
          someFlags: ["career_first", "solo_pattern"]
        },
        canReconnect: true,
        reconnectConditions: {
          minStats: { career: 24, intelligence: 38 }
        }
      }
    }),
    relationship({
      id: "cheng_nan",
      name: "程楠",
      gender: "male",
      identity: "存在感很强，热爱运动和现场感，情绪来得快也真。",
      stageTags: ["college", "young_adult"],
      roleTags: ["校队", "局面带动者"],
      traitTags: ["外放", "有行动力", "不喜欢拐弯抹角"],
      contactStyle: "更吃陪伴感和行动回应，不太信只停留在嘴上的好意。",
      conflictStyle: "不喜欢冷处理，若长期被忽视，会很快把失望说出口。",
      appearance: {
        minAge: 18,
        firstStage: "college",
        contexts: ["球场", "朋友局", "夜宵", "旅行"]
      },
      availability: {
        spansStages: ["college", "young_adult"],
        reconnectAges: [23, 27],
        continuityBias: "intense"
      },
      romanceProfile: {
        arcType: "intense",
        futureFocus: "需要被回应，被忽视很快就会受伤。",
        longTermPotential: 50,
        volatility: 80,
        fitTags: ["sports", "action", "passion"],
        theirInterestConditions: {
          minStats: { social: 32 }
        },
        warmingConditions: {
          minStats: { social: 30, happiness: 34 }
        },
        breakupConditions: {
          minStats: { stress: 48 },
          someFlags: ["career_first", "solo_pattern"]
        },
        canReconnect: true,
        reconnectConditions: {
          minStats: { social: 34 }
        }
      }
    }),
    relationship({
      id: "xu_qing",
      name: "徐清",
      gender: "male",
      identity: "让人安心，擅长照顾他人，也很在意日子能不能长久。",
      stageTags: ["college", "young_adult", "family"],
      roleTags: ["志愿者", "生活型人物"],
      traitTags: ["稳重", "耐心", "家庭感很强"],
      contactStyle: "会在稳定联系、可靠承诺和共同规划里逐步交出信任。",
      conflictStyle: "不轻易翻脸，但若长期价值观不合，会慢慢收回投入。",
      appearance: {
        minAge: 18,
        firstStage: "college",
        contexts: ["志愿活动", "日常照顾", "一起做饭", "长期联系"]
      },
      availability: {
        spansStages: ["college", "young_adult", "family"],
        reconnectAges: [24, 29],
        continuityBias: "stable"
      },
      romanceProfile: {
        arcType: "stable",
        futureFocus: "家庭感、长期生活和实际陪伴。",
        longTermPotential: 92,
        volatility: 20,
        fitTags: ["family", "care", "stability"],
        theirInterestConditions: {
          minStats: { mental: 42, happiness: 34 }
        },
        warmingConditions: {
          minStats: { mental: 40, happiness: 36 }
        },
        breakupConditions: {
          minStats: { stress: 60 },
          someFlags: ["career_first", "trust_break"]
        },
        canReconnect: true,
        reconnectConditions: {
          minStats: { familySupport: 34, happiness: 40 }
        }
      }
    }),
    relationship({
      id: "lu_chuan",
      name: "陆川",
      gender: "male",
      identity: "话不算多，但很能扛事，遇到关键时刻通常比看起来更靠谱。",
      stageTags: ["college", "young_adult", "career"],
      roleTags: ["工科生", "项目骨干"],
      traitTags: ["沉稳", "实际", "有责任感"],
      contactStyle: "不太会高调表达，更多通过持续出现和做事方式建立信任。",
      conflictStyle: "不爱吵，但会在原则问题上很坚定，需要被认真对待。",
      appearance: {
        minAge: 18,
        firstStage: "college",
        contexts: ["项目组", "实验室", "加班", "一起解决问题"]
      },
      availability: {
        spansStages: ["college", "young_adult", "career"],
        reconnectAges: [24, 30],
        continuityBias: "reunion"
      },
      romanceProfile: {
        arcType: "reunion",
        futureFocus: "不擅长高调表达，但能陪你扛现实。",
        longTermPotential: 80,
        volatility: 34,
        fitTags: ["responsibility", "career", "stability"],
        theirInterestConditions: {
          minStats: { discipline: 22, career: 4 }
        },
        warmingConditions: {
          minStats: { discipline: 20, intelligence: 28 }
        },
        breakupConditions: {
          minStats: { stress: 58 },
          someFlags: ["career_first"]
        },
        canReconnect: true,
        reconnectConditions: {
          minStats: { career: 24, discipline: 28 }
        }
      }
    })
  ];
})();

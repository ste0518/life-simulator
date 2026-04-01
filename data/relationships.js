(function () {
  "use strict";

  /*
    恋爱对象手动编辑说明：
    - `appearance.minAge`：人物最早从几岁开始出现。
    - `appearance.contexts`：更容易通过哪些场景认识或熟悉。
    - `appearance.sceneHooks`：通用关系事件链会优先读取这里的场景钩子，用来生成更自然的“注意到 / 接触 / 反复遇见 / 熟悉 / 特别关注 / 疏远 / 重逢”文案。
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
      identity: "小时候搬家后在同一所小学见过，初中真正同班，字好看，写东西很细，常被老师点名念作文。",
      stageTags: ["school", "adolescence", "highschool", "college", "young_adult", "family"],
      roleTags: ["班级干部", "语文强项"],
      traitTags: ["安静", "细腻", "观察力强"],
      contactStyle: "更容易在共同值日、传纸条和慢慢熟起来的聊天里靠近。",
      conflictStyle: "不喜欢被公开起哄，受伤时会先退回自己的角落。",
      appearance: {
        minAge: 11,
        firstStage: "school",
        contexts: ["搬家后同校", "图书角借书", "作文小组", "升入初中后再度同班"],
        sceneHooks: {
          notice: "图书角、作文展示栏和走廊拐角那些总会反复看见她的地方",
          contact: "一次值日收尾和作文小组分工",
          repeated: "放学路、传作业本和借书台前的短暂停留",
          bond: "她会把你随口提过的小事记得很久，这让关系慢慢有了细密的回响",
          special: "班里开始默认你们会一起被点名、一起留下时",
          distance: "分班、升学和不同城市让原本稳定的来往出现缝隙",
          reunion: "很多年后在旧书店、讲座活动或朋友分享的书单里又重新碰见她"
        },
        introductionText: "你一开始并不是在什么特别戏剧性的场合认识她的。只是搬家后换了学校，图书角、走廊和作文展示栏旁边，偶尔总会看见一个写字很好看、做事也很安静的女生。",
        rumorText: "等到初中真的同班以后，你们一起被老师点名、一起留下值日，班里才后知后觉地开始拿你们开些半真半假的玩笑。",
        progression: {
          notice: "最初只是知道学校里有这么个人，连名字都不一定记得牢，却会在路过图书角和公告栏时多看一眼。",
          contact: "真正说上话，是在作文小组和后来分到同一个班以后，很多原本擦肩而过的场景突然有了具体名字。",
          repeated: "值日、传作业、放学出校门的那一小段路，让你们不知不觉有了固定会碰上的日常。",
          familiarity: "关系不是一下热起来的，更像很多安静的小事一层层叠上去，最后才发现已经熟过了线。",
          special: "等别人开始拿你们一起被表扬、一起出现这件事起哄时，你才意识到自己对她的关注早就不只是普通同学。"
        }
      },
      availability: {
        spansStages: ["school", "adolescence", "highschool", "college", "young_adult", "family"],
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
      identity: "小学末期就常在小区球场和学校活动里见到，初中后成了总会在热闹中心出现的人。",
      stageTags: ["school", "adolescence", "highschool", "young_adult", "career"],
      roleTags: ["校队", "人缘好"],
      traitTags: ["外向", "直接", "有行动力"],
      contactStyle: "会被自然的陪伴、一起去做事和不拧巴的回应打动。",
      conflictStyle: "不爱猜来猜去，关系不对劲时希望尽快说开。",
      appearance: {
        minAge: 12,
        firstStage: "school",
        contexts: ["小区球场", "运动会练习", "班级活动", "放学结伴"],
        sceneHooks: {
          notice: "小区球场、操场边和每次热闹活动里总能先看见他的时刻",
          contact: "运动会练习后的递水和班级活动收尾",
          repeated: "散场以后一起往校门口走的那一小段路",
          bond: "他总能先把场子带热，却会在散场后把更真的情绪留给你",
          special: "你开始在一群人里下意识先找他的身影时",
          distance: "成长节奏、自尊和谁都不想先低头的拉扯让关系开始发硬",
          reunion: "工作后某个很晚的夜里，他又一次出现在最需要人来接的时候"
        },
        introductionText: "最早你是在球场边认得他的。那时候还谈不上熟，只是总能在人群和笑声里看见他，像那种会很自然把场子带热的人。",
        rumorText: "等你们真正开始一起走一小段路、在班级活动里多说几句以后，周围人就已经很擅长替你们编后续了。",
        progression: {
          notice: "你先记住的不是名字，而是那种总会在球场边、操场上和热闹场面里反复出现的存在感。",
          contact: "后来因为活动、同学朋友和放学路，你们开始有了真正能接上的几句对话。",
          repeated: "一起出现的次数一多，连很普通的递水、等散场、顺路回家都开始被人看见。",
          familiarity: "这条关系熟起来很快，很多时候并不是因为你们谈了什么大道理，而是因为一起做了很多很具体的小事。",
          special: "等你开始下意识在热闹里先找他的身影，就已经说明这份注意和别人不太一样了。"
        }
      },
      availability: {
        spansStages: ["school", "adolescence", "highschool", "young_adult", "career"],
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
      identity: "小学高年级补课班见过，初中真正成了同桌，理科不错，嘴上不算软，却会记得很多细节。",
      stageTags: ["school", "adolescence", "highschool", "college", "young_adult", "family"],
      roleTags: ["同桌", "理科好"],
      traitTags: ["嘴硬", "聪明", "慢热"],
      contactStyle: "更容易在并肩写作业、互相帮忙和长期默契里升温。",
      conflictStyle: "表面像没事，其实会把失望记很久。",
      appearance: {
        minAge: 12,
        firstStage: "school",
        contexts: ["数学补课班", "分班后同桌", "作业互帮", "竞赛备考"],
        sceneHooks: {
          notice: "补课班里她做题太快、改错太利落的样子",
          contact: "借红笔、对答案和同桌后互相帮忙补作业",
          repeated: "周末补课、错题本交换和放学前一起收拾桌面的习惯",
          bond: "她嘴上不软，却会把你状态不好的那一科悄悄记在心里",
          special: "身边人开始默认你们会互相照应、互相托底时",
          distance: "升学分流和不同城市把多年同桌默契拆成了零散联系",
          reunion: "成年后在雨天车站、培训会或工作差旅路上又重新遇见她"
        },
        introductionText: "你最早是在补课班里记住她的。她不算爱搭话，做题很快，纠错时语气也有点硬，可偏偏会把一些别人不会在意的小细节记得很牢。",
        rumorText: "后来成了同桌以后，你们总被排在一起、总一起做题，连老师都慢慢默认你们会互相照应。",
        progression: {
          notice: "最开始只是觉得这个人有点难糊弄，做题和说话都挺利落，让人没法完全不注意。",
          contact: "真正熟起来，是从借红笔、对答案、补课后一起留到最后讲题开始的。",
          repeated: "你们把很多普通学生时代的小事都做成了固定搭配，关系也因此有了非常日常的黏性。",
          familiarity: "这不是一下就亮起来的关系，而是很长时间并肩以后，才发现很多默契早就长出来了。",
          special: "当身边人开始默认你们会互相照应时，你才意识到自己也已经把她放进了某种下意识的优先顺序里。"
        }
      },
      availability: {
        spansStages: ["school", "adolescence", "highschool", "college", "young_adult", "family"],
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
      identity: "小学末期在图书角和校园广播预备组里见过，初中成了广播站成员，讲话不快，常带一点和同龄人不太一样的稳。",
      stageTags: ["school", "adolescence", "highschool", "college", "young_adult"],
      roleTags: ["广播站", "声音好听"],
      traitTags: ["克制", "可靠", "有点距离感"],
      contactStyle: "会对愿意认真交流、也能尊重边界的人慢慢卸下防备。",
      conflictStyle: "不爱吵架，一旦冷下来就会明显拉远距离。",
      appearance: {
        minAge: 12,
        firstStage: "school",
        contexts: ["图书角", "广播站见习", "演讲比赛准备", "朋友介绍"],
        sceneHooks: {
          notice: "图书角、广播间和演讲准备教室那些总带一点安静回音的地方",
          contact: "借书、对演讲稿和广播站见习准备",
          repeated: "在没什么人打扰的角落里反复碰上和慢慢接话",
          bond: "他不是会一下子热起来的人，可一旦开始认真听你说话，分量就会变重",
          special: "你开始留意广播间灯有没有亮、他今天会不会出现时",
          distance: "边界感、没说开的误会和成长阶段不同步让关系逐渐退远",
          reunion: "成年后在讲座后台、书店或朋友局里再度碰见他"
        },
        introductionText: "你先是在图书角和校广播的准备活动里见到他的。那时他就有种和同龄人不太一样的稳，像很多话都会先在心里放一会儿，再决定要不要说出来。",
        rumorText: "你们并没有做什么很夸张的事，可正因为总在安静的地方反复碰上，别人反而更容易多想。",
        progression: {
          notice: "你先注意到的是那种不抢热闹、却很难让人忽略的安静分寸。",
          contact: "后来因为借书、演讲稿和广播站的准备工作，你们开始有了能慢慢接下去的对话。",
          repeated: "这种关系不是在人多的时候迅速升温，而是在很多安静角落里反复碰上以后才渐渐变深。",
          familiarity: "你会慢慢发现，他不是冷，只是习惯先观察，再决定要不要真正靠近谁。",
          special: "等你开始在图书角和广播间下意识留意他会不会出现时，这份关注就已经带上了别的意味。"
        }
      },
      availability: {
        spansStages: ["school", "adolescence", "highschool", "college", "young_adult"],
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
      identity: "小学毕业前就在活动主持和文艺汇演里很显眼，初中后社团和学生会都很活跃，外表大方，实际上对在意的人很护短。",
      stageTags: ["school", "adolescence", "highschool", "college", "young_adult"],
      roleTags: ["社团活跃", "主持人"],
      traitTags: ["亮眼", "护短", "情绪感染力强"],
      contactStyle: "容易在社团配合、排练和一起扛事的时候迅速熟起来。",
      conflictStyle: "热情来得快，失望时也会很直接地降温。",
      appearance: {
        minAge: 12,
        firstStage: "school",
        contexts: ["文艺汇演", "班会主持", "社团排练", "朋友介绍"],
        sceneHooks: {
          notice: "舞台边、主持排练和社团活动里她最亮眼的那一块地方",
          contact: "活动筹备时一起搬道具、对流程和临时救场",
          repeated: "排练散场后的闲聊、一起买东西和被朋友拉进同一群人",
          bond: "她会很自然地把你卷进她的节奏，也会在你被忽略时先替你撑一下场",
          special: "你开始分不清自己是在期待活动本身，还是在期待活动里总会出现的她时",
          distance: "热度退下去以后，表达差异和谁更想被坚定选择开始显出来",
          reunion: "毕业多年后在婚礼、校友活动或一次临时主持合作里又见到她"
        },
        introductionText: "你很早就在学校活动里看见过她。她像那种会把普通校园生活一下撑亮的人，站在台前很自然，台下又总能把周围人一起卷进她的节奏里。",
        rumorText: "等你们在活动准备和排练里一起出现得多了，大家已经开始半认真半玩笑地把你们凑成一对。",
        progression: {
          notice: "最初是远远看见她主持、排练和带动气氛，很难不被那种亮度吸过去。",
          contact: "真正有交集，是在活动筹备里开始一起对流程、搬道具和补各种临时空缺。",
          repeated: "排练和班级活动的高频碰面，让你们熟起来的速度比很多普通关系都更快。",
          familiarity: "她会把你一起拉进很多场景里，而你也会在这种热度里越来越放下原本的拘谨。",
          special: "等你开始分不清自己究竟是在喜欢活动本身，还是在喜欢每次活动里都会出现的她，这条线就已经长出来了。"
        }
      },
      availability: {
        spansStages: ["school", "adolescence", "highschool", "college", "young_adult"],
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
      identity: "小学高年级补课班就断断续续见过，初中后才真正熟起来，家里管得严，成绩很稳，但偶尔会露出一点少年气的莽撞。",
      stageTags: ["school", "adolescence", "highschool", "college", "career"],
      roleTags: ["补课班", "成绩稳定"],
      traitTags: ["压抑", "认真", "偶尔冲动"],
      contactStyle: "更容易在补课、竞赛、分享秘密和一起对抗压力时熟起来。",
      conflictStyle: "习惯先扛住，真的扛不动时会突然一下子崩开。",
      appearance: {
        minAge: 12,
        firstStage: "school",
        contexts: ["补课班", "竞赛训练", "家长比较", "雨天一起等车"],
        sceneHooks: {
          notice: "补课班里他总显得太懂事、太会压住情绪的样子",
          contact: "竞赛训练后一起等车和偶尔被家长放在一起比较",
          repeated: "补课结束后的同行、雨天檐下和成绩波动时的低声聊天",
          bond: "他不会轻易把压力说透，但会在你面前一点点露出真正累的那面",
          special: "你开始比关心成绩更关心他最近是不是又把情绪压得太深时",
          distance: "家庭要求、前途选择和谁都不想拖累对方让关系一次次错开",
          reunion: "很多年后在同学婚礼、高铁站或行业会议上重新联系上他"
        },
        introductionText: "你最早是在补课班里认识他的。那时候他已经很安静、很稳，像那种总知道该怎么答题、怎么交差的孩子，可越相处，越能看到他在懂事和想挣脱之间反复拉扯。",
        rumorText: "等你们补课后一起走一小段路、在雨天一起等车变得太固定以后，这种同行就很难不被别人注意。",
        progression: {
          notice: "你先感受到的是他那种被要求得很紧、却努力不显得狼狈的样子。",
          contact: "后来因为补课、竞赛和放学后的等待时间，你们开始一点点说到成绩之外的事。",
          repeated: "很多关系是在热闹里变近的，你们更像是在压力和时间缝隙里慢慢把彼此认出来。",
          familiarity: "他不会主动把情绪全摊开，但会在反复同行和聊天里慢慢露出真实的一面。",
          special: "当你开始下意识关心他的压力和沉默时，关系就已经从普通认识长成了更难轻易抽身的东西。"
        }
      },
      availability: {
        spansStages: ["school", "adolescence", "highschool", "college", "career"],
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
        sceneHooks: {
          notice: "她刚转来时那种把自己收得很稳的清醒感",
          contact: "帮她认教室、抄课表和晚自习前后的题目交流",
          repeated: "模考后对答案、聊志愿和一起绕操场走一小圈的时间",
          bond: "她不太轻易示弱，可一旦开始和你讨论真正的不安，关系就已经很不一样",
          special: "你们开始把城市、专业和以后可能去的地方一起放进聊天里时",
          distance: "工作机会和城市选择逼着你们把关系放进现实里对账",
          reunion: "成年后在行业论坛、同学聚会或双方家长见面前后重新靠近"
        },
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
        sceneHooks: {
          notice: "运动会、联谊和一群人起哄时他总特别扎眼的存在感",
          contact: "一起练项目、散场后顺路和朋友局里的单独搭话",
          repeated: "课间打闹、夜宵局和被人起哄后谁都没走开的那几次",
          bond: "他会把喜欢和不满都表现得很快，也会在你低落时第一反应先来找你",
          special: "大家已经默认你们之间有点什么，而你也没那么想否认时",
          distance: "高强度情绪和长期模糊让关系很容易从热烈转成拉扯",
          reunion: "大学后在校友球局、朋友婚礼或城市夜宵摊上又重新碰见他"
        },
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
        sceneHooks: {
          notice: "社团布展、校刊排版和她把普通细节处理得很顺眼的时候",
          contact: "一起改展板、对校刊稿子和放学后顺手去买材料",
          repeated: "社团收尾、校门口小店和一起散步回去的慢节奏来往",
          bond: "她很会照顾气氛，也会在你局促的时候自然替你把场面接过去",
          special: "你开始把和她一起做事、买东西、走路都当成很自然的日常时",
          distance: "谁先把热情收回去、谁更想要松弛生活感的差异慢慢显出来",
          reunion: "成年后在展览、市集或朋友搬家聚会里又重新碰上她"
        },
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
        sceneHooks: {
          notice: "自习室里他总坐得最稳、做题也最硬的样子",
          contact: "竞赛班讨论题目和前排互相递资料",
          repeated: "自习室闭馆前后、模考排名出来后和志愿表旁边的长谈",
          bond: "他会把很多事情都处理得很清楚，也会让你第一次认真思考两个人能不能一起往前冲",
          special: "你们开始默认会一起讨论未来安排和上升路径时",
          distance: "目标和效率被放到太前面以后，关系也容易被处理得像任务",
          reunion: "工作后在行业峰会、面试现场或回校分享里再度碰见他"
        },
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
        sceneHooks: {
          notice: "辩论赛和演讲场上他锋利得让人很难不去看",
          contact: "一次社团合作里互相接话、拆观点和私下复盘",
          repeated: "公开场合针锋相对、散场后又能继续聊下去的反差",
          bond: "你开始发现他并不是只会赢，他也会在真正被看见时露出一点脆弱",
          special: "你们越来越像只有彼此接得住对方那种节奏时",
          distance: "防备心、表达欲和谁都不想先认输的关系张力让错过很容易发生",
          reunion: "成年后在论坛、媒体活动或朋友局里又重新和他辩起来"
        },
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
        sceneHooks: {
          notice: "画室、展览角落和人群里她总能一眼看出真假轻重的时候",
          contact: "帮她搬作品、一起逛展和活动结束后的散步聊天",
          repeated: "画室外买饮料、音乐节散场和交换喜欢的歌单",
          bond: "她会比很多人更快看穿敷衍，也会把真诚回应看得很重",
          special: "她开始把只和少数人说的话也慢慢拿来和你讲时",
          distance: "直觉太准的人很难被糊弄，轻慢和迟疑都会被她很快察觉",
          reunion: "多年后在展览开幕、婚礼布置或朋友局里又重新见到她"
        },
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
        contexts: ["图书馆", "文学社", "夜聊", "互相分享日常"],
        sceneHooks: {
          notice: "图书馆固定角落、借书台和文学社讨论时她总在的那种安静存在",
          contact: "一次借书台前的搭话和文学社散场后的继续聊天",
          repeated: "夜聊、互相分享日常和图书馆里总能坐到附近的位置",
          bond: "她会把你说过的话慢慢记住，也会在很久以后接住那些你自己都忘了的情绪",
          special: "你开始觉得很多安静时刻如果没有她就会少一截分量时",
          distance: "成年后的忙乱、表达欲差异和谁先把联系放轻会让关系变淡",
          reunion: "工作几年后在书店、读书会或一场深夜长谈里又重新把联系续上"
        },
        introductionText: "你不是在热闹场合认识她的。更像是在图书馆总看见同一个人坐在固定角落，后来在文学社和借书台前真正说上话，关系才慢慢有了轮廓。",
        rumorText: "你们看起来并不高调，可正因为总在安静处碰上、总能聊到别人插不进来的话题，旁人反而更容易看出那点不同。"
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
        contexts: ["展览", "城市漫游", "探店", "社团活动"],
        sceneHooks: {
          notice: "展览志愿、社团活动和她把普通路线走得像生活方式的时候",
          contact: "活动结束后一起逛展、探店和顺着街区多走一段",
          repeated: "城市漫游、饭后散步和偶尔谁都不急着回去的下午",
          bond: "她会把日子过得很有节奏，也会让你慢慢明白舒服相处本身就很稀有",
          special: "你们连一起吃饭和闲逛都自然得像已经写进彼此日常时",
          distance: "生活节奏、未来选择和谁更想保留松弛空间会慢慢显影",
          reunion: "后来在展览、市集、旅行地或城市街角又重新碰上她"
        },
        introductionText: "她进入你生活的方式很像她本人，不算猛烈，却很有自己的节奏。可能是一次展览志愿、一次社团活动后的闲逛，或者一群人里她刚好把普通路线走得特别像生活。",
        rumorText: "你们并不是最爱高调出现的那一对，可正因为一起吃饭、逛展和散步都太自然，周围人才会更早意识到你们正在慢慢变熟。"
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
        contexts: ["专业课", "辩论队", "深夜聊天", "共同项目"],
        sceneHooks: {
          notice: "专业课上她总能很快抓到重点、又不轻易向谁靠近的样子",
          contact: "辩论队、共同项目和一次深夜收尾后的延长对话",
          repeated: "专业讨论、夜里回消息和彼此越来越接得住的话锋",
          bond: "她越是克制，偶尔认真接住你情绪时就越容易让人记很久",
          special: "你开始期待她会不会只对你放下一点防备时",
          distance: "边界感太强的人一旦失望，往往不会吵，只会直接把门关上",
          reunion: "几年后在行业论坛、同学聚会或深夜旧话题里重新接上她"
        },
        introductionText: "你最早对她有印象，多半是在专业课或辩论场上。她反应快，说话有分寸，不会刻意靠近谁，所以真正熟起来反而更像一件需要时间慢慢发生的事。",
        rumorText: "你们表面上并不算最热络，可正因为总能把彼此的话接住，身边人会比你们更早意识到这段关系不只是普通同学。"
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
        contexts: ["活动筹备", "旅行", "聚会", "社团合作"],
        sceneHooks: {
          notice: "活动现场、朋友局和她一出场就把气氛抬起来的时候",
          contact: "一起扛活动、临时出游和聚会收尾后的单独聊天",
          repeated: "说走就走的小计划、频繁见面和总被她拉进新场景",
          bond: "她会用行动把人卷进生活，也会在你迟疑时直接来问你到底怎么想",
          special: "你开始发现自己期待的不只是活动，而是活动里那个总会出现的她时",
          distance: "节奏失衡和反馈不对等会让这段关系很快从热烈转成消耗",
          reunion: "工作后在旅行、婚礼或一场说约就约的聚会里又重新遇上她"
        },
        introductionText: "她几乎总是从人群和行动里进入别人的生活。你可能是在活动筹备、一次临时出游或朋友聚会里先被她带着走，后来才发现自己已经记住了这种鲜活感。",
        rumorText: "你们一起出现的场合通常都不安静，所以关系一有点升温，也会很快被朋友们用起哄和玩笑看出来。"
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
        contexts: ["项目合作", "实习", "创业比赛", "求职"],
        sceneHooks: {
          notice: "项目会议、实习汇报和他把复杂事情处理得很清楚的时候",
          contact: "一起赶节点、改方案和熬到很晚的答辩准备",
          repeated: "项目冲刺、通勤路上的消息和围着未来安排的对表",
          bond: "他不一定浪漫，但会让你很快意识到并肩做事实在太容易长出分量",
          special: "你们开始把彼此纳入未来城市、工作和成长速度的比较里时",
          distance: "成长速度差和现实优先级会逼着你们正面回答是不是还能同步",
          reunion: "很多年后在机场、论坛或合作现场又重新碰见他"
        },
        introductionText: "这种人一般不会靠闲聊进入你的人生。真正让你记住他的，多半是某次项目推进、实习协作或比赛准备里，他把很多事情处理得异常清楚。",
        rumorText: "你们的靠近一开始很像纯合作，可一旦一起熬过几次高压节点，旁人也会慢慢看出这种默契已经不只是工作需要。"
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
        contexts: ["球场", "朋友局", "夜宵", "旅行"],
        sceneHooks: {
          notice: "球场、夜宵摊和一群人里他最有现场感的时候",
          contact: "朋友局后的顺路、打完球后的夜宵和临时约起的短途出行",
          repeated: "很多次一起散场、一起回去和被起哄也没有立刻躲开的晚上",
          bond: "他会用很直接的方式表达在意，也会在被忽视时立刻受伤",
          special: "你开始发现自己其实很吃这种有人总会来喊你一起去做点什么的热度时",
          distance: "回应不对等和长期冷处理会让这段关系迅速降温",
          reunion: "毕业后在球局、酒吧或朋友婚礼上又重新撞见他"
        },
        introductionText: "他很少安静地进入谁的人生。通常是球场、夜宵摊、朋友局这些带着现场感的地方，让你先注意到这个情绪来得快、人也很真诚的人。",
        rumorText: "这种高存在感的人一旦和你走得近，周围人通常比你们自己更早开始拿这段关系起哄。"
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
        contexts: ["志愿活动", "日常照顾", "一起做饭", "长期联系"],
        sceneHooks: {
          notice: "活动收尾、厨房和他总会留下来把事情做完的时候",
          contact: "一起洗碗、做饭和在照顾别人的细节里真正熟起来",
          repeated: "买菜、做饭、活动收摊和慢慢把彼此写进生活安排",
          bond: "他会在你最狼狈的时候也稳稳在场，这种照顾感很难不让人动心",
          special: "你开始把以后的家务、饭桌和日常节奏也下意识放进对他的想象里时",
          distance: "共同生活需要的分工、承诺和现实准备度会慢慢把问题放大",
          reunion: "多年后在朋友聚餐、家人介绍或旧社区里再次和他联系上"
        },
        introductionText: "你真正记住他，往往不是因为某个很亮的瞬间，而是活动收尾、一起做饭、顺手照顾别人这些很生活化的场景。他像那种不一定最显眼，却总会留到最后的人。",
        rumorText: "你们的关系很少靠轰烈场面推进，更多是因为一起做了太多让人觉得“这两个人很像已经把对方写进日常里”的小事。"
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
        contexts: ["项目组", "实验室", "加班", "一起解决问题"],
        sceneHooks: {
          notice: "实验室、项目组和需要有人兜住麻烦的时候他总在的样子",
          contact: "一起排故障、加班收尾和把问题一点点拆开解决",
          repeated: "项目节点、深夜改方案和谁都知道可以把事交给对方的默契",
          bond: "他不太高调表达，却会用持续出现和扛事方式把信任慢慢做出来",
          special: "你开始觉得很多难事只要他也在就会好处理一点时",
          distance: "现实责任和表达方式差异会让这段关系在沉默里慢慢变重",
          reunion: "工作几年后在合作项目、行业会或城市搬迁时又重新碰到他"
        },
        introductionText: "你是在做事的时候真正记住他的。实验室、项目组、加班收尾，很多需要扛事的场景会把一个人真正的稳定和责任感暴露得很清楚。",
        rumorText: "你们并不总是高调，可正因为一起解决问题、一起熬过麻烦的次数太多，关系看起来反而比一般暧昧更像真的会往现实里长。"
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

(function () {
  "use strict";

  /*
    恋爱对象手动编辑说明：
    - 每个 relationship({ ... }) 就是一个独立可改的互动对象。
    - stageTags: 对象主要活跃在哪个年龄阶段。
    - roleTags: 该人物在校园 / 生活中的身份标签。
    - traitTags: 性格标签。
    - 事件里通过 relationshipEffects 精确修改单个对象的 affection / status / flags。
  */

  function toList(value) {
    return Array.isArray(value) ? value.slice() : [];
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
      initialStatus: typeof source.initialStatus === "string" ? source.initialStatus : "unknown"
    };
  }

  window.LIFE_RELATIONSHIPS = [
    relationship({
      id: "song_qinghe",
      name: "宋清禾",
      gender: "female",
      identity: "初中同班，字好看，写东西很细，常被老师点名念作文。",
      stageTags: ["adolescence"],
      roleTags: ["班级干部", "语文强项"],
      traitTags: ["安静", "细腻", "观察力强"],
      contactStyle: "更容易在共同值日、传纸条和慢慢熟起来的聊天里靠近。",
      conflictStyle: "不喜欢被公开起哄，受伤时会先退回自己的角落。 "
    }),
    relationship({
      id: "jiang_xun",
      name: "江循",
      gender: "male",
      identity: "初中篮球队常客，课间总在人群边缘笑着接话。",
      stageTags: ["adolescence"],
      roleTags: ["校队", "人缘好"],
      traitTags: ["外向", "直接", "有行动力"],
      contactStyle: "会被自然的陪伴、一起去做事和不拧巴的回应打动。",
      conflictStyle: "不爱猜来猜去，关系不对劲时希望尽快说开。"
    }),
    relationship({
      id: "fang_ke",
      name: "方可",
      gender: "female",
      identity: "初中同桌型人物，理科不错，嘴上不算软，却会记得很多细节。",
      stageTags: ["adolescence"],
      roleTags: ["同桌", "理科好"],
      traitTags: ["嘴硬", "聪明", "慢热"],
      contactStyle: "更容易在并肩写作业、互相帮忙和长期默契里升温。",
      conflictStyle: "表面像没事，其实会把失望记很久。"
    }),
    relationship({
      id: "chen_yan",
      name: "陈砚",
      gender: "male",
      identity: "初中广播站成员，讲话不快，常带一点和同龄人不太一样的稳。",
      stageTags: ["adolescence"],
      roleTags: ["广播站", "声音好听"],
      traitTags: ["克制", "可靠", "有点距离感"],
      contactStyle: "会对愿意认真交流、也能尊重边界的人慢慢卸下防备。",
      conflictStyle: "不爱吵架，一旦冷下来就会明显拉远距离。"
    }),
    relationship({
      id: "he_yuan",
      name: "何沅",
      gender: "female",
      identity: "高中转进来的同学，成绩稳定，说话有分寸，身上总带点清醒感。",
      stageTags: ["highschool"],
      roleTags: ["转学生", "竞赛班"],
      traitTags: ["冷静", "上进", "不失礼貌"],
      contactStyle: "欣赏能跟上节奏、又不会咄咄逼人的靠近方式。",
      conflictStyle: "遇到问题会先分析，再决定值不值得继续投入。"
    }),
    relationship({
      id: "pei_chuan",
      name: "裴川",
      gender: "male",
      identity: "高中里很容易被看见的人，擅长运动，也很会在大家紧张时活跃气氛。",
      stageTags: ["highschool"],
      roleTags: ["体育特长", "气氛担当"],
      traitTags: ["热烈", "讲义气", "情绪来得快"],
      contactStyle: "喜欢有回应、愿意并肩出现的人，不太耐得住长期模糊。",
      conflictStyle: "当下就会表达不满，但转头也愿意和解。"
    }),
    relationship({
      id: "qiao_ning",
      name: "乔宁",
      gender: "female",
      identity: "高中社团核心成员，审美敏锐，也很会在细节里照顾别人。",
      stageTags: ["highschool"],
      roleTags: ["社团骨干", "审美在线"],
      traitTags: ["松弛", "有主见", "会照顾气氛"],
      contactStyle: "更相信日常感和舒服相处，不喜欢被过度用力地追赶。",
      conflictStyle: "不会立刻翻脸，但会悄悄收回热情。"
    }),
    relationship({
      id: "gu_lin",
      name: "顾临",
      gender: "male",
      identity: "高中自习室常驻人物，目标感重，做题和安排都很硬。",
      stageTags: ["highschool"],
      roleTags: ["年级前列", "自习室常驻"],
      traitTags: ["自律", "理性", "野心强"],
      contactStyle: "容易在共同目标和长期并肩里建立好感。",
      conflictStyle: "会把很多关系问题也当成需要解决的任务。"
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
      conflictStyle: "受伤时会先安静下来，如果你愿意认真解释，她也愿意慢慢说开。"
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
      conflictStyle: "不喜欢情绪失控的拉扯，更愿意在冷静下来之后把边界和感受讲明白。"
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
      conflictStyle: "表面不会立刻翻脸，但如果失望累积太久，会直接把门关上。"
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
      conflictStyle: "不喜欢拐弯抹角，情绪到了会直接说，但说开后也愿意翻篇。"
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
      conflictStyle: "遇到分歧时会直指问题，但也容易把关系处理得太像项目。"
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
      conflictStyle: "不喜欢冷处理，若长期被忽视，会很快把失望说出口。"
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
      conflictStyle: "不轻易翻脸，但若长期价值观不合，会慢慢收回投入。"
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
      conflictStyle: "不爱吵，但会在原则问题上很坚定，需要被认真对待。"
    })
  ];
})();

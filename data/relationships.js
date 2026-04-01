(function () {
  "use strict";

  /*
    恋爱对象手动编辑说明：
    - 每个对象就是一个可发展的感情对象。
    - id: 供事件和结局引用，尽量保持稳定。
    - name / identity / traitTags: 用于 UI 展示和文案理解。
    - initialAffection / initialStatus: 初始好感和关系状态，通常不用改。
    - 事件里通过 relationshipEffects 调整 affection、status、flags。
  */

  function relationship(value) {
    const source = value && typeof value === "object" ? value : {};

    return {
      id: typeof source.id === "string" ? source.id : "",
      name: typeof source.name === "string" ? source.name : "未命名角色",
      identity: typeof source.identity === "string" ? source.identity : "",
      traitTags: Array.isArray(source.traitTags) ? source.traitTags.slice() : [],
      contactStyle: typeof source.contactStyle === "string" ? source.contactStyle : "",
      conflictStyle: typeof source.conflictStyle === "string" ? source.conflictStyle : "",
      initialAffection: typeof source.initialAffection === "number" ? source.initialAffection : 0,
      initialStatus: typeof source.initialStatus === "string" ? source.initialStatus : "unknown"
    };
  }

  window.LIFE_RELATIONSHIPS = [
    relationship({
      id: "lin_yue",
      name: "林月",
      identity: "擅长倾听、喜欢文字的人，常出现在图书馆和安静角落。",
      traitTags: ["细腻", "稳定", "表达欲低但很真诚"],
      contactStyle: "更愿意通过长谈、共享日常和细节记忆建立亲近感。",
      conflictStyle: "受伤时会先安静下来，如果你愿意认真解释，她也愿意慢慢说开。"
    }),
    relationship({
      id: "zhou_yi",
      name: "周屿",
      identity: "目标感很强，做事利落，总把前途和效率看得很清楚。",
      traitTags: ["上进", "理性", "对自己要求高"],
      contactStyle: "欣赏清晰、可靠和有执行力的人，会在并肩做事时更快产生好感。",
      conflictStyle: "遇到分歧时会直指问题，但也容易把关系处理得太像项目。"
    }),
    relationship({
      id: "cheng_nan",
      name: "程楠",
      identity: "存在感很强，热爱运动和现场感，情绪来得快也真。",
      traitTags: ["外放", "有行动力", "不喜欢拐弯抹角"],
      contactStyle: "更吃陪伴感和行动回应，不太信只停留在嘴上的好意。",
      conflictStyle: "不喜欢冷处理，若长期被忽视，会很快把失望说出口。"
    }),
    relationship({
      id: "xu_qing",
      name: "徐清",
      identity: "让人安心，擅长照顾他人，也很在意日子能不能长久。",
      traitTags: ["稳重", "耐心", "家庭感很强"],
      contactStyle: "会在稳定联系、可靠承诺和共同规划里逐步交出信任。",
      conflictStyle: "不轻易翻脸，但若长期价值观不合，会慢慢收回投入。"
    })
  ];
})();

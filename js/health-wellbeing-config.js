(function () {
  "use strict";

  /**
   * 健康、压力与「身体尽头」结局相关可调参数。
   * 可在本文件末尾或在游戏加载前改写 window.LIFE_HEALTH_WELLBEING_CONFIG 覆盖默认值。
   */
  const DEFAULT_HEALTH_WELLBEING = {
    /** 总开关：为 false 时引擎内叙事过滤会放行（仅调试用） */
    enabled: true,

    /**
     * 压力 → 健康「慢性损耗」：仅在每次完整属性联动结算时生效。
     * 按 atLeast 从高到低匹配第一条：stress >= atLeast 则扣除 perStep 点健康。
     * 默认：70–79 → -1，80–89 → -2，90–100 → -3。
     */
    stressHealthDecayBands: [
      { atLeast: 90, perStep: 3 },
      { atLeast: 80, perStep: 2 },
      { atLeast: 70, perStep: 1 }
    ],

    /** 压力分段：只影响心理/幸福感，不再叠加大额「连带扣健康」 */
    stressMentalSoftThreshold: 45,
    stressMentalMidThreshold: 60,
    stressMentalHardThreshold: 75,
    stressTierMentalSoft: -1,
    stressTierMentalMid: -2,
    stressTierMentalHard: -3,
    stressTierHappinessMid: -1,
    stressTierHappinessHard: -2,

    /** 负债是否参与「每次结算扣健康」；默认关闭，避免与高压叠加暴毙 */
    debtAppliesDerivedHealth: false,
    debtDerivedHealthThreshold: 96,
    debtDerivedHealthPerStep: -1,

    /** 健康偏低时的心理/情绪连带（略轻于旧版） */
    lowHealthMentalThreshold: 28,
    lowHealthMentalPenalty: -1,
    lowHealthHappinessPenalty: -1,

    /**
     * 叙事过滤：负向 health 仅在以下情况生效——
     * 事件带指定 tag、选项设 directHealth:true、或标题/正文/选项文案命中关键词。
     */
    filterUncontextualNegativeHealth: true,
    directHealthEventTags: [
      "health",
      "medical",
      "injury",
      "illness",
      "burnout",
      "accident",
      "hospital",
      "substance",
      "fitness",
      "recovery",
      "sleep",
      "fatigue",
      "prison"
    ],
    healthNarrativeKeywords: [
      "熬夜",
      "通宵",
      "失眠",
      "生病",
      "病倒",
      "住院",
      "病床",
      "手术",
      "急诊",
      "诊所",
      "体检",
      "医疗",
      "药物",
      "止痛",
      "酗酒",
      "酒精",
      "饮酒",
      "抽烟",
      "吸烟",
      "戒烟",
      "运动",
      "锻炼",
      "跑步",
      "健身",
      "作息",
      "睡眠",
      "休息",
      "调养",
      "养生",
      "恢复期",
      "透支",
      "过劳",
      "累垮",
      "疲惫",
      "硬撑",
      "身体",
      "健康",
      "病痛",
      "受伤",
      "摔伤",
      "肥胖",
      "节食",
      "饮食",
      "营养",
      "猝死",
      "咳血",
      "晕厥",
      "虚弱",
      "复发",
      "并发症",
      "深夜",
      "拖垮",
      "吃不消",
      "垮掉"
    ],

    /** 健康进入「高风险」展示用 flag */
    healthRiskFlag: "health_at_risk",
    healthRiskBandEnter: 16,
    healthRiskBandClear: 20,

    /** 健康归零结局：需连续若干次结算后健康仍为 0 */
    healthZeroEndingMinStreak: 3,
    /** 还需满足「崩盘语境」之一；若为 false 则只看出血量与 streak */
    endingHealthZeroRequireContext: true,
    healthCollapseMinStress: 70,
    healthCollapseMinAgeFallback: 45,
    healthCollapseMinChoicesFallback: 72,
    healthCollapseSomeFlags: [
      "chronic_condition",
      "health_warning",
      "overworked",
      "chronic_stress",
      "exam_fatigue",
      "emotional_shutdown",
      "substance_risk",
      "injury_recovery"
    ],
    /** 在语境不足时，若连续归零次数达到该值仍触发结局（防止卡死） */
    healthZeroEndingAbsoluteStreak: 8
  };

  const user = window.LIFE_HEALTH_WELLBEING_CONFIG;
  window.LIFE_HEALTH_WELLBEING_CONFIG = Object.assign({}, DEFAULT_HEALTH_WELLBEING, user && typeof user === "object" ? user : {});

  window.LifeHealthWellbeingDefaults = DEFAULT_HEALTH_WELLBEING;
})();

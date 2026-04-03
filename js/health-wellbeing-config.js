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
     */
    stressHealthDecayBands: [
      { atLeast: 92, perStep: 4 },
      { atLeast: 84, perStep: 3 },
      { atLeast: 74, perStep: 2 },
      { atLeast: 62, perStep: 1 }
    ],

    /**
     * 叙事/标签已判定成立的负向健康变化，再乘以此系数（放大熬夜、病伤等「该疼」的扣血）。
     * 设为 1 则关闭放大。
     */
    contextualNegativeHealthMultiplier: 1.38,

    /**
     * 健康较高时，正向恢复打折，避免轻易长期满血；health >= positiveHealthDiminishFrom 时用 positiveHealthHighRecoveryFactor。
     * health <= positiveHealthFullRecoveryBelow 时恢复不打折。
     */
    positiveHealthDiminishFrom: 72,
    positiveHealthFullRecoveryBelow: 52,
    positiveHealthHighRecoveryFactor: 0.58,

    /**
     * 瞬时压力阶梯对心理的影响已迁至引擎「慢性高压」逻辑（js/stress-mental-balance.js）。
     * 以下阈值仅保留给可能读取旧字段的工具或存档兼容；引擎不再用其做每步扣心理。
     */
    stressMentalSoftThreshold: 999,
    stressMentalMidThreshold: 999,
    stressMentalHardThreshold: 999,
    stressTierMentalSoft: 0,
    stressTierMentalMid: 0,
    stressTierMentalHard: 0,
    stressTierHappinessMid: 0,
    stressTierHappinessHard: 0,

    /** 负债是否参与「每次结算扣健康」；默认关闭，避免与高压叠加暴毙 */
    debtAppliesDerivedHealth: false,
    debtDerivedHealthThreshold: 96,
    debtDerivedHealthPerStep: -1,

    /** 健康偏低时的心理/情绪连带（略轻于旧版） */
    lowHealthMentalThreshold: 24,
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
    healthCollapseMinStress: 76,
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

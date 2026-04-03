(function () {
  "use strict";

  /**
   * 压力 / 心理状态：事件数值缩放、慢性拖累、联动与恢复强度。
   * 加载前可改写 window.LIFE_STRESS_MENTAL_BALANCE 覆盖默认值（浅合并顶层键）。
   */
  const DEFAULT_STRESS_MENTAL_BALANCE = {
    enabled: true,

    /** 事件选项里 stats.stress / stats.mental 默认按倍率缩小；以下情况用完整数值 */
    eventStressRiseScale: 0.36,
    eventStressReliefScale: 0.95,
    eventMentalHarmScale: 0.4,
    eventMentalRecoveryScale: 1.08,

    /** 事件 tags 命中时，对应维度不再缩放（可在事件数据里加标签） */
    explicitStressEventTags: ["explicit_stress", "high_stakes", "burnout", "crisis"],
    explicitMentalHarmEventTags: ["explicit_mental_harm", "trauma", "breakup_crisis", "family_crisis"],

    /**
     * 叙事关键词：标题/正文/选项文案命中时，视为「语义上明确高压或明确疗愈」，
     * 对该次数值使用完整幅度（仍受 clamp 限制）
     */
    explicitStressNarrativeKeywords: [
      "高考",
      "冲刺",
      "熬夜",
      "通宵",
      "失眠",
      "失业",
      "裁员",
      "下岗",
      "债务危机",
      "经济危机",
      "破产",
      "欠债",
      "还贷",
      "加班",
      "996",
      "过劳",
      "带娃",
      "育儿",
      "婆媳",
      "离婚",
      "分手",
      "出轨",
      "冷战",
      "争吵",
      "家暴",
      "抑郁",
      "崩溃",
      "压垮",
      "窒息",
      "职场霸凌",
      "PUA",
      "霸凌",
      "恐吓",
      "威胁",
      "遗书",
      "自残",
      "轻生",
      "病危",
      "手术",
      "住院",
      "重疾",
      "猝死",
      "预警",
      "体检异常"
    ],
    explicitMentalHarmNarrativeKeywords: [
      "孤独",
      "孤立",
      "背叛",
      "分手",
      "离婚",
      "出轨",
      "家暴",
      "创伤",
      "羞辱",
      "霸凌",
      "长期失败",
      "一蹶不振",
      "崩溃",
      "抑郁",
      "轻生",
      "自残",
      "空心病",
      "麻木",
      "绝望"
    ],
    explicitRecoveryNarrativeKeywords: [
      "休息",
      "放松",
      "疗愈",
      "心理咨询",
      "倾诉",
      "陪伴",
      "旅行",
      "度假",
      "散心",
      "运动",
      "跑步",
      "健身",
      "瑜伽",
      "冥想",
      "购物",
      "犒劳",
      "庆祝",
      "小成就",
      "进步",
      "被理解",
      "被接住",
      "家庭支持",
      "和好",
      "和解",
      "复合",
      "稳定下来",
      "睡个好觉",
      "放空"
    ],

    /**
     * 慢性高压 → 额外心理消耗：每次属性联动结算时，若压力连续若干次都 ≥ 阈值，才开始每步扣心理。
     * 压力降到阈值以下则 streak 清零，额外拖累停止。
     */
    chronicStressThreshold: 72,
    chronicStressMinConsecutiveSteps: 5,
    chronicStressMentalPerStep: -1,
    chronicStressHappinessPerStep: 0,

    /**
     * 心理长期偏低 → 轻微压力反弹（累积性，非单次选择打崩）
     */
    chronicLowMentalThreshold: 32,
    chronicLowMentalMinSteps: 6,
    chronicLowMentalStressPerStep: 1,

    /** 每次联动结算里的「环境」修正（替代原先过陡的瞬时压力→心理阶梯） */
    derived: {
      lowMoneyThreshold: 10,
      lowMoneyStress: 1,
      lowMoneyHappiness: 0,
      debtStressSoft: 1,
      debtStressMid: 2,
      debtStressHard: 2,
      debtMentalSoft: -1,
      debtMentalMid: -1,
      debtMentalHard: -2,
      debtHappySoft: -1,
      debtHappyMid: -1,
      debtHappyHard: -2,
      debtThresholdSoft: 52,
      debtThresholdMid: 68,
      debtThresholdHard: 82,
      lowHealthMental: -1,
      lowHealthHappy: -1,
      mentalLowHappinessThreshold: 28,
      mentalLowHappinessPenalty: -1,
      mentalLowSocialPenalty: -1,
      mentalLowStressSpiral: 1,
      familySupportHighThreshold: 68,
      familySupportHighMental: 2,
      familySupportHighHappy: 1,
      familySupportHighStressRelief: -1,
      familySupportLowThreshold: 26,
      familySupportLowStress: 1,
      familySupportLowMental: -1,
      disciplineStudyBonusRequiresStressMax: 62,
      partnerStableHappy: 1,
      partnerStableMental: 2,
      partnerStableStressRelief: -2,
      partnerConflictHappy: -1,
      partnerConflictMental: -1,
      partnerConflictStress: 1,
      partnerBreakupRiskStressSoft: 1,
      happinessHighBufferThreshold: 72,
      happinessHighStressRelief: -1
    },

    /** 裁员等系统硬编码事件的默认压力（引擎内可被此覆盖） */
    layoffStress: 7
  };

  const user = window.LIFE_STRESS_MENTAL_BALANCE;
  window.LIFE_STRESS_MENTAL_BALANCE = Object.assign({}, DEFAULT_STRESS_MENTAL_BALANCE, user && typeof user === "object" ? user : {});

  window.LifeStressMentalDefaults = DEFAULT_STRESS_MENTAL_BALANCE;
})();

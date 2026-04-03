(function () {
  "use strict";

  /**
   * 心理 / 压力 / 健康 → 负面 instant 结局 的权重微调（乘在引擎 calculateEndingWeight 结果上）。
   * 目标：保留真实威胁，又避免略碰即死；可与 stress-mental-balance.js、health-wellbeing-config.js 一起调。
   * 加载前可改写 window.LIFE_HEALTH_MENTAL_RISK_CONFIG 浅合并顶层键。
   */
  const DEFAULT_HEALTH_MENTAL_RISK = {
    enabled: true,
    /** 仅对这些 instant 结局 id 生效（须与 data/endings.js 中 id 一致） */
    instantEndingWeightMultipliers: {
      terminal_health_zero: 1.1,
      early_health_collapse: 1.15,
      burnout_breakdown: 1.12
    }
  };

  const user = window.LIFE_HEALTH_MENTAL_RISK_CONFIG;
  window.LIFE_HEALTH_MENTAL_RISK_CONFIG = Object.assign({}, DEFAULT_HEALTH_MENTAL_RISK, user && typeof user === "object" ? user : {});

  window.LifeHealthMentalRiskDefaults = DEFAULT_HEALTH_MENTAL_RISK;
})();

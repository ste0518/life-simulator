(function () {
  "use strict";

  /**
   * 开局核心属性（与家庭背景强相关部分）集中配置。
   * 引擎会在选定家庭背景后写入这些值；负债 / 压力开局固定为 0，健康固定为满值。
   * 可在游戏加载前改写 window.LIFE_INITIAL_STATS_CONFIG 覆盖或合并（浅合并顶层键）。
   *
   * familyBackgroundStats 的键必须与 data/family-backgrounds.js 里 background.id 一致。
   */
  const fixedAtStart = {
    health: 100,
    stress: 0,
    debt: 0
  };

  /** 若 id 未在表中（例如你新增了家庭背景但尚未补行），使用此兜底 */
  const neutralBackgroundFallback = {
    money: 34,
    mental: 58,
    happiness: 58,
    familySupport: 30
  };

  /**
   * 按家庭背景：财富、心理状态、幸福感、家庭支持（绝对值，0–100 内由引擎 clamp）
   * 数值刻意避免「一开局就崩」；压力与健康请勿写在此表（由 fixedAtStart 统一）
   */
  const familyBackgroundStats = {
    second_gen_wealth_home: { money: 52, mental: 56, happiness: 54, familySupport: 39 },
    power_resource_home: { money: 48, mental: 56, happiness: 53, familySupport: 37 },
    family_enterprise_home: { money: 50, mental: 58, happiness: 56, familySupport: 39 },
    intellectual_elite_home: { money: 50, mental: 54, happiness: 50, familySupport: 38 },
    overseas_resource_home: { money: 51, mental: 56, happiness: 53, familySupport: 36 },
    nouveau_riche_home: { money: 54, mental: 56, happiness: 58, familySupport: 35 },
    old_money_home: { money: 49, mental: 54, happiness: 50, familySupport: 35 },
    warm_average_home: { money: 36, mental: 64, happiness: 64, familySupport: 43 },
    tight_but_lifting_home: { money: 28, mental: 58, happiness: 57, familySupport: 35 },
    conflict_heavy_home: { money: 25, mental: 48, happiness: 46, familySupport: 18 },
    free_range_home: { money: 32, mental: 58, happiness: 59, familySupport: 23 },
    single_parent_absent_home: { money: 24, mental: 54, happiness: 50, familySupport: 20 },
    grade_first_repressed_home: { money: 36, mental: 54, happiness: 50, familySupport: 27 },
    small_town_limited_home: { money: 34, mental: 60, happiness: 60, familySupport: 33 },
    merchant_volatile_home: { money: 46, mental: 57, happiness: 54, familySupport: 33 },
    respectable_but_distant_home: { money: 44, mental: 55, happiness: 52, familySupport: 23 }
  };

  const DEFAULT_INITIAL_STATS = {
    fixedAtStart,
    neutralBackgroundFallback,
    familyBackgroundStats
  };

  const user = window.LIFE_INITIAL_STATS_CONFIG;
  window.LIFE_INITIAL_STATS_CONFIG = Object.assign({}, DEFAULT_INITIAL_STATS, user && typeof user === "object" ? user : {});

  window.LifeInitialStatsDefaults = DEFAULT_INITIAL_STATS;
})();

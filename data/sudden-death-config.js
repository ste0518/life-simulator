(function () {
  "use strict";

  /**
   * 突发必死意外：从 minAge 起，每「长一岁」对该岁做一次独立判定（默认每年 1%）。
   * 判定挂在引擎「年龄增加」处：同一真实岁数不会重复掷骰；一次跨多岁时会对经过的每个岁数各掷一次。
   * outcomes：命中后写入 flag，并用 title/text 作为结局正文（若省略则回退到 data/endings.js 同 id 或同 flag 的结局）。
   */
  const DEFAULT_SUDDEN_DEATH = {
    enabled: true,
    /** 从几岁开始参与「每年一次」判定（未满则不判） */
    minAge: 18,
    /** 每进入新的一岁时的触发概率（0–1，默认 0.01 = 1%） */
    probabilityPerYear: 0.0025,
    /**
     * 意外类型池：命中某岁后先掷概率，再按 weight 加权抽一条。
     * flag 须与 endings 中 requiredFlags 一致（若你只用本配置的 title/text，也建议保留 flag 便于存档/调试）。
     */
    outcomes: [
      {
        flag: "sudden_death_car_crash",
        endingId: "sudden_death_car_crash",
        weight: 26,
        title: "结局：一场车祸切断了所有「以后」",
        text: "没有长篇预告，也没有让你把话说完的空档。意外最残酷的地方，是它不等人把人生整理成可以交代的样子。"
      },
      {
        flag: "sudden_death_fire",
        endingId: "sudden_death_fire",
        weight: 14,
        title: "结局：火与烟把家和时间一起卷走",
        text: "你后来回想，只记得警报、热浪和某种过于安静的瞬间。很多计划不是慢慢放弃，而是被现实一把推下桌。"
      },
      {
        flag: "sudden_death_cardiac",
        endingId: "sudden_death_cardiac",
        weight: 22,
        title: "结局：心脏先一步喊停",
        text: "身体有时会以最直接的方式罢工。不是你不努力，而是有些东西叠到极限后，不会再给你第二次「先缓一缓」。"
      },
      {
        flag: "sudden_death_industrial",
        endingId: "sudden_death_industrial",
        weight: 18,
        title: "结局：一次严重事故，把人生留在现场",
        text: "安全规程、侥幸和经验在真正的失控面前都显得太薄。你以为自己只是照常上工，直到世界突然侧翻。"
      },
      {
        flag: "sudden_death_disaster",
        endingId: "sudden_death_disaster",
        weight: 12,
        title: "结局：突发灾难，来不及撤离",
        text: "有些危险来自远方，有些来自脚下。你来不及争论该不该更小心——命运只给了一次性的结果。"
      }
    ]
  };

  const user = window.LIFE_SUDDEN_DEATH_CONFIG;
  window.LIFE_SUDDEN_DEATH_CONFIG = Object.assign({}, DEFAULT_SUDDEN_DEATH, user && typeof user === "object" ? user : {});

  window.LifeSuddenDeathDefaults = DEFAULT_SUDDEN_DEATH;
})();

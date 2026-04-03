(function () {
  "use strict";

  /**
   * 就业 / 首胎育儿 门闩与阶段规则（供引擎与数据作者手动改）
   * ------------------------------------------------------------------
   * - firstChildIntroDoneFlag：首胎「新生儿/初次育儿」类剧情完成后写入，后续同类事件用 excludedFlags 排除
   * - 稳定在职时屏蔽求职向事件：按事件 id + tags 配置
   * - enableSilentAnnualLayoff：年度结算里是否允许「无剧情」随机失业（建议 false，改走叙事裁员事件）
   * - childStageRules：按「首个孩子出生后经过的年数」推进 children.stage（每年最多推进一档）
   */
  window.LIFE_EMPLOYMENT_CHILD_GATES = {
    firstChildIntroDoneFlag: "first_child_intro_completed",
    firstChildBornFlag: "first_child_born",
    secondChildBornFlag: "second_child_born",

    stableEmploymentRequiredFlags: ["annual_economy_active", "employed_housing_settled"],

    jobSearchCareerRouteIds: ["career_in_job_search"],

    /** 稳定在职时禁止抽中的事件 id（求职回合、泛求职季文案等） */
    jobHuntEventIdsWhenEmployed: ["job_search_cycle", "job_hunt_winter"],

    /** 稳定在职时：带任一下列 tag 的事件整类屏蔽（与 job_hunt_winter 等互补） */
    jobHuntTagsBlockedWhenEmployed: ["job_hunt"],

    /**
     * 年度静默裁员：关闭后仅通过叙事选项/意外事件里的离职进入求职态
     * 开启时仍使用 LIFE_WORK_LIFE_CONFIG.layoffProbabilityPerYear
     */
    enableSilentAnnualLayoff: false,

    /**
     * 若首胎出生后若干年仍未触发「首胎叙事」事件，自动打上 first_child_intro_completed，
     * 避免后续育儿事件永远被 requiredFlags 卡住。
     */
    autoCompleteFirstChildIntroAfterYears: 2
  };

  /**
   * 孩子阶段：阈值按「当前年龄 − 首个孩子出生时的玩家年龄」
   * phaseFlagsRemove / phaseFlagsAdd 在引擎推进时成批应用（便于与 parenting_phase_* 对齐）
   */
  window.LIFE_CHILD_STAGE_RULES = {
    stages: [
      {
        minYearsSinceFirstChild: 0,
        stage: "newborn",
        phaseFlagsRemove: [],
        phaseFlagsAdd: ["parenting_phase_newborn"]
      },
      {
        minYearsSinceFirstChild: 1,
        stage: "infant",
        phaseFlagsRemove: ["parenting_phase_newborn"],
        phaseFlagsAdd: ["parenting_phase_infant"]
      },
      {
        minYearsSinceFirstChild: 3,
        stage: "toddler",
        phaseFlagsRemove: ["parenting_phase_newborn", "parenting_phase_infant"],
        phaseFlagsAdd: ["parenting_phase_toddler"]
      },
      {
        minYearsSinceFirstChild: 5,
        stage: "kindergarten",
        phaseFlagsRemove: ["parenting_phase_newborn", "parenting_phase_infant", "parenting_phase_toddler"],
        phaseFlagsAdd: ["parenting_phase_kindergarten"]
      },
      {
        minYearsSinceFirstChild: 7,
        stage: "primary_school",
        phaseFlagsRemove: [
          "parenting_phase_newborn",
          "parenting_phase_infant",
          "parenting_phase_toddler",
          "parenting_phase_kindergarten"
        ],
        phaseFlagsAdd: ["parenting_phase_primary"]
      }
    ]
  };
})();

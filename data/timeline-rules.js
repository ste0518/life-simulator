(function () {
  "use strict";

  /**
   * 时间线阶段 + 默认同龄段约束 + 意外事件配额
   * ------------------------------------------------------------
   * 引擎读取：deriveTimelinePhase、阶段意外计数、STAGE_BANDS 与 EVENT_OVERRIDES。
   * 修改年龄边界、阶段顺序或每阶段最少意外次数：只改本文件即可。
   */

  var DOMESTIC_UNDERGRAD_IDS = [
    "elite_city_university",
    "ordinary_university",
    "local_university",
    "distant_university",
    "art_free_path",
    "gaokao_vocational_college",
    "non_gaokao_skill_path",
    "non_gaokao_family_arranged",
    "non_gaokao_gap_replan",
    "repeat_exam_route",
    "gap_year_pause"
  ];

  var OVERSEAS_EDU_IDS = ["overseas_research_path", "overseas_practical_path", "overseas_art_path"];

  var STUDENT_LIKE_EDUCATION_IDS = DOMESTIC_UNDERGRAD_IDS.concat(OVERSEAS_EDU_IDS);

  window.LIFE_TIMELINE_STUDENT_EDUCATION_IDS = STUDENT_LIKE_EDUCATION_IDS;

  /**
   * 有序：先匹配先生效。用于 deriveTimelinePhase(state)。
   * 字段语义与引擎 matchesConditions 一致（minAge/maxAge/requiredFlags/educationRouteIds…）。
   */
  window.LIFE_TIMELINE_RULES = [
    { phaseId: "family_parenting", minChildCount: 1 },
    {
      phaseId: "family_married",
      minAge: 20,
      requiredFlags: ["player_married"],
      maxChildCount: 0
    },
    {
      phaseId: "college_overseas",
      minAge: 16,
      maxAge: 32,
      educationRouteIds: OVERSEAS_EDU_IDS
    },
    {
      phaseId: "college_domestic",
      minAge: 15,
      maxAge: 30,
      educationRouteIds: DOMESTIC_UNDERGRAD_IDS,
      excludedFlags: ["life_path_overseas"]
    },
    {
      phaseId: "postgrad_career",
      minAge: 22,
      maxAge: 35,
      careerRouteIds: ["further_study_route"]
    },
    { phaseId: "high_school", minAge: 15, maxAge: 17 },
    { phaseId: "middle_school", minAge: 12, maxAge: 14 },
    { phaseId: "primary_school", minAge: 6, maxAge: 11 },
    { phaseId: "preschool", minAge: 0, maxAge: 5 },
    {
      phaseId: "career_work",
      minAge: 22,
      maxAge: 64,
      excludedEducationRouteIds: STUDENT_LIKE_EDUCATION_IDS,
      excludedCareerRouteIds: ["career_in_job_search", "unemployed_drift_route"]
    },
    {
      phaseId: "young_adult_seek",
      minAge: 18,
      maxAge: 28,
      careerRouteIds: ["career_in_job_search", "unemployed_drift_route"]
    },
    { phaseId: "young_adult", minAge: 18, maxAge: 21 },
    { phaseId: "midlife", minAge: 40, maxAge: 58 },
    { phaseId: "later_life", minAge: 59, maxAge: 120 },
    { phaseId: "adult_misc", minAge: 0, maxAge: 120 }
  ];

  /**
   * 当事件未写 timelinePhaseIds 时，用 event.stage 做「阶段与年龄」软约束，减少错位。
   * extra 对象会交给引擎与 matchesConditions 合并判断。
   */
  window.LIFE_TIMELINE_STAGE_BANDS = {
    childhood: { minAge: 0, maxAge: 5 },
    school: { minAge: 6, maxAge: 11 },
    adolescence: { minAge: 12, maxAge: 14 },
    highschool: { minAge: 15, maxAge: 17 },
    transition: { minAge: 15, maxAge: 24 },
    college: {
      minAge: 17,
      maxAge: 30,
      excludedEducationRouteIds: [],
      requireStudentOrOverseas: true
    },
    young_adult: { minAge: 18, maxAge: 40 },
    career: {
      minAge: 20,
      maxAge: 70,
      excludedEducationRouteIds: STUDENT_LIKE_EDUCATION_IDS
    },
    family: { minAge: 18, maxAge: 80 },
    midlife: { minAge: 38, maxAge: 62 },
    later_life: { minAge: 55, maxAge: 120 }
  };

  /**
   * college 带 requireStudentOrOverseas：仍在读本或留学路线时才允许 college 舞台的宽年龄事件。
   * 引擎内特殊处理（见 eventPassesTimelineRules）。
   */

  /** 按事件 id 跳过时间线或强制通过 */
  window.LIFE_TIMELINE_EVENT_OVERRIDES = {
    life_flow_padding_adult: { skipTimelineCheck: true },
    life_flow_padding_later: { skipTimelineCheck: true },
    work_location_pick_milestone: { skipTimelineCheck: true },
    housing_pick_milestone: { skipTimelineCheck: true }
  };

  /**
   * 带 accident 标签、且未写 timelinePhaseIds 的事件：除年龄带外，还须与当前 deriveTimelinePhase 的人生段落一致，
   * 避免例如「在读大学却抽到 young_adult 职场意外」。stage 为 misc 的不在此列（由事件自身 min/maxAge 约束）。
   * 键必须与 LIFE_TIMELINE_RULES 的 phaseId 一致；adult_misc 表示不额外限制；某 phase 未列出时引擎视为不限制。
   */
  window.LIFE_ACCIDENT_TIMELINE_STAGE_ALLOWLIST = {
    preschool: ["childhood"],
    primary_school: ["school"],
    middle_school: ["adolescence"],
    high_school: ["highschool", "transition"],
    college_overseas: ["college"],
    college_domestic: ["college"],
    postgrad_career: ["college", "career", "family"],
    /** 时间线规则下已婚可能排在在读之前，保留 college 以免校园意外被误挡 */
    family_parenting: ["family", "career", "college"],
    family_married: ["family", "career", "young_adult", "college"],
    career_work: ["career", "young_adult", "family", "midlife"],
    young_adult_seek: ["young_adult", "career"],
    young_adult: ["young_adult"],
    midlife: ["midlife", "family", "career", "later_life"],
    later_life: ["later_life", "midlife"],
    adult_misc: null
  };

  /**
   * 意外事件配额：accidentPhaseId 可与 deriveTimelinePhase 不同，这里单独映射「计数键」。
   * resolveAccidentPhase(state) 在引擎中实现，规则顺序与下方 phases 对齐。
   * 抽选节奏（约每 5 次非意外后出现一次意外）在 js/engine.js 的 ACCIDENT_AFTER_NORMAL_EVENTS；
   * 意外与人生段落对齐见 LIFE_ACCIDENT_TIMELINE_STAGE_ALLOWLIST。
   */
  window.LIFE_ACCIDENT_STAGE_CONFIG = {
    weightBoostUntilMet: 14,
    /** 与引擎 getAccidentPhaseId 使用的 id 一致 */
    phases: [
      { accidentPhaseId: "accident_parenting", minChildCount: 1, minAccidents: 2 },
      {
        accidentPhaseId: "accident_married",
        minAge: 22,
        requiredFlags: ["player_married"],
        maxChildCount: 0,
        minAccidents: 2
      },
      { accidentPhaseId: "accident_infant", minAge: 0, maxAge: 5, minAccidents: 2 },
      { accidentPhaseId: "accident_primary", minAge: 6, maxAge: 11, minAccidents: 2 },
      { accidentPhaseId: "accident_middle", minAge: 12, maxAge: 14, minAccidents: 2 },
      { accidentPhaseId: "accident_high", minAge: 15, maxAge: 17, minAccidents: 2 },
      {
        accidentPhaseId: "accident_college",
        minAge: 18,
        maxAge: 24,
        minAccidents: 2,
        educationRouteIds: STUDENT_LIKE_EDUCATION_IDS
      },
      {
        accidentPhaseId: "accident_young_work",
        minAge: 18,
        maxAge: 24,
        minAccidents: 2,
        excludedEducationRouteIds: STUDENT_LIKE_EDUCATION_IDS
      },
      {
        accidentPhaseId: "accident_college_late",
        minAge: 25,
        maxAge: 45,
        minAccidents: 2,
        educationRouteIds: STUDENT_LIKE_EDUCATION_IDS
      },
      {
        accidentPhaseId: "accident_work",
        minAge: 25,
        maxAge: 54,
        minAccidents: 2,
        excludedEducationRouteIds: STUDENT_LIKE_EDUCATION_IDS
      },
      { accidentPhaseId: "accident_elder", minAge: 55, maxAge: 120, minAccidents: 2 }
    ]
  };
})();

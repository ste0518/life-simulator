(function () {
  "use strict";

  const relationshipDefinitions = Array.isArray(window.LIFE_RELATIONSHIPS) ? window.LIFE_RELATIONSHIPS : [];
  const STAT_KEYS = [
    "money",
    "health",
    "mental",
    "happiness",
    "intelligence",
    "social",
    "career",
    "familySupport",
    "stress",
    "discipline"
  ];
  const STAGE_LABELS = {
    childhood: "幼年期",
    school: "小学阶段",
    adolescence: "初中阶段",
    highschool: "高中阶段",
    transition: "升学转折期",
    college: "大学 / 升学期",
    young_adult: "初入社会期",
    career: "职业发展期",
    family: "感情与家庭期",
    midlife: "中年转折期",
    later_life: "后半生 / 晚年期",
    misc: "人生支线"
  };

  const STAT_LABELS = {
    money: "金钱",
    health: "健康",
    mental: "心理状态",
    happiness: "幸福感",
    intelligence: "学业能力",
    social: "社交",
    career: "事业",
    familySupport: "家庭支持",
    stress: "压力值",
    discipline: "自律习惯"
  };

  const DEFAULT_STATS = {
    money: 0,
    health: 60,
    mental: 0,
    happiness: 0,
    intelligence: 0,
    social: 0,
    career: 0,
    familySupport: 0,
    stress: 0,
    discipline: 0
  };

  const RELATIONSHIP_STATUS_LABELS = {
    unknown: "尚未相识",
    noticed: "有点在意",
    crush: "暗暗喜欢",
    familiar: "逐渐熟悉",
    close: "关系升温",
    ambiguous: "暧昧试探",
    short_dating: "短暂交往",
    dating: "恋爱中",
    steady: "稳定交往",
    married: "共同生活",
    estranged: "渐渐疏远",
    broken: "已经分开",
    reconnected: "重新靠近"
  };

  function normalizeStringArray(value) {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => String(item || "").trim())
      .filter(Boolean);
  }

  function createInitialRelationships() {
    const relationships = {};

    relationshipDefinitions.forEach((definition) => {
      const id = typeof definition.id === "string" ? definition.id.trim() : "";
      if (!id) {
        return;
      }

      relationships[id] = {
        id,
        name: typeof definition.name === "string" ? definition.name : id,
        gender: typeof definition.gender === "string" ? definition.gender : "",
        identity: typeof definition.identity === "string" ? definition.identity : "",
        traitTags: normalizeStringArray(definition.traitTags),
        contactStyle: typeof definition.contactStyle === "string" ? definition.contactStyle : "",
        conflictStyle: typeof definition.conflictStyle === "string" ? definition.conflictStyle : "",
        affection: typeof definition.initialAffection === "number" ? definition.initialAffection : 0,
        status: typeof definition.initialStatus === "string" ? definition.initialStatus : "unknown",
        met: false,
        flags: [],
        history: []
      };
    });

    return relationships;
  }

  function createInitialState() {
    return {
      playerName: "",
      playerGender: "",
      age: 0,
      choiceCount: 0,
      stats: { ...DEFAULT_STATS },
      flags: [],
      tags: [],
      romanceFlags: [],
      history: [],
      visitedEvents: [],
      enteredEvents: [],
      currentEventId: null,
      currentEventPendingEnter: false,
      activeRelationshipId: null,
      familyBackground: null,
      pendingFamilyBackgroundId: null,
      setupStep: "naming",
      relationships: createInitialRelationships(),
      gameStarted: false,
      ending: null,
      gameOver: false
    };
  }

  function cloneState(state) {
    return JSON.parse(JSON.stringify(state));
  }

  function getStageLabel(stage) {
    return STAGE_LABELS[stage] || "人生阶段";
  }

  window.LifeState = {
    STAT_KEYS,
    STAT_LABELS,
    STAGE_LABELS,
    RELATIONSHIP_STATUS_LABELS,
    DEFAULT_STATS,
    createInitialState,
    cloneState,
    getStageLabel
  };
})();

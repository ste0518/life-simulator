(function () {
  "use strict";

  const relationshipDefinitions = Array.isArray(window.LIFE_RELATIONSHIPS) ? window.LIFE_RELATIONSHIPS : [];
  const relationshipArcDefinitions = Array.isArray(window.LIFE_RELATIONSHIP_ARCS)
    ? window.LIFE_RELATIONSHIP_ARCS
    : [];
  const relationshipArcMap = new Map(
    relationshipArcDefinitions
      .filter((arc) => arc && typeof arc.characterId === "string" && arc.characterId.trim())
      .map((arc) => [arc.characterId.trim(), arc])
  );
  const STAT_KEYS = [
    "money",
    "debt",
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
    money: "财富",
    debt: "负债",
    health: "身体健康",
    mental: "心理状态",
    happiness: "幸福感",
    intelligence: "学业能力",
    social: "社交",
    career: "事业发展",
    familySupport: "家庭支持",
    stress: "压力值",
    discipline: "自律习惯"
  };

  /** 出生登记前的中性底稿；选定家庭背景后由引擎写入财富/心理/幸福感/家庭支持与健康、压力、负债 */
  const DEFAULT_STATS = {
    money: 34,
    debt: 0,
    health: 100,
    mental: 58,
    happiness: 58,
    intelligence: 25,
    social: 25,
    career: 0,
    familySupport: 30,
    stress: 0,
    discipline: 20
  };

  const RELATIONSHIP_STATUS_LABELS = {
    unknown: "尚未相识",
    acquaintance: "初识 / 刚进入彼此生活",
    noticed: "初识 / 开始留意",
    noticed_by_them: "对方先注意到你",
    crush: "暗暗喜欢",
    mutual_crush: "双向好感",
    familiar: "逐渐熟悉",
    close: "关系升温",
    ambiguous: "暧昧试探",
    confessed: "已经说开",
    short_dating: "短暂交往",
    dating: "恋爱中",
    passionate: "热恋期",
    cooling: "冷淡期",
    conflict: "争吵拉扯",
    steady: "稳定交往",
    married: "共同生活",
    estranged: "渐渐疏远",
    breakup: "分手 / 关系断开",
    broken: "分手 / 已经分开",
    divorced: "离婚 / 婚姻结束",
    reconnect: "重逢 / 尝试修复",
    reconnected: "重逢后重新靠近",
    missed: "错过了",
    long_distance_ambiguous: "远距离暧昧",
    cross_border_ambiguous: "跨国暧昧",
    long_distance_dating: "异国恋维系中",
    distance_cooling: "异地后逐渐降温",
    triangle: "两段关系拉扯中",
    hidden_double_track: "双线隐瞒中",
    exposed_double_track: "双线关系曝光",
    rebuilding_distance: "异地后尝试修复"
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
      const arcDefinition = relationshipArcMap.get(id) || null;

      relationships[id] = {
        id,
        name: typeof definition.name === "string" ? definition.name : id,
        arcId: arcDefinition && typeof arcDefinition.arcId === "string" ? arcDefinition.arcId : id,
        gender: typeof definition.gender === "string" ? definition.gender : "",
        identity: typeof definition.identity === "string" ? definition.identity : "",
        stageTags: normalizeStringArray(definition.stageTags),
        roleTags: normalizeStringArray(definition.roleTags),
        traitTags: normalizeStringArray(definition.traitTags),
        exclusiveEvents:
          arcDefinition && Array.isArray(arcDefinition.exclusiveEvents)
            ? normalizeStringArray(arcDefinition.exclusiveEvents)
            : [],
        contactStyle: typeof definition.contactStyle === "string" ? definition.contactStyle : "",
        conflictStyle: typeof definition.conflictStyle === "string" ? definition.conflictStyle : "",
        affection: typeof definition.initialAffection === "number" ? definition.initialAffection : 0,
        status: typeof definition.initialStatus === "string" ? definition.initialStatus : "unknown",
        relationshipStage: typeof definition.initialStatus === "string" ? definition.initialStatus : "unknown",
        appearance: definition && definition.appearance && typeof definition.appearance === "object" ? { ...definition.appearance } : {},
        availability:
          definition && definition.availability && typeof definition.availability === "object"
            ? { ...definition.availability }
            : {},
        romanceProfile:
          definition && definition.romanceProfile && typeof definition.romanceProfile === "object"
            ? { ...definition.romanceProfile }
            : {},
        familiarity:
          definition &&
          definition.initialMetrics &&
          typeof definition.initialMetrics.familiarity === "number"
            ? definition.initialMetrics.familiarity
            : 0,
        trust:
          definition &&
          definition.initialMetrics &&
          typeof definition.initialMetrics.trust === "number"
            ? definition.initialMetrics.trust
            : 0,
        ambiguity:
          definition &&
          definition.initialMetrics &&
          typeof definition.initialMetrics.ambiguity === "number"
            ? definition.initialMetrics.ambiguity
            : 0,
        playerInterest:
          definition &&
          definition.initialMetrics &&
          typeof definition.initialMetrics.playerInterest === "number"
            ? definition.initialMetrics.playerInterest
            : 0,
        theirInterest:
          definition &&
          definition.initialMetrics &&
          typeof definition.initialMetrics.theirInterest === "number"
            ? definition.initialMetrics.theirInterest
            : 0,
        tension:
          definition &&
          definition.initialMetrics &&
          typeof definition.initialMetrics.tension === "number"
            ? definition.initialMetrics.tension
            : 0,
        commitment:
          definition &&
          definition.initialMetrics &&
          typeof definition.initialMetrics.commitment === "number"
            ? definition.initialMetrics.commitment
            : 0,
        continuity:
          definition &&
          definition.initialMetrics &&
          typeof definition.initialMetrics.continuity === "number"
            ? definition.initialMetrics.continuity
            : 0,
        interactionCount: 0,
        lastInteractionAge: null,
        partnerSinceAge: null,
        marriedSinceAge: null,
        growthArcId: "",
        growthModifiers: {},
        growthResolvedStages: [],
        met: false,
        flags: [],
        sharedHistory: [],
        history: [],
        partnerFamilyRevealed: false
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
      eventVisitCounts: {},
      recentEventIds: [],
      /**
       * 叙事去重：最近若干次选择对应的事件签名（含换皮簇），用于降低短窗口内同类事件连刷。
       * 每项：{ id, s: 签名或 null, a: 年龄, c: choiceCount }
       */
      recentStoryDedupe: [],
      /** 每个叙事签名最后一次触发时的年龄；配合事件的 dedupeMinAgeGap（年） */
      storyDedupeSigLastAge: {},
      currentEventId: null,
      currentEventPendingEnter: false,
      activeRelationshipId: null,
      familyBackground: null,
      pendingFamilyBackgroundId: null,
      educationRoute: null,
      careerRoute: null,
      lifePath: null,
      gaokao: {
        regionId: "",
        regionName: "",
        totalScore: 750,
        attempted: false,
        score: null,
        baseScore: null,
        performance: "",
        performanceLabel: "",
        performanceNarrative: "",
        tierId: "",
        tierLabel: "",
        destinationPoolId: "",
        destinationLabel: "",
        willingnessToLeaveHome: null,
        majorPreference: "",
        notes: [],
        recommendedUniversities: []
      },
      overseas: {
        active: false,
        routeId: "",
        routeName: "",
        selectedUniversityName: "",
        selectedUniversityCountry: "",
        destination: "",
        supportLevel: "",
        phase: "",
        housingType: "",
        budgetMode: "",
        languagePressure: 0,
        loneliness: 0,
        financePressure: 0,
        academicPressure: 0,
        culturalStress: 0,
        homesickness: 0,
        socialComfort: 0,
        belonging: 0,
        independence: 0,
        burnout: 0,
        careerClarity: 0,
        visaPressure: 0,
        identityShift: 0,
        stayScore: 0,
        returnScore: 0,
        domesticConnectionIds: [],
        newConnectionIds: [],
        supportNetworkIds: [],
        mentorIds: [],
        branchFocuses: [],
        doubleTrack: false,
        exposureRisk: 0,
        academicIndex: null,
        qsBandId: "",
        qsBandLabel: "",
        recommendedUniversities: [],
        studyLoanActive: false,
        studyLoanBalance: 0,
        studyLoanDebtStatContribution: 0,
        fundingMode: ""
      },
      inventory: {},
      children: {
        count: 0,
        tags: [],
        careMode: "",
        lastCareEventAge: null,
        /** 与 LIFE_CHILD_STAGE_RULES 对齐：none / newborn / infant / … */
        stage: "",
        /** 首个孩子出生时的玩家年龄；用于阶段推进与事件条件 */
        firstChildBornAtAge: null
      },
      workLife: {
        workLocationId: "",
        housingId: "",
        jobApplicationsSent: 0,
        /** idle | job_seeking | placement_pending | employed — 由引擎在求职/入职节点维护 */
        employmentStatus: "",
        employedCareerRouteId: "",
        employedSinceAge: null
      },
      economyLedger: {
        lastSettledAge: -1
      },
      /** 各「意外阶段」已触发过的意外事件次数，键与 data/timeline-rules.js 中 accidentPhaseId 对齐 */
      accidentCountsByPhase: {},
      /** 自上次「意外」事件以来，已完成的非意外事件次数（用于约 5:1 节奏） */
      eventsSinceLastAccident: 0,
      /**
       * 健康/压力系统：连续若干次结算后健康仍为 0 的计数（用于「身体尽头」类结局缓冲）。
       * 由引擎在每次属性联动结算后维护；读档时需随 state 一并序列化（若你后续做存档）。
       */
      wellbeingTracking: {
        healthZeroConsecutiveSteps: 0,
        /** 联动结算时压力连续处于高位的步数（用于慢性心理拖累，见 js/stress-mental-balance.js） */
        highStressStreak: 0,
        /** 联动结算时心理连续偏低的步数 */
        lowMentalStreak: 0,
        /** 心理连续处于极低位的步数（用于身体损耗，见 js/stress-mental-balance.js） */
        lowMentalHealthStreak: 0
      },
      setupStep: "naming",
      /**
       * 关系里程碑是否已触发（按角色 id），例如 affection80：好感首次达 80 的自动婚姻讨论。
       * 引擎写入；存档时需一并序列化。
       */
      relationshipMilestonesFired: {},
      /**
       * 下一回合优先展示的强制事件（绕过常规加权的里程碑等）。
       * { eventId: string, partnerId?: string }
       */
      pendingForcedEvent: null,
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

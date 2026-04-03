(function () {
  "use strict";

  const stateApi = window.LifeState;
  const relationshipDefinitions = normalizeRelationshipDefinitions(window.LIFE_RELATIONSHIPS || []);
  const relationshipDefinitionMap = new Map(relationshipDefinitions.map((item) => [item.id, item]));
  const relationshipArcDefinitions = Array.isArray(window.LIFE_RELATIONSHIP_ARCS)
    ? window.LIFE_RELATIONSHIP_ARCS
    : [];
  const relationshipArcMap = new Map(
    relationshipArcDefinitions
      .filter((arc) => arc && typeof arc.characterId === "string" && arc.characterId.trim())
      .map((arc) => [arc.characterId.trim(), arc])
  );
  const rawEvents = [
    ...(Array.isArray(window.LIFE_EVENTS) ? window.LIFE_EVENTS : []),
    ...(Array.isArray(window.LIFE_EXTRA_EVENTS) ? window.LIFE_EXTRA_EVENTS : [])
  ];
  const allEvents = normalizeEventList(rawEvents);
  const eventMap = new Map(allEvents.map((event) => [event.id, event]));
  const allEndings = normalizeEndingList(window.LIFE_ENDINGS || []);
  const allFamilyBackgrounds = normalizeFamilyBackgroundList(window.LIFE_FAMILY_BACKGROUNDS || []);
  const familyBackgroundMap = new Map(allFamilyBackgrounds.map((background) => [background.id, background]));
  const allEducationRoutes = normalizeRouteList(window.LIFE_EDUCATION_ROUTES || [], "education");
  const educationRouteMap = new Map(allEducationRoutes.map((route) => [route.id, route]));
  const allCareerRoutes = normalizeRouteList(window.LIFE_CAREER_ROUTES || [], "career");
  const careerRouteMap = new Map(allCareerRoutes.map((route) => [route.id, route]));
  const gaokaoConfig =
    window.LIFE_GAOKAO_CONFIG && typeof window.LIFE_GAOKAO_CONFIG === "object" ? window.LIFE_GAOKAO_CONFIG : {};
  const gaokaoRegions = Array.isArray(window.LIFE_GAOKAO_REGIONS) ? window.LIFE_GAOKAO_REGIONS : [];
  const universityPools =
    window.LIFE_UNIVERSITY_POOLS && typeof window.LIFE_UNIVERSITY_POOLS === "object"
      ? window.LIFE_UNIVERSITY_POOLS
      : {};
  const realDomesticUniversities =
    window.LIFE_REAL_DOMESTIC_UNIVERSITIES && typeof window.LIFE_REAL_DOMESTIC_UNIVERSITIES === "object"
      ? window.LIFE_REAL_DOMESTIC_UNIVERSITIES
      : {};
  const overseasQsBands = Array.isArray(window.LIFE_OVERSEAS_QS_BANDS) ? window.LIFE_OVERSEAS_QS_BANDS : [];
  const realOverseasUniversities =
    window.LIFE_REAL_OVERSEAS_UNIVERSITIES && typeof window.LIFE_REAL_OVERSEAS_UNIVERSITIES === "object"
      ? window.LIFE_REAL_OVERSEAS_UNIVERSITIES
      : {};
  const nonGaokaoRouteConfig =
    window.LIFE_NON_GAOKAO_ROUTES && typeof window.LIFE_NON_GAOKAO_ROUTES === "object"
      ? window.LIFE_NON_GAOKAO_ROUTES
      : {};
  const overseasRouteConfig =
    window.LIFE_OVERSEAS_ROUTE_CONFIG && typeof window.LIFE_OVERSEAS_ROUTE_CONFIG === "object"
      ? window.LIFE_OVERSEAS_ROUTE_CONFIG
      : {};
  const lifeShopItems = Array.isArray(window.LIFE_SHOP_ITEMS) ? window.LIFE_SHOP_ITEMS : [];
  const shopItemMap = new Map(lifeShopItems.map((item) => [item.id, item]));
  const lifeShopConfigGlobal =
    window.LIFE_SHOP_CONFIG && typeof window.LIFE_SHOP_CONFIG === "object" ? window.LIFE_SHOP_CONFIG : {};
  const MANUAL_SHOP_MIN_AGE = typeof lifeShopConfigGlobal.minAge === "number" ? lifeShopConfigGlobal.minAge : 7;
  const MANUAL_SHOP_MAX_AGE = typeof lifeShopConfigGlobal.maxAge === "number" ? lifeShopConfigGlobal.maxAge : 55;

  const lifeWorkLifeConfig =
    window.LIFE_WORK_LIFE_CONFIG && typeof window.LIFE_WORK_LIFE_CONFIG === "object" ? window.LIFE_WORK_LIFE_CONFIG : {};
  const lifeJobApplicationConfig =
    window.LIFE_JOB_APPLICATION_CONFIG && typeof window.LIFE_JOB_APPLICATION_CONFIG === "object"
      ? window.LIFE_JOB_APPLICATION_CONFIG
      : {};
  const lifeFamilyRevealConfig =
    window.LIFE_FAMILY_REVEAL_CONFIG && typeof window.LIFE_FAMILY_REVEAL_CONFIG === "object"
      ? window.LIFE_FAMILY_REVEAL_CONFIG
      : {};
  const partnerFamilyById =
    window.LIFE_PARTNER_FAMILY_BY_ID && typeof window.LIFE_PARTNER_FAMILY_BY_ID === "object"
      ? window.LIFE_PARTNER_FAMILY_BY_ID
      : {};
  const partnerBioSnippets =
    window.LIFE_PARTNER_BIO_SNIPPETS && typeof window.LIFE_PARTNER_BIO_SNIPPETS === "object"
      ? window.LIFE_PARTNER_BIO_SNIPPETS
      : {};
  const careerZeroSalaryIds = Array.isArray(window.LIFE_CAREER_NON_EARNING_IDS)
    ? window.LIFE_CAREER_NON_EARNING_IDS
    : ["career_in_job_search"];

  function isShopItemUnlockedForState(item, state) {
    if (!item || !state) {
      return false;
    }
    const age = typeof state.age === "number" ? state.age : 0;
    const minA = typeof item.shopMinAge === "number" ? item.shopMinAge : MANUAL_SHOP_MIN_AGE;
    const maxA = typeof item.shopMaxAge === "number" ? item.shopMaxAge : MANUAL_SHOP_MAX_AGE;
    if (age < minA || age > maxA) {
      return false;
    }
    if (typeof item.shopRequiresMinChildCount === "number") {
      const c = state.children && typeof state.children.count === "number" ? state.children.count : 0;
      if (c < item.shopRequiresMinChildCount) {
        return false;
      }
    }
    const flags = Array.isArray(state.flags) ? state.flags : [];
    if (Array.isArray(item.shopRequiresFlags) && item.shopRequiresFlags.length) {
      if (!item.shopRequiresFlags.every((f) => flags.includes(f))) {
        return false;
      }
    }
    if (Array.isArray(item.shopRequiresAnyFlags) && item.shopRequiresAnyFlags.length) {
      if (!item.shopRequiresAnyFlags.some((f) => flags.includes(f))) {
        return false;
      }
    }
    return true;
  }

  const lifeGiftEffects =
    window.LIFE_GIFT_EFFECTS && typeof window.LIFE_GIFT_EFFECTS === "object" ? window.LIFE_GIFT_EFFECTS : {};
  const lifeOverseasFinance =
    window.LIFE_OVERSEAS_FINANCE && typeof window.LIFE_OVERSEAS_FINANCE === "object" ? window.LIFE_OVERSEAS_FINANCE : {};
  const lifeCharacterGrowth =
    window.LIFE_CHARACTER_GROWTH && typeof window.LIFE_CHARACTER_GROWTH === "object" ? window.LIFE_CHARACTER_GROWTH : {};
  const lifeMarriageConfig =
    (lifeCharacterGrowth && lifeCharacterGrowth.marriageConfig) ||
    (window.LIFE_MARRIAGE_CONFIG && typeof window.LIFE_MARRIAGE_CONFIG === "object" ? window.LIFE_MARRIAGE_CONFIG : {}) ||
    {};
  /** 侧栏求婚按钮、好感 80 里程碑等（见 data/life-romance-marriage-divorce-expansion.js） */
  const lifeProposalSidebarConfig =
    window.LIFE_PROPOSAL_SIDEBAR_CONFIG && typeof window.LIFE_PROPOSAL_SIDEBAR_CONFIG === "object"
      ? window.LIFE_PROPOSAL_SIDEBAR_CONFIG
      : {};
  const lifeAccidentStageConfig =
    window.LIFE_ACCIDENT_STAGE_CONFIG && typeof window.LIFE_ACCIDENT_STAGE_CONFIG === "object"
      ? window.LIFE_ACCIDENT_STAGE_CONFIG
      : {};
  const OVERSEAS_PHASE_LABELS = {
    arrival: "初到适应期",
    settling: "初步融入期",
    parallel: "学业与社交并行期",
    independent: "独立生活期",
    complex: "关系复杂化阶段",
    decision: "毕业去向选择期"
  };
  const OVERSEAS_PHASE_FLAGS = Object.keys(OVERSEAS_PHASE_LABELS).map((phaseId) => "overseas_phase_" + phaseId);
  const OVERSEAS_FOCUS_LABELS = {
    academic: "学业导向",
    social: "社交扩张",
    career: "实习 / 事业导向",
    survival: "节省生存",
    romance: "情感纠葛",
    isolation: "失衡 / 孤立"
  };
  const OVERSEAS_FOCUS_FLAGS = Object.keys(OVERSEAS_FOCUS_LABELS).map((focusId) => "overseas_focus_" + focusId);
  const OVERSEAS_DERIVED_FLAGS = [
    "overseas_study_loan_strain",
    "overseas_finance_high",
    "overseas_finance_breathing_room",
    "overseas_lonely",
    "overseas_settled",
    "overseas_isolated",
    "overseas_burnout_risk",
    "overseas_academically_stable",
    "overseas_academic_overload",
    "overseas_culture_gap_high",
    "overseas_independent_strong",
    "overseas_career_clear",
    "overseas_visa_anxiety",
    "overseas_stay_bias",
    "overseas_return_bias"
  ];
  const OPTION_TEXT_REWRITES = new Map([
    ["你决定慢慢接纳自己，不再总和别人比较。", "慢慢接纳自己，不再总和别人比较。"],
    ["你去了寄宿学校，很多事开始只能自己消化。", "把自己放进寄宿生活，很多事开始只能自己消化。"],
    ["你决定按父母的期待冲一个更体面的专业或学校。", "顺着父母的期待，去冲一个更体面的专业或学校。"],
    ["你去和老师谈了一次，把真实状态摊开讲。", "和老师认真谈一次，把真实状态摊开讲。"],
    ["你去更大的城市，想换一个更高的平台看看自己能走多远。", "去更大的城市，把自己放到更高的平台上试一试。"],
    ["你决定继续深造，想把学术和专业能力推到更高处。", "把时间继续押在深造上，想把专业能力再往上推一层。"],
    ["你去挣钱，先把眼前的生活和家里那口气顶住。", "先把力气放在挣钱上，把眼前的生活和家里那口气顶住。"],
    ["你去做最见人的销售或服务岗，很快练出了和人打交道的本事。", "把自己放进最见人的销售或服务岗，很快练出了和人打交道的本事。"],
    ["你去了小团队或创业公司，赌的是成长速度和可能性。", "把自己放进小团队或创业公司，赌的是成长速度和可能性。"],
    ["你决定一起把生活搭起来，不求轰烈，但求踏实。", "一起把生活搭起来，不求轰烈，但求踏实。"],
    ["你选择继续轻装，不被房子过早固定住。", "继续轻装往前走，不被房子过早固定住。"],
    ["你决定迎接孩子，接受日常从此被重新排序。", "迎接孩子，接受日常从此被重新排序。"],
    ["你决定把该谈的都谈清楚，认真修这段关系。", "把该谈的都谈清楚，认真修这段关系。"],
    ["你决定自己更多在场，事业节奏也因此明显变慢。", "把更多时间留给在场和陪伴，事业节奏也因此明显变慢。"],
    ["你决定做稳而深的专业型角色，不盲目追头衔。", "把位置放在稳而深的专业角色上，不盲目追头衔。"]
  ]);

  let gameState = stateApi.createInitialState();

  function getState() {
    return stateApi.cloneState(gameState);
  }

  function normalizeName(name) {
    const trimmed = String(name || "").trim();
    return trimmed || "无名氏";
  }

  function normalizePlayerGender(gender) {
    return gender === "female" ? "female" : gender === "male" ? "male" : "";
  }

  function getPlayerGenderLabel(gender) {
    if (gender === "male") {
      return "男孩";
    }

    if (gender === "female") {
      return "女孩";
    }

    return "未选择";
  }

  function normalizeStringArray(value) {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => String(item || "").trim())
      .filter(Boolean);
  }

  function normalizeStatsObject(value) {
    const source = value && typeof value === "object" ? value : {};
    const result = {};

    Object.entries(source).forEach(([key, amount]) => {
      if (typeof amount === "number" && Number.isFinite(amount)) {
        result[key] = amount;
      }
    });

    return result;
  }

  function normalizeNumberMap(value) {
    const source = value && typeof value === "object" ? value : {};
    const result = {};

    Object.entries(source).forEach(([key, amount]) => {
      if (typeof amount === "number" && Number.isFinite(amount)) {
        result[String(key)] = amount;
      }
    });

    return result;
  }

  function normalizeMapOfStringArrays(value) {
    const source = value && typeof value === "object" ? value : {};
    const result = {};

    Object.entries(source).forEach(([key, list]) => {
      result[String(key)] = normalizeStringArray(list);
    });

    return result;
  }

  function normalizeStringMap(value) {
    const source = value && typeof value === "object" ? value : {};
    const result = {};

    Object.entries(source).forEach(([key, item]) => {
      if (typeof item === "string" && item.trim()) {
        result[String(key)] = item.trim();
      }
    });

    return result;
  }

  function cloneLooseObject(value) {
    if (!value || typeof value !== "object") {
      return null;
    }

    return JSON.parse(JSON.stringify(value));
  }

  function normalizeEffectsObject(value) {
    const source = value && typeof value === "object" ? value : {};
    const result = {
      stats: normalizeStatsObject(source.stats)
    };

    if (typeof source.age === "number" && Number.isFinite(source.age)) {
      result.age = source.age;
    }

    return result;
  }

  function normalizeRelationshipDefinitions(definitions) {
    return definitions
      .map((definition) => {
        const source = definition && typeof definition === "object" ? definition : {};
        const id = typeof source.id === "string" ? source.id.trim() : "";
        if (!id) {
          return null;
        }

        return {
          id,
          name: typeof source.name === "string" ? source.name : id,
          gender: typeof source.gender === "string" ? source.gender : "",
          identity: typeof source.identity === "string" ? source.identity : "",
          stageTags: normalizeStringArray(source.stageTags),
          roleTags: normalizeStringArray(source.roleTags),
          traitTags: normalizeStringArray(source.traitTags),
          contactStyle: typeof source.contactStyle === "string" ? source.contactStyle : "",
          conflictStyle: typeof source.conflictStyle === "string" ? source.conflictStyle : "",
          initialAffection: typeof source.initialAffection === "number" ? source.initialAffection : 0,
          initialStatus: typeof source.initialStatus === "string" ? source.initialStatus : "unknown",
          initialMetrics:
            source.initialMetrics && typeof source.initialMetrics === "object" ? { ...source.initialMetrics } : {},
          appearance: source.appearance && typeof source.appearance === "object" ? { ...source.appearance } : {},
          availability:
            source.availability && typeof source.availability === "object" ? { ...source.availability } : {},
          romanceProfile:
            source.romanceProfile && typeof source.romanceProfile === "object" ? { ...source.romanceProfile } : {}
        };
      })
      .filter(Boolean);
  }

  function normalizeRouteObject(route, index, routeType) {
    const source = route && typeof route === "object" ? route : {};

    return {
      id: typeof source.id === "string" && source.id.trim() ? source.id.trim() : routeType + "_route_" + String(index + 1),
      type: routeType,
      name: typeof source.name === "string" && source.name.trim() ? source.name.trim() : "未命名路线",
      category: typeof source.category === "string" ? source.category : "",
      summary: typeof source.summary === "string" ? source.summary : "",
      description: typeof source.description === "string" ? source.description : "",
      optionText: typeof source.optionText === "string" ? source.optionText : "",
      weight: typeof source.weight === "number" ? source.weight : 1,
      conditions: normalizeConditionObject(source.conditions || {}),
      apply: normalizeMutationBlock(source.apply),
      details: normalizeStringArray(source.details),
      meta: cloneLooseObject(source.meta) || {}
    };
  }

  function normalizeRouteList(routes, routeType) {
    return routes
      .map((route, index) => normalizeRouteObject(route, index, routeType))
      .filter((route) => route.id);
  }

  function normalizeRelationshipEffect(effect) {
    const source = effect && typeof effect === "object" ? effect : {};

    return {
      targetId: typeof source.targetId === "string" ? source.targetId.trim() : "",
      affection: typeof source.affection === "number" ? source.affection : 0,
      familiarity: typeof source.familiarity === "number" ? source.familiarity : 0,
      trust: typeof source.trust === "number" ? source.trust : 0,
      ambiguity: typeof source.ambiguity === "number" ? source.ambiguity : 0,
      playerInterest: typeof source.playerInterest === "number" ? source.playerInterest : 0,
      theirInterest: typeof source.theirInterest === "number" ? source.theirInterest : 0,
      tension: typeof source.tension === "number" ? source.tension : 0,
      commitment: typeof source.commitment === "number" ? source.commitment : 0,
      continuity: typeof source.continuity === "number" ? source.continuity : 0,
      interactions: typeof source.interactions === "number" ? source.interactions : 0,
      status: typeof source.status === "string" ? source.status : "",
      addFlags: normalizeStringArray(source.addFlags),
      removeFlags: normalizeStringArray(source.removeFlags),
      addSharedHistory: normalizeStringArray(source.addSharedHistory),
      removeSharedHistory: normalizeStringArray(source.removeSharedHistory),
      history: typeof source.history === "string" ? source.history : "",
      setActive: Boolean(source.setActive),
      clearActive: Boolean(source.clearActive)
    };
  }

  function normalizeDebtToMoneyPrison(raw) {
    if (!raw || typeof raw !== "object") {
      return null;
    }

    const debtAbove =
      typeof raw.debtAbove === "number" && Number.isFinite(raw.debtAbove) ? raw.debtAbove : null;
    const moneyMultiple =
      typeof raw.moneyMultiple === "number" && Number.isFinite(raw.moneyMultiple) ? raw.moneyMultiple : null;

    if (debtAbove === null || moneyMultiple === null) {
      return null;
    }

    return { debtAbove, moneyMultiple };
  }

  function matchesDebtToMoneyPrisonRule(rule, state) {
    if (!rule || typeof rule.debtAbove !== "number" || typeof rule.moneyMultiple !== "number") {
      return false;
    }

    const debt = state.stats.debt || 0;
    const money = state.stats.money || 0;

    return debt > rule.debtAbove && debt >= rule.moneyMultiple * money;
  }

  function normalizeConditionObject(source, event) {
    const conditions = source || {};

    return {
      minAge:
        typeof conditions.minAge === "number"
          ? conditions.minAge
          : event && typeof event.minAge === "number"
            ? event.minAge
            : null,
      maxAge:
        typeof conditions.maxAge === "number"
          ? conditions.maxAge
          : event && typeof event.maxAge === "number"
            ? event.maxAge
            : null,
      minChoices: typeof conditions.minChoices === "number" ? conditions.minChoices : null,
      maxChoices: typeof conditions.maxChoices === "number" ? conditions.maxChoices : null,
      minStats: normalizeStatsObject(conditions.minStats),
      maxStats: normalizeStatsObject(conditions.maxStats),
      requiredFlags: normalizeStringArray(conditions.requiredFlags || conditions.hasFlags),
      excludedFlags: normalizeStringArray(conditions.excludedFlags || conditions.lacksFlags),
      requiredTags: normalizeStringArray(conditions.requiredTags),
      excludedTags: normalizeStringArray(conditions.excludedTags),
      requiredRomanceFlags: normalizeStringArray(conditions.requiredRomanceFlags),
      excludedRomanceFlags: normalizeStringArray(conditions.excludedRomanceFlags),
      someFlags: normalizeStringArray(conditions.someFlags),
      visited: normalizeStringArray(conditions.visited),
      notVisited: normalizeStringArray(conditions.notVisited),
      knownRelationships: normalizeStringArray(conditions.knownRelationships),
      unknownRelationships: normalizeStringArray(conditions.unknownRelationships),
      activeRelationshipIds: normalizeStringArray(conditions.activeRelationshipIds),
      activeRelationshipStatuses: normalizeStringArray(conditions.activeRelationshipStatuses),
      anyRelationshipStatuses: normalizeStringArray(conditions.anyRelationshipStatuses),
      relationshipStatuses: normalizeMapOfStringArrays(conditions.relationshipStatuses),
      excludedRelationshipStatuses: normalizeMapOfStringArrays(conditions.excludedRelationshipStatuses),
      requiredRelationshipFlags: normalizeMapOfStringArrays(conditions.requiredRelationshipFlags),
      excludedRelationshipFlags: normalizeMapOfStringArrays(conditions.excludedRelationshipFlags),
      requiredSharedHistory: normalizeMapOfStringArrays(conditions.requiredSharedHistory),
      excludedSharedHistory: normalizeMapOfStringArrays(conditions.excludedSharedHistory),
      minAffection: normalizeNumberMap(conditions.minAffection),
      maxAffection: normalizeNumberMap(conditions.maxAffection),
      minFamiliarity: normalizeNumberMap(conditions.minFamiliarity),
      minTrust: normalizeNumberMap(conditions.minTrust),
      minAmbiguity: normalizeNumberMap(conditions.minAmbiguity),
      minPlayerInterest: normalizeNumberMap(conditions.minPlayerInterest),
      minTheirInterest: normalizeNumberMap(conditions.minTheirInterest),
      maxTension: normalizeNumberMap(conditions.maxTension),
      minCommitment: normalizeNumberMap(conditions.minCommitment),
      minContinuity: normalizeNumberMap(conditions.minContinuity),
      minInteractionCount: normalizeNumberMap(conditions.minInteractionCount),
      familyBackgroundIds: normalizeStringArray(conditions.familyBackgroundIds),
      excludedFamilyBackgroundIds: normalizeStringArray(conditions.excludedFamilyBackgroundIds),
      educationRouteIds: normalizeStringArray(conditions.educationRouteIds),
      excludedEducationRouteIds: normalizeStringArray(conditions.excludedEducationRouteIds),
      careerRouteIds: normalizeStringArray(conditions.careerRouteIds),
      excludedCareerRouteIds: normalizeStringArray(conditions.excludedCareerRouteIds),
      anyRelationshipMinAffection:
        typeof conditions.anyRelationshipMinAffection === "number"
          ? conditions.anyRelationshipMinAffection
          : null,
      activeRelationshipMinAffection:
        typeof conditions.activeRelationshipMinAffection === "number"
          ? conditions.activeRelationshipMinAffection
          : null,
      activeRelationshipMaxAffection:
        typeof conditions.activeRelationshipMaxAffection === "number"
          ? conditions.activeRelationshipMaxAffection
          : null,
      activeRelationshipMinFamiliarity:
        typeof conditions.activeRelationshipMinFamiliarity === "number"
          ? conditions.activeRelationshipMinFamiliarity
          : null,
      activeRelationshipMinTrust:
        typeof conditions.activeRelationshipMinTrust === "number" ? conditions.activeRelationshipMinTrust : null,
      activeRelationshipMinPlayerInterest:
        typeof conditions.activeRelationshipMinPlayerInterest === "number"
          ? conditions.activeRelationshipMinPlayerInterest
          : null,
      activeRelationshipMinTheirInterest:
        typeof conditions.activeRelationshipMinTheirInterest === "number"
          ? conditions.activeRelationshipMinTheirInterest
          : null,
      activeRelationshipMaxTension:
        typeof conditions.activeRelationshipMaxTension === "number" ? conditions.activeRelationshipMaxTension : null,
      activeRelationshipMinCommitment:
        typeof conditions.activeRelationshipMinCommitment === "number"
          ? conditions.activeRelationshipMinCommitment
          : null,
      activeRelationshipMinContinuity:
        typeof conditions.activeRelationshipMinContinuity === "number"
          ? conditions.activeRelationshipMinContinuity
          : null,
      requiredActiveRelationshipFlags: normalizeStringArray(conditions.requiredActiveRelationshipFlags),
      excludedActiveRelationshipFlags: normalizeStringArray(conditions.excludedActiveRelationshipFlags),
      activeRelationshipRequiredSharedHistory: normalizeStringArray(conditions.activeRelationshipRequiredSharedHistory),
      activeRelationshipExcludedSharedHistory: normalizeStringArray(conditions.activeRelationshipExcludedSharedHistory),
      activeRelationshipMinInteractionCount:
        typeof conditions.activeRelationshipMinInteractionCount === "number"
          ? conditions.activeRelationshipMinInteractionCount
          : null,
      activeRelationshipMinPartnerAgeSpan:
        typeof conditions.activeRelationshipMinPartnerAgeSpan === "number"
          ? conditions.activeRelationshipMinPartnerAgeSpan
          : null,
      noCurrentPartner: Boolean(conditions.noCurrentPartner),
      minChildCount:
        typeof conditions.minChildCount === "number" ? conditions.minChildCount : null,
      maxChildCount:
        typeof conditions.maxChildCount === "number" ? conditions.maxChildCount : null,
      inventoryMin: normalizeNumberMap(conditions.inventoryMin),
      minHealthZeroStreak:
        typeof conditions.minHealthZeroStreak === "number" ? conditions.minHealthZeroStreak : null,
      requireHealthCollapseContext: Boolean(conditions.requireHealthCollapseContext),
      debtPrisonOrFlag: Boolean(conditions.debtPrisonOrFlag),
      debtToMoneyPrison: normalizeDebtToMoneyPrison(conditions.debtToMoneyPrison)
    };
  }

  function normalizeMutationBlock(block) {
    const source = block && typeof block === "object" ? block : {};
    let setActiveRelationship = null;
    let setEducationRoute = null;
    let setCareerRoute = null;

    if (Object.prototype.hasOwnProperty.call(source, "setActiveRelationship")) {
      setActiveRelationship =
        typeof source.setActiveRelationship === "string" ? source.setActiveRelationship.trim() : null;
    }

    if (Object.prototype.hasOwnProperty.call(source, "setEducationRoute")) {
      setEducationRoute = typeof source.setEducationRoute === "string" ? source.setEducationRoute.trim() : null;
    }

    if (Object.prototype.hasOwnProperty.call(source, "setCareerRoute")) {
      setCareerRoute = typeof source.setCareerRoute === "string" ? source.setCareerRoute.trim() : null;
    }

    return {
      effects: normalizeEffectsObject(source.effects),
      addFlags: normalizeStringArray(source.addFlags),
      removeFlags: normalizeStringArray(source.removeFlags),
      addTags: normalizeStringArray(source.addTags),
      removeTags: normalizeStringArray(source.removeTags),
      addRomanceFlags: normalizeStringArray(source.addRomanceFlags),
      removeRomanceFlags: normalizeStringArray(source.removeRomanceFlags),
      relationshipEffects: Array.isArray(source.relationshipEffects)
        ? source.relationshipEffects.map(normalizeRelationshipEffect).filter((item) => item.targetId)
        : [],
      setActiveRelationship,
      setEducationRoute,
      setCareerRoute,
      clearActiveRelationship: Boolean(source.clearActiveRelationship),
      log: typeof source.log === "string" ? source.log : "",
      customAction: typeof source.customAction === "string" ? source.customAction.trim() : "",
      customPayload: cloneLooseObject(source.customPayload)
    };
  }

  function normalizeFamilyMeta(source) {
    const raw = source && typeof source === "object" ? source : {};
    const bias = raw.longTermBias && typeof raw.longTermBias === "object" ? raw.longTermBias : {};
    return {
      tier: typeof raw.tier === "string" ? raw.tier : "",
      advantages: normalizeStringArray(raw.advantages),
      costs: normalizeStringArray(raw.costs),
      longTermBias: { ...bias }
    };
  }

  function normalizeFamilyBackgroundObject(background, index) {
    const source = background && typeof background === "object" ? background : {};
    const fallbackId = "family_background_" + String(index + 1);

    return {
      id: typeof source.id === "string" && source.id.trim() ? source.id.trim() : fallbackId,
      name: typeof source.name === "string" && source.name.trim() ? source.name.trim() : "普通家庭",
      summary: typeof source.summary === "string" ? source.summary : "",
      description: typeof source.description === "string" ? source.description : "",
      details: normalizeStringArray(source.details),
      dimensions: normalizeStringMap(source.dimensions),
      weight: typeof source.weight === "number" ? source.weight : 1,
      storyHookTags: normalizeStringArray(source.storyHookTags),
      meta: normalizeFamilyMeta(source.meta),
      apply: normalizeMutationBlock(source.apply)
    };
  }

  function normalizeFamilyBackgroundList(backgrounds) {
    return backgrounds
      .map((background, index) => normalizeFamilyBackgroundObject(background, index))
      .filter((background) => background.id);
  }

  function normalizeChoiceObject(choice, event) {
    const source = choice && typeof choice === "object" ? choice : {};
    const normalizedChoice = normalizeMutationBlock(source);

    normalizedChoice.text = typeof source.text === "string" ? source.text : "继续";
    normalizedChoice.conditions = normalizeConditionObject(source.conditions, event);

    if (Object.prototype.hasOwnProperty.call(source, "next")) {
      normalizedChoice.next = source.next;
    }

    normalizedChoice.directHealth = Boolean(source.directHealth);

    return normalizedChoice;
  }

  function shouldDelayEnterAge(effectsOnEnter, choices) {
    if (!effectsOnEnter || !effectsOnEnter.effects || effectsOnEnter.effects.age <= 0) {
      return false;
    }

    if (!Array.isArray(choices) || !choices.length) {
      return false;
    }

    return choices.every((choice) => (choice.effects && choice.effects.age) > 0);
  }

  function getDefaultEventCooldown(stage, repeatable) {
    if (!repeatable) {
      return 0;
    }

    if (stage === "later_life") {
      return 12;
    }

    if (stage === "midlife") {
      return 10;
    }

    if (stage === "school" || stage === "adolescence" || stage === "highschool" || stage === "college") {
      return 9;
    }

    return 8;
  }

  function getDefaultEventMaxVisits(stage, repeatable) {
    if (!repeatable) {
      return null;
    }

    if (stage === "later_life" || stage === "midlife") {
      return 2;
    }

    if (stage === "school" || stage === "adolescence" || stage === "highschool" || stage === "college") {
      return 2;
    }

    return 3;
  }

  function normalizeEventObject(event, index) {
    const source = event && typeof event === "object" ? event : {};
    const repeatable = Boolean(source.repeatable);
    const tags = normalizeStringArray(source.tags);
    const rawId = typeof source.id === "string" && source.id.trim() ? source.id.trim() : "";
    const fallbackId = "event_" + String(index + 1);
    const normalizedEvent = {
      id: rawId || fallbackId,
      stage: typeof source.stage === "string" && source.stage.trim() ? source.stage.trim() : "misc",
      title: typeof source.title === "string" && source.title.trim() ? source.title.trim() : "未命名事件",
      text: typeof source.text === "string" ? source.text : "",
      minAge: typeof source.minAge === "number" ? source.minAge : null,
      maxAge: typeof source.maxAge === "number" ? source.maxAge : null,
      weight: typeof source.weight === "number" ? source.weight : 1,
      tags,
      /** 可选：同一 key 的事件视为同一「叙事簇」，短窗口内最多出现一个 */
      dedupeKey: typeof source.dedupeKey === "string" && source.dedupeKey.trim() ? source.dedupeKey.trim() : "",
      /** 可选：覆盖默认的「最近几次选择内禁止同签名」宽度 */
      dedupeSpacingChoices:
        typeof source.dedupeSpacingChoices === "number" && source.dedupeSpacingChoices >= 0
          ? Math.floor(source.dedupeSpacingChoices)
          : null,
      /** 可选：同一签名两次触发至少间隔的年数（与 spacing 同时生效） */
      dedupeMinAgeGap:
        typeof source.dedupeMinAgeGap === "number" && source.dedupeMinAgeGap > 0
          ? Math.floor(source.dedupeMinAgeGap)
          : null,
      /** 为 true 时不参与叙事签名去重（兜底、填充、里程碑等） */
      skipNarrativeDedupe:
        Boolean(source.skipNarrativeDedupe) ||
        tags.indexOf("life_padding") !== -1 ||
        (rawId && /_milestone$/.test(rawId)),
      repeatable,
      cooldownChoices:
        typeof source.cooldownChoices === "number"
          ? Math.max(0, source.cooldownChoices)
          : getDefaultEventCooldown(typeof source.stage === "string" ? source.stage.trim() : "misc", repeatable),
      maxVisits:
        typeof source.maxVisits === "number"
          ? Math.max(1, source.maxVisits)
          : getDefaultEventMaxVisits(typeof source.stage === "string" ? source.stage.trim() : "misc", repeatable),
      /** 为 true 时该事件的入场/选项中负向 health 不受叙事过滤（慎用，便于单条事件精调） */
      directHealthEffects: Boolean(source.directHealthEffects)
    };

    normalizedEvent.conditions = normalizeConditionObject(source.conditions, normalizedEvent);
    normalizedEvent.effectsOnEnter = normalizeMutationBlock(source.effectsOnEnter);
    normalizedEvent.choices = Array.isArray(source.choices)
      ? source.choices.map((choice) => normalizeChoiceObject(choice, normalizedEvent))
      : [];
    normalizedEvent.deferEnterAge = shouldDelayEnterAge(normalizedEvent.effectsOnEnter, normalizedEvent.choices);
    normalizedEvent.familyStoryHookTags = normalizeStringArray(source.familyStoryHookTags);
    normalizedEvent.timelinePhaseIds = normalizeStringArray(source.timelinePhaseIds);

    return normalizedEvent;
  }

  function normalizeEventList(events) {
    const normalizedEvents = [];
    const indexById = new Map();

    events.forEach((event, index) => {
      const normalizedEvent = normalizeEventObject(event, index);

      if (indexById.has(normalizedEvent.id)) {
        normalizedEvents[indexById.get(normalizedEvent.id)] = normalizedEvent;
        return;
      }

      indexById.set(normalizedEvent.id, normalizedEvents.length);
      normalizedEvents.push(normalizedEvent);
    });

    return normalizedEvents;
  }

  function normalizeWeightModifier(modifier) {
    const source = modifier && typeof modifier === "object" ? modifier : {};

    return {
      weight: typeof source.weight === "number" ? source.weight : 0,
      when: normalizeConditionObject(source.when || {})
    };
  }

  function normalizeEndingObject(ending, index) {
    const source = ending && typeof ending === "object" ? ending : {};

    return {
      id: typeof source.id === "string" && source.id.trim() ? source.id.trim() : "ending_" + String(index + 1),
      title: typeof source.title === "string" ? source.title : "未命名结局",
      text: typeof source.text === "string" ? source.text : "",
      instant: Boolean(source.instant),
      baseWeight: typeof source.baseWeight === "number" ? source.baseWeight : 1,
      require: normalizeConditionObject(source.require || {}),
      weightModifiers: Array.isArray(source.weightModifiers)
        ? source.weightModifiers.map(normalizeWeightModifier)
        : []
    };
  }

  function normalizeEndingList(endings) {
    return endings.map((ending, index) => normalizeEndingObject(ending, index));
  }

  function clampStat(key, value) {
    return Math.max(0, Math.min(100, value));
  }

  function clampAffection(value) {
    return Math.max(0, Math.min(100, value));
  }

  function clampRelationshipMetric(value) {
    return Math.max(0, Math.min(100, value));
  }

  function getChildCount(state) {
    const c = state && state.children;
    return c && typeof c.count === "number" ? Math.max(0, c.count) : 0;
  }

  function ensureInventoryBag(state) {
    if (!state.inventory || typeof state.inventory !== "object") {
      state.inventory = {};
    }
    return state.inventory;
  }

  function getInventoryItemCount(state, itemId) {
    const bag = ensureInventoryBag(state);
    return Math.max(0, bag[itemId] || 0);
  }

  /**
   * 留学资金：始终允许选择出国；扣款规则见 applyStudyAbroadFunding（与 data/life-systems.js 配置一致）。
   */
  function resolveOverseasFunding() {
    return { ok: true, mode: "dynamic" };
  }

  /**
   * 自动还贷（仅留学贷款 studyLoanBalance）：
   * 规则：仅当 财富 > 贷款余额（严格大于）时，一次性还清。
   * 若 财富 === 贷款余额，不触发自动还贷（需财富再增加至少 1）。
   * 这样「刚好够」不会自动清零，避免与某些事件数值边界打架；全文仅此一处定义。
   */
  function autoRepayStudyLoan() {
    const os = ensureOverseasState();
    const balance = Math.max(0, os.studyLoanBalance || 0);
    if (balance <= 0) {
      if (os.studyLoanActive) {
        os.studyLoanActive = false;
        os.studyLoanDebtStatContribution = 0;
        removeGameFlags(["overseas_study_loan", "study_abroad_debt"]);
        syncOverseasDerivedFlags();
      }
      return;
    }

    const money = gameState.stats.money || 0;
    if (money <= balance) {
      return;
    }

    const contribution = typeof os.studyLoanDebtStatContribution === "number" ? os.studyLoanDebtStatContribution : 0;
    adjustStat("money", -balance);
    if (contribution > 0) {
      const debtNow = gameState.stats.debt || 0;
      adjustStat("debt", -Math.min(contribution, debtNow));
    }

    os.studyLoanBalance = 0;
    os.studyLoanActive = false;
    os.studyLoanDebtStatContribution = 0;
    os.fundingMode = os.fundingMode ? os.fundingMode + "_loan_cleared" : "loan_cleared";
    removeGameFlags(["overseas_study_loan", "study_abroad_debt"]);
    syncOverseasDerivedFlags();

    const msgs = normalizeStringArray((lifeOverseasFinance.autoRepayLoanMessages || []).slice());
    const line =
      msgs.length > 0
        ? msgs[Math.floor(Math.random() * msgs.length)]
        : "终于还清了留学贷款，手头第一次轻了一点。";
    addHistory(line);
  }

  /**
   * 出国一次性扣费：财富 > cashFullPayThreshold 时扣满 tuitionCost，无贷款；
   * 否则用尽当前财富支付 tuition，差额记入 studyLoanBalance。
   */
  function applyStudyAbroadFunding(tuition) {
    const costCfg = lifeOverseasFinance.overseasCostConfig || {};
    const loanCfg = lifeOverseasFinance.loanConfig || {};
    const t = typeof tuition === "number" ? tuition : typeof costCfg.tuitionCost === "number" ? costCfg.tuitionCost : 30;
    const threshold =
      typeof costCfg.cashFullPayThreshold === "number" ? costCfg.cashFullPayThreshold : 50;
    const money = gameState.stats.money || 0;
    const os = ensureOverseasState();
    const fullDebtBump = typeof loanCfg.addDebtStat === "number" ? loanCfg.addDebtStat : 30;
    const fullStress = typeof loanCfg.addStress === "number" ? loanCfg.addStress : 4;
    const fullFinPressure = typeof loanCfg.financePressureBonus === "number" ? loanCfg.financePressureBonus : 28;

    let financeExtraFromLoan = 0;
    let budgetLoanNote = "";

    if (money > threshold) {
      adjustStat("money", -t);
      os.studyLoanActive = false;
      os.studyLoanBalance = 0;
      os.studyLoanDebtStatContribution = 0;
      os.fundingMode = "cash_full";
      removeGameFlags(["overseas_study_loan", "study_abroad_debt"]);
      addGameFlags(["overseas_paid_cash_tuition"]);
      addHistory("你的财富超过 " + threshold + "，出国费用一次性从存款里扣清，没有签下留学贷款。");
    } else {
      const pay = Math.min(money, t);
      const loanAmt = Math.max(0, t - pay);
      adjustStat("money", -pay);

      if (loanAmt > 0) {
        const ratio = loanAmt / t;
        const debtPart = Math.max(0, Math.round(ratio * fullDebtBump));
        os.studyLoanDebtStatContribution = debtPart;
        adjustStat("debt", debtPart);
        adjustStat("stress", Math.max(0, Math.round(ratio * fullStress)));
        addGameFlags(["overseas_study_loan", "study_abroad_debt"]);
        financeExtraFromLoan = ratio * fullFinPressure;
        budgetLoanNote = "贷款后极度节省";
        os.studyLoanActive = true;
        os.studyLoanBalance = loanAmt;
        os.fundingMode = "cash_split_loan";
        addHistory(
          "出国费用共 " +
            t +
            "：你先用手头 " +
            pay +
            " 顶上，剩余 " +
            loanAmt +
            " 记作留学贷款，之后账本会一直提醒你。"
        );
      } else {
        os.studyLoanActive = false;
        os.studyLoanBalance = 0;
        os.studyLoanDebtStatContribution = 0;
        os.fundingMode = "cash_edge_no_loan";
        removeGameFlags(["overseas_study_loan", "study_abroad_debt"]);
        addHistory("你用当前积蓄刚好盖住了出国首期，没有额外贷款。");
      }
    }

    return { financeExtraFromLoan, budgetLoanNote };
  }

  function computeTeenVirtueScore(relationship) {
    const def = relationshipDefinitionMap.get(relationship.id);
    const rp = def && def.romanceProfile ? def.romanceProfile : {};
    const lt = typeof rp.longTermPotential === "number" ? rp.longTermPotential : 55;
    const vol = typeof rp.volatility === "number" ? rp.volatility : 45;
    return Math.max(8, Math.min(92, lt * 0.55 + (100 - vol) * 0.45));
  }

  function pickProfileBucketForBio(relationship, age) {
    const a = typeof age === "number" ? age : 0;
    if (relationship.status === "married" && a >= 24) {
      return "married";
    }
    if (a >= 40) {
      return "mature";
    }
    if (a >= 28) {
      return "young_adult_deep";
    }
    if (a >= 24) {
      return "work_early";
    }
    if (a >= 22) {
      return "graduate_transition";
    }
    if (a >= 18) {
      return "college";
    }
    if (a >= 14) {
      return "highschool";
    }
    if (a >= 11) {
      return "adolescence";
    }
    return "youth";
  }

  function resolveRelationshipDynamicBio(relationship, state) {
    if (!relationship || !state) {
      return { text: "", stageKey: "", arcLabel: "" };
    }
    const pool = lifeCharacterGrowth.characterStageProfiles || {};
    const packs = pool[relationship.id] || pool._default || {};
    const defPacks = lifeCharacterGrowth.defaultStageProfiles || {};
    const bucket = pickProfileBucketForBio(relationship, state.age);
    const byArc = packs.byArc && relationship.growthArcId ? packs.byArc[relationship.growthArcId] : null;
    const raw =
      (byArc && byArc[bucket]) ||
      packs[bucket] ||
      defPacks[bucket] ||
      packs.college ||
      relationship.identity ||
      "";
    const name = relationship.name || "TA";
    let text = String(raw).replace(/\{name\}/g, name);
    const bioExtra = resolvePartnerBioExtra(relationship, state);
    if (bioExtra) {
      text = text ? text + "\n\n" + bioExtra : bioExtra;
    }
    let arcLabel = "";
    const pools = lifeCharacterGrowth.characterGrowthPools || {};
    const gPool = pools[relationship.id] || pools._default;
    if (relationship.growthArcId && gPool && Array.isArray(gPool.arcs)) {
      const hit = gPool.arcs.find(function (x) {
        return x && x.id === relationship.growthArcId;
      });
      if (hit && hit.label) {
        arcLabel = hit.label;
      }
    }
    return { text, stageKey: bucket, arcLabel };
  }

  function resolvePrimaryGrowthArcIfNeeded(relationship) {
    if (!relationship || !relationship.met) {
      return;
    }
    if (relationship.growthArcId) {
      return;
    }
    if (!Array.isArray(relationship.growthResolvedStages)) {
      relationship.growthResolvedStages = [];
    }
    if (relationship.growthResolvedStages.includes("primary_arc")) {
      return;
    }
    const pools = lifeCharacterGrowth.characterGrowthPools || {};
    const pool = pools[relationship.id] || pools._default;
    if (!pool || !Array.isArray(pool.arcs) || !pool.arcs.length) {
      return;
    }
    const rollAge = typeof pool.rollAge === "number" ? pool.rollAge : 17;
    if ((gameState.age || 0) < rollAge) {
      return;
    }
    const virtue = computeTeenVirtueScore(relationship) / 100;
    const weights = pool.arcs.map(function (arc) {
      const vb = typeof arc.virtueBias === "number" ? arc.virtueBias : 1;
      const vc = typeof arc.viceBias === "number" ? arc.viceBias : 1;
      const base = typeof arc.weight === "number" ? arc.weight : 1;
      return Math.max(0.05, base * (virtue * vb + (1 - virtue) * vc));
    });
    const total = weights.reduce(function (s, w) {
      return s + w;
    }, 0);
    let roll = Math.random() * total;
    let chosen = pool.arcs[pool.arcs.length - 1];
    for (let i = 0; i < pool.arcs.length; i++) {
      roll -= weights[i];
      if (roll <= 0) {
        chosen = pool.arcs[i];
        break;
      }
    }
    relationship.growthArcId = chosen && chosen.id ? chosen.id : "warm_stable";
    relationship.growthResolvedStages.push("primary_arc");
    if (!relationship.growthModifiers || typeof relationship.growthModifiers !== "object") {
      relationship.growthModifiers = {};
    }
    const mods = chosen && chosen.modifiers && typeof chosen.modifiers === "object" ? chosen.modifiers : {};
    Object.keys(mods).forEach(function (k) {
      const v = mods[k];
      if (typeof v === "number") {
        relationship.growthModifiers[k] = (relationship.growthModifiers[k] || 0) + v;
      }
    });
    normalizeStringArray(chosen && chosen.addArcFlags).forEach(function (f) {
      if (f && !relationship.flags.includes(f)) {
        relationship.flags.push(f);
      }
    });
    addHistory(
      (relationship.name || "对方") + "的成长慢慢显出走向：" + ((chosen && chosen.label) || relationship.growthArcId) + "。"
    );
  }

  function runRelationshipGrowthHooks(ageBefore, ageAfter) {
    if (ageAfter <= ageBefore) {
      return;
    }
    Object.values(gameState.relationships || {}).forEach(function (rel) {
      if (!rel || !rel.met) {
        return;
      }
      resolvePrimaryGrowthArcIfNeeded(rel);
    });
  }

  function isPartnerStatus(status) {
    return [
      "dating",
      "passionate",
      "cooling",
      "conflict",
      "steady",
      "married",
      "reconnect",
      "reconnected",
      "long_distance_dating",
      "distance_cooling",
      "hidden_double_track",
      "exposed_double_track",
      "rebuilding_distance"
    ].includes(status);
  }

  function refreshRelationshipAffection(relationship) {
    if (!relationship) {
      return;
    }

    const derived = Math.round(
      (relationship.affection || 0) * 0.4 +
        (relationship.familiarity || 0) * 0.12 +
        (relationship.trust || 0) * 0.18 +
        (relationship.playerInterest || 0) * 0.12 +
        (relationship.theirInterest || 0) * 0.12 +
        (relationship.commitment || 0) * 0.12 +
        (relationship.continuity || 0) * 0.08 -
        (relationship.tension || 0) * 0.14
    );

    relationship.affection = clampAffection(Math.round(((relationship.affection || 0) + derived) / 2));
  }

  function notePartnerSinceAge(relationship) {
    if (!relationship) {
      return;
    }
    const track = [
      "dating",
      "passionate",
      "steady",
      "long_distance_dating",
      "conflict",
      "cooling",
      "married",
      "hidden_double_track",
      "exposed_double_track",
      "rebuilding_distance",
      "distance_cooling"
    ];
    if (
      track.includes(relationship.status) &&
      (relationship.partnerSinceAge === null || relationship.partnerSinceAge === undefined)
    ) {
      relationship.partnerSinceAge = gameState.age;
    }
  }

  function inferRelationshipStatus(relationship) {
    if (!relationship) {
      return;
    }

    if (["breakup", "broken", "missed", "divorced"].includes(relationship.status)) {
      syncRelationshipStage(relationship);
      return;
    }

    if (relationship.status === "married") {
      syncRelationshipStage(relationship);
      notePartnerSinceAge(relationship);
      return;
    }

    const gm = relationship.growthModifiers || {};
    const relax = Math.min(10, ((gm.stability || 0) + (gm.warmth || 0) * 0.5) * 0.07);

    if (
      (relationship.commitment || 0) >= 78 - relax &&
      (relationship.trust || 0) >= 72 - relax * 0.45 &&
      (relationship.affection || 0) >= 70 - relax * 0.45
    ) {
      relationship.status = "steady";
      syncRelationshipStage(relationship);
      notePartnerSinceAge(relationship);
      return;
    }

    if ((relationship.commitment || 0) >= 48 && (relationship.tension || 0) >= 60) {
      relationship.status = "conflict";
      syncRelationshipStage(relationship);
      notePartnerSinceAge(relationship);
      return;
    }

    if ((relationship.commitment || 0) >= 48 && (relationship.tension || 0) >= 38) {
      relationship.status = "cooling";
      syncRelationshipStage(relationship);
      notePartnerSinceAge(relationship);
      return;
    }

    if (
      (relationship.commitment || 0) >= 46 &&
      (relationship.playerInterest || 0) >= 56 &&
      (relationship.theirInterest || 0) >= 56
    ) {
      relationship.status = (relationship.tension || 0) >= 34 ? "dating" : "passionate";
      syncRelationshipStage(relationship);
      notePartnerSinceAge(relationship);
      return;
    }

    if (
      (relationship.playerInterest || 0) >= 48 &&
      (relationship.theirInterest || 0) >= 48 &&
      (relationship.ambiguity || 0) >= 28
    ) {
      relationship.status = "ambiguous";
      syncRelationshipStage(relationship);
      notePartnerSinceAge(relationship);
      return;
    }

    if (
      (relationship.playerInterest || 0) >= 42 &&
      (relationship.theirInterest || 0) >= 42 &&
      (relationship.familiarity || 0) >= 28
    ) {
      relationship.status = "mutual_crush";
      syncRelationshipStage(relationship);
      notePartnerSinceAge(relationship);
      return;
    }

    if ((relationship.familiarity || 0) >= 45 && (relationship.trust || 0) >= 36) {
      relationship.status = "close";
      syncRelationshipStage(relationship);
      notePartnerSinceAge(relationship);
      return;
    }

    if ((relationship.familiarity || 0) >= 20 || (relationship.trust || 0) >= 18) {
      relationship.status = "familiar";
      syncRelationshipStage(relationship);
      notePartnerSinceAge(relationship);
      return;
    }

    if ((relationship.theirInterest || 0) >= 20 && (relationship.playerInterest || 0) < 18) {
      relationship.status = "noticed_by_them";
      syncRelationshipStage(relationship);
      notePartnerSinceAge(relationship);
      return;
    }

    if ((relationship.playerInterest || 0) >= 18 || (relationship.theirInterest || 0) >= 18) {
      relationship.status = "crush";
      syncRelationshipStage(relationship);
      notePartnerSinceAge(relationship);
      return;
    }

    if ((relationship.affection || 0) > 0 || relationship.met) {
      relationship.status = "noticed";
    }
    syncRelationshipStage(relationship);
    notePartnerSinceAge(relationship);
  }

  function syncRelationshipStage(relationship) {
    if (!relationship) {
      return;
    }

    relationship.relationshipStage = relationship.status || "unknown";
  }

  function adjustStat(key, delta) {
    if (!delta) {
      return;
    }

    let appliedDelta = delta;
    if ((key === "intelligence" || key === "discipline") && gameState.age <= 20) {
      if (delta > 0) {
        appliedDelta += 1;
      } else if (delta < 0) {
        appliedDelta = Math.min(0, delta + 1);
      }
    }

    const currentValue = gameState.stats[key] || 0;
    gameState.stats[key] = clampStat(key, currentValue + appliedDelta);
  }

  function getHealthWellbeingConfig() {
    const raw = window.LIFE_HEALTH_WELLBEING_CONFIG;
    return raw && typeof raw === "object" ? raw : {};
  }

  function getStressMentalBalanceConfig() {
    const raw = window.LIFE_STRESS_MENTAL_BALANCE;
    return raw && typeof raw === "object" ? raw : {};
  }

  function getInitialStatsConfig() {
    const raw = window.LIFE_INITIAL_STATS_CONFIG;
    return raw && typeof raw === "object" ? raw : {};
  }

  const FAMILY_BACKGROUND_CORE_STAT_KEYS = ["money", "debt", "health", "mental", "happiness", "stress", "familySupport"];

  function applyFamilyBackgroundCoreStats(backgroundId) {
    const cfg = getInitialStatsConfig();
    const fixed = cfg.fixedAtStart && typeof cfg.fixedAtStart === "object" ? cfg.fixedAtStart : {};
    const fallback =
      cfg.neutralBackgroundFallback && typeof cfg.neutralBackgroundFallback === "object"
        ? cfg.neutralBackgroundFallback
        : { money: 34, mental: 58, happiness: 58, familySupport: 30 };
    const map = cfg.familyBackgroundStats && typeof cfg.familyBackgroundStats === "object" ? cfg.familyBackgroundStats : {};
    const id = typeof backgroundId === "string" ? backgroundId.trim() : "";
    const row = id && map[id] && typeof map[id] === "object" ? map[id] : fallback;

    gameState.stats.health = clampStat("health", typeof fixed.health === "number" ? fixed.health : 100);
    gameState.stats.stress = clampStat("stress", typeof fixed.stress === "number" ? fixed.stress : 0);
    gameState.stats.debt = clampStat("debt", typeof fixed.debt === "number" ? fixed.debt : 0);

    ["money", "mental", "happiness", "familySupport"].forEach(function (k) {
      if (typeof row[k] === "number") {
        gameState.stats[k] = clampStat(k, row[k]);
      }
    });
  }

  function getStressMentalNarrativeHaystack(settings) {
    const parts = [];
    const ev = settings && settings.mutationEvent;
    const ch = settings && settings.mutationChoice;
    if (ev) {
      parts.push(ev.title || "", ev.text || "");
    }
    if (ch) {
      parts.push(ch.text || "", ch.log || "");
    }
    return parts.join("\n");
  }

  function narrativeMatchesKeywordList(haystack, list) {
    if (!haystack || !Array.isArray(list)) {
      return false;
    }
    return list.some(function (kw) {
      return kw && haystack.indexOf(kw) !== -1;
    });
  }

  function eventHasAnyTag(event, tags) {
    if (!event || !Array.isArray(event.tags) || !Array.isArray(tags)) {
      return false;
    }
    return tags.some(function (t) {
      return t && event.tags.indexOf(t) !== -1;
    });
  }

  function scaleStressStatDelta(delta, settings) {
    const smb = getStressMentalBalanceConfig();
    if (smb.enabled === false || typeof delta !== "number" || !delta) {
      return delta;
    }
    if (settings && settings.preserveRawStressMental === true) {
      return Math.round(delta);
    }
    const ev = settings && settings.mutationEvent;
    const ch = settings && settings.mutationChoice;
    const hay = getStressMentalNarrativeHaystack(settings);
    const rise = typeof smb.eventStressRiseScale === "number" ? smb.eventStressRiseScale : 0.36;
    const relief = typeof smb.eventStressReliefScale === "number" ? smb.eventStressReliefScale : 0.95;
    if (delta > 0) {
      if (ch && ch.explicitStress === true) {
        return Math.round(delta);
      }
      if (eventHasAnyTag(ev, smb.explicitStressEventTags || [])) {
        return Math.round(delta);
      }
      if (narrativeMatchesKeywordList(hay, smb.explicitStressNarrativeKeywords || [])) {
        return Math.round(delta);
      }
      return Math.round(delta * rise);
    }
    if (delta < 0) {
      if (narrativeMatchesKeywordList(hay, smb.explicitRecoveryNarrativeKeywords || [])) {
        return Math.round(delta);
      }
      return Math.round(delta * relief);
    }
    return delta;
  }

  function scaleMentalStatDelta(delta, settings) {
    const smb = getStressMentalBalanceConfig();
    if (smb.enabled === false || typeof delta !== "number" || !delta) {
      return delta;
    }
    if (settings && settings.preserveRawStressMental === true) {
      return Math.round(delta);
    }
    const ev = settings && settings.mutationEvent;
    const ch = settings && settings.mutationChoice;
    const hay = getStressMentalNarrativeHaystack(settings);
    const harm = typeof smb.eventMentalHarmScale === "number" ? smb.eventMentalHarmScale : 0.4;
    const boost = typeof smb.eventMentalRecoveryScale === "number" ? smb.eventMentalRecoveryScale : 1.08;
    if (delta < 0) {
      if (ch && ch.explicitMental === true) {
        return Math.round(delta);
      }
      if (eventHasAnyTag(ev, smb.explicitMentalHarmEventTags || [])) {
        return Math.round(delta);
      }
      if (narrativeMatchesKeywordList(hay, smb.explicitMentalHarmNarrativeKeywords || [])) {
        return Math.round(delta);
      }
      return Math.floor(delta * harm);
    }
    if (delta > 0) {
      if (ch && ch.explicitMental === true) {
        return Math.round(delta);
      }
      if (narrativeMatchesKeywordList(hay, smb.explicitRecoveryNarrativeKeywords || [])) {
        return Math.round(delta);
      }
      return Math.round(delta * boost);
    }
    return delta;
  }

  function eventTagsAllowDirectHealth(event, cfg) {
    if (!event || !cfg || !Array.isArray(cfg.directHealthEventTags)) {
      return false;
    }
    const tags = event.tags || [];
    return cfg.directHealthEventTags.some(function (t) {
      return tags.indexOf(t) !== -1;
    });
  }

  function narrativeAllowsDirectHealth(haystack, cfg) {
    if (!haystack || !cfg || !Array.isArray(cfg.healthNarrativeKeywords)) {
      return false;
    }
    return cfg.healthNarrativeKeywords.some(function (kw) {
      return kw && haystack.indexOf(kw) !== -1;
    });
  }

  function resolveNegativeHealthStatDelta(rawDelta, options) {
    const cfg = getHealthWellbeingConfig();
    if (typeof rawDelta !== "number" || rawDelta >= 0) {
      return rawDelta;
    }
    if (cfg.enabled === false || cfg.filterUncontextualNegativeHealth === false) {
      return rawDelta;
    }
    const settings = options || {};
    if (settings.allowAnyHealthEffects) {
      return rawDelta;
    }
    const event = settings.mutationEvent || null;
    const choice = settings.mutationChoice || null;
    if (choice && choice.directHealth) {
      return rawDelta;
    }
    if (event && event.directHealthEffects) {
      return rawDelta;
    }
    if (event && eventTagsAllowDirectHealth(event, cfg)) {
      return rawDelta;
    }
    const parts = [];
    if (event) {
      parts.push(event.title || "", event.text || "");
    }
    if (choice) {
      parts.push(choice.text || "");
    }
    const hay = parts.join("\n");
    if (narrativeAllowsDirectHealth(hay, cfg)) {
      return rawDelta;
    }
    return 0;
  }

  function applyResolvedHealthStatDelta(delta, options) {
    const cfg = getHealthWellbeingConfig();
    const settings = options || {};
    if (typeof delta !== "number" || !delta) {
      return 0;
    }
    if (delta < 0) {
      let v = resolveNegativeHealthStatDelta(delta, settings);
      if (v < 0) {
        const mult =
          typeof cfg.contextualNegativeHealthMultiplier === "number" ? cfg.contextualNegativeHealthMultiplier : 1;
        v = Math.round(v * mult);
      }
      return v;
    }
    if (settings.allowAnyHealthEffects) {
      return Math.round(delta);
    }
    if (cfg.enabled === false) {
      return Math.round(delta);
    }
    const softStart = typeof cfg.positiveHealthDiminishFrom === "number" ? cfg.positiveHealthDiminishFrom : 72;
    const factor = typeof cfg.positiveHealthHighRecoveryFactor === "number" ? cfg.positiveHealthHighRecoveryFactor : 0.58;
    const fullBelow = typeof cfg.positiveHealthFullRecoveryBelow === "number" ? cfg.positiveHealthFullRecoveryBelow : 52;
    const h = gameState.stats.health || 0;
    if (h >= softStart) {
      return Math.max(0, Math.round(delta * factor));
    }
    if (h <= fullBelow) {
      return Math.round(delta);
    }
    const span = softStart - fullBelow;
    const t = span > 0 ? (h - fullBelow) / span : 1;
    const scale = 1 - t * (1 - factor);
    return Math.max(0, Math.round(delta * scale));
  }

  function matchesHealthCollapseContextForEnding(state) {
    const cfg = getHealthWellbeingConfig();
    if (cfg.endingHealthZeroRequireContext === false) {
      return true;
    }
    const st = state && state.stats ? state.stats : {};
    const stress = typeof st.stress === "number" ? st.stress : 0;
    const age = state && typeof state.age === "number" ? state.age : 0;
    const choices = state && typeof state.choiceCount === "number" ? state.choiceCount : 0;
    const flags = (state && state.flags) || [];
    if (stress >= (typeof cfg.healthCollapseMinStress === "number" ? cfg.healthCollapseMinStress : 70)) {
      return true;
    }
    if (age >= (typeof cfg.healthCollapseMinAgeFallback === "number" ? cfg.healthCollapseMinAgeFallback : 45)) {
      return true;
    }
    if (
      choices >=
      (typeof cfg.healthCollapseMinChoicesFallback === "number" ? cfg.healthCollapseMinChoicesFallback : 72)
    ) {
      return true;
    }
    const some = Array.isArray(cfg.healthCollapseSomeFlags) ? cfg.healthCollapseSomeFlags : [];
    if (some.some(function (f) {
      return f && flags.indexOf(f) !== -1;
    })) {
      return true;
    }
    const streak =
      state &&
      state.wellbeingTracking &&
      typeof state.wellbeingTracking.healthZeroConsecutiveSteps === "number"
        ? state.wellbeingTracking.healthZeroConsecutiveSteps
        : 0;
    if (streak >= (typeof cfg.healthZeroEndingAbsoluteStreak === "number" ? cfg.healthZeroEndingAbsoluteStreak : 8)) {
      return true;
    }
    return false;
  }

  function syncWellbeingTrackingAfterMutation() {
    const cfg = getHealthWellbeingConfig();
    if (!gameState.wellbeingTracking || typeof gameState.wellbeingTracking !== "object") {
      gameState.wellbeingTracking = { healthZeroConsecutiveSteps: 0 };
    }
    const h = typeof gameState.stats.health === "number" ? gameState.stats.health : 0;
    if (h <= 0) {
      gameState.wellbeingTracking.healthZeroConsecutiveSteps =
        (gameState.wellbeingTracking.healthZeroConsecutiveSteps || 0) + 1;
    } else {
      gameState.wellbeingTracking.healthZeroConsecutiveSteps = 0;
    }
    const riskFlag = typeof cfg.healthRiskFlag === "string" && cfg.healthRiskFlag ? cfg.healthRiskFlag : "health_at_risk";
    const enter = typeof cfg.healthRiskBandEnter === "number" ? cfg.healthRiskBandEnter : 16;
    const clearAbove = typeof cfg.healthRiskBandClear === "number" ? cfg.healthRiskBandClear : 20;
    if (h <= enter) {
      if (gameState.flags.indexOf(riskFlag) === -1) {
        gameState.flags.push(riskFlag);
      }
    } else if (h >= clearAbove) {
      gameState.flags = gameState.flags.filter(function (f) {
        return f !== riskFlag;
      });
    }
  }

  function getRelationshipSnapshot(state, relationshipId) {
    const id = String(relationshipId || "").trim();
    if (!id || !state || !state.relationships) {
      return null;
    }

    return state.relationships[id] || null;
  }

  function applyDerivedStatLinks() {
    const derivedChanges = {};
    const currentPartner = getCurrentPartner(gameState);
    const hw = getHealthWellbeingConfig();
    const smb = getStressMentalBalanceConfig();
    const d = smb.derived && typeof smb.derived === "object" ? smb.derived : {};
    const stress = gameState.stats.stress || 0;
    const lowHTh = typeof hw.lowHealthMentalThreshold === "number" ? hw.lowHealthMentalThreshold : 28;
    const lowHM = typeof hw.lowHealthMentalPenalty === "number" ? hw.lowHealthMentalPenalty : -1;
    const lowHH = typeof hw.lowHealthHappinessPenalty === "number" ? hw.lowHealthHappinessPenalty : -1;

    function addChange(key, delta) {
      if (!delta) {
        return;
      }

      derivedChanges[key] = (derivedChanges[key] || 0) + delta;
    }

    if (!gameState.wellbeingTracking || typeof gameState.wellbeingTracking !== "object") {
      gameState.wellbeingTracking = {
        healthZeroConsecutiveSteps: 0,
        highStressStreak: 0,
        lowMentalStreak: 0,
        lowMentalHealthStreak: 0
      };
    }
    const wt = gameState.wellbeingTracking;
    if (typeof wt.highStressStreak !== "number") {
      wt.highStressStreak = 0;
    }
    if (typeof wt.lowMentalStreak !== "number") {
      wt.lowMentalStreak = 0;
    }
    if (typeof wt.lowMentalHealthStreak !== "number") {
      wt.lowMentalHealthStreak = 0;
    }

    const chronicTh = typeof smb.chronicStressThreshold === "number" ? smb.chronicStressThreshold : 72;
    if (stress >= chronicTh) {
      wt.highStressStreak += 1;
    } else {
      wt.highStressStreak = 0;
    }
    const chronicMin = typeof smb.chronicStressMinConsecutiveSteps === "number" ? smb.chronicStressMinConsecutiveSteps : 5;
    if (wt.highStressStreak >= chronicMin && stress >= chronicTh) {
      addChange("mental", typeof smb.chronicStressMentalPerStep === "number" ? smb.chronicStressMentalPerStep : -1);
      addChange("happiness", typeof smb.chronicStressHappinessPerStep === "number" ? smb.chronicStressHappinessPerStep : 0);
    }

    const mentalNow = gameState.stats.mental || 0;
    const lowMTh = typeof smb.chronicLowMentalThreshold === "number" ? smb.chronicLowMentalThreshold : 32;
    if (mentalNow <= lowMTh) {
      wt.lowMentalStreak += 1;
    } else {
      wt.lowMentalStreak = 0;
    }
    const lowMMin = typeof smb.chronicLowMentalMinSteps === "number" ? smb.chronicLowMentalMinSteps : 6;
    if (wt.lowMentalStreak >= lowMMin && mentalNow <= lowMTh) {
      addChange("stress", typeof smb.chronicLowMentalStressPerStep === "number" ? smb.chronicLowMentalStressPerStep : 1);
    }

    const mhTh =
      typeof smb.chronicLowMentalHealthThreshold === "number" ? smb.chronicLowMentalHealthThreshold : 28;
    const mhMin =
      typeof smb.chronicLowMentalHealthMinConsecutiveSteps === "number"
        ? smb.chronicLowMentalHealthMinConsecutiveSteps
        : 8;
    if (mentalNow <= mhTh) {
      wt.lowMentalHealthStreak += 1;
    } else {
      wt.lowMentalHealthStreak = 0;
    }
    if (wt.lowMentalHealthStreak >= mhMin && mentalNow <= mhTh) {
      addChange(
        "health",
        typeof smb.chronicLowMentalHealthPerStep === "number" ? smb.chronicLowMentalHealthPerStep : -1
      );
    }

    (function applyStressHealthDecayBands() {
      const bands = hw.stressHealthDecayBands;
      if (Array.isArray(bands) && bands.length) {
        const sorted = bands
          .filter(function (b) {
            return b && typeof b.atLeast === "number";
          })
          .slice()
          .sort(function (a, b) {
            return (b.atLeast || 0) - (a.atLeast || 0);
          });
        for (let i = 0; i < sorted.length; i++) {
          const b = sorted[i];
          if (stress >= b.atLeast) {
            const n = typeof b.perStep === "number" ? b.perStep : 0;
            if (n) {
              addChange("health", -Math.abs(n));
            }
            return;
          }
        }
        return;
      }
      const legacyTh =
        typeof hw.stressHealthDecayThreshold === "number" ? hw.stressHealthDecayThreshold : 88;
      const legacyAmt =
        typeof hw.stressHealthDecayPerStep === "number" ? hw.stressHealthDecayPerStep : 1;
      if (stress >= legacyTh && legacyAmt) {
        addChange("health", -Math.abs(legacyAmt));
      }
    })();

    const lowMoneyTh = typeof d.lowMoneyThreshold === "number" ? d.lowMoneyThreshold : 10;
    if (gameState.stats.money <= lowMoneyTh) {
      addChange("stress", typeof d.lowMoneyStress === "number" ? d.lowMoneyStress : 1);
      addChange("happiness", typeof d.lowMoneyHappiness === "number" ? d.lowMoneyHappiness : 0);
    }

    const deb = gameState.stats.debt || 0;
    const dHard = typeof d.debtThresholdHard === "number" ? d.debtThresholdHard : 82;
    const dMid = typeof d.debtThresholdMid === "number" ? d.debtThresholdMid : 68;
    const dSoft = typeof d.debtThresholdSoft === "number" ? d.debtThresholdSoft : 52;
    if (deb >= dHard) {
      addChange("stress", typeof d.debtStressHard === "number" ? d.debtStressHard : 2);
      addChange("mental", typeof d.debtMentalHard === "number" ? d.debtMentalHard : -2);
      addChange("happiness", typeof d.debtHappyHard === "number" ? d.debtHappyHard : -2);
    } else if (deb >= dMid) {
      addChange("stress", typeof d.debtStressMid === "number" ? d.debtStressMid : 2);
      addChange("mental", typeof d.debtMentalMid === "number" ? d.debtMentalMid : -1);
      addChange("happiness", typeof d.debtHappyMid === "number" ? d.debtHappyMid : -1);
    } else if (deb >= dSoft) {
      addChange("stress", typeof d.debtStressSoft === "number" ? d.debtStressSoft : 1);
      addChange("mental", typeof d.debtMentalSoft === "number" ? d.debtMentalSoft : -1);
      addChange("happiness", typeof d.debtHappySoft === "number" ? d.debtHappySoft : -1);
    }

    if (hw.debtAppliesDerivedHealth && (gameState.stats.debt || 0) >= (hw.debtDerivedHealthThreshold || 96)) {
      const dh = typeof hw.debtDerivedHealthPerStep === "number" ? hw.debtDerivedHealthPerStep : -1;
      if (dh) {
        addChange("health", dh);
      }
    }

    if ((gameState.stats.health || 0) <= lowHTh) {
      addChange("mental", lowHM);
      addChange("happiness", lowHH);
    }

    const mLowTh = typeof d.mentalLowHappinessThreshold === "number" ? d.mentalLowHappinessThreshold : 24;
    if (gameState.stats.mental <= mLowTh) {
      addChange("happiness", typeof d.mentalLowHappinessPenalty === "number" ? d.mentalLowHappinessPenalty : -1);
      addChange("social", typeof d.mentalLowSocialPenalty === "number" ? d.mentalLowSocialPenalty : -1);
    }

    const fsHigh = typeof d.familySupportHighThreshold === "number" ? d.familySupportHighThreshold : 68;
    const fsLow = typeof d.familySupportLowThreshold === "number" ? d.familySupportLowThreshold : 26;
    if (gameState.stats.familySupport >= fsHigh) {
      addChange("mental", typeof d.familySupportHighMental === "number" ? d.familySupportHighMental : 2);
      addChange("happiness", typeof d.familySupportHighHappy === "number" ? d.familySupportHighHappy : 1);
      addChange("stress", typeof d.familySupportHighStressRelief === "number" ? d.familySupportHighStressRelief : -1);
    } else if (gameState.stats.familySupport <= fsLow) {
      addChange("stress", typeof d.familySupportLowStress === "number" ? d.familySupportLowStress : 1);
      addChange("mental", typeof d.familySupportLowMental === "number" ? d.familySupportLowMental : -1);
    }

    const discStressMax =
      typeof d.disciplineStudyBonusRequiresStressMax === "number" ? d.disciplineStudyBonusRequiresStressMax : 62;
    if (gameState.stats.discipline >= 60 && gameState.stats.stress <= discStressMax) {
      addChange("intelligence", 1);
    }

    if (currentPartner && currentPartner.affection >= 55 && isPartnerStatus(currentPartner.status)) {
      if (["dating", "passionate", "steady", "married", "reconnected"].includes(currentPartner.status)) {
        addChange("happiness", typeof d.partnerStableHappy === "number" ? d.partnerStableHappy : 1);
        addChange("mental", typeof d.partnerStableMental === "number" ? d.partnerStableMental : 2);
        addChange("stress", typeof d.partnerStableStressRelief === "number" ? d.partnerStableStressRelief : -2);
      }

      if (currentPartner.tension >= 55 || ["cooling", "conflict"].includes(currentPartner.status)) {
        addChange("happiness", typeof d.partnerConflictHappy === "number" ? d.partnerConflictHappy : -1);
        addChange("mental", typeof d.partnerConflictMental === "number" ? d.partnerConflictMental : -1);
        addChange("stress", typeof d.partnerConflictStress === "number" ? d.partnerConflictStress : 1);
      }

      if (currentPartner.commitment >= 45 && gameState.age <= 22) {
        addChange("social", 1);
        addChange("discipline", -1);
      }

      if (currentPartner.commitment >= 58 && gameState.age >= 22) {
        addChange("career", -1);
        addChange("happiness", 1);
      }

      const br = (currentPartner.growthModifiers || {}).breakupRisk || 0;
      if (br >= 10) {
        addChange("stress", typeof d.partnerBreakupRiskStressSoft === "number" ? d.partnerBreakupRiskStressSoft : 1);
      }
      if (br >= 16) {
        addChange("happiness", -1);
      }
    }

    const hhTh = typeof d.happinessHighBufferThreshold === "number" ? d.happinessHighBufferThreshold : 72;
    if ((gameState.stats.happiness || 0) >= hhTh && stress > 15) {
      addChange("stress", typeof d.happinessHighStressRelief === "number" ? d.happinessHighStressRelief : -1);
    }

    Object.entries(derivedChanges).forEach(([key, delta]) => {
      adjustStat(key, delta);
    });
  }

  function getRelationshipRecord(state, relationshipId) {
    const id = String(relationshipId || "").trim();
    if (!id) {
      return null;
    }

    if (!state.relationships[id]) {
      const definition = relationshipDefinitionMap.get(id);
      const arcDefinition = relationshipArcMap.get(id) || null;
      state.relationships[id] = {
        id,
        name: definition ? definition.name : id,
        arcId: arcDefinition && typeof arcDefinition.arcId === "string" ? arcDefinition.arcId : id,
        gender: definition ? definition.gender : "",
        identity: definition ? definition.identity : "",
        stageTags: definition ? definition.stageTags.slice() : [],
        roleTags: definition ? definition.roleTags.slice() : [],
        traitTags: definition ? definition.traitTags.slice() : [],
        exclusiveEvents:
          arcDefinition && Array.isArray(arcDefinition.exclusiveEvents)
            ? normalizeStringArray(arcDefinition.exclusiveEvents)
            : [],
        contactStyle: definition ? definition.contactStyle : "",
        conflictStyle: definition ? definition.conflictStyle : "",
        affection: definition ? definition.initialAffection : 0,
        status: definition ? definition.initialStatus : "unknown",
        relationshipStage: definition ? definition.initialStatus : "unknown",
        appearance: definition && definition.appearance ? { ...definition.appearance } : {},
        availability: definition && definition.availability ? { ...definition.availability } : {},
        romanceProfile: definition && definition.romanceProfile ? { ...definition.romanceProfile } : {},
        familiarity:
          definition && definition.initialMetrics && typeof definition.initialMetrics.familiarity === "number"
            ? definition.initialMetrics.familiarity
            : 0,
        trust:
          definition && definition.initialMetrics && typeof definition.initialMetrics.trust === "number"
            ? definition.initialMetrics.trust
            : 0,
        ambiguity:
          definition && definition.initialMetrics && typeof definition.initialMetrics.ambiguity === "number"
            ? definition.initialMetrics.ambiguity
            : 0,
        playerInterest:
          definition && definition.initialMetrics && typeof definition.initialMetrics.playerInterest === "number"
            ? definition.initialMetrics.playerInterest
            : 0,
        theirInterest:
          definition && definition.initialMetrics && typeof definition.initialMetrics.theirInterest === "number"
            ? definition.initialMetrics.theirInterest
            : 0,
        tension:
          definition && definition.initialMetrics && typeof definition.initialMetrics.tension === "number"
            ? definition.initialMetrics.tension
            : 0,
        commitment:
          definition && definition.initialMetrics && typeof definition.initialMetrics.commitment === "number"
            ? definition.initialMetrics.commitment
            : 0,
        continuity:
          definition && definition.initialMetrics && typeof definition.initialMetrics.continuity === "number"
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
        history: []
      };
    }

    const relationship = state.relationships[id];
    relationship.arcId = typeof relationship.arcId === "string" && relationship.arcId ? relationship.arcId : id;
    relationship.familiarity = typeof relationship.familiarity === "number" ? relationship.familiarity : 0;
    relationship.trust = typeof relationship.trust === "number" ? relationship.trust : 0;
    relationship.ambiguity = typeof relationship.ambiguity === "number" ? relationship.ambiguity : 0;
    relationship.playerInterest = typeof relationship.playerInterest === "number" ? relationship.playerInterest : 0;
    relationship.theirInterest = typeof relationship.theirInterest === "number" ? relationship.theirInterest : 0;
    relationship.tension = typeof relationship.tension === "number" ? relationship.tension : 0;
    relationship.commitment = typeof relationship.commitment === "number" ? relationship.commitment : 0;
    relationship.continuity = typeof relationship.continuity === "number" ? relationship.continuity : 0;
    relationship.interactionCount = typeof relationship.interactionCount === "number" ? relationship.interactionCount : 0;
    relationship.appearance = relationship.appearance && typeof relationship.appearance === "object" ? relationship.appearance : {};
    relationship.availability =
      relationship.availability && typeof relationship.availability === "object" ? relationship.availability : {};
    relationship.romanceProfile =
      relationship.romanceProfile && typeof relationship.romanceProfile === "object" ? relationship.romanceProfile : {};
    relationship.exclusiveEvents = normalizeStringArray(relationship.exclusiveEvents);
    relationship.sharedHistory = normalizeStringArray(relationship.sharedHistory);
    if (!("partnerSinceAge" in relationship)) {
      relationship.partnerSinceAge = null;
    }
    if (!("marriedSinceAge" in relationship)) {
      relationship.marriedSinceAge = null;
    }
    if (typeof relationship.growthArcId !== "string") {
      relationship.growthArcId = "";
    }
    if (!relationship.growthModifiers || typeof relationship.growthModifiers !== "object") {
      relationship.growthModifiers = {};
    }
    if (!Array.isArray(relationship.growthResolvedStages)) {
      relationship.growthResolvedStages = [];
    }
    if (typeof relationship.partnerFamilyRevealed !== "boolean") {
      relationship.partnerFamilyRevealed = false;
    }
    syncRelationshipStage(relationship);

    return relationship;
  }

  function getCurrentPartner(state) {
    const activeRelationship = getRelationshipSnapshot(state, state.activeRelationshipId);
    if (
      activeRelationship &&
      isPartnerStatus(activeRelationship.status)
    ) {
      return activeRelationship;
    }

    return Object.values(state.relationships || {}).find((relationship) =>
      isPartnerStatus(relationship.status)
    ) || null;
  }

  function getStrongestRelationship(state) {
    return Object.values(state.relationships || {})
      .filter((relationship) => relationship.met || relationship.affection > 0)
      .sort((left, right) => right.affection - left.affection)[0] || null;
  }

  function getActiveRelationship() {
    if (!gameState.activeRelationshipId) {
      return null;
    }

    return getRelationshipRecord(gameState, gameState.activeRelationshipId);
  }

  function getPendingFamilyBackground() {
    if (!gameState.pendingFamilyBackgroundId) {
      return null;
    }

    return familyBackgroundMap.get(gameState.pendingFamilyBackgroundId) || null;
  }

  function summarizeRoute(route) {
    if (!route) {
      return null;
    }

    return {
      id: route.id,
      type: route.type,
      name: route.name,
      category: route.category,
      summary: route.summary,
      description: route.description,
      details: route.details.slice(),
      meta: cloneLooseObject(route.meta) || {}
    };
  }

  function applyRouteDefinition(route) {
    if (!route) {
      return;
    }

    if (route.type === "education") {
      gameState.educationRoute = summarizeRoute(route);
    }

    if (route.type === "career") {
      gameState.careerRoute = summarizeRoute(route);
    }

    applyMutationBlock(route.apply, {
      skipAge: true,
      skipStatLinks: true,
      allowAnyHealthEffects: true
    });
  }

  function formatText(text) {
    const activeRelationship = getActiveRelationship();
    const strongestRelationship = getStrongestRelationship(gameState);
    const gaokaoState = gameState.gaokao || {};
    const overseasState = gameState.overseas || {};
    const domesticConnectionNames = getNamedRelationships(overseasState.domesticConnectionIds);
    const supportNetworkNames = getNamedRelationships(overseasState.supportNetworkIds);
    const mentorNames = getNamedRelationships(overseasState.mentorIds);
    const branchSummary = normalizeStringArray(overseasState.branchFocuses)
      .map((focusId) => OVERSEAS_FOCUS_LABELS[focusId] || focusId)
      .join("、");
    const futurePull =
      (overseasState.stayScore || 0) - (overseasState.returnScore || 0) >= 12
        ? "你越来越像会把路继续留在国外。"
        : (overseasState.returnScore || 0) - (overseasState.stayScore || 0) >= 12
          ? "你心里其实已经越来越偏向回国。"
          : "你还在“留下还是回去”之间来回比较。";
    const replacements = {
      name: gameState.playerName || "你",
      playerGender: getPlayerGenderLabel(gameState.playerGender),
      activeLoveName: activeRelationship ? activeRelationship.name : "那个人",
      strongestLoveName: strongestRelationship ? strongestRelationship.name : "那个人",
      familyBackgroundName: gameState.familyBackground ? gameState.familyBackground.name : "普通家庭",
      educationRouteName: gameState.educationRoute ? gameState.educationRoute.name : "未定去向",
      careerRouteName: gameState.careerRoute ? gameState.careerRoute.name : "尚未定型的工作路线",
      lifePathName:
        gameState.lifePath === "gaokao"
          ? "参加高考"
          : gameState.lifePath === "non_gaokao"
            ? "不参加高考"
            : gameState.lifePath === "overseas"
              ? "去国外念书"
              : "尚未决定",
      gaokaoRegionName: gaokaoState.regionName || "默认省份线",
      gaokaoScore:
        typeof gaokaoState.score === "number" && Number.isFinite(gaokaoState.score) ? String(gaokaoState.score) : "未出分",
      gaokaoBaseScore:
        typeof gaokaoState.baseScore === "number" && Number.isFinite(gaokaoState.baseScore)
          ? String(gaokaoState.baseScore)
          : "未计算",
      gaokaoPerformanceLabel: gaokaoState.performanceLabel || "发挥未定",
      gaokaoPerformanceText: gaokaoState.performanceNarrative || "这一场考试还没有真正结算。",
      gaokaoTierLabel: gaokaoState.tierLabel || "区间未定",
      gaokaoDestinationLabel: gaokaoState.destinationLabel || "去向待定",
      overseasRouteName: overseasState.routeName || "海外路线未定",
      overseasCity: overseasState.destination || "陌生城市",
      overseasPressureSummary:
        overseasState.active
          ? "语言压力 " +
            String(overseasState.languagePressure || 0) +
            "，孤独感 " +
            String(overseasState.loneliness || 0) +
            "，经济压力 " +
            String(overseasState.financePressure || 0)
          : "海外生活尚未开始",
      overseasDomesticSummary: domesticConnectionNames.length ? domesticConnectionNames.join("、") : "国内还没有需要硬撑着维系的人",
      overseasPhaseLabel: OVERSEAS_PHASE_LABELS[overseasState.phase] || "海外阶段未定",
      overseasBranchSummary: branchSummary || "你的海外生活还没有明显偏向哪一种活法",
      overseasBelongingSummary:
        (overseasState.belonging || 0) >= 66
          ? "你已经开始在这里长出明确的归属感。"
          : (overseasState.belonging || 0) <= 30
            ? "你仍然经常觉得自己像临时停靠的人。"
            : "你在适应，但归属感还没有真正稳定下来。",
      overseasFuturePull: futurePull,
      overseasSupportSummary: supportNetworkNames.length ? supportNetworkNames.join("、") : "目前还没有真正稳住你的海外支持网",
      overseasMentorSummary: mentorNames.length ? mentorNames.join("、") : "你还没有遇到真正愿意托你一把的导师型人物",
      studyLoanSummary: (() => {
        const os = gameState.overseas || {};
        const bal = typeof os.studyLoanBalance === "number" ? os.studyLoanBalance : 0;
        if (os.studyLoanActive && bal > 0) {
          return "你背着留学贷款（当前余额约 " + bal + "），海外账本比同龄人更紧，每一笔开销都像在跟未来对账。";
        }
        if (gameState.flags.includes("overseas_paid_cash_tuition")) {
          return "出国首期是用真金白银砸出去的，至少不欠银行那一头。";
        }
        return "留学这块的经济账，你还没真正押下去。";
      })(),
      childSummary: (() => {
        const n = getChildCount(gameState);
        if (n <= 0) {
          return "你还没有把「孩子」接进日常生活里。";
        }
        return "家里有孩子以后，时间和钱的算法都换了一套。";
      })(),
      inventorySummary: (() => {
        const bag = gameState.inventory || {};
        const keys = Object.keys(bag).filter((k) => (bag[k] || 0) > 0);
        if (!keys.length) {
          return "你身上没有特别值得一提的「可送人的存货」。";
        }
        return "你手头还留着几件能送出去或自己用掉的东西。";
      })()
    };

    return String(text || "").replace(/\{(\w+)\}/g, function (_, key) {
      return Object.prototype.hasOwnProperty.call(replacements, key) ? replacements[key] : "";
    });
  }

  function formatOptionText(text) {
    const formatted = formatText(text);
    return OPTION_TEXT_REWRITES.get(formatted) || formatted;
  }

  function addHistory(text) {
    if (!text) {
      return;
    }

    gameState.history.unshift({
      age: gameState.age,
      text: formatText(text)
    });
  }

  function addRelationshipHistory(relationshipId, text) {
    if (!text) {
      return;
    }

    const relationship = getRelationshipRecord(gameState, relationshipId);
    if (!relationship) {
      return;
    }

    relationship.history.unshift({
      age: gameState.age,
      text: formatText(text)
    });
  }

  function clampNumber(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function addUniqueItems(list, items) {
    (items || []).forEach((item) => {
      if (!list.includes(item)) {
        list.push(item);
      }
    });
  }

  function removeItems(list, items) {
    if (!Array.isArray(items) || !items.length) {
      return list;
    }

    return list.filter((item) => !items.includes(item));
  }

  function ensureGaokaoState() {
    if (!gameState.gaokao || typeof gameState.gaokao !== "object") {
      gameState.gaokao = {};
    }

    Object.assign(gameState.gaokao, {
      regionId: typeof gameState.gaokao.regionId === "string" ? gameState.gaokao.regionId : "",
      regionName: typeof gameState.gaokao.regionName === "string" ? gameState.gaokao.regionName : "",
      totalScore:
        typeof gameState.gaokao.totalScore === "number"
          ? gameState.gaokao.totalScore
          : typeof gaokaoConfig.totalScore === "number"
            ? gaokaoConfig.totalScore
            : 750,
      attempted: Boolean(gameState.gaokao.attempted),
      score: typeof gameState.gaokao.score === "number" ? gameState.gaokao.score : null,
      baseScore: typeof gameState.gaokao.baseScore === "number" ? gameState.gaokao.baseScore : null,
      performance: typeof gameState.gaokao.performance === "string" ? gameState.gaokao.performance : "",
      performanceLabel: typeof gameState.gaokao.performanceLabel === "string" ? gameState.gaokao.performanceLabel : "",
      performanceNarrative:
        typeof gameState.gaokao.performanceNarrative === "string" ? gameState.gaokao.performanceNarrative : "",
      tierId: typeof gameState.gaokao.tierId === "string" ? gameState.gaokao.tierId : "",
      tierLabel: typeof gameState.gaokao.tierLabel === "string" ? gameState.gaokao.tierLabel : "",
      destinationPoolId:
        typeof gameState.gaokao.destinationPoolId === "string" ? gameState.gaokao.destinationPoolId : "",
      destinationLabel: typeof gameState.gaokao.destinationLabel === "string" ? gameState.gaokao.destinationLabel : "",
      willingnessToLeaveHome:
        typeof gameState.gaokao.willingnessToLeaveHome === "boolean" ? gameState.gaokao.willingnessToLeaveHome : null,
      majorPreference: typeof gameState.gaokao.majorPreference === "string" ? gameState.gaokao.majorPreference : "",
      notes: Array.isArray(gameState.gaokao.notes) ? gameState.gaokao.notes : [],
      recommendedUniversities: Array.isArray(gameState.gaokao.recommendedUniversities)
        ? gameState.gaokao.recommendedUniversities
        : []
    });

    return gameState.gaokao;
  }

  function ensureOverseasState() {
    if (!gameState.overseas || typeof gameState.overseas !== "object") {
      gameState.overseas = {};
    }

    Object.assign(gameState.overseas, {
      active: Boolean(gameState.overseas.active),
      routeId: typeof gameState.overseas.routeId === "string" ? gameState.overseas.routeId : "",
      routeName: typeof gameState.overseas.routeName === "string" ? gameState.overseas.routeName : "",
      selectedUniversityName:
        typeof gameState.overseas.selectedUniversityName === "string" ? gameState.overseas.selectedUniversityName : "",
      selectedUniversityCountry:
        typeof gameState.overseas.selectedUniversityCountry === "string"
          ? gameState.overseas.selectedUniversityCountry
          : "",
      destination: typeof gameState.overseas.destination === "string" ? gameState.overseas.destination : "",
      supportLevel: typeof gameState.overseas.supportLevel === "string" ? gameState.overseas.supportLevel : "",
      phase: typeof gameState.overseas.phase === "string" ? gameState.overseas.phase : "",
      housingType: typeof gameState.overseas.housingType === "string" ? gameState.overseas.housingType : "",
      budgetMode: typeof gameState.overseas.budgetMode === "string" ? gameState.overseas.budgetMode : "",
      languagePressure: typeof gameState.overseas.languagePressure === "number" ? gameState.overseas.languagePressure : 0,
      loneliness: typeof gameState.overseas.loneliness === "number" ? gameState.overseas.loneliness : 0,
      financePressure: typeof gameState.overseas.financePressure === "number" ? gameState.overseas.financePressure : 0,
      academicPressure: typeof gameState.overseas.academicPressure === "number" ? gameState.overseas.academicPressure : 0,
      culturalStress: typeof gameState.overseas.culturalStress === "number" ? gameState.overseas.culturalStress : 0,
      homesickness: typeof gameState.overseas.homesickness === "number" ? gameState.overseas.homesickness : 0,
      socialComfort: typeof gameState.overseas.socialComfort === "number" ? gameState.overseas.socialComfort : 0,
      belonging: typeof gameState.overseas.belonging === "number" ? gameState.overseas.belonging : 0,
      independence: typeof gameState.overseas.independence === "number" ? gameState.overseas.independence : 0,
      burnout: typeof gameState.overseas.burnout === "number" ? gameState.overseas.burnout : 0,
      careerClarity: typeof gameState.overseas.careerClarity === "number" ? gameState.overseas.careerClarity : 0,
      visaPressure: typeof gameState.overseas.visaPressure === "number" ? gameState.overseas.visaPressure : 0,
      identityShift: typeof gameState.overseas.identityShift === "number" ? gameState.overseas.identityShift : 0,
      stayScore: typeof gameState.overseas.stayScore === "number" ? gameState.overseas.stayScore : 0,
      returnScore: typeof gameState.overseas.returnScore === "number" ? gameState.overseas.returnScore : 0,
      domesticConnectionIds: Array.isArray(gameState.overseas.domesticConnectionIds)
        ? gameState.overseas.domesticConnectionIds
        : [],
      newConnectionIds: Array.isArray(gameState.overseas.newConnectionIds) ? gameState.overseas.newConnectionIds : [],
      supportNetworkIds: Array.isArray(gameState.overseas.supportNetworkIds) ? gameState.overseas.supportNetworkIds : [],
      mentorIds: Array.isArray(gameState.overseas.mentorIds) ? gameState.overseas.mentorIds : [],
      branchFocuses: Array.isArray(gameState.overseas.branchFocuses) ? gameState.overseas.branchFocuses : [],
      doubleTrack: Boolean(gameState.overseas.doubleTrack),
      exposureRisk: typeof gameState.overseas.exposureRisk === "number" ? gameState.overseas.exposureRisk : 0,
      academicIndex: typeof gameState.overseas.academicIndex === "number" ? gameState.overseas.academicIndex : null,
      qsBandId: typeof gameState.overseas.qsBandId === "string" ? gameState.overseas.qsBandId : "",
      qsBandLabel: typeof gameState.overseas.qsBandLabel === "string" ? gameState.overseas.qsBandLabel : "",
      recommendedUniversities: Array.isArray(gameState.overseas.recommendedUniversities)
        ? gameState.overseas.recommendedUniversities
        : [],
      studyLoanActive: Boolean(gameState.overseas.studyLoanActive),
      studyLoanBalance:
        typeof gameState.overseas.studyLoanBalance === "number" ? gameState.overseas.studyLoanBalance : 0,
      studyLoanDebtStatContribution:
        typeof gameState.overseas.studyLoanDebtStatContribution === "number"
          ? gameState.overseas.studyLoanDebtStatContribution
          : 0,
      fundingMode: typeof gameState.overseas.fundingMode === "string" ? gameState.overseas.fundingMode : ""
    });

    return gameState.overseas;
  }

  function getNamedRelationships(ids) {
    return normalizeStringArray(ids)
      .map((id) => getRelationshipSnapshot(gameState, id))
      .filter(Boolean)
      .map((relationship) => relationship.name);
  }

  function setOverseasPhase(phaseId) {
    const overseasState = ensureOverseasState();
    const normalizedPhase = typeof phaseId === "string" ? phaseId.trim() : "";
    if (!normalizedPhase) {
      return;
    }

    overseasState.phase = normalizedPhase;
    removeGameFlags(OVERSEAS_PHASE_FLAGS);
    addGameFlags(["overseas_phase_" + normalizedPhase]);
  }

  function syncOverseasDerivedFlags() {
    const overseasState = ensureOverseasState();
    removeGameFlags(OVERSEAS_DERIVED_FLAGS.concat(OVERSEAS_FOCUS_FLAGS));

    normalizeStringArray(overseasState.branchFocuses).forEach((focusId) => {
      if (OVERSEAS_FOCUS_LABELS[focusId]) {
        addGameFlags(["overseas_focus_" + focusId]);
      }
    });

    if (overseasState.studyLoanActive) {
      addGameFlags(["overseas_study_loan_strain"]);
    }

    if ((overseasState.financePressure || 0) >= 62) {
      addGameFlags(["overseas_finance_high"]);
    } else if ((overseasState.financePressure || 0) <= 34) {
      addGameFlags(["overseas_finance_breathing_room"]);
    }

    if ((overseasState.loneliness || 0) >= 60 || (overseasState.homesickness || 0) >= 58) {
      addGameFlags(["overseas_lonely"]);
    }

    if ((overseasState.belonging || 0) >= 66 && (overseasState.socialComfort || 0) >= 52) {
      addGameFlags(["overseas_settled"]);
    }

    if ((overseasState.belonging || 0) <= 30 && (overseasState.loneliness || 0) >= 55) {
      addGameFlags(["overseas_isolated"]);
    }

    if ((overseasState.burnout || 0) >= 60 || (overseasState.academicPressure || 0) >= 70) {
      addGameFlags(["overseas_burnout_risk"]);
    }

    if ((overseasState.academicPressure || 0) >= 62) {
      addGameFlags(["overseas_academic_overload"]);
    } else if ((overseasState.academicPressure || 0) <= 38) {
      addGameFlags(["overseas_academically_stable"]);
    }

    if ((overseasState.culturalStress || 0) >= 58) {
      addGameFlags(["overseas_culture_gap_high"]);
    }

    if ((overseasState.independence || 0) >= 64) {
      addGameFlags(["overseas_independent_strong"]);
    }

    if ((overseasState.careerClarity || 0) >= 62) {
      addGameFlags(["overseas_career_clear"]);
    }

    if ((overseasState.visaPressure || 0) >= 56) {
      addGameFlags(["overseas_visa_anxiety"]);
    }

    if ((overseasState.stayScore || 0) - (overseasState.returnScore || 0) >= 12) {
      addGameFlags(["overseas_stay_bias"]);
    }

    if ((overseasState.returnScore || 0) - (overseasState.stayScore || 0) >= 12) {
      addGameFlags(["overseas_return_bias"]);
    }
  }

  function applyOverseasProfileUpdate(data) {
    const overseasState = ensureOverseasState();
    const payload = data && typeof data === "object" ? data : {};
    const metrics = payload.metrics && typeof payload.metrics === "object" ? payload.metrics : {};

    if (typeof payload.phase === "string" && payload.phase.trim()) {
      setOverseasPhase(payload.phase);
    }

    if (typeof payload.destination === "string" && payload.destination.trim()) {
      overseasState.destination = payload.destination.trim();
    }

    if (typeof payload.housingType === "string" && payload.housingType.trim()) {
      overseasState.housingType = payload.housingType.trim();
    }

    if (typeof payload.budgetMode === "string" && payload.budgetMode.trim()) {
      overseasState.budgetMode = payload.budgetMode.trim();
    }

    if (typeof payload.supportLevel === "string" && payload.supportLevel.trim()) {
      overseasState.supportLevel = payload.supportLevel.trim();
    }

    addUniqueItems(overseasState.branchFocuses, normalizeStringArray(payload.addFocuses));
    if (Array.isArray(payload.removeFocuses) && payload.removeFocuses.length) {
      overseasState.branchFocuses = removeItems(overseasState.branchFocuses, normalizeStringArray(payload.removeFocuses));
    }

    addUniqueItems(overseasState.supportNetworkIds, normalizeStringArray(payload.addSupportNetworkIds));
    addUniqueItems(overseasState.mentorIds, normalizeStringArray(payload.addMentorIds));

    Object.entries(metrics).forEach(([key, delta]) => {
      if (typeof delta !== "number" || !Number.isFinite(delta) || typeof overseasState[key] !== "number") {
        return;
      }

      overseasState[key] = clampRelationshipMetric((overseasState[key] || 0) + delta);
    });

    syncOverseasDerivedFlags();
  }

  function addGameFlags(flags) {
    (flags || []).forEach((flag) => {
      if (!gameState.flags.includes(flag)) {
        gameState.flags.push(flag);
      }
    });
  }

  function removeGameFlags(flags) {
    if (!Array.isArray(flags) || !flags.length) {
      return;
    }

    gameState.flags = gameState.flags.filter((flag) => !flags.includes(flag));
  }

  function addGameTags(tags) {
    (tags || []).forEach((tag) => {
      if (!gameState.tags.includes(tag)) {
        gameState.tags.push(tag);
      }
    });
  }

  function getWeightedModifierScore(modifiers, state) {
    return (Array.isArray(modifiers) ? modifiers : []).reduce((sum, modifier) => {
      if (!modifier || typeof modifier !== "object") {
        return sum;
      }

      return matchesConditions(modifier.conditions || {}, state) ? sum + (modifier.add || 0) : sum;
    }, 0);
  }

  function pickWeightedEntry(entries) {
    const candidates = (Array.isArray(entries) ? entries : [])
      .map((entry) => {
        const baseWeight = typeof entry.weight === "number" ? entry.weight : 1;
        return {
          entry,
          weight: Math.max(0, baseWeight + getWeightedModifierScore(entry.modifiers, gameState))
        };
      })
      .filter((item) => item.weight > 0);

    if (!candidates.length) {
      return null;
    }

    const totalWeight = candidates.reduce((sum, item) => sum + item.weight, 0);
    let cursor = Math.random() * totalWeight;

    for (const item of candidates) {
      cursor -= item.weight;
      if (cursor <= 0) {
        return item.entry;
      }
    }

    return candidates[candidates.length - 1].entry;
  }

  function getGaokaoRegionById(regionId) {
    const id = String(regionId || "").trim();
    if (!id) {
      return null;
    }

    return gaokaoRegions.find((region) => region && region.id === id) || null;
  }

  function selectGaokaoRegion() {
    const gaokaoState = ensureGaokaoState();
    const cachedRegion = getGaokaoRegionById(gaokaoState.regionId);
    if (cachedRegion) {
      gaokaoState.regionName = cachedRegion.name || gaokaoState.regionName;
      return cachedRegion;
    }

    const regionSelection =
      gaokaoConfig.regionSelection && typeof gaokaoConfig.regionSelection === "object"
        ? gaokaoConfig.regionSelection
        : {};
    let region =
      getGaokaoRegionById(regionSelection.defaultRegionId) ||
      gaokaoRegions[0] ||
      null;

    if (!region) {
      return null;
    }

    gaokaoState.regionId = region.id;
    gaokaoState.regionName = region.name || region.id;
    addGameFlags(["gaokao_region_" + region.id]);
    return region;
  }

  function getTrajectoryBonus(trajectoryBonuses) {
    return (Array.isArray(trajectoryBonuses) ? trajectoryBonuses : []).reduce((sum, item) => {
      if (!item || typeof item !== "object") {
        return sum;
      }

      return matchesConditions(item.conditions || {}, gameState) ? sum + (item.add || 0) : sum;
    }, 0);
  }

  function randomInRange(range) {
    const source = Array.isArray(range) ? range : [0, 0];
    const min = typeof source[0] === "number" ? source[0] : 0;
    const max = typeof source[1] === "number" ? source[1] : min;
    return Math.round(min + Math.random() * (max - min));
  }

  function pickNarrativeFromPool(pool, fallbackText) {
    const items = (Array.isArray(pool) ? pool : []).filter((item) => matchesConditions(item.conditions || {}, gameState));
    const selected = pickWeightedEntry(items);
    return selected && typeof selected.text === "string" ? selected.text : fallbackText;
  }

  function determineGaokaoTier(region, score) {
    const bands = region && Array.isArray(region.scoreBands) ? region.scoreBands : [];
    for (const band of bands) {
      if (typeof band.min === "number" && score >= band.min) {
        return band;
      }
    }

    return bands[bands.length - 1] || null;
  }

  function setRelationshipStatus(relationshipId, status, historyText) {
    const relationship = getRelationshipRecord(gameState, relationshipId);
    if (!relationship) {
      return;
    }

    relationship.met = true;
    relationship.status = status;
    syncRelationshipStage(relationship);
    notePartnerSinceAge(relationship);

    if (historyText) {
      addRelationshipHistory(relationshipId, historyText);
    }
  }

  function getDistanceReadyRelationships() {
    return Object.values(gameState.relationships || {})
      .filter((relationship) => {
        if (!relationship || !relationship.met) {
          return false;
        }

        if (
          [
            "ambiguous",
            "confessed",
            "short_dating",
            "dating",
            "passionate",
            "cooling",
            "conflict",
            "steady",
            "reconnected",
            "mutual_crush",
            "close"
          ].includes(relationship.status)
        ) {
          return true;
        }

        return (
          relationship.affection >= 42 ||
          ((relationship.playerInterest || 0) >= 38 && (relationship.theirInterest || 0) >= 34)
        );
      })
      .sort((left, right) => {
        const leftScore = (left.affection || 0) + (left.commitment || 0) * 0.5 + (left.continuity || 0) * 0.4;
        const rightScore = (right.affection || 0) + (right.commitment || 0) * 0.5 + (right.continuity || 0) * 0.4;
        return rightScore - leftScore;
      });
  }

  function convertDomesticRelationshipsToDistance() {
    const overseasState = ensureOverseasState();
    const candidates = getDistanceReadyRelationships().slice(0, 2);
    if (!candidates.length) {
      overseasState.domesticConnectionIds = [];
      return;
    }

    overseasState.domesticConnectionIds = candidates.map((relationship) => relationship.id);
    candidates.forEach((relationship) => {
      const longDistanceStatus =
        ["dating", "passionate", "steady", "cooling", "conflict", "reconnected"].includes(relationship.status)
          ? "long_distance_dating"
          : "cross_border_ambiguous";
      relationship.status = longDistanceStatus;
      relationship.met = true;
      relationship.continuity = clampRelationshipMetric((relationship.continuity || 0) + 8);
      relationship.commitment = clampRelationshipMetric((relationship.commitment || 0) + 6);
      relationship.tension = clampRelationshipMetric((relationship.tension || 0) + 6);
      addUniqueItems(relationship.flags, ["distance_mode", "domestic_anchor"]);
      addUniqueItems(relationship.sharedHistory, ["distance_started"]);
      syncRelationshipStage(relationship);
      addRelationshipHistory(
        relationship.id,
        relationship.name + "没有从你的生活里消失，只是被一起推到了时差、视频和见不到面的日常里。"
      );
    });

    if (candidates[0]) {
      gameState.activeRelationshipId = candidates[0].id;
    }
  }

  function registerOverseasConnection(relationshipId) {
    const overseasState = ensureOverseasState();
    const normalizedId = String(relationshipId || "").trim();
    if (!normalizedId) {
      return;
    }

    addUniqueItems(overseasState.newConnectionIds, [normalizedId]);
  }

  function getUniversityPoolCandidates(tierId) {
    const pool = universityPools && typeof universityPools === "object" ? universityPools[tierId] : [];
    return Array.isArray(pool) ? pool : [];
  }

  function getDomesticUniversityCandidates(tierId) {
    const source = realDomesticUniversities && typeof realDomesticUniversities === "object" ? realDomesticUniversities : {};
    const pool = source[tierId];
    if (Array.isArray(pool) && pool.length) {
      return pool;
    }

    if (tierId === "fail") {
      return Array.isArray(source.vocational) ? source.vocational : [];
    }

    return [];
  }

  function getOverseasUniversityCandidates(qsBandId) {
    const pool = realOverseasUniversities && typeof realOverseasUniversities === "object" ? realOverseasUniversities[qsBandId] : [];
    return Array.isArray(pool) ? pool : [];
  }

  function getOverseasQsBandById(qsBandId) {
    const target = String(qsBandId || "").trim();
    if (!target) {
      return null;
    }

    return overseasQsBands.find((item) => item && item.id === target) || null;
  }

  function pickUniqueWeightedEntries(entries, count) {
    const pool = Array.isArray(entries) ? entries.slice() : [];
    const selected = [];
    const limit = Math.max(0, typeof count === "number" ? count : 0);

    while (pool.length && selected.length < limit) {
      const choice = pickWeightedEntry(pool);
      if (!choice) {
        break;
      }

      selected.push(choice);
      const chosenName = choice.name || choice.id;
      const index = pool.findIndex((item) => (item.name || item.id) === chosenName);
      if (index >= 0) {
        pool.splice(index, 1);
      } else {
        break;
      }
    }

    return selected;
  }

  function sortEntriesByWeight(entries) {
    return (Array.isArray(entries) ? entries : []).slice().sort((left, right) => {
      const rightWeight = typeof right.weight === "number" ? right.weight : 0;
      const leftWeight = typeof left.weight === "number" ? left.weight : 0;
      if (rightWeight !== leftWeight) {
        return rightWeight - leftWeight;
      }

      return String(left.name || left.id || "").localeCompare(String(right.name || right.id || ""), "zh-CN");
    });
  }

  function getFirstMatchingTag(tags, preferredTags) {
    const sourceTags = normalizeStringArray(tags);
    const priorities = normalizeStringArray(preferredTags);
    return priorities.find((tag) => sourceTags.includes(tag)) || sourceTags[0] || "";
  }

  function resolveRecommendationReason(fitNotes, preferredTags, fallbackText) {
    const notes = fitNotes && typeof fitNotes === "object" ? fitNotes : {};
    const preferredTag = getFirstMatchingTag(Object.keys(notes), preferredTags);
    if (preferredTag && typeof notes[preferredTag] === "string" && notes[preferredTag].trim()) {
      return notes[preferredTag].trim();
    }

    const firstNote = Object.values(notes).find((value) => typeof value === "string" && value.trim());
    if (firstNote) {
      return firstNote.trim();
    }

    return fallbackText;
  }

  function getDomesticPreferredTags(preference) {
    const source = preference && typeof preference === "object" ? preference : {};
    const preferredTags = [];
    if (source.majorPreference) {
      preferredTags.push(source.majorPreference);
    }
    preferredTags.push(source.willingnessToLeaveHome ? "leave_home" : "stay_close");
    if (source.familyPreference) {
      preferredTags.push(source.familyPreference);
    }

    return preferredTags;
  }

  function buildDomesticUniversityRecommendationCandidates(tierId, preference) {
    const preferredTags = getDomesticPreferredTags(preference);
    return getDomesticUniversityCandidates(tierId).map((school, index) => {
      const tags = normalizeStringArray(school.tags);
      let weight = 1;
      preferredTags.forEach((tag) => {
        if (tag && tags.includes(tag)) {
          weight += 2;
        }
      });

      return {
        ...school,
        weight,
        scoreOrder: index
      };
    });
  }

  function mapDomesticUniversityRecommendations(candidates, preferredTags) {
    return (Array.isArray(candidates) ? candidates : []).map((school) => ({
      name: school.name,
      location: school.city || "国内",
      categoryLabel: "同分段参考 · " + (school.type || "大学"),
      reason: resolveRecommendationReason(
        school.fitNotes,
        preferredTags,
        "这所学校和你当前的成绩区间、去向取向相对更接近。"
      )
    }));
  }

  function buildDomesticUniversityRecommendations(tierId, preference) {
    const preferredTags = getDomesticPreferredTags(preference);
    const selectedUniversityName =
      preference && typeof preference.selectedUniversityName === "string" ? preference.selectedUniversityName : "";
    if (selectedUniversityName) {
      const selectedSchool = getDomesticUniversityCandidates(tierId).find((school) => school && school.name === selectedUniversityName);
      if (selectedSchool) {
        return mapDomesticUniversityRecommendations([selectedSchool], preferredTags);
      }
    }
    const candidates = buildDomesticUniversityRecommendationCandidates(tierId, preference);
    return mapDomesticUniversityRecommendations(sortEntriesByWeight(candidates).slice(0, 1), preferredTags);
  }

  function buildDomesticUniversityPreviewRecommendations(tierId, preference) {
    const preferredTags = getDomesticPreferredTags(preference);
    const selectedUniversityName =
      preference && typeof preference.selectedUniversityName === "string" ? preference.selectedUniversityName : "";
    if (selectedUniversityName) {
      const selectedSchool = getDomesticUniversityCandidates(tierId).find((school) => school && school.name === selectedUniversityName);
      if (selectedSchool) {
        return mapDomesticUniversityRecommendations([selectedSchool], preferredTags);
      }
    }
    const candidates = buildDomesticUniversityRecommendationCandidates(tierId, preference);
    return mapDomesticUniversityRecommendations(sortEntriesByWeight(candidates).slice(0, 1), preferredTags);
  }

  function scoreDomesticSchoolForPreference(preference, schoolTags) {
    const preferredTags = getDomesticPreferredTags(preference);
    let score = 0;
    preferredTags.forEach((tag, index) => {
      if (tag && schoolTags.includes(tag)) {
        score += Math.max(1, preferredTags.length - index);
      }
    });
    return score;
  }

  function pickDomesticRouteChoiceForSchool(routeChoices, school) {
    const choices = Array.isArray(routeChoices) ? routeChoices : [];
    const schoolTags = normalizeStringArray(school && school.tags);
    let bestChoice = null;
    let bestScore = Number.NEGATIVE_INFINITY;

    choices.forEach((choice, index) => {
      const payload = choice && choice.customPayload && typeof choice.customPayload === "object" ? choice.customPayload : {};
      const score = scoreDomesticSchoolForPreference(payload, schoolTags) * 10 - index;
      if (score > bestScore) {
        bestScore = score;
        bestChoice = choice;
      }
    });

    return bestChoice;
  }

  function buildDomesticSchoolOptionText(school, tierLabel) {
    const schoolName = school && school.name ? school.name : "国内大学";
    const city = school && school.city ? school.city : "国内";
    const label = tierLabel || "分数区间未定";
    return "去 " + schoolName + "（" + city + " · " + label + "）";
  }

  function getOverseasPreferredTags(routeId) {
    return routeId === "overseas_research_path"
      ? ["research", "academic", "engineering", "ambition"]
      : routeId === "overseas_practical_path"
        ? ["practical", "balanced", "city", "cost"]
        : ["city", "balanced", "academic", "stable"];
  }

  function buildOverseasUniversityRecommendationCandidates(routeId, qsBand) {
    const preferredTags = getOverseasPreferredTags(routeId);
    const bandId = qsBand && qsBand.id ? qsBand.id : "";
    return getOverseasUniversityCandidates(bandId).map((school, index) => {
      const tags = normalizeStringArray(school.tags);
      let weight = 1;
      preferredTags.forEach((tag) => {
        if (tag && tags.includes(tag)) {
          weight += 2;
        }
      });

      return {
        ...school,
        weight,
        scoreOrder: index
      };
    });
  }

  function calculateOverseasAcademicIndex(routeId) {
    const stats = gameState.stats || {};
    const intelligence = typeof stats.intelligence === "number" ? stats.intelligence : 0;
    const discipline = typeof stats.discipline === "number" ? stats.discipline : 0;
    const mental = typeof stats.mental === "number" ? stats.mental : 0;
    const health = typeof stats.health === "number" ? stats.health : 0;
    const stress = typeof stats.stress === "number" ? stats.stress : 0;
    let index = intelligence * 0.68 + discipline * 0.18 + mental * 0.08 + health * 0.06;

    if (routeId === "overseas_research_path") {
      index += 4;
    } else if (routeId === "overseas_practical_path") {
      index -= 2;
    }

    if (stress > 55) {
      index -= Math.min(8, Math.round((stress - 55) * 0.2));
    }
    if (mental < 45) {
      index -= Math.min(6, Math.round((45 - mental) * 0.15));
    }

    return clampNumber(Math.round(index), 0, 100);
  }

  function determineOverseasQsBand(academicIndex) {
    const score = typeof academicIndex === "number" ? academicIndex : 0;
    if (score >= 80) {
      return getOverseasQsBandById("qs_top_30");
    }
    if (score >= 72) {
      return getOverseasQsBandById("qs_31_60");
    }
    if (score >= 64) {
      return getOverseasQsBandById("qs_61_100");
    }
    if (score >= 56) {
      return getOverseasQsBandById("qs_101_200");
    }

    return getOverseasQsBandById("qs_201_plus");
  }

  function buildOverseasUniversityRecommendations(routeId, qsBand) {
    const preferredTags = getOverseasPreferredTags(routeId);
    const bandLabel = qsBand && qsBand.label ? qsBand.label : "QS 档位未定";
    const candidates = buildOverseasUniversityRecommendationCandidates(routeId, qsBand);

    return candidates
      .slice()
      .sort((left, right) => {
        const leftOrder = typeof left.scoreOrder === "number" ? left.scoreOrder : Number.MAX_SAFE_INTEGER;
        const rightOrder = typeof right.scoreOrder === "number" ? right.scoreOrder : Number.MAX_SAFE_INTEGER;
        return leftOrder - rightOrder;
      })
      .slice(0, 4)
      .map((school) => ({
        name: school.name,
        location: school.country || "海外",
        categoryLabel: bandLabel + " · " + (school.country || "海外"),
        reason: resolveRecommendationReason(
          school.fitNotes,
          preferredTags,
          "这所学校和你当前的学业能力、路线取向相对更接近。"
        )
      }));
  }

  function buildOverseasUniversityPreviewRecommendations(routeId, qsBand) {
    const preferredTags = getOverseasPreferredTags(routeId);
    const bandLabel = qsBand && qsBand.label ? qsBand.label : "QS 档位未定";
    const candidates = buildOverseasUniversityRecommendationCandidates(routeId, qsBand);

    return sortEntriesByWeight(candidates)
      .slice(0, 3)
      .map((school) => ({
      name: school.name,
      location: school.country || "海外",
      categoryLabel: bandLabel + " · " + (school.country || "海外"),
      reason: resolveRecommendationReason(
        school.fitNotes,
        preferredTags,
        "这所学校和你当前的学业能力、路线取向相对更接近。"
      )
    }));
  }

  function scoreOverseasSchoolForRoute(routeId, schoolTags) {
    const preferredTags = getOverseasPreferredTags(routeId);
    let score = 0;
    preferredTags.forEach((tag, index) => {
      if (tag && schoolTags.includes(tag)) {
        score += Math.max(1, preferredTags.length - index);
      }
    });
    return score;
  }

  function pickOverseasRouteChoiceForSchool(routeChoices, school) {
    const choices = Array.isArray(routeChoices) ? routeChoices : [];
    const schoolTags = normalizeStringArray(school && school.tags);
    let bestChoice = null;
    let bestScore = Number.NEGATIVE_INFINITY;

    choices.forEach((choice, index) => {
      const payload = choice && choice.customPayload && typeof choice.customPayload === "object" ? choice.customPayload : {};
      const routeId = typeof payload.routeId === "string" ? payload.routeId : "";
      const score = scoreOverseasSchoolForRoute(routeId, schoolTags) * 10 - index;
      if (score > bestScore) {
        bestScore = score;
        bestChoice = choice;
      }
    });

    return bestChoice;
  }

  function buildOverseasSchoolOptionText(school, qsBand) {
    const schoolName = school && school.name ? school.name : "海外学校";
    const country = school && school.country ? school.country : "海外";
    const bandLabel = qsBand && qsBand.label ? qsBand.label : "QS 档位未定";
    return "去 " + schoolName + "（" + country + " · " + bandLabel + "）";
  }

  function buildOverseasSchoolOptions(event) {
    if (!event || !Array.isArray(event.choices)) {
      return [];
    }

    const funding = resolveOverseasFunding();
    const routeChoices = event.choices.filter((choice) => {
      return (
        choice &&
        choice.customAction === "start_overseas_route" &&
        matchesConditions(choice.conditions, gameState) &&
        funding.ok
      );
    });
    if (!routeChoices.length) {
      return [];
    }

    const academicIndex = calculateOverseasAcademicIndex("");
    const qsBand = determineOverseasQsBand(academicIndex);
    const candidates = getOverseasUniversityCandidates(qsBand && qsBand.id ? qsBand.id : "").slice(0, 4);

    return candidates
      .map((school, index) => {
        const matchedChoice = pickOverseasRouteChoiceForSchool(routeChoices, school) || routeChoices[0];
        if (!matchedChoice) {
          return null;
        }

        const payload =
          matchedChoice.customPayload && typeof matchedChoice.customPayload === "object"
            ? { ...matchedChoice.customPayload }
            : {};
        payload.selectedUniversityName = school.name || "";
        payload.selectedUniversityCountry = school.country || "海外";
        payload.qsBandId = qsBand && qsBand.id ? qsBand.id : "";
        payload.qsBandLabel = qsBand && qsBand.label ? qsBand.label : "";

        return {
          ...matchedChoice,
          text: buildOverseasSchoolOptionText(school, qsBand),
          customPayload: payload,
          previewDisabled: true,
          index
        };
      })
      .filter(Boolean);
  }

  function buildDomesticSchoolOptions(event) {
    if (!event || !Array.isArray(event.choices)) {
      return [];
    }

    const gaokaoState = ensureGaokaoState();
    if (!gaokaoState.tierId) {
      return [];
    }

    const routeChoices = event.choices.filter((choice) => {
      return choice && choice.customAction === "resolve_gaokao_destination" && matchesConditions(choice.conditions, gameState);
    });
    if (!routeChoices.length) {
      return [];
    }

    const candidates = getDomesticUniversityCandidates(gaokaoState.tierId).slice(0, 4);

    return candidates
      .map((school, index) => {
        const matchedChoice = pickDomesticRouteChoiceForSchool(routeChoices, school) || routeChoices[0];
        if (!matchedChoice) {
          return null;
        }

        const payload =
          matchedChoice.customPayload && typeof matchedChoice.customPayload === "object"
            ? { ...matchedChoice.customPayload }
            : {};
        payload.selectedUniversityName = school.name || "";
        payload.selectedUniversityCity = school.city || "国内";
        payload.selectedUniversityType = school.type || "大学";

        return {
          ...matchedChoice,
          text: buildDomesticSchoolOptionText(school, gaokaoState.tierLabel),
          customPayload: payload,
          previewDisabled: true,
          index
        };
      })
      .filter(Boolean);
  }

  function getOptionRecommendationPreview(option) {
    if (!option || typeof option !== "object") {
      return null;
    }

    if (option.previewDisabled) {
      return null;
    }

    if (option.customAction === "resolve_gaokao_destination") {
      const gaokaoState = ensureGaokaoState();
      if (!gaokaoState.tierId) {
        return null;
      }

      const payload = option.customPayload && typeof option.customPayload === "object" ? option.customPayload : {};
      return {
        kind: "domestic",
        summary: "按你当前分数，你现在可选的学校会先落在“" + (gaokaoState.tierLabel || "区间未定") + "”。",
        universities: buildDomesticUniversityPreviewRecommendations(gaokaoState.tierId, payload)
      };
    }

    if (option.customAction === "start_overseas_route") {
      const payload = option.customPayload && typeof option.customPayload === "object" ? option.customPayload : {};
      const routeId = typeof payload.routeId === "string" ? payload.routeId : "";
      const academicIndex = calculateOverseasAcademicIndex(routeId);
      const qsBand = determineOverseasQsBand(academicIndex);
      return {
        kind: "overseas",
        summary:
          "按你当前学业能力，这条路大致会匹配到“" +
          (qsBand && qsBand.label ? qsBand.label : "QS 档位未定") +
          "”。",
        universities: buildOverseasUniversityPreviewRecommendations(routeId, qsBand)
      };
    }

    return null;
  }

  function pickUniversityDestination(tierId, payload) {
    const preference = payload && typeof payload === "object" ? payload : {};
    const willingnessToLeaveHome = Boolean(preference.willingnessToLeaveHome);
    const majorPreference = typeof preference.majorPreference === "string" ? preference.majorPreference : "";
    const familyPreference = typeof preference.familyPreference === "string" ? preference.familyPreference : "";
    const candidates = getUniversityPoolCandidates(tierId)
      .filter((candidate) => matchesConditions(candidate.conditions || {}, gameState))
      .map((candidate) => {
        let weight = typeof candidate.weight === "number" ? candidate.weight : 1;
        const tags = normalizeStringArray(candidate.preferenceTags);

        if (majorPreference && tags.includes(majorPreference)) {
          weight += 3;
        }
        if (willingnessToLeaveHome && tags.includes("leave_home")) {
          weight += 3;
        }
        if (!willingnessToLeaveHome && tags.includes("stay_close")) {
          weight += 3;
        }
        if (familyPreference && tags.includes(familyPreference)) {
          weight += 2;
        }

        weight += getWeightedModifierScore(candidate.modifiers, gameState);

        return {
          ...candidate,
          weight
        };
      });

    return pickWeightedEntry(candidates);
  }

  function ensureWorkLifeState() {
    if (!gameState.workLife || typeof gameState.workLife !== "object") {
      gameState.workLife = { workLocationId: "", housingId: "", jobApplicationsSent: 0 };
    }
    if (typeof gameState.workLife.workLocationId !== "string") {
      gameState.workLife.workLocationId = "";
    }
    if (typeof gameState.workLife.housingId !== "string") {
      gameState.workLife.housingId = "";
    }
    if (typeof gameState.workLife.jobApplicationsSent !== "number") {
      gameState.workLife.jobApplicationsSent = 0;
    }
  }

  function getParentsHomeAllowedWorkLocationIds() {
    const rules = lifeWorkLifeConfig.housingEligibilityRules || {};
    const list = rules.parentsHomeAllowedWorkLocationIds;
    return Array.isArray(list) && list.length ? list : ["loc_stay_local", "loc_hometown_return"];
  }

  function isParentsHomeAllowedForCurrentWorkLife() {
    ensureWorkLifeState();
    const wl = gameState.workLife;
    const locId = typeof wl.workLocationId === "string" ? wl.workLocationId.trim() : "";
    if (!locId) {
      return false;
    }
    return getParentsHomeAllowedWorkLocationIds().indexOf(locId) !== -1;
  }

  function computeEmployedAnnualSalaryIncomeForState(state) {
    const st = state || gameState;
    const wl = st.workLife && typeof st.workLife === "object" ? st.workLife : {};
    const cid = st.careerRoute && st.careerRoute.id ? st.careerRoute.id : "";
    if (!cid || careerZeroSalaryIds.indexOf(cid) !== -1) {
      return 0;
    }
    const salaryTable = lifeWorkLifeConfig.salaryByCareerRouteId || {};
    let income = typeof salaryTable[cid] === "number" ? salaryTable[cid] : 8;
    const locList = Array.isArray(lifeWorkLifeConfig.workLocations) ? lifeWorkLifeConfig.workLocations : [];
    const locId = typeof wl.workLocationId === "string" ? wl.workLocationId : "";
    const loc = locList.find(function (x) {
      return x && x.id === locId;
    });
    const mult = loc && typeof loc.salaryMult === "number" ? loc.salaryMult : 1;
    return Math.max(0, Math.round(income * mult));
  }

  function computeAnnualHousingRentAmount(annualSalaryIncome, housingId) {
    const hid = typeof housingId === "string" ? housingId.trim() : "";
    const rc = lifeWorkLifeConfig.rentConfig && typeof lifeWorkLifeConfig.rentConfig === "object" ? lifeWorkLifeConfig.rentConfig : {};
    const frac = typeof rc.annualSalaryFraction === "number" ? rc.annualSalaryFraction : 0.4;
    const tierMap = rc.housingRentTierMultipliers && typeof rc.housingRentTierMultipliers === "object" ? rc.housingRentTierMultipliers : {};
    if (!hid || hid === "housing_parents_home") {
      return 0;
    }
    const tier = typeof tierMap[hid] === "number" ? tierMap[hid] : 1;
    if (!annualSalaryIncome || tier <= 0) {
      return 0;
    }
    return Math.max(0, Math.round(annualSalaryIncome * frac * tier));
  }

  function suddenDeathProbabilityMultiplier(stateRef) {
    const cfg = getSuddenDeathConfig();
    const block = cfg.mentalStressRisk;
    if (!block || block.enabled === false) {
      return 1;
    }
    const maxM = typeof block.maxMultiplier === "number" ? block.maxMultiplier : 1.65;
    const hs = typeof block.highStressAtLeast === "number" ? block.highStressAtLeast : 78;
    const lm = typeof block.lowMentalAtMost === "number" ? block.lowMentalAtMost : 34;
    const cS = typeof block.stressBoostCoeff === "number" ? block.stressBoostCoeff : 0.0042;
    const cM = typeof block.mentalBoostCoeff === "number" ? block.mentalBoostCoeff : 0.0035;
    const st = stateRef && typeof stateRef.stats === "object" ? stateRef.stats : {};
    const stress = typeof st.stress === "number" ? st.stress : 0;
    const mental = typeof st.mental === "number" ? st.mental : 50;
    let m = 1;
    if (stress >= hs) {
      m += (stress - hs) * cS;
    }
    if (mental <= lm) {
      m += (lm - mental) * cM;
    }
    return Math.min(maxM, m);
  }

  function ensureEconomyLedger() {
    if (!gameState.economyLedger || typeof gameState.economyLedger !== "object") {
      gameState.economyLedger = { lastSettledAge: -1 };
    }
    if (typeof gameState.economyLedger.lastSettledAge !== "number") {
      gameState.economyLedger.lastSettledAge = -1;
    }
  }

  function computePartnerIntimacyScore(relationship) {
    if (!relationship) {
      return 0;
    }
    const w = lifeFamilyRevealConfig.weights || {};
    const wa = typeof w.affection === "number" ? w.affection : 0.45;
    const wt = typeof w.trust === "number" ? w.trust : 0.4;
    const wf = typeof w.familiarity === "number" ? w.familiarity : 0.15;
    const raw =
      (relationship.affection || 0) * wa +
      (relationship.trust || 0) * wt +
      (relationship.familiarity || 0) * wf;
    return Math.round(Math.max(0, Math.min(100, raw)));
  }

  function syncPartnerFamilyRevealFromIntimacy() {
    const threshold =
      typeof lifeFamilyRevealConfig.minIntimacyScore === "number" ? lifeFamilyRevealConfig.minIntimacyScore : 40;
    Object.values(gameState.relationships || {}).forEach((rel) => {
      if (!rel || !rel.met) {
        return;
      }
      const score = computePartnerIntimacyScore(rel);
      if (score < threshold || rel.partnerFamilyRevealed) {
        return;
      }
      rel.partnerFamilyRevealed = true;
      const pack = partnerFamilyById[rel.id] || partnerFamilyById._default || {};
      normalizeStringArray(pack.revealedFlags).forEach((flag) => {
        if (flag && !gameState.flags.includes(flag)) {
          gameState.flags.push(flag);
        }
      });
      addHistory("与 " + (rel.name || "TA") + " 足够亲近之后，Ta 终于愿意把家庭那一层说得更完整。");
    });
  }

  function resolvePartnerBioExtra(relationship, state) {
    if (!relationship || !state) {
      return "";
    }
    const packs = partnerBioSnippets[relationship.id] || partnerBioSnippets._default || {};
    const byEdu = packs.byEducationRouteId || {};
    const eduId = state.educationRoute && state.educationRoute.id ? state.educationRoute.id : "";
    let extra = eduId && byEdu[eduId] ? String(byEdu[eduId]) : "";
    const arcMap = packs.byCareerArc || {};
    const arc = relationship.growthArcId && arcMap[relationship.growthArcId] ? String(arcMap[relationship.growthArcId]) : "";
    if (arc) {
      extra = extra ? extra + "\n\n" + arc : arc;
    }
    if (state.overseas && state.overseas.active && packs.overseasActiveNote) {
      extra = extra ? extra + "\n\n" + String(packs.overseasActiveNote) : String(packs.overseasActiveNote);
    }
    return extra;
  }

  function computeJobAcceptProbability(payload) {
    const data = payload && typeof payload === "object" ? payload : {};
    const cfg = lifeJobApplicationConfig;
    let p = typeof cfg.baseAcceptProbability === "number" ? cfg.baseAcceptProbability : 0.38;
    const sw = cfg.statWeights || {};
    const st = gameState.stats || {};
    p += (st.intelligence || 0) * (typeof sw.intelligence === "number" ? sw.intelligence : 0);
    p += (st.social || 0) * (typeof sw.social === "number" ? sw.social : 0);
    p += (st.career || 0) * (typeof sw.career === "number" ? sw.career : 0);
    p += (st.mental || 0) * (typeof sw.mental === "number" ? sw.mental : 0);
    p += (st.familySupport || 0) * (typeof sw.familySupport === "number" ? sw.familySupport : 0);
    p -= (st.stress || 0) * (typeof cfg.stressPenalty === "number" ? cfg.stressPenalty : 0.001);
    if (data.referral) {
      p += typeof cfg.referralBonus === "number" ? cfg.referralBonus : 0.16;
    }
    if (data.familyLine) {
      p += typeof cfg.familyJobBonus === "number" ? cfg.familyJobBonus : 0.12;
    }
    if (gameState.flags.includes("top_school")) {
      p += typeof cfg.topSchoolBonus === "number" ? cfg.topSchoolBonus : 0.1;
    }
    const os = gameState.overseas && gameState.overseas.active;
    if (os || gameState.flags.includes("globalized_resume")) {
      p += typeof cfg.overseasEduBonus === "number" ? cfg.overseasEduBonus : 0.08;
    }
    const edu = gameState.educationRoute && gameState.educationRoute.id ? gameState.educationRoute.id : "";
    if (edu === "gaokao_vocational_college" || edu === "non_gaokao_skill_path") {
      p += typeof cfg.vocationalFitBonus === "number" ? cfg.vocationalFitBonus : 0.06;
    }
    if (edu === "direct_work_route") {
      p += typeof cfg.directWorkBonus === "number" ? cfg.directWorkBonus : 0.05;
    }
    const track = typeof data.track === "string" ? data.track : "";
    const tb = cfg.trackBonus && typeof cfg.trackBonus === "object" ? cfg.trackBonus : {};
    if (track && typeof tb[track] === "number") {
      p += tb[track];
    }
    const lo = typeof cfg.minAcceptProbability === "number" ? cfg.minAcceptProbability : 0.07;
    const hi = typeof cfg.maxAcceptProbability === "number" ? cfg.maxAcceptProbability : 0.88;
    return Math.max(lo, Math.min(hi, p));
  }

  function runSingleYearEconomyTick(forAge) {
    if (!gameState.flags.includes("annual_economy_active")) {
      return;
    }
    ensureWorkLifeState();
    const wl = gameState.workLife;
    if (!wl.workLocationId || !wl.housingId) {
      return;
    }
    const cid = gameState.careerRoute && gameState.careerRoute.id ? gameState.careerRoute.id : "";
    if (!cid || careerZeroSalaryIds.includes(cid)) {
      return;
    }
    const locList = Array.isArray(lifeWorkLifeConfig.workLocations) ? lifeWorkLifeConfig.workLocations : [];
    const loc = locList.find((x) => x && x.id === wl.workLocationId) || null;
    const income = computeEmployedAnnualSalaryIncomeForState(gameState);
    const livingBase =
      typeof lifeWorkLifeConfig.annualLivingCostBase === "number" ? lifeWorkLifeConfig.annualLivingCostBase : 7;
    let living = livingBase + (loc && typeof loc.livingCostAdd === "number" ? loc.livingCostAdd : 0);
    if (gameState.flags.includes("housing_parents_roof") || gameState.flags.includes("living_at_parents_after_school")) {
      const disc =
        typeof lifeWorkLifeConfig.liveWithParentsLivingDiscount === "number"
          ? lifeWorkLifeConfig.liveWithParentsLivingDiscount
          : 0;
      living = Math.max(2, living - disc);
    }
    const rent = computeAnnualHousingRentAmount(income, wl.housingId);
    const kids = getChildCount(gameState);
    const childCost = kids > 0 ? kids * 3 : 0;
    let net = income - living - rent - childCost;
    const bonusP =
      typeof lifeWorkLifeConfig.bonusProbabilityPerYear === "number" ? lifeWorkLifeConfig.bonusProbabilityPerYear : 0;
    if (bonusP > 0 && Math.random() < bonusP) {
      const br = lifeWorkLifeConfig.bonusMoneyRange;
      const lo = Array.isArray(br) && typeof br[0] === "number" ? br[0] : 2;
      const hi = Array.isArray(br) && typeof br[1] === "number" ? br[1] : 8;
      const bump = Math.round(lo + Math.random() * (hi - lo));
      net += bump;
      addHistory("这一年你拿到一笔额外奖金/副业进账（约 " + bump + "）。");
    }
    const layP =
      typeof lifeWorkLifeConfig.layoffProbabilityPerYear === "number" ? lifeWorkLifeConfig.layoffProbabilityPerYear : 0;
    if (layP > 0 && Math.random() < layP && forAge >= 26) {
      const drift = careerRouteMap.get("career_in_job_search");
      if (drift) {
        addHistory("这一年行业波动，你失去了原来的岗位，只能重新把自己放回求职市场里。");
        applyRouteDefinition(drift);
        removeGameFlags(["annual_economy_active", "employed_housing_settled", "pending_work_location_pick", "pending_housing_pick"]);
        addGameFlags(["job_pipeline_active", "post_layoff_search"]);
        ensureWorkLifeState();
        gameState.workLife.workLocationId = "";
        gameState.workLife.housingId = "";
        const smbLay = getStressMentalBalanceConfig();
        const layStress =
          typeof smbLay.layoffStress === "number"
            ? smbLay.layoffStress
            : typeof lifeWorkLifeConfig.layoffStress === "number"
              ? lifeWorkLifeConfig.layoffStress
              : 12;
        adjustStat("stress", layStress);
        adjustStat("career", -4);
        return;
      }
    }
    adjustStat("money", net);
    addHistory(
      "年度收支（约 " +
        forAge +
        " 岁）：工作收入约 " +
        income +
        "，日常与居住支出约 " +
        (living + rent + childCost) +
        "，净变动约 " +
        net +
        "。"
    );
  }

  function settleEconomyYearsAfterAgeJump(ageBefore, ageAfter) {
    if (typeof ageBefore !== "number" || typeof ageAfter !== "number" || ageAfter <= ageBefore) {
      return;
    }
    ensureEconomyLedger();
    let start = gameState.economyLedger.lastSettledAge + 1;
    const minStart = ageBefore + 1;
    if (start < minStart) {
      start = minStart;
    }
    for (let y = start; y <= ageAfter; y++) {
      runSingleYearEconomyTick(y);
      gameState.economyLedger.lastSettledAge = y;
    }
  }

  function stampEconomyForCurrentAgeIfNeeded() {
    ensureEconomyLedger();
    const a = gameState.age;
    if (gameState.economyLedger.lastSettledAge < a) {
      runSingleYearEconomyTick(a);
      gameState.economyLedger.lastSettledAge = a;
    }
  }

  function getSuddenDeathConfig() {
    const raw = window.LIFE_SUDDEN_DEATH_CONFIG;
    return raw && typeof raw === "object" ? raw : {};
  }

  function getHealthMentalRiskConfig() {
    const raw = window.LIFE_HEALTH_MENTAL_RISK_CONFIG;
    return raw && typeof raw === "object" ? raw : {};
  }

  function pickWeightedSuddenDeathOutcome(cfg) {
    const outcomes = Array.isArray(cfg.outcomes)
      ? cfg.outcomes.filter(function (o) {
          return o && typeof o.flag === "string" && o.flag.trim();
        })
      : [];
    if (!outcomes.length) {
      return null;
    }
    let total = 0;
    outcomes.forEach(function (o) {
      total += typeof o.weight === "number" && o.weight > 0 ? o.weight : 1;
    });
    let r = Math.random() * total;
    for (let i = 0; i < outcomes.length; i++) {
      const w = typeof outcomes[i].weight === "number" && outcomes[i].weight > 0 ? outcomes[i].weight : 1;
      r -= w;
      if (r <= 0) {
        return outcomes[i];
      }
    }
    return outcomes[outcomes.length - 1];
  }

  function finalizeSuddenDeathEnding(outcomeRow) {
    const flag = String(outcomeRow.flag || "").trim();
    if (!flag) {
      return false;
    }
    if (gameState.flags.indexOf(flag) === -1) {
      gameState.flags.push(flag);
    }
    const endingId =
      typeof outcomeRow.endingId === "string" && outcomeRow.endingId.trim()
        ? outcomeRow.endingId.trim()
        : "";
    const fromList = endingId
      ? allEndings.find(function (e) {
          return e.id === endingId;
        })
      : allEndings.find(function (e) {
          const rf = e.require && e.require.requiredFlags;
          return Array.isArray(rf) && rf.length === 1 && rf[0] === flag;
        });
    const cfgTitle = typeof outcomeRow.title === "string" ? outcomeRow.title.trim() : "";
    const cfgText = typeof outcomeRow.text === "string" ? outcomeRow.text.trim() : "";
    const merged = {
      id: (fromList && fromList.id) || flag,
      title: cfgTitle || (fromList && fromList.title) || "结局：突发意外",
      text: cfgText || (fromList && fromList.text) || "",
      instant: true,
      baseWeight: fromList && typeof fromList.baseWeight === "number" ? fromList.baseWeight : 800,
      require: fromList && fromList.require ? fromList.require : { requiredFlags: [flag] },
      weightModifiers: fromList && Array.isArray(fromList.weightModifiers) ? fromList.weightModifiers : []
    };
    gameState.ending = {
      ...merged,
      text: buildEndingText(merged),
      analysis: analyzeEndingSelection(fromList || merged, gameState)
    };
    setCurrentEvent(null);
    gameState.gameOver = true;
    addHistory("你的人生在中途走向了结局：" + merged.title.replace("结局：", ""));
    return true;
  }

  /**
   * 年龄从 ageBefore 增至 ageAfter 时：对经过的每个整数岁（≥minAge）各做一次 probabilityPerYear 判定。
   * 见 data/sudden-death-config.js。
   */
  function trySuddenDeathAnnualRollForAgeSpan(ageBefore, ageAfter) {
    if (!gameState.gameStarted || gameState.gameOver || gameState.setupStep) {
      return false;
    }
    const cfg = getSuddenDeathConfig();
    if (cfg.enabled === false) {
      return false;
    }
    const a0 = typeof ageBefore === "number" ? ageBefore : 0;
    const a1 = typeof ageAfter === "number" ? ageAfter : 0;
    if (a1 <= a0) {
      return false;
    }
    const minA = typeof cfg.minAge === "number" ? cfg.minAge : 18;
    const p =
      typeof cfg.probabilityPerYear === "number" && cfg.probabilityPerYear >= 0 && cfg.probabilityPerYear <= 1
        ? cfg.probabilityPerYear
        : 0.01;
    const startYear = Math.max(minA, a0 + 1);
    const endYear = a1;
    if (startYear > endYear) {
      return false;
    }
    for (let y = startYear; y <= endYear; y++) {
      const pEff = Math.min(0.035, p * suddenDeathProbabilityMultiplier(gameState));
      if (Math.random() < pEff) {
        const picked = pickWeightedSuddenDeathOutcome(cfg);
        if (!picked) {
          return false;
        }
        return finalizeSuddenDeathEnding(picked);
      }
    }
    return false;
  }

  /**
   * 侧栏「求婚」：以好感度百分比为核心接受概率，叠加小幅情境修正（仍 clamp）。
   * 配置项在 window.LIFE_PROPOSAL_SIDEBAR_CONFIG。
   */
  function computeSidebarProposalAcceptanceProbability(partner, state) {
    const st = state && state.stats ? state.stats : {};
    const aff = typeof partner.affection === "number" ? partner.affection : 0;
    const baseFromAffection = aff / 100;
    const c = lifeProposalSidebarConfig || {};
    const maxAdj = typeof c.maxProbabilityAdjust === "number" ? c.maxProbabilityAdjust : 0.12;
    let adj = 0;
    if (partner.status === "long_distance_dating") {
      adj -= typeof c.longDistancePenalty === "number" ? c.longDistancePenalty : 0.06;
    }
    if (["conflict", "cooling", "distance_cooling"].includes(partner.status)) {
      adj -= typeof c.rockyStatusPenalty === "number" ? c.rockyStatusPenalty : 0.05;
    }
    const ten = typeof partner.tension === "number" ? partner.tension : 0;
    if (ten >= 58) {
      adj -= typeof c.highTensionPenalty === "number" ? c.highTensionPenalty : 0.05;
    } else if (ten >= 48) {
      adj -= typeof c.midTensionPenalty === "number" ? c.midTensionPenalty : 0.02;
    }
    const mods = partner.growthModifiers && typeof partner.growthModifiers === "object" ? partner.growthModifiers : {};
    adj += (typeof mods.marriageEase === "number" ? mods.marriageEase : 0) * (typeof c.marriageEaseCoef === "number" ? c.marriageEaseCoef : 0.001);
    adj += (typeof mods.stability === "number" ? mods.stability : 0) * (typeof c.stabilityCoef === "number" ? c.stabilityCoef : 0.0008);
    adj -= (typeof mods.breakupRisk === "number" ? mods.breakupRisk : 0) * (typeof c.breakupRiskCoef === "number" ? c.breakupRiskCoef : 0.001);
    const biasMap =
      lifeMarriageConfig && lifeMarriageConfig.characterProposalBias && typeof lifeMarriageConfig.characterProposalBias === "object"
        ? lifeMarriageConfig.characterProposalBias
        : {};
    const b = biasMap[partner.id];
    if (typeof b === "number") {
      adj += b * (typeof c.characterBiasScale === "number" ? c.characterBiasScale : 0.45);
    }
    const pl =
      lifeMarriageConfig && lifeMarriageConfig.proposalLogic && typeof lifeMarriageConfig.proposalLogic === "object"
        ? lifeMarriageConfig.proposalLogic
        : {};
    const cfs = Array.isArray(pl.conflictFlags) ? pl.conflictFlags : [];
    const cfPen = typeof pl.conflictFlagPenalty === "number" ? pl.conflictFlagPenalty : 0.1;
    if (cfs.some(function (f) { return f && state.flags.indexOf(f) !== -1; })) {
      adj -= cfPen * (typeof c.conflictFlagScale === "number" ? c.conflictFlagScale : 0.6);
    }
    const lm = typeof pl.lowMoneyThreshold === "number" ? pl.lowMoneyThreshold : 14;
    if ((typeof st.money === "number" ? st.money : 0) < lm) {
      adj -= typeof c.lowMoneyPenalty === "number" ? c.lowMoneyPenalty : 0.04;
    }
    const shigh = typeof pl.playerStressHigh === "number" ? pl.playerStressHigh : 78;
    if ((typeof st.stress === "number" ? st.stress : 0) >= shigh) {
      adj -= typeof c.playerStressPenalty === "number" ? c.playerStressPenalty : 0.04;
    }
    adj = Math.max(-maxAdj, Math.min(maxAdj, adj));
    const lo = typeof c.minClamp === "number" ? c.minClamp : 0.05;
    const hi = typeof c.maxClamp === "number" ? c.maxClamp : 0.95;
    return clampNumber(baseFromAffection + adj, lo, hi);
  }

  function ensureRelationshipMilestonesFired() {
    if (!gameState.relationshipMilestonesFired || typeof gameState.relationshipMilestonesFired !== "object") {
      gameState.relationshipMilestonesFired = {};
    }
  }

  function maybeQueueAffection80Milestone(relationship, affectionBefore) {
    if (!relationship || !relationship.met || gameState.gameOver) {
      return;
    }
    if (gameState.flags.indexOf("player_married") !== -1) {
      return;
    }
    if (gameState.pendingForcedEvent && gameState.pendingForcedEvent.eventId) {
      return;
    }
    const prev = typeof affectionBefore === "number" ? affectionBefore : 0;
    const aff = typeof relationship.affection === "number" ? relationship.affection : 0;
    if (prev >= 80 || aff < 80) {
      return;
    }
    const allowedMilestone = new Set(
      Array.isArray(lifeProposalSidebarConfig.affection80AllowedStatuses)
        ? lifeProposalSidebarConfig.affection80AllowedStatuses
        : [
            "ambiguous",
            "close",
            "mutual_crush",
            "confessed",
            "dating",
            "passionate",
            "steady",
            "long_distance_dating",
            "cooling",
            "conflict",
            "reconnect",
            "reconnected",
            "distance_cooling",
            "rebuilding_distance",
            "hidden_double_track",
            "exposed_double_track"
          ]
    );
    if (!allowedMilestone.has(relationship.status)) {
      return;
    }
    const minAge =
      typeof lifeProposalSidebarConfig.affection80MilestoneMinPlayerAge === "number"
        ? lifeProposalSidebarConfig.affection80MilestoneMinPlayerAge
        : 17;
    if ((gameState.age || 0) < minAge) {
      return;
    }
    ensureRelationshipMilestonesFired();
    const slot = gameState.relationshipMilestonesFired[relationship.id] || {};
    if (slot.affection80) {
      return;
    }
    const evIdRaw =
      typeof lifeProposalSidebarConfig.affection80EventId === "string" ? lifeProposalSidebarConfig.affection80EventId.trim() : "";
    const evId = evIdRaw || "milestone_affection80_marriage_discussion";
    if (!eventMap.get(evId)) {
      return;
    }
    slot.affection80 = true;
    gameState.relationshipMilestonesFired[relationship.id] = slot;
    gameState.pendingForcedEvent = { eventId: evId, partnerId: relationship.id };
  }

  function computeMarriageProposalAcceptanceProbability(proposerType, partner, state) {
    const pl =
      lifeMarriageConfig && lifeMarriageConfig.proposalLogic && typeof lifeMarriageConfig.proposalLogic === "object"
        ? lifeMarriageConfig.proposalLogic
        : {};
    const st = state && state.stats ? state.stats : {};
    const lo = typeof pl.minClamp === "number" ? pl.minClamp : 0.07;
    const hi = typeof pl.maxClamp === "number" ? pl.maxClamp : 0.93;

    if (proposerType === "partner_followthrough") {
      let p = typeof pl.baseFollowThroughPartnerProposes === "number" ? pl.baseFollowThroughPartnerProposes : 0.88;
      p += ((typeof partner.affection === "number" ? partner.affection : 50) - 50) * (typeof pl.affectionCoef === "number" ? pl.affectionCoef * 0.45 : 0.003);
      p -= Math.max(0, (typeof partner.tension === "number" ? partner.tension : 0) - 38) * 0.004;
      const biasMap =
        lifeMarriageConfig && lifeMarriageConfig.characterProposalBias && typeof lifeMarriageConfig.characterProposalBias === "object"
          ? lifeMarriageConfig.characterProposalBias
          : {};
      const b = biasMap[partner.id];
      if (typeof b === "number") {
        p += b * 0.25;
      }
      return clampNumber(p, lo, hi);
    }

    let p = typeof pl.baseAcceptPlayerProposes === "number" ? pl.baseAcceptPlayerProposes : 0.36;
    p += ((typeof partner.affection === "number" ? partner.affection : 50) - 50) * (typeof pl.affectionCoef === "number" ? pl.affectionCoef : 0.007);
    p += ((typeof partner.trust === "number" ? partner.trust : 50) - 50) * (typeof pl.trustCoef === "number" ? pl.trustCoef : 0.006);
    p += ((typeof partner.commitment === "number" ? partner.commitment : 50) - 50) * (typeof pl.commitmentCoef === "number" ? pl.commitmentCoef : 0.008);
    p += ((typeof partner.continuity === "number" ? partner.continuity : 50) - 50) * (typeof pl.continuityCoef === "number" ? pl.continuityCoef : 0.004);
    const tStart = typeof pl.tensionStart === "number" ? pl.tensionStart : 40;
    p -= Math.max(0, (typeof partner.tension === "number" ? partner.tension : 0) - tStart) * (typeof pl.tensionPenaltyCoef === "number" ? pl.tensionPenaltyCoef : 0.005);
    const mods = partner.growthModifiers && typeof partner.growthModifiers === "object" ? partner.growthModifiers : {};
    p += (typeof mods.marriageEase === "number" ? mods.marriageEase : 0) * 0.004;
    p += (typeof mods.stability === "number" ? mods.stability : 0) * 0.002;
    p -= (typeof mods.breakupRisk === "number" ? mods.breakupRisk : 0) * 0.003;
    if (partner.status === "long_distance_dating") {
      p -= typeof pl.longDistancePenalty === "number" ? pl.longDistancePenalty : 0.12;
    }
    const lm = typeof pl.lowMoneyThreshold === "number" ? pl.lowMoneyThreshold : 14;
    if ((typeof st.money === "number" ? st.money : 0) < lm) {
      p -= typeof pl.lowMoneyPenalty === "number" ? pl.lowMoneyPenalty : 0.07;
    }
    const lc = typeof pl.lowCareerThreshold === "number" ? pl.lowCareerThreshold : 10;
    if ((typeof st.career === "number" ? st.career : 0) < lc) {
      p -= typeof pl.lowCareerPenalty === "number" ? pl.lowCareerPenalty : 0.05;
    }
    const shigh = typeof pl.playerStressHigh === "number" ? pl.playerStressHigh : 78;
    if ((typeof st.stress === "number" ? st.stress : 0) >= shigh) {
      p -= typeof pl.playerStressPenalty === "number" ? pl.playerStressPenalty : 0.06;
    }
    const cfPen = typeof pl.conflictFlagPenalty === "number" ? pl.conflictFlagPenalty : 0.1;
    const cfs = Array.isArray(pl.conflictFlags) ? pl.conflictFlags : [];
    if (cfs.some(function (f) { return f && state.flags.indexOf(f) !== -1; })) {
      p -= cfPen;
    }
    const pflags = Array.isArray(partner.flags) ? partner.flags : [];
    if (pflags.indexOf("growth_arc_volatile") !== -1) {
      p -= 0.055;
    }
    const biasMap2 =
      lifeMarriageConfig && lifeMarriageConfig.characterProposalBias && typeof lifeMarriageConfig.characterProposalBias === "object"
        ? lifeMarriageConfig.characterProposalBias
        : {};
    if (typeof biasMap2[partner.id] === "number") {
      p += biasMap2[partner.id];
    }
    return clampNumber(p, lo, hi);
  }

  function finalizeMarriageCommit(activeId, data) {
    const id = String(activeId || "").trim();
    if (!id) {
      return;
    }
    const cost = typeof data.moneyCost === "number" ? data.moneyCost : 0;
    if (cost > 0) {
      const have = gameState.stats.money || 0;
      const pay = Math.min(cost, have);
      if (pay > 0) {
        adjustStat("money", -pay);
      }
    }
    if (typeof data.happiness === "number") {
      adjustStat("happiness", data.happiness);
    }
    if (typeof data.stress === "number") {
      adjustStat("stress", data.stress);
    }
    normalizeStringArray(data.addFlags).forEach(function (f) {
      if (f && gameState.flags.indexOf(f) === -1) {
        gameState.flags.push(f);
      }
    });
    const partner = getRelationshipRecord(gameState, id);
    const spanNeed =
      typeof lifeMarriageConfig.minPartnerAgeSpan === "number" ? lifeMarriageConfig.minPartnerAgeSpan : 2;
    if (partner && (partner.partnerSinceAge === null || partner.partnerSinceAge === undefined)) {
      partner.partnerSinceAge = Math.max(0, gameState.age - spanNeed);
    }
    if (partner) {
      partner.marriedSinceAge = gameState.age;
    }
    setRelationshipStatus(
      id,
      "married",
      typeof data.partnerHistory === "string" && data.partnerHistory
        ? data.partnerHistory
        : "你们把关系写进更长的条款里：婚礼或许简单，但承诺是认真的。"
    );
    if (partner) {
      syncRelationshipStage(partner);
      inferRelationshipStatus(partner);
    }
    addHistory("你们进入了婚姻：生活从「我」默认要改成「我们」。");
  }

  function performCustomAction(actionName, payload) {
    const action = String(actionName || "").trim();
    const data = payload && typeof payload === "object" ? payload : {};

    if (!action) {
      return;
    }

    if (action === "set_life_path") {
      gameState.lifePath = typeof data.lifePath === "string" ? data.lifePath : gameState.lifePath;
      addGameFlags(normalizeStringArray(data.addFlags));
      removeGameFlags(normalizeStringArray(data.removeFlags));
      return;
    }

    if (action === "assign_gaokao_region") {
      selectGaokaoRegion();
      return;
    }

    if (action === "simulate_gaokao") {
      const gaokaoState = ensureGaokaoState();
      const region = selectGaokaoRegion();
      const scoreRule =
        gaokaoConfig.baseScore && typeof gaokaoConfig.baseScore === "object" ? gaokaoConfig.baseScore : {};
      const statWeights =
        scoreRule.statWeights && typeof scoreRule.statWeights === "object"
          ? scoreRule.statWeights
          : {
              intelligence: 0.54,
              discipline: 0.16,
              mental: 0.08,
              health: 0.06,
              familySupport: 0.04,
              social: 0.02,
              stressResistance: 0.1
            };
      const weightedScore =
        (gameState.stats.intelligence || 0) * (statWeights.intelligence || 0) +
        (gameState.stats.discipline || 0) * (statWeights.discipline || 0) +
        (gameState.stats.mental || 0) * (statWeights.mental || 0) +
        (gameState.stats.health || 0) * (statWeights.health || 0) +
        (gameState.stats.familySupport || 0) * (statWeights.familySupport || 0) +
        (gameState.stats.social || 0) * (statWeights.social || 0) +
        (100 - (gameState.stats.stress || 0)) * (statWeights.stressResistance || 0);
      const minBase = typeof scoreRule.minimum === "number" ? scoreRule.minimum : 280;
      const maxBase = typeof scoreRule.maximum === "number" ? scoreRule.maximum : 655;
      const baseScore = Math.round(minBase + clampNumber(weightedScore, 0, 100) / 100 * (maxBase - minBase));
      const trajectoryBonus = getTrajectoryBonus(gaokaoConfig.trajectoryBonuses);
      const performanceProfiles =
        gaokaoConfig.performanceProfiles && typeof gaokaoConfig.performanceProfiles === "object"
          ? gaokaoConfig.performanceProfiles
          : {};
      const roll = Math.random();
      let performanceId = "normal";
      let running = 0;

      Object.entries(performanceProfiles).forEach(([profileId, profile]) => {
        if (running < 1 && roll >= running && roll < running + (profile.probability || 0)) {
          performanceId = profileId;
        }
        running += profile.probability || 0;
      });

      const selectedProfile = performanceProfiles[performanceId] || performanceProfiles.normal || {};
      const performanceDelta = randomInRange(selectedProfile.offsetRange);
      const finalScore = clampNumber(
        Math.round(baseScore + trajectoryBonus + performanceDelta),
        0,
        typeof gaokaoState.totalScore === "number" ? gaokaoState.totalScore : 750
      );
      const tier = determineGaokaoTier(region, finalScore);
      const narrative = pickNarrativeFromPool(
        selectedProfile.narratives,
        typeof selectedProfile.fallbackText === "string" ? selectedProfile.fallbackText : "你走完了那几场最重要的考试。"
      );

      gaokaoState.attempted = true;
      gaokaoState.baseScore = clampNumber(Math.round(baseScore + trajectoryBonus), 0, gaokaoState.totalScore);
      gaokaoState.score = finalScore;
      gaokaoState.performance = performanceId;
      gaokaoState.performanceLabel = selectedProfile.label || performanceId;
      gaokaoState.performanceNarrative = narrative;
      gaokaoState.tierId = tier && tier.id ? tier.id : "";
      gaokaoState.tierLabel = tier && tier.label ? tier.label : "去向待定";
      gaokaoState.notes = normalizeStringArray([
        region && region.summary ? region.summary : "",
        typeof narrative === "string" ? narrative : ""
      ]);

      addGameFlags([
        "life_path_gaokao",
        "gaokao_taken",
        "gaokao_performance_" + performanceId,
        gaokaoState.tierId ? "gaokao_tier_" + gaokaoState.tierId : ""
      ]);
      addHistory(
        "高考成绩出来了：你拿到了 " +
          finalScore +
          " 分，落在“" +
          gaokaoState.tierLabel +
          "”。"
      );
      addHistory(narrative);
      return;
    }

    if (action === "resolve_gaokao_destination") {
      const gaokaoState = ensureGaokaoState();
      const willingnessToLeaveHome = Boolean(data.willingnessToLeaveHome);
      const majorPreference = typeof data.majorPreference === "string" ? data.majorPreference : "";
      const familyPreference = typeof data.familyPreference === "string" ? data.familyPreference : "";
      const selectedUniversityName = typeof data.selectedUniversityName === "string" ? data.selectedUniversityName : "";
      const selectedUniversityCity = typeof data.selectedUniversityCity === "string" ? data.selectedUniversityCity : "";
      const destination = pickUniversityDestination(gaokaoState.tierId, {
        willingnessToLeaveHome,
        majorPreference,
        familyPreference
      });

      gaokaoState.willingnessToLeaveHome = willingnessToLeaveHome;
      gaokaoState.majorPreference = majorPreference;

      if (destination && destination.routeId) {
        gaokaoState.destinationPoolId = destination.id || "";
        gaokaoState.destinationLabel = destination.label || destination.routeId;
        gaokaoState.recommendedUniversities = buildDomesticUniversityRecommendations(gaokaoState.tierId, {
          willingnessToLeaveHome,
          majorPreference,
          familyPreference,
          selectedUniversityName
        });
        addHistory(
          selectedUniversityName
            ? "最后你把志愿落到了 " +
                selectedUniversityName +
                (selectedUniversityCity ? "，去向也因此走进了“" + gaokaoState.destinationLabel + "”。" : "。")
            : "最后去向没有被一条固定分数线写死。结合成绩、家里条件和你的取向，你走进了“" +
                gaokaoState.destinationLabel +
                "”。"
        );
        applyRouteDefinition(educationRouteMap.get(destination.routeId) || null);
        addGameFlags(normalizeStringArray(destination.addFlags));
        addGameTags(normalizeStringArray(destination.addTags));
        return;
      }

      if (typeof data.fallbackRouteId === "string" && data.fallbackRouteId) {
        gaokaoState.destinationLabel = data.fallbackLabel || "重新规划";
        applyRouteDefinition(educationRouteMap.get(data.fallbackRouteId) || null);
      }
      return;
    }

    if (action === "take_non_gaokao_route") {
      gameState.lifePath = "non_gaokao";
      addGameFlags(["life_path_non_gaokao"]);
      if (typeof data.routeId === "string" && data.routeId) {
        applyRouteDefinition(educationRouteMap.get(data.routeId) || null);
      }
      if (typeof data.log === "string" && data.log) {
        addHistory(data.log);
      }
      return;
    }

    if (action === "shop_purchase") {
      const itemId = typeof data.itemId === "string" ? data.itemId : "";
      const item = shopItemMap.get(itemId);
      if (!item) {
        return;
      }
      if (!isShopItemUnlockedForState(item, gameState)) {
        return;
      }
      const price = typeof item.price === "number" ? item.price : 0;
      if ((gameState.stats.money || 0) < price) {
        return;
      }
      adjustStat("money", -price);
      if (item.effects && item.effects.stats) {
        Object.entries(item.effects.stats).forEach(([key, delta]) => {
          adjustStat(key, delta);
        });
      }
      if (item.grantInventory && typeof item.grantInventory.itemId === "string") {
        const bag = ensureInventoryBag(gameState);
        const addCount = typeof item.grantInventory.count === "number" ? item.grantInventory.count : 1;
        const key = item.grantInventory.itemId;
        bag[key] = (bag[key] || 0) + addCount;
      }
      if (typeof item.log === "string" && item.log) {
        addHistory(item.log);
      }
      return;
    }

    if (action === "give_relationship_gift") {
      const itemId = typeof data.itemId === "string" ? data.itemId : "";
      const targetRaw = typeof data.targetId === "string" && data.targetId.trim() ? data.targetId : "$active";
      const targetId = resolveRelationshipTargetId(targetRaw);
      if (!itemId || !targetId || getInventoryItemCount(gameState, itemId) < 1) {
        return;
      }
      const bag = ensureInventoryBag(gameState);
      bag[itemId] = (bag[itemId] || 1) - 1;
      if (bag[itemId] <= 0) {
        delete bag[itemId];
      }

      const relationship = getRelationshipRecord(gameState, targetId);
      const rule = lifeGiftEffects[itemId] || {};
      const itemMeta = shopItemMap.get(itemId) || {};
      const price = typeof itemMeta.price === "number" ? itemMeta.price : 0;
      const traits = relationship ? normalizeStringArray(relationship.traitTags) : [];
      const fitTags = normalizeStringArray(rule.fitTraitTags);
      const fit = !fitTags.length || fitTags.some((tag) => traits.includes(tag));
      const shallowStatuses = [
        "unknown",
        "noticed",
        "acquaintance",
        "noticed_by_them",
        "familiar",
        "crush"
      ];
      const shallow = relationship && shallowStatuses.includes(relationship.status);
      const expensiveThreshold = typeof rule.expensiveThreshold === "number" ? rule.expensiveThreshold : 999;
      const expensive = price >= expensiveThreshold;

      let pack = rule.neutralBonus || { affection: 2, familiarity: 2 };
      if (expensive && shallow) {
        pack = rule.expensiveEarlyPenalty || pack;
      } else if (!fit && fitTags.length) {
        pack = rule.mismatchPenalty || pack;
      } else if (fit && fitTags.length) {
        pack = rule.goodBonus || pack;
      }

      applyRelationshipEffects([
        {
          targetId,
          affection: typeof pack.affection === "number" ? pack.affection : 0,
          trust: typeof pack.trust === "number" ? pack.trust : 0,
          tension: typeof pack.tension === "number" ? pack.tension : 0,
          theirInterest: typeof pack.theirInterest === "number" ? pack.theirInterest : 0,
          commitment: typeof pack.commitment === "number" ? pack.commitment : 0,
          familiarity: typeof pack.familiarity === "number" ? pack.familiarity : 0,
          history:
            typeof pack.history === "string"
              ? pack.history
              : "礼物递出去的那一刻，你们之间的关系也被轻轻推了一下。"
        }
      ]);
      addHistory("你把礼物送出去，心里同时松了一口气，又悬起另一口气。");
      return;
    }

    if (action === "child_path_decision") {
      if (!gameState.children || typeof gameState.children !== "object") {
        gameState.children = { count: 0, tags: [], careMode: "", lastCareEventAge: null };
      }
      if (!Array.isArray(gameState.children.tags)) {
        gameState.children.tags = [];
      }
      if (typeof gameState.children.careMode !== "string") {
        gameState.children.careMode = "";
      }
      if (typeof gameState.children.lastCareEventAge !== "number") {
        gameState.children.lastCareEventAge = null;
      }
      const add = typeof data.addCount === "number" ? data.addCount : 0;
      gameState.children.count = Math.max(0, (gameState.children.count || 0) + add);
      normalizeStringArray(data.tags).forEach((tag) => {
        if (!gameState.children.tags.includes(tag)) {
          gameState.children.tags.push(tag);
        }
      });
      if (add > 0) {
        addGameFlags(["has_child", "parent_active", "parenting_phase_newborn"]);
        gameState.children.lastCareEventAge = gameState.age;
        adjustStat("stress", 4);
        adjustStat("money", -4);
        adjustStat("happiness", 2);
        addHistory("家里多了一个需要被接住的生命，你的时间表和钱包同时被改写。");
      }
      return;
    }

    if (action === "job_application_roll") {
      const targetId = typeof data.targetCareerRouteId === "string" ? data.targetCareerRouteId.trim() : "";
      const route = targetId ? careerRouteMap.get(targetId) : null;
      if (!route) {
        addHistory("这条求职路径暂时无法解析，先换一个岗位方向试试。");
        return;
      }
      if (!matchesConditions(route.conditions, gameState)) {
        addHistory("你掂了掂门槛，发现自己这条履历还不够挨到那一类岗位——先换更现实的目标。");
        ensureWorkLifeState();
        gameState.workLife.jobApplicationsSent += 1;
        adjustStat("stress", 2);
        adjustStat("mental", -1);
        return;
      }
      ensureWorkLifeState();
      gameState.workLife.jobApplicationsSent += 1;
      const p = computeJobAcceptProbability(data);
      const roll = Math.random();
      if (roll > p) {
        addHistory(
          "这一轮回音仍是拒绝：测评、面试或沉默的已读不回，把你推回「再改一版简历」的桌子前。（录取概率约 " +
            Math.round(p * 100) +
            "%，未命中）"
        );
        adjustStat("stress", 3);
        adjustStat("mental", -1);
        return;
      }
      addHistory(
        "你拿到了一份可用的 offer——工资与强度未必完美，但至少把你从「求职者」暂时捞上岸。（本岗位估算录取概率约 " +
          Math.round(p * 100) +
          "%）"
      );
      removeGameFlags(["job_pipeline_active", "post_grad_job_hunt"]);
      applyRouteDefinition(route);
      addGameFlags(["pending_work_location_pick", "job_offer_received"]);
      adjustStat("happiness", 3);
      adjustStat("stress", -2);
      return;
    }

    if (action === "apply_work_location") {
      const locationId = typeof data.locationId === "string" ? data.locationId.trim() : "";
      const list = Array.isArray(lifeWorkLifeConfig.workLocations) ? lifeWorkLifeConfig.workLocations : [];
      const hit = list.find((x) => x && x.id === locationId) || null;
      if (!hit || !gameState.flags.includes("pending_work_location_pick")) {
        return;
      }
      const req = Array.isArray(hit.requiresFlags) ? hit.requiresFlags : [];
      if (req.length && !req.every((f) => gameState.flags.includes(f))) {
        addHistory("以你当前履历，这一工作地点选项暂不成立。");
        return;
      }
      ensureWorkLifeState();
      gameState.workLife.workLocationId = locationId;
      removeGameFlags(["pending_work_location_pick"]);
      addGameFlags(["pending_housing_pick", "work_location_chosen"]);
      const st = hit.stats && typeof hit.stats === "object" ? hit.stats : {};
      Object.keys(st).forEach((k) => {
        const v = st[k];
        if (typeof v === "number") {
          adjustStat(k, v);
        }
      });
      addHistory("你把工作半径落在：" + (hit.label || locationId) + "。");
      return;
    }

    if (action === "apply_housing_choice") {
      const housingId = typeof data.housingId === "string" ? data.housingId.trim() : "";
      const hlist = Array.isArray(lifeWorkLifeConfig.housingOptions) ? lifeWorkLifeConfig.housingOptions : [];
      const h = hlist.find((x) => x && x.id === housingId) || null;
      if (!h || !gameState.flags.includes("pending_housing_pick")) {
        return;
      }
      if (housingId === "housing_parents_home" && !isParentsHomeAllowedForCurrentWorkLife()) {
        addHistory("你现在的工作半径不在老家附近，没法每天住回父母家，换一个更现实的租房或宿舍方案。");
        return;
      }
      const inc = Array.isArray(h.incompatibleFlags) ? h.incompatibleFlags : [];
      if (inc.length && inc.some((f) => gameState.flags.includes(f))) {
        addHistory("以你当前状态，这个住房选项不太成立，换一项更现实的。");
        return;
      }
      ensureWorkLifeState();
      gameState.workLife.housingId = housingId;
      removeGameFlags(["pending_housing_pick"]);
      addGameFlags(["annual_economy_active", "employed_housing_settled"]);
      normalizeStringArray(h.addFlags).forEach((f) => {
        if (f && !gameState.flags.includes(f)) {
          gameState.flags.push(f);
        }
      });
      const hs = h.stats && typeof h.stats === "object" ? h.stats : {};
      Object.keys(hs).forEach((k) => {
        const v = hs[k];
        if (typeof v === "number") {
          adjustStat(k, v);
        }
      });
      addHistory("你敲定了住房方案：" + (h.label || housingId) + "；之后的财富将按年结算工资、日常支出与房租。");
      ensureEconomyLedger();
      gameState.economyLedger.lastSettledAge = gameState.age - 1;
      stampEconomyForCurrentAgeIfNeeded();
      return;
    }

    if (action === "abandon_overseas_for_domestic") {
      removeGameFlags(["life_path_overseas"]);
      const target = typeof data.targetLifePath === "string" ? data.targetLifePath : "gaokao";
      gameState.lifePath = target;
      if (target === "gaokao") {
        addGameFlags(["life_path_gaokao"]);
      } else if (target === "non_gaokao") {
        addGameFlags(["life_path_non_gaokao"]);
      }
      addGameFlags(["overseas_blocked_finance"]);
      const os = ensureOverseasState();
      const debtContrib = typeof os.studyLoanDebtStatContribution === "number" ? os.studyLoanDebtStatContribution : 0;
      if (debtContrib > 0) {
        const debtNow = gameState.stats.debt || 0;
        adjustStat("debt", -Math.min(debtContrib, debtNow));
      }
      os.active = false;
      os.studyLoanActive = false;
      os.studyLoanBalance = 0;
      os.studyLoanDebtStatContribution = 0;
      os.fundingMode = "";
      removeGameFlags(["overseas_study_loan", "study_abroad_debt"]);
      addHistory(
        typeof data.log === "string" && data.log
          ? data.log
          : "你把「出国」从当下的人生里先拿下来，承认这一次现实比愿望更硬。"
      );
      return;
    }

    if (action === "start_overseas_route") {
      const costCfg = lifeOverseasFinance.overseasCostConfig || {};
      const tuition = typeof costCfg.tuitionCost === "number" ? costCfg.tuitionCost : 30;
      const { financeExtraFromLoan, budgetLoanNote } = applyStudyAbroadFunding(tuition);

      const overseasState = ensureOverseasState();
      gameState.lifePath = "overseas";
      overseasState.active = true;
      overseasState.routeId = typeof data.routeId === "string" ? data.routeId : overseasState.routeId;
      overseasState.routeName = typeof data.routeName === "string" ? data.routeName : overseasState.routeName;
      overseasState.selectedUniversityName =
        typeof data.selectedUniversityName === "string" ? data.selectedUniversityName : overseasState.selectedUniversityName;
      overseasState.selectedUniversityCountry =
        typeof data.selectedUniversityCountry === "string"
          ? data.selectedUniversityCountry
          : overseasState.selectedUniversityCountry;
      overseasState.destination = typeof data.destination === "string" ? data.destination : overseasState.destination;
      overseasState.supportLevel = typeof data.supportLevel === "string" ? data.supportLevel : overseasState.supportLevel;
      overseasState.phase = "arrival";
      overseasState.housingType = typeof data.housingType === "string" ? data.housingType : overseasState.housingType;
      const baseBudget = typeof data.budgetMode === "string" ? data.budgetMode : overseasState.budgetMode;
      overseasState.budgetMode = budgetLoanNote ? (baseBudget ? baseBudget + " · " + budgetLoanNote : budgetLoanNote) : baseBudget;
      overseasState.languagePressure = clampRelationshipMetric(
        (overseasState.languagePressure || 0) + (typeof data.languagePressure === "number" ? data.languagePressure : 0)
      );
      overseasState.loneliness = clampRelationshipMetric(
        (overseasState.loneliness || 0) + (typeof data.loneliness === "number" ? data.loneliness : 0)
      );
      overseasState.financePressure = clampRelationshipMetric(
        (overseasState.financePressure || 0) +
          (typeof data.financePressure === "number" ? data.financePressure : 0) +
          financeExtraFromLoan
      );
      overseasState.academicPressure = clampRelationshipMetric(
        typeof data.academicPressure === "number"
          ? data.academicPressure
          : overseasState.routeId === "overseas_research_path"
            ? 56
            : overseasState.routeId === "overseas_practical_path"
              ? 46
              : 52
      );
      overseasState.culturalStress = clampRelationshipMetric(
        typeof data.culturalStress === "number" ? data.culturalStress : 48
      );
      overseasState.homesickness = clampRelationshipMetric(typeof data.homesickness === "number" ? data.homesickness : 42);
      overseasState.socialComfort = clampRelationshipMetric(typeof data.socialComfort === "number" ? data.socialComfort : 28);
      overseasState.belonging = clampRelationshipMetric(typeof data.belonging === "number" ? data.belonging : 18);
      overseasState.independence = clampRelationshipMetric(typeof data.independence === "number" ? data.independence : 24);
      overseasState.burnout = clampRelationshipMetric(typeof data.burnout === "number" ? data.burnout : 18);
      overseasState.careerClarity = clampRelationshipMetric(typeof data.careerClarity === "number" ? data.careerClarity : 16);
      overseasState.visaPressure = clampRelationshipMetric(typeof data.visaPressure === "number" ? data.visaPressure : 10);
      overseasState.identityShift = clampRelationshipMetric(typeof data.identityShift === "number" ? data.identityShift : 22);
      overseasState.stayScore = clampRelationshipMetric(typeof data.stayScore === "number" ? data.stayScore : 24);
      overseasState.returnScore = clampRelationshipMetric(typeof data.returnScore === "number" ? data.returnScore : 18);
      overseasState.exposureRisk = clampRelationshipMetric(
        (overseasState.exposureRisk || 0) + (typeof data.exposureRisk === "number" ? data.exposureRisk : 0)
      );
      addGameFlags(["life_path_overseas"]);
      setOverseasPhase("arrival");
      overseasState.branchFocuses = [];
      if (overseasState.routeId === "overseas_research_path") {
        addUniqueItems(overseasState.branchFocuses, ["academic"]);
      } else if (overseasState.routeId === "overseas_practical_path") {
        addUniqueItems(overseasState.branchFocuses, ["survival", "career"]);
      } else if (overseasState.routeId === "overseas_art_path") {
        addUniqueItems(overseasState.branchFocuses, ["social", "romance"]);
      }
      if (overseasState.studyLoanActive && (overseasState.studyLoanBalance || 0) > 0) {
        addUniqueItems(overseasState.branchFocuses, ["survival"]);
      }
      if (typeof data.routeId === "string" && data.routeId) {
        applyRouteDefinition(educationRouteMap.get(data.routeId) || null);
      }
      overseasState.academicIndex = calculateOverseasAcademicIndex(overseasState.routeId);
      const calculatedQsBand = determineOverseasQsBand(overseasState.academicIndex);
      const qsBand =
        (typeof data.qsBandId === "string" && data.qsBandId && getOverseasQsBandById(data.qsBandId)) || calculatedQsBand;
      overseasState.qsBandId =
        typeof data.qsBandId === "string" && data.qsBandId ? data.qsBandId : qsBand && qsBand.id ? qsBand.id : "";
      overseasState.qsBandLabel =
        typeof data.qsBandLabel === "string" && data.qsBandLabel ? data.qsBandLabel : qsBand && qsBand.label ? qsBand.label : "";
      overseasState.recommendedUniversities = buildOverseasUniversityRecommendations(overseasState.routeId, qsBand);
      convertDomesticRelationshipsToDistance();
      syncOverseasDerivedFlags();
      addHistory(
        "你把生活连根拔起，开始准备去" +
          (overseasState.selectedUniversityName || overseasState.destination || "国外") +
          "念书。新的语言环境、经济账和孤独感，都会一起进场。"
      );
      return;
    }

    if (action === "adjust_overseas_pressures") {
      const overseasState = ensureOverseasState();
      overseasState.languagePressure = clampRelationshipMetric(
        (overseasState.languagePressure || 0) + (typeof data.languagePressure === "number" ? data.languagePressure : 0)
      );
      overseasState.loneliness = clampRelationshipMetric(
        (overseasState.loneliness || 0) + (typeof data.loneliness === "number" ? data.loneliness : 0)
      );
      overseasState.financePressure = clampRelationshipMetric(
        (overseasState.financePressure || 0) + (typeof data.financePressure === "number" ? data.financePressure : 0)
      );
      overseasState.exposureRisk = clampRelationshipMetric(
        (overseasState.exposureRisk || 0) + (typeof data.exposureRisk === "number" ? data.exposureRisk : 0)
      );
      syncOverseasDerivedFlags();
      return;
    }

    if (action === "update_overseas_profile") {
      applyOverseasProfileUpdate(data);
      return;
    }

    if (action === "register_overseas_connection") {
      registerOverseasConnection(data.relationshipId);
      return;
    }

    if (action === "activate_double_track") {
      const overseasState = ensureOverseasState();
      const domesticId = overseasState.domesticConnectionIds[0] || "";
      const overseasId = typeof data.relationshipId === "string" ? data.relationshipId : overseasState.newConnectionIds[0] || "";
      overseasState.doubleTrack = true;
      overseasState.exposureRisk = clampRelationshipMetric(
        (overseasState.exposureRisk || 0) + (typeof data.exposureRisk === "number" ? data.exposureRisk : 18)
      );
      addGameFlags(["overseas_double_track"]);

      if (domesticId) {
        setRelationshipStatus(
          domesticId,
          data.domesticStatus || "triangle",
          typeof data.domesticHistory === "string"
            ? data.domesticHistory
            : "隔着时差和屏幕，这段关系开始出现你没敢正面承认的裂缝。"
        );
      }

      if (overseasId) {
        registerOverseasConnection(overseasId);
        setRelationshipStatus(
          overseasId,
          data.overseasStatus || "hidden_double_track",
          typeof data.overseasHistory === "string"
            ? data.overseasHistory
            : "新的心动来得并不干净，因为旧关系并没有真正结束。"
        );
        gameState.activeRelationshipId = overseasId;
      }
      return;
    }

    if (action === "resolve_double_track") {
      const overseasState = ensureOverseasState();
      const domesticId = overseasState.domesticConnectionIds[0] || "";
      const overseasId = overseasState.newConnectionIds[0] || "";
      overseasState.doubleTrack = false;
      overseasState.exposureRisk = clampRelationshipMetric(
        (overseasState.exposureRisk || 0) + (typeof data.exposureRisk === "number" ? data.exposureRisk : 0)
      );

      if (domesticId && data.domesticStatus) {
        setRelationshipStatus(domesticId, data.domesticStatus, data.domesticHistory);
      }
      if (overseasId && data.overseasStatus) {
        setRelationshipStatus(overseasId, data.overseasStatus, data.overseasHistory);
      }

      if (data.clearFlag !== false) {
        removeGameFlags(["overseas_double_track"]);
      }
      return;
    }

    if (action === "marriage_commit") {
      const activeId = String(
        data.targetRelationshipId || data.partnerId || gameState.activeRelationshipId || ""
      ).trim();
      if (!activeId) {
        addHistory("你想推进到婚姻，但当下并没有一段被标记为「主要」的关系。");
        return;
      }
      const partner = getRelationshipRecord(gameState, activeId);
      const allowed = normalizeStringArray(lifeMarriageConfig.allowedStatuses || []);
      if (!partner || !allowed.includes(partner.status)) {
        addHistory("你们的状态还不到能把婚约说实的那一步。");
        return;
      }
      finalizeMarriageCommit(activeId, data);
      return;
    }

    if (action === "marriage_proposal_attempt") {
      const activeId = String(
        data.targetRelationshipId || data.partnerId || gameState.activeRelationshipId || ""
      ).trim();
      if (!activeId) {
        addHistory("你想推进到婚姻，但当下并没有一段被标记为「主要」的关系。");
        return;
      }
      const partner = getRelationshipRecord(gameState, activeId);
      const allowed = normalizeStringArray(lifeMarriageConfig.allowedStatuses || []);
      if (!partner || !allowed.includes(partner.status)) {
        addHistory("你们的状态还不到能把婚约说实的那一步。");
        return;
      }
      const minPAge = typeof lifeMarriageConfig.minPlayerAge === "number" ? lifeMarriageConfig.minPlayerAge : 24;
      if (gameState.age < minPAge) {
        addHistory("你觉得这时候把「结婚」说死还太早了一点。");
        return;
      }
      const proposerRaw = typeof data.proposer === "string" ? data.proposer.trim() : "player";
      const proposerType = proposerRaw === "partner_followthrough" ? "partner_followthrough" : "player";
      const pAccept = computeMarriageProposalAcceptanceProbability(proposerType, partner, gameState);
      const onSuccess = data.onSuccess && typeof data.onSuccess === "object" ? data.onSuccess : {};
      const onFail = data.onFail && typeof data.onFail === "object" ? data.onFail : {};
      const failRel =
        Array.isArray(data.failRelationshipEffects) && data.failRelationshipEffects.length
          ? data.failRelationshipEffects
          : Array.isArray(onFail.relationshipEffects)
            ? onFail.relationshipEffects
            : [];

      if (Math.random() < pAccept) {
        finalizeMarriageCommit(activeId, onSuccess);
      } else {
        normalizeStringArray(onFail.addFlags).forEach(function (f) {
          if (f && gameState.flags.indexOf(f) === -1) {
            gameState.flags.push(f);
          }
        });
        const st = onFail.stats && typeof onFail.stats === "object" ? onFail.stats : {};
        Object.keys(st).forEach(function (k) {
          if (typeof st[k] === "number") {
            adjustStat(k, st[k]);
          }
        });
        applyRelationshipEffects(failRel);
        if (typeof onFail.log === "string" && onFail.log) {
          addHistory(onFail.log);
        }
      }
      return;
    }

    if (action === "marriage_divorce_finalize") {
      let rid = String(data.partnerId || data.targetRelationshipId || gameState.activeRelationshipId || "").trim();
      if (!rid) {
        const marriedList = Object.values(gameState.relationships || {}).filter(function (r) {
          return r && r.status === "married";
        });
        if (marriedList.length === 1) {
          rid = marriedList[0].id;
        }
      }
      const partner = getRelationshipRecord(gameState, rid);
      if (!partner || partner.status !== "married") {
        addHistory("并没有一段仍有效的婚姻可供解除。");
        return;
      }
      removeGameFlags(["player_married"]);
      removeGameFlags(normalizeStringArray(data.removeGlobalFlags));
      addGameFlags(normalizeStringArray(data.addFlags));
      addGameFlags(["player_divorced", "player_was_married_at_least_once"]);
      const moneyAdj = typeof data.moneyDelta === "number" ? data.moneyDelta : 0;
      if (moneyAdj !== 0) {
        adjustStat("money", moneyAdj);
      }
      const debtAdj = typeof data.debtDelta === "number" ? data.debtDelta : 0;
      if (debtAdj !== 0) {
        adjustStat("debt", debtAdj);
      }
      const statsPack = data.stats && typeof data.stats === "object" ? data.stats : {};
      Object.keys(statsPack).forEach(function (k) {
        if (typeof statsPack[k] === "number") {
          adjustStat(k, statsPack[k]);
        }
      });
      setRelationshipStatus(
        rid,
        "divorced",
        typeof data.partnerHistory === "string" && data.partnerHistory
          ? data.partnerHistory
          : "婚姻在法律与日常里被拆开，你们从「我们」退回成两个要各自算账的人。"
      );
      applyRelationshipEffects(Array.isArray(data.relationshipEffects) ? data.relationshipEffects : []);
      if (gameState.activeRelationshipId === rid) {
        gameState.activeRelationshipId = null;
      }
      if (typeof data.log === "string" && data.log) {
        addHistory(data.log);
      } else {
        addHistory("你们结束了婚姻：日子还要继续，只是规则全换了。");
      }
      return;
    }
  }

  function matchesConditions(conditions, state, event) {
    const rule = normalizeConditionObject(conditions, event);

    if (typeof rule.minAge === "number" && state.age < rule.minAge) {
      return false;
    }

    if (typeof rule.maxAge === "number" && state.age > rule.maxAge) {
      return false;
    }

    if (typeof rule.minChoices === "number" && (state.choiceCount || 0) < rule.minChoices) {
      return false;
    }

    if (typeof rule.maxChoices === "number" && (state.choiceCount || 0) > rule.maxChoices) {
      return false;
    }

    if (rule.debtPrisonOrFlag) {
      const byFlag =
        rule.requiredFlags.length > 0 &&
        rule.requiredFlags.every((flag) => state.flags.includes(flag));
      const byDebt =
        rule.debtToMoneyPrison && matchesDebtToMoneyPrisonRule(rule.debtToMoneyPrison, state);
      if (!byFlag && !byDebt) {
        return false;
      }
    } else if (rule.requiredFlags.length && !rule.requiredFlags.every((flag) => state.flags.includes(flag))) {
      return false;
    }

    if (rule.excludedFlags.length && rule.excludedFlags.some((flag) => state.flags.includes(flag))) {
      return false;
    }

    if (rule.requiredTags.length && !rule.requiredTags.every((tag) => state.tags.includes(tag))) {
      return false;
    }

    if (rule.excludedTags.length && rule.excludedTags.some((tag) => state.tags.includes(tag))) {
      return false;
    }

    if (
      rule.requiredRomanceFlags.length &&
      !rule.requiredRomanceFlags.every((flag) => (state.romanceFlags || []).includes(flag))
    ) {
      return false;
    }

    if (
      rule.excludedRomanceFlags.length &&
      rule.excludedRomanceFlags.some((flag) => (state.romanceFlags || []).includes(flag))
    ) {
      return false;
    }

    if (rule.someFlags.length && !rule.someFlags.some((flag) => state.flags.includes(flag))) {
      return false;
    }

    if (rule.visited.length && !rule.visited.every((id) => state.visitedEvents.includes(id))) {
      return false;
    }

    if (rule.notVisited.length && rule.notVisited.some((id) => state.visitedEvents.includes(id))) {
      return false;
    }

    for (const [key, value] of Object.entries(rule.minStats)) {
      if ((state.stats[key] || 0) < value) {
        return false;
      }
    }

    for (const [key, value] of Object.entries(rule.maxStats)) {
      if ((state.stats[key] || 0) > value) {
        return false;
      }
    }

    if (typeof rule.minHealthZeroStreak === "number") {
      const streak =
        (state.wellbeingTracking && typeof state.wellbeingTracking.healthZeroConsecutiveSteps === "number"
          ? state.wellbeingTracking.healthZeroConsecutiveSteps
          : 0) || 0;
      if (streak < rule.minHealthZeroStreak) {
        return false;
      }
    }

    if (rule.requireHealthCollapseContext && !matchesHealthCollapseContextForEnding(state)) {
      return false;
    }

    if (rule.familyBackgroundIds.length) {
      const familyBackgroundId = state.familyBackground && state.familyBackground.id ? state.familyBackground.id : "";
      if (!familyBackgroundId || !rule.familyBackgroundIds.includes(familyBackgroundId)) {
        return false;
      }
    }

    if (rule.excludedFamilyBackgroundIds.length) {
      const familyBackgroundId = state.familyBackground && state.familyBackground.id ? state.familyBackground.id : "";
      if (familyBackgroundId && rule.excludedFamilyBackgroundIds.includes(familyBackgroundId)) {
        return false;
      }
    }

    if (rule.educationRouteIds.length) {
      const educationRouteId = state.educationRoute && state.educationRoute.id ? state.educationRoute.id : "";
      if (!educationRouteId || !rule.educationRouteIds.includes(educationRouteId)) {
        return false;
      }
    }

    if (rule.excludedEducationRouteIds.length) {
      const educationRouteId = state.educationRoute && state.educationRoute.id ? state.educationRoute.id : "";
      if (educationRouteId && rule.excludedEducationRouteIds.includes(educationRouteId)) {
        return false;
      }
    }

    if (rule.careerRouteIds.length) {
      const careerRouteId = state.careerRoute && state.careerRoute.id ? state.careerRoute.id : "";
      if (!careerRouteId || !rule.careerRouteIds.includes(careerRouteId)) {
        return false;
      }
    }

    if (rule.excludedCareerRouteIds.length) {
      const careerRouteId = state.careerRoute && state.careerRoute.id ? state.careerRoute.id : "";
      if (careerRouteId && rule.excludedCareerRouteIds.includes(careerRouteId)) {
        return false;
      }
    }

    if (rule.noCurrentPartner && getCurrentPartner(state)) {
      return false;
    }

    if (rule.activeRelationshipIds.length) {
      if (!state.activeRelationshipId || !rule.activeRelationshipIds.includes(state.activeRelationshipId)) {
        return false;
      }
    }

    if (rule.activeRelationshipStatuses.length) {
      const activeRelationship = state.activeRelationshipId
        ? getRelationshipSnapshot(state, state.activeRelationshipId)
        : null;
      if (!activeRelationship || !rule.activeRelationshipStatuses.includes(activeRelationship.status)) {
        return false;
      }
    }

    if (
      typeof rule.activeRelationshipMinAffection === "number" ||
      typeof rule.activeRelationshipMaxAffection === "number" ||
      typeof rule.activeRelationshipMinFamiliarity === "number" ||
      typeof rule.activeRelationshipMinTrust === "number" ||
      typeof rule.activeRelationshipMinPlayerInterest === "number" ||
      typeof rule.activeRelationshipMinTheirInterest === "number" ||
      typeof rule.activeRelationshipMaxTension === "number" ||
      typeof rule.activeRelationshipMinCommitment === "number" ||
      typeof rule.activeRelationshipMinContinuity === "number" ||
      typeof rule.activeRelationshipMinInteractionCount === "number" ||
      typeof rule.activeRelationshipMinPartnerAgeSpan === "number" ||
      rule.requiredActiveRelationshipFlags.length ||
      rule.excludedActiveRelationshipFlags.length ||
      rule.activeRelationshipRequiredSharedHistory.length ||
      rule.activeRelationshipExcludedSharedHistory.length
    ) {
      const activeRelationship = state.activeRelationshipId
        ? getRelationshipSnapshot(state, state.activeRelationshipId)
        : null;

      if (!activeRelationship) {
        return false;
      }

      if (
        typeof rule.activeRelationshipMinAffection === "number" &&
        activeRelationship.affection < rule.activeRelationshipMinAffection
      ) {
        return false;
      }

      if (
        typeof rule.activeRelationshipMaxAffection === "number" &&
        activeRelationship.affection > rule.activeRelationshipMaxAffection
      ) {
        return false;
      }

      if (
        typeof rule.activeRelationshipMinFamiliarity === "number" &&
        (activeRelationship.familiarity || 0) < rule.activeRelationshipMinFamiliarity
      ) {
        return false;
      }

      if (
        typeof rule.activeRelationshipMinTrust === "number" &&
        (activeRelationship.trust || 0) < rule.activeRelationshipMinTrust
      ) {
        return false;
      }

      if (
        typeof rule.activeRelationshipMinPlayerInterest === "number" &&
        (activeRelationship.playerInterest || 0) < rule.activeRelationshipMinPlayerInterest
      ) {
        return false;
      }

      if (
        typeof rule.activeRelationshipMinTheirInterest === "number" &&
        (activeRelationship.theirInterest || 0) < rule.activeRelationshipMinTheirInterest
      ) {
        return false;
      }

      if (
        typeof rule.activeRelationshipMaxTension === "number" &&
        (activeRelationship.tension || 0) > rule.activeRelationshipMaxTension
      ) {
        return false;
      }

      if (typeof rule.activeRelationshipMinCommitment === "number") {
        const ease = (activeRelationship.growthModifiers || {}).marriageEase || 0;
        const factor =
          typeof lifeMarriageConfig.commitmentEaseFactor === "number"
            ? lifeMarriageConfig.commitmentEaseFactor
            : 0.35;
        const need = Math.max(30, rule.activeRelationshipMinCommitment - ease * factor);
        if ((activeRelationship.commitment || 0) < need) {
          return false;
        }
      }

      if (
        typeof rule.activeRelationshipMinContinuity === "number" &&
        (activeRelationship.continuity || 0) < rule.activeRelationshipMinContinuity
      ) {
        return false;
      }

      if (
        typeof rule.activeRelationshipMinInteractionCount === "number" &&
        (activeRelationship.interactionCount || 0) < rule.activeRelationshipMinInteractionCount
      ) {
        return false;
      }

      if (
        typeof rule.activeRelationshipMinPartnerAgeSpan === "number" &&
        rule.activeRelationshipMinPartnerAgeSpan > 0
      ) {
        const started =
          typeof activeRelationship.partnerSinceAge === "number" ? activeRelationship.partnerSinceAge : null;
        if (started === null || state.age - started < rule.activeRelationshipMinPartnerAgeSpan) {
          return false;
        }
      }

      if (
        rule.requiredActiveRelationshipFlags.length &&
        !rule.requiredActiveRelationshipFlags.every((flag) => activeRelationship.flags.includes(flag))
      ) {
        return false;
      }

      if (
        rule.excludedActiveRelationshipFlags.length &&
        rule.excludedActiveRelationshipFlags.some((flag) => activeRelationship.flags.includes(flag))
      ) {
        return false;
      }

      if (
        rule.activeRelationshipRequiredSharedHistory.length &&
        !rule.activeRelationshipRequiredSharedHistory.every((item) =>
          (activeRelationship.sharedHistory || []).includes(item)
        )
      ) {
        return false;
      }

      if (
        rule.activeRelationshipExcludedSharedHistory.length &&
        rule.activeRelationshipExcludedSharedHistory.some((item) =>
          (activeRelationship.sharedHistory || []).includes(item)
        )
      ) {
        return false;
      }
    }

    if (rule.anyRelationshipStatuses.length) {
      const matched = Object.values(state.relationships || {}).some((relationship) =>
        rule.anyRelationshipStatuses.includes(relationship.status)
      );
      if (!matched) {
        return false;
      }
    }

    if (typeof rule.anyRelationshipMinAffection === "number") {
      const matched = Object.values(state.relationships || {}).some(
        (relationship) => relationship.affection >= rule.anyRelationshipMinAffection
      );
      if (!matched) {
        return false;
      }
    }

    if (rule.knownRelationships.length) {
      const knownOk = rule.knownRelationships.every((id) => {
        const relationship = getRelationshipSnapshot(state, id);
        return relationship && relationship.met;
      });
      if (!knownOk) {
        return false;
      }
    }

    if (rule.unknownRelationships.length) {
      const unknownOk = rule.unknownRelationships.every((id) => {
        const relationship = getRelationshipSnapshot(state, id);
        return !relationship || !relationship.met;
      });
      if (!unknownOk) {
        return false;
      }
    }

    for (const [relationshipId, statuses] of Object.entries(rule.relationshipStatuses)) {
      const relationship = getRelationshipSnapshot(state, relationshipId);
      if (!relationship || !statuses.includes(relationship.status)) {
        return false;
      }
    }

    for (const [relationshipId, statuses] of Object.entries(rule.excludedRelationshipStatuses)) {
      const relationship = getRelationshipSnapshot(state, relationshipId);
      if (relationship && statuses.includes(relationship.status)) {
        return false;
      }
    }

    for (const [relationshipId, amount] of Object.entries(rule.minAffection)) {
      const relationship = getRelationshipSnapshot(state, relationshipId);
      if (!relationship || relationship.affection < amount) {
        return false;
      }
    }

    for (const [relationshipId, amount] of Object.entries(rule.maxAffection)) {
      const relationship = getRelationshipSnapshot(state, relationshipId);
      if (relationship && relationship.affection > amount) {
        return false;
      }
    }

    for (const [relationshipId, flags] of Object.entries(rule.requiredRelationshipFlags)) {
      const relationship = getRelationshipSnapshot(state, relationshipId);
      if (!relationship || !flags.every((flag) => relationship.flags.includes(flag))) {
        return false;
      }
    }

    for (const [relationshipId, flags] of Object.entries(rule.excludedRelationshipFlags)) {
      const relationship = getRelationshipSnapshot(state, relationshipId);
      if (relationship && flags.some((flag) => relationship.flags.includes(flag))) {
        return false;
      }
    }

    for (const [relationshipId, historyIds] of Object.entries(rule.requiredSharedHistory)) {
      const relationship = getRelationshipSnapshot(state, relationshipId);
      if (!relationship || !historyIds.every((item) => (relationship.sharedHistory || []).includes(item))) {
        return false;
      }
    }

    for (const [relationshipId, historyIds] of Object.entries(rule.excludedSharedHistory)) {
      const relationship = getRelationshipSnapshot(state, relationshipId);
      if (relationship && historyIds.some((item) => (relationship.sharedHistory || []).includes(item))) {
        return false;
      }
    }

    for (const [relationshipId, amount] of Object.entries(rule.minFamiliarity)) {
      const relationship = getRelationshipSnapshot(state, relationshipId);
      if (!relationship || (relationship.familiarity || 0) < amount) {
        return false;
      }
    }

    for (const [relationshipId, amount] of Object.entries(rule.minTrust)) {
      const relationship = getRelationshipSnapshot(state, relationshipId);
      if (!relationship || (relationship.trust || 0) < amount) {
        return false;
      }
    }

    for (const [relationshipId, amount] of Object.entries(rule.minAmbiguity)) {
      const relationship = getRelationshipSnapshot(state, relationshipId);
      if (!relationship || (relationship.ambiguity || 0) < amount) {
        return false;
      }
    }

    for (const [relationshipId, amount] of Object.entries(rule.minPlayerInterest)) {
      const relationship = getRelationshipSnapshot(state, relationshipId);
      if (!relationship || (relationship.playerInterest || 0) < amount) {
        return false;
      }
    }

    for (const [relationshipId, amount] of Object.entries(rule.minTheirInterest)) {
      const relationship = getRelationshipSnapshot(state, relationshipId);
      if (!relationship || (relationship.theirInterest || 0) < amount) {
        return false;
      }
    }

    for (const [relationshipId, amount] of Object.entries(rule.maxTension)) {
      const relationship = getRelationshipSnapshot(state, relationshipId);
      if (relationship && (relationship.tension || 0) > amount) {
        return false;
      }
    }

    for (const [relationshipId, amount] of Object.entries(rule.minCommitment)) {
      const relationship = getRelationshipSnapshot(state, relationshipId);
      if (!relationship || (relationship.commitment || 0) < amount) {
        return false;
      }
    }

    for (const [relationshipId, amount] of Object.entries(rule.minContinuity)) {
      const relationship = getRelationshipSnapshot(state, relationshipId);
      if (!relationship || (relationship.continuity || 0) < amount) {
        return false;
      }
    }

    for (const [relationshipId, amount] of Object.entries(rule.minInteractionCount)) {
      const relationship = getRelationshipSnapshot(state, relationshipId);
      if (!relationship || (relationship.interactionCount || 0) < amount) {
        return false;
      }
    }

    if (typeof rule.minChildCount === "number" && getChildCount(state) < rule.minChildCount) {
      return false;
    }

    if (typeof rule.maxChildCount === "number" && getChildCount(state) > rule.maxChildCount) {
      return false;
    }

    for (const [itemId, min] of Object.entries(rule.inventoryMin)) {
      if (getInventoryItemCount(state, itemId) < min) {
        return false;
      }
    }

    if (!rule.debtPrisonOrFlag && rule.debtToMoneyPrison) {
      if (!matchesDebtToMoneyPrisonRule(rule.debtToMoneyPrison, state)) {
        return false;
      }
    }

    return true;
  }

  function setCurrentEvent(eventId) {
    gameState.currentEventId = eventId;
    gameState.currentEventPendingEnter = Boolean(eventId);
  }

  function pickWeightedFamilyBackground() {
    if (!allFamilyBackgrounds.length) {
      return null;
    }

    const totalWeight = allFamilyBackgrounds.reduce((sum, background) => sum + Math.max(0, background.weight || 0), 0);
    if (totalWeight <= 0) {
      return allFamilyBackgrounds[0];
    }

    let cursor = Math.random() * totalWeight;
    for (const background of allFamilyBackgrounds) {
      cursor -= Math.max(0, background.weight || 0);
      if (cursor <= 0) {
        return background;
      }
    }

    return allFamilyBackgrounds[allFamilyBackgrounds.length - 1];
  }

  function buildFamilyBackgroundText(background) {
    if (!background) {
      return "你的出生环境暂时还没有被写清。";
    }

    const detailLines = background.details.length ? background.details.map((line) => "• " + line).join("\n") : "";
    return [background.summary, background.description, detailLines].filter(Boolean).join("\n\n");
  }

  function buildFamilyBackgroundEvent(background) {
    return {
      id: "__family_background__",
      stage: "childhood",
      title: "开局：你的家庭条件",
      text: buildFamilyBackgroundText(background),
      choices: [
        {
          index: 0,
          text: "带着这份出身，开始长大。"
        }
      ]
    };
  }

  function applyFamilyBackground(background, options) {
    const settings = options || {};

    if (!background) {
      if (!settings.keepSetupStep) {
        gameState.setupStep = null;
      }
      if (!settings.keepPendingBackground) {
        gameState.pendingFamilyBackgroundId = null;
      }
      return;
    }

    gameState.familyBackground = {
      id: background.id,
      name: background.name,
      summary: background.summary,
      description: background.description,
      details: background.details.slice(),
      dimensions: { ...background.dimensions },
      storyHookTags: (background.storyHookTags || []).slice(),
      meta: {
        tier: background.meta && background.meta.tier ? background.meta.tier : "",
        advantages: background.meta && background.meta.advantages ? background.meta.advantages.slice() : [],
        costs: background.meta && background.meta.costs ? background.meta.costs.slice() : [],
        longTermBias:
          background.meta && background.meta.longTermBias && typeof background.meta.longTermBias === "object"
            ? { ...background.meta.longTermBias }
            : {}
      }
    };
    if (!settings.keepSetupStep) {
      gameState.setupStep = null;
    }
    if (!settings.keepPendingBackground) {
      gameState.pendingFamilyBackgroundId = null;
    }

    applyMutationBlock(background.apply, {
      skipStatLinks: true,
      allowAnyHealthEffects: true,
      preserveRawStressMental: true,
      familyBackgroundApply: true,
      familyBackgroundStatSkipKeys: FAMILY_BACKGROUND_CORE_STAT_KEYS
    });
    applyFamilyBackgroundCoreStats(background.id);
    if (!settings.skipHistory) {
      addHistory("你的原生家庭抽到了“" + background.name + "”。");

      if (background.summary) {
        addHistory(background.summary);
      }
    }
  }

  function restart() {
    gameState = stateApi.createInitialState();
    return getState();
  }

  function startGame(name, gender) {
    const normalizedGender = normalizePlayerGender(gender);
    if (!normalizedGender) {
      return getState();
    }

    gameState = stateApi.createInitialState();
    gameState.playerName = normalizeName(name);
    gameState.playerGender = normalizedGender;
    gameState.gameStarted = true;
    gameState.setupStep = "family_background";
    gameState.flags.push("player_gender_" + normalizedGender);

    const familyBackground = pickWeightedFamilyBackground();
    gameState.pendingFamilyBackgroundId = familyBackground ? familyBackground.id : null;
    applyFamilyBackground(familyBackground, {
      keepSetupStep: true,
      keepPendingBackground: true
    });

    addHistory("你出生了，名字被定为“" + gameState.playerName + "”。");
    addHistory("这一局里，你会以" + getPlayerGenderLabel(normalizedGender) + "的身份长大。");
    addHistory("很多年后回头看，这个名字会和原生家庭、无数选择一起，组成你的一生。");

    return getState();
  }

  function rememberEvent(eventId) {
    if (!gameState.visitedEvents.includes(eventId)) {
      gameState.visitedEvents.push(eventId);
    }

    gameState.eventVisitCounts[eventId] = (gameState.eventVisitCounts[eventId] || 0) + 1;
    gameState.recentEventIds.unshift(eventId);

    if (gameState.recentEventIds.length > 24) {
      gameState.recentEventIds.length = 24;
    }

    pushStoryDedupeLedger(gameState, eventMap.get(eventId) || null);
  }

  function rememberEnteredEvent(eventId) {
    if (!gameState.enteredEvents.includes(eventId)) {
      gameState.enteredEvents.push(eventId);
    }
  }

  /** 参与「自动叙事簇」签名的标签；换皮事件若标签组合相同会更难连刷 */
  var NARRATIVE_DEDUPE_TAG_SET = new Set([
    "accident",
    "romance",
    "children",
    "parenting",
    "school",
    "adolescence",
    "highschool",
    "college",
    "career",
    "work",
    "job_hunt",
    "education",
    "family",
    "health",
    "mental",
    "money",
    "social",
    "housing",
    "stability",
    "pressure",
    "reflection",
    "later_life",
    "childhood",
    "happiness"
  ]);

  function ensureStoryDedupe(state) {
    const s = state || gameState;
    if (!Array.isArray(s.recentStoryDedupe)) {
      s.recentStoryDedupe = [];
    }
    if (!s.storyDedupeSigLastAge || typeof s.storyDedupeSigLastAge !== "object") {
      s.storyDedupeSigLastAge = {};
    }
  }

  function relationshipStatusSaltForDedupe(event) {
    const rule =
      event && event.conditions && Array.isArray(event.conditions.activeRelationshipStatuses)
        ? event.conditions.activeRelationshipStatuses
        : [];
    if (!rule.length) {
      return "";
    }
    return rule
      .map((x) => String(x || "").trim())
      .filter(Boolean)
      .sort()
      .join(",");
  }

  function computeStorySignature(event, state) {
    if (!event || event.skipNarrativeDedupe) {
      return null;
    }
    const st = state || gameState;
    let base;
    if (event.dedupeKey) {
      base = "key:" + event.dedupeKey;
    } else {
      const narrative = (event.tags || []).filter((t) => NARRATIVE_DEDUPE_TAG_SET.has(t)).sort();
      if (!narrative.length) {
        return null;
      }
      base = "auto:" + narrative.join("|");
    }
    const rs = relationshipStatusSaltForDedupe(event);
    if (rs) {
      base += "|rs:" + rs;
    }
    if (event.tags && event.tags.indexOf("romance") !== -1 && st.activeRelationshipId) {
      base += "|rel:" + st.activeRelationshipId;
    }
    return base;
  }

  function defaultNarrativeSpacingChoices(event) {
    const tags = event.tags || [];
    if (tags.indexOf("accident") !== -1) {
      return 8;
    }
    if (tags.indexOf("romance") !== -1) {
      return 8;
    }
    if (tags.indexOf("children") !== -1 || tags.indexOf("parenting") !== -1) {
      return 6;
    }
    if (tags.some((t) => t === "school" || t === "adolescence" || t === "highschool" || t === "college")) {
      return 5;
    }
    if (tags.indexOf("career") !== -1 || tags.indexOf("work") !== -1 || tags.indexOf("job_hunt") !== -1) {
      return 5;
    }
    return 4;
  }

  function spacingChoicesForEvent(event) {
    if (typeof event.dedupeSpacingChoices === "number") {
      return event.dedupeSpacingChoices;
    }
    return defaultNarrativeSpacingChoices(event);
  }

  function isNarrativeDedupeBlocked(event, state) {
    if (!event || event.skipNarrativeDedupe) {
      return false;
    }
    const sig = computeStorySignature(event, state);
    if (!sig) {
      return false;
    }
    const st = state || gameState;
    ensureStoryDedupe(st);
    if (typeof event.dedupeMinAgeGap === "number" && event.dedupeMinAgeGap > 0) {
      const lastAge = st.storyDedupeSigLastAge[sig];
      if (typeof lastAge === "number" && st.age - lastAge < event.dedupeMinAgeGap) {
        return true;
      }
    }
    const spacing = spacingChoicesForEvent(event);
    const recent = st.recentStoryDedupe;
    for (let i = 0; i < recent.length && i < spacing; i++) {
      if (recent[i].s === sig) {
        return true;
      }
    }
    return false;
  }

  function pushStoryDedupeLedger(state, event) {
    if (!event) {
      return;
    }
    const st = state || gameState;
    ensureStoryDedupe(st);
    const sig = computeStorySignature(event, st);
    st.recentStoryDedupe.unshift({
      id: event.id,
      s: sig,
      a: st.age,
      c: typeof st.choiceCount === "number" ? st.choiceCount : 0
    });
    if (st.recentStoryDedupe.length > 36) {
      st.recentStoryDedupe.length = 36;
    }
    if (sig) {
      st.storyDedupeSigLastAge[sig] = st.age;
    }
  }

  function updateRomanceFlags(addFlags, removeFlags) {
    (addFlags || []).forEach((flag) => {
      if (!gameState.romanceFlags.includes(flag)) {
        gameState.romanceFlags.push(flag);
      }
    });

    if (removeFlags && removeFlags.length) {
      gameState.romanceFlags = gameState.romanceFlags.filter((flag) => !removeFlags.includes(flag));
    }
  }

  function getEventVisitCount(eventId) {
    return gameState.eventVisitCounts[eventId] || 0;
  }

  function isEventCoolingDown(event) {
    if (!event || !event.cooldownChoices) {
      return false;
    }

    return gameState.recentEventIds.slice(0, event.cooldownChoices).includes(event.id);
  }

  function ensureAccidentLedger(state) {
    const s = state || gameState;
    if (!s.accidentCountsByPhase || typeof s.accidentCountsByPhase !== "object") {
      s.accidentCountsByPhase = {};
    }
  }

  function deriveTimelinePhase(state) {
    const rules = Array.isArray(window.LIFE_TIMELINE_RULES) ? window.LIFE_TIMELINE_RULES : [];
    for (let i = 0; i < rules.length; i++) {
      const raw = rules[i];
      if (!raw || typeof raw.phaseId !== "string") {
        continue;
      }
      const cond = { ...raw };
      delete cond.phaseId;
      if (matchesConditions(normalizeConditionObject(cond, null), state, null)) {
        return raw.phaseId;
      }
    }
    return "adult_misc";
  }

  function getAccidentPhaseId(state) {
    const phases = Array.isArray(lifeAccidentStageConfig.phases) ? lifeAccidentStageConfig.phases : [];
    for (let i = 0; i < phases.length; i++) {
      const raw = phases[i];
      if (!raw || typeof raw.accidentPhaseId !== "string") {
        continue;
      }
      const cond = { ...raw };
      delete cond.accidentPhaseId;
      delete cond.minAccidents;
      if (matchesConditions(normalizeConditionObject(cond, null), state, null)) {
        return raw.accidentPhaseId;
      }
    }
    return "";
  }

  function getAccidentQuotaForPhase(phaseId) {
    if (!phaseId) {
      return 0;
    }
    const phases = Array.isArray(lifeAccidentStageConfig.phases) ? lifeAccidentStageConfig.phases : [];
    const hit = phases.find((p) => p && p.accidentPhaseId === phaseId);
    return hit && typeof hit.minAccidents === "number" ? hit.minAccidents : 0;
  }

  function getAccidentCountForState(state, phaseId) {
    ensureAccidentLedger(state);
    return state.accidentCountsByPhase[phaseId] || 0;
  }

  function bumpAccidentCountIfNeeded(event) {
    if (!event || !Array.isArray(event.tags) || !event.tags.includes("accident")) {
      return;
    }
    ensureAccidentLedger(gameState);
    const phaseId = getAccidentPhaseId(gameState);
    if (!phaseId) {
      return;
    }
    gameState.accidentCountsByPhase[phaseId] = (gameState.accidentCountsByPhase[phaseId] || 0) + 1;
  }

  function isStudentLikeEducationState(state) {
    const id = state && state.educationRoute && state.educationRoute.id ? state.educationRoute.id : "";
    const list = Array.isArray(window.LIFE_TIMELINE_STUDENT_EDUCATION_IDS)
      ? window.LIFE_TIMELINE_STUDENT_EDUCATION_IDS
      : [];
    return list.indexOf(id) !== -1;
  }

  function accidentEventMatchesDerivedLifePhase(event, state) {
    const st = state || gameState;
    if (!event || !Array.isArray(event.tags) || !event.tags.includes("accident")) {
      return true;
    }
    if (event.timelinePhaseIds && event.timelinePhaseIds.length) {
      return true;
    }
    const stg = typeof event.stage === "string" ? event.stage.trim() : "";
    if (!stg || stg === "misc") {
      return true;
    }
    const map = window.LIFE_ACCIDENT_TIMELINE_STAGE_ALLOWLIST;
    if (!map || typeof map !== "object") {
      return true;
    }
    const phaseId = deriveTimelinePhase(st);
    const allowed = map[phaseId];
    if (allowed == null) {
      return true;
    }
    return allowed.indexOf(stg) !== -1;
  }

  function eventPassesTimelineRules(event, state) {
    const st = state || gameState;
    if (!event) {
      return false;
    }
    const overrides =
      window.LIFE_TIMELINE_EVENT_OVERRIDES && typeof window.LIFE_TIMELINE_EVENT_OVERRIDES === "object"
        ? window.LIFE_TIMELINE_EVENT_OVERRIDES
        : {};
    const ov = overrides[event.id];
    if (ov && ov.skipTimelineCheck) {
      return true;
    }
    if (event.timelinePhaseIds && event.timelinePhaseIds.length) {
      const phase = deriveTimelinePhase(st);
      return event.timelinePhaseIds.indexOf(phase) !== -1;
    }
    const bands =
      window.LIFE_TIMELINE_STAGE_BANDS && typeof window.LIFE_TIMELINE_STAGE_BANDS === "object"
        ? window.LIFE_TIMELINE_STAGE_BANDS
        : {};
    const band = bands[event.stage];
    if (!band) {
      return accidentEventMatchesDerivedLifePhase(event, st);
    }
    const age = typeof st.age === "number" ? st.age : 0;
    if (typeof band.minAge === "number" && age < band.minAge) {
      return false;
    }
    if (typeof band.maxAge === "number" && age > band.maxAge) {
      return false;
    }
    if (band.requireStudentOrOverseas) {
      const overseas = (st.flags || []).indexOf("life_path_overseas") !== -1;
      if (!overseas && !isStudentLikeEducationState(st)) {
        return false;
      }
    }
    const extra = band.extraConditions || band.conditions;
    if (extra && typeof extra === "object" && Object.keys(extra).length) {
      if (!matchesConditions(normalizeConditionObject(extra, null), st, null)) {
        return false;
      }
    }
    if (Array.isArray(band.excludedEducationRouteIds) && band.excludedEducationRouteIds.length) {
      const eduId = st.educationRoute && st.educationRoute.id ? st.educationRoute.id : "";
      if (eduId && band.excludedEducationRouteIds.indexOf(eduId) !== -1) {
        return false;
      }
    }
    return accidentEventMatchesDerivedLifePhase(event, st);
  }

  function isEventEligible(event, candidateState) {
    const state = candidateState || gameState;
    const visitCount = state.eventVisitCounts && state.eventVisitCounts[event.id] ? state.eventVisitCounts[event.id] : 0;

    if (!event.repeatable && visitCount > 0) {
      return false;
    }

    if (typeof event.maxVisits === "number" && visitCount >= event.maxVisits) {
      return false;
    }

    if (Array.isArray(event.tags) && event.tags.includes("accident") && visitCount > 0) {
      return false;
    }

    if (!candidateState && isEventCoolingDown(event)) {
      return false;
    }

    if (!matchesConditions(event.conditions, state, event)) {
      return false;
    }

    return eventPassesTimelineRules(event, state);
  }

  function resolveRelationshipTargetId(targetId) {
    const normalizedId = String(targetId || "").trim();
    if (!normalizedId) {
      return "";
    }

    if (normalizedId === "$active" || normalizedId === "__active__") {
      return gameState.activeRelationshipId || "";
    }

    if (normalizedId === "$domestic_anchor") {
      const overseasState = ensureOverseasState();
      return overseasState.domesticConnectionIds[0] || "";
    }

    if (normalizedId === "$overseas_flame") {
      const overseasState = ensureOverseasState();
      return overseasState.newConnectionIds[0] || "";
    }

    return normalizedId;
  }

  function applyRelationshipEffects(effects) {
    let nextActiveId = null;
    let clearActive = false;

    (effects || []).forEach((effect) => {
      const resolvedTargetId = resolveRelationshipTargetId(effect.targetId);
      const relationship = getRelationshipRecord(gameState, resolvedTargetId);
      if (!relationship) {
        return;
      }

      const affectionBefore = typeof relationship.affection === "number" ? relationship.affection : 0;

      relationship.met = true;
      relationship.affection = clampAffection((relationship.affection || 0) + (effect.affection || 0));
      relationship.familiarity = clampRelationshipMetric((relationship.familiarity || 0) + (effect.familiarity || 0));
      relationship.trust = clampRelationshipMetric((relationship.trust || 0) + (effect.trust || 0));
      relationship.ambiguity = clampRelationshipMetric((relationship.ambiguity || 0) + (effect.ambiguity || 0));
      relationship.playerInterest = clampRelationshipMetric(
        (relationship.playerInterest || 0) + (effect.playerInterest || 0)
      );
      relationship.theirInterest = clampRelationshipMetric(
        (relationship.theirInterest || 0) + (effect.theirInterest || 0)
      );
      relationship.tension = clampRelationshipMetric((relationship.tension || 0) + (effect.tension || 0));
      relationship.commitment = clampRelationshipMetric(
        (relationship.commitment || 0) + (effect.commitment || 0)
      );
      relationship.continuity = clampRelationshipMetric((relationship.continuity || 0) + (effect.continuity || 0));
      relationship.interactionCount = Math.max(
        0,
        (relationship.interactionCount || 0) + (effect.interactions || 0)
      );
      relationship.lastInteractionAge = gameState.age;

      if (effect.status) {
        relationship.status = effect.status;
        syncRelationshipStage(relationship);
      }

      (effect.addFlags || []).forEach((flag) => {
        if (!relationship.flags.includes(flag)) {
          relationship.flags.push(flag);
        }
      });

      if (effect.removeFlags && effect.removeFlags.length) {
        relationship.flags = relationship.flags.filter((flag) => !effect.removeFlags.includes(flag));
      }

      (effect.addSharedHistory || []).forEach((historyId) => {
        if (!relationship.sharedHistory.includes(historyId)) {
          relationship.sharedHistory.push(historyId);
        }
      });

      if (effect.removeSharedHistory && effect.removeSharedHistory.length) {
        relationship.sharedHistory = relationship.sharedHistory.filter(
          (historyId) => !effect.removeSharedHistory.includes(historyId)
        );
      }

      refreshRelationshipAffection(relationship);
      if (!effect.status) {
        inferRelationshipStatus(relationship);
      } else {
        syncRelationshipStage(relationship);
      }

      if (effect.history) {
        addRelationshipHistory(relationship.id, effect.history);
      }

      maybeQueueAffection80Milestone(relationship, affectionBefore);

      if (effect.clearActive) {
        clearActive = true;
      }

      if (effect.setActive) {
        nextActiveId = resolvedTargetId;
      }

      if (["breakup", "broken", "estranged", "missed", "divorced"].includes(relationship.status) && gameState.activeRelationshipId === relationship.id) {
        clearActive = true;
      }
    });

    if (clearActive) {
      gameState.activeRelationshipId = null;
    }

    if (nextActiveId) {
      gameState.activeRelationshipId = nextActiveId;
    }

    syncPartnerFamilyRevealFromIntimacy();
  }

  function applyMutationBlock(block, options) {
    if (!block) {
      return;
    }

    const settings = options || {};
    const ageBeforeMutation = gameState.age;
    const effects = block.effects || {};

    if (!settings.skipAge && typeof effects.age === "number") {
      gameState.age = Math.max(gameState.age, gameState.age + effects.age);
    }

    if (effects.stats) {
      const skipFamilyCore =
        settings.familyBackgroundApply === true && Array.isArray(settings.familyBackgroundStatSkipKeys)
          ? settings.familyBackgroundStatSkipKeys
          : null;
      for (const [key, delta] of Object.entries(effects.stats)) {
        if (skipFamilyCore && skipFamilyCore.indexOf(key) !== -1) {
          continue;
        }
        let applied = delta;
        if (key === "health") {
          applied = applyResolvedHealthStatDelta(delta, {
            allowAnyHealthEffects: Boolean(settings.allowAnyHealthEffects),
            mutationEvent: settings.mutationEvent || null,
            mutationChoice: settings.mutationChoice || null
          });
        } else if (key === "stress") {
          applied = scaleStressStatDelta(delta, settings);
        } else if (key === "mental") {
          applied = scaleMentalStatDelta(delta, settings);
        }
        adjustStat(key, applied);
      }
    }

    (block.addFlags || []).forEach((flag) => {
      if (!gameState.flags.includes(flag)) {
        gameState.flags.push(flag);
      }
    });

    if (block.removeFlags && block.removeFlags.length) {
      gameState.flags = gameState.flags.filter((flag) => !block.removeFlags.includes(flag));
    }

    (block.addTags || []).forEach((tag) => {
      if (!gameState.tags.includes(tag)) {
        gameState.tags.push(tag);
      }
    });

    if (block.removeTags && block.removeTags.length) {
      gameState.tags = gameState.tags.filter((tag) => !block.removeTags.includes(tag));
    }

    updateRomanceFlags(block.addRomanceFlags, block.removeRomanceFlags);
    applyRelationshipEffects(block.relationshipEffects);

    if (typeof block.setEducationRoute === "string" && block.setEducationRoute) {
      applyRouteDefinition(educationRouteMap.get(block.setEducationRoute) || null);
    }

    if (typeof block.setCareerRoute === "string" && block.setCareerRoute) {
      applyRouteDefinition(careerRouteMap.get(block.setCareerRoute) || null);
    }

    if (block.customAction) {
      performCustomAction(block.customAction, block.customPayload);
    }

    if (block.clearActiveRelationship) {
      gameState.activeRelationshipId = null;
    }

    if (typeof block.setActiveRelationship === "string" && block.setActiveRelationship) {
      gameState.activeRelationshipId = block.setActiveRelationship;
      const relationship = getRelationshipRecord(gameState, block.setActiveRelationship);
      if (relationship) {
        relationship.met = true;
        relationship.continuity = clampRelationshipMetric((relationship.continuity || 0) + 2);
        relationship.lastInteractionAge = gameState.age;
      }
    }

    if (block.log) {
      addHistory(block.log);
    }

    if (!settings.skipStatLinks) {
      applyDerivedStatLinks();
      syncWellbeingTrackingAfterMutation();
    }

    autoRepayStudyLoan();
    runRelationshipGrowthHooks(ageBeforeMutation, gameState.age);
    settleEconomyYearsAfterAgeJump(ageBeforeMutation, gameState.age);
    syncPartnerFamilyRevealFromIntimacy();

    if (gameState.age > ageBeforeMutation) {
      trySuddenDeathAnnualRollForAgeSpan(ageBeforeMutation, gameState.age);
    }
  }

  function calculateEndingWeight(ending, state) {
    const currentState = state || gameState;

    if (!matchesConditions(ending.require, currentState)) {
      return 0;
    }

    let weight = Math.max(0, ending.baseWeight || 0);
    ending.weightModifiers.forEach((modifier) => {
      if (matchesConditions(modifier.when, currentState)) {
        weight += modifier.weight;
      }
    });

    weight = Math.max(0, weight);
    const risk = getHealthMentalRiskConfig();
    if (risk.enabled !== false && ending.instant) {
      const mults =
        risk.instantEndingWeightMultipliers && typeof risk.instantEndingWeightMultipliers === "object"
          ? risk.instantEndingWeightMultipliers
          : {};
      const m = mults[ending.id];
      if (typeof m === "number") {
        weight *= m;
      }
    }
    return Math.max(0, weight);
  }

  function pickWeightedEnding(instantOnly, state) {
    const candidates = allEndings
      .filter((ending) => Boolean(ending.instant) === Boolean(instantOnly))
      .map((ending) => ({
        ending,
        weight: calculateEndingWeight(ending, state)
      }))
      .filter((item) => item.weight > 0);

    if (!candidates.length) {
      return null;
    }

    const totalWeight = candidates.reduce((sum, item) => sum + item.weight, 0);
    let cursor = Math.random() * totalWeight;

    for (const item of candidates) {
      cursor -= item.weight;
      if (cursor <= 0) {
        return item.ending;
      }
    }

    return candidates[candidates.length - 1].ending;
  }

  function getAgeStageFocus(age) {
    if (age <= 5) {
      return {
        primary: ["childhood", "school"],
        secondary: ["misc"]
      };
    }

    if (age <= 11) {
      return {
        primary: ["school", "adolescence"],
        secondary: ["childhood", "misc"]
      };
    }

    if (age <= 15) {
      return {
        primary: ["adolescence", "highschool"],
        secondary: ["school", "transition", "misc"]
      };
    }

    if (age <= 19) {
      return {
        primary: ["highschool", "transition", "college"],
        secondary: ["adolescence", "young_adult", "misc"]
      };
    }

    if (age <= 26) {
      return {
        primary: ["college", "young_adult", "career"],
        secondary: ["transition", "family", "misc"]
      };
    }

    if (age <= 39) {
      return {
        primary: ["career", "family"],
        secondary: ["young_adult", "midlife", "misc"]
      };
    }

    if (age <= 55) {
      return {
        primary: ["family", "midlife", "career"],
        secondary: ["later_life", "misc"]
      };
    }

    return {
      primary: ["later_life", "midlife", "family"],
      secondary: ["career", "misc"]
    };
  }

  function usesActiveRelationshipAlias(rule) {
    if (!rule) {
      return false;
    }

    return (
      (Array.isArray(rule.activeRelationshipIds) && rule.activeRelationshipIds.length > 0) ||
      (Array.isArray(rule.activeRelationshipStatuses) && rule.activeRelationshipStatuses.length > 0) ||
      typeof rule.activeRelationshipMinAffection === "number" ||
      typeof rule.activeRelationshipMaxAffection === "number" ||
      typeof rule.activeRelationshipMinFamiliarity === "number" ||
      typeof rule.activeRelationshipMinTrust === "number" ||
      typeof rule.activeRelationshipMinPlayerInterest === "number" ||
      typeof rule.activeRelationshipMinTheirInterest === "number" ||
      typeof rule.activeRelationshipMaxTension === "number" ||
      typeof rule.activeRelationshipMinCommitment === "number" ||
      typeof rule.activeRelationshipMinContinuity === "number" ||
      typeof rule.activeRelationshipMinInteractionCount === "number" ||
      typeof rule.activeRelationshipMinPartnerAgeSpan === "number" ||
      (Array.isArray(rule.requiredActiveRelationshipFlags) && rule.requiredActiveRelationshipFlags.length > 0) ||
      (Array.isArray(rule.excludedActiveRelationshipFlags) && rule.excludedActiveRelationshipFlags.length > 0) ||
      (Array.isArray(rule.activeRelationshipRequiredSharedHistory) && rule.activeRelationshipRequiredSharedHistory.length > 0) ||
      (Array.isArray(rule.activeRelationshipExcludedSharedHistory) && rule.activeRelationshipExcludedSharedHistory.length > 0)
    );
  }

  function getRelationshipRuleScore(rule, relationshipId, state) {
    if (!rule || !relationshipId) {
      return 0;
    }

    const mapKeys = [
      "relationshipStatuses",
      "excludedRelationshipStatuses",
      "requiredRelationshipFlags",
      "excludedRelationshipFlags",
      "requiredSharedHistory",
      "excludedSharedHistory",
      "minAffection",
      "maxAffection",
      "minFamiliarity",
      "minTrust",
      "minAmbiguity",
      "minPlayerInterest",
      "minTheirInterest",
      "maxTension",
      "minCommitment",
      "minContinuity",
      "minInteractionCount"
    ];

    if (Array.isArray(rule.activeRelationshipIds) && rule.activeRelationshipIds.includes(relationshipId)) {
      return 2;
    }

    if (
      (Array.isArray(rule.knownRelationships) && rule.knownRelationships.includes(relationshipId)) ||
      (Array.isArray(rule.unknownRelationships) && rule.unknownRelationships.includes(relationshipId))
    ) {
      return 1;
    }

    if (
      mapKeys.some((key) => rule[key] && Object.prototype.hasOwnProperty.call(rule[key], relationshipId))
    ) {
      return 2;
    }

    if (
      state &&
      state.activeRelationshipId === relationshipId &&
      usesActiveRelationshipAlias(rule)
    ) {
      return 2;
    }

    return 0;
  }

  function mutationTargetsRelationship(block, relationshipId, activeRelationshipId) {
    if (!block || !relationshipId) {
      return 0;
    }

    let score = 0;

    if (typeof block.setActiveRelationship === "string" && block.setActiveRelationship === relationshipId) {
      score = Math.max(score, 2);
    }

    (block.relationshipEffects || []).forEach((effect) => {
      if (!effect) {
        return;
      }

      if (effect.targetId === relationshipId) {
        score = Math.max(score, 2);
      }

      if (effect.targetId === "$active" && activeRelationshipId === relationshipId) {
        score = Math.max(score, 2);
      }
    });

    return score;
  }

  function getEventRelationshipFocusScore(event, relationshipId, state) {
    if (!event || !relationshipId) {
      return 0;
    }

    const relationship = getRelationshipSnapshot(state, relationshipId);
    const arcDefinition = relationshipArcMap.get(relationshipId) || null;

    if (
      arcDefinition &&
      Array.isArray(arcDefinition.exclusiveEvents) &&
      arcDefinition.exclusiveEvents.includes(event.id)
    ) {
      return 3;
    }

    let score = getRelationshipRuleScore(event.conditions, relationshipId, state);
    score = Math.max(score, mutationTargetsRelationship(event.effectsOnEnter, relationshipId, state.activeRelationshipId));

    (event.choices || []).forEach((choice) => {
      score = Math.max(score, getRelationshipRuleScore(choice.conditions, relationshipId, state));
      score = Math.max(score, mutationTargetsRelationship(choice, relationshipId, state.activeRelationshipId));
    });

    if (relationship && relationship.met && (relationship.affection || 0) >= 40 && event.stage === "family") {
      score = Math.max(score, 1);
    }

    return score;
  }

  function calculateEventSelectionWeight(event, state) {
    const currentState = state || gameState;
    let weight = Math.max(0, event.weight || 0);
    const routeIds = [
      currentState.educationRoute && currentState.educationRoute.id ? currentState.educationRoute.id : "",
      currentState.careerRoute && currentState.careerRoute.id ? currentState.careerRoute.id : ""
    ].filter(Boolean);
    const stageFocus = getAgeStageFocus(currentState.age);
    const visitCount =
      currentState.eventVisitCounts && currentState.eventVisitCounts[event.id]
        ? currentState.eventVisitCounts[event.id]
        : 0;
    const currentPartner = getCurrentPartner(currentState);
    const strongestRelationship = getStrongestRelationship(currentState);

    if (weight <= 0) {
      return 0;
    }

    if (stageFocus.primary.includes(event.stage)) {
      weight += 6;
    } else if (stageFocus.secondary.includes(event.stage)) {
      weight += 2;
    }

    if (!event.repeatable && visitCount === 0) {
      weight += 5;
    }

    if (event.repeatable) {
      weight = Math.max(1, weight - 2);
    }

    if (routeIds.some((id) => (event.conditions.educationRouteIds || []).includes(id))) {
      weight += 8;
    }

    if (routeIds.some((id) => (event.conditions.careerRouteIds || []).includes(id))) {
      weight += 8;
    }

    if (currentState.familyBackground && (event.conditions.familyBackgroundIds || []).includes(currentState.familyBackground.id)) {
      weight += 4;
    }

    if (
      Array.isArray(event.familyStoryHookTags) &&
      event.familyStoryHookTags.length &&
      currentState.familyBackground &&
      Array.isArray(currentState.familyBackground.storyHookTags) &&
      currentState.familyBackground.storyHookTags.length
    ) {
      const bgHooks = currentState.familyBackground.storyHookTags;
      const overlap = event.familyStoryHookTags.filter((tag) => bgHooks.includes(tag));
      if (overlap.length) {
        weight += Math.min(14, overlap.length * 4);
      }
    }

    if (Array.isArray(event.tags) && event.tags.length) {
      const matchedTags = event.tags.filter((tag) => currentState.tags.includes(tag));
      weight += Math.min(6, matchedTags.length * 2);
    }

    if (currentState.activeRelationshipId) {
      const activeScore = getEventRelationshipFocusScore(event, currentState.activeRelationshipId, currentState);
      if (activeScore === 3) {
        weight += 18;
      } else if (activeScore === 2) {
        weight += 12;
      } else if (activeScore === 1) {
        weight += 5;
      }
    }

    if (currentPartner && currentPartner.id !== currentState.activeRelationshipId) {
      const partnerScore = getEventRelationshipFocusScore(event, currentPartner.id, currentState);
      if (partnerScore >= 2) {
        weight += 6;
      } else if (partnerScore === 1) {
        weight += 3;
      }
    }

    if (
      strongestRelationship &&
      strongestRelationship.id !== currentState.activeRelationshipId &&
      (!currentPartner || strongestRelationship.id !== currentPartner.id)
    ) {
      const strongestScore = getEventRelationshipFocusScore(event, strongestRelationship.id, currentState);
      if (strongestScore >= 2) {
        weight += 4;
      }
    }

    if (Array.isArray(event.tags) && event.tags.includes("accident")) {
      ensureAccidentLedger(currentState);
      const ap = getAccidentPhaseId(currentState);
      const quota = getAccidentQuotaForPhase(ap);
      const have = getAccidentCountForState(currentState, ap);
      const boost =
        typeof lifeAccidentStageConfig.weightBoostUntilMet === "number" ? lifeAccidentStageConfig.weightBoostUntilMet : 0;
      if (quota > 0 && have < quota && boost > 0) {
        weight += boost;
      }
    }

    return Math.max(0, weight);
  }

  /** 与 data/timeline-rules.js LIFE_ACCIDENT_STAGE_CONFIG 并列：每 N 次非意外后优先抽意外 */
  var ACCIDENT_AFTER_NORMAL_EVENTS = 5;

  function eventIsAccidentTagged(event) {
    return Boolean(event && Array.isArray(event.tags) && event.tags.includes("accident"));
  }

  function pickWeightedEventWithAccidentCadence(eligible) {
    if (!eligible || !eligible.length) {
      return null;
    }
    ensureStoryDedupe(gameState);
    const narrativeOk = eligible.filter((e) => !isNarrativeDedupeBlocked(e, gameState));
    const pool = narrativeOk.length ? narrativeOk : eligible;
    const accidents = pool.filter(eventIsAccidentTagged);
    const normal = pool.filter((e) => !eventIsAccidentTagged(e));
    const streak =
      gameState && typeof gameState.eventsSinceLastAccident === "number" ? gameState.eventsSinceLastAccident : 0;

    if (streak >= ACCIDENT_AFTER_NORMAL_EVENTS && accidents.length) {
      return pickWeightedEventWithNarrativeBias(accidents);
    }

    if (normal.length) {
      return pickWeightedEventWithNarrativeBias(normal);
    }

    return pickWeightedEventWithNarrativeBias(accidents.length ? accidents : eligible);
  }

  function pickWeightedEventWithNarrativeBias(events, state) {
    const candidates = (events || [])
      .map((event) => ({
        event,
        weight: calculateEventSelectionWeight(event, state)
      }))
      .filter((item) => item.weight > 0);

    if (!candidates.length) {
      return null;
    }

    const topWeight = candidates.reduce((highest, item) => Math.max(highest, item.weight), 0);
    const focusPool = candidates.filter((item) => item.weight >= topWeight - 4);
    const selectionPool = focusPool.length >= 2 ? focusPool : candidates;
    const totalWeight = selectionPool.reduce((sum, item) => sum + item.weight, 0);
    let cursor = Math.random() * totalWeight;

    for (const item of selectionPool) {
      cursor -= item.weight;
      if (cursor <= 0) {
        return item.event;
      }
    }

    return selectionPool[selectionPool.length - 1].event;
  }

  function buildRequirementHighlights(rule, state) {
    const highlights = [];
    const seen = new Set();

    function push(text) {
      if (!text || seen.has(text)) {
        return;
      }
      seen.add(text);
      highlights.push(text);
    }

    Object.entries(rule.minStats || {}).forEach(([key, value]) => {
      const current = state.stats[key] || 0;
      push(stateApi.STAT_LABELS[key] + "达到 " + current + "（要求至少 " + value + "）");
    });

    Object.entries(rule.maxStats || {}).forEach(([key, value]) => {
      const current = state.stats[key] || 0;
      push(stateApi.STAT_LABELS[key] + "压在 " + current + "（要求不高于 " + value + "）");
    });

    if (rule.requiredTags.length) {
      push("人生倾向命中：" + rule.requiredTags.join(" / "));
    }

    if (rule.someFlags.length) {
      const matchedFlags = rule.someFlags.filter((flag) => state.flags.includes(flag));
      if (matchedFlags.length) {
        push("关键经历命中：" + matchedFlags.join(" / "));
      }
    }

    if (rule.requiredFlags.length) {
      push("长期状态命中：" + rule.requiredFlags.join(" / "));
    }

    if (rule.educationRouteIds.length && state.educationRoute) {
      push("升学路线命中：" + state.educationRoute.name);
    }

    if (rule.careerRouteIds.length && state.careerRoute) {
      push("职业路线命中：" + state.careerRoute.name);
    }

    if (rule.anyRelationshipStatuses.length) {
      const matchedRelationship = Object.values(state.relationships || {}).find((relationship) =>
        rule.anyRelationshipStatuses.includes(relationship.status)
      );
      if (matchedRelationship) {
        push(
          "关系状态命中：" +
            matchedRelationship.name +
            "处于“" +
            (stateApi.RELATIONSHIP_STATUS_LABELS[matchedRelationship.status] || matchedRelationship.status) +
            "”"
        );
      }
    }

    if (typeof rule.anyRelationshipMinAffection === "number") {
      const matchedRelationship = Object.values(state.relationships || {}).find(
        (relationship) => relationship.affection >= rule.anyRelationshipMinAffection
      );
      if (matchedRelationship) {
        push(
          matchedRelationship.name +
            "的好感达到 " +
            matchedRelationship.affection +
            "（要求至少 " +
            rule.anyRelationshipMinAffection +
            "）"
        );
      }
    }

    if (rule.noCurrentPartner) {
      push("当前没有稳定伴侣关系");
    }

    if (rule.debtToMoneyPrison && matchesDebtToMoneyPrisonRule(rule.debtToMoneyPrison, state)) {
      push(
        "负债入狱线：负债高于 " +
          rule.debtToMoneyPrison.debtAbove +
          " 且达到现金的 " +
          rule.debtToMoneyPrison.moneyMultiple +
          " 倍（当前 负债 " +
          (state.stats.debt || 0) +
          " / 现金 " +
          (state.stats.money || 0) +
          "）"
      );
    }

    return highlights;
  }

  function analyzeEndingSelection(ending, state) {
    const currentState = state || gameState;
    const matchedModifiers = ending.weightModifiers
      .filter((modifier) => matchesConditions(modifier.when, currentState))
      .map((modifier) => ({
        weight: modifier.weight,
        reasons: buildRequirementHighlights(modifier.when, currentState)
      }));
    const baseReasons = buildRequirementHighlights(ending.require, currentState);

    return {
      baseWeight: Math.max(0, ending.baseWeight || 0),
      totalWeight: calculateEndingWeight(ending, currentState),
      baseReasons: baseReasons.slice(0, 5),
      matchedModifiers: matchedModifiers
        .map((item) => {
          const label = item.reasons[0] || "命中了额外的人生倾向";
          return label + "（额外 +" + item.weight + "）";
        })
        .slice(0, 4)
    };
  }

  function describeChildhood() {
    if (gameState.familyBackground && gameState.familyBackground.name) {
      const backgroundIntro = "你人生最初的起点，是“" + gameState.familyBackground.name + "”这样的家庭。";

      if (hasFlags(["warm_home", "emotion_safe_home"])) {
        return backgroundIntro + " 你小时候接到过比较稳的情感回应，这让你后来在很多关系里仍然保留了一点相信人的能力。";
      }

      if (hasFlags(["parents_conflict"]) || hasFlags(["tense_home"])) {
        return backgroundIntro + " 你很早就见过家庭里的紧绷，所以成年后的很多选择都带着一种想把局面稳住的冲动。";
      }

      if (hasFlags(["migrant_home"])) {
        return backgroundIntro + " 你从小对“缺席”就不陌生，这让你比不少人更会独自扛事，也更难轻易示弱。";
      }

      if (hasFlags(["archetype_second_gen"])) {
        return backgroundIntro + " 资源从来不缺，但“你自己想要什么”却常常要让位于安排、比较和继承期待。";
      }

      if (hasFlags(["archetype_power_network"])) {
        return backgroundIntro + " 你更早学会分寸、场面与后果：家里给你的力很强，给你的任性却很少。";
      }

      if (hasFlags(["archetype_old_money"])) {
        return backgroundIntro + " 体面与门槛像空气一样自然，你拥有平台，也背负名分与门当户对的沉默规则。";
      }

      if (hasFlags(["archetype_overseas_resource"])) {
        return backgroundIntro + " 地图与护照很早就叠进日常，你在更宽的选项里长大，也在“属于哪里”的问题上更早迷路。";
      }

      if (hasFlags(["archetype_intellectual_elite"])) {
        return backgroundIntro + " 你被期待优秀得很具体：排名、校友与贡献感，常常比疲惫更先被写进日程。";
      }

      if (hasFlags(["archetype_nouveau_riche"])) {
        return backgroundIntro + " 生活换档很快，规则却慢半拍：阔气是真的，怕被看不起的恐惧也同样真实。";
      }

      if (hasFlags(["archetype_family_enterprise"])) {
        return backgroundIntro + " 钱与人情在餐桌上一起被算账，你更早懂机会，也更早懂利益怎样改写亲密。";
      }

      if (hasFlags(["archetype_merchant_volatile"])) {
        return backgroundIntro + " 宽裕与吃紧交替上场，你对风险和侥幸的嗅觉，比许多同龄人更早被训练出来。";
      }

      if (hasFlags(["privileged_home_finance"])) {
        return backgroundIntro + " 起点更阔，并不意味着更自由：资源常常和期待、面子与隐形契约绑在一起。";
      }
    }

    if (hasFlags(["warm_home", "emotion_safe_home"])) {
      return "你小时候接到过比较稳的情感回应，这让你后来在很多关系里仍然保留了一点相信人的能力。";
    }

    if (hasFlags(["parents_conflict"]) || hasFlags(["tense_home"])) {
      return "你很早就见过家庭里的紧绷，所以成年后的很多选择都带着一种想把局面稳住的冲动。";
    }

    if (hasFlags(["migrant_home"])) {
      return "你从小对“缺席”就不陌生，这让你比不少人更会独自扛事，也更难轻易示弱。";
    }

    return "你前半生很多反应方式，都能在小时候那些没人特地总结过的小事里找到源头。";
  }

  function describeGrowth() {
    if (gameState.tags.includes("craft")) {
      return "那些你愿意长期投入的兴趣并没有白长，它们后来真的变成了你理解自己和安顿自己的方式。";
    }

    if (gameState.tags.includes("ambition")) {
      return "你很早就被期待、比较或野心推着往前走，这条线后来也深刻影响了你的职业和亲密关系。";
    }

    if (gameState.tags.includes("stability")) {
      return "你最终形成的判断更偏向可持续而不是轰烈，这种慢一点的节奏，反而替你挡掉了不少翻车时刻。";
    }

    return "成长没有按照单一方向展开，但很多当时看不懂的选择，后来都慢慢显出了后劲。";
  }

  function describeRelationship() {
    const strongestRelationship = getStrongestRelationship(gameState);
    const activeRelationship = getActiveRelationship() || strongestRelationship;

    if (!activeRelationship || activeRelationship.affection <= 0) {
      return "感情不是你人生里最容易处理的部分，可你和人的距离感，本身也塑造了你后来的生活轮廓。";
    }

    const name = activeRelationship.name;
    const status = activeRelationship.status;

    if (["married", "steady", "reconnected"].includes(status)) {
      return "你和" + name + "之间留下的，不只是某一段热烈，而是一种被现实反复考验后仍然愿意继续靠近的关系。";
    }

    if (["dating", "passionate", "cooling", "conflict"].includes(status)) {
      return "你和" + name + "曾认真经营过一段会持续变化的关系，热烈、冷淡、拉扯和舍不得都真实发生过。";
    }

    if (["broken", "estranged"].includes(status)) {
      return "你和" + name + "的关系没有完整留住，但那段靠近、误会和失去，确实改变了你后来理解亲密的方式。";
    }

    if (status === "missed") {
      return name + "成了你人生里那种很难完全忘掉的遗憾线。你们并不是没喜欢过彼此，只是时间没有站在同一边。";
    }

    return name + "曾经在你人生里占过很重的位置，你不是没有认真喜欢过，只是走到最后的方式，并不完全由心动决定。";
  }

  function describeRoutes() {
    const educationRouteName = gameState.educationRoute && gameState.educationRoute.name;
    const careerRouteName = gameState.careerRoute && gameState.careerRoute.name;

    if (educationRouteName && careerRouteName) {
      return "你在升学阶段走上了“" + educationRouteName + "”，后来又把自己放进了“" + careerRouteName + "”这条工作路线。很多后劲，正是这两次主动分流慢慢累出来的。";
    }

    if (educationRouteName) {
      return "升学转折时，你走上的“" + educationRouteName + "”这条路，后来一直在影响你怎么看待机会、压力和生活半径。";
    }

    if (careerRouteName) {
      return "真正进入社会后，你把自己放进了“" + careerRouteName + "”这条路线里。那种工作结构，也一点点改写了你的身体、关系和判断。";
    }

    return "";
  }

  function describeLaterLife() {
    if (gameState.stats.health <= 38 || hasFlags(["chronic_stress", "health_warning", "appearance_anxiety"])) {
      return "身体一直在替你记账，所以你后半生很多决定，都绕不开健康这道最实际的边界。";
    }

    if (gameState.tags.includes("risk")) {
      return "你做过几次高波动的押注，得到和失去都比别人更猛，这也让你的人生一直带着明显的起伏感。";
    }

    if (gameState.tags.includes("family")) {
      return "走到后面，真正让你反复回头看的，不再只是成绩和位置，而是谁和你一起把日子过成了什么样。";
    }

    return "等人生慢下来之后，真正留下来的并不是某一次单点胜负，而是你一路积出来的生活结构。";
  }

  function buildEndingText(ending) {
    return [ending.text, describeChildhood(), describeGrowth(), describeRoutes(), describeRelationship(), describeLaterLife()]
      .filter(Boolean)
      .join("\n\n");
  }

  function finalizeGame() {
    let ending = pickWeightedEnding(false);

    if (!ending) {
      ending = pickWeightedEnding(false, {
        ...gameState,
        choiceCount: Math.max(gameState.choiceCount || 0, 132),
      });
    }

    if (!ending) {
      ending = allEndings.find((item) => item.id === "ordinary_ending") || null;
    }

    gameState.ending = ending
      ? {
          ...ending,
          text: buildEndingText(ending),
          analysis: analyzeEndingSelection(ending, gameState)
        }
      : null;
    setCurrentEvent(null);
    gameState.gameOver = true;

    if (gameState.ending) {
      addHistory("你的人生抵达了一个结局：" + gameState.ending.title.replace("结局：", ""));
    }
  }

  function checkInstantEnding() {
    const instantEnding = pickWeightedEnding(true);

    if (!instantEnding) {
      return false;
    }

    gameState.ending = {
      ...instantEnding,
      text: buildEndingText(instantEnding),
      analysis: analyzeEndingSelection(instantEnding, gameState)
    };
    setCurrentEvent(null);
    gameState.gameOver = true;
    addHistory("你的人生在中途走向了结局：" + instantEnding.title.replace("结局：", ""));

    return true;
  }

  function applyEventOnEnter(event) {
    if (!event || !gameState.currentEventPendingEnter) {
      return;
    }

    gameState.currentEventPendingEnter = false;
    rememberEnteredEvent(event.id);
    applyMutationBlock(event.effectsOnEnter, {
      skipAge: event.deferEnterAge,
      skipStatLinks: true,
      mutationEvent: event
    });
    bumpAccidentCountIfNeeded(event);

    if (checkInstantEnding()) {
      return;
    }
  }

  function getCurrentEvent() {
    if (!gameState.gameStarted) {
      return null;
    }

    if (gameState.setupStep === "family_background") {
      return buildFamilyBackgroundEvent(getPendingFamilyBackground());
    }

    if (!gameState.currentEventId) {
      return null;
    }

    let event = eventMap.get(gameState.currentEventId) || null;
    if (!event) {
      return null;
    }

    applyEventOnEnter(event);

    return gameState.gameOver ? null : event;
  }

  function choicePassesSpendGate(choice, state) {
    if (choice.customAction === "shop_purchase") {
      const payload = choice.customPayload && typeof choice.customPayload === "object" ? choice.customPayload : {};
      const item = shopItemMap.get(payload.itemId);
      return Boolean(item) && (state.stats.money || 0) >= (typeof item.price === "number" ? item.price : 0);
    }
    return true;
  }

  function getVisibleOptions(event) {
    if (!event || !Array.isArray(event.choices)) {
      return [];
    }

    if (event.id === "gaokao_result") {
      return buildDomesticSchoolOptions(event);
    }

    if (event.id === "overseas_departure") {
      const overseasOptions = buildOverseasSchoolOptions(event);
      if (overseasOptions.length) {
        return overseasOptions;
      }
      return event.choices
        .map((choice, index) => ({ ...choice, index }))
        .filter((choice) => choicePassesSpendGate(choice, gameState))
        .filter((choice) => {
          if (choice.customAction === "start_overseas_route") {
            return false;
          }
          return matchesConditions(choice.conditions, gameState);
        });
    }

    return event.choices
      .map((choice, index) => ({ ...choice, index }))
      .filter((choice) => choicePassesSpendGate(choice, gameState))
      .filter((choice) => {
        if (event.id === "life_shop_street" && choice.customAction === "shop_purchase") {
          const payload = choice.customPayload && typeof choice.customPayload === "object" ? choice.customPayload : {};
          const sid = typeof payload.itemId === "string" ? payload.itemId : "";
          const row = shopItemMap.get(sid);
          return Boolean(row && isShopItemUnlockedForState(row, gameState));
        }
        return true;
      })
      .filter((choice) => matchesConditions(choice.conditions, gameState))
      .filter((choice) => {
        if (event.id !== "housing_pick_milestone") {
          return true;
        }
        const payload = choice.customPayload && typeof choice.customPayload === "object" ? choice.customPayload : {};
        const hid = typeof payload.housingId === "string" ? payload.housingId.trim() : "";
        if (hid !== "housing_parents_home") {
          return true;
        }
        return isParentsHomeAllowedForCurrentWorkLife();
      });
  }

  function getEligibleFallbackEvents() {
    return allEvents.filter((event) => isEventEligible(event));
  }

  function getDeferredFallbackEvents() {
    return allEvents.filter((event) => {
      const rule = normalizeConditionObject(event.conditions, event);
      const candidateState = stateApi.cloneState(gameState);

      if (typeof rule.minAge !== "number" || rule.minAge <= gameState.age) {
        return false;
      }

      candidateState.age = rule.minAge;
      return isEventEligible(event, candidateState);
    });
  }

  function fastForwardToNextEligibleAge() {
    const deferredEvents = getDeferredFallbackEvents();

    if (!deferredEvents.length) {
      return null;
    }

    const nextAge = deferredEvents.reduce((lowest, event) => {
      const rule = normalizeConditionObject(event.conditions, event);
      const eventAge = typeof rule.minAge === "number" ? rule.minAge : lowest;
      return Math.min(lowest, eventAge);
    }, Number.POSITIVE_INFINITY);

    if (!Number.isFinite(nextAge)) {
      return null;
    }

    const sameAgeEvents = deferredEvents.filter((event) => {
      const rule = normalizeConditionObject(event.conditions, event);
      return rule.minAge === nextAge;
    });
    const skippedYears = nextAge - gameState.age;
    const ageBeforeFastForward = gameState.age;

    gameState.age = nextAge;

    if (skippedYears > 0) {
      addHistory("日子继续往前推，你在不知不觉间长到了 " + nextAge + " 岁。");
    }

    if (trySuddenDeathAnnualRollForAgeSpan(ageBeforeFastForward, gameState.age)) {
      return null;
    }

    return pickWeightedEventWithAccidentCadence(sameAgeEvents);
  }

  function fastForwardToSpecificAge(targetAge, message) {
    if (typeof targetAge !== "number" || !Number.isFinite(targetAge)) {
      return;
    }

    const safeAge = Math.max(gameState.age, targetAge);
    const skippedYears = safeAge - gameState.age;

    if (skippedYears <= 0) {
      return;
    }

    const ageBeforeFastForward = gameState.age;
    gameState.age = safeAge;
    addHistory(message || ("日子继续往前推，你在不知不觉间长到了 " + safeAge + " 岁。"));
    trySuddenDeathAnnualRollForAgeSpan(ageBeforeFastForward, gameState.age);
  }

  function pickWeightedEvent(events) {
    if (!events.length) {
      return null;
    }

    const totalWeight = events.reduce((sum, event) => sum + Math.max(0, event.weight || 0), 0);

    if (totalWeight <= 0) {
      return events[0];
    }

    let cursor = Math.random() * totalWeight;

    for (const event of events) {
      cursor -= Math.max(0, event.weight || 0);
      if (cursor <= 0) {
        return event;
      }
    }

    return events[events.length - 1];
  }

  function shouldNaturallyConcludeLife() {
    const eligibleEvents = getEligibleFallbackEvents();
    const nonRepeatableEvents = eligibleEvents.filter((event) => !event.repeatable);

    if (gameState.age >= 80 && nonRepeatableEvents.length === 0 && eligibleEvents.length <= 2) {
      return true;
    }

    if (gameState.age >= 88 && eligibleEvents.length <= 5) {
      return true;
    }

    return false;
  }

  function getRequiredMilestoneEvent() {
    const pf = gameState.pendingForcedEvent;
    if (pf && typeof pf.eventId === "string" && pf.eventId.trim()) {
      const forced = eventMap.get(pf.eventId.trim()) || null;
      if (forced) {
        const pid = typeof pf.partnerId === "string" ? pf.partnerId.trim() : "";
        if (pid && getRelationshipRecord(gameState, pid)) {
          gameState.activeRelationshipId = pid;
        }
        gameState.pendingForcedEvent = null;
        return forced;
      }
      gameState.pendingForcedEvent = null;
    }

    if (gameState.flags.includes("pending_work_location_pick")) {
      const locEv = eventMap.get("work_location_pick_milestone") || null;
      if (locEv && isEventEligible(locEv)) {
        return locEv;
      }
    }
    if (gameState.flags.includes("pending_housing_pick")) {
      const hsEv = eventMap.get("housing_pick_milestone") || null;
      if (hsEv && isEventEligible(hsEv)) {
        return hsEv;
      }
    }

    const educationRouteMissing = !gameState.educationRoute;
    const careerRouteMissing = !gameState.careerRoute;
    const flags = gameState.flags || [];

    if (educationRouteMissing && gameState.age >= 18) {
      if (flags.includes("life_path_non_gaokao")) {
        const nonG = eventMap.get("non_gaokao_departure") || null;
        if (nonG && isEventEligible(nonG)) {
          return nonG;
        }
      }
      if (flags.includes("life_path_overseas")) {
        const os = eventMap.get("overseas_departure") || null;
        if (os && isEventEligible(os)) {
          return os;
        }
      }
      if (flags.includes("gaokao_taken")) {
        const gr = eventMap.get("gaokao_result") || null;
        if (gr && isEventEligible(gr)) {
          return gr;
        }
      }
      if (flags.includes("life_path_gaokao")) {
        const gd = eventMap.get("gaokao_day") || null;
        if (gd && isEventEligible(gd)) {
          return gd;
        }
      }
      const educationEvent = eventMap.get("score_and_volunteer") || null;
      if (educationEvent && isEventEligible(educationEvent)) {
        return educationEvent;
      }
    }

    if (careerRouteMissing && gameState.age >= 22) {
      const careerEvent = eventMap.get("graduation_offer") || null;
      if (careerEvent && isEventEligible(careerEvent)) {
        return careerEvent;
      }
    }

    return null;
  }

  function advanceTo(nextEventId) {
    if (typeof nextEventId === "string") {
      const requestedEvent = eventMap.get(nextEventId) || null;
      if (requestedEvent) {
        const requestedRule = normalizeConditionObject(requestedEvent.conditions, requestedEvent);
        const targetAge =
          typeof requestedRule.minAge === "number"
            ? Math.max(gameState.age, requestedRule.minAge)
            : gameState.age;

        if (typeof requestedRule.maxAge !== "number" || targetAge <= requestedRule.maxAge) {
          const candidateState = stateApi.cloneState(gameState);
          candidateState.age = targetAge;

          if (matchesConditions(requestedRule, candidateState, requestedEvent)) {
            if (!eventPassesTimelineRules(requestedEvent, candidateState)) {
              addHistory("原本衔接好的下一段，被现实节奏轻轻拐了个弯。");
            } else {
              fastForwardToSpecificAge(targetAge, "日子被推着往前走，你很快到了 " + targetAge + " 岁。");
              if (gameState.gameOver) {
                return;
              }
              setCurrentEvent(nextEventId);
              return;
            }
          }
        }
      }
    }

    if (nextEventId === null) {
      setCurrentEvent(null);
      return;
    }

    if (shouldNaturallyConcludeLife()) {
      setCurrentEvent(null);
      return;
    }

    const requiredMilestoneEvent = getRequiredMilestoneEvent();
    if (requiredMilestoneEvent) {
      setCurrentEvent(requiredMilestoneEvent.id);
      return;
    }

    let fallbackEvent = pickWeightedEventWithAccidentCadence(getEligibleFallbackEvents());

    if (!fallbackEvent) {
      fallbackEvent = fastForwardToNextEligibleAge();
    }

    if (gameState.gameOver) {
      return;
    }

    if (!fallbackEvent && !shouldNaturallyConcludeLife() && gameState.age < 93) {
      const paddingOrder =
        gameState.age >= 60
          ? [eventMap.get("life_flow_padding_later"), eventMap.get("life_flow_padding_adult")]
          : [eventMap.get("life_flow_padding_adult"), eventMap.get("life_flow_padding_later")];
      fallbackEvent = paddingOrder.filter(Boolean).find((candidate) => isEventEligible(candidate)) || null;
    }

    if (!fallbackEvent && shouldNaturallyConcludeLife()) {
      setCurrentEvent(null);
      return;
    }

    setCurrentEvent(fallbackEvent ? fallbackEvent.id : null);
  }

  const PRISON_DEBT_GATE_EVENT_ID = "prison_debt_legal_endpoint";

  function shouldDeferDebtPrisonForNarrative() {
    if (!gameState.gameStarted || gameState.gameOver || gameState.setupStep) {
      return false;
    }

    if (gameState.flags.includes("incarcerated")) {
      return false;
    }

    if (gameState.visitedEvents.includes(PRISON_DEBT_GATE_EVENT_ID)) {
      return false;
    }

    const debtProbe = normalizeConditionObject({
      debtToMoneyPrison: { debtAbove: 50, moneyMultiple: 5 }
    });

    if (!debtProbe.debtToMoneyPrison || !matchesDebtToMoneyPrisonRule(debtProbe.debtToMoneyPrison, gameState)) {
      return false;
    }

    return Boolean(eventMap.get(PRISON_DEBT_GATE_EVENT_ID));
  }

  function chooseOption(optionIndex) {
    if (!gameState.gameStarted || gameState.gameOver) {
      return getState();
    }

    if (gameState.setupStep === "family_background") {
      if (optionIndex !== 0) {
        return getState();
      }

      gameState.setupStep = null;
      gameState.pendingFamilyBackgroundId = null;
      advanceTo();
      return getState();
    }

    const event = getCurrentEvent();
    if (!event) {
      finalizeGame();
      return getState();
    }

    const option = getVisibleOptions(event).find((candidate) => candidate.index === optionIndex) || null;
    if (!option || !matchesConditions(option.conditions, gameState)) {
      return getState();
    }

    if (option.customAction === "shop_purchase") {
      const payload = option.customPayload && typeof option.customPayload === "object" ? option.customPayload : {};
      const item = shopItemMap.get(payload.itemId);
      if (!item || (gameState.stats.money || 0) < (typeof item.price === "number" ? item.price : 0)) {
        return getState();
      }
    }

    if (option.customAction === "give_relationship_gift") {
      const payload = option.customPayload && typeof option.customPayload === "object" ? option.customPayload : {};
      const itemId = typeof payload.itemId === "string" ? payload.itemId : "";
      if (!itemId || getInventoryItemCount(gameState, itemId) < 1) {
        return getState();
      }
    }

    rememberEvent(event.id);
    if (eventIsAccidentTagged(event)) {
      gameState.eventsSinceLastAccident = 0;
    } else {
      gameState.eventsSinceLastAccident = (typeof gameState.eventsSinceLastAccident === "number" ? gameState.eventsSinceLastAccident : 0) + 1;
    }
    gameState.choiceCount += 1;
    const deferredEnterAge =
      event.deferEnterAge &&
      event.effectsOnEnter &&
      event.effectsOnEnter.effects &&
      typeof event.effectsOnEnter.effects.age === "number" &&
      event.effectsOnEnter.effects.age > 0
        ? event.effectsOnEnter.effects.age
        : 0;
    const optionToApply =
      deferredEnterAge > 0
        ? {
            ...option,
            effects: {
              ...(option.effects || {}),
              age: (typeof option.effects.age === "number" ? option.effects.age : 0) + deferredEnterAge
            }
          }
        : option;
    applyMutationBlock(optionToApply, { mutationEvent: event, mutationChoice: option });

    if (gameState.gameOver) {
      return getState();
    }

    if (shouldDeferDebtPrisonForNarrative()) {
      setCurrentEvent(PRISON_DEBT_GATE_EVENT_ID);
      return getState();
    }

    if (checkInstantEnding()) {
      return getState();
    }

    advanceTo(option.next);

    if (gameState.gameOver) {
      return getState();
    }

    if (!gameState.currentEventId) {
      finalizeGame();
    }

    return getState();
  }

  function hasFlags(flags) {
    return flags.every((flag) => gameState.flags.includes(flag));
  }

  function setActiveRelationship(relationshipId) {
    const relationship = getRelationshipRecord(gameState, relationshipId);
    if (!relationship) {
      return getState();
    }

    relationship.met = true;
    relationship.continuity = clampRelationshipMetric((relationship.continuity || 0) + 2);
    relationship.lastInteractionAge = gameState.age;
    gameState.activeRelationshipId = relationship.id;
    return getState();
  }

  function clearActiveRelationship() {
    gameState.activeRelationshipId = null;
    return getState();
  }

  /** 与 life_gift_moment 的 activeRelationshipStatuses 一致（16 岁及以上） */
  const MANUAL_GIFT_ALLOWED_STATUSES = [
    "ambiguous",
    "close",
    "dating",
    "passionate",
    "steady",
    "mutual_crush",
    "long_distance_dating"
  ];

  /** 低龄可互赠小礼物：同学 / 初识好感（与 UI 提示一致） */
  const MANUAL_GIFT_YOUTH_STATUSES = ["acquaintance", "familiar", "crush", "mutual_crush", "close"];

  function giftAllowedStatusesForAge(age) {
    const a = typeof age === "number" ? age : 0;
    if (a < 16) {
      return MANUAL_GIFT_YOUTH_STATUSES;
    }
    const merged = new Set(MANUAL_GIFT_YOUTH_STATUSES.concat(MANUAL_GIFT_ALLOWED_STATUSES));
    return Array.from(merged);
  }

  function canPurchaseShopItem(itemId) {
    const id = typeof itemId === "string" ? itemId.trim() : "";
    if (
      !id ||
      !gameState.gameStarted ||
      gameState.gameOver ||
      gameState.setupStep ||
      gameState.age < MANUAL_SHOP_MIN_AGE ||
      gameState.age > MANUAL_SHOP_MAX_AGE
    ) {
      return false;
    }
    const item = shopItemMap.get(id);
    if (!item) {
      return false;
    }
    if (!isShopItemUnlockedForState(item, gameState)) {
      return false;
    }
    const price = typeof item.price === "number" ? item.price : 0;
    return (gameState.stats.money || 0) >= price;
  }

  function purchaseShopItem(itemId) {
    const id = typeof itemId === "string" ? itemId.trim() : "";
    if (!canPurchaseShopItem(id)) {
      return getState();
    }
    applyMutationBlock({
      customAction: "shop_purchase",
      customPayload: { itemId: id }
    });
    return getState();
  }

  function canGiveGiftFromInventory(itemId) {
    const id = typeof itemId === "string" ? itemId.trim() : "";
    if (
      !id ||
      !gameState.gameStarted ||
      gameState.gameOver ||
      gameState.setupStep ||
      gameState.age < MANUAL_SHOP_MIN_AGE ||
      getInventoryItemCount(gameState, id) < 1
    ) {
      return false;
    }
    const activeId = gameState.activeRelationshipId || "";
    if (!activeId) {
      return false;
    }
    const relationship = getRelationshipRecord(gameState, activeId);
    const allowed = giftAllowedStatusesForAge(gameState.age);
    if (!relationship || !allowed.includes(relationship.status)) {
      return false;
    }
    return Boolean(lifeGiftEffects[id]);
  }

  function giveGiftFromInventory(itemId) {
    const id = typeof itemId === "string" ? itemId.trim() : "";
    if (!canGiveGiftFromInventory(id)) {
      return getState();
    }
    applyMutationBlock({
      customAction: "give_relationship_gift",
      customPayload: { itemId: id, targetId: "$active" }
    });
    return getState();
  }

  function canProposeToRelationship(state, relationshipId) {
    const st = state || gameState;
    const rid = typeof relationshipId === "string" ? relationshipId.trim() : "";
    if (
      !rid ||
      !st.gameStarted ||
      st.gameOver ||
      st.setupStep ||
      (st.flags || []).indexOf("player_married") !== -1
    ) {
      return false;
    }
    const rel = getRelationshipSnapshot(st, rid);
    if (!rel || !rel.met) {
      return false;
    }
    const minAff =
      typeof lifeProposalSidebarConfig.minAffectionToShowButton === "number"
        ? lifeProposalSidebarConfig.minAffectionToShowButton
        : 40;
    if ((typeof rel.affection === "number" ? rel.affection : 0) < minAff) {
      return false;
    }
    const allowed = normalizeStringArray(lifeMarriageConfig.allowedStatuses || []);
    if (!allowed.includes(rel.status)) {
      return false;
    }
    const minPAge = typeof lifeMarriageConfig.minPlayerAge === "number" ? lifeMarriageConfig.minPlayerAge : 24;
    if ((st.age || 0) < minPAge) {
      return false;
    }
    return true;
  }

  function attemptProposalFromSidebar(relationshipId) {
    const rid = typeof relationshipId === "string" ? relationshipId.trim() : "";
    if (!rid || !canProposeToRelationship(gameState, rid)) {
      return getState();
    }
    const prevActive = gameState.activeRelationshipId;
    gameState.activeRelationshipId = rid;
    const partner = getRelationshipRecord(gameState, rid);
    const pAccept = computeSidebarProposalAcceptanceProbability(partner, gameState);
    const okPack =
      lifeProposalSidebarConfig.sidebarSuccessPayload && typeof lifeProposalSidebarConfig.sidebarSuccessPayload === "object"
        ? lifeProposalSidebarConfig.sidebarSuccessPayload
        : {};
    const failPack =
      lifeProposalSidebarConfig.sidebarFailPayload && typeof lifeProposalSidebarConfig.sidebarFailPayload === "object"
        ? lifeProposalSidebarConfig.sidebarFailPayload
        : {};
    const onSuccess = {
      addFlags: ["player_married", "marriage_proposed_by_player", "marriage_accepted", "marriage_from_sidebar_button"].concat(
        normalizeStringArray(okPack.addFlags)
      ),
      happiness: 4 + (typeof okPack.happiness === "number" ? okPack.happiness : 0),
      stress: 3 + (typeof okPack.stress === "number" ? okPack.stress : 0),
      partnerHistory:
        typeof okPack.partnerHistory === "string" && okPack.partnerHistory
          ? okPack.partnerHistory
          : "在关系面板里按下「求婚」的那一刻并不体面，但承诺是真的。"
    };
    const failRel = [
      {
        targetId: rid,
        tension: typeof failPack.failTension === "number" ? failPack.failTension : 10,
        trust: typeof failPack.failTrust === "number" ? failPack.failTrust : -5,
        commitment: typeof failPack.failCommitment === "number" ? failPack.failCommitment : -4,
        affection: typeof failPack.failAffection === "number" ? failPack.failAffection : -5,
        history:
          typeof failPack.failHistory === "string"
            ? failPack.failHistory
            : "你把结婚说出口，对方的迟疑像一盆冷水：不是不爱，是还没准备好接这么重的词。"
      }
    ];
    const onFail = {
      addFlags: normalizeStringArray(failPack.addFlags).length
        ? normalizeStringArray(failPack.addFlags)
        : ["sidebar_proposal_rejected", "marriage_proposal_cooling"],
      stats: failPack.stats && typeof failPack.stats === "object" ? failPack.stats : { happiness: -6, stress: 7, mental: -4 },
      log:
        typeof failPack.log === "string"
          ? failPack.log
          : "求婚没有被接住。你们之间多了层尴尬，要不要再走在一起，变成两个人都得重新想的问题。"
    };

    if (Math.random() < pAccept) {
      finalizeMarriageCommit(rid, onSuccess);
      gameState.activeRelationshipId = rid;
      addHistory(
        "你向" +
          (partner && partner.name ? partner.name : "对方") +
          "求婚，对方点头了（接受概率约 " +
          Math.round(pAccept * 100) +
          "%，以好感为主并含情境修正）。"
      );
    } else {
      normalizeStringArray(onFail.addFlags).forEach(function (f) {
        if (f && gameState.flags.indexOf(f) === -1) {
          gameState.flags.push(f);
        }
      });
      const st = onFail.stats && typeof onFail.stats === "object" ? onFail.stats : {};
      Object.keys(st).forEach(function (k) {
        if (typeof st[k] === "number") {
          adjustStat(k, st[k]);
        }
      });
      applyRelationshipEffects(failRel);
      if (typeof onFail.log === "string" && onFail.log) {
        addHistory(onFail.log);
      }
      addHistory("本次求婚对方未接受（约 " + Math.round(pAccept * 100) + "% 接受率）。");
      gameState.activeRelationshipId = prevActive && prevActive !== rid ? prevActive : prevActive || null;
    }

    return getState();
  }

  function getWorkLifeEconomyPreview(state) {
    const st = state || gameState;
    if (!st || typeof st !== "object") {
      return null;
    }
    const wl = st.workLife && typeof st.workLife === "object" ? st.workLife : {};
    const income = computeEmployedAnnualSalaryIncomeForState(st);
    const hid = typeof wl.housingId === "string" ? wl.housingId.trim() : "";
    const rent = computeAnnualHousingRentAmount(income, hid);
    const rc = lifeWorkLifeConfig.rentConfig && typeof lifeWorkLifeConfig.rentConfig === "object" ? lifeWorkLifeConfig.rentConfig : {};
    return {
      annualSalaryIncome: income,
      annualRent: rent,
      annualSalaryFraction: typeof rc.annualSalaryFraction === "number" ? rc.annualSalaryFraction : 0.4,
      housingId: hid,
      workLocationId: typeof wl.workLocationId === "string" ? wl.workLocationId : ""
    };
  }

  function getRelationshipDynamicBio(state, relationshipId) {
    const rel = getRelationshipSnapshot(state, relationshipId);
    if (!rel) {
      return { text: "", stageKey: "", arcLabel: "" };
    }
    return resolveRelationshipDynamicBio(rel, state);
  }

  function getPartnerFamilyView(state, relationshipId) {
    const rel = getRelationshipSnapshot(state, relationshipId);
    if (!rel || !rel.met) {
      return null;
    }
    const pack = partnerFamilyById[rel.id] || partnerFamilyById._default;
    if (!pack || typeof pack !== "object") {
      return null;
    }
    const score = computePartnerIntimacyScore(rel);
    const th =
      typeof lifeFamilyRevealConfig.minIntimacyScore === "number" ? lifeFamilyRevealConfig.minIntimacyScore : 40;
    const revealed = Boolean(rel.partnerFamilyRevealed) || score >= th;
    return {
      vague: typeof pack.vague === "string" ? pack.vague : "",
      revealed,
      revealedTitle: typeof pack.revealedTitle === "string" ? pack.revealedTitle : "家庭背景",
      revealedSummary: typeof pack.revealedSummary === "string" ? pack.revealedSummary : "",
      revealedDetails: Array.isArray(pack.revealedDetails) ? pack.revealedDetails.slice() : [],
      intimacyScore: score,
      threshold: th
    };
  }

  function isShopItemUnlockedNow(itemId) {
    const id = typeof itemId === "string" ? itemId.trim() : "";
    const item = shopItemMap.get(id);
    if (!item) {
      return false;
    }
    return isShopItemUnlockedForState(item, gameState);
  }

  window.LifeGameEngine = {
    getState,
    getCurrentEvent,
    getVisibleOptions,
    chooseOption,
    startGame,
    restart,
    formatText,
    formatOptionText,
    getOptionRecommendationPreview,
    matchesRequirement: matchesConditions,
    hasFlags,
    setActiveRelationship,
    clearActiveRelationship,
    canPurchaseShopItem,
    isShopItemUnlockedNow,
    purchaseShopItem,
    canGiveGiftFromInventory,
    giveGiftFromInventory,
    getRelationshipDynamicBio,
    getPartnerFamilyView,
    getWorkLifeEconomyPreview,
    computePartnerIntimacyScore: function (state, relationshipId) {
      const rel = getRelationshipSnapshot(state, relationshipId);
      return computePartnerIntimacyScore(rel);
    },
    canProposeToRelationship,
    attemptProposalFromSidebar
  };
})();

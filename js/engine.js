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
      details: normalizeStringArray(source.details)
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
      noCurrentPartner: Boolean(conditions.noCurrentPartner)
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
      log: typeof source.log === "string" ? source.log : ""
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
      return 10;
    }

    if (stage === "midlife") {
      return 8;
    }

    return 6;
  }

  function getDefaultEventMaxVisits(stage, repeatable) {
    if (!repeatable) {
      return null;
    }

    if (stage === "later_life" || stage === "midlife") {
      return 2;
    }

    return 3;
  }

  function normalizeEventObject(event, index) {
    const source = event && typeof event === "object" ? event : {};
    const repeatable = Boolean(source.repeatable);
    const fallbackId = "event_" + String(index + 1);
    const normalizedEvent = {
      id: typeof source.id === "string" && source.id.trim() ? source.id.trim() : fallbackId,
      stage: typeof source.stage === "string" && source.stage.trim() ? source.stage.trim() : "misc",
      title: typeof source.title === "string" && source.title.trim() ? source.title.trim() : "未命名事件",
      text: typeof source.text === "string" ? source.text : "",
      minAge: typeof source.minAge === "number" ? source.minAge : null,
      maxAge: typeof source.maxAge === "number" ? source.maxAge : null,
      weight: typeof source.weight === "number" ? source.weight : 1,
      tags: normalizeStringArray(source.tags),
      repeatable,
      cooldownChoices:
        typeof source.cooldownChoices === "number"
          ? Math.max(0, source.cooldownChoices)
          : getDefaultEventCooldown(typeof source.stage === "string" ? source.stage.trim() : "misc", repeatable),
      maxVisits:
        typeof source.maxVisits === "number"
          ? Math.max(1, source.maxVisits)
          : getDefaultEventMaxVisits(typeof source.stage === "string" ? source.stage.trim() : "misc", repeatable)
    };

    normalizedEvent.conditions = normalizeConditionObject(source.conditions, normalizedEvent);
    normalizedEvent.effectsOnEnter = normalizeMutationBlock(source.effectsOnEnter);
    normalizedEvent.choices = Array.isArray(source.choices)
      ? source.choices.map((choice) => normalizeChoiceObject(choice, normalizedEvent))
      : [];
    normalizedEvent.deferEnterAge = shouldDelayEnterAge(normalizedEvent.effectsOnEnter, normalizedEvent.choices);

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

  function isPartnerStatus(status) {
    return ["dating", "passionate", "cooling", "conflict", "steady", "married", "reconnect", "reconnected"].includes(status);
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

  function inferRelationshipStatus(relationship) {
    if (!relationship) {
      return;
    }

    if (["breakup", "broken", "missed"].includes(relationship.status)) {
      syncRelationshipStage(relationship);
      return;
    }

    if ((relationship.commitment || 0) >= 78 && (relationship.trust || 0) >= 72 && (relationship.affection || 0) >= 70) {
      relationship.status = "steady";
      syncRelationshipStage(relationship);
      return;
    }

    if ((relationship.commitment || 0) >= 48 && (relationship.tension || 0) >= 60) {
      relationship.status = "conflict";
      syncRelationshipStage(relationship);
      return;
    }

    if ((relationship.commitment || 0) >= 48 && (relationship.tension || 0) >= 38) {
      relationship.status = "cooling";
      syncRelationshipStage(relationship);
      return;
    }

    if (
      (relationship.commitment || 0) >= 46 &&
      (relationship.playerInterest || 0) >= 56 &&
      (relationship.theirInterest || 0) >= 56
    ) {
      relationship.status = (relationship.tension || 0) >= 34 ? "dating" : "passionate";
      syncRelationshipStage(relationship);
      return;
    }

    if (
      (relationship.playerInterest || 0) >= 48 &&
      (relationship.theirInterest || 0) >= 48 &&
      (relationship.ambiguity || 0) >= 28
    ) {
      relationship.status = "ambiguous";
      syncRelationshipStage(relationship);
      return;
    }

    if (
      (relationship.playerInterest || 0) >= 42 &&
      (relationship.theirInterest || 0) >= 42 &&
      (relationship.familiarity || 0) >= 28
    ) {
      relationship.status = "mutual_crush";
      syncRelationshipStage(relationship);
      return;
    }

    if ((relationship.familiarity || 0) >= 45 && (relationship.trust || 0) >= 36) {
      relationship.status = "close";
      syncRelationshipStage(relationship);
      return;
    }

    if ((relationship.familiarity || 0) >= 20 || (relationship.trust || 0) >= 18) {
      relationship.status = "familiar";
      syncRelationshipStage(relationship);
      return;
    }

    if ((relationship.theirInterest || 0) >= 20 && (relationship.playerInterest || 0) < 18) {
      relationship.status = "noticed_by_them";
      syncRelationshipStage(relationship);
      return;
    }

    if ((relationship.playerInterest || 0) >= 18 || (relationship.theirInterest || 0) >= 18) {
      relationship.status = "crush";
      syncRelationshipStage(relationship);
      return;
    }

    if ((relationship.affection || 0) > 0 || relationship.met) {
      relationship.status = "noticed";
    }
    syncRelationshipStage(relationship);
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

    const currentValue = gameState.stats[key] || 0;
    gameState.stats[key] = clampStat(key, currentValue + delta);
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

    function addChange(key, delta) {
      if (!delta) {
        return;
      }

      derivedChanges[key] = (derivedChanges[key] || 0) + delta;
    }

    if (gameState.stats.stress >= 75) {
      addChange("mental", -3);
      addChange("health", -2);
      addChange("happiness", -2);
    } else if (gameState.stats.stress >= 60) {
      addChange("mental", -2);
      addChange("health", -1);
      addChange("happiness", -1);
    } else if (gameState.stats.stress >= 45) {
      addChange("mental", -1);
    }

    if (gameState.stats.money <= 12) {
      addChange("stress", 2);
      addChange("happiness", -1);
    }

    if (gameState.stats.debt >= 80) {
      addChange("stress", 4);
      addChange("mental", -3);
      addChange("happiness", -3);
      addChange("health", -2);
    } else if (gameState.stats.debt >= 60) {
      addChange("stress", 3);
      addChange("mental", -2);
      addChange("happiness", -2);
    } else if (gameState.stats.debt >= 40) {
      addChange("stress", 2);
      addChange("happiness", -1);
    }

    if (gameState.stats.health <= 30) {
      addChange("mental", -2);
      addChange("happiness", -2);
    }

    if (gameState.stats.mental <= 30) {
      addChange("happiness", -2);
      addChange("social", -1);
      addChange("stress", 1);
    }

    if (gameState.stats.familySupport >= 72) {
      addChange("mental", 1);
      addChange("happiness", 1);
    } else if (gameState.stats.familySupport <= 28) {
      addChange("stress", 1);
      addChange("mental", -1);
    }

    if (gameState.stats.discipline >= 72 && gameState.stats.stress <= 55) {
      addChange("intelligence", 1);
    }

    if (currentPartner && currentPartner.affection >= 55 && isPartnerStatus(currentPartner.status)) {
      if (["dating", "passionate", "steady", "married", "reconnected"].includes(currentPartner.status)) {
        addChange("happiness", 1);
        addChange("mental", 1);
        addChange("stress", -1);
      }

      if (currentPartner.tension >= 55 || ["cooling", "conflict"].includes(currentPartner.status)) {
        addChange("happiness", -2);
        addChange("mental", -2);
        addChange("stress", 2);
      }

      if (currentPartner.commitment >= 45 && gameState.age <= 22) {
        addChange("social", 1);
        addChange("discipline", -1);
      }

      if (currentPartner.commitment >= 58 && gameState.age >= 22) {
        addChange("career", -1);
        addChange("happiness", 1);
      }
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
      details: route.details.slice()
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
      skipStatLinks: true
    });
  }

  function formatText(text) {
    const activeRelationship = getActiveRelationship();
    const strongestRelationship = getStrongestRelationship(gameState);
    const replacements = {
      name: gameState.playerName || "你",
      playerGender: getPlayerGenderLabel(gameState.playerGender),
      activeLoveName: activeRelationship ? activeRelationship.name : "那个人",
      strongestLoveName: strongestRelationship ? strongestRelationship.name : "那个人",
      familyBackgroundName: gameState.familyBackground ? gameState.familyBackground.name : "普通家庭",
      educationRouteName: gameState.educationRoute ? gameState.educationRoute.name : "未定去向",
      careerRouteName: gameState.careerRoute ? gameState.careerRoute.name : "尚未定型的工作路线"
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

    if (rule.requiredFlags.length && !rule.requiredFlags.every((flag) => state.flags.includes(flag))) {
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

      if (
        typeof rule.activeRelationshipMinCommitment === "number" &&
        (activeRelationship.commitment || 0) < rule.activeRelationshipMinCommitment
      ) {
        return false;
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
      dimensions: { ...background.dimensions }
    };
    if (!settings.keepSetupStep) {
      gameState.setupStep = null;
    }
    if (!settings.keepPendingBackground) {
      gameState.pendingFamilyBackgroundId = null;
    }

    applyMutationBlock(background.apply, { skipStatLinks: true });
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

    if (gameState.recentEventIds.length > 18) {
      gameState.recentEventIds.length = 18;
    }
  }

  function rememberEnteredEvent(eventId) {
    if (!gameState.enteredEvents.includes(eventId)) {
      gameState.enteredEvents.push(eventId);
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

  function isEventEligible(event, candidateState) {
    const state = candidateState || gameState;
    const visitCount = state.eventVisitCounts && state.eventVisitCounts[event.id] ? state.eventVisitCounts[event.id] : 0;

    if (!event.repeatable && visitCount > 0) {
      return false;
    }

    if (typeof event.maxVisits === "number" && visitCount >= event.maxVisits) {
      return false;
    }

    if (!candidateState && isEventCoolingDown(event)) {
      return false;
    }

    return matchesConditions(event.conditions, state, event);
  }

  function resolveRelationshipTargetId(targetId) {
    const normalizedId = String(targetId || "").trim();
    if (!normalizedId) {
      return "";
    }

    if (normalizedId === "$active") {
      return gameState.activeRelationshipId || "";
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

      if (effect.clearActive) {
        clearActive = true;
      }

      if (effect.setActive) {
        nextActiveId = resolvedTargetId;
      }

      if (["breakup", "broken", "estranged", "missed"].includes(relationship.status) && gameState.activeRelationshipId === relationship.id) {
        clearActive = true;
      }
    });

    if (clearActive) {
      gameState.activeRelationshipId = null;
    }

    if (nextActiveId) {
      gameState.activeRelationshipId = nextActiveId;
    }
  }

  function applyMutationBlock(block, options) {
    if (!block) {
      return;
    }

    const settings = options || {};
    const effects = block.effects || {};

    if (!settings.skipAge && typeof effects.age === "number") {
      gameState.age = Math.max(gameState.age, gameState.age + effects.age);
    }

    if (effects.stats) {
      for (const [key, delta] of Object.entries(effects.stats)) {
        adjustStat(key, delta);
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
        choiceCount: Math.max(gameState.choiceCount || 0, 108),
      });
    }

    if (!ending) {
      ending = allEndings.find((item) => item.id === "ordinary_ending") || null;
    }

    gameState.ending = ending
      ? {
          ...ending,
          text: buildEndingText(ending)
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
      text: buildEndingText(instantEnding)
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
    applyMutationBlock(event.effectsOnEnter, { skipAge: event.deferEnterAge, skipStatLinks: true });

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

  function getVisibleOptions(event) {
    if (!event || !Array.isArray(event.choices)) {
      return [];
    }

    return event.choices
      .map((choice, index) => ({ ...choice, index }))
      .filter((choice) => matchesConditions(choice.conditions, gameState));
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

    gameState.age = nextAge;

    if (skippedYears > 0) {
      addHistory("日子继续往前推，你在不知不觉间长到了 " + nextAge + " 岁。");
    }

    return pickWeightedEvent(sameAgeEvents);
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

    gameState.age = safeAge;
    addHistory(message || ("日子继续往前推，你在不知不觉间长到了 " + safeAge + " 岁。"));
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

    if (gameState.age >= 68 && nonRepeatableEvents.length === 0 && eligibleEvents.length <= 2) {
      return true;
    }

    if (gameState.age >= 76 && eligibleEvents.length <= 4) {
      return true;
    }

    return false;
  }

  function getRequiredMilestoneEvent() {
    const educationRouteMissing = !gameState.educationRoute;
    const careerRouteMissing = !gameState.careerRoute;

    if (educationRouteMissing && gameState.age >= 18) {
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
            fastForwardToSpecificAge(targetAge, "日子被推着往前走，你很快到了 " + targetAge + " 岁。");
            setCurrentEvent(nextEventId);
            return;
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

    let fallbackEvent = pickWeightedEvent(getEligibleFallbackEvents());

    if (!fallbackEvent) {
      fallbackEvent = fastForwardToNextEligibleAge();
    }

    if (!fallbackEvent && shouldNaturallyConcludeLife()) {
      setCurrentEvent(null);
      return;
    }

    setCurrentEvent(fallbackEvent ? fallbackEvent.id : null);
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

    const option = event.choices[optionIndex];
    if (!option || !matchesConditions(option.conditions, gameState)) {
      return getState();
    }

    rememberEvent(event.id);
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
    applyMutationBlock(optionToApply);

    if (checkInstantEnding()) {
      return getState();
    }

    advanceTo(option.next);

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

  window.LifeGameEngine = {
    getState,
    getCurrentEvent,
    getVisibleOptions,
    chooseOption,
    startGame,
    restart,
    formatText,
    formatOptionText,
    matchesRequirement: matchesConditions,
    hasFlags,
    setActiveRelationship,
    clearActiveRelationship
  };
})();

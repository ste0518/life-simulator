(function () {
  "use strict";

  const stateApi = window.LifeState;
  const relationshipDefinitions = normalizeRelationshipDefinitions(window.LIFE_RELATIONSHIPS || []);
  const relationshipDefinitionMap = new Map(relationshipDefinitions.map((item) => [item.id, item]));
  const rawEvents = [
    ...(Array.isArray(window.LIFE_EVENTS) ? window.LIFE_EVENTS : []),
    ...(Array.isArray(window.LIFE_EXTRA_EVENTS) ? window.LIFE_EXTRA_EVENTS : [])
  ];
  const allEvents = normalizeEventList(rawEvents);
  const eventMap = new Map(allEvents.map((event) => [event.id, event]));
  const allEndings = normalizeEndingList(window.LIFE_ENDINGS || []);

  let gameState = stateApi.createInitialState();

  function getState() {
    return stateApi.cloneState(gameState);
  }

  function normalizeName(name) {
    const trimmed = String(name || "").trim();
    return trimmed || "无名氏";
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
          identity: typeof source.identity === "string" ? source.identity : "",
          traitTags: normalizeStringArray(source.traitTags),
          contactStyle: typeof source.contactStyle === "string" ? source.contactStyle : "",
          conflictStyle: typeof source.conflictStyle === "string" ? source.conflictStyle : "",
          initialAffection: typeof source.initialAffection === "number" ? source.initialAffection : 0,
          initialStatus: typeof source.initialStatus === "string" ? source.initialStatus : "unknown"
        };
      })
      .filter(Boolean);
  }

  function normalizeRelationshipEffect(effect) {
    const source = effect && typeof effect === "object" ? effect : {};

    return {
      targetId: typeof source.targetId === "string" ? source.targetId.trim() : "",
      affection: typeof source.affection === "number" ? source.affection : 0,
      status: typeof source.status === "string" ? source.status : "",
      addFlags: normalizeStringArray(source.addFlags),
      removeFlags: normalizeStringArray(source.removeFlags),
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
      minAffection: normalizeNumberMap(conditions.minAffection),
      maxAffection: normalizeNumberMap(conditions.maxAffection),
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
      requiredActiveRelationshipFlags: normalizeStringArray(conditions.requiredActiveRelationshipFlags),
      excludedActiveRelationshipFlags: normalizeStringArray(conditions.excludedActiveRelationshipFlags),
      noCurrentPartner: Boolean(conditions.noCurrentPartner)
    };
  }

  function normalizeMutationBlock(block) {
    const source = block && typeof block === "object" ? block : {};
    let setActiveRelationship = null;

    if (Object.prototype.hasOwnProperty.call(source, "setActiveRelationship")) {
      setActiveRelationship =
        typeof source.setActiveRelationship === "string" ? source.setActiveRelationship.trim() : null;
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
      clearActiveRelationship: Boolean(source.clearActiveRelationship),
      log: typeof source.log === "string" ? source.log : ""
    };
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

  function normalizeEventObject(event, index) {
    const source = event && typeof event === "object" ? event : {};
    const fallbackId = "event_" + String(index + 1);
    const normalizedEvent = {
      id: typeof source.id === "string" && source.id.trim() ? source.id.trim() : fallbackId,
      stage: typeof source.stage === "string" && source.stage.trim() ? source.stage.trim() : "misc",
      title: typeof source.title === "string" && source.title.trim() ? source.title.trim() : "未命名事件",
      text: typeof source.text === "string" ? source.text : "",
      minAge: typeof source.minAge === "number" ? source.minAge : null,
      maxAge: typeof source.maxAge === "number" ? source.maxAge : null,
      weight: typeof source.weight === "number" ? source.weight : 1,
      tags: normalizeStringArray(source.tags)
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
    if (key === "money") {
      return Math.max(0, value);
    }

    return Math.max(0, Math.min(100, value));
  }

  function clampAffection(value) {
    return Math.max(0, Math.min(100, value));
  }

  function getRelationshipRecord(state, relationshipId) {
    const id = String(relationshipId || "").trim();
    if (!id) {
      return null;
    }

    if (!state.relationships[id]) {
      const definition = relationshipDefinitionMap.get(id);
      state.relationships[id] = {
        id,
        name: definition ? definition.name : id,
        identity: definition ? definition.identity : "",
        traitTags: definition ? definition.traitTags.slice() : [],
        contactStyle: definition ? definition.contactStyle : "",
        conflictStyle: definition ? definition.conflictStyle : "",
        affection: definition ? definition.initialAffection : 0,
        status: definition ? definition.initialStatus : "unknown",
        met: false,
        flags: [],
        history: []
      };
    }

    return state.relationships[id];
  }

  function getCurrentPartner(state) {
    return Object.values(state.relationships || {}).find((relationship) =>
      ["dating", "steady", "married", "reconnected"].includes(relationship.status)
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

  function formatText(text) {
    const activeRelationship = getActiveRelationship();
    const strongestRelationship = getStrongestRelationship(gameState);
    const replacements = {
      name: gameState.playerName || "你",
      activeLoveName: activeRelationship ? activeRelationship.name : "那个人",
      strongestLoveName: strongestRelationship ? strongestRelationship.name : "那个人"
    };

    return String(text || "").replace(/\{(\w+)\}/g, function (_, key) {
      return Object.prototype.hasOwnProperty.call(replacements, key) ? replacements[key] : "";
    });
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
        ? getRelationshipRecord(state, state.activeRelationshipId)
        : null;
      if (!activeRelationship || !rule.activeRelationshipStatuses.includes(activeRelationship.status)) {
        return false;
      }
    }

    if (
      typeof rule.activeRelationshipMinAffection === "number" ||
      typeof rule.activeRelationshipMaxAffection === "number" ||
      rule.requiredActiveRelationshipFlags.length ||
      rule.excludedActiveRelationshipFlags.length
    ) {
      const activeRelationship = state.activeRelationshipId
        ? getRelationshipRecord(state, state.activeRelationshipId)
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
        const relationship = getRelationshipRecord(state, id);
        return relationship && relationship.met;
      });
      if (!knownOk) {
        return false;
      }
    }

    if (rule.unknownRelationships.length) {
      const unknownOk = rule.unknownRelationships.every((id) => {
        const relationship = getRelationshipRecord(state, id);
        return !relationship || !relationship.met;
      });
      if (!unknownOk) {
        return false;
      }
    }

    for (const [relationshipId, statuses] of Object.entries(rule.relationshipStatuses)) {
      const relationship = getRelationshipRecord(state, relationshipId);
      if (!relationship || !statuses.includes(relationship.status)) {
        return false;
      }
    }

    for (const [relationshipId, statuses] of Object.entries(rule.excludedRelationshipStatuses)) {
      const relationship = getRelationshipRecord(state, relationshipId);
      if (relationship && statuses.includes(relationship.status)) {
        return false;
      }
    }

    for (const [relationshipId, amount] of Object.entries(rule.minAffection)) {
      const relationship = getRelationshipRecord(state, relationshipId);
      if (!relationship || relationship.affection < amount) {
        return false;
      }
    }

    for (const [relationshipId, amount] of Object.entries(rule.maxAffection)) {
      const relationship = getRelationshipRecord(state, relationshipId);
      if (relationship && relationship.affection > amount) {
        return false;
      }
    }

    for (const [relationshipId, flags] of Object.entries(rule.requiredRelationshipFlags)) {
      const relationship = getRelationshipRecord(state, relationshipId);
      if (!relationship || !flags.every((flag) => relationship.flags.includes(flag))) {
        return false;
      }
    }

    for (const [relationshipId, flags] of Object.entries(rule.excludedRelationshipFlags)) {
      const relationship = getRelationshipRecord(state, relationshipId);
      if (relationship && flags.some((flag) => relationship.flags.includes(flag))) {
        return false;
      }
    }

    return true;
  }

  function setCurrentEvent(eventId) {
    gameState.currentEventId = eventId;
    gameState.currentEventPendingEnter = Boolean(eventId);
  }

  function restart() {
    gameState = stateApi.createInitialState();
    return getState();
  }

  function startGame(name) {
    gameState = stateApi.createInitialState();
    gameState.playerName = normalizeName(name);
    gameState.gameStarted = true;
    advanceTo();

    addHistory("你出生了，名字被定为“" + gameState.playerName + "”。");
    addHistory("一个普通家庭迎来了新生命。很多年后回头看，这个名字会和无数选择一起，组成你的一生。");

    return getState();
  }

  function rememberEvent(eventId) {
    if (!gameState.visitedEvents.includes(eventId)) {
      gameState.visitedEvents.push(eventId);
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

      if (effect.status) {
        relationship.status = effect.status;
      }

      (effect.addFlags || []).forEach((flag) => {
        if (!relationship.flags.includes(flag)) {
          relationship.flags.push(flag);
        }
      });

      if (effect.removeFlags && effect.removeFlags.length) {
        relationship.flags = relationship.flags.filter((flag) => !effect.removeFlags.includes(flag));
      }

      if (effect.history) {
        addRelationshipHistory(relationship.id, effect.history);
      }

      if (effect.clearActive) {
        clearActive = true;
      }

      if (effect.setActive) {
        nextActiveId = effect.targetId;
      }

      if (["broken", "estranged"].includes(relationship.status) && gameState.activeRelationshipId === relationship.id) {
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
      gameState.age += effects.age;
    }

    if (effects.stats) {
      for (const [key, delta] of Object.entries(effects.stats)) {
        const currentValue = gameState.stats[key] || 0;
        gameState.stats[key] = clampStat(key, currentValue + delta);
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

    if (block.clearActiveRelationship) {
      gameState.activeRelationshipId = null;
    }

    if (typeof block.setActiveRelationship === "string" && block.setActiveRelationship) {
      gameState.activeRelationshipId = block.setActiveRelationship;
      const relationship = getRelationshipRecord(gameState, block.setActiveRelationship);
      if (relationship) {
        relationship.met = true;
      }
    }

    if (block.log) {
      addHistory(block.log);
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
    if (hasFlags(["warm_home", "emotional_safety"])) {
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

    if (["broken", "estranged"].includes(status)) {
      return "你和" + name + "的关系没有完整留住，但那段靠近、误会和失去，确实改变了你后来理解亲密的方式。";
    }

    return name + "曾经在你人生里占过很重的位置，你不是没有认真喜欢过，只是走到最后的方式，并不完全由心动决定。";
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
    return [ending.text, describeChildhood(), describeGrowth(), describeRelationship(), describeLaterLife()]
      .filter(Boolean)
      .join("\n\n");
  }

  function finalizeGame() {
    let ending = pickWeightedEnding(false);

    if (!ending) {
      ending = pickWeightedEnding(false, {
        ...gameState,
        choiceCount: Math.max(gameState.choiceCount || 0, 88),
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
    applyMutationBlock(event.effectsOnEnter, { skipAge: event.deferEnterAge });

    if (checkInstantEnding()) {
      return;
    }
  }

  function getCurrentEvent() {
    if (!gameState.gameStarted || !gameState.currentEventId) {
      return null;
    }

    const event = eventMap.get(gameState.currentEventId) || null;
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
    return allEvents.filter((event) => {
      if (gameState.visitedEvents.includes(event.id)) {
        return false;
      }

      return matchesConditions(event.conditions, gameState, event);
    });
  }

  function getDeferredFallbackEvents() {
    return allEvents.filter((event) => {
      const rule = normalizeConditionObject(event.conditions, event);

      if (gameState.visitedEvents.includes(event.id)) {
        return false;
      }

      if (typeof rule.minAge !== "number" || rule.minAge <= gameState.age) {
        return false;
      }

      return matchesConditions(rule, { ...gameState, age: rule.minAge }, event);
    });
  }

  function fastForwardToNextEligibleAge() {
    const deferredEvents = getDeferredFallbackEvents();

    if (!deferredEvents.length) {
      return null;
    }

    const nextAge = deferredEvents.reduce((lowest, event) => {
      const eventAge = typeof event.minAge === "number" ? event.minAge : lowest;
      return Math.min(lowest, eventAge);
    }, Number.POSITIVE_INFINITY);

    const sameAgeEvents = deferredEvents.filter((event) => event.minAge === nextAge);
    const skippedYears = nextAge - gameState.age;

    gameState.age = nextAge;

    if (skippedYears > 0) {
      addHistory("日子继续往前推，你在不知不觉间长到了 " + nextAge + " 岁。");
    }

    return pickWeightedEvent(sameAgeEvents);
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

  function advanceTo(nextEventId) {
    if (typeof nextEventId === "string") {
      setCurrentEvent(nextEventId);
      return;
    }

    if (nextEventId === null) {
      setCurrentEvent(null);
      return;
    }

    let fallbackEvent = pickWeightedEvent(getEligibleFallbackEvents());

    if (!fallbackEvent) {
      fallbackEvent = fastForwardToNextEligibleAge();
    }

    setCurrentEvent(fallbackEvent ? fallbackEvent.id : null);
  }

  function chooseOption(optionIndex) {
    if (!gameState.gameStarted || gameState.gameOver) {
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
    applyMutationBlock(option);

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
    matchesRequirement: matchesConditions,
    hasFlags,
    setActiveRelationship,
    clearActiveRelationship
  };
})();

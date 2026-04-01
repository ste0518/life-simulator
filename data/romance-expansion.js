(function () {
  "use strict";

  function toList(value) {
    return Array.isArray(value) ? value.slice() : [];
  }

  function toStats(value) {
    return value && typeof value === "object" ? { ...value } : {};
  }

  function toMap(value) {
    return value && typeof value === "object" ? { ...value } : {};
  }

  function mergeStringLists() {
    const result = [];

    Array.prototype.slice.call(arguments).forEach((list) => {
      toList(list).forEach((item) => {
        if (!result.includes(item)) {
          result.push(item);
        }
      });
    });

    return result;
  }

  function mergeNumberMaps() {
    const result = {};

    Array.prototype.slice.call(arguments).forEach((map) => {
      Object.entries(toMap(map)).forEach(([key, value]) => {
        if (typeof value === "number") {
          result[key] = typeof result[key] === "number" ? Math.max(result[key], value) : value;
        }
      });
    });

    return result;
  }

  function mergeRelationshipMaps() {
    const result = {};

    Array.prototype.slice.call(arguments).forEach((map) => {
      Object.entries(toMap(map)).forEach(([key, value]) => {
        result[key] = mergeStringLists(result[key], value);
      });
    });

    return result;
  }

  function mergeConditions(base, extra) {
    const left = base && typeof base === "object" ? base : {};
    const right = extra && typeof extra === "object" ? extra : {};

    return {
      minAge: typeof right.minAge === "number" ? right.minAge : typeof left.minAge === "number" ? left.minAge : null,
      maxAge: typeof right.maxAge === "number" ? right.maxAge : typeof left.maxAge === "number" ? left.maxAge : null,
      minChoices:
        typeof right.minChoices === "number"
          ? right.minChoices
          : typeof left.minChoices === "number"
            ? left.minChoices
            : null,
      maxChoices:
        typeof right.maxChoices === "number"
          ? right.maxChoices
          : typeof left.maxChoices === "number"
            ? left.maxChoices
            : null,
      minStats: mergeNumberMaps(left.minStats, right.minStats),
      maxStats: mergeNumberMaps(left.maxStats, right.maxStats),
      requiredFlags: mergeStringLists(left.requiredFlags, right.requiredFlags),
      excludedFlags: mergeStringLists(left.excludedFlags, right.excludedFlags),
      requiredTags: mergeStringLists(left.requiredTags, right.requiredTags),
      excludedTags: mergeStringLists(left.excludedTags, right.excludedTags),
      requiredRomanceFlags: mergeStringLists(left.requiredRomanceFlags, right.requiredRomanceFlags),
      excludedRomanceFlags: mergeStringLists(left.excludedRomanceFlags, right.excludedRomanceFlags),
      someFlags: mergeStringLists(left.someFlags, right.someFlags),
      visited: mergeStringLists(left.visited, right.visited),
      notVisited: mergeStringLists(left.notVisited, right.notVisited),
      knownRelationships: mergeStringLists(left.knownRelationships, right.knownRelationships),
      unknownRelationships: mergeStringLists(left.unknownRelationships, right.unknownRelationships),
      activeRelationshipIds: mergeStringLists(left.activeRelationshipIds, right.activeRelationshipIds),
      activeRelationshipStatuses: mergeStringLists(left.activeRelationshipStatuses, right.activeRelationshipStatuses),
      anyRelationshipStatuses: mergeStringLists(left.anyRelationshipStatuses, right.anyRelationshipStatuses),
      relationshipStatuses: mergeRelationshipMaps(left.relationshipStatuses, right.relationshipStatuses),
      excludedRelationshipStatuses: mergeRelationshipMaps(
        left.excludedRelationshipStatuses,
        right.excludedRelationshipStatuses
      ),
      requiredRelationshipFlags: mergeRelationshipMaps(left.requiredRelationshipFlags, right.requiredRelationshipFlags),
      excludedRelationshipFlags: mergeRelationshipMaps(left.excludedRelationshipFlags, right.excludedRelationshipFlags),
      minAffection: mergeNumberMaps(left.minAffection, right.minAffection),
      maxAffection: mergeNumberMaps(left.maxAffection, right.maxAffection),
      minFamiliarity: mergeNumberMaps(left.minFamiliarity, right.minFamiliarity),
      minTrust: mergeNumberMaps(left.minTrust, right.minTrust),
      minAmbiguity: mergeNumberMaps(left.minAmbiguity, right.minAmbiguity),
      minPlayerInterest: mergeNumberMaps(left.minPlayerInterest, right.minPlayerInterest),
      minTheirInterest: mergeNumberMaps(left.minTheirInterest, right.minTheirInterest),
      maxTension: mergeNumberMaps(left.maxTension, right.maxTension),
      minCommitment: mergeNumberMaps(left.minCommitment, right.minCommitment),
      minContinuity: mergeNumberMaps(left.minContinuity, right.minContinuity),
      familyBackgroundIds: mergeStringLists(left.familyBackgroundIds, right.familyBackgroundIds),
      excludedFamilyBackgroundIds: mergeStringLists(left.excludedFamilyBackgroundIds, right.excludedFamilyBackgroundIds),
      educationRouteIds: mergeStringLists(left.educationRouteIds, right.educationRouteIds),
      excludedEducationRouteIds: mergeStringLists(
        left.excludedEducationRouteIds,
        right.excludedEducationRouteIds
      ),
      careerRouteIds: mergeStringLists(left.careerRouteIds, right.careerRouteIds),
      excludedCareerRouteIds: mergeStringLists(left.excludedCareerRouteIds, right.excludedCareerRouteIds),
      anyRelationshipMinAffection:
        typeof right.anyRelationshipMinAffection === "number"
          ? right.anyRelationshipMinAffection
          : typeof left.anyRelationshipMinAffection === "number"
            ? left.anyRelationshipMinAffection
            : null,
      activeRelationshipMinAffection:
        typeof right.activeRelationshipMinAffection === "number"
          ? right.activeRelationshipMinAffection
          : typeof left.activeRelationshipMinAffection === "number"
            ? left.activeRelationshipMinAffection
            : null,
      activeRelationshipMaxAffection:
        typeof right.activeRelationshipMaxAffection === "number"
          ? right.activeRelationshipMaxAffection
          : typeof left.activeRelationshipMaxAffection === "number"
            ? left.activeRelationshipMaxAffection
            : null,
      activeRelationshipMinFamiliarity:
        typeof right.activeRelationshipMinFamiliarity === "number"
          ? right.activeRelationshipMinFamiliarity
          : typeof left.activeRelationshipMinFamiliarity === "number"
            ? left.activeRelationshipMinFamiliarity
            : null,
      activeRelationshipMinTrust:
        typeof right.activeRelationshipMinTrust === "number"
          ? right.activeRelationshipMinTrust
          : typeof left.activeRelationshipMinTrust === "number"
            ? left.activeRelationshipMinTrust
            : null,
      activeRelationshipMinPlayerInterest:
        typeof right.activeRelationshipMinPlayerInterest === "number"
          ? right.activeRelationshipMinPlayerInterest
          : typeof left.activeRelationshipMinPlayerInterest === "number"
            ? left.activeRelationshipMinPlayerInterest
            : null,
      activeRelationshipMinTheirInterest:
        typeof right.activeRelationshipMinTheirInterest === "number"
          ? right.activeRelationshipMinTheirInterest
          : typeof left.activeRelationshipMinTheirInterest === "number"
            ? left.activeRelationshipMinTheirInterest
            : null,
      activeRelationshipMaxTension:
        typeof right.activeRelationshipMaxTension === "number"
          ? right.activeRelationshipMaxTension
          : typeof left.activeRelationshipMaxTension === "number"
            ? left.activeRelationshipMaxTension
            : null,
      activeRelationshipMinCommitment:
        typeof right.activeRelationshipMinCommitment === "number"
          ? right.activeRelationshipMinCommitment
          : typeof left.activeRelationshipMinCommitment === "number"
            ? left.activeRelationshipMinCommitment
            : null,
      activeRelationshipMinContinuity:
        typeof right.activeRelationshipMinContinuity === "number"
          ? right.activeRelationshipMinContinuity
          : typeof left.activeRelationshipMinContinuity === "number"
            ? left.activeRelationshipMinContinuity
            : null,
      requiredActiveRelationshipFlags: mergeStringLists(
        left.requiredActiveRelationshipFlags,
        right.requiredActiveRelationshipFlags
      ),
      excludedActiveRelationshipFlags: mergeStringLists(
        left.excludedActiveRelationshipFlags,
        right.excludedActiveRelationshipFlags
      ),
      noCurrentPartner: Boolean(left.noCurrentPartner || right.noCurrentPartner)
    };
  }

  function condition(value) {
    return mergeConditions({}, value);
  }

  function relationshipEffect(value) {
    const source = value && typeof value === "object" ? value : {};

    return {
      targetId: typeof source.targetId === "string" ? source.targetId : "",
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
      addFlags: toList(source.addFlags),
      removeFlags: toList(source.removeFlags),
      history: typeof source.history === "string" ? source.history : "",
      setActive: Boolean(source.setActive),
      clearActive: Boolean(source.clearActive)
    };
  }

  function mutation(value) {
    const source = value && typeof value === "object" ? value : {};
    const effects = source.effects && typeof source.effects === "object" ? source.effects : {};

    return {
      effects: {
        age: typeof effects.age === "number" ? effects.age : 0,
        stats: toStats(effects.stats)
      },
      addFlags: toList(source.addFlags),
      removeFlags: toList(source.removeFlags),
      addTags: toList(source.addTags),
      removeTags: toList(source.removeTags),
      addRomanceFlags: toList(source.addRomanceFlags),
      removeRomanceFlags: toList(source.removeRomanceFlags),
      relationshipEffects: Array.isArray(source.relationshipEffects)
        ? source.relationshipEffects.map(relationshipEffect)
        : [],
      setActiveRelationship:
        typeof source.setActiveRelationship === "string" ? source.setActiveRelationship : null,
      clearActiveRelationship: Boolean(source.clearActiveRelationship),
      log: typeof source.log === "string" ? source.log : ""
    };
  }

  function choice(value) {
    const source = value && typeof value === "object" ? value : {};
    const normalized = mutation(source);

    return {
      text: typeof source.text === "string" ? source.text : "继续",
      effects: normalized.effects,
      addFlags: normalized.addFlags,
      removeFlags: normalized.removeFlags,
      addTags: normalized.addTags,
      removeTags: normalized.removeTags,
      addRomanceFlags: normalized.addRomanceFlags,
      removeRomanceFlags: normalized.removeRomanceFlags,
      relationshipEffects: normalized.relationshipEffects,
      setActiveRelationship: normalized.setActiveRelationship,
      clearActiveRelationship: normalized.clearActiveRelationship,
      log: normalized.log,
      conditions: condition(source.conditions),
      next: Object.prototype.hasOwnProperty.call(source, "next") ? source.next : undefined
    };
  }

  function event(value) {
    const source = value && typeof value === "object" ? value : {};

    return {
      id: typeof source.id === "string" ? source.id : "",
      stage: typeof source.stage === "string" ? source.stage : "misc",
      title: typeof source.title === "string" ? source.title : "未命名事件",
      text: typeof source.text === "string" ? source.text : "",
      minAge: typeof source.minAge === "number" ? source.minAge : null,
      maxAge: typeof source.maxAge === "number" ? source.maxAge : null,
      weight: typeof source.weight === "number" ? source.weight : 1,
      repeatable: Boolean(source.repeatable),
      maxVisits: typeof source.maxVisits === "number" ? source.maxVisits : undefined,
      cooldownChoices: typeof source.cooldownChoices === "number" ? source.cooldownChoices : undefined,
      tags: toList(source.tags),
      conditions: condition(source.conditions),
      effectsOnEnter: mutation(source.effectsOnEnter),
      choices: Array.isArray(source.choices) ? source.choices.map(choice) : []
    };
  }

  function stageFromAge(age) {
    if (age >= 30) {
      return "family";
    }
    if (age >= 25) {
      return "career";
    }
    if (age >= 22) {
      return "young_adult";
    }
    if (age >= 18) {
      return "college";
    }
    if (age >= 16) {
      return "highschool";
    }
    if (age >= 13) {
      return "adolescence";
    }
    return "school";
  }

  function pickText(list, fallback) {
    const items = toList(list);
    return items.length ? items[0] : fallback;
  }

  function getProgression(appearance) {
    const source = appearance && appearance.progression && typeof appearance.progression === "object"
      ? appearance.progression
      : {};

    return {
      notice:
        typeof source.notice === "string"
          ? source.notice
          : "最开始还谈不上熟，只是你先在某个很普通的场景里记住了这个人。",
      contact:
        typeof source.contact === "string"
          ? source.contact
          : "后来因为一些具体的小事，你们终于有了真正说上话的机会。",
      repeated:
        typeof source.repeated === "string"
          ? source.repeated
          : "反复碰见以后，对方开始不只是一个名字，而变成会稳定出现在日常里的人。",
      familiarity:
        typeof source.familiarity === "string"
          ? source.familiarity
          : "熟悉感不是突然发生的，而是在一次次相处里慢慢长出来。",
      special:
        typeof source.special === "string"
          ? source.special
          : "等你开始特别在意对方会不会出现，这段关系就已经和以前不太一样了。"
    };
  }

  function normalizeSceneText(value, fallback) {
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
  }

  function getSceneHooks(appearance) {
    const source = appearance && appearance.sceneHooks && typeof appearance.sceneHooks === "object"
      ? appearance.sceneHooks
      : {};

    return {
      notice: normalizeSceneText(source.notice, "那些再普通不过、却会让你多看一眼的日常角落"),
      contact: normalizeSceneText(source.contact, "某次很具体的小事"),
      repeated: normalizeSceneText(source.repeated, "之后一次次稳定出现的相处"),
      bond: normalizeSceneText(source.bond, "很多细小互动一点点把关系推向了更熟的位置"),
      special: normalizeSceneText(source.special, "你开始明显把对方放进更前面的注意力里时"),
      distance: normalizeSceneText(source.distance, "成长、分流和现实安排让关系不再像以前那样自然延续"),
      reunion: normalizeSceneText(source.reunion, "多年以后在另一个人生场景里又重新碰见")
    };
  }

  function getHookSnippet(value, fallback) {
    return normalizeSceneText(value, fallback).replace(/[。！？；，,\s]+$/g, "");
  }

  function getArcLabel(profile) {
    const arcType = profile && profile.arcType ? profile.arcType : "slowburn";

    if (arcType === "stable") {
      return "更适合慢慢走稳";
    }
    if (arcType === "intense") {
      return "更容易热烈又不稳定";
    }
    if (arcType === "reunion") {
      return "很可能经历走散与重逢";
    }
    if (arcType === "regret") {
      return "很容易走成遗憾线";
    }
    return "需要长时间酝酿";
  }

  function buildEffect(id, changes) {
    return relationshipEffect({ targetId: id, ...changes });
  }

  function relationshipReadyConditions(id, extra) {
    return mergeConditions(
      {
        knownRelationships: [id],
        excludedRelationshipStatuses: {
          [id]: ["broken"]
        }
      },
      extra
    );
  }

  function buildIntroEvent(definition) {
    const appearance = definition.appearance || {};
    const progression = getProgression(appearance);
    const hooks = getSceneHooks(appearance);
    const introAge = typeof appearance.minAge === "number" ? appearance.minAge : 18;
    const contexts = toList(appearance.contexts);
    const firstContext = pickText(contexts, "一次再普通不过的校园接触");
    const contactHook = getHookSnippet(hooks.contact, firstContext);
    const repeatedHook = getHookSnippet(hooks.repeated, firstContext);
    const title =
      introAge < 16
        ? definition.name + "先是在很普通的日常里被你记住"
        : definition.name + "开始以更具体的方式进入你的生活";

    return event({
      id: definition.id + "_intro",
      stage: stageFromAge(introAge),
      title,
      text:
        (appearance.introductionText || definition.identity || "") +
        " 你先是在" +
        hooks.notice +
        "里注意到" +
        definition.name +
        "，后来又因为" +
        contactHook +
        "真正说上话。" +
        progression.notice +
        " " +
        progression.contact +
        " " +
        repeatedHook +
        "让你们开始不只是彼此知道名字，而是会在日常里一再遇见的人。" +
        hooks.bond +
        " " +
        progression.repeated +
        " 这样的认识并不一定立刻变成恋爱，但它很可能成为后面很多年关系的起点。",
      minAge: introAge,
      maxAge: Math.min(introAge + 2, 24),
      weight: introAge <= 15 ? 6 : 5,
      tags: ["romance", "relationship", stageFromAge(introAge)],
      conditions: condition({
        unknownRelationships: [definition.id]
      }),
      choices: [
        choice({
          text: "顺着" + contactHook + "继续多说几句，让这次接触别只停在点头认识。",
          effects: {
            stats: { social: 2, happiness: 2 }
          },
          addTags: ["romance", "relationship"],
          relationshipEffects: [
            buildEffect(definition.id, {
              affection: 8,
              familiarity: 18,
              trust: 6,
              playerInterest: 10,
              continuity: 8,
              interactions: 1,
              status: "familiar",
              addFlags: ["introduced", "took_initiative"],
              setActive: true,
              history:
                "你没有把这次相遇留在普通同学层面，而是顺着" +
                contactHook +
                "多走了一步，让" +
                definition.name +
                "真正从一个偶尔看见的人变成了会继续出现在日常里的人。"
            })
          ],
          log: definition.name + "开始以很具体的方式进入你的人生。"
        }),
        choice({
          text: "先把这份注意放在心里，看看" + repeatedHook + "会不会把你们推得更近一些。",
          effects: {
            stats: { happiness: 1, mental: 1 }
          },
          relationshipEffects: [
            buildEffect(definition.id, {
              affection: 6,
              familiarity: 8,
              playerInterest: 14,
              ambiguity: 4,
              continuity: 5,
              interactions: 1,
              status: "crush",
              addFlags: ["introduced", "player_notice_first"],
              setActive: true,
              history:
                "你先把这份注意藏在心里，但" +
                repeatedHook +
                "已经让" +
                definition.name +
                "开始在你的日常里稳定出现，占掉了一块很具体的位置。"
            })
          ],
          log: "一段早期心动的底色开始形成。"
        }),
        choice({
          text: "先把关系留在自然来往里，让" + repeatedHook + "慢慢把熟悉感垫出来。",
          effects: {
            stats: { intelligence: 1, discipline: 1 }
          },
          relationshipEffects: [
            buildEffect(definition.id, {
              affection: 4,
              familiarity: 12,
              trust: 4,
              continuity: 6,
              interactions: 1,
              status: "noticed",
              addFlags: ["introduced"],
              history:
                "你们没有一开始就带着太强情绪靠近，但" +
                repeatedHook +
                "还是把这段关系的基础稳稳留了下来。"
            })
          ],
          log: "不是每段感情都从心跳开始，有些是先从熟悉感长出来的。"
        })
      ]
    });
  }

  function buildTheirNoticeEvent(definition) {
    const appearance = definition.appearance || {};
    const progression = getProgression(appearance);
    const hooks = getSceneHooks(appearance);
    const introAge = typeof appearance.minAge === "number" ? appearance.minAge : 18;
    const profile = definition.romanceProfile || {};
    const rumorText = appearance.rumorText || "你们之间那点不算明说的不同，开始被周围的人捕捉到。";

    return event({
      id: definition.id + "_their_notice",
      stage: stageFromAge(Math.max(introAge, 14)),
      title: definition.name + "开始对你表现出一些不同",
      text:
        rumorText +
        " " +
        hooks.special +
        "，那种不同开始变得更难装作没发生。" +
        progression.special +
        " 你慢慢感觉到，这一次不只是你在注意对方，对方也在看你怎么回应。",
      minAge: introAge,
      maxAge: Math.min(introAge + 5, 26),
      weight: 4,
      tags: ["romance", "misunderstanding", "mutual"],
      conditions: relationshipReadyConditions(
        definition.id,
        mergeConditions(profile.theirInterestConditions, {
          excludedRelationshipFlags: {
            [definition.id]: ["their_notice_happened"]
          },
          minFamiliarity: {
            [definition.id]: 6
          }
        })
      ),
      choices: [
        choice({
          text: "顺着这份靠近回应一点，别让" + hooks.special + "只停在暗示里。",
          effects: {
            stats: { happiness: 2, social: 2 }
          },
          relationshipEffects: [
            buildEffect(definition.id, {
              affection: 10,
              trust: 6,
              ambiguity: 10,
              playerInterest: 8,
              theirInterest: 18,
              continuity: 6,
              interactions: 1,
              status: "mutual_crush",
              addFlags: ["their_notice_happened", "mutual_window"],
              setActive: true,
              history:
                "你没有回避" +
                definition.name +
                "对你的在意，也没有再假装" +
                hooks.special +
                "只是你的错觉，这让关系第一次真正有了双向感。"
            })
          ],
          log: "有人开始喜欢你这件事，不再只是一种抽象想象。"
        }),
        choice({
          text: "不说破，让" + hooks.special + "带来的那点不同先自己慢慢发酵。",
          effects: {
            stats: { happiness: 1, stress: 1 }
          },
          relationshipEffects: [
            buildEffect(definition.id, {
              affection: 6,
              ambiguity: 14,
              playerInterest: 4,
              theirInterest: 12,
              tension: 4,
              continuity: 4,
              interactions: 1,
              status: "ambiguous",
              addFlags: ["their_notice_happened", "rumor_spread"],
              history:
                "你没有把话说开，" +
                hooks.special +
                "带来的那点变化于是更像在别人眼神和你们自己的猜测里发酵。"
            })
          ],
          log: "青春期很多关系都不是开始于表白，而是开始于谁都不说明白。"
        }),
        choice({
          text: "先往后退一步，别让" + hooks.special + "真的把关系推到更前面。",
          effects: {
            stats: { discipline: 1, happiness: -1, stress: 1 }
          },
          addFlags: ["solo_pattern"],
          relationshipEffects: [
            buildEffect(definition.id, {
              affection: -4,
              theirInterest: -6,
              tension: 8,
              continuity: -2,
              status: "noticed_by_them",
              addFlags: ["their_notice_happened", "missed_signal"],
              history:
                "你先把距离拉开了。那份被看见的感觉并没有消失，只是" +
                hooks.special +
                "之后留下了一点更难解释的遗憾。"
            })
          ],
          log: "有些暧昧不是因为没人心动，而是因为有人先退了一步。"
        })
      ]
    });
  }

  function buildWarmupEvent(definition) {
    const appearance = definition.appearance || {};
    const progression = getProgression(appearance);
    const hooks = getSceneHooks(appearance);
    const introAge = typeof appearance.minAge === "number" ? appearance.minAge : 18;
    const profile = definition.romanceProfile || {};
    const contextText = getHookSnippet(hooks.repeated, pickText(appearance.contexts, "相处"));

    return event({
      id: definition.id + "_warmup",
      stage: stageFromAge(Math.max(introAge, 15)),
      title: "你和" + definition.name + "在很具体的日常里慢慢熟了起来",
      text:
        progression.familiarity +
        " 很多关系不是一瞬间定性的，而是在" +
        contextText +
        "里慢慢变得不同。" +
        hooks.bond +
        " 你和" +
        definition.name +
        "之间，也来到了那种既不完全普通、又还没正式挑明的阶段。",
      minAge: introAge,
      maxAge: Math.min(introAge + 8, 28),
      weight: 4,
      tags: ["romance", "warmup", "continuity"],
      conditions: relationshipReadyConditions(
        definition.id,
        mergeConditions(profile.warmingConditions, {
          excludedRelationshipStatuses: {
            [definition.id]: ["dating", "passionate", "steady", "married", "broken", "missed"]
          },
          minFamiliarity: {
            [definition.id]: 6
          },
          maxTension: {
            [definition.id]: 58
          },
          excludedRelationshipFlags: {
            [definition.id]: ["warmup_happened"]
          }
        })
      ),
      choices: [
        choice({
          text: "继续顺着" + contextText + "来往，让熟悉感真正长进日常。",
          effects: {
            stats: { happiness: 2, social: 2 }
          },
          relationshipEffects: [
            buildEffect(definition.id, {
              affection: 10,
              familiarity: 18,
              trust: 12,
              playerInterest: 8,
              theirInterest: 8,
              continuity: 10,
              interactions: 1,
              status: "close",
              addFlags: ["warmup_happened"],
              setActive: true,
              history:
                "你们开始不止是知道彼此，而是真的在" +
                contextText +
                "里熟了起来，很多原本普通的相处也慢慢有了偏向。"
            })
          ],
          log: "熟悉度和信任开始成为这段关系真正的地基。"
        }),
        choice({
          text: "先不急着说破，让" + hooks.special + "带来的那点暧昧继续往前长。",
          effects: {
            stats: { happiness: 1, stress: 1 }
          },
          relationshipEffects: [
            buildEffect(definition.id, {
              affection: 8,
              familiarity: 10,
              ambiguity: 16,
              playerInterest: 6,
              theirInterest: 6,
              continuity: 8,
              interactions: 1,
              status: "ambiguous",
              addFlags: ["warmup_happened", "ambiguity_started"],
              history:
                "你们没有正式定义关系，但" +
                contextText +
                "已经开始带上了一点不太像普通朋友的热度。"
            })
          ],
          log: "有些关系在很长一段时间里，确实只活在‘差一点说开’的状态里。"
        }),
        choice({
          text: "提醒自己先别陷太深，把关系收在还算可控的位置。",
          effects: {
            stats: { discipline: 1, intelligence: 1, happiness: -1 }
          },
          addFlags: ["career_first"],
          relationshipEffects: [
            buildEffect(definition.id, {
              affection: -3,
              familiarity: 6,
              continuity: 4,
              tension: 4,
              status: "familiar",
              addFlags: ["warmup_happened", "held_back_once"],
              history:
                "你没有切断联系，但还是在" +
                contextText +
                "里把很多原本会继续升温的动作往更安全的位置收了收。"
            })
          ],
          log: "你知道自己不是没感觉，只是选择先把节奏按住。"
        })
      ]
    });
  }

  function buildConfessionEvent(definition) {
    const appearance = definition.appearance || {};
    const hooks = getSceneHooks(appearance);
    const introAge = typeof appearance.minAge === "number" ? appearance.minAge : 18;
    const profile = definition.romanceProfile || {};
    const arcLabel = getArcLabel(profile);
    const datingStatus = profile.arcType === "intense" ? "passionate" : "dating";

    return event({
      id: definition.id + "_confession",
      stage: stageFromAge(Math.max(introAge + 1, 15)),
      title: "你和" + definition.name + "来到了该不该说开的节点",
      text:
        hooks.special +
        "以后，你们之间已经不是普通同学、普通朋友那样的距离了。问题只剩下一个：要不要把这份喜欢明确说出来。对" +
        definition.name +
        "而言，这条线" +
        arcLabel +
        "。",
      minAge: introAge + 1,
      maxAge: Math.min(introAge + 10, 30),
      weight: 4,
      tags: ["romance", "confession", "relationship"],
      conditions: relationshipReadyConditions(definition.id, {
        excludedRelationshipStatuses: {
          [definition.id]: ["dating", "passionate", "steady", "married", "broken"]
        },
        minFamiliarity: {
          [definition.id]: 24
        },
        minTrust: {
          [definition.id]: 16
        },
        minPlayerInterest: {
          [definition.id]: 28
        },
        minTheirInterest: {
          [definition.id]: 24
        },
        maxTension: {
          [definition.id]: 64
        },
        excludedRelationshipFlags: {
          [definition.id]: ["confession_resolved"]
        }
      }),
      choices: [
        choice({
          text: "把喜欢说出来，别再让这段关系只停在那些反复出现的特别里。",
          effects: {
            stats: { happiness: 3, social: 2, stress: 1 }
          },
          addTags: ["romance", "relationship"],
          addRomanceFlags: ["relationship_maintained"],
          relationshipEffects: [
            buildEffect(definition.id, {
              affection: 14,
              trust: 10,
              ambiguity: -10,
              playerInterest: 8,
              theirInterest: 8,
              commitment: 46,
              continuity: 10,
              interactions: 1,
              status: datingStatus,
              addFlags: ["confession_resolved", "dated_once"],
              setActive: true,
              history:
                "你们终于把喜欢说开，关系正式越过了只靠" +
                hooks.special +
                "这种暗示维持的阶段。"
            })
          ],
          log: "这段关系第一次被明确地放到了‘恋爱’的位置上。"
        }),
        choice({
          text: "先不说破，让双向好感继续停在彼此都感觉得到的特别里。",
          effects: {
            stats: { happiness: 1, mental: 1 }
          },
          relationshipEffects: [
            buildEffect(definition.id, {
              affection: 6,
              ambiguity: 18,
              playerInterest: 6,
              theirInterest: 6,
              continuity: 6,
              status: "ambiguous",
              addFlags: ["confession_resolved", "kept_unsaid"],
              history:
                "你们明明都感觉到了什么，却还是把那层窗户纸留到了以后，让很多分量继续藏在没说完的话里。"
            })
          ],
          log: "没有表白，不代表没有爱意；只是这条线暂时继续以暧昧的形式活着。"
        }),
        choice({
          text: "因为时机、压力或顾虑，把这次机会让过去。",
          effects: {
            stats: { happiness: -2, stress: 2, intelligence: 1 }
          },
          addFlags: ["missed_love"],
          relationshipEffects: [
            buildEffect(definition.id, {
              affection: -8,
              tension: 10,
              continuity: -4,
              commitment: -8,
              status: profile.arcType === "reunion" || profile.arcType === "regret" ? "missed" : "estranged",
              addFlags: ["confession_resolved", "missed_timing"],
              history:
                "你们不是没机会，只是那次原本能说开的时机最终没有被真正抓住。"
            })
          ],
          log: "很多遗憾线，都是从‘这次先算了吧’开始的。"
        })
      ]
    });
  }

  function buildMaintenanceEvent(definition) {
    const appearance = definition.appearance || {};
    const introAge = typeof appearance.minAge === "number" ? appearance.minAge : 18;

    return event({
      id: definition.id + "_maintenance",
      stage: stageFromAge(Math.max(introAge + 2, 18)),
      title: "你和" + definition.name + "的关系进入了长期经营阶段",
      text:
        "正式交往以后，感情就不再只是心动本身。学业、前途、作息、时间分配和情绪表达，都会开始真正影响你们的关系。",
      minAge: introAge + 2,
      maxAge: 40,
      weight: 3,
      repeatable: true,
      maxVisits: 2,
      cooldownChoices: 8,
      tags: ["romance", "maintenance", "long_term"],
      conditions: condition({
        relationshipStatuses: {
          [definition.id]: ["dating", "passionate", "cooling", "conflict", "steady", "reconnected"]
        },
        minCommitment: {
          [definition.id]: 36
        }
      }),
      choices: [
        choice({
          text: "认真经营，把联系、沟通和陪伴都放到优先级里。",
          effects: {
            stats: { happiness: 3, mental: 2, social: 1, stress: -1 }
          },
          addRomanceFlags: ["relationship_maintained"],
          relationshipEffects: [
            buildEffect(definition.id, {
              affection: 10,
              trust: 10,
              tension: -10,
              commitment: 14,
              continuity: 12,
              interactions: 1,
              status: "steady",
              addFlags: ["maintenance_done"],
              setActive: true,
              history: "你没有把感情交给运气，而是真的在持续经营它。"
            })
          ],
          log: "长期关系开始影响你的幸福感、压力和时间分配。"
        }),
        choice({
          text: "一边谈感情，一边兼顾学业或事业，尽量别让任何一边塌掉。",
          effects: {
            stats: { intelligence: 1, career: 1, stress: 1 }
          },
          addFlags: ["career_first"],
          relationshipEffects: [
            buildEffect(definition.id, {
              affection: 2,
              tension: 8,
              commitment: -2,
              continuity: 4,
              interactions: 1,
              status: "cooling",
              addFlags: ["maintenance_done", "busy_period"],
              history: "你们还在继续，但现实压力开始明显挤占这段关系本来该有的位置。"
            })
          ],
          log: "交往会反过来影响你的人生安排，而不是一条完全独立的支线。"
        }),
        choice({
          text: "情绪和问题先拖着不处理，看看会不会自己过去。",
          effects: {
            stats: { happiness: -2, stress: 2, mental: -1 }
          },
          addRomanceFlags: ["relationship_neglected"],
          relationshipEffects: [
            buildEffect(definition.id, {
              affection: -8,
              trust: -10,
              tension: 18,
              commitment: -12,
              continuity: -6,
              interactions: 1,
              status: "conflict",
              addFlags: ["maintenance_done", "conflict_seeded"],
              history: "关系没有因为你们在一起就自动变稳，很多问题被拖成了更难收的结。"
            })
          ],
          log: "“先拖着”往往不会让关系自己变好，只会让裂缝变深。"
        })
      ]
    });
  }

  function buildConflictEvent(definition) {
    const appearance = definition.appearance || {};
    const hooks = getSceneHooks(appearance);
    const introAge = typeof appearance.minAge === "number" ? appearance.minAge : 18;
    const profile = definition.romanceProfile || {};

    return event({
      id: definition.id + "_conflict",
      stage: stageFromAge(Math.max(introAge + 3, 18)),
      title: "你和" + definition.name + "碰到了关系能不能继续走下去的难点",
      text:
        hooks.distance +
        "。成长路线不同、异地、家庭压力、工作节奏和价值观差异，终于不再只是背景噪音。你和" +
        definition.name +
        "都得决定，这段关系到底是修，还是散。",
      minAge: introAge + 2,
      maxAge: 42,
      weight: 3,
      repeatable: true,
      maxVisits: 2,
      cooldownChoices: 10,
      tags: ["romance", "conflict", "breakup"],
      conditions: relationshipReadyConditions(
        definition.id,
        mergeConditions(profile.breakupConditions, {
          relationshipStatuses: {
            [definition.id]: ["dating", "passionate", "cooling", "conflict", "steady", "reconnected"]
          },
          minCommitment: {
            [definition.id]: 28
          },
          maxTension: {
            [definition.id]: 100
          }
        })
      ),
      choices: [
        choice({
          text: "把矛盾认真谈清楚，尽量修这段关系。",
          effects: {
            stats: { mental: 2, social: 2, happiness: 1 }
          },
          addRomanceFlags: ["relationship_rebuilt"],
          relationshipEffects: [
            buildEffect(definition.id, {
              affection: 8,
              trust: 10,
              tension: -16,
              commitment: 8,
              continuity: 10,
              interactions: 1,
              status: "reconnected",
              addFlags: ["repaired_once"],
              setActive: true,
              history:
                "你们没有直接散开，而是把最难说的话认真说了一遍，试着不让" +
                hooks.distance +
                "真的成为结局。"
            })
          ],
          log: "修关系本身也是一种投入，会反过来改变你的情绪和生活。"
        }),
        choice({
          text: "先接受冷淡和距离，让关系退回到没那么伤人的位置。",
          effects: {
            stats: { stress: 1, happiness: -1, intelligence: 1 }
          },
          relationshipEffects: [
            buildEffect(definition.id, {
              affection: -6,
              tension: 6,
              commitment: -10,
              continuity: -4,
              status: "estranged",
              addFlags: ["distance_opened"],
              clearActive: true,
              history:
                "你们没有立刻分手，但关系还是明显退回到了更远的位置，很多原本稳定的联系也开始松掉。"
            })
          ],
          log: "不是每次冷淡都会立刻结束关系，但很多关系都会先从疏远开始。"
        }),
        choice({
          text: "承认这段关系撑不动了，正式分开。",
          effects: {
            stats: { happiness: -4, mental: -2, stress: 2 }
          },
          addFlags: ["missed_love"],
          addRomanceFlags: ["relationship_ended"],
          relationshipEffects: [
            buildEffect(definition.id, {
              affection: -16,
              trust: -12,
              tension: 8,
              commitment: -28,
              continuity: -10,
              status: "broken",
              addFlags: ["breakup_done"],
              clearActive: true,
              history:
                "你们把分开正式说了出来。这不是一瞬间的选择，而是很多问题积到这里以后，终于不再能只靠喜欢撑住。"
            })
          ],
          log: "分手不再是一次性按钮，而是人生线里会留下长久后果的状态变化。"
        })
      ]
    });
  }

  function buildReunionEvent(definition) {
    const availability = definition.availability || {};
    const appearance = definition.appearance || {};
    const hooks = getSceneHooks(appearance);
    const profile = definition.romanceProfile || {};
    const reconnectAges = toList(availability.reconnectAges).filter((value) => typeof value === "number");
    const minAge = reconnectAges.length ? reconnectAges[0] : 24;

    if (!profile.canReconnect) {
      return null;
    }

    return event({
      id: definition.id + "_reunion",
      stage: stageFromAge(minAge),
      title: "多年以后，你又和" + definition.name + "有了联系",
      text:
        "以前那段关系并没有凭空消失。很多年过去以后，你们终于又在一个新的时间点上看见了彼此。" +
        hooks.reunion +
        "，问题也变成了：这次还要不要重新靠近。",
      minAge,
      maxAge: 45,
      weight: 3,
      tags: ["romance", "reunion", "continuity"],
      conditions: mergeConditions(profile.reconnectConditions, {
        knownRelationships: [definition.id],
        relationshipStatuses: {
          [definition.id]: ["estranged", "broken", "missed"]
        },
        excludedRelationshipFlags: {
          [definition.id]: ["reunion_resolved"]
        },
        minContinuity: {
          [definition.id]: 8
        }
      }),
      choices: [
        choice({
          text: "重新联系，看看这段关系还能不能在新的阶段继续。",
          effects: {
            stats: { happiness: 2, social: 2, mental: 1 }
          },
          addRomanceFlags: ["relationship_rebuilt"],
          relationshipEffects: [
            buildEffect(definition.id, {
              affection: 10,
              familiarity: 8,
              trust: 10,
              playerInterest: 8,
              theirInterest: 8,
              tension: -8,
              commitment: 12,
              continuity: 14,
              interactions: 1,
              status: "reconnected",
              addFlags: ["reunion_resolved", "reconnected_once"],
              setActive: true,
              history:
                "很多年后，你们重新把彼此放回了人生里。以前没走完的那条线，突然又有了继续的可能。"
            })
          ],
          log: "早期认识的人并没有自动消失，有些关系真的会在后面重新回来。"
        }),
        choice({
          text: "保持礼貌联系，但不再把它推回恋爱方向。",
          effects: {
            stats: { mental: 1 }
          },
          relationshipEffects: [
            buildEffect(definition.id, {
              affection: 2,
              continuity: 4,
              status: "estranged",
              addFlags: ["reunion_resolved"],
              history: "你们重新联系过了，也确认了这段关系更适合留在过去和现在的中间地带。"
            })
          ],
          log: "不是每次重逢都要复合，有些重逢只是为了把过去放回合适的位置。"
        }),
        choice({
          text: "不再回头，让这段关系停在它已经走到的地方。",
          effects: {
            stats: { discipline: 1, happiness: -1 }
          },
          relationshipEffects: [
            buildEffect(definition.id, {
              affection: -4,
              continuity: -6,
              status: "missed",
              addFlags: ["reunion_resolved", "closed_for_good"],
              history: "你没有再把这段关系重新打开。它仍然重要，只是你选择不让它再次进入现在。"
            })
          ],
          log: "重逢并不总意味着新的开始，有时也意味着真正放下。"
        })
      ]
    });
  }

  function buildRelationshipArc(definition) {
    return [
      buildIntroEvent(definition),
      buildTheirNoticeEvent(definition),
      buildWarmupEvent(definition),
      buildConfessionEvent(definition),
      buildMaintenanceEvent(definition),
      buildConflictEvent(definition),
      buildReunionEvent(definition)
    ].filter(Boolean);
  }

  function buildGlobalRomancePressureEvent() {
    return event({
      id: "global_romance_pressure",
      stage: "young_adult",
      title: "感情开始真实影响你的时间、压力和未来选择",
      text:
        "关系走长以后，恋爱就不再只是感受问题。谁优先、谁妥协、要不要异地、要不要为了前途改计划，都会开始变成现实选择。",
      minAge: 17,
      maxAge: 38,
      weight: 4,
      repeatable: true,
      maxVisits: 2,
      cooldownChoices: 10,
      tags: ["romance", "pressure", "future"],
      conditions: condition({
        activeRelationshipStatuses: ["dating", "passionate", "cooling", "conflict", "steady", "reconnected"],
        activeRelationshipMinCommitment: 30
      }),
      choices: [
        choice({
          text: "主动重新分配时间，把关系和未来都纳入真正的长期规划。",
          effects: {
            stats: { happiness: 2, mental: 1, discipline: 1, career: 1 }
          },
          addRomanceFlags: ["relationship_committed"],
          relationshipEffects: [
            relationshipEffect({
              targetId: "$active",
              affection: 8,
              trust: 8,
              commitment: 10,
              continuity: 8,
              tension: -6,
              interactions: 1,
              status: "steady",
              addFlags: ["future_planned"],
              history: "你开始把这段关系纳入自己的长期人生规划，而不是只靠顺其自然维持。"
            })
          ],
          log: "感情开始参与决定你的人生路线。"
        }),
        choice({
          text: "优先顾住学业或事业，让关系接受现实节奏的挤压。",
          effects: {
            stats: { intelligence: 1, career: 2, stress: 1 }
          },
          addFlags: ["career_first"],
          relationshipEffects: [
            relationshipEffect({
              targetId: "$active",
              affection: -4,
              tension: 8,
              commitment: -6,
              continuity: -2,
              interactions: 1,
              status: "cooling",
              addFlags: ["future_pressure"],
              history: "你开始把更多精力压向前途，关系也因此不得不承受被现实挤压的后果。"
            })
          ],
          log: "恋爱没有消失，但它开始明显影响你的压力和时间结构。"
        }),
        choice({
          text: "先把这段感情处理成次要项，避免它继续干扰当下人生安排。",
          effects: {
            stats: { discipline: 1, happiness: -2, stress: 1 }
          },
          addFlags: ["solo_pattern"],
          relationshipEffects: [
            relationshipEffect({
              targetId: "$active",
              affection: -8,
              tension: 10,
              commitment: -10,
              continuity: -6,
              interactions: 1,
              status: "estranged",
              clearActive: true,
              addFlags: ["future_pressure"],
              history: "你把这段关系往后排了。不是没有感情，而是你暂时不愿意让它继续占住当前生活的核心。"
            })
          ],
          log: "关系被放到次要位置以后，后续命运也会开始改写。"
        })
      ]
    });
  }

  const definitions = Array.isArray(window.LIFE_RELATIONSHIPS) ? window.LIFE_RELATIONSHIPS : [];
  const generatedEvents = definitions.flatMap(buildRelationshipArc);

  window.LIFE_EXTRA_EVENTS = [
    ...(Array.isArray(window.LIFE_EXTRA_EVENTS) ? window.LIFE_EXTRA_EVENTS : []),
    ...generatedEvents,
    buildGlobalRomancePressureEvent()
  ];
})();

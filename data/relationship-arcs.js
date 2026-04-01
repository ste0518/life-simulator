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

  function condition(value) {
    const source = value && typeof value === "object" ? value : {};

    return {
      minAge: typeof source.minAge === "number" ? source.minAge : null,
      maxAge: typeof source.maxAge === "number" ? source.maxAge : null,
      minChoices: typeof source.minChoices === "number" ? source.minChoices : null,
      maxChoices: typeof source.maxChoices === "number" ? source.maxChoices : null,
      minStats: toStats(source.minStats),
      maxStats: toStats(source.maxStats),
      requiredFlags: toList(source.requiredFlags),
      excludedFlags: toList(source.excludedFlags),
      requiredTags: toList(source.requiredTags),
      excludedTags: toList(source.excludedTags),
      requiredRomanceFlags: toList(source.requiredRomanceFlags),
      excludedRomanceFlags: toList(source.excludedRomanceFlags),
      someFlags: toList(source.someFlags),
      visited: toList(source.visited),
      notVisited: toList(source.notVisited),
      knownRelationships: toList(source.knownRelationships),
      unknownRelationships: toList(source.unknownRelationships),
      activeRelationshipIds: toList(source.activeRelationshipIds),
      activeRelationshipStatuses: toList(source.activeRelationshipStatuses),
      anyRelationshipStatuses: toList(source.anyRelationshipStatuses),
      relationshipStatuses: toMap(source.relationshipStatuses),
      excludedRelationshipStatuses: toMap(source.excludedRelationshipStatuses),
      requiredRelationshipFlags: toMap(source.requiredRelationshipFlags),
      excludedRelationshipFlags: toMap(source.excludedRelationshipFlags),
      requiredSharedHistory: toMap(source.requiredSharedHistory),
      excludedSharedHistory: toMap(source.excludedSharedHistory),
      minAffection: toMap(source.minAffection),
      maxAffection: toMap(source.maxAffection),
      minFamiliarity: toMap(source.minFamiliarity),
      minTrust: toMap(source.minTrust),
      minAmbiguity: toMap(source.minAmbiguity),
      minPlayerInterest: toMap(source.minPlayerInterest),
      minTheirInterest: toMap(source.minTheirInterest),
      maxTension: toMap(source.maxTension),
      minCommitment: toMap(source.minCommitment),
      minContinuity: toMap(source.minContinuity),
      minInteractionCount: toMap(source.minInteractionCount),
      familyBackgroundIds: toList(source.familyBackgroundIds),
      excludedFamilyBackgroundIds: toList(source.excludedFamilyBackgroundIds),
      educationRouteIds: toList(source.educationRouteIds),
      excludedEducationRouteIds: toList(source.excludedEducationRouteIds),
      careerRouteIds: toList(source.careerRouteIds),
      excludedCareerRouteIds: toList(source.excludedCareerRouteIds),
      anyRelationshipMinAffection:
        typeof source.anyRelationshipMinAffection === "number" ? source.anyRelationshipMinAffection : null,
      activeRelationshipMinAffection:
        typeof source.activeRelationshipMinAffection === "number" ? source.activeRelationshipMinAffection : null,
      activeRelationshipMaxAffection:
        typeof source.activeRelationshipMaxAffection === "number" ? source.activeRelationshipMaxAffection : null,
      activeRelationshipMinFamiliarity:
        typeof source.activeRelationshipMinFamiliarity === "number"
          ? source.activeRelationshipMinFamiliarity
          : null,
      activeRelationshipMinTrust:
        typeof source.activeRelationshipMinTrust === "number" ? source.activeRelationshipMinTrust : null,
      activeRelationshipMinPlayerInterest:
        typeof source.activeRelationshipMinPlayerInterest === "number"
          ? source.activeRelationshipMinPlayerInterest
          : null,
      activeRelationshipMinTheirInterest:
        typeof source.activeRelationshipMinTheirInterest === "number"
          ? source.activeRelationshipMinTheirInterest
          : null,
      activeRelationshipMaxTension:
        typeof source.activeRelationshipMaxTension === "number" ? source.activeRelationshipMaxTension : null,
      activeRelationshipMinCommitment:
        typeof source.activeRelationshipMinCommitment === "number"
          ? source.activeRelationshipMinCommitment
          : null,
      activeRelationshipMinContinuity:
        typeof source.activeRelationshipMinContinuity === "number"
          ? source.activeRelationshipMinContinuity
          : null,
      activeRelationshipMinInteractionCount:
        typeof source.activeRelationshipMinInteractionCount === "number"
          ? source.activeRelationshipMinInteractionCount
          : null,
      requiredActiveRelationshipFlags: toList(source.requiredActiveRelationshipFlags),
      excludedActiveRelationshipFlags: toList(source.excludedActiveRelationshipFlags),
      activeRelationshipRequiredSharedHistory: toList(source.activeRelationshipRequiredSharedHistory),
      activeRelationshipExcludedSharedHistory: toList(source.activeRelationshipExcludedSharedHistory),
      noCurrentPartner: Boolean(source.noCurrentPartner)
    };
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
      addSharedHistory: toList(source.addSharedHistory),
      removeSharedHistory: toList(source.removeSharedHistory),
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

  function effectFor(id, changes) {
    return relationshipEffect({ targetId: id, ...changes });
  }

  function focusConditions(id, extra) {
    const source = extra && typeof extra === "object" ? extra : {};
    return condition({
      activeRelationshipIds: [id],
      ...source
    });
  }

  function buildBaseTitle(definition) {
    const profile = definition.romanceProfile || {};
    if (profile.arcType === "stable") {
      return "慢慢过成生活";
    }
    if (profile.arcType === "intense") {
      return "热烈也容易拉扯";
    }
    if (profile.arcType === "reunion") {
      return "走散又重逢的路线";
    }
    if (profile.arcType === "regret") {
      return "很容易长成遗憾";
    }
    return "需要慢慢酝酿";
  }

  function buildBaseSummary(definition) {
    const profile = definition.romanceProfile || {};
    const futureFocus = typeof profile.futureFocus === "string" ? profile.futureFocus : "关系会随着成长阶段不断变化。";
    return definition.name + "的关系线重点是：" + futureFocus;
  }

  const ARC_OVERRIDES = {
    song_qinghe: {
      arcId: "song_qinghe_arc",
      title: "纸页与晚风线",
      summary: "从初中值日和传纸条开始，慢慢走到高中图书馆、大学异地和成年后的书店重逢，更偏向安静陪伴与长期修复。",
      exclusiveEvents: [
        "song_qinghe_duty_roster",
        "song_qinghe_library_walk",
        "song_qinghe_letter_gap",
        "song_qinghe_bookstore_reunion"
      ],
      historyLabels: {
        song_duty_roster: "一起值日和传纸条",
        song_library_walk: "晚自习后去图书馆和小卖部",
        song_letter_gap: "大学阶段靠信和旧书单维系",
        song_bookstore_reunion: "多年后在旧书店重逢"
      }
    },
    jiang_xun: {
      arcId: "jiang_xun_arc",
      title: "球场与脾气线",
      summary: "更偏向青春期热烈、公开起哄、直来直去的冲突和成年后能不能重新并肩的路线。",
      exclusiveEvents: [
        "jiang_xun_court_sideline",
        "jiang_xun_sports_day_heat",
        "jiang_xun_pride_collision",
        "jiang_xun_midnight_pickup"
      ],
      historyLabels: {
        jiang_sideline: "球场边递水和等人散场",
        jiang_sports_day: "运动会和公开起哄",
        jiang_pride_collision: "大学后因为节奏和自尊拉扯",
        jiang_midnight_pickup: "工作后在深夜重新接住彼此"
      }
    },
    fang_ke: {
      arcId: "fang_ke_arc",
      title: "同桌慢热线",
      summary: "从并肩做题、补课和长期默契一点点长出的关系，更适合慢热、细水长流和后劲型修复。",
      exclusiveEvents: [
        "fang_ke_deskmate_errand",
        "fang_ke_weekend_problem_set",
        "fang_ke_split_after_results",
        "fang_ke_rain_station_reunion"
      ],
      historyLabels: {
        fang_deskmate: "同桌时期的作业和放学路",
        fang_problem_set: "周末补课和一起做压轴题",
        fang_split_results: "升学分流后的联系与错位",
        fang_rain_station: "成年后在车站雨夜重逢"
      }
    },
    he_yuan: {
      arcId: "he_yuan_arc",
      title: "清醒规划线",
      summary: "更强调竞赛班、志愿填报、城市选择和成年后现实规划，是典型的长期价值观磨合路线。",
      exclusiveEvents: [
        "he_yuan_transfer_seat",
        "he_yuan_mock_exam_strategy",
        "he_yuan_offer_city_choice",
        "he_yuan_parent_meeting"
      ],
      historyLabels: {
        he_transfer_seat: "转学生时期的第一轮熟悉",
        he_mock_exam: "模考、志愿和晚自习搭子",
        he_city_choice: "毕业后的城市与工作抉择",
        he_parent_meeting: "成年后谈未来与见家长"
      }
    },
    zhou_yi: {
      arcId: "zhou_yi_arc",
      title: "并肩成长线",
      summary: "项目合作、实习和成长速度差会不断考验关系，体验更偏向事业驱动、现实拉扯和成熟后的再选择。",
      exclusiveEvents: [
        "zhou_yi_project_sprint",
        "zhou_yi_intern_offer",
        "zhou_yi_growth_rate_gap",
        "zhou_yi_airport_return"
      ],
      historyLabels: {
        zhou_project: "项目通宵和并肩做事",
        zhou_offer: "实习 offer 与时间重新分配",
        zhou_growth_gap: "工作几年后的速度差",
        zhou_airport: "机场重逢与是否再试一次"
      }
    },
    xu_qing: {
      arcId: "xu_qing_arc",
      title: "生活搭建线",
      summary: "从志愿活动、照顾生病到租房磨合与家庭议题，更偏向稳定、照顾感和真正能不能一起过日子。",
      exclusiveEvents: [
        "xu_qing_volunteer_kitchen",
        "xu_qing_fever_night",
        "xu_qing_rent_and_chores",
        "xu_qing_family_table_future"
      ],
      historyLabels: {
        xu_kitchen: "志愿活动后的洗碗和收摊",
        xu_fever_night: "生病那晚的照顾和陪伴",
        xu_rent_chores: "一起租房后的家务分配",
        xu_family_table: "见家长与未来规划"
      }
    }
  };

  function buildArcMeta(definition) {
    const override = ARC_OVERRIDES[definition.id] || {};
    return {
      characterId: definition.id,
      arcId: override.arcId || definition.id,
      title: override.title || definition.name + "线",
      summary: override.summary || buildBaseSummary(definition),
      stageFocus: toList(definition.stageTags),
      exclusiveEvents: toList(override.exclusiveEvents),
      historyLabels: override.historyLabels && typeof override.historyLabels === "object" ? { ...override.historyLabels } : {},
      routeHint: buildBaseTitle(definition)
    };
  }

  const DEFINITIONS = Array.isArray(window.LIFE_RELATIONSHIPS) ? window.LIFE_RELATIONSHIPS : [];
  const ARC_META = DEFINITIONS.map(buildArcMeta);

  const EXCLUSIVE_EVENTS = [
    event({
      id: "song_qinghe_duty_roster",
      stage: "adolescence",
      title: "和宋清禾一起值日的那段时间，关系开始有了日常感",
      text: "班里总有人在放学铃一响就往外冲，可你和宋清禾因为值日表被固定留下。扫地、擦黑板、把试卷按学号排好，再一起从晚风里走去校门口，这些很小的重复开始让你们有了只属于彼此的日常。",
      minAge: 13,
      maxAge: 15,
      weight: 4,
      tags: ["romance", "exclusive", "campus"],
      conditions: focusConditions("song_qinghe", {
        activeRelationshipStatuses: ["noticed", "crush", "familiar", "close"],
        activeRelationshipMinFamiliarity: 6,
        activeRelationshipExcludedSharedHistory: ["song_duty_roster"]
      }),
      choices: [
        choice({
          text: "故意把值日做慢一点，顺便陪她一起走到公交站。",
          effects: { stats: { happiness: 3, social: 2 } },
          relationshipEffects: [
            effectFor("song_qinghe", {
              affection: 10,
              familiarity: 12,
              trust: 8,
              playerInterest: 6,
              theirInterest: 8,
              continuity: 10,
              interactions: 1,
              status: "close",
              addSharedHistory: ["song_duty_roster"],
              history: "你们开始在值日和放学路上有了固定同行，这种安静的陪伴很快让关系变得不一样。"
            })
          ],
          log: "你和宋清禾之间最早的靠近，不是轰烈场面，而是很多次放学后没人打扰的小段路。"
        }),
        choice({
          text: "借着传作业和讲题，把那点在意藏进很自然的互动里。",
          effects: { stats: { intelligence: 1, happiness: 2 } },
          relationshipEffects: [
            effectFor("song_qinghe", {
              affection: 8,
              familiarity: 10,
              ambiguity: 8,
              playerInterest: 6,
              continuity: 8,
              interactions: 1,
              status: "familiar",
              addSharedHistory: ["song_duty_roster"],
              history: "你没有急着把心意说满，只是让作业本和便签纸替你们多来回了几次。"
            })
          ],
          log: "有些初中的心动，就是靠卷子边角和放学前的几句小话一点点长出来的。"
        }),
        choice({
          text: "怕被班里起哄，还是把距离收在普通同学的位置。",
          effects: { stats: { discipline: 1, happiness: -1 } },
          relationshipEffects: [
            effectFor("song_qinghe", {
              affection: -2,
              familiarity: 6,
              continuity: 4,
              tension: 2,
              status: "familiar",
              addSharedHistory: ["song_duty_roster"],
              history: "你们还是熟了起来，但你明显把很多可能继续往前走的动作都往回收了收。"
            })
          ],
          log: "你不是不想靠近，只是太清楚青春期的公开目光有多让人难受。"
        })
      ]
    }),
    event({
      id: "song_qinghe_library_walk",
      stage: "highschool",
      title: "高三图书馆和便利店之间，那点喜欢变得越来越藏不住",
      text: "到了高中，关系不再只靠同桌和座位维持。你和宋清禾会在图书馆占同一排自习位，会在晚自习后顺路去便利店买牛奶和笔芯，也会在某些很累的晚上突然觉得，真正能让自己松一口气的人，已经不是谁都可以。",
      minAge: 16,
      maxAge: 18,
      weight: 4,
      tags: ["romance", "exclusive", "highschool"],
      conditions: focusConditions("song_qinghe", {
        activeRelationshipStatuses: ["familiar", "close", "mutual_crush", "ambiguous"],
        activeRelationshipMinAffection: 18,
        activeRelationshipRequiredSharedHistory: ["song_duty_roster"],
        activeRelationshipExcludedSharedHistory: ["song_library_walk"]
      }),
      choices: [
        choice({
          text: "继续陪她走这一段路，也在考试压力里认真接住彼此。",
          effects: { stats: { happiness: 4, mental: 2, stress: -1 } },
          addRomanceFlags: ["relationship_maintained"],
          relationshipEffects: [
            effectFor("song_qinghe", {
              affection: 12,
              trust: 10,
              familiarity: 10,
              playerInterest: 8,
              theirInterest: 8,
              continuity: 10,
              status: "mutual_crush",
              addSharedHistory: ["song_library_walk"],
              history: "你们在图书馆和回家路上留下了很多安静但很有重量的时刻，关系也真正有了双向感。"
            })
          ],
          log: "对宋清禾这条线来说，很多升温都发生在高压里彼此稳住对方的那些细节里。"
        }),
        choice({
          text: "试探着说一点以后想去哪里，也想看看她会不会把你放进未来。",
          effects: { stats: { intelligence: 2, happiness: 2 } },
          relationshipEffects: [
            effectFor("song_qinghe", {
              affection: 10,
              trust: 8,
              ambiguity: 10,
              playerInterest: 8,
              theirInterest: 10,
              continuity: 8,
              status: "ambiguous",
              addSharedHistory: ["song_library_walk"],
              history: "你们开始聊未来和城市，关系也从普通陪伴慢慢长成了有一点暧昧重量的期待。"
            })
          ],
          log: "有些喜欢不是先说爱，而是先问一句以后想去哪。"
        }),
        choice({
          text: "因为不想影响成绩，故意让联系降回安全频率。",
          effects: { stats: { intelligence: 2, happiness: -2, stress: 1 } },
          addFlags: ["career_first"],
          addRomanceFlags: ["romance_held_back"],
          relationshipEffects: [
            effectFor("song_qinghe", {
              affection: -6,
              trust: -4,
              continuity: -3,
              tension: 6,
              status: "familiar",
              addSharedHistory: ["song_library_walk"],
              history: "你主动让这段关系退回了更克制的位置，心动没有消失，只是被你压回了安排表后面。"
            })
          ],
          log: "你把现实放到了前面，这种选择往往不会立刻结束关系，却会改写后面很多可能性。"
        })
      ]
    }),
    event({
      id: "song_qinghe_letter_gap",
      stage: "college",
      title: "上大学以后，你们要不要继续把彼此留在生活里",
      text: "真正离开校园以后，关系会突然失去很多天然的见面机会。宋清禾会把看过的书和摘抄发给你，你也会想起以前那些放学后的路。问题开始变得很现实：你们要不要认真维系，还是让它自然淡掉。",
      minAge: 18,
      maxAge: 24,
      weight: 4,
      tags: ["romance", "exclusive", "college"],
      conditions: focusConditions("song_qinghe", {
        activeRelationshipStatuses: ["mutual_crush", "ambiguous", "dating", "short_dating", "close"],
        activeRelationshipMinAffection: 24,
        activeRelationshipRequiredSharedHistory: ["song_library_walk"],
        activeRelationshipExcludedSharedHistory: ["song_letter_gap"]
      }),
      choices: [
        choice({
          text: "认真回信、见面、分享近况，让这段关系继续往长线里长。",
          effects: { stats: { happiness: 4, social: 2, mental: 2 } },
          addRomanceFlags: ["relationship_maintained"],
          relationshipEffects: [
            effectFor("song_qinghe", {
              affection: 12,
              trust: 12,
              commitment: 14,
              continuity: 14,
              interactions: 1,
              status: "dating",
              addSharedHistory: ["song_letter_gap"],
              history: "你们没有让距离把关系冲散，而是把联系认真维持成了生活的一部分。"
            })
          ],
          log: "宋清禾这条线会明显受‘你愿不愿意持续经营’影响，关系不会因为早期心动就自动留下。"
        }),
        choice({
          text: "偶尔联系，但谁都不敢真的问一句要不要继续往下走。",
          effects: { stats: { happiness: 1, stress: 1 } },
          relationshipEffects: [
            effectFor("song_qinghe", {
              affection: -2,
              ambiguity: 10,
              commitment: -2,
              continuity: 6,
              status: "ambiguous",
              addSharedHistory: ["song_letter_gap"],
              history: "你们保持着若有若无的联系，关系既没断，也没有真正往更稳的方向走。"
            })
          ],
          log: "这段关系开始进入一种很容易拖成遗憾的状态。"
        }),
        choice({
          text: "承认彼此的生活已经分得太开，让关系停在好看的回忆里。",
          effects: { stats: { happiness: -1, mental: 1 } },
          addFlags: ["missed_love"],
          relationshipEffects: [
            effectFor("song_qinghe", {
              affection: -10,
              trust: -4,
              commitment: -10,
              continuity: -4,
              status: "estranged",
              addSharedHistory: ["song_letter_gap"],
              history: "你们没有闹得难看，只是承认了这段关系最后还是停在了年轻时最好的那一截。"
            })
          ],
          log: "有些安静陪伴型关系的遗憾，往往不是吵散的，而是慢慢淡开的。"
        })
      ]
    }),
    event({
      id: "song_qinghe_bookstore_reunion",
      stage: "family",
      title: "很多年后，你在一家旧书店里又看见了宋清禾",
      text: "到了工作后的某一年，你们在一家不大的旧书店重新碰见。不是偶像剧式的冲击，而是那种一抬头就会立刻想起以前图书馆灯光和放学路风声的重逢。你突然明白，某些关系确实会在很多年后回来问你一次：现在呢？",
      minAge: 27,
      maxAge: 35,
      weight: 3,
      tags: ["romance", "exclusive", "reunion"],
      conditions: focusConditions("song_qinghe", {
        activeRelationshipStatuses: ["estranged", "broken", "missed"],
        activeRelationshipRequiredSharedHistory: ["song_library_walk"],
        activeRelationshipExcludedSharedHistory: ["song_bookstore_reunion"],
        noCurrentPartner: true
      }),
      choices: [
        choice({
          text: "重新约她出来，承认自己并没有真的把这段关系放下。",
          effects: { stats: { happiness: 5, mental: 3, social: 2 } },
          addRomanceFlags: ["relationship_rebuilt"],
          relationshipEffects: [
            effectFor("song_qinghe", {
              affection: 14,
              trust: 12,
              tension: -8,
              commitment: 16,
              continuity: 16,
              status: "reconnected",
              addSharedHistory: ["song_bookstore_reunion"],
              history: "你们没有把重逢只留在寒暄里，而是很认真地把旧关系重新捡了起来。"
            })
          ],
          log: "这条线真正珍贵的不是重逢本身，而是你们有没有长出足够成熟的处理方式。"
        }),
        choice({
          text: "聊完近况就好，把那些没走下去的部分留在心里。",
          effects: { stats: { happiness: 1, mental: 2 } },
          relationshipEffects: [
            effectFor("song_qinghe", {
              affection: 2,
              continuity: 4,
              status: "missed",
              addSharedHistory: ["song_bookstore_reunion"],
              history: "你们终于把以前那段关系温柔地放回了记忆里，没有再试着把它拉进现在。"
            })
          ],
          log: "不是每次重逢都必须重启，有时它只是让人终于能更平静地告别。"
        }),
        choice({
          text: "你意识到自己还是更怕重来以后再失去，于是选择不继续。",
          effects: { stats: { happiness: -1, discipline: 1 } },
          addFlags: ["emotionally_guarded"],
          relationshipEffects: [
            effectFor("song_qinghe", {
              affection: -4,
              tension: 2,
              status: "missed",
              addSharedHistory: ["song_bookstore_reunion"],
              history: "你们重新见到了彼此，可你还是没有让这段关系再往现实里走一步。"
            })
          ],
          log: "安静型关系的遗憾，很多时候不是不爱，而是太怕那种旧伤再来一次。"
        })
      ]
    }),

    event({
      id: "jiang_xun_court_sideline",
      stage: "adolescence",
      title: "你开始在放学后的球场边等江循散场",
      text: "江循很少安安静静出现。他通常带着球鞋声、起哄声和一群人，可真正让你们熟起来的，反而是球场散场以后那几分钟。你递水、帮他拿校服外套、一起往校门口走，关系就在这种很具体的陪伴里突然有了偏向。",
      minAge: 13,
      maxAge: 15,
      weight: 4,
      tags: ["romance", "exclusive", "campus"],
      conditions: focusConditions("jiang_xun", {
        activeRelationshipStatuses: ["noticed", "crush", "familiar", "close"],
        activeRelationshipMinFamiliarity: 6,
        activeRelationshipExcludedSharedHistory: ["jiang_sideline"]
      }),
      choices: [
        choice({
          text: "大方去等他散场，让他知道你不是路过。",
          effects: { stats: { happiness: 4, social: 3 } },
          relationshipEffects: [
            effectFor("jiang_xun", {
              affection: 12,
              familiarity: 10,
              trust: 6,
              playerInterest: 8,
              theirInterest: 10,
              continuity: 10,
              status: "mutual_crush",
              addSharedHistory: ["jiang_sideline"],
              history: "你没有把对江循的在意藏得太深，那种直接回应也很快被他接住了。"
            })
          ],
          log: "江循这条线更吃明确回应和并肩出现，太含糊反而容易错过。"
        }),
        choice({
          text: "还是只在朋友堆里和他说笑，不单独把关系挑出来。",
          effects: { stats: { social: 2, happiness: 1 } },
          relationshipEffects: [
            effectFor("jiang_xun", {
              affection: 8,
              familiarity: 8,
              ambiguity: 8,
              continuity: 8,
              status: "close",
              addSharedHistory: ["jiang_sideline"],
              history: "你们在人群里越来越熟，可谁都还没把关系从‘大家都看得出来一点’推进到更明确的位置。"
            })
          ],
          log: "这条线很容易在热闹和起哄里升温，也很容易被热闹本身冲散。"
        }),
        choice({
          text: "怕被盯着看，宁愿别让自己显得太明显。",
          effects: { stats: { happiness: -2, stress: 1 } },
          relationshipEffects: [
            effectFor("jiang_xun", {
              affection: -4,
              theirInterest: -4,
              continuity: 4,
              status: "familiar",
              addSharedHistory: ["jiang_sideline"],
              history: "你把很多主动都往回收了些，江循也很快感觉到你并不想把关系推进得太明显。"
            })
          ],
          log: "对江循这种更直接的人来说，退一步通常会被很快感知到。"
        })
      ]
    }),
    event({
      id: "jiang_xun_sports_day_heat",
      stage: "highschool",
      title: "运动会那天，你和江循之间的暧昧被所有人都看见了",
      text: "运动会原本就很容易把情绪放大。你给江循递毛巾、替他拿包、在他跑完以后第一时间去找他说话，这些动作被周围人看得太清楚，连他自己都不再能轻松装作什么都没有。",
      minAge: 15,
      maxAge: 17,
      weight: 4,
      tags: ["romance", "exclusive", "highschool"],
      conditions: focusConditions("jiang_xun", {
        activeRelationshipStatuses: ["close", "mutual_crush", "ambiguous"],
        activeRelationshipMinAffection: 20,
        activeRelationshipRequiredSharedHistory: ["jiang_sideline"],
        activeRelationshipExcludedSharedHistory: ["jiang_sports_day"]
      }),
      choices: [
        choice({
          text: "顺着这股热度说清楚，你并不想只是被大家起哄。",
          effects: { stats: { happiness: 5, social: 3 } },
          addRomanceFlags: ["confessed_feelings"],
          relationshipEffects: [
            effectFor("jiang_xun", {
              affection: 12,
              trust: 8,
              ambiguity: -10,
              commitment: 16,
              continuity: 10,
              status: "dating",
              addSharedHistory: ["jiang_sports_day"],
              history: "你没有让运动会那天的热度只停在起哄里，而是顺势把关系真正往前推了一步。"
            })
          ],
          log: "江循线的很多关键节点都发生在节奏很快、情绪很亮的场合里。"
        }),
        choice({
          text: "继续用玩笑和打岔顶过去，谁也不先承认。",
          effects: { stats: { happiness: 2, stress: 1 } },
          relationshipEffects: [
            effectFor("jiang_xun", {
              affection: 6,
              ambiguity: 12,
              theirInterest: 8,
              continuity: 8,
              status: "ambiguous",
              addSharedHistory: ["jiang_sports_day"],
              history: "你们都知道有什么不一样了，可还是把很多话包在了笑声和玩笑里。"
            })
          ],
          log: "这条线很容易停在高热度暧昧里，不推进就会开始互相猜。"
        }),
        choice({
          text: "你嫌起哄太烦，索性让自己淡下去一点。",
          effects: { stats: { happiness: -3, stress: 2, discipline: 1 } },
          relationshipEffects: [
            effectFor("jiang_xun", {
              affection: -8,
              trust: -4,
              tension: 8,
              status: "cooling",
              addSharedHistory: ["jiang_sports_day"],
              history: "你开始主动降温，而江循很难把这种后退当作什么都没发生。"
            })
          ],
          log: "对外放型关系来说，突然冷下来往往比明确拒绝还更伤。"
        })
      ]
    }),
    event({
      id: "jiang_xun_pride_collision",
      stage: "college",
      title: "上大学后，你和江循开始因为节奏、自尊和回应方式硬碰硬",
      text: "离开高中以后，你们对关系的期待终于不再同步。江循很在意你是不是愿意把他放进优先级，你却也有自己的学业、圈子和节奏。问题不是谁不喜欢了，而是谁都越来越不想先示弱。",
      minAge: 18,
      maxAge: 23,
      weight: 4,
      tags: ["romance", "exclusive", "college"],
      conditions: focusConditions("jiang_xun", {
        activeRelationshipStatuses: ["dating", "passionate", "cooling", "ambiguous"],
        activeRelationshipMinCommitment: 10,
        activeRelationshipRequiredSharedHistory: ["jiang_sports_day"],
        activeRelationshipExcludedSharedHistory: ["jiang_pride_collision"]
      }),
      choices: [
        choice({
          text: "直接谈清楚你们各自需要什么，不拿冷处理当试探。",
          effects: { stats: { social: 3, mental: 2, happiness: 1 } },
          addRomanceFlags: ["relationship_rebuilt"],
          relationshipEffects: [
            effectFor("jiang_xun", {
              affection: 8,
              trust: 10,
              tension: -12,
              commitment: 10,
              continuity: 8,
              status: "reconnected",
              addSharedHistory: ["jiang_pride_collision"],
              history: "你们终于没再拿赌气代替沟通，关系也因此有了继续长下去的空间。"
            })
          ],
          log: "江循这条线如果想走长，最大的关卡通常不是心动不够，而是能不能及时把话说开。"
        }),
        choice({
          text: "谁都不愿意先低头，让关系在拉扯里越来越伤。",
          effects: { stats: { happiness: -4, mental: -2, stress: 2 } },
          addRomanceFlags: ["relationship_neglected"],
          relationshipEffects: [
            effectFor("jiang_xun", {
              affection: -12,
              trust: -8,
              tension: 18,
              commitment: -10,
              status: "conflict",
              addSharedHistory: ["jiang_pride_collision"],
              history: "你们谁都还有感情，可长期赌气和试探还是把关系一点点推到了很伤的位置。"
            })
          ],
          log: "热烈型关系最怕的不是冲突，而是把冲突处理成输赢。"
        }),
        choice({
          text: "承认你们都太累了，及时把这段关系停下来。",
          effects: { stats: { happiness: -2, mental: 1 } },
          addFlags: ["missed_love"],
          relationshipEffects: [
            effectFor("jiang_xun", {
              affection: -16,
              trust: -10,
              commitment: -16,
              continuity: -6,
              status: "broken",
              clearActive: true,
              addSharedHistory: ["jiang_pride_collision"],
              history: "你们没有继续把喜欢熬成更大的伤害，而是在关系最伤之前停了下来。"
            })
          ],
          log: "江循线的分开通常不是没爱过，而是双方都太像在对抗里保护自己。"
        })
      ]
    }),
    event({
      id: "jiang_xun_midnight_pickup",
      stage: "young_adult",
      title: "某个很晚的夜里，江循又重新出现在你最狼狈的时候",
      text: "工作后的某一年，你加班到很晚、情绪也烂得彻底。江循不知道从哪里知道了你在附近，开着车或骑着电动车来接你。你突然发现，你们之间最难放下的部分，从来不是热闹，而是那种有人会真的来接你的感觉。",
      minAge: 24,
      maxAge: 31,
      weight: 3,
      tags: ["romance", "exclusive", "young_adult"],
      conditions: focusConditions("jiang_xun", {
        activeRelationshipStatuses: ["broken", "estranged", "conflict", "cooling"],
        minStats: { stress: 38 },
        activeRelationshipRequiredSharedHistory: ["jiang_pride_collision"],
        activeRelationshipExcludedSharedHistory: ["jiang_midnight_pickup"],
        noCurrentPartner: true
      }),
      choices: [
        choice({
          text: "上车，也认真承认自己其实一直很想念这种被直接接住的感觉。",
          effects: { stats: { happiness: 5, mental: 3, stress: -2 } },
          addRomanceFlags: ["relationship_rebuilt"],
          relationshipEffects: [
            effectFor("jiang_xun", {
              affection: 12,
              trust: 12,
              tension: -10,
              commitment: 12,
              continuity: 14,
              status: "reconnected",
              addSharedHistory: ["jiang_midnight_pickup"],
              history: "你没有把那次深夜接送处理成寒暄，而是承认了这段关系仍然在你心里有很重的位置。"
            })
          ],
          log: "江循线的重逢更像‘还是会在关键时刻出现’，而不是慢慢恢复的平静版本。"
        }),
        choice({
          text: "谢谢他送你回去，但你不想再把过去重新点亮。",
          effects: { stats: { mental: 2 } },
          relationshipEffects: [
            effectFor("jiang_xun", {
              affection: 2,
              continuity: 4,
              status: "estranged",
              addSharedHistory: ["jiang_midnight_pickup"],
              history: "你们重新有了接触，但你很清楚自己不想让过去那种高强度关系再回来。"
            })
          ],
          log: "有些重逢更像确认：彼此都重要，但未必要再在一起。"
        }),
        choice({
          text: "你怕自己一回头又会掉回旧的相处模式，于是还是保持距离。",
          effects: { stats: { happiness: -1, discipline: 1 } },
          addFlags: ["emotionally_guarded"],
          relationshipEffects: [
            effectFor("jiang_xun", {
              affection: -4,
              tension: 4,
              status: "missed",
              addSharedHistory: ["jiang_midnight_pickup"],
              history: "你很清楚自己还会被江循打动，可还是没有选择让这段关系重新走回现实里。"
            })
          ],
          log: "这条线的遗憾很多时候不是没机会，而是太清楚重来会有多大代价。"
        })
      ]
    }),

    event({
      id: "fang_ke_deskmate_errand",
      stage: "adolescence",
      title: "你和方可做同桌以后，很多默契是在作业本之间长出来的",
      text: "方可不是那种一眼就热起来的人。你们真正熟，是从她借你红笔、你替她带练习册、放学前顺手帮她把值日表誊一份开始。很多关系在初中是靠表白点亮的，你们更像是靠长期同桌一点点把默契堆了起来。",
      minAge: 13,
      maxAge: 15,
      weight: 4,
      tags: ["romance", "exclusive", "campus"],
      conditions: focusConditions("fang_ke", {
        activeRelationshipStatuses: ["noticed", "familiar", "crush", "close"],
        activeRelationshipExcludedSharedHistory: ["fang_deskmate"]
      }),
      choices: [
        choice({
          text: "继续在小事上互相照应，让这份默契慢慢加深。",
          effects: { stats: { intelligence: 2, happiness: 2 } },
          relationshipEffects: [
            effectFor("fang_ke", {
              affection: 10,
              familiarity: 14,
              trust: 10,
              continuity: 10,
              interactions: 1,
              status: "close",
              addSharedHistory: ["fang_deskmate"],
              history: "你们在同桌和作业的小事里越来越习惯彼此，关系也在不知不觉中变得很稳。"
            })
          ],
          log: "方可线的靠近不会一下子很亮，但会在长期并肩里长得很深。"
        }),
        choice({
          text: "用做题和帮忙当借口，把在意藏得严严实实。",
          effects: { stats: { intelligence: 2, happiness: 1 } },
          relationshipEffects: [
            effectFor("fang_ke", {
              affection: 8,
              familiarity: 12,
              ambiguity: 4,
              playerInterest: 6,
              continuity: 8,
              status: "familiar",
              addSharedHistory: ["fang_deskmate"],
              history: "你把很多心思都藏进了看似普通的互相帮忙里，关系因此带上一点说不清的意味。"
            })
          ],
          log: "慢热型关系最容易出现的不是大动作，而是‘你们也太习惯照应彼此了吧’这种旁观感。"
        }),
        choice({
          text: "怕自己太陷进去，故意别把这种同桌默契发展得太特别。",
          effects: { stats: { discipline: 1, happiness: -1 } },
          relationshipEffects: [
            effectFor("fang_ke", {
              affection: -2,
              continuity: 4,
              status: "familiar",
              addSharedHistory: ["fang_deskmate"],
              history: "你还是和方可形成了稳定相处，但明显把很多会让关系变特别的动作往回按住了。"
            })
          ],
          log: "这条线的很多错过，往往都和‘太自然了所以不敢多想’有关。"
        })
      ]
    }),
    event({
      id: "fang_ke_weekend_problem_set",
      stage: "highschool",
      title: "周末补课时，只有你和方可会一起把压轴题做到讲台熄灯以后",
      text: "你们开始一起去补课、交换错题本、在周末把一道题拆开反复讲。方可嘴上不算软，但会默默记得你哪一科最近状态差，也会在你考砸以后把她整理好的题单推过来。这种关系很少轰烈，却越来越难被忽略。",
      minAge: 15,
      maxAge: 18,
      weight: 4,
      tags: ["romance", "exclusive", "highschool"],
      conditions: focusConditions("fang_ke", {
        activeRelationshipStatuses: ["familiar", "close", "mutual_crush", "ambiguous"],
        activeRelationshipMinFamiliarity: 18,
        activeRelationshipRequiredSharedHistory: ["fang_deskmate"],
        activeRelationshipExcludedSharedHistory: ["fang_problem_set"]
      }),
      choices: [
        choice({
          text: "继续并肩学下去，也在这种长期互相托底里承认自己越来越离不开她。",
          effects: { stats: { intelligence: 3, happiness: 3, stress: -1 } },
          relationshipEffects: [
            effectFor("fang_ke", {
              affection: 12,
              trust: 12,
              playerInterest: 8,
              theirInterest: 8,
              continuity: 10,
              status: "mutual_crush",
              addSharedHistory: ["fang_problem_set"],
              history: "你们在补课和刷题里越来越像对方默认会一起出现的人，关系也慢慢走到了双向好感。"
            })
          ],
          log: "方可线很吃‘一起扛压力’这类具体经历，它会直接把关系推深。"
        }),
        choice({
          text: "试着把做题之外的话题也打开，让相处别只剩学习。",
          effects: { stats: { happiness: 2, social: 2 } },
          relationshipEffects: [
            effectFor("fang_ke", {
              affection: 10,
              trust: 8,
              ambiguity: 8,
              continuity: 8,
              status: "ambiguous",
              addSharedHistory: ["fang_problem_set"],
              history: "你开始主动让你们的关系从题目和成绩往生活本身延伸，方可也慢慢接住了这一步。"
            })
          ],
          log: "这条线真正的升温，通常发生在你们开始不只讨论题，而开始讨论彼此的时候。"
        }),
        choice({
          text: "把很多依赖感压回去，提醒自己别让关系干扰升学。",
          effects: { stats: { intelligence: 2, happiness: -2 } },
          addFlags: ["career_first"],
          relationshipEffects: [
            effectFor("fang_ke", {
              affection: -5,
              trust: -4,
              continuity: 4,
              status: "close",
              addSharedHistory: ["fang_problem_set"],
              history: "你没有完全疏远方可，但也明显把关系往更功能性的方向收了收。"
            })
          ],
          log: "慢热型关系一旦被现实压住，不会立刻爆炸，却很容易一路拖成遗憾。"
        })
      ]
    }),
    event({
      id: "fang_ke_split_after_results",
      stage: "college",
      title: "升学结果出来以后，你和方可第一次被现实路线分开",
      text: "高考分流不像吵架那样明显，却会把很多关系一下子拆开。你和方可开始分属不同城市、不同课程表、不同日常。曾经那些一起做题做到天黑的周末，还能不能继续转成成年后的联系，突然变成了一个现实问题。",
      minAge: 18,
      maxAge: 23,
      weight: 4,
      tags: ["romance", "exclusive", "college"],
      conditions: focusConditions("fang_ke", {
        activeRelationshipStatuses: ["mutual_crush", "ambiguous", "dating", "close"],
        activeRelationshipRequiredSharedHistory: ["fang_problem_set"],
        activeRelationshipExcludedSharedHistory: ["fang_split_results"]
      }),
      choices: [
        choice({
          text: "主动保持固定联系，不让这段多年陪伴只留在校园里。",
          effects: { stats: { happiness: 3, social: 2, mental: 1 } },
          addRomanceFlags: ["relationship_maintained"],
          relationshipEffects: [
            effectFor("fang_ke", {
              affection: 12,
              trust: 12,
              commitment: 10,
              continuity: 14,
              status: "dating",
              addSharedHistory: ["fang_split_results"],
              history: "你没有让不同城市把多年形成的默契断掉，而是很认真地把联系维持成了成年关系的开始。"
            })
          ],
          log: "方可线非常依赖连续性，愿不愿意持续联系会直接决定它后面往哪边走。"
        }),
        choice({
          text: "联系越来越像礼貌问候，谁也不先承认那种失落。",
          effects: { stats: { happiness: -1, mental: -1 } },
          relationshipEffects: [
            effectFor("fang_ke", {
              affection: -6,
              trust: -4,
              commitment: -4,
              continuity: 6,
              status: "estranged",
              addSharedHistory: ["fang_split_results"],
              history: "你们谁都没有真的闹开，可日常一散，关系还是慢慢退回了一个不再能自然续上的位置。"
            })
          ],
          log: "慢热关系最大的敌人之一，就是分开以后没人主动把连续性重新搭起来。"
        }),
        choice({
          text: "趁还没彻底散掉，认真问一次你们到底要不要继续往未来里走。",
          effects: { stats: { happiness: 4, social: 2, stress: 1 } },
          addRomanceFlags: ["confessed_feelings"],
          relationshipEffects: [
            effectFor("fang_ke", {
              affection: 10,
              trust: 8,
              commitment: 14,
              continuity: 10,
              status: "dating",
              addSharedHistory: ["fang_split_results"],
              history: "你终于在离开校园后认真问了一次：多年并肩是不是能变成真正的以后。"
            })
          ],
          log: "这条线真正动人的地方，往往在于那些很晚才说出口、但一旦说出口就很重的话。"
        })
      ]
    }),
    event({
      id: "fang_ke_rain_station_reunion",
      stage: "family",
      title: "很多年后，你在一个下雨的车站又遇见了方可",
      text: "成年后的重逢总是更安静。方可站在车站檐下，手里还拿着文件袋和雨伞，和学生时代一样不太爱把情绪全写在脸上。可你还是很快意识到，自己最熟悉的那种安心感，原来一直没有完全消失。",
      minAge: 26,
      maxAge: 33,
      weight: 3,
      tags: ["romance", "exclusive", "reunion"],
      conditions: focusConditions("fang_ke", {
        activeRelationshipStatuses: ["estranged", "broken", "missed"],
        activeRelationshipRequiredSharedHistory: ["fang_problem_set"],
        activeRelationshipExcludedSharedHistory: ["fang_rain_station"],
        noCurrentPartner: true
      }),
      choices: [
        choice({
          text: "约她再见一次，把这些年没谈完的事重新补上。",
          effects: { stats: { happiness: 4, mental: 3, social: 2 } },
          addRomanceFlags: ["relationship_rebuilt"],
          relationshipEffects: [
            effectFor("fang_ke", {
              affection: 12,
              trust: 12,
              continuity: 14,
              commitment: 12,
              tension: -8,
              status: "reconnected",
              addSharedHistory: ["fang_rain_station"],
              history: "你们没有让那次雨夜重逢只停在寒暄里，而是认真决定把过去留下的线重新接上。"
            })
          ],
          log: "方可线的重逢更像把多年没断的底层默契重新点亮。"
        }),
        choice({
          text: "只是交换近况，承认有些关系最好的部分确实留在了以前。",
          effects: { stats: { mental: 2 } },
          relationshipEffects: [
            effectFor("fang_ke", {
              affection: 2,
              continuity: 4,
              status: "missed",
              addSharedHistory: ["fang_rain_station"],
              history: "你们终于把那段多年前没走完的关系放回了一个更平静的位置。"
            })
          ],
          log: "并不是所有后劲都要导向复合，有些只是让人更稳地放下。"
        }),
        choice({
          text: "你怕把旧关系重新翻出来以后又要面对新的分流，于是还是不继续。",
          effects: { stats: { happiness: -1, discipline: 1 } },
          addFlags: ["emotionally_guarded"],
          relationshipEffects: [
            effectFor("fang_ke", {
              affection: -4,
              status: "missed",
              addSharedHistory: ["fang_rain_station"],
              history: "你承认自己还是会被方可打动，但也承认自己没有准备好再走一次那种慢热又很深的路。"
            })
          ],
          log: "这条线的遗憾感通常来自‘明明知道可能合适，却还是没继续’。"
        })
      ]
    }),

    event({
      id: "he_yuan_transfer_seat",
      stage: "highschool",
      title: "何沅刚转来那阵，你成了她最先熟起来的人之一",
      text: "何沅转进来的时候，很多人都只看见她的清醒和距离感。真正让你们熟起来的是帮她抄课表、带她认自习室和在晚自习前后一起对齐作业节奏。她不会一下子热起来，但会很快记住谁真的靠谱。",
      minAge: 16,
      maxAge: 17,
      weight: 4,
      tags: ["romance", "exclusive", "highschool"],
      conditions: focusConditions("he_yuan", {
        activeRelationshipStatuses: ["noticed", "familiar", "crush", "close"],
        activeRelationshipExcludedSharedHistory: ["he_transfer_seat"]
      }),
      choices: [
        choice({
          text: "认真带她熟悉环境，也在细节里让她知道你很稳。",
          effects: { stats: { social: 2, intelligence: 2 } },
          relationshipEffects: [
            effectFor("he_yuan", {
              affection: 10,
              familiarity: 12,
              trust: 10,
              continuity: 10,
              status: "close",
              addSharedHistory: ["he_transfer_seat"],
              history: "你在何沅刚转来的那段时间里给了她很具体的照应，这让她很快把你归进了可靠的人。"
            })
          ],
          log: "何沅线更吃清晰、靠谱和长期可预期，不太吃轻飘飘的热情。"
        }),
        choice({
          text: "多和她聊志愿、题目和未来，看看这份靠近会不会慢慢超出普通同学。",
          effects: { stats: { intelligence: 2, happiness: 1 } },
          relationshipEffects: [
            effectFor("he_yuan", {
              affection: 8,
              trust: 8,
              playerInterest: 6,
              theirInterest: 6,
              continuity: 8,
              status: "familiar",
              addSharedHistory: ["he_transfer_seat"],
              history: "你们一开始是从题目、志愿和节奏聊起的，关系却很快开始带上一点超出普通同学的意味。"
            })
          ],
          log: "这条线的早期吸引往往发生在彼此很认真的场景里。"
        }),
        choice({
          text: "保持礼貌帮助，但不想把关系靠得太近。",
          effects: { stats: { discipline: 1 } },
          relationshipEffects: [
            effectFor("he_yuan", {
              affection: 2,
              familiarity: 8,
              continuity: 6,
              status: "familiar",
              addSharedHistory: ["he_transfer_seat"],
              history: "你们顺利熟了起来，但你也明显没有让关系往更个人的方向靠。"
            })
          ],
          log: "清醒型角色不会因为一两次好意就自动升温，关系进度和你的主动程度强相关。"
        })
      ]
    }),
    event({
      id: "he_yuan_mock_exam_strategy",
      stage: "highschool",
      title: "模考和志愿压力把你和何沅的关系推到了更真实的位置",
      text: "高三后半段，你和何沅会一起对答案、交换志愿想法、在晚自习后绕操场走一圈再各自回宿舍。她不是会轻易示弱的人，所以一旦开始和你谈真正的不安，其实已经代表你在她心里很不一样了。",
      minAge: 17,
      maxAge: 18,
      weight: 4,
      tags: ["romance", "exclusive", "highschool"],
      conditions: focusConditions("he_yuan", {
        activeRelationshipStatuses: ["familiar", "close", "mutual_crush", "ambiguous"],
        activeRelationshipRequiredSharedHistory: ["he_transfer_seat"],
        activeRelationshipMinTrust: 12,
        activeRelationshipExcludedSharedHistory: ["he_mock_exam"]
      }),
      choices: [
        choice({
          text: "继续做她最信得过的晚自习搭子，也把关系慢慢往双向好感推进。",
          effects: { stats: { intelligence: 3, happiness: 2, stress: -1 } },
          relationshipEffects: [
            effectFor("he_yuan", {
              affection: 12,
              trust: 12,
              theirInterest: 10,
              playerInterest: 8,
              continuity: 8,
              status: "mutual_crush",
              addSharedHistory: ["he_mock_exam"],
              history: "你成了何沅真正会在高压阶段依赖和信任的人，关系也因此第一次有了明确的双向感。"
            })
          ],
          log: "何沅线的升温常常来自一起处理现实问题，而不是纯情绪堆叠。"
        }),
        choice({
          text: "借聊志愿和城市的机会，试探她有没有把你放进未来想象。",
          effects: { stats: { intelligence: 2, happiness: 2 } },
          relationshipEffects: [
            effectFor("he_yuan", {
              affection: 10,
              trust: 8,
              ambiguity: 10,
              continuity: 8,
              status: "ambiguous",
              addSharedHistory: ["he_mock_exam"],
              history: "你们开始谈城市和以后，关系也因此从可靠搭子变成了带一点试探和期待的暧昧。"
            })
          ],
          log: "对何沅这类角色来说，‘以后去哪’本身就是情感试探的一部分。"
        }),
        choice({
          text: "提醒自己先别被感情牵着走，把很多话都留到高考以后。",
          effects: { stats: { intelligence: 2, discipline: 1, happiness: -1 } },
          addFlags: ["career_first"],
          relationshipEffects: [
            effectFor("he_yuan", {
              affection: -4,
              trust: -2,
              continuity: 4,
              status: "close",
              addSharedHistory: ["he_mock_exam"],
              history: "你刻意把关系留在更克制的位置，希望别让喜欢太早打乱高考和去向。"
            })
          ],
          log: "何沅线很容易被现实优先级重新排序，而不是直接被情绪冲垮。"
        })
      ]
    }),
    event({
      id: "he_yuan_offer_city_choice",
      stage: "young_adult",
      title: "工作机会和城市选择，开始逼你们回答这段关系值不值得被写进现实",
      text: "真正成年以后，何沅不会只问感情够不够。她会问城市、行业、节奏、家庭、未来规划值不值得一起承担。你们终于走到那个节点：不是喜不喜欢，而是有没有共同结构能撑住这段关系。",
      minAge: 22,
      maxAge: 28,
      weight: 4,
      tags: ["romance", "exclusive", "young_adult"],
      conditions: focusConditions("he_yuan", {
        activeRelationshipStatuses: ["ambiguous", "dating", "steady", "mutual_crush"],
        activeRelationshipRequiredSharedHistory: ["he_mock_exam"],
        activeRelationshipExcludedSharedHistory: ["he_city_choice"]
      }),
      choices: [
        choice({
          text: "尽量把城市和工作选择谈到同一张桌子上，让关系一起进入未来规划。",
          effects: { stats: { career: 2, happiness: 3, social: 2 } },
          addRomanceFlags: ["relationship_committed"],
          relationshipEffects: [
            effectFor("he_yuan", {
              affection: 12,
              trust: 10,
              commitment: 18,
              continuity: 12,
              status: "steady",
              addSharedHistory: ["he_city_choice"],
              history: "你们没有把工作和城市当成恋爱外部的事，而是认真把两个人的未来结构一起谈清了。"
            })
          ],
          log: "何沅线能不能走长，关键在于你们是否真的有能力共同规划现实。"
        }),
        choice({
          text: "先各走各的，赌以后还有机会把关系重新接回去。",
          effects: { stats: { career: 3, happiness: -2, stress: 2 } },
          addFlags: ["career_first"],
          relationshipEffects: [
            effectFor("he_yuan", {
              affection: -6,
              trust: -4,
              commitment: -8,
              continuity: 4,
              status: "estranged",
              addSharedHistory: ["he_city_choice"],
              history: "你们都把现实选择放到了前面，关系没有立刻断，却也明显开始被距离和节奏差拉开。"
            })
          ],
          log: "这条线不是不能异地，而是很怕双方都以为以后自然会补回来。"
        }),
        choice({
          text: "你们认真对过方向，最后承认彼此真正想要的人生结构不一样。",
          effects: { stats: { mental: 1, happiness: -1 } },
          addFlags: ["missed_love"],
          relationshipEffects: [
            effectFor("he_yuan", {
              affection: -12,
              trust: -6,
              commitment: -16,
              status: "broken",
              clearActive: true,
              addSharedHistory: ["he_city_choice"],
              history: "你们没有把不合适拖成更伤人的关系，而是在真正的未来结构冲突出现时体面分开。"
            })
          ],
          log: "何沅线的分开往往不是情绪爆炸，而是清醒地承认方向不同。"
        })
      ]
    }),
    event({
      id: "he_yuan_parent_meeting",
      stage: "family",
      title: "走到成熟阶段以后，你和何沅必须决定这段关系是不是要真的落进生活",
      text: "见家长、谈定居、谈以后工作节奏、谈谁要多承担一点家庭责任，这些议题终于一项项摆上来。何沅不会靠热度做决定，她要看这段关系是不是足够清楚、足够稳定、也足够值得投入。",
      minAge: 29,
      maxAge: 36,
      weight: 3,
      tags: ["romance", "exclusive", "family"],
      conditions: focusConditions("he_yuan", {
        activeRelationshipStatuses: ["steady", "reconnected", "dating"],
        activeRelationshipMinCommitment: 26,
        activeRelationshipRequiredSharedHistory: ["he_city_choice"],
        activeRelationshipExcludedSharedHistory: ["he_parent_meeting"]
      }),
      choices: [
        choice({
          text: "把双方家庭和未来节奏都摊开讲，认真推进共同生活。",
          effects: { stats: { happiness: 5, social: 2, money: -2 } },
          addRomanceFlags: ["relationship_committed"],
          relationshipEffects: [
            effectFor("he_yuan", {
              affection: 10,
              trust: 10,
              commitment: 20,
              continuity: 10,
              status: "steady",
              addSharedHistory: ["he_parent_meeting"],
              history: "你们没有把这段关系只留在感情层面，而是真正开始把双方家庭和以后生活方式一起纳入规划。"
            })
          ],
          log: "这条线的成熟感，更多来自把复杂问题谈清，而不是只靠情绪确认。"
        }),
        choice({
          text: "先继续相处，但你还是不愿意把承诺推进到那么深。",
          effects: { stats: { career: 2, happiness: -1, stress: 1 } },
          addFlags: ["career_first"],
          relationshipEffects: [
            effectFor("he_yuan", {
              affection: -4,
              commitment: -8,
              tension: 8,
              status: "cooling",
              addSharedHistory: ["he_parent_meeting"],
              history: "你们还在继续，但你对更深承诺的迟疑开始很具体地影响到这段关系。"
            })
          ],
          log: "对何沅来说，长期模糊往往比一次争吵更伤。"
        }),
        choice({
          text: "承认自己给不了她想要的清晰和长期结构，及时停下来。",
          effects: { stats: { mental: 1, happiness: 1 } },
          addFlags: ["second_growth"],
          relationshipEffects: [
            effectFor("he_yuan", {
              affection: -10,
              trust: -6,
              commitment: -18,
              status: "broken",
              clearActive: true,
              addSharedHistory: ["he_parent_meeting"],
              history: "你们没有继续用喜欢硬撑长期不匹配，而是在真正需要清晰承诺的时候停了下来。"
            })
          ],
          log: "这条线的成熟，也体现在敢不敢对自己和对方都诚实。"
        })
      ]
    }),

    event({
      id: "zhou_yi_project_sprint",
      stage: "college",
      title: "你和周屿第一次真正熟起来，是在一个快把人熬空的项目冲刺里",
      text: "周屿那种人通常不会靠闲聊熟起来。真正让你们关系推进的是一起熬项目、改方案、跑答辩、半夜在教学楼下对齐最后一版汇报。你开始意识到，有些吸引并不是来自浪漫，而是来自‘这个人真的能和我一起把事做成’。",
      minAge: 18,
      maxAge: 20,
      weight: 4,
      tags: ["romance", "exclusive", "college"],
      conditions: focusConditions("zhou_yi", {
        activeRelationshipStatuses: ["noticed", "familiar", "crush", "close"],
        activeRelationshipExcludedSharedHistory: ["zhou_project"]
      }),
      choices: [
        choice({
          text: "继续和他并肩把项目做到底，让这份默契在做事里长深。",
          effects: { stats: { intelligence: 3, career: 2, happiness: 2 } },
          relationshipEffects: [
            effectFor("zhou_yi", {
              affection: 10,
              familiarity: 10,
              trust: 10,
              theirInterest: 8,
              continuity: 10,
              status: "close",
              addSharedHistory: ["zhou_project"],
              history: "你们在一起做事的节奏越来越顺，这让周屿开始真正把你看成可以并肩的人。"
            })
          ],
          log: "周屿线的吸引很大一部分来自能力、执行和并肩感。"
        }),
        choice({
          text: "借项目名义拉近一点私人距离，看看这份合作会不会慢慢变成暧昧。",
          effects: { stats: { intelligence: 2, social: 2 } },
          relationshipEffects: [
            effectFor("zhou_yi", {
              affection: 8,
              familiarity: 8,
              ambiguity: 8,
              playerInterest: 6,
              continuity: 8,
              status: "ambiguous",
              addSharedHistory: ["zhou_project"],
              history: "你开始让你们的互动一点点超出工作本身，周屿也隐约意识到了这种变化。"
            })
          ],
          log: "这条线的暧昧通常会混着合作默契一起出现。"
        }),
        choice({
          text: "项目做完就好，不想让关系越出太多边界。",
          effects: { stats: { career: 1, discipline: 1 } },
          relationshipEffects: [
            effectFor("zhou_yi", {
              affection: 2,
              familiarity: 8,
              continuity: 6,
              status: "familiar",
              addSharedHistory: ["zhou_project"],
              history: "你们留住了很好的合作关系，但也明显没有让它往私人情感的方向多走太远。"
            })
          ],
          log: "周屿线不是会自己往恋爱里滚的类型，边界收住以后，关系就会继续停在能力互认的位置。"
        })
      ]
    }),
    event({
      id: "zhou_yi_intern_offer",
      stage: "college",
      title: "实习 offer 来了以后，你和周屿的时间第一次开始明显不同步",
      text: "周屿很快拿到了实习机会，生活节奏一下变得更快。你们会开始讨论通勤、面试、项目和以后要不要去同一个城市，也会第一次发现，真正有野心的人并不总有空把感情处理得很温柔。",
      minAge: 20,
      maxAge: 22,
      weight: 4,
      tags: ["romance", "exclusive", "college"],
      conditions: focusConditions("zhou_yi", {
        activeRelationshipStatuses: ["close", "ambiguous", "mutual_crush", "dating"],
        activeRelationshipRequiredSharedHistory: ["zhou_project"],
        activeRelationshipExcludedSharedHistory: ["zhou_offer"]
      }),
      choices: [
        choice({
          text: "你也主动跟上节奏，把关系和未来一起纳进安排表里。",
          effects: { stats: { career: 2, intelligence: 2, happiness: 2 } },
          relationshipEffects: [
            effectFor("zhou_yi", {
              affection: 10,
              trust: 8,
              commitment: 12,
              continuity: 10,
              status: "dating",
              addSharedHistory: ["zhou_offer"],
              history: "你没有被周屿的速度甩开，而是很认真地让自己也走进了那种并肩成长的节奏。"
            })
          ],
          log: "周屿线很适合共同成长，但也很考验你是不是愿意一起提速。"
        }),
        choice({
          text: "你有点被他的速度压住了，关系开始出现若有若无的失衡感。",
          effects: { stats: { happiness: -2, mental: -1, stress: 2 } },
          relationshipEffects: [
            effectFor("zhou_yi", {
              affection: -4,
              tension: 8,
              ambiguity: 6,
              status: "cooling",
              addSharedHistory: ["zhou_offer"],
              history: "周屿往前冲得很快，而你们之间关于节奏和回应的失衡也开始变得明显。"
            })
          ],
          log: "这条线最常见的受挫点，就是双方成长速度开始不一样。"
        }),
        choice({
          text: "先把关系放轻一点，别让彼此都被未来规划卡得太紧。",
          effects: { stats: { happiness: 1, discipline: 1 } },
          relationshipEffects: [
            effectFor("zhou_yi", {
              affection: 2,
              trust: 2,
              commitment: -2,
              status: "ambiguous",
              addSharedHistory: ["zhou_offer"],
              history: "你们默契地把关系留在了还没完全下定义的位置，希望别让未来压力一下压坏现在。"
            })
          ],
          log: "周屿线也可以走成‘彼此很欣赏，但没在那个阶段立刻绑定’。"
        })
      ]
    }),
    event({
      id: "zhou_yi_growth_rate_gap",
      stage: "young_adult",
      title: "工作几年以后，你和周屿开始正面面对成长速度差",
      text: "进入社会以后，周屿的路线感越来越强，而你也开始有自己的现实重心。你们之间的问题不再只是忙不忙，而是未来是不是还能真的排到同一张日历上。感情在这里第一次要和能力、城市、时间和野心同时对账。",
      minAge: 23,
      maxAge: 29,
      weight: 4,
      tags: ["romance", "exclusive", "young_adult"],
      conditions: focusConditions("zhou_yi", {
        activeRelationshipStatuses: ["dating", "steady", "cooling", "ambiguous"],
        activeRelationshipRequiredSharedHistory: ["zhou_offer"],
        activeRelationshipExcludedSharedHistory: ["zhou_growth_gap"]
      }),
      choices: [
        choice({
          text: "你们认真重排优先级，尽量让事业和关系不是非此即彼。",
          effects: { stats: { career: 2, happiness: 3, social: 2 } },
          addRomanceFlags: ["relationship_maintained"],
          relationshipEffects: [
            effectFor("zhou_yi", {
              affection: 8,
              trust: 8,
              tension: -8,
              commitment: 14,
              continuity: 10,
              status: "steady",
              addSharedHistory: ["zhou_growth_gap"],
              history: "你们没有让成长速度差直接把关系撕开，而是认真调整了彼此在生活里的位置。"
            })
          ],
          log: "并肩成长型关系真正能不能走长，关键就在于能不能在速度差出现以后重新协商结构。"
        }),
        choice({
          text: "你越来越觉得自己像在追他的节奏，关系开始变得很累。",
          effects: { stats: { happiness: -4, mental: -2, stress: 2 } },
          relationshipEffects: [
            effectFor("zhou_yi", {
              affection: -10,
              trust: -6,
              tension: 14,
              commitment: -8,
              status: "conflict",
              addSharedHistory: ["zhou_growth_gap"],
              history: "你们都还想继续，可长期的节奏失衡还是把关系带进了明显拉扯。"
            })
          ],
          log: "这条线的痛感常常来自‘我不是不爱你，只是我越来越跟不上这套节奏’。"
        }),
        choice({
          text: "承认这段关系更适合停在曾经一起往前跑过的那段时间里。",
          effects: { stats: { mental: 1 } },
          addFlags: ["missed_love"],
          relationshipEffects: [
            effectFor("zhou_yi", {
              affection: -14,
              commitment: -14,
              continuity: -6,
              status: "broken",
              clearActive: true,
              addSharedHistory: ["zhou_growth_gap"],
              history: "你们承认一起跑过的那段时间很真，但成年后真正想要的人生结构已经不再一致。"
            })
          ],
          log: "周屿线很容易走成‘曾经很适合一起成长，但未必适合一起生活’。"
        })
      ]
    }),
    event({
      id: "zhou_yi_airport_return",
      stage: "family",
      title: "多年后，你在机场又看到周屿拖着行李走出来",
      text: "重逢发生在机场总带一点象征感。周屿拖着箱子走出来的那一刻，你会很清楚地意识到，这个人和你的人生曾经真的有过很长一段交叠。只是现在，问题已经不是青春期那种要不要靠近，而是你们现在是不是还有能力把关系重新接回现实。",
      minAge: 29,
      maxAge: 36,
      weight: 3,
      tags: ["romance", "exclusive", "reunion"],
      conditions: focusConditions("zhou_yi", {
        activeRelationshipStatuses: ["broken", "estranged", "conflict"],
        activeRelationshipRequiredSharedHistory: ["zhou_growth_gap"],
        activeRelationshipExcludedSharedHistory: ["zhou_airport"],
        noCurrentPartner: true
      }),
      choices: [
        choice({
          text: "再试一次，但这次先把城市、节奏和底线都谈清楚。",
          effects: { stats: { happiness: 4, social: 2, mental: 2 } },
          addRomanceFlags: ["relationship_rebuilt"],
          relationshipEffects: [
            effectFor("zhou_yi", {
              affection: 10,
              trust: 10,
              commitment: 12,
              tension: -8,
              continuity: 14,
              status: "reconnected",
              addSharedHistory: ["zhou_airport"],
              history: "你们没有把重逢处理成怀旧，而是在更成熟的现实条件下重新谈了一次关系能不能成立。"
            })
          ],
          log: "这条线的重逢不靠浪漫冲动，而靠双方现在有没有足够成熟的现实感。"
        }),
        choice({
          text: "聊完近况就好，你更想把那段并肩成长留在记忆里。",
          effects: { stats: { mental: 2 } },
          relationshipEffects: [
            effectFor("zhou_yi", {
              affection: 2,
              status: "missed",
              addSharedHistory: ["zhou_airport"],
              history: "你们重新确认了彼此的重要，但也确认了这段关系更适合留在曾经最好的样子里。"
            })
          ],
          log: "有些人适合放在回忆里，不是因为不重要，而是因为现实已经不是同一条线。"
        }),
        choice({
          text: "你知道一旦再靠近就会重新进入那种高速度关系，所以还是不继续。",
          effects: { stats: { happiness: -1, discipline: 1 } },
          addFlags: ["emotionally_guarded"],
          relationshipEffects: [
            effectFor("zhou_yi", {
              affection: -4,
              status: "missed",
              addSharedHistory: ["zhou_airport"],
              history: "你还是被周屿打动了，但也很清楚自己不想再回到那种长期被速度和比较牵着走的状态。"
            })
          ],
          log: "周屿线的放下，往往是一种清醒选择，而不是情绪消失。"
        })
      ]
    }),

    event({
      id: "xu_qing_volunteer_kitchen",
      stage: "college",
      title: "你和徐清第一次熟起来，是在志愿活动结束后的厨房和洗碗池边",
      text: "活动散场以后，大家都急着回去，徐清却会留下来一起把桌椅搬回仓库、把锅洗干净、把剩下的饭盒一袋袋分好。你开始发现，真正让人安心的并不是热闹，而是那种会在收尾时也一直在场的人。",
      minAge: 18,
      maxAge: 21,
      weight: 4,
      tags: ["romance", "exclusive", "college"],
      conditions: focusConditions("xu_qing", {
        activeRelationshipStatuses: ["noticed", "familiar", "close", "crush"],
        activeRelationshipExcludedSharedHistory: ["xu_kitchen"]
      }),
      choices: [
        choice({
          text: "继续留下来和他一起收尾，让这种生活感慢慢长出来。",
          effects: { stats: { happiness: 3, health: 1, social: 2 } },
          relationshipEffects: [
            effectFor("xu_qing", {
              affection: 10,
              familiarity: 12,
              trust: 10,
              continuity: 10,
              status: "close",
              addSharedHistory: ["xu_kitchen"],
              history: "你和徐清真正熟起来，不是在热闹场面里，而是在一次次活动收尾和洗碗池边的慢动作里。"
            })
          ],
          log: "徐清线的关系感很强，很多升温都来自生活里的实际陪伴。"
        }),
        choice({
          text: "和他边收拾边慢慢聊自己对以后生活的想象。",
          effects: { stats: { happiness: 2, mental: 2 } },
          relationshipEffects: [
            effectFor("xu_qing", {
              affection: 8,
              trust: 8,
              playerInterest: 6,
              theirInterest: 8,
              continuity: 8,
              status: "mutual_crush",
              addSharedHistory: ["xu_kitchen"],
              history: "你们从一起收尾聊到了以后想过什么样的日子，那种生活感很快开始长成另一种心动。"
            })
          ],
          log: "这条线会明显偏向‘一起过日子会不会舒服’的吸引。"
        }),
        choice({
          text: "活动结束就走，不想让自己太快被这种稳定感打动。",
          effects: { stats: { discipline: 1, happiness: -1 } },
          relationshipEffects: [
            effectFor("xu_qing", {
              affection: -2,
              continuity: 4,
              status: "familiar",
              addSharedHistory: ["xu_kitchen"],
              history: "你和徐清依然留住了联系，但你没有继续让这种很容易长出依赖感的相处往前走太快。"
            })
          ],
          log: "有些人之所以危险，不是因为不稳定，而是因为他们太容易让人想把以后也一起想进去。"
        })
      ]
    }),
    event({
      id: "xu_qing_fever_night",
      stage: "young_adult",
      title: "有一次你生病了，徐清把整晚都留给了你",
      text: "成年以后，真正能让关系快速变深的，常常不是约会，而是在你最狼狈的时候对方是否还在。发烧、夜里买药、守着你睡着、第二天早起煮粥，这些具体动作会把感情一下拉进非常现实的位置。",
      minAge: 21,
      maxAge: 25,
      weight: 4,
      tags: ["romance", "exclusive", "young_adult"],
      conditions: focusConditions("xu_qing", {
        activeRelationshipStatuses: ["close", "mutual_crush", "ambiguous", "dating"],
        activeRelationshipRequiredSharedHistory: ["xu_kitchen"],
        activeRelationshipExcludedSharedHistory: ["xu_fever_night"],
        minStats: { health: 24 }
      }),
      choices: [
        choice({
          text: "接受这种照顾，也开始承认自己想和他发展一段更稳定的关系。",
          effects: { stats: { happiness: 5, health: 2, mental: 3 } },
          addRomanceFlags: ["relationship_maintained"],
          relationshipEffects: [
            effectFor("xu_qing", {
              affection: 12,
              trust: 14,
              commitment: 12,
              continuity: 10,
              status: "dating",
              addSharedHistory: ["xu_fever_night"],
              history: "那次生病以后，你终于很难再把徐清只放在‘相处舒服的人’的位置上。"
            })
          ],
          log: "徐清线的升温常常来自被实实在在地照顾和接住。"
        }),
        choice({
          text: "嘴上说谢谢，心里却有点怕自己太快依赖上这种陪伴。",
          effects: { stats: { happiness: 2, mental: 1 } },
          relationshipEffects: [
            effectFor("xu_qing", {
              affection: 6,
              trust: 8,
              ambiguity: 8,
              continuity: 8,
              status: "ambiguous",
              addSharedHistory: ["xu_fever_night"],
              history: "你被徐清那种稳稳在场的照顾打动了，却也因为太容易心软而不敢立刻往前跨。"
            })
          ],
          log: "稳定型关系也会有自己的危险感，因为它太容易让人想依赖。"
        }),
        choice({
          text: "下意识把感谢和距离一起摆出来，不想让关系变得太重。",
          effects: { stats: { happiness: -1, discipline: 1 } },
          addFlags: ["emotionally_guarded"],
          relationshipEffects: [
            effectFor("xu_qing", {
              affection: -2,
              trust: 2,
              continuity: 4,
              status: "close",
              addSharedHistory: ["xu_fever_night"],
              history: "徐清依旧很稳地在场，但你明显把更多会让关系进一步加深的反馈按住了。"
            })
          ],
          log: "这条线不怕冲突，反而更怕有人一直礼貌地不让它真正往里走。"
        })
      ]
    }),
    event({
      id: "xu_qing_rent_and_chores",
      stage: "family",
      title: "一起住以后，你和徐清第一次在家务、疲惫和现实分工上碰了硬钉子",
      text: "真正适不适合一起生活，往往不是在约会里看出来的，而是在下班回家、家务堆着、谁今天更累、谁总是默认多承担一点这些时刻里看出来的。徐清很会照顾人，但这不代表他不会在长期失衡里受伤。",
      minAge: 25,
      maxAge: 31,
      weight: 4,
      tags: ["romance", "exclusive", "family"],
      conditions: focusConditions("xu_qing", {
        activeRelationshipStatuses: ["dating", "steady", "reconnected"],
        activeRelationshipRequiredSharedHistory: ["xu_fever_night"],
        activeRelationshipExcludedSharedHistory: ["xu_rent_chores"]
      }),
      choices: [
        choice({
          text: "把分工、钱和疲惫都说清楚，认真重新安排共同生活。",
          effects: { stats: { happiness: 4, social: 2, mental: 2, stress: -1 } },
          addRomanceFlags: ["relationship_maintained"],
          relationshipEffects: [
            effectFor("xu_qing", {
              affection: 10,
              trust: 12,
              tension: -8,
              commitment: 14,
              continuity: 10,
              status: "steady",
              addSharedHistory: ["xu_rent_chores"],
              history: "你们没有把家务和生活分工当作琐事糊过去，而是认真重新搭了一套更公平的共同生活结构。"
            })
          ],
          log: "徐清线真正能不能走稳，关键在于生活感是不是被认真经营，而不是默认一个人一直多付出。"
        }),
        choice({
          text: "你以为这些小事忍一忍就过去，结果关系越来越像一个人在照顾另一个人。",
          effects: { stats: { happiness: -4, mental: -2, stress: 2 } },
          addRomanceFlags: ["relationship_neglected"],
          relationshipEffects: [
            effectFor("xu_qing", {
              affection: -10,
              trust: -8,
              tension: 14,
              commitment: -8,
              status: "conflict",
              addSharedHistory: ["xu_rent_chores"],
              history: "长期失衡让你们的关系越来越不像彼此托底，而像其中一方不断在补另一个人的生活漏洞。"
            })
          ],
          log: "稳定型关系被拖坏时，往往不是因为大事，而是因为很多小失衡一直没人修。"
        }),
        choice({
          text: "你意识到自己其实并没有准备好真的和谁把生活合并得这么深。",
          effects: { stats: { mental: 1, happiness: -1 } },
          addFlags: ["solo_pattern"],
          relationshipEffects: [
            effectFor("xu_qing", {
              affection: -12,
              commitment: -12,
              status: "broken",
              clearActive: true,
              addSharedHistory: ["xu_rent_chores"],
              history: "你们走到了真正要搭生活的时候，也终于承认了你还没有准备好把自己的人生结构和另一个人结合到那么深。"
            })
          ],
          log: "徐清线的分开常常很现实，不是没爱，而是生活层面的准备度不一致。"
        })
      ]
    }),
    event({
      id: "xu_qing_family_table_future",
      stage: "family",
      title: "到了要见家长、谈以后时，你和徐清必须决定这段关系是不是要真的落地",
      text: "走到这一步以后，很多问题都不再能模糊着过。要不要见家长、要不要定居、对孩子和家庭分工怎么看、以后工作节奏怎么排，这些都要变成很具体的讨论。徐清会很认真地看你是不是愿意把他放进真正的以后。",
      minAge: 29,
      maxAge: 36,
      weight: 3,
      tags: ["romance", "exclusive", "family"],
      conditions: focusConditions("xu_qing", {
        activeRelationshipStatuses: ["steady", "reconnected", "dating"],
        activeRelationshipMinCommitment: 24,
        activeRelationshipRequiredSharedHistory: ["xu_rent_chores"],
        activeRelationshipExcludedSharedHistory: ["xu_family_table"]
      }),
      choices: [
        choice({
          text: "你决定认真推进，接受以后很多日常都要和他一起排。",
          effects: { stats: { happiness: 5, familySupport: 2, money: -2 } },
          addRomanceFlags: ["relationship_committed"],
          relationshipEffects: [
            effectFor("xu_qing", {
              affection: 10,
              trust: 10,
              commitment: 18,
              continuity: 10,
              status: "steady",
              addSharedHistory: ["xu_family_table"],
              history: "你没有再把这段关系停在舒服相处，而是认真把徐清放进了真正的长期生活规划。"
            })
          ],
          log: "徐清线最适合通向稳定共同生活的结局。"
        }),
        choice({
          text: "你还是想先保留更多个人空间，不愿意把承诺推进到那么具体。",
          effects: { stats: { career: 2, happiness: -1, stress: 1 } },
          addFlags: ["career_first"],
          relationshipEffects: [
            effectFor("xu_qing", {
              affection: -4,
              commitment: -8,
              tension: 8,
              status: "cooling",
              addSharedHistory: ["xu_family_table"],
              history: "你们还在一起，可你对更深绑定的迟疑开始很明确地改变这段关系的走向。"
            })
          ],
          log: "这条线的风险点不在热度，而在你是否真的愿意进入共同生活。"
        }),
        choice({
          text: "承认自己给不了他要的稳定落地，把关系停在这里。",
          effects: { stats: { mental: 1 } },
          addFlags: ["second_growth"],
          relationshipEffects: [
            effectFor("xu_qing", {
              affection: -10,
              trust: -6,
              commitment: -16,
              status: "broken",
              clearActive: true,
              addSharedHistory: ["xu_family_table"],
              history: "你没有拿模糊承诺继续拖住徐清，而是在真正要落地之前诚实地停下了这段关系。"
            })
          ],
          log: "稳定型关系也会有分开线，而且通常正是因为其中一方太认真，不愿意在未来问题上假装。"
        })
      ]
    })
  ];

  window.LIFE_RELATIONSHIP_ARCS = ARC_META;
  window.LIFE_EXTRA_EVENTS = [
    ...(Array.isArray(window.LIFE_EXTRA_EVENTS) ? window.LIFE_EXTRA_EVENTS : []),
    ...EXCLUSIVE_EVENTS
  ];
})();

(function () {
  "use strict";

  /*
    早期恋爱扩展：
    - 初中先建立对象池和关系选择。
    - 高中补“误会 / 吃醋 / 维持 / 转向”。
    - 大学重写认识对象事件，允许更丰富的人物池。
  */

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
      minAffection: toMap(source.minAffection),
      maxAffection: toMap(source.maxAffection),
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
      requiredActiveRelationshipFlags: toList(source.requiredActiveRelationshipFlags),
      excludedActiveRelationshipFlags: toList(source.excludedActiveRelationshipFlags),
      noCurrentPartner: Boolean(source.noCurrentPartner)
    };
  }

  function relationshipEffect(value) {
    const source = value && typeof value === "object" ? value : {};

    return {
      targetId: typeof source.targetId === "string" ? source.targetId : "",
      affection: typeof source.affection === "number" ? source.affection : 0,
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

  function pickPersonChoice(targetId, text, stats, status, history, extra) {
    const config = extra || {};

    return choice({
      text,
      effects: {
        age: 0,
        stats: stats || {}
      },
      addFlags: toList(config.addFlags),
      addTags: toList(config.addTags),
      addRomanceFlags: ["romance_target_chosen"],
      relationshipEffects: [
        {
          targetId,
          affection: typeof config.affection === "number" ? config.affection : 12,
          status: status || "noticed",
          addFlags: toList(config.relationshipFlags),
          setActive: true,
          history
        }
      ],
      log: config.log || history,
      conditions: condition(config.conditions || {})
    });
  }

  window.LIFE_EXTRA_EVENTS = [
    ...(Array.isArray(window.LIFE_EXTRA_EVENTS) ? window.LIFE_EXTRA_EVENTS : []),
    event({
      id: "adolescence_first_crush_pool",
      stage: "adolescence",
      title: "初中以后，你开始真正注意到某些人",
      text: "到了这个年纪，关系不再只是一起上课和放学。谁会让你多看一眼、谁让你想靠近一点、谁让你在回家路上还反复想起，都会慢慢变得具体。",
      minAge: 13,
      maxAge: 15,
      weight: 8,
      tags: ["adolescence", "romance"],
      conditions: condition({
        excludedRomanceFlags: ["romance_target_chosen"]
      }),
      effectsOnEnter: mutation({
        log: "你开始第一次不是抽象地想恋爱，而是真正对具体的人有了偏向。"
      }),
      choices: [
        pickPersonChoice(
          "song_qinghe",
          "被宋清禾吸引，想靠近那种安静又细的感觉。",
          { happiness: 2, mental: 1 },
          "noticed",
          "你开始格外留意宋清禾，很多很小的细节也因此变得不一样了。",
          {
            addTags: ["romance", "relationship"],
            relationshipFlags: ["campus_notice_started"]
          }
        ),
        pickPersonChoice(
          "jiang_xun",
          "总会被江循的存在感拉过去，想看看这种热度会不会靠近你。",
          { happiness: 2, social: 2 },
          "noticed",
          "你开始更在意江循会不会看向你，也开始主动把自己放进他的视线里。",
          {
            addTags: ["romance", "social"],
            relationshipFlags: ["campus_notice_started"]
          }
        ),
        pickPersonChoice(
          "fang_ke",
          "注意力慢慢落到方可身上，想知道这种默契能不能再多一点。",
          { intelligence: 1, happiness: 2 },
          "noticed",
          "你开始在很多日常接触里默默留意方可，关系也从普通同学变得有点不同。",
          {
            addTags: ["romance", "growth"],
            relationshipFlags: ["campus_notice_started"]
          }
        ),
        pickPersonChoice(
          "chen_yan",
          "会不自觉去注意陈砚，想知道那份稳和距离感背后是什么。",
          { mental: 1, social: 1 },
          "noticed",
          "你开始留意陈砚，甚至会为了多说两句并不重要的话提前想很久。",
          {
            addTags: ["romance", "selfhood"],
            relationshipFlags: ["campus_notice_started"]
          }
        ),
        choice({
          text: "先把心思收住，短期内不想让谁占太重位置。",
          effects: {
            age: 0,
            stats: { intelligence: 2, discipline: 1, happiness: -1 }
          },
          addFlags: ["solo_pattern"],
          addTags: ["selfhood", "distance"],
          addRomanceFlags: ["romance_held_back"],
          log: "你知道自己不是没有感觉，只是现在更想先把重心留给自己。"
        })
      ]
    }),
    event({
      id: "teen_group_and_jealousy",
      stage: "adolescence",
      title: "一群人靠近以后，关系里的试探和吃醋也跟着出现",
      text: "初中的喜欢很少是直线发展的。很多情绪都混在小团体、座位、聊天、误会和别人一句无心的话里。你和{activeLoveName}之间也开始有了这种青涩的拉扯。",
      minAge: 13,
      maxAge: 16,
      weight: 6,
      tags: ["adolescence", "romance"],
      conditions: condition({
        requiredRomanceFlags: ["romance_target_chosen"],
        activeRelationshipStatuses: ["noticed", "crush", "familiar", "close"]
      }),
      effectsOnEnter: mutation({
        log: "真正开始在意一个人以后，你会发现心动、试探和吃醋常常是一整包一起来的。"
      }),
      choices: [
        choice({
          text: "主动把话题和接触往前推一点，让关系别总靠猜。",
          effects: {
            age: 0,
            stats: { social: 3, happiness: 2, mental: 1 }
          },
          addRomanceFlags: ["romance_contact_increased"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 8,
              status: "familiar",
              addFlags: ["group_chat_close"],
              history: "你没有继续只靠猜测，而是让接触和默契都更往前走了一步。"
            }
          ],
          log: "你开始让自己从旁观者变成关系里的参与者。"
        }),
        choice({
          text: "表面装没事，心里却开始因为别人靠近而别扭。",
          effects: {
            age: 0,
            stats: { happiness: -2, mental: -2, stress: 2 }
          },
          addFlags: ["trust_break"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: -5,
              status: "crush",
              addFlags: ["teen_jealousy_seed"],
              history: "你没有把那点别扭说出来，只是看着关系在猜测里变得更累。"
            }
          ],
          log: "青春期很多关系不是输给了大事，而是输给了谁都不敢把话说白。"
        }),
        choice({
          text: "先退一点，把这份喜欢留在还算安全的位置。",
          effects: {
            age: 0,
            stats: { intelligence: 1, happiness: -1, discipline: 1 }
          },
          addRomanceFlags: ["romance_shrunk_back"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: -3,
              status: "noticed",
              addFlags: ["shied_away_once"],
              history: "你没有彻底放下，只是把距离重新拉回到更不容易受伤的位置。"
            }
          ],
          log: "你不是不想靠近，只是还没准备好承担被看见之后的全部后果。"
        })
      ]
    }),
    event({
      id: "highschool_switch_or_commit",
      stage: "highschool",
      title: "高中以后，你开始认真决定把时间放给谁",
      text: "到了高中，喜欢已经不只是小波动。你会更清楚地感到，时间、精力和情绪都是真实资源，给了谁，就会影响别的很多事。",
      minAge: 15,
      maxAge: 18,
      weight: 5,
      tags: ["highschool", "romance"],
      conditions: condition({
        requiredRomanceFlags: ["romance_target_chosen"],
        activeRelationshipStatuses: ["noticed", "familiar", "close", "ambiguous", "short_dating"]
      }),
      effectsOnEnter: mutation({
        log: "你开始知道，关系不只是发生在心里，也会和你的时间分配真正对账。"
      }),
      choices: [
        choice({
          text: "继续把主要注意力放在{activeLoveName}身上，认真经营这条线。",
          effects: {
            age: 0,
            stats: { happiness: 2, social: 2, stress: 1 }
          },
          addRomanceFlags: ["relationship_maintained"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 8,
              status: "close",
              addFlags: ["highschool_priority"],
              history: "你没有把感情四处分散，而是把主要心思继续留给了这段关系。"
            }
          ],
          log: "你开始把“维持关系”当成一个真实动作，而不只是顺其自然。"
        }),
        pickPersonChoice(
          "he_yuan",
          "开始更在意何沅，想看看新的吸引会不会把生活带到别的方向。",
          { intelligence: 2, social: 1, happiness: 1 },
          "noticed",
          "你把注意力从旧的关系线里挪开了一点，开始更在意何沅会不会回应你。",
          {
            addRomanceFlags: ["romance_target_chosen"],
            relationshipFlags: ["highschool_new_target"],
            conditions: { unknownRelationships: ["he_yuan"] },
            log: "新的环境和新的人出现后，你开始承认，心也会改道。"
          }
        ),
        pickPersonChoice(
          "pei_chuan",
          "注意力被裴川那种直白热度带走，想看看自己会不会因此更有勇气。",
          { happiness: 2, social: 2 },
          "noticed",
          "你开始把目光放到裴川身上，也开始重新判断什么样的关系会让你更有活气。",
          {
            relationshipFlags: ["highschool_new_target"],
            conditions: { unknownRelationships: ["pei_chuan"] },
            log: "你没有一直停在原来的心动里，而是让自己允许新的靠近出现。"
          }
        ),
        choice({
          text: "先把关系整体降温，给学业和自己更多空间。",
          effects: {
            age: 0,
            stats: { intelligence: 2, discipline: 2, happiness: -2 }
          },
          addFlags: ["career_first"],
          addRomanceFlags: ["romance_held_back"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: -6,
              status: "estranged",
              addFlags: ["timing_blocked"],
              history: "你主动把关系收了收，决定先把更多位置留给学业和自己。"
            }
          ],
          clearActiveRelationship: true,
          log: "你没有否认那份在意，只是决定现在先不继续往前推。"
        })
      ]
    }),
    event({
      id: "college_new_acquaintance",
      stage: "college",
      title: "大学里，你终于可以更主动决定想靠近谁",
      text: "新的城市、新的社交圈和新的节奏，会让喜欢这件事变得更具体。你不再只是被动遇到谁，而是真的开始决定，想把时间和注意力投给哪一种人。",
      minAge: 18,
      maxAge: 22,
      weight: 6,
      tags: ["college", "romance"],
      conditions: condition({
        noCurrentPartner: true
      }),
      effectsOnEnter: mutation({
        log: "这一次，关系不只是青春期的一阵风，而是你开始主动做出的长期选择。"
      }),
      choices: [
        pickPersonChoice(
          "lin_yue",
          "把更多接触留给林月，想试试这种安静但很真的靠近。",
          { happiness: 2, social: 2, mental: 1 },
          "familiar",
          "你主动把更多日常分享和见面机会给了林月，关系慢慢从注意变成熟悉。",
          {
            affection: 10,
            addTags: ["romance", "relationship"],
            relationshipFlags: ["college_target_started"]
          }
        ),
        pickPersonChoice(
          "su_wan",
          "更愿意靠近苏晚，想看看这种松弛又有主见的相处会不会走远。",
          { happiness: 2, social: 2, health: 1 },
          "familiar",
          "你开始主动接近苏晚，很多平常日子也因此变得更像在共同生活的预演。",
          {
            affection: 10,
            addTags: ["romance", "stability"],
            relationshipFlags: ["college_target_started"]
          }
        ),
        pickPersonChoice(
          "xu_tang",
          "把更多注意力放到许棠身上，因为你会被那种聪明和分寸感吸引。",
          { intelligence: 2, social: 1 },
          "familiar",
          "你主动去接近许棠，关系也开始从泛泛同学变成更值得记住的靠近。",
          {
            affection: 10,
            addTags: ["romance", "ambition"],
            relationshipFlags: ["college_target_started"]
          }
        ),
        pickPersonChoice(
          "shen_zhi",
          "更想靠近沈枝，因为她身上的热度会让你觉得日子一下亮起来。",
          { happiness: 3, social: 2 },
          "familiar",
          "你把更多时间留给了沈枝，关系也从普通接触慢慢有了情绪浓度。",
          {
            affection: 10,
            addTags: ["romance", "selfhood"],
            relationshipFlags: ["college_target_started"]
          }
        ),
        pickPersonChoice(
          "zhou_yi",
          "想和周屿多接触，因为你会被那种并肩往前走的感觉打动。",
          { intelligence: 2, social: 2 },
          "familiar",
          "你主动把更多合作和聊天机会放给了周屿，关系开始往更深的位置移动。",
          {
            affection: 10,
            addTags: ["romance", "ambition"],
            relationshipFlags: ["college_target_started"]
          }
        ),
        pickPersonChoice(
          "cheng_nan",
          "更想靠近程楠，因为你需要一点真实而直接的热度。",
          { happiness: 3, social: 2 },
          "familiar",
          "你开始把更多互动留给程楠，关系也从热闹场合慢慢走向更私人。",
          {
            affection: 10,
            addTags: ["romance", "selfhood"],
            relationshipFlags: ["college_target_started"]
          }
        ),
        pickPersonChoice(
          "xu_qing",
          "更想靠近徐清，因为那种稳稳托住人的感觉很难不在意。",
          { happiness: 2, mental: 1, health: 1 },
          "familiar",
          "你开始把联系和分享留给徐清，关系也逐渐有了能被依靠的轮廓。",
          {
            affection: 10,
            addTags: ["romance", "family"],
            relationshipFlags: ["college_target_started"]
          }
        ),
        pickPersonChoice(
          "lu_chuan",
          "开始更在意陆川，想看看这种低调但可靠的感觉会不会变成真正的亲近。",
          { happiness: 2, social: 1, mental: 1 },
          "familiar",
          "你把更多时间和注意力放到了陆川身上，也开始期待这种安静的关系继续往前走。",
          {
            affection: 10,
            addTags: ["romance", "stability"],
            relationshipFlags: ["college_target_started"]
          }
        ),
        choice({
          text: "先把感情线放轻一点，短期内不打算确认谁是主线。",
          effects: {
            age: 0,
            stats: { career: 1, happiness: 1, discipline: 1 }
          },
          addFlags: ["solo_pattern"],
          addTags: ["selfhood", "distance"],
          addRomanceFlags: ["romance_held_back"],
          log: "你不是没有机会，而是明确把这个阶段更多空间留给了自己。"
        })
      ]
    }),
    event({
      id: "relationship_crossroads_adult",
      stage: "family",
      title: "关系走长以后，维持、确认还是分开都得有人真正做决定",
      text: "到了长期关系阶段，感情已经不是只靠心动撑着。时间分配、现实安排、误会修复和价值观差异都会慢慢逼近，你和{activeLoveName}也走到了一个需要真正决定的位置。",
      minAge: 25,
      maxAge: 38,
      weight: 6,
      tags: ["family", "romance"],
      conditions: condition({
        activeRelationshipStatuses: ["dating", "steady", "reconnected", "short_dating"],
        activeRelationshipMinAffection: 34
      }),
      effectsOnEnter: mutation({
        log: "你开始知道，真正长期的感情不是自动继续，而是需要一次次被明确选择。"
      }),
      choices: [
        choice({
          text: "把关系确认得更清楚，愿意一起往更长期的生活去走。",
          effects: {
            age: 0,
            stats: { happiness: 4, familySupport: 2, stress: -1 }
          },
          addFlags: ["long_term_partner"],
          addRomanceFlags: ["relationship_committed", "relationship_maintained"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 10,
              status: "steady",
              addFlags: ["future_planned"],
              history: "你们把关系说得更清楚了，不再只是靠感觉维持，而是开始一起往长期生活去走。"
            }
          ],
          log: "你没有继续模糊下去，而是明确选择了这段关系。"
        }),
        choice({
          text: "先认真修一次，把冲突和误会都摊开谈。",
          effects: {
            age: 0,
            stats: { social: 3, mental: 2, happiness: 2 }
          },
          addFlags: ["emotional_honesty"],
          addRomanceFlags: ["relationship_rebuilt"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 6,
              status: "reconnected",
              addFlags: ["conflict_repaired"],
              history: "你们没有直接散开，而是把最难谈的部分认真摊开过一次。"
            }
          ],
          log: "你没有让关系自动坏下去，而是愿意花力气把它修一修。"
        }),
        choice({
          text: "承认这段关系撑不动了，选择把手放开。",
          effects: {
            age: 0,
            stats: { happiness: -5, mental: -3, stress: 2, social: -1 }
          },
          addFlags: ["missed_love", "solo_pattern"],
          addRomanceFlags: ["relationship_ended"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: -12,
              status: "broken",
              addFlags: ["adult_breakup"],
              history: "你们没有再硬拖下去，而是承认这段关系已经走到了分开的节点。"
            }
          ],
          clearActiveRelationship: true,
          log: "你没有把分开处理成失败，只是承认有些关系走到这里已经不再适合继续。"
        })
      ]
    })
  ];
})();

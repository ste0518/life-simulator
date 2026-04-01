(function () {
  "use strict";

  /*
    二次扩展事件说明：
    - 本文件只负责继续追加事件，不覆盖原事件。
    - 重点放在家庭背景分流、幼年 / 青少年细化、早期感情线和新增参数联动。
    - 如需手动调整，只改单个 event({ ... }) / choice({ ... }) 即可。
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
      tags: toList(source.tags),
      conditions: condition(source.conditions),
      effectsOnEnter: mutation(source.effectsOnEnter),
      choices: Array.isArray(source.choices) ? source.choices.map(choice) : []
    };
  }

  const FAMILY_BACKGROUND_EVENTS = [
    event({
      id: "resource_home_schedule",
      stage: "school",
      title: "周末被排满以后，你开始学会怎么看待“优秀”",
      text: "家里有资源以后，周末往往不会空着。补习、兴趣、比赛和安排好的社交，让你很早就知道，优秀在一些家庭里不是奖励，而像默认指标。",
      minAge: 7,
      maxAge: 10,
      weight: 7,
      tags: ["school", "family"],
      conditions: condition({
        someFlags: ["family_wealth_high", "resource_rich_home"]
      }),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你第一次明确感到，资源带来的不只是便利，也是一种持续被推着往前的速度。"
      }),
      choices: [
        choice({
          text: "把安排都接住，慢慢把完成任务变成擅长的事。",
          effects: {
            age: 0,
            stats: { intelligence: 3, discipline: 4, stress: 3, mental: -1 }
          },
          addFlags: ["achievement_compensation", "structured_growth"],
          addTags: ["discipline", "ambition"],
          log: "你在秩序里长出了很强的执行力，也更容易把“做得好”当成默认义务。"
        }),
        choice({
          text: "表面配合，心里却越来越想保住一点自己的时间。",
          effects: {
            age: 0,
            stats: { happiness: 2, stress: 1, discipline: 1 }
          },
          addFlags: ["self_definition_seed", "quiet_resistance"],
          addTags: ["selfhood", "pressure"],
          log: "你没有立刻翻脸，但已经开始在密不透风的安排里替自己留缝。"
        }),
        choice({
          text: "越来越怕跟不上，于是很早就把焦虑和努力绑在一起。",
          effects: {
            age: 0,
            stats: { intelligence: 2, stress: 5, mental: -3, happiness: -2 }
          },
          addFlags: ["family_expectation_high", "comparison_wound"],
          addTags: ["pressure", "wound"],
          log: "你得到的机会很多，可“不能掉下去”的感觉，也一起住进了你很早的人生里。"
        })
      ]
    }),
    event({
      id: "tight_home_school_trip",
      stage: "school",
      title: "一次班级活动，让你更早看见钱和体面的关系",
      text: "春游、夏令营、课外营地，别的小孩也许只把它当成一次出门玩，你却会先想家里是不是拿得出这笔钱，自己会不会因为这一点显得不合群。",
      minAge: 8,
      maxAge: 11,
      weight: 7,
      tags: ["school", "family"],
      conditions: condition({
        requiredFlags: ["financial_tight_home"]
      }),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你很早就发现，原来一些同龄人眼里的小事，对另一些家庭来说是要认真计算的负担。"
      }),
      choices: [
        choice({
          text: "把想去藏起来，不想再给家里添额外压力。",
          effects: {
            age: 0,
            stats: { familySupport: 1, happiness: -2, mental: -1, discipline: 2 }
          },
          addFlags: ["early_sacrifice", "responsibility_seed"],
          addTags: ["responsibility", "selfhood"],
          log: "你学会得很早的一课是：并不是所有想要的东西都值得说出口。"
        }),
        choice({
          text: "认真开口争取一次，也因此更明白家里到底在怎样托你。",
          effects: {
            age: 0,
            stats: { familySupport: 4, happiness: 2, stress: 1 }
          },
          addFlags: ["family_dialogue", "upward_mobility_home"],
          addTags: ["family", "growth"],
          log: "这次开口没有让你更任性，反而让你更清楚地看见了家里那份吃力但真心的支持。"
        }),
        choice({
          text: "心里那点不甘很重，从此更想靠自己把选择权挣回来。",
          effects: {
            age: 0,
            stats: { stress: 3, career: 1, discipline: 3, happiness: -1 }
          },
          addFlags: ["money_sensitivity", "achievement_compensation"],
          addTags: ["ambition", "growth"],
          log: "不是谁刻意教了你什么，而是现实自己把“以后要更有余地”这件事刻进了你心里。"
        })
      ]
    }),
    event({
      id: "night_of_quarrel_memory",
      stage: "school",
      title: "有个夜晚，家里的争吵彻底留在了你身上",
      text: "有些家庭冲突不会只停在当晚。门被摔上、玻璃碎掉、压低却压不住的争执声，都可能在孩子心里留下比大人以为更久的后劲。",
      minAge: 8,
      maxAge: 11,
      weight: 7,
      tags: ["school", "family"],
      conditions: condition({
        someFlags: ["parents_conflict", "tense_home", "family_conflict_seed"]
      }),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你第一次强烈地感觉到，所谓“家”并不总是一个让人自动放松的地方。"
      }),
      choices: [
        choice({
          text: "你把情绪压进心里，从此更习惯先判断安全不安全。",
          effects: {
            age: 0,
            stats: { mental: -3, stress: 4, intelligence: 2, social: -1 }
          },
          addFlags: ["emotional_vigilance", "emotionally_guarded"],
          addTags: ["wound", "distance"],
          log: "你长出了一种很强的雷达，总能先察觉危险，却也更难轻松地待在关系里。"
        }),
        choice({
          text: "你试着去安抚谁，过早学会替大人的情绪收残局。",
          effects: {
            age: 0,
            stats: { familySupport: -2, mental: -2, social: 2, stress: 3 }
          },
          addFlags: ["parentified_child", "people_pleaser"],
          addTags: ["family", "pressure"],
          log: "你明明还是个孩子，却开始本能地做起关系里的缓冲垫。"
        }),
        choice({
          text: "你暗暗告诉自己，以后一定要过一种不一样的生活。",
          effects: {
            age: 0,
            stats: { mental: 1, career: 1, stress: 2, discipline: 2 }
          },
          addFlags: ["family_escape_drive", "self_definition_seed"],
          addTags: ["selfhood", "growth"],
          log: "那一晚没有立刻改变你的人生，却让你很早就决定，未来一定要把生活过成另一种样子。"
        })
      ]
    }),
    event({
      id: "control_home_reportbook",
      stage: "school",
      title: "成绩单成了边界被不断推动的理由",
      text: "在控制型家庭里，分数常常不只是评价学习，而会顺手决定你能不能休息、能不能出去、能不能拒绝更多安排。你开始模糊地意识到，自己和“被管理”的界线被越推越深。",
      minAge: 10,
      maxAge: 12,
      weight: 7,
      tags: ["school", "family"],
      conditions: condition({
        requiredFlags: ["control_family"]
      }),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你开始察觉，家里的很多决定虽然打着“为你好”，却并不真的把你的感受放在同等位置。"
      }),
      choices: [
        choice({
          text: "把分数继续往上顶，先用结果换一点松动空间。",
          effects: {
            age: 0,
            stats: { intelligence: 4, discipline: 4, stress: 3, happiness: -1 }
          },
          addFlags: ["high_expectation_child", "achievement_compensation"],
          addTags: ["ambition", "pressure"],
          log: "你很早就学会了用表现争空间。这让你越来越能扛，也越来越难只为了自己而活。"
        }),
        choice({
          text: "开始用更柔软但清楚的方式守自己的边界。",
          effects: {
            age: 0,
            stats: { mental: 2, social: 2, familySupport: -1, discipline: 1 }
          },
          addFlags: ["boundary_awareness", "family_dialogue"],
          addTags: ["selfhood", "growth"],
          log: "你没有只能在顺从和爆炸之间二选一，而是慢慢练习起更不容易被看见、却更有后劲的边界感。"
        }),
        choice({
          text: "先顺着来，心里却越来越想晚一点彻底离开这种安排。",
          effects: {
            age: 0,
            stats: { mental: -2, stress: 3, career: 1 }
          },
          addFlags: ["quiet_resistance", "future_escape_plan"],
          addTags: ["pressure", "selfhood"],
          log: "你暂时没有正面碰撞，可“以后一定要自己做主”这件事，已经越来越硬地长在心里。"
        })
      ]
    }),
    event({
      id: "free_range_after_school_window",
      stage: "school",
      title: "放学后的空白时间，慢慢决定了你会长成什么样",
      text: "放养型家庭最大的特征之一，是很多课后时间需要你自己安排。那种空白有时会养出探索，有时也会养出散漫和无所依靠。",
      minAge: 9,
      maxAge: 12,
      weight: 7,
      tags: ["school", "growth"],
      conditions: condition({
        requiredFlags: ["free_range_home"]
      }),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "没人真的替你排满下午和晚上，你只能自己决定时间最终要流向哪里。"
      }),
      choices: [
        choice({
          text: "把空白用来乱试很多事，慢慢试出自己的偏好。",
          effects: {
            age: 0,
            stats: { intelligence: 2, happiness: 2, discipline: 1, social: 1 }
          },
          addFlags: ["self_exploration_early", "long_term_hobby"],
          addTags: ["selfhood", "curiosity"],
          log: "你不是按标准路径长大的，可那段自由也让你更早知道自己真正会被什么吸引。"
        }),
        choice({
          text: "时间常常一晃就过去，很多习惯也因此松松散散。",
          effects: {
            age: 0,
            stats: { discipline: -4, happiness: 1, stress: 1 }
          },
          addFlags: ["loose_routine", "deadline_pattern"],
          addTags: ["drift", "selfhood"],
          log: "自由不是没有代价。你很早就拥有选择权，也很早吃到了缺乏节奏的后果。"
        }),
        choice({
          text: "你主动给自己排出一点秩序，像在替自己补一层兜底。",
          effects: {
            age: 0,
            stats: { discipline: 5, mental: 2, intelligence: 2 }
          },
          addFlags: ["self_built_structure", "teen_self_management"],
          addTags: ["discipline", "growth"],
          log: "你没有等谁来管，而是慢慢学会了给自己搭骨架。这个能力后来会很值钱。"
        })
      ]
    }),
    event({
      id: "warm_family_first_talk",
      stage: "adolescence",
      title: "青春期第一次认真谈心，决定了你以后还敢不敢开口",
      text: "青春期很多事都变得复杂：自卑、喜欢、比较、身体变化、成绩起伏。一个家庭有没有能力在这个阶段和你正常说话，会很深地影响你对亲密关系的理解。",
      minAge: 13,
      maxAge: 15,
      weight: 6,
      tags: ["adolescence", "family"],
      conditions: condition({
        someFlags: ["parents_close", "emotion_safe_home", "parental_support"]
      }),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你第一次认真感到，有些问题如果在家里也能被说出来，很多压力就不会只剩一个人扛。"
      }),
      choices: [
        choice({
          text: "把那些真正困住自己的话说出来，哪怕磕磕绊绊。",
          effects: {
            age: 0,
            stats: { familySupport: 6, mental: 4, happiness: 3, social: 2 }
          },
          addFlags: ["family_dialogue", "emotional_honesty"],
          addTags: ["family", "trust"],
          log: "你以后之所以还敢认真和重要的人沟通，往往就因为年轻时有过被好好听完的经验。"
        }),
        choice({
          text: "只挑一半说，保留一半给自己慢慢消化。",
          effects: {
            age: 0,
            stats: { mental: 1, happiness: 1, familySupport: 2 }
          },
          addFlags: ["careful_openness"],
          addTags: ["family", "selfhood"],
          log: "你还没有完全学会袒露自己，但至少开始知道，有些事不是非得一个人闷到天亮。"
        }),
        choice({
          text: "还是先藏着，怕一旦说出来就会让期待和担心更多。",
          effects: {
            age: 0,
            stats: { mental: -2, stress: 2, familySupport: -1 }
          },
          addFlags: ["emotionally_guarded"],
          addTags: ["distance", "pressure"],
          log: "哪怕家里并不坏，你也未必马上学得会开口。很多沉默，不全是因为没人爱你，也因为你太早习惯先自己消化。"
        })
      ]
    })
  ];

  const EARLY_ROMANCE_AND_YOUTH_EVENTS = [
    event({
      id: "classroom_note_distance",
      stage: "adolescence",
      title: "一点点私下接触，让喜欢开始真正有后果",
      text: "喜欢一个人久了以后，真正改变关系的往往不是大场面，而是一些很小的靠近。借笔记、帮忙留一句话、顺手问候，都会让彼此的位置开始和以前不一样。",
      minAge: 13,
      maxAge: 15,
      weight: 6,
      tags: ["adolescence", "romance"],
      conditions: condition({
        requiredRomanceFlags: ["romance_target_chosen"],
        activeRelationshipStatuses: ["noticed", "crush", "familiar", "close"]
      }),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你终于不只是把喜欢放在心里，而是开始面对一点点实际靠近会带来的变化。"
      }),
      choices: [
        choice({
          text: "用一些自然的小事把距离拉近，不急着把心意说满。",
          effects: {
            age: 0,
            stats: { happiness: 2, social: 2, mental: 1 }
          },
          addRomanceFlags: ["romance_contact_increased"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 8,
              status: "familiar",
              addFlags: ["school_contact_growing"],
              history: "你们开始有了一些不再只是偶然的接触，关系也比以前具体了一点。"
            }
          ],
          log: "这份喜欢第一次不只是想象，而是慢慢有了能被记住的小动作。"
        }),
        choice({
          text: "一遇到起哄和目光就缩回去，把心事重新藏好。",
          effects: {
            age: 0,
            stats: { happiness: -2, mental: -1, social: -1 }
          },
          addFlags: ["emotionally_guarded"],
          addRomanceFlags: ["romance_shrunk_back"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: -5,
              status: "crush",
              addFlags: ["shied_away_once"],
              history: "你一度想更靠近一点，但最后还是把这份心动收回了更安全的位置。"
            }
          ],
          log: "青春期的关系常常不是输给不喜欢，而是输给谁都不太扛得住被看见。"
        }),
        choice({
          text: "故意装得轻松一点，先试探对方会不会也回过头来。",
          effects: {
            age: 0,
            stats: { happiness: 1, social: 1, stress: 1 }
          },
          addRomanceFlags: ["romance_contact_increased"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 5,
              status: "ambiguous",
              addFlags: ["mutual_teasing"],
              history: "你没有把喜欢摊得太明，但关系已经开始进入一种彼此都能感觉到的微妙阶段。"
            }
          ],
          log: "你们之间开始有了一点暧昧的空气，谁都没说破，却都没法完全当作没发生。"
        })
      ]
    }),
    event({
      id: "sports_day_misunderstanding",
      stage: "adolescence",
      title: "青春期的误会，常常比真正的冲突更伤人",
      text: "一句被别人转述的话、一次没解释清楚的冷淡、一次没等到的回应，都足以让还不成熟的关系迅速变味。你和{activeLoveName}也碰到了一次类似的时刻。",
      minAge: 14,
      maxAge: 16,
      weight: 5,
      tags: ["adolescence", "romance"],
      conditions: condition({
        requiredRomanceFlags: ["romance_target_chosen"],
        activeRelationshipStatuses: ["familiar", "close", "ambiguous"],
        activeRelationshipMinAffection: 18
      }),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "靠近以后，误会也开始有了真实的杀伤力。"
      }),
      choices: [
        choice({
          text: "先把话讲开，不让猜测把关系越拖越歪。",
          effects: {
            age: 0,
            stats: { social: 3, mental: 2, happiness: 1 }
          },
          addFlags: ["conflict_solver", "emotional_honesty"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 7,
              status: "close",
              addFlags: ["misunderstanding_cleared"],
              history: "你没有让误会自己发酵，而是主动把那点别扭说开了。"
            }
          ],
          log: "很青涩，但你已经开始学会一种成年后也很难的能力：误会出现时，不先逃。"
        }),
        choice({
          text: "先赌一赌对方会不会自己明白，结果气氛越来越僵。",
          effects: {
            age: 0,
            stats: { happiness: -3, mental: -2, stress: 2 }
          },
          addRomanceFlags: ["relationship_neglected"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: -9,
              status: "estranged",
              addFlags: ["missed_explanation"],
              history: "你们都没有先开口，误会就在沉默里慢慢坐实了。"
            }
          ],
          log: "很多后来很难补的疏远，其实都是从“算了，先别说了”开始的。"
        }),
        choice({
          text: "表面装作无所谓，心里却把这件事记得很深。",
          effects: {
            age: 0,
            stats: { mental: -2, happiness: -1, discipline: 1 }
          },
          addFlags: ["trust_break", "emotionally_guarded"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: -5,
              addFlags: ["quiet_hurt"],
              history: "你没有把难过直接说出来，但那一下受伤确实悄悄留在了关系里面。"
            }
          ],
          log: "你看起来处理得很平静，可真正留下来的，是以后更难轻易把心交出去。"
        })
      ]
    }),
    event({
      id: "highschool_balance_feelings",
      stage: "highschool",
      title: "喜欢和成绩同时拉扯你时，你把哪一边放得更前",
      text: "到了高中，感情已经不再只是小波动。你会明显感觉到，一段关系真的会占用时间、情绪和注意力，而这些恰好都是你最稀缺的东西。",
      minAge: 15,
      maxAge: 17,
      weight: 6,
      tags: ["highschool", "romance"],
      conditions: condition({
        requiredRomanceFlags: ["romance_target_chosen"],
        activeRelationshipStatuses: ["familiar", "close", "ambiguous", "dating"],
        activeRelationshipMinAffection: 20
      }),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你开始感到，喜欢一个人这件事真的会动到整块生活结构。"
      }),
      choices: [
        choice({
          text: "把喜欢放在一条更克制、更长期的位置，不让它一下子压住生活节奏。",
          effects: {
            age: 0,
            stats: { discipline: 3, intelligence: 2, happiness: 1, stress: 1 }
          },
          addRomanceFlags: ["relationship_maintained"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 5,
              status: "close",
              addFlags: ["careful_balance"],
              history: "你没有把关系推得太快，而是试着在喜欢和现实之间找到一条能持续的线。"
            }
          ],
          log: "你没有把感情完全压掉，也没有任它失控，慢慢学会了怎样留住分寸。"
        }),
        choice({
          text: "先把更多精力留给成绩，主动把心事往后压。",
          effects: {
            age: 0,
            stats: { intelligence: 3, discipline: 2, happiness: -2, mental: -1 }
          },
          addFlags: ["career_first"],
          addRomanceFlags: ["romance_held_back"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: -6,
              addFlags: ["timing_blocked"],
              history: "你把现实放在了喜欢前面，这不是没有道理，只是关系也因此退回了一步。"
            }
          ],
          log: "那份喜欢没有立刻消失，只是被你放到了一个“以后再说”的位置。"
        }),
        choice({
          text: "情绪起伏明显变大，学习和关系都开始互相影响。",
          effects: {
            age: 0,
            stats: { happiness: 2, mental: -3, stress: 4, intelligence: -1 }
          },
          addFlags: ["teen_emotional_swing"],
          addRomanceFlags: ["relationship_intense"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 8,
              status: "ambiguous",
              addFlags: ["intense_highschool_phase"],
              history: "你们之间的情绪浓度明显提高了，可也因此更容易在波动里互相影响。"
            }
          ],
          log: "青春期关系最真实的地方，往往不是甜，而是它真的能让人一下子很亮、一下子又很乱。"
        })
      ]
    }),
    event({
      id: "graduation_confession_window",
      stage: "highschool",
      title: "毕业前的那个窗口，会决定这段心事最后停在哪",
      text: "高中快结束时，很多关系都会突然逼近一个要不要表态的时刻。你知道，如果什么都不做，这段心事可能很快就会被各自的人生方向冲散。",
      minAge: 17,
      maxAge: 18,
      weight: 5,
      tags: ["highschool", "romance"],
      conditions: condition({
        requiredRomanceFlags: ["romance_target_chosen"],
        activeRelationshipStatuses: ["familiar", "close", "ambiguous"],
        activeRelationshipMinAffection: 26
      }),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你知道，再不做点什么，这段感情大概率就会留在青春期的雾里。"
      }),
      choices: [
        choice({
          text: "把喜欢认真说出来，哪怕只换来一个短暂但真实的回应。",
          effects: {
            age: 0,
            stats: { happiness: 5, social: 3, mental: 2 }
          },
          addFlags: ["first_love"],
          addRomanceFlags: ["confessed_feelings"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 12,
              status: "short_dating",
              addFlags: ["campus_confession"],
              history: "你在毕业前把喜欢说了出来，这段关系因此短暂而真实地开始过。"
            }
          ],
          log: "无论之后走不走得远，这次开口本身都会成为你人生里一块很清楚的记忆。"
        }),
        choice({
          text: "还是把话留在心里，让它停在彼此都隐约知道的位置。",
          effects: {
            age: 0,
            stats: { happiness: -2, mental: -1, intelligence: 1 }
          },
          addFlags: ["missed_love"],
          addRomanceFlags: ["romance_held_back"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: -2,
              addFlags: ["graduation_unsaid"],
              history: "你没有把话说破，于是这段感情停在了谁都能感到、却谁都没真正承认的位置。"
            }
          ],
          log: "以后你会慢慢知道，很多遗憾并不是输给不喜欢，而是输给时间窗口只开了一次。"
        }),
        choice({
          text: "先给彼此一个很轻的约定，看看离开校园后还能不能继续。",
          effects: {
            age: 0,
            stats: { happiness: 3, mental: 1, stress: 1 }
          },
          addRomanceFlags: ["relationship_maintained"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 8,
              status: "dating",
              addFlags: ["graduation_promise"],
              history: "你们没有把未来说得太满，但还是在毕业前留了一句愿意继续试试的承诺。"
            }
          ],
          log: "那不是特别成熟的约定，却足够真诚，也足够改变你之后看待关系的方式。"
        })
      ]
    })
  ];

  const PARAMETER_AND_LATER_LINK_EVENTS = [
    event({
      id: "college_money_and_pride",
      stage: "college",
      title: "开始管自己的钱以后，你第一次正面碰到现实感",
      text: "离开中学之后，钱不再只是家里人去处理的事情。生活费、兼职、消费欲、同龄人的差距和自己的体面，都会让财富、压力和自尊第一次被放到一张桌子上。",
      minAge: 18,
      maxAge: 22,
      weight: 6,
      tags: ["college", "growth"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你开始第一次真正感到，钱会直接决定一个人能不能松弛地生活。"
      }),
      choices: [
        choice({
          text: "把账目和生活都管得更细一点，先把基础安全感攒起来。",
          effects: {
            age: 0,
            stats: { money: 6, discipline: 4, stress: -1, mental: 1 }
          },
          addFlags: ["money_management", "financial_awareness"],
          addTags: ["stability", "growth"],
          log: "你学会的不是抠，而是让生活别总在月底变得狼狈。"
        }),
        choice({
          text: "去做点兼职，想靠自己把选择权多挣一点回来。",
          effects: {
            age: 0,
            stats: { money: 10, stress: 3, career: 2, discipline: 2, health: -1 }
          },
          addFlags: ["early_part_time", "work_first_after_college"],
          addTags: ["growth", "responsibility"],
          log: "钱来得更辛苦了，可“自己能解决一点问题”的感觉也开始真的长在你身上。"
        }),
        choice({
          text: "先按心情花，等现实追上来时再想办法补。",
          effects: {
            age: 0,
            stats: { money: -6, stress: 4, happiness: 1, discipline: -3 }
          },
          addFlags: ["money_anxiety", "loose_routine"],
          addTags: ["drift", "pressure"],
          log: "短暂的轻松很真实，月底的焦虑也一样真实。很多财务习惯，就是在这种时候慢慢定型的。"
        })
      ]
    }),
    event({
      id: "mental_repair_window",
      stage: "young_adult",
      title: "有段时间，你不得不认真处理自己的心理状态",
      text: "进入成人世界以后，很多人会第一次承认，自己不是单靠忍耐就能一直往前走。压力、失眠、迟钝、情绪崩塌、长期麻木，终于逼你面对“我到底要不要先救自己”这件事。",
      minAge: 22,
      maxAge: 30,
      weight: 6,
      tags: ["young_adult", "growth"],
      conditions: condition({
        minStats: {
          stress: 46
        }
      }),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你越来越难把状态问题当成“熬一熬就会过去”的小事。"
      }),
      choices: [
        choice({
          text: "认真求助、休整或者学习稳定自己的方法，不再把痛苦只处理成硬扛。",
          effects: {
            age: 0,
            stats: { mental: 8, health: 4, happiness: 3, stress: -6 }
          },
          addFlags: ["therapy_started", "recovery_turn"],
          addTags: ["health", "growth"],
          log: "你没有因为求助就变弱，反而开始真正学会怎样把自己从长期内耗里捞出来。"
        }),
        choice({
          text: "先缩短欲望和社交，把日子尽量过成可控的样子。",
          effects: {
            age: 0,
            stats: { discipline: 3, stress: -2, happiness: -1, social: -2, mental: 2 }
          },
          addFlags: ["self_protection_pattern"],
          addTags: ["stability", "distance"],
          log: "你没有彻底好起来，但先把生活缩到了自己勉强能托住的范围里。"
        }),
        choice({
          text: "继续告诉自己没事，把所有问题都压到效率和忙碌底下。",
          effects: {
            age: 0,
            stats: { career: 2, stress: 4, mental: -5, happiness: -3, health: -2 }
          },
          addFlags: ["chronic_stress", "emotional_shutdown"],
          addTags: ["pressure", "wound"],
          log: "你把状态问题处理成了更强的执行和更少的感受，可代价并不会真的消失。"
        })
      ]
    }),
    event({
      id: "family_support_rebalancing",
      stage: "young_adult",
      title: "成年以后，你和原生家庭的支持关系开始重排",
      text: "长大之后，家庭支持不再只是给钱或不管你，而是要重新谈边界、责任和彼此能承受的重量。你会发现，原生家庭并不会因为你成年就自动变简单。",
      minAge: 24,
      maxAge: 32,
      weight: 6,
      tags: ["young_adult", "family"],
      conditions: condition({
        someFlags: ["family_dialogue", "family_conflict_seed", "control_family", "financial_tight_home", "parents_close"]
      }),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你开始第一次用成年人的视角重新看待原生家庭：它还能给你什么，你又该从里面拿回多少自己。"
      }),
      choices: [
        choice({
          text: "重新谈边界和支持，让关系慢慢从命令或亏欠改成更平衡的相处。",
          effects: {
            age: 0,
            stats: { familySupport: 7, mental: 3, happiness: 2, stress: -2 }
          },
          addFlags: ["family_repair", "boundary_awareness"],
          addTags: ["family", "growth"],
          log: "你没有要求一切瞬间变好，只是开始认真重建一种更像成年人之间的家庭关系。"
        }),
        choice({
          text: "继续把能扛的都自己扛，尽量不再回头求任何支持。",
          effects: {
            age: 0,
            stats: { discipline: 2, familySupport: -4, stress: 2, mental: -2, career: 1 }
          },
          addFlags: ["emotionally_independent", "solo_pattern"],
          addTags: ["selfhood", "distance"],
          log: "你把独立走得更彻底了，也把很多原本能被分担的重量继续留在了自己这边。"
        }),
        choice({
          text: "在责任和愧疚里来回拉扯，关系没有断，却始终松不开。",
          effects: {
            age: 0,
            stats: { familySupport: -1, stress: 4, mental: -3, happiness: -2 }
          },
          addFlags: ["family_pressure", "inner_conflict_teen"],
          addTags: ["family", "pressure"],
          log: "你和家庭的距离没有真正拉开，关系也没有真正修复，于是很多力都继续耗在了里面。"
        })
      ]
    }),
    event({
      id: "relationship_and_work_tradeoff",
      stage: "family",
      title: "稳定关系以后，你开始正面碰到事业和陪伴的时间分配",
      text: "真正长期的关系里，幸福感不是白来的。工作上升期、家庭照料、自己的疲惫和伴侣需要，会同时抢同一块时间。你得决定谁先、谁后、谁来承担代价。",
      minAge: 28,
      maxAge: 36,
      weight: 6,
      tags: ["family", "career"],
      conditions: condition({
        activeRelationshipStatuses: ["dating", "steady", "reconnected"],
        activeRelationshipMinAffection: 38
      }),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "这已经不只是“喜不喜欢”的问题，而是“时间和精力到底往哪边倾斜”的现实问题。"
      }),
      choices: [
        choice({
          text: "给关系留出更稳定的时间，哪怕事业推进慢一点也认。",
          effects: {
            age: 0,
            stats: { happiness: 4, mental: 2, career: -1, stress: -2, familySupport: 2 }
          },
          addFlags: ["family_priority", "long_term_partner"],
          addTags: ["family", "stability"],
          addRomanceFlags: ["relationship_maintained"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 10,
              status: "steady",
              addFlags: ["showed_up_consistently"],
              history: "你把很多具体时间留给了对方，关系也因此更像一种被持续经营的生活。"
            }
          ],
          log: "你没有把陪伴当作有空再说的附属项，而是真的把它排进了人生结构。"
        }),
        choice({
          text: "先把势头押在事业上，希望等站稳以后再补回来。",
          effects: {
            age: 0,
            stats: { career: 4, money: 4, stress: 3, happiness: -2, mental: -1 }
          },
          addFlags: ["career_first"],
          addTags: ["ambition", "pressure"],
          addRomanceFlags: ["relationship_neglected"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: -8,
              addFlags: ["career_came_first_again"],
              history: "你把更多时间投给了工作，关系并没有立刻出事，却明显少了被认真对待的感觉。"
            }
          ],
          log: "很多人都以为以后能补回来，可关系里最容易被错过的，恰恰是当下那段需要你在场的时间。"
        }),
        choice({
          text: "试着把规则和期待谈清楚，让彼此都别在疲惫里靠猜。",
          effects: {
            age: 0,
            stats: { social: 3, mental: 2, stress: -1, happiness: 2 }
          },
          addFlags: ["emotional_honesty", "boundary_awareness"],
          addTags: ["relationship", "growth"],
          addRomanceFlags: ["relationship_maintained"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 7,
              status: "steady",
              addFlags: ["rules_reworked"],
              history: "你们没有把不满拖成旧账，而是把时间、分工和期待重新谈了一遍。"
            }
          ],
          log: "你开始知道，一段长期关系真正成熟的地方，常常是敢不敢把难处和期待都说清。"
        })
      ]
    })
  ];

  const STAGE_LOOP_EVENTS = [
    event({
      id: "school_term_rhythm_loop",
      stage: "school",
      title: "一个普通学期，也会悄悄改写你",
      text: "并不是每段成长都靠大事推动。更多时候，人的习惯、自信和关系感，都是在一个又一个看起来差不多的学期里慢慢长出来的。",
      minAge: 7,
      maxAge: 12,
      weight: 1,
      repeatable: true,
      tags: ["school", "growth"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "又一个学期过去，你并没有一下子变成别的人，但很多小的倾向还在继续累。"
      }),
      choices: [
        choice({
          text: "把日常一点点过稳，习惯也慢慢替你站住了脚。",
          effects: {
            age: 1,
            stats: { discipline: 2, intelligence: 2, stress: -1 }
          },
          addFlags: ["study_routine_seed"],
          log: "真正能留下来的改变，常常不是一时爆发，而是重复里积出来的秩序。"
        }),
        choice({
          text: "同龄人的眼光还是很重，心情也跟着起起落落。",
          effects: {
            age: 1,
            stats: { social: 1, happiness: -1, mental: -1 }
          },
          addFlags: ["social_vigilance"],
          log: "你还在学着和他人的评价相处，这件事比看起来更慢。"
        }),
        choice({
          text: "给自己留一点玩和想象的空地，没让成长只剩安排。",
          effects: {
            age: 1,
            stats: { happiness: 2, mental: 1, intelligence: 1 }
          },
          addFlags: ["free_time_childhood"],
          log: "那点不被塞满的空白，看似没什么用，却在悄悄给你留下弹性。"
        })
      ]
    }),
    event({
      id: "teen_social_climate_loop",
      stage: "adolescence",
      title: "青春期很多变化，都是一阵一阵地来的",
      text: "心情、关系、成绩、身体感受和自我评价，都不会一次定型。它们会在一段时间里反复涨落，而你也在这些波动里慢慢学着处理自己。",
      minAge: 13,
      maxAge: 15,
      weight: 1,
      repeatable: true,
      tags: ["adolescence", "growth"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "青春期没有完全平稳的阶段，你只是逐渐学会了怎么在波动里继续生活。"
      }),
      choices: [
        choice({
          text: "把注意力收回一点，先稳住自己的节奏。",
          effects: {
            age: 1,
            stats: { mental: 2, discipline: 2, social: -1 }
          },
          addFlags: ["self_reference_seed"],
          log: "你没法让所有事都顺，可你开始知道什么叫先把自己稳住。"
        }),
        choice({
          text: "继续在同龄人的关系里试、撞、靠近，也因此更快长大。",
          effects: {
            age: 1,
            stats: { social: 2, happiness: 1, mental: -1 }
          },
          addFlags: ["peer_belonging"],
          log: "你还在社交里受伤，也还在社交里学会很多别的成长方式。"
        }),
        choice({
          text: "把不安尽量压成执行和用功，不让自己看起来太乱。",
          effects: {
            age: 1,
            stats: { intelligence: 2, discipline: 2, stress: 2, mental: -2 }
          },
          addFlags: ["perfectionism_seed"],
          log: "你越来越会维持表面的稳定，可心里的消耗也在一点点累。"
        })
      ]
    }),
    event({
      id: "highschool_grind_loop",
      stage: "highschool",
      title: "高中生活真正难的是，很多天都差不多却不能松",
      text: "真正拉开差距的未必是某一次大考，而是那些看起来差不多、实际上很考验耐力的普通日子。高中的消耗感，常常就长在这种重复里。",
      minAge: 16,
      maxAge: 18,
      weight: 1,
      repeatable: true,
      tags: ["highschool", "school"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "高压并不总以大事出现，更多时候它只是连续很多天都不能真正松掉。"
      }),
      choices: [
        choice({
          text: "把作息、练习和节奏一点点校正，先求能持续。",
          effects: {
            age: 1,
            stats: { intelligence: 2, health: 1, discipline: 2, stress: -1 }
          },
          addFlags: ["study_system_built"],
          log: "你发现真正有用的不是一时狠，而是能不能让自己稳定地继续。"
        }),
        choice({
          text: "继续靠硬顶推进，短期没掉队，身体却先记账。",
          effects: {
            age: 1,
            stats: { intelligence: 2, health: -2, stress: 3, mental: -2 }
          },
          addFlags: ["overworked_seed", "chronic_stress"],
          log: "你把很多难关都扛过去了，但代价也并没有真的消失。"
        }),
        choice({
          text: "给心里留一点出口，至少不让自己彻底麻掉。",
          effects: {
            age: 1,
            stats: { happiness: 2, mental: 2, intelligence: 1 }
          },
          addFlags: ["healthy_outlet"],
          log: "你没有因为高考临近就放弃自己全部的感受，这会替你保住一点很重要的活气。"
        })
      ]
    }),
    event({
      id: "young_adult_adjustment_loop",
      stage: "young_adult",
      title: "刚进入成人世界时，很多能力都只能边撞边学",
      text: "独立生活、花钱、工作、人际、情绪、关系和边界，不会因为成年就自动学会。你只是被现实一点点逼着，把这些课补起来。",
      minAge: 19,
      maxAge: 30,
      weight: 1,
      repeatable: true,
      tags: ["young_adult", "growth"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "成年不是一下子抵达的，而是在很多具体琐事里一格一格补出来的。"
      }),
      choices: [
        choice({
          text: "把生活拆开一点点学，慢慢让自己更像个能自我管理的大人。",
          effects: {
            age: 1,
            stats: { discipline: 2, money: 2, mental: 1, stress: -1 }
          },
          addFlags: ["self_built_structure"],
          log: "你没等谁来把生活教明白，而是自己一点点把它理顺了。"
        }),
        choice({
          text: "先顾眼前最急的那一块，很多别的事只能边乱边补。",
          effects: {
            age: 1,
            stats: { career: 2, stress: 2, mental: -1 }
          },
          addFlags: ["pressure_carrying"],
          log: "你没有余裕一步到位，只能在现实的推挤里先把最急的部分顶住。"
        }),
        choice({
          text: "给自己留一点恢复和发呆的空间，不让生活总像被追着跑。",
          effects: {
            age: 1,
            stats: { mental: 2, happiness: 2, health: 1, career: -1 }
          },
          addFlags: ["flexible_routine"],
          log: "你没有把每一分力都榨干，反而因此更容易把路走得长。"
        })
      ]
    }),
    event({
      id: "career_pressure_loop",
      stage: "career",
      title: "工作真正改变人的，常常不是一次节点，而是长期模式",
      text: "职业发展并不只靠关键机遇。更多时候，是你一段时间里怎么用力、怎么取舍、怎么消耗自己，慢慢把人生往某个方向推过去。",
      minAge: 30,
      maxAge: 50,
      weight: 1,
      repeatable: true,
      tags: ["career", "work"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "日子不会天天发生大事，但每天的工作方式都会留下结构性的后果。"
      }),
      choices: [
        choice({
          text: "把劲放在稳扎稳打上，接受慢一点却更可持续。",
          effects: {
            age: 1,
            stats: { career: 2, health: 1, mental: 1, discipline: 1 }
          },
          addFlags: ["steady_expert"],
          log: "你不再只想一把冲到更高的位置，也开始在意这条路能不能长期走下去。"
        }),
        choice({
          text: "继续把自己往前推，哪怕知道代价会落到别的地方。",
          effects: {
            age: 1,
            stats: { career: 3, money: 2, stress: 3, health: -2, happiness: -1 }
          },
          addFlags: ["overworked", "career_first"],
          log: "你确实更接近想要的位置了，可很多代价也在同步长出来。"
        }),
        choice({
          text: "把关系、身体和工作放回同一张桌子重新排优先级。",
          effects: {
            age: 1,
            stats: { mental: 2, happiness: 2, health: 1, career: 1, stress: -2 }
          },
          addFlags: ["stability_rebalance"],
          log: "你开始不再只问“值不值得拼”，也开始问“拼成这样以后，日子还像不像自己想要的样子”。"
        })
      ]
    }),
    event({
      id: "midlife_health_and_mood_loop",
      stage: "midlife",
      title: "到了中年，身体和心情都不再愿意无限配合",
      text: "人到中年以后，很多年轻时能拖的事都会开始反咬回来。作息、情绪、透支、关系里的疲惫，都会在这个阶段要求你重新处理。",
      minAge: 40,
      maxAge: 70,
      weight: 1,
      repeatable: true,
      tags: ["midlife", "health"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你越来越明显地感觉到，身体和情绪都开始要求更真实的照顾，而不是再被无限延期。"
      }),
      choices: [
        choice({
          text: "把休息、检查和恢复真正提上日程，不再总拿以后说事。",
          effects: {
            age: 1,
            stats: { health: 2, mental: 2, stress: -2, happiness: 1 }
          },
          addFlags: ["health_managed"],
          log: "你终于不再把照顾自己当作剩余项，而是开始把它当成生活结构的一部分。"
        }),
        choice({
          text: "还是先把责任顶完，很多疲惫继续往后压。",
          effects: {
            age: 1,
            stats: { career: 1, health: -2, mental: -2, stress: 3 }
          },
          addFlags: ["chronic_stress"],
          log: "你没有立刻出事，可那种持续超支的感觉已经越来越难忽略。"
        }),
        choice({
          text: "试着把节奏放缓一点，让日子别总处在应付模式里。",
          effects: {
            age: 1,
            stats: { happiness: 2, mental: 1, money: -1, stress: -1 }
          },
          addFlags: ["gentle_retirement"],
          log: "你不再把速度感当成全部价值，这个转念让很多生活层面的重量都松了一点。"
        })
      ]
    }),
    event({
      id: "later_life_settling_loop",
      stage: "later_life",
      title: "到了后半生，很多事都从“往上冲”改成了“怎么安顿”",
      text: "人到后半生以后，日子不一定更轻，却会越来越真实地逼你回答：什么还值得抓着，什么该放下，什么才是真正陪你走到后面的东西。",
      minAge: 63,
      maxAge: 92,
      weight: 1,
      repeatable: true,
      tags: ["later_life", "growth"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "后半生真正重要的课题，不再只是多拿一点什么，而是怎样把现有的人生安顿得更像自己。"
      }),
      choices: [
        choice({
          text: "把关系和生活重新过稳，接受很多事已经不必再争最后一口气。",
          effects: {
            age: 1,
            stats: { happiness: 2, mental: 2, stress: -2, familySupport: 1 }
          },
          addFlags: ["gentle_retirement"],
          log: "你不再把所有评价都放在外面，而是开始更认真地看日子本身有没有被过顺。"
        }),
        choice({
          text: "仍旧舍不得完全松开速度感，总想再往前够一点。",
          effects: {
            age: 1,
            stats: { career: 1, health: -2, stress: 2, mental: -1 }
          },
          addFlags: ["overworked"],
          log: "哪怕到了后半生，你还是很难立刻和“再拼一点”这件事彻底分开。"
        }),
        choice({
          text: "把更多心思放回身体、兴趣和陪伴，让生活重新有点柔软。",
          effects: {
            age: 1,
            stats: { health: 2, happiness: 2, mental: 1, social: 1 }
          },
          addFlags: ["community_role"],
          log: "你慢慢把很多年里被搁置的部分重新捡回来，日子也因此显得更宽了一点。"
        })
      ]
    })
  ];

  const EARLY_CONTINUITY_EVENTS = [
    event({
      id: "childhood_move_and_neighbor",
      stage: "childhood",
      title: "一次搬家，让你第一次知道“熟悉感”也会突然被换掉",
      text: "小时候的搬家不是简单换个地址。房间、楼道、窗外声音、常见的人，都会一起被替换。有人因此更快适应新环境，也有人会把“突然失去熟悉感”这件事记很多年。",
      minAge: 5,
      maxAge: 8,
      weight: 6,
      tags: ["childhood", "family", "growth"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "环境被换掉以后，你第一次真正体会到，原来关系感和安全感也会跟着地点一起变化。"
      }),
      choices: [
        choice({
          text: "你很快去认识邻居和新同学，把陌生环境慢慢过成熟悉。",
          effects: {
            age: 0,
            stats: { social: 3, happiness: 2, mental: 1 }
          },
          addFlags: ["moved_childhood_once", "adapt_fast"],
          addTags: ["growth", "relationship"],
          log: "你后来之所以没有那么怕新环境，很大一部分底气就是在这种小时候被逼着重新开始的经验里长出来的。"
        }),
        choice({
          text: "表面适应了，心里却把以前那种熟悉感惦记了很久。",
          effects: {
            age: 0,
            stats: { happiness: -2, mental: -1, intelligence: 1 }
          },
          addFlags: ["moved_childhood_once", "sensitive_attachment"],
          addTags: ["wound", "selfhood"],
          log: "你后来会更在意“稳定留下来的人”，并不只是天生恋旧，而是很早就知道熟悉感消失是什么感觉。"
        }),
        choice({
          text: "你开始更依赖自己的小习惯和小世界来稳住心情。",
          effects: {
            age: 0,
            stats: { mental: 2, intelligence: 2, social: -1 }
          },
          addFlags: ["moved_childhood_once", "self_soothing_seed"],
          addTags: ["selfhood", "stability"],
          log: "很多后来能让你在变化里撑住自己的东西，其实是从小时候这种被迫适应里慢慢练出来的。"
        })
      ]
    }),
    event({
      id: "primary_duty_partner_memory",
      stage: "school",
      title: "小学那种一起值日、一起被老师点名的关系，会悄悄留下很长后劲",
      text: "小学的人际并不复杂，却很容易把某些固定搭档过成特别的人。一起值日、一起被留下改作业、一起去办公室交本子，这些小事会让孩子很早开始理解“偏向谁”的感觉。",
      minAge: 9,
      maxAge: 11,
      weight: 6,
      tags: ["school", "friendship", "growth"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你第一次开始隐约知道，人与人之间的特别，很多时候就是从这种很普通的小搭档关系里长出来的。"
      }),
      choices: [
        choice({
          text: "你很珍惜这种固定搭档带来的安心感，也更敢于主动靠近别人。",
          effects: {
            age: 0,
            stats: { social: 3, happiness: 3 }
          },
          addFlags: ["duty_pair_memory", "peer_belonging"],
          addTags: ["relationship", "stability"],
          log: "你后来愿意相信关系可以慢慢熟起来，和这种年纪很小就体验过的稳定陪伴有关。"
        }),
        choice({
          text: "一旦这种关系因为换座位或换班散掉，你会格外失落。",
          effects: {
            age: 0,
            stats: { happiness: -2, mental: -1, social: 1 }
          },
          addFlags: ["duty_pair_memory", "sensitive_attachment"],
          addTags: ["relationship", "wound"],
          log: "你很早就开始知道，关系并不会因为相处得好就自动留下，这会让你以后更怕突然被换走。"
        }),
        choice({
          text: "你把这份熟悉当成普通事，后来却越来越容易在细节里记住别人。",
          effects: {
            age: 0,
            stats: { intelligence: 1, social: 2, happiness: 1 }
          },
          addFlags: ["duty_pair_memory", "early_observer"],
          addTags: ["growth", "relationship"],
          log: "你开始懂得，很多关系不是靠大场面建立的，而是靠反复一起做小事慢慢长出来的。"
        })
      ]
    }),
    event({
      id: "middle_school_tutoring_companion",
      stage: "adolescence",
      title: "补课班、兴趣班和放学后的同行，把青春期很多关系推得比白天更近",
      text: "青春期真正容易长出故事的，往往不是课堂正中央，而是补课结束后一起等车、兴趣班下课后一起买东西、天黑前多走那一小段路的时间。",
      minAge: 13,
      maxAge: 15,
      weight: 6,
      tags: ["adolescence", "growth", "relationship"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你开始明白，真正会让人越来越在意彼此的，很多时候并不是告白，而是那些白天制度之外的额外相处。"
      }),
      choices: [
        choice({
          text: "你很珍惜这种同行和额外聊天，慢慢学会把喜欢和亲近放进普通日常。",
          effects: {
            age: 0,
            stats: { social: 3, happiness: 2, mental: 1 }
          },
          addFlags: ["after_class_companion_memory", "emotional_openness"],
          addTags: ["relationship", "romance"],
          log: "你后来会更容易被“有人愿意和你多走一段路”打动，和这种青春期经验有很深关系。"
        }),
        choice({
          text: "你怕别人看出来，于是总把很多原本能继续的靠近按回去。",
          effects: {
            age: 0,
            stats: { happiness: -2, social: -1, discipline: 1 }
          },
          addFlags: ["after_class_companion_memory", "romance_held_back"],
          addTags: ["romance", "distance"],
          log: "你很早就知道自己会心动，也很早就学会了在心动发生时先把它往回收一点。"
        }),
        choice({
          text: "你在这种同行里第一次感觉到，原来关系也可能被误会、被起哄、被放大。",
          effects: {
            age: 0,
            stats: { social: 1, happiness: -1, mental: -1 }
          },
          addFlags: ["after_class_companion_memory", "social_vigilance"],
          addTags: ["relationship", "pressure"],
          log: "你后来之所以对暧昧里的目光和气氛那么敏感，也和这种青春期里被围观的经验有关。"
        })
      ]
    }),
    event({
      id: "highschool_library_rain_shelter",
      stage: "highschool",
      title: "晚自习、图书馆和雨天檐下，是很多高中关系真正变深的地方",
      text: "高中的感情往往不是从轰烈场面开始的，而是在一起占座、一起去便利店、雨天一起等车、图书馆闭馆后还想再多说两句的那些缝隙里慢慢长出来。",
      minAge: 16,
      maxAge: 18,
      weight: 6,
      tags: ["highschool", "growth", "romance"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你开始越来越清楚，高中最容易留下后劲的关系，往往都长在那些压得很紧却又偷偷留出一点温柔的时间缝里。"
      }),
      choices: [
        choice({
          text: "你愿意把这些很小的相处当回事，也因此更懂长期陪伴为什么会动人。",
          effects: {
            age: 0,
            stats: { happiness: 3, mental: 2, social: 2 }
          },
          addFlags: ["rainy_library_memory", "relationship_maintained"],
          addTags: ["romance", "stability"],
          log: "你后来会珍惜那些并不张扬、却很持续的陪伴感，很大一部分就是从这种高中时期的相处里长出来的。"
        }),
        choice({
          text: "你会被这些时刻打动，但也因此更怕毕业和分流把一切冲散。",
          effects: {
            age: 0,
            stats: { happiness: 1, mental: -1, stress: 2 }
          },
          addFlags: ["rainy_library_memory", "missed_love"],
          addTags: ["romance", "pressure"],
          log: "你很早就知道，最动人的关系未必最稳，这会让你后来在靠近和退后之间反复犹豫。"
        }),
        choice({
          text: "你提醒自己别陷得太深，把很多情绪继续留在高考以后。",
          effects: {
            age: 0,
            stats: { intelligence: 2, discipline: 2, happiness: -1 }
          },
          addFlags: ["rainy_library_memory", "career_first"],
          addTags: ["ambition", "romance"],
          log: "你不是没有被打动，只是又一次把很具体的心动往未来延后了。"
        })
      ]
    })
  ];

  const ADDITIONAL_EARLY_TEXTURE_EVENTS = [
    event({
      id: "sibling_or_only_child_position",
      stage: "school",
      title: "家里有没有手足，会很早改变你怎么看待亲近、比较和被偏向",
      text: "小时候对“关系”的第一批理解，常常不是从朋友开始，而是从家里开始。有没有兄弟姐妹、你是不是更常被照顾、被拿来比较，或者更早被要求懂事，都会慢慢长成你后面处理亲密和冲突的底色。",
      minAge: 7,
      maxAge: 10,
      weight: 6,
      tags: ["school", "family", "growth"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你很早就在家里先体验到，关系并不只是被爱，也包括竞争、让步、依赖和责任。"
      }),
      choices: [
        choice({
          text: "你更像被照顾和被围着看的那一个，也因此更习惯把很多感受留给自己慢慢长。",
          effects: {
            age: 0,
            stats: { happiness: 2, mental: 1, social: -1 }
          },
          addFlags: ["only_child_pattern", "sensitive_attachment"],
          addTags: ["selfhood", "family"],
          log: "你后来在关系里会更在意自己是不是被认真放在眼前，和这种早早习惯了被聚焦也被独自承受的经验有关。"
        }),
        choice({
          text: "你常常要在比较和争位置里长大，所以很早就知道关系里也会有输赢和偏向。",
          effects: {
            age: 0,
            stats: { social: 2, discipline: 2, happiness: -1, mental: -1 }
          },
          addFlags: ["sibling_competition_seed", "comparison_wound"],
          addTags: ["pressure", "relationship"],
          log: "你后来会更快察觉关系里的冷热和高低，不只是敏感，也是因为你很早就在家里学过这种空气。"
        }),
        choice({
          text: "你更早被要求照顾别人、让着别人，于是责任感也比同龄人更早长出来。",
          effects: {
            age: 0,
            stats: { familySupport: 2, social: 2, discipline: 2, happiness: -1 }
          },
          addFlags: ["caregiver_sibling", "responsibility_seed"],
          addTags: ["responsibility", "family"],
          log: "你后来之所以很容易在关系里先照顾别人，和这种小时候就被推去当‘更懂事的人’的经验有关。"
        })
      ]
    }),
    event({
      id: "being_liked_for_the_first_time",
      stage: "adolescence",
      title: "第一次察觉到，原来也有人会悄悄喜欢你",
      text: "青春期很多人第一次重新看自己，不只是因为自己喜欢上谁，也因为忽然发现，原来自己也可能成为别人眼里特别的那个人。那种被留意、被起哄、被小心试探的感觉，会很直接地改写自尊心和边界感。",
      minAge: 13,
      maxAge: 16,
      weight: 6,
      tags: ["adolescence", "romance", "growth"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你第一次从别人看你的方式里，重新理解了一遍自己。"
      }),
      choices: [
        choice({
          text: "你没有把这件事当玩笑，反而开始更认真地理解别人的靠近和自己的回应。",
          effects: {
            age: 0,
            stats: { social: 3, happiness: 3, mental: 1 }
          },
          addFlags: ["liked_once_early", "emotional_honesty"],
          addTags: ["romance", "growth"],
          log: "你后来会更尊重关系里的心意，不只是因为你喜欢过别人，也因为你认真接住过一次别人递来的喜欢。"
        }),
        choice({
          text: "你装作不知道，把一切都压回普通同学和普通朋友的位置。",
          effects: {
            age: 0,
            stats: { discipline: 1, happiness: -1, mental: -1 }
          },
          addFlags: ["missed_signal", "emotionally_guarded"],
          addTags: ["romance", "distance"],
          log: "你后来在暧昧里总会先往后退一点，也和这种年纪很小时就学会装作没看见有关。"
        }),
        choice({
          text: "你因为被起哄和被围观很不自在，开始更警惕感情会不会把自己推到目光中心。",
          effects: {
            age: 0,
            stats: { happiness: -2, social: -1, mental: -1 }
          },
          addFlags: ["social_vigilance", "romance_held_back"],
          addTags: ["pressure", "romance"],
          log: "你不是不需要被喜欢，只是太早把“被喜欢”跟“被围观、被议论”绑在了一起。"
        })
      ]
    }),
    event({
      id: "class_split_and_group_shift",
      stage: "adolescence",
      title: "分班之后，你第一次很具体地体会到，人际关系也会被制度突然打散",
      text: "分班、换座位、升入重点班或普通班，往往不是单纯的学习安排。它会把你原本熟悉的人直接分散，也会让一些本来只是普通来往的人一下变成回头也看不见的旧名字。",
      minAge: 13,
      maxAge: 16,
      weight: 6,
      tags: ["adolescence", "friendship", "growth"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你开始明白，关系并不会只因为彼此在意就自动留下，很多时候它还需要被主动维护。"
      }),
      choices: [
        choice({
          text: "你主动去找旧朋友、旧同桌和旧搭子，把关系尽量续回日常里。",
          effects: {
            age: 0,
            stats: { social: 3, happiness: 2, mental: 1 }
          },
          addFlags: ["kept_after_split", "relationship_maintained"],
          addTags: ["relationship", "stability"],
          log: "你后来更懂得维持关系，不只是天生重感情，也因为很早就知道放着不管真的会散。"
        }),
        choice({
          text: "你发现很多人其实就这样淡掉了，心里因此多了一点‘别太当真’的防备。",
          effects: {
            age: 0,
            stats: { happiness: -2, mental: -1, social: -1 }
          },
          addFlags: ["class_split_loss", "emotionally_guarded"],
          addTags: ["relationship", "wound"],
          log: "你后来会更怕很多关系只活在当下场景里，也和这种分班以后很快就被打散的经验有关。"
        }),
        choice({
          text: "你索性把这次变化当成重新进新圈子的机会，逼自己再长一层适应力。",
          effects: {
            age: 0,
            stats: { social: 2, intelligence: 1, happiness: 1 }
          },
          addFlags: ["new_circle_adaptation", "adapt_fast"],
          addTags: ["growth", "selfhood"],
          log: "你后来没有那么怕陌生人和新圈子，和这种年轻时被迫重新融入的经历有很大关系。"
        })
      ]
    }),
    event({
      id: "family_role_in_teen_years",
      stage: "highschool",
      title: "青春期以后，你开始更清楚自己在家里到底扮演什么角色",
      text: "有的人是家里最被寄望的那个，有的人是最会安抚气氛的那个，也有人慢慢成了不太麻烦别人、出了事先自己扛的那个。这个角色未必是你自己选的，却会深深影响你后面怎么恋爱、怎么工作、怎么处理责任。",
      minAge: 15,
      maxAge: 18,
      weight: 6,
      tags: ["highschool", "family", "growth"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你开始第一次从更清楚的角度看见，自己在原生家庭里到底被放在什么位置。"
      }),
      choices: [
        choice({
          text: "你越来越像那个被寄予厚望的人，很多选择都会先往“别让人失望”上靠。",
          effects: {
            age: 0,
            stats: { intelligence: 2, discipline: 3, stress: 2, happiness: -1 }
          },
          addFlags: ["high_expectation_child", "achievement_compensation"],
          addTags: ["ambition", "pressure"],
          log: "你后来很难完全不在乎成绩、前途和表现，也和这种被寄予太多、太久的家庭位置分不开。"
        }),
        choice({
          text: "你更像家里的缓冲垫，习惯先看气氛、先照顾别人，再轮到自己。",
          effects: {
            age: 0,
            stats: { social: 2, familySupport: -1, mental: -2, stress: 2 }
          },
          addFlags: ["people_pleaser", "family_pressure"],
          addTags: ["family", "relationship"],
          log: "你后来在亲密关系里很容易先去收拾局面，不只是温柔，也因为你太熟悉当那个先稳住一切的人。"
        }),
        choice({
          text: "你慢慢决定把家里的角色和自己真正想活成的人分开一点。",
          effects: {
            age: 0,
            stats: { mental: 2, happiness: 2, social: 1 }
          },
          addFlags: ["self_definition_seed", "boundary_awareness"],
          addTags: ["selfhood", "growth"],
          log: "你后来之所以更能在关系和人生选择里守住自己，和这种青春期就开始练习把‘家里要的我’和‘我自己’分开有关。"
        })
      ]
    })
  ];

  window.LIFE_EXTRA_EVENTS = [
    ...(Array.isArray(window.LIFE_EXTRA_EVENTS) ? window.LIFE_EXTRA_EVENTS : []),
    ...FAMILY_BACKGROUND_EVENTS,
    ...EARLY_ROMANCE_AND_YOUTH_EVENTS,
    ...PARAMETER_AND_LATER_LINK_EVENTS,
    ...STAGE_LOOP_EVENTS,
    ...EARLY_CONTINUITY_EVENTS,
    ...ADDITIONAL_EARLY_TEXTURE_EVENTS
  ];
})();

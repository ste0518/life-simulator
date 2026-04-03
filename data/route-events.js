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
      relationshipEffects: toList(source.relationshipEffects),
      setActiveRelationship: typeof source.setActiveRelationship === "string" ? source.setActiveRelationship : null,
      clearActiveRelationship: Boolean(source.clearActiveRelationship),
      setEducationRoute: typeof source.setEducationRoute === "string" ? source.setEducationRoute : null,
      setCareerRoute: typeof source.setCareerRoute === "string" ? source.setCareerRoute : null,
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
      setEducationRoute: normalized.setEducationRoute,
      setCareerRoute: normalized.setCareerRoute,
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

  function buildRouteChoice(route, routeType) {
    return choice({
      text: route.optionText || route.name,
      setEducationRoute: routeType === "education" ? route.id : null,
      setCareerRoute: routeType === "career" ? route.id : null,
      conditions: condition(route.conditions || {}),
      next: route.id === "repeat_exam_route" ? "repeat_exam_year" : undefined
    });
  }

  const educationRoutes = Array.isArray(window.LIFE_EDUCATION_ROUTES) ? window.LIFE_EDUCATION_ROUTES : [];
  const careerRoutes = Array.isArray(window.LIFE_CAREER_ROUTES) ? window.LIFE_CAREER_ROUTES : [];

  window.LIFE_EXTRA_EVENTS = [
    ...(Array.isArray(window.LIFE_EXTRA_EVENTS) ? window.LIFE_EXTRA_EVENTS : []),
    event({
      id: "score_and_volunteer",
      stage: "transition",
      title: "分数出来之后，你要自己决定未来去向",
      text: "高考之后，摆在面前的不是自动播放的下一段，而是真正要由你承担后果的路线选择。城市、平台、自由度、钱、家里期待和你自己真正想试的方向，都挤在了这一刻。",
      minAge: 18,
      maxAge: 20,
      weight: 10,
      tags: ["gaokao", "choice", "route"],
      effectsOnEnter: mutation({
        effects: {
          age: 1,
          stats: {}
        },
        log: "你第一次切实感到，升学和去向不是一句文案，而是会改写后面几年生活结构的分流。"
      }),
      choices: educationRoutes.map((route) => buildRouteChoice(route, "education"))
    }),
    event({
      id: "graduation_offer",
      stage: "young_adult",
      title: "毕业之后：工作、深造、空白，还是回家缓一缓？",
      text: "二十出头的这一年，「下一步」不再自动播放。你可以把自己交给就业市场慢慢磨，也可以继续读书、暂时不工作，或先回到家庭的缓冲里——每条路都会改写账本、压力与关系距离。若选就业，你会进入求职回合（投递、面试、被拒与重复申请），拿到 offer 后再选城市与租房，并按年结算工资与支出。",
      minAge: 22,
      maxAge: 26,
      weight: 10,
      tags: ["career", "young_adult", "route"],
      conditions: condition({
        excludedCareerRouteIds: careerRoutes.map((route) => route.id)
      }),
      effectsOnEnter: mutation({
        effects: {
          age: 1,
          stats: {}
        },
        log: "你站在毕业的门槛上：这一次不是成绩单替你决定，而是你要自己签下一步。"
      }),
      choices: [
        choice({
          text: "进入就业市场，开始投递与面试（求职循环）。",
          setCareerRoute: "career_in_job_search",
          effects: { age: 0, stats: {} },
          log: "你把状态切成「求职者」，准备在一轮轮回音里把自己卖出去。"
        }),
        choice({
          text: "继续深造：考研/留学/读第二学位，把起薪再往后押。",
          setCareerRoute: "further_study_route",
          effects: { age: 0, stats: {} }
        }),
        choice({
          text: "暂时不工作：休整、试错、旅行或慢启动（经济压力会跟上来）。",
          setCareerRoute: "career_gap_year_after_degree",
          effects: { age: 0, stats: {} }
        }),
        choice({
          text: "回家/依赖家庭支持，先把生活放回熟悉的屋檐下。",
          setCareerRoute: "career_family_supported_home",
          effects: { age: 0, stats: {} }
        }),
        choice({
          text: "仍在迷茫期，先把日子过成「未命名状态」（更伤钱包与心理）。",
          setCareerRoute: "unemployed_drift_route",
          effects: { age: 0, stats: {} }
        }),
        ...careerRoutes
          .filter((route) => route.id === "career_early_labor_market")
          .map((route) => buildRouteChoice(route, "career")),
        ...careerRoutes
          .filter((route) => route.id === "career_vocational_trades")
          .map((route) => buildRouteChoice(route, "career"))
      ]
    }),
    event({
      id: "route_elite_campus_pressure",
      stage: "college",
      title: "高竞争环境会把机会和消耗一起放大",
      text: "平台更高以后，机会确实变多了，比较也会变得更密。你会同时接近更大的世界和更重的焦虑。",
      minAge: 18,
      maxAge: 23,
      weight: 7,
      tags: ["college", "education"],
      conditions: condition({
        educationRouteIds: ["elite_city_university"]
      }),
      effectsOnEnter: mutation({
        log: "高平台不会自动给你松弛感，它只是把可能性和压力同时拉近。"
      }),
      choices: [
        choice({
          text: "继续往前顶，先抢资源和位置。",
          effects: {
            age: 1,
            stats: { intelligence: 3, career: 3, stress: 4, happiness: -2 }
          },
          addFlags: ["high_competition_campus", "career_first"],
          addTags: ["ambition", "pressure"],
          log: "你在更高的平台里跑得更快，也更常觉得自己不能停。"
        }),
        choice({
          text: "主动找自己的节奏，不让比较吞掉生活。",
          effects: {
            age: 1,
            stats: { intelligence: 2, mental: 2, stress: -1, happiness: 1 }
          },
          addFlags: ["boundary_awareness", "study_system_built"],
          addTags: ["growth", "stability"],
          log: "你没有放弃竞争，只是开始更认真地保护自己别被它整块吞掉。"
        })
      ]
    }),
    event({
      id: "route_local_family_pull",
      stage: "college",
      title: "离家近会让照应和牵引同时更强",
      text: "本地读书更方便，也更容易让家庭持续影响你的时间安排、情绪和决定。安心感更强，边界课题也更早。",
      minAge: 18,
      maxAge: 23,
      weight: 7,
      tags: ["college", "family"],
      conditions: condition({
        educationRouteIds: ["local_university"]
      }),
      effectsOnEnter: mutation({
        log: "离家近不是纯轻松，它会让支持和牵绊一起变得具体。"
      }),
      choices: [
        choice({
          text: "多留一些时间给家里，关系稳了，自己的速度慢一点也认。",
          effects: {
            age: 1,
            stats: { familySupport: 5, happiness: 2, career: -1, stress: 1 }
          },
          addFlags: ["family_priority"],
          addTags: ["family", "stability"],
          log: "你把很多力气花在了维持家和自己的平衡上，关系更稳，个人速度也放慢了一点。"
        }),
        choice({
          text: "把家当后盾，但尽量把边界谈清楚。",
          effects: {
            age: 1,
            stats: { familySupport: 2, mental: 2, discipline: 2 }
          },
          addFlags: ["family_dialogue", "boundary_awareness"],
          addTags: ["family", "growth"],
          log: "你没有让距离近自动变成边界消失，而是试着把关系重新谈明白。"
        })
      ]
    }),
    event({
      id: "route_distant_independence",
      stage: "college",
      title: "外地读书以后，很多独立能力都得边撞边补",
      text: "离家之后，情绪、金钱、社交和生活节奏不再有人天然替你兜。独立长得更快，孤独也长得更快。",
      minAge: 18,
      maxAge: 23,
      weight: 7,
      tags: ["college", "growth"],
      conditions: condition({
        educationRouteIds: ["distant_university"]
      }),
      effectsOnEnter: mutation({
        log: "新的城市让你更自由，也逼你更快补上独立生活的很多课。"
      }),
      choices: [
        choice({
          text: "硬着头皮一项项学会，独立能力明显往上长。",
          effects: {
            age: 1,
            stats: { discipline: 3, mental: 2, social: 2, stress: 1 }
          },
          addFlags: ["self_built_structure", "city_seen_early"],
          addTags: ["selfhood", "growth"],
          log: "你不是天生会独立，只是被环境一步步逼着，把这些能力真的补出来了。"
        }),
        choice({
          text: "适应期很长，常常一边兴奋一边很想家。",
          effects: {
            age: 1,
            stats: { happiness: -1, mental: -1, social: 1, stress: 3 }
          },
          addFlags: ["homesick_phase"],
          addTags: ["selfhood", "pressure"],
          log: "离家带来的不只是自由，也是一种得靠自己慢慢熬过去的空落。"
        })
      ]
    }),
    event({
      id: "route_direct_work_burden",
      stage: "young_adult",
      title: "更早工作会让你更早成熟，也更早疲惫",
      text: "直接工作的人往往更早有收入，也更早理解职场、身体消耗和时间真正值多少钱。你懂事会更早，疲惫也会更早。",
      minAge: 19,
      maxAge: 24,
      weight: 7,
      tags: ["young_adult", "work"],
      conditions: condition({
        educationRouteIds: ["direct_work_route"]
      }),
      effectsOnEnter: mutation({
        log: "你比许多同龄人更早和现实正面碰撞，很多成熟和消耗都来得更早。"
      }),
      choices: [
        choice({
          text: "先把吃苦和成长都接住，尽快站稳脚跟。",
          effects: {
            age: 1,
            stats: { career: 4, money: 4, health: -2, stress: 3 }
          },
          addFlags: ["pressure_carrying"],
          addTags: ["work", "responsibility"],
          log: "你变得更能顶事了，也更容易习惯把自己一直放在高耗模式里。"
        }),
        choice({
          text: "边工作边补技能，不想让起点锁死后面所有选择。",
          effects: {
            age: 1,
            stats: { intelligence: 3, career: 3, money: 2, discipline: 2 }
          },
          addFlags: ["self_defined_goal"],
          addTags: ["growth", "independence"],
          log: "你没有把提前工作理解成被迫停在原地，而是继续给自己留后手。"
        })
      ]
    }),
    event({
      id: "route_high_pay_cost",
      stage: "career",
      title: "高压高薪路线，钱来得快，透支也来得快",
      text: "高压高薪不会只改一项收入，它会同时改写你的作息、关系、情绪稳定度和对时间的感知。",
      minAge: 25,
      maxAge: 36,
      weight: 8,
      tags: ["career", "work"],
      conditions: condition({
        careerRouteIds: ["high_pay_pressure_job"]
      }),
      effectsOnEnter: mutation({
        log: "你越来越清楚地知道，高收入不是单独到来的，它总带着别的账。"
      }),
      choices: [
        choice({
          text: "继续把势头顶住，短期先不松。",
          effects: {
            age: 1,
            stats: { money: 6, career: 4, health: -4, mental: -3, stress: 5 }
          },
          addFlags: ["overworked", "chronic_stress"],
          addTags: ["pressure", "ambition"],
          log: "你没有停下，钱和位置继续往上走，身体和情绪也继续替你记账。"
        }),
        choice({
          text: "及时调边界，不想让高薪一路换走自己的生活感。",
          effects: {
            age: 1,
            stats: { money: 3, health: 2, mental: 2, stress: -2 }
          },
          addFlags: ["boundary_awareness", "health_managed"],
          addTags: ["stability", "growth"],
          log: "你没有放弃这条路线，只是开始认真保护自己别被它完整吞掉。"
        })
      ]
    }),
    event({
      id: "route_startup_cashflow",
      stage: "career",
      title: "创业以后，现金流和判断力比热血更快决定你还能不能撑",
      text: "创业走过最兴奋的那段之后，真正难的往往是回款、现金流、合伙分歧和连续几次判断误差。风险不会因为你够拼就自动讲道理。",
      minAge: 24,
      maxAge: 38,
      weight: 8,
      tags: ["career", "risk"],
      conditions: condition({
        careerRouteIds: ["startup_route"]
      }),
      effectsOnEnter: mutation({
        log: "你开始越来越清楚地面对一个事实：创业不是一直冲，而是能不能一直不失控。"
      }),
      choices: [
        choice({
          text: "继续重押，把翻盘和增长都赌在下一轮机会里。",
          effects: {
            age: 1,
            stats: { career: 4, money: 4, debt: 8, stress: 6, mental: -2 }
          },
          addFlags: ["major_bet_loss", "debt_rollover"],
          addTags: ["risk", "pressure"],
          log: "你没有停手，而是把自己继续押进了更高波动的一轮里。"
        }),
        choice({
          text: "及时缩线，保公司也保自己，先活下来再说。",
          effects: {
            age: 1,
            stats: { career: 2, money: 1, debt: -2, stress: -1, mental: 1 }
          },
          addFlags: ["company_survived", "founder_pivot"],
          addTags: ["risk", "growth"],
          log: "你没有把创业理解成只能猛冲，而是在关键时刻学会了收。"
        })
      ]
    }),
    event({
      id: "route_freelance_wave",
      stage: "career",
      title: "自由职业最真实的部分，是没人替你扛波峰和波谷",
      text: "自由职业能给你很强的自主感，也会把现金流、接单焦虑和生活边界问题全部推回你自己手里。",
      minAge: 24,
      maxAge: 38,
      weight: 7,
      tags: ["career", "craft"],
      conditions: condition({
        careerRouteIds: ["freelance_route"]
      }),
      effectsOnEnter: mutation({
        log: "你开始知道，真正的自由不是没人管，而是所有后果都得自己接。"
      }),
      choices: [
        choice({
          text: "把作品和口碑继续往前做，先熬过波动期。",
          effects: {
            age: 1,
            stats: { career: 3, happiness: 2, discipline: 2, money: 1, stress: 2 }
          },
          addFlags: ["signature_work", "freelance_mainline"],
          addTags: ["craft", "growth"],
          log: "你没有因为波动就立刻退回稳妥，而是继续把手艺和口碑往前熬。"
        }),
        choice({
          text: "开始更认真算账，把自由感和生计都放到同一张桌子上。",
          effects: {
            age: 1,
            stats: { money: 3, discipline: 2, happiness: 1 }
          },
          addFlags: ["money_management"],
          addTags: ["craft", "stability"],
          log: "你没有放弃自由，只是开始认真处理“喜欢”和“现金流”之间的账。"
        })
      ]
    })
  ];
})();

(function () {
  "use strict";

  /*
    路线数据手动编辑说明：
    - 每个 route({ ... }) 就是一条独立可改的大学 / 工作路线。
    - conditions 决定这条路线何时可选。
    - apply 复用事件 mutation 结构，会真正改属性、flags、tags。
    - route-events.js 会直接读取这里的数据生成分流选项。
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

  function route(value) {
    const source = value && typeof value === "object" ? value : {};

    return {
      id: typeof source.id === "string" ? source.id : "",
      name: typeof source.name === "string" ? source.name : "未命名路线",
      category: typeof source.category === "string" ? source.category : "",
      summary: typeof source.summary === "string" ? source.summary : "",
      description: typeof source.description === "string" ? source.description : "",
      optionText: typeof source.optionText === "string" ? source.optionText : "",
      details: toList(source.details),
      conditions: condition(source.conditions),
      apply: mutation(source.apply)
    };
  }

  window.LIFE_EDUCATION_ROUTES = [
    route({
      id: "elite_city_university",
      name: "名校 / 高竞争环境",
      category: "college",
      summary: "把自己放进更高的平台和更陡的竞争里。",
      description: "名校和大城市能带来更大的眼界、机会和比较，也会持续抬高压力与自我要求。",
      optionText: "冲向名校和更高竞争环境。",
      details: ["学业压力更大", "资源和实习机会更强", "更容易接触高竞争圈层"],
      conditions: {
        minStats: { intelligence: 45 },
        someFlags: ["gaokao_breakthrough", "family_expectation_high", "resource_rich_home", "mentor_support", "study_system_built"]
      },
      apply: {
        effects: {
          stats: {
            intelligence: 6,
            career: 6,
            social: 2,
            happiness: -2,
            stress: 8,
            familySupport: -2
          }
        },
        addFlags: ["top_school", "big_city", "education_elite_city", "high_competition_campus"],
        addTags: ["ambition", "pressure"],
        log: "你把自己放进了更高的平台，也默认接受了那里的速度、比较和机会一起进场。"
      }
    }),
    route({
      id: "ordinary_university",
      name: "普通大学 / 稳定路线",
      category: "college",
      summary: "把大学当成稳稳积累的几年，不押最陡的风险。",
      description: "这条路不一定最耀眼，但相对可持续，允许你慢慢建立能力、社交和生活节奏。",
      optionText: "选一所普通大学，先把生活和成长接稳。",
      details: ["生活节奏相对平衡", "资源中等", "更容易把基础打扎实"],
      conditions: {},
      apply: {
        effects: {
          stats: {
            intelligence: 3,
            happiness: 3,
            social: 3,
            stress: 1,
            familySupport: 2
          }
        },
        addFlags: ["ordinary_college", "education_stable_college"],
        addTags: ["stability", "growth"],
        log: "你没有把一切都押在最陡的赛道上，而是给自己留下了一条更能稳定发力的路径。"
      }
    }),
    route({
      id: "local_university",
      name: "本地读书 / 离家近",
      category: "college",
      summary: "把距离留得更近，生活成本和家里牵引也会一起更近。",
      description: "本地读书更省钱，也更方便维持家庭关系，但独立感和新环境冲击会相对弱一些。",
      optionText: "留在本地读书，把家和生活放得更近。",
      details: ["家庭联系更紧", "生活成本较低", "独立成长速度相对慢一点"],
      conditions: {},
      apply: {
        effects: {
          stats: {
            happiness: 4,
            familySupport: 5,
            money: 4,
            social: 2,
            stress: -1
          }
        },
        addFlags: ["local_college", "hometown_tie", "education_local_college"],
        addTags: ["family", "stability"],
        log: "你把距离留在了可以随时回头的范围里，安心感更强，牵引也更强。"
      }
    }),
    route({
      id: "distant_university",
      name: "外地读书 / 独立成长",
      category: "college",
      summary: "离家更远，独立成长更快，孤独感也会更早到来。",
      description: "外地读书往往能拉开眼界和生活半径，也会更快逼你学会自理、社交和情绪管理。",
      optionText: "去外地读书，把自己放进更独立的生活里。",
      details: ["独立成长更明显", "社交圈会重组", "家庭距离和适应成本同步上升"],
      conditions: {},
      apply: {
        effects: {
          stats: {
            social: 4,
            mental: 1,
            familySupport: -3,
            stress: 4,
            discipline: 2
          }
        },
        addFlags: ["education_distant_college", "city_seen_early"],
        addTags: ["selfhood", "independence"],
        log: "你把自己从熟悉环境里拔出来了，很多成长因此更快，也更疼。"
      }
    }),
    route({
      id: "art_free_path",
      name: "艺术类 / 自由方向",
      category: "college",
      summary: "让表达、作品和自我定义占更重的位置。",
      description: "这条路更自由，也更不稳定。你会得到更强的表达空间，同时要更早面对作品、收入和他人理解之间的张力。",
      optionText: "走艺术类或更自由的方向。",
      details: ["表达空间更大", "收入和评价更波动", "圈层和恋爱对象池会明显不同"],
      conditions: {
        someFlags: ["long_term_hobby", "self_exploration_early", "signature_work", "craft_seed"]
      },
      apply: {
        effects: {
          stats: {
            happiness: 5,
            intelligence: 3,
            social: 3,
            career: 2,
            money: -2,
            stress: 3
          }
        },
        addFlags: ["education_art_path", "portfolio_path"],
        addTags: ["craft", "selfhood"],
        log: "你没有把未来只理解成稳定和正确，而是让表达与作品真的占了路线本身的一部分。"
      }
    }),
    route({
      id: "direct_work_route",
      name: "直接工作",
      category: "work",
      summary: "跳过传统大学，提前和现实、收入和社会规则正面接触。",
      description: "这条路更早赚钱，也更早承担工作风险和比较压力。你会更快成熟，也会更早失去一部分校园缓冲。",
      optionText: "直接工作或走技能就业路线。",
      details: ["更早赚钱", "更早面对社会规则", "会错过一部分校园资源"],
      conditions: {},
      apply: {
        effects: {
          stats: {
            money: 8,
            career: 6,
            social: 2,
            stress: 5,
            happiness: 1
          }
        },
        addFlags: ["no_college", "early_worker", "education_direct_work", "hands_on_path"],
        addTags: ["work", "independence"],
        log: "你没有继续在校园里缓冲，而是把自己更早地推到了现实的秤上。"
      }
    }),
    route({
      id: "repeat_exam_route",
      name: "复读",
      category: "repeat",
      summary: "把一年时间重新压回高考，不服输也不轻松。",
      description: "复读会强化成绩、挫败感和意志力对你的影响，也让后续路径更容易带着一种必须证明自己的张力。",
      optionText: "再压一年，选择复读。",
      details: ["压力显著上升", "有机会换更好平台", "会更明显影响自我评价"],
      conditions: {
        someFlags: ["gaokao_upset", "exam_anxiety", "slipped_once", "family_expectation_high"]
      },
      apply: {
        effects: {
          stats: {
            intelligence: 5,
            discipline: 4,
            happiness: -5,
            mental: -3,
            stress: 8
          }
        },
        addFlags: ["repeated_year", "education_repeat_exam"],
        addTags: ["pressure", "ambition"],
        log: "你没有在这个节点认输，而是把一年时间重新压回了那场改变去向的考试里。"
      }
    }),
    route({
      id: "gap_year_pause",
      name: "暂缓升学 / 间隔期",
      category: "pause",
      summary: "先不急着读，给自己一段喘息、打工或重新判断方向的时间。",
      description: "间隔期可能帮你更了解自己，也可能把你推进迷茫、比较和经济压力里。它不是轻松选项，只是另一种分流。",
      optionText: "先暂停升学，给自己一个间隔期。",
      details: ["更容易重新认识自己", "社会比较压力更直接", "后续可能转大学也可能转工作"],
      conditions: {},
      apply: {
        effects: {
          stats: {
            mental: 1,
            happiness: 1,
            money: 2,
            stress: 3,
            familySupport: -1
          }
        },
        addFlags: ["education_gap_year", "self_definition_seed"],
        addTags: ["selfhood", "growth"],
        log: "你没有让自己立刻被塞进下一站，而是先给了现实和自己一点重新对齐的时间。"
      }
    })
  ];

  window.LIFE_CAREER_ROUTES = [
    route({
      id: "stable_office_job",
      name: "稳定普通工作",
      category: "career",
      summary: "先把收入、节奏和生活秩序稳下来。",
      description: "这条路线不会一下把你推得很高，但相对稳，适合慢慢积累、照顾身体和经营关系。",
      optionText: "选一份稳定普通工作，把日子接稳。",
      details: ["财富增长中等", "压力相对可控", "更利于经营关系与健康"],
      conditions: {},
      apply: {
        effects: {
          stats: {
            money: 6,
            career: 4,
            happiness: 3,
            stress: -1,
            health: 2
          }
        },
        addFlags: ["career_stable_job", "stable_job"],
        addTags: ["stability", "growth"],
        log: "你没有先追最亮的标题，而是先把收入、秩序和可持续感搭了起来。"
      }
    }),
    route({
      id: "high_pay_pressure_job",
      name: "高压高薪工作",
      category: "career",
      summary: "收入更快上去，健康和关系也更容易被拿去交换。",
      description: "大平台、高绩效和高强度会更快推高你的财富与履历，也会同步推高身体和情绪成本。",
      optionText: "冲高压高薪路线，先抢速度和收入。",
      details: ["财富提升快", "职业资源更强", "更容易透支健康和关系"],
      conditions: {
        someFlags: ["top_school", "big_city", "high_competition_campus", "ambition_realized"],
        excludedEducationRouteIds: [
          "direct_work_route",
          "gaokao_vocational_college",
          "non_gaokao_skill_path",
          "non_gaokao_gap_replan"
        ]
      },
      apply: {
        effects: {
          stats: {
            money: 12,
            career: 10,
            stress: 10,
            health: -5,
            happiness: -2
          }
        },
        addFlags: ["career_high_pay", "career_first", "overworked"],
        addTags: ["ambition", "pressure"],
        log: "你拿到了更快的收入和履历，也更早把身体、时间和关系推上了交换桌。"
      }
    }),
    route({
      id: "system_job",
      name: "体制内 / 稳定路线",
      category: "career",
      summary: "把确定性、秩序和长期稳定放在更前面。",
      description: "体制或类似稳定结构会给你更可预期的生活，但也会限制一部分速度感和外部选择空间。",
      optionText: "走体制内或更稳定的编制路线。",
      details: ["稳定度更高", "财富爆发性较弱", "家庭关系往往更容易稳定"],
      conditions: {
        someFlags: ["safe_choice", "exam_path", "small_world_comfort", "parents_close"],
        excludedEducationRouteIds: ["direct_work_route", "non_gaokao_skill_path", "gaokao_vocational_college"]
      },
      apply: {
        effects: {
          stats: {
            money: 5,
            career: 5,
            stress: -2,
            familySupport: 4,
            happiness: 2
          }
        },
        addFlags: ["career_system_route", "stable_system_job"],
        addTags: ["stability", "family"],
        log: "你把未来押在可预期和长期稳定上，这会让很多外部评价和内部秩序都慢慢变稳。"
      }
    }),
    route({
      id: "startup_route",
      name: "创业尝试",
      category: "career",
      summary: "自己押注自己，回报和失控都更直接。",
      description: "创业会同时放大你的判断、风险偏好、财富波动和情绪波动。它可能是翻盘路，也可能是坠落路。",
      optionText: "自己试着创业或加入真正高风险的创业局。",
      details: ["财富与事业波动大", "压力极高", "成功和失败都会改写人生结构"],
      conditions: {
        someFlags: ["risk_exposed_early", "side_project_nights", "startup_path", "speculative_route"]
      },
      apply: {
        effects: {
          stats: {
            career: 8,
            money: 6,
            debt: 10,
            stress: 10,
            health: -4,
            happiness: 1
          }
        },
        addFlags: ["career_startup_route", "entrepreneurship", "risk_taker"],
        addTags: ["risk", "ambition"],
        log: "你把人生里很大一块主动权拿了回来，也把波动、焦虑和输赢都放大了。"
      }
    }),
    route({
      id: "freelance_route",
      name: "自由职业",
      category: "career",
      summary: "自由是真的自由，不稳定也是真的不稳定。",
      description: "你会拥有更强的自主感和表达空间，也要自己承担接单、现金流、边界和节奏的全部后果。",
      optionText: "把自由职业当成主线去试。",
      details: ["更自由", "更依赖自律与作品", "收入波动明显"],
      conditions: {
        someFlags: ["portfolio_path", "steady_craft", "signature_work", "self_built_structure"]
      },
      apply: {
        effects: {
          stats: {
            happiness: 4,
            career: 5,
            money: 2,
            debt: 4,
            stress: 4,
            discipline: 3
          }
        },
        addFlags: ["career_freelance_route", "freelance_mainline"],
        addTags: ["craft", "selfhood"],
        log: "你让自由成为路线本身的一部分，也把稳定、边界和收入都交给了自己处理。"
      }
    }),
    route({
      id: "family_arranged_job",
      name: "家里安排的工作",
      category: "career",
      summary: "拿到现成入口，也会把家里的影响继续带进职业生活。",
      description: "这条路线常常更快站稳，但你也更容易一直活在家庭期待、关系债和自我边界拉扯里。",
      optionText: "接受家里安排的工作或关系入口。",
      details: ["起步更快", "家庭影响更深", "个人边界更容易被持续干扰"],
      conditions: {
        someFlags: ["family_wealth_high", "merchant_home", "parents_close", "parental_support"]
      },
      apply: {
        effects: {
          stats: {
            money: 8,
            career: 5,
            familySupport: 6,
            mental: -1,
            stress: 3
          }
        },
        addFlags: ["career_family_arranged", "family_tie_job"],
        addTags: ["family", "stability"],
        log: "你拿到了一个更快的入口，也把家庭的影响继续延长到了职业生活里。"
      }
    }),
    route({
      id: "further_study_route",
      name: "继续深造",
      category: "career",
      summary: "把几年时间继续压进学位、资格或更高平台。",
      description: "继续深造会强化你的专业能力和长期回报，也会延后短期收入与现实落地速度。",
      optionText: "继续深造，把时间再压给更高训练。",
      details: ["专业能力提升更明显", "短期收入较低", "圈层和城市机会可能升级"],
      conditions: {
        someFlags: ["research_experience", "mentor_support", "top_school", "advanced_degree", "academic_grind"],
        excludedEducationRouteIds: ["direct_work_route", "non_gaokao_skill_path", "gaokao_vocational_college"]
      },
      apply: {
        effects: {
          stats: {
            intelligence: 8,
            career: 5,
            money: -2,
            stress: 5,
            happiness: -1
          }
        },
        addFlags: ["career_further_study", "advanced_degree"],
        addTags: ["ambition", "craft"],
        log: "你没有急着立刻落地，而是把几年时间继续押给了更深的训练和更长的回报。"
      }
    }),
    route({
      id: "unemployed_drift_route",
      name: "暂时失业或迷茫期",
      category: "career",
      summary: "暂时没有进入稳定轨道，现实压力和自我怀疑都会更直接。",
      description: "这不是纯粹坏路线，也可能成为重新定义方向的间隔期。但如果拖得太久，压力、负债和幸福感会迅速出问题。",
      optionText: "先承认自己还没定下来，进入一段迷茫期。",
      details: ["压力和比较感更强", "更容易重新思考方向", "若长期持续会伤到财富和心理状态"],
      conditions: {},
      apply: {
        effects: {
          stats: {
            money: -4,
            debt: 6,
            mental: -3,
            happiness: -4,
            stress: 6
          }
        },
        addFlags: ["career_drift_route", "lost_period"],
        addTags: ["selfhood", "pressure"],
        log: "你没有立刻进入稳定轨道，这会让你更诚实地面对自己，也会让现实压力更快贴上来。"
      }
    }),
    route({
      id: "career_foreign_firm_or_return",
      name: "外企 / 海归就业带",
      category: "career",
      summary: "海外或跨文化履历，把你送进另一种职场语法里。",
      description: "语言、签证与身份会一起参与你的议价；回报更宽，也更依赖平台与节奏。",
      optionText: "走外企、跨境团队或海归就业带。",
      details: ["更依赖学历与海外经历", "收入结构更多元", "生活节奏更不确定"],
      conditions: {
        educationRouteIds: ["overseas_research_path", "overseas_practical_path", "overseas_art_path"]
      },
      apply: {
        effects: {
          stats: {
            money: 10,
            career: 8,
            stress: 6,
            social: 4,
            health: -2
          }
        },
        addFlags: ["career_foreign_track", "globalized_resume"],
        addTags: ["ambition", "work"],
        log: "你把简历放进了一套更国际化也更挑剔的筛选里。"
      }
    }),
    route({
      id: "career_vocational_trades",
      name: "技术工 / 持证岗位路线",
      category: "career",
      summary: "用手艺和证书换稳定现金流，体面不一定耀眼。",
      description: "职校与技能路线更容易把你送进看得见的岗位结构里，上升斜率更陡的是经验而不是头衔。",
      optionText: "走技术工、持证岗或技能型就业。",
      details: ["上手快", "身体消耗更直接", "长期看证书与经验"],
      conditions: {
        educationRouteIds: ["gaokao_vocational_college", "non_gaokao_skill_path"]
      },
      apply: {
        effects: {
          stats: {
            money: 7,
            career: 6,
            health: -2,
            stress: 3,
            happiness: 2
          }
        },
        addFlags: ["career_trades_route", "hands_on_livelihood"],
        addTags: ["work", "stability"],
        log: "你没有去拼抽象的头衔，而是把手艺先换成能活下去的结构。"
      }
    }),
    route({
      id: "career_early_labor_market",
      name: "早入劳动力市场",
      category: "career",
      summary: "没有本科文凭托底，岗位更硬、更看体力与执行力。",
      description: "你会更早看见钱，也更早看见天花板；转行成本高，每一步都要自己买单。",
      optionText: "继续走早工作、早独立的岗位路线。",
      details: ["现金流更早", "保障偏弱", "转型更难"],
      conditions: {
        educationRouteIds: ["direct_work_route"]
      },
      apply: {
        effects: {
          stats: {
            money: 5,
            career: 5,
            stress: 5,
            health: -3,
            happiness: 1
          }
        },
        addFlags: ["career_early_labor", "no_degree_ceiling_low"],
        addTags: ["work", "pressure"],
        log: "你的简历比同龄人短一截，只能用更硬的付出去换机会。"
      }
    }),
    /** 毕业后「尚未落定」的过渡路线（引擎与 data/life-workforce-expansion.js 会识别） */
    route({
      id: "career_in_job_search",
      name: "求职中（简历与面试循环）",
      category: "career",
      summary: "你已经毕业或同级人开始工作，但你还处在投递、笔试、面试与被拒之间。",
      description: "这不是最终职业定型，而是过渡态；请通过「求职回合」事件争取 offer，再进入工作地点与租房流程。",
      optionText: "进入就业市场，开始认真找工作。",
      details: ["可重复申请不同岗位", "整体被拒概率偏高", "成功后需选城市与住房"],
      conditions: {},
      apply: {
        effects: {
          stats: {
            stress: 3,
            mental: -1
          }
        },
        addFlags: ["job_pipeline_active", "post_grad_job_hunt"],
        addTags: ["work", "pressure"],
        log: "你把状态从「学生」切到「求职者」：邮箱、招聘软件和心跳一起刷新。"
      }
    }),
    route({
      id: "career_gap_year_after_degree",
      name: "毕业后暂缓就业",
      category: "career",
      summary: "先不急着把自己签给某一家公司，给自己一段空白去试错、旅行或调整。",
      description: "财富与履历会慢下来，但你能换回一点呼吸；之后仍可回到求职轨道。",
      optionText: "暂缓工作，先把节奏找回来。",
      details: ["短期收入偏弱", "心理压力因比较而波动", "可改走求职"],
      conditions: {},
      apply: {
        effects: {
          stats: {
            money: -3,
            happiness: 2,
            stress: 4,
            mental: 2
          }
        },
        addFlags: ["post_grad_gap_year", "employment_deferred"],
        addTags: ["selfhood", "pressure"],
        log: "你没有立刻把自己交给某一份合同，而是允许人生先空出一格。"
      }
    }),
    route({
      id: "career_family_supported_home",
      name: "暂依家庭支持（住家/慢启动）",
      category: "career",
      summary: "先回到父母安排或熟悉的屋檐下，用家里的缓冲换时间。",
      description: "开销会小一些，但边界与话语权也会更微妙；适合作为过渡而非终点。",
      optionText: "先回家或依赖家庭支持，把下一步想清楚。",
      details: ["生活成本下降", "家庭介入变强", "自尊与边界需自管"],
      conditions: {},
      apply: {
        effects: {
          stats: {
            money: 2,
            familySupport: 5,
            stress: 3,
            mental: -1
          }
        },
        addFlags: ["living_at_parents_after_school", "employment_deferred"],
        addTags: ["family", "stability"],
        log: "你又把一部分生活交回熟悉的屋檐下——省钱，也重新面对家里的音量。"
      }
    })
  ];
})();

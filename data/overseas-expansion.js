(function () {
  "use strict";

  function appendWindowList(key, items) {
    const existing = Array.isArray(window[key]) ? window[key] : [];
    window[key] = existing.concat(items || []);
  }

  window.LIFE_OVERSEAS_PHASES = [
    { id: "arrival", label: "初到适应期" },
    { id: "settling", label: "初步融入期" },
    { id: "parallel", label: "学业与社交并行期" },
    { id: "independent", label: "独立生活期" },
    { id: "complex", label: "感情复杂化阶段" },
    { id: "decision", label: "毕业去向选择期" }
  ];

  window.LIFE_OVERSEAS_BRANCHES = [
    { id: "academic", label: "学业导向路线", flag: "overseas_focus_academic" },
    { id: "social", label: "社交扩张路线", flag: "overseas_focus_social" },
    { id: "career", label: "事业 / 实习导向路线", flag: "overseas_focus_career" },
    { id: "survival", label: "节省生存路线", flag: "overseas_focus_survival" },
    { id: "romance", label: "情感纠葛路线", flag: "overseas_focus_romance" },
    { id: "isolation", label: "逐渐失衡 / 孤立路线", flag: "overseas_focus_isolation" }
  ];

  const overseasCharacters = [
    {
      id: "nora_bennett",
      name: "Nora Bennett",
      gender: "female",
      identity: "你在全英文课堂和本地同学局里慢慢认识的人，说话直接，不会照顾场面，但愿意认真回答真正的问题。",
      stageTags: ["college", "young_adult", "career"],
      roleTags: ["本地同学", "课堂搭档"],
      traitTags: ["直接", "松弛", "不喜欢拐弯"],
      contactStyle: "更容易在课堂发言、课后小组讨论和一起去超市买东西这种不太正式的场合里熟起来。",
      conflictStyle: "不会阴阳怪气，但会把不理解和不认同直接说出来。",
      initialStatus: "unknown",
      initialAffection: 0,
      romanceProfile: {
        arcType: "slowburn",
        futureFocus: "看重平等和清楚表达，不太吃含糊和试探。",
        longTermPotential: 68,
        volatility: 42,
        fitTags: ["communication", "local_life", "honesty"]
      }
    },
    {
      id: "chen_jialin",
      name: "陈嘉霖",
      gender: "male",
      identity: "比你早来两年的华语留学生学长，知道怎样找房、换宿舍、薅超市折扣，也知道什么时候该提醒你别硬撑。",
      stageTags: ["college", "young_adult"],
      roleTags: ["华语留学生", "学长"],
      traitTags: ["务实", "照顾人", "很会算账"],
      contactStyle: "更容易在新生群、华人超市、搬宿舍和交材料这种具体求助场景里熟起来。",
      conflictStyle: "看不惯明明吃紧还要硬撑面子。",
      initialStatus: "unknown",
      initialAffection: 0,
      romanceProfile: {
        arcType: "steady",
        futureFocus: "把生活接住比短暂热烈更重要。",
        longTermPotential: 54,
        volatility: 26,
        fitTags: ["support", "survival", "practical"]
      }
    },
    {
      id: "arjun_mehta",
      name: "Arjun Mehta",
      gender: "male",
      identity: "在国际学生活动和小组作业里很容易活跃全场的人，适应得快，也因此经常让你拿自己和他比较。",
      stageTags: ["college", "young_adult"],
      roleTags: ["国际学生", "社团组织者"],
      traitTags: ["外向", "效率高", "能带节奏"],
      contactStyle: "在迎新局、社团活动和 group project 里很容易和他打交道。",
      conflictStyle: "对拖延和不出声的人会不耐烦，但也愿意给第二次机会。",
      initialStatus: "unknown",
      initialAffection: 0,
      romanceProfile: {
        arcType: "bright",
        futureFocus: "喜欢能一起主动生活的人。",
        longTermPotential: 48,
        volatility: 44,
        fitTags: ["social", "mobility", "confidence"]
      }
    },
    {
      id: "marta_kowalska",
      name: "Marta Kowalska",
      gender: "female",
      identity: "你在合租和宿舍生活里最早真正磨出来边界的人，作息清楚、规则明确，最能让你看见文化差异是怎么落到锅碗和冰箱里的。",
      stageTags: ["college", "young_adult"],
      roleTags: ["室友", "合租人"],
      traitTags: ["利落", "边界清晰", "生活感很强"],
      contactStyle: "在做饭、轮流打扫、夜里进门和共享冰箱这类日常细节里熟起来。",
      conflictStyle: "有意见会直接写下来或当面提，不喜欢模糊地拖着。",
      initialStatus: "unknown",
      initialAffection: 0
    },
    {
      id: "leo_park",
      name: "Leo Park",
      gender: "male",
      identity: "你在兼职班表和打烊收尾里认识的人，能看出谁在为生活硬扛，但不会轻易替谁兜底。",
      stageTags: ["college", "young_adult", "career"],
      roleTags: ["兼职同事", "班表主管"],
      traitTags: ["可靠", "现实", "慢热"],
      contactStyle: "更容易在排班、打烊和被突发状况一起留下来收尾的时候靠近。",
      conflictStyle: "最讨厌情绪带进班表和工作承诺里。",
      initialStatus: "unknown",
      initialAffection: 0,
      romanceProfile: {
        arcType: "practical",
        futureFocus: "看重责任感和真实在场，不喜欢只会说以后的人。",
        longTermPotential: 61,
        volatility: 34,
        fitTags: ["work", "reliability", "independence"]
      }
    },
    {
      id: "professor_anika_reed",
      name: "Professor Anika Reed",
      gender: "female",
      identity: "你在 office hour 和研究 / 实习申请里逐渐建立联系的导师型人物，讲话不软，但能分辨你是在偷懒还是已经快撑不住。",
      stageTags: ["college", "young_adult", "career"],
      roleTags: ["导师", "教授"],
      traitTags: ["严谨", "敏锐", "愿意提携"],
      contactStyle: "在 office hour、邮件往来和项目反馈里慢慢建立信任。",
      conflictStyle: "如果你一味消失或为自己找借口，她会立刻收回支持。",
      initialStatus: "unknown",
      initialAffection: 0
    }
  ];

  const overseasArcs = [
    {
      characterId: "nora_bennett",
      arcId: "nora_bennett_arc",
      title: "本地同学与表达边界线",
      summary: "从课堂发言压力、party 不适应到真实沟通，强调本地社交与文化差异。",
      historyLabels: {
        nora_class_freeze: "在课堂发言场里第一次被她接了一下",
        nora_party_walkout: "一起从不适应的 party 里提前离开",
        nora_direct_talk: "关于表达、边界和恋爱观的直接对话"
      }
    },
    {
      characterId: "chen_jialin",
      arcId: "chen_jialin_arc",
      title: "学长与生活兜底线",
      summary: "偏现实支持型角色，贯穿租房、省钱、实习和回国 / 留下的现实判断。",
      historyLabels: {
        jialin_move_help: "搬宿舍时被他带着解决了一堆事",
        jialin_budget_sheet: "他把预算表和生活账摊给你看",
        jialin_return_talk: "一起聊过回国和留下究竟差在哪"
      }
    },
    {
      characterId: "arjun_mehta",
      arcId: "arjun_mehta_arc",
      title: "国际学生圈与比较心理线",
      summary: "他既可能把你拉进更大的社交圈，也会放大你的适应比较。",
      historyLabels: {
        arjun_welcome_dinner: "在国际学生欢迎晚餐第一次熟起来",
        arjun_group_pull: "被他拖进快节奏小组协作",
        arjun_compare_spiral: "在比较里第一次明显地不舒服"
      }
    },
    {
      characterId: "marta_kowalska",
      arcId: "marta_kowalska_arc",
      title: "室友生活与边界线",
      summary: "从共享厨房、噪音和清洁分工里，真正长出海外独立生活的手感。",
      historyLabels: {
        marta_kitchen_rules: "共享厨房的第一次规则谈判",
        marta_flat_cleaning: "因为卫生和作息正面聊开",
        marta_move_out_choice: "在续租和搬走之间做过判断"
      }
    },
    {
      characterId: "leo_park",
      arcId: "leo_park_arc",
      title: "兼职班表与现实撑住线",
      summary: "体现半工半读、预算压力和工作影响学业的现实张力。",
      historyLabels: {
        leo_first_shift: "第一次手忙脚乱地顶过晚班",
        leo_cover_shift: "为了钱接下更多班",
        leo_reference_offer: "他认真问过你要不要继续往本地工作试"
      }
    },
    {
      characterId: "professor_anika_reed",
      arcId: "professor_anika_reed_arc",
      title: "导师提携与方向改变线",
      summary: "学术和职业方向的重要推手，影响你后续是继续深造还是转向实习 / 工作。",
      historyLabels: {
        reed_office_hour: "第一次鼓起勇气去 office hour",
        reed_reference_mail: "拿到一封关键推荐或介绍",
        reed_direction_shift: "她逼你认真回答自己到底想做什么"
      }
    }
  ];

  window.LIFE_OVERSEAS_CHARACTERS = overseasCharacters;
  appendWindowList("LIFE_RELATIONSHIPS", overseasCharacters);
  appendWindowList("LIFE_RELATIONSHIP_ARCS", overseasArcs);

  const overseasCareerRoutes = [
    {
      id: "overseas_global_research_route",
      name: "海外深造 / 研究延伸",
      category: "career",
      summary: "把海外学习继续往研究、读研或更高门槛的专业路径延伸。",
      description: "适合学术能力较强、也愿意继续承受制度和竞争的人。",
      details: ["平台继续抬高", "学术压力持续", "更容易拉高留在国外的概率"],
      apply: {
        effects: {
          stats: { intelligence: 5, career: 5, stress: 4, discipline: 3 }
        },
        addFlags: ["overseas_chose_stay", "overseas_advanced_track", "advanced_degree"],
        addTags: ["ambition", "growth"],
        log: "你没有急着把海外经历换成一份立刻稳定的生活，而是继续往更长线的专业和研究里压。"
      }
    },
    {
      id: "overseas_local_job_route",
      name: "留在国外工作",
      category: "career",
      summary: "把学校阶段硬生生接到当地工作、签证和长期留下的现实里。",
      description: "真正难的不是找到第一份工作，而是把工作、身份、房租和关系一起接住。",
      details: ["签证和现实压力更直接", "归属感会继续被考验", "职业和城市绑定更深"],
      apply: {
        effects: {
          stats: { career: 7, money: 4, stress: 5, social: 2 }
        },
        addFlags: ["overseas_chose_stay", "overseas_localized"],
        addTags: ["independence", "risk"],
        log: "你决定试着把国外从一段求学经历，接成真正可以长期生活下去的地方。"
      }
    },
    {
      id: "overseas_returnee_route",
      name: "带着海外经历回国发展",
      category: "career",
      summary: "把海外几年积累下来的视野、习惯和人脉，重新带回国内环境落地。",
      description: "这不是简单回头，而是把自己带着改变重新放回熟悉的地方。",
      details: ["适配成本转回国内", "家庭关系容易被重写", "职业叙事会带上留学标签"],
      apply: {
        effects: {
          stats: { career: 6, social: 3, familySupport: 4, happiness: 1, stress: 2 }
        },
        addFlags: ["overseas_chose_return", "returnee_identity"],
        addTags: ["selfhood", "family"],
        log: "你最终还是决定回国，但那几年国外生活并没有被抹掉，它会继续留在你之后的判断里。"
      }
    },
    {
      id: "overseas_relationship_return_route",
      name: "为了关系回国重排人生",
      category: "career",
      summary: "不是被单一职业逻辑带走，而是把感情、家庭和去向放到一张桌上重新排序。",
      description: "它可能很值得，也可能让你更晚才回答“这到底是不是我自己的决定”。",
      details: ["感情权重更高", "职业路径会让位", "家庭与亲密关系影响更深"],
      apply: {
        effects: {
          stats: { happiness: 3, familySupport: 5, career: 2, stress: 2 }
        },
        addFlags: ["overseas_chose_return", "returned_for_relationship"],
        addTags: ["family", "relationship"],
        log: "你不是只按简历和机会做决定，而是承认有些人际牵引已经足够改写你的去向。"
      }
    },
    {
      id: "overseas_survival_extension_route",
      name: "先靠临时岗 / 短签留下",
      category: "career",
      summary: "你还没有真正站稳，但也还不想立刻离开，于是先用现实感很强的方式继续留下。",
      description: "这是一条很吃韧性的路，很多时候不是理想，而是先别让自己掉下去。",
      details: ["现金流和签证都很敏感", "生活质量更容易波动", "留下与回去的拉扯会拖得更久"],
      apply: {
        effects: {
          stats: { money: 2, career: 3, stress: 7, discipline: 2, mental: -1 }
        },
        addFlags: ["overseas_chose_stay", "overseas_transitional_mode", "visa_tightrope"],
        addTags: ["pressure", "independence"],
        log: "你没有立刻获得一条体面的稳定路线，只是先用很现实的方式把自己继续留在这里。"
      }
    }
  ];

  window.LIFE_OVERSEAS_CAREER_ROUTES = overseasCareerRoutes;
  appendWindowList("LIFE_CAREER_ROUTES", overseasCareerRoutes);

  const adaptationEvents = [
    {
      id: "overseas_airport_jetlag",
      stage: "college",
      title: "飞机落地那一刻，你先得到的不是自由感，而是巨大陌生感",
      text: "机场广播、陌生口音、几乎没睡的脑子、手机卡和交通路线，会让“出国”在第一天就从抽象名词变成很具体的疲惫。\n\n你现在的海外阶段：{overseasPhaseLabel}\n{overseasBelongingSummary}",
      minAge: 18,
      maxAge: 22,
      weight: 10,
      tags: ["overseas", "college", "arrival"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        someFlags: ["overseas_phase_arrival", "overseas_phase_settling"]
      },
      choices: [
        {
          text: "先把导航、交通卡和入住流程一个个硬啃下来，别让自己在第一天就彻底乱掉。",
          effects: { age: 1, stats: { discipline: 2, stress: 2, mental: 1 } },
          customAction: "update_overseas_profile",
          customPayload: {
            phase: "settling",
            housingType: "临时宿舍 / 刚落地住处",
            budgetMode: "先活下来再说",
            addFocuses: ["survival"],
            metrics: { independence: 10, languagePressure: 4, belonging: 3, homesickness: 4 }
          },
          log: "第一天没人能替你翻译生活。你只能先把最实际的几件事一件件做掉。"
        },
        {
          text: "表面顺着流程走完，回到住处以后却只想盯着天花板发呆。",
          effects: { age: 1, stats: { happiness: -2, mental: -2, stress: 3 } },
          addFlags: ["homesick_phase"],
          customAction: "update_overseas_profile",
          customPayload: {
            phase: "settling",
            housingType: "临时宿舍 / 刚落地住处",
            addFocuses: ["isolation"],
            metrics: { loneliness: 10, homesickness: 12, belonging: -4, culturalStress: 6 }
          },
          log: "真正先扑上来的不是兴奋，而是那种没有任何熟悉参照物的空。"
        }
      ]
    },
    {
      id: "overseas_admin_paperwork",
      stage: "college",
      title: "第一次自己跑手续，你才知道原来很多事真的不会有人替你收尾",
      text: "银行卡、学生卡、签证登记、电话卡、住址证明，任何一个环节卡住，都会让人瞬间意识到自己已经不在原来的系统里了。",
      minAge: 18,
      maxAge: 23,
      weight: 9,
      tags: ["overseas", "college", "arrival"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        someFlags: ["overseas_phase_arrival", "overseas_phase_settling"]
      },
      choices: [
        {
          text: "提前查流程、发邮件确认、带齐材料，硬是把这套系统摸顺了。",
          effects: { age: 1, stats: { discipline: 2, intelligence: 1, stress: 1 } },
          customAction: "update_overseas_profile",
          customPayload: {
            metrics: { independence: 8, languagePressure: -4, visaPressure: 6, belonging: 4 }
          },
          log: "你第一次真正用自己的方法，把一套完全陌生的制度流程接住了。"
        },
        {
          text: "中间卡了好几次，最后还是在华人学长的帮助下才没把自己弄崩。",
          relationshipEffects: [
            {
              targetId: "chen_jialin",
              familiarity: 15,
              trust: 10,
              affection: 8,
              status: "familiar",
              interactions: 2,
              addSharedHistory: ["jialin_move_help"],
              history: "你在一堆手续和材料里差点乱掉，是陈嘉霖带着你把事情捋顺的。"
            }
          ],
          effects: { age: 1, stats: { social: 1, stress: 2, happiness: 1 } },
          customAction: "update_overseas_profile",
          customPayload: {
            addSupportNetworkIds: ["chen_jialin"],
            metrics: { languagePressure: -2, independence: 4, belonging: 6, homesickness: 2 }
          },
          log: "你没有靠自己一个人扛过去，但也正因为这样，才第一次觉得这里不是完全没有人能问。"
        }
      ]
    },
    {
      id: "overseas_shared_kitchen_disaster",
      stage: "college",
      title: "不会做饭、看不懂调料、超市价格又肉眼可见地贵，日常一下就有了生存感",
      text: "共享厨房的油烟、超市里的折扣标签、第一顿做得很失败的饭，会让“独立生活”从照片上的自由感变成锅碗瓢盆和预算表。",
      minAge: 18,
      maxAge: 24,
      weight: 10,
      tags: ["overseas", "college", "life"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        someFlags: ["overseas_phase_arrival", "overseas_phase_settling", "overseas_phase_parallel"]
      },
      choices: [
        {
          text: "开始认真学做几样能省钱又能活下去的东西，生活总得自己练出来。",
          effects: { age: 1, stats: { money: 2, discipline: 2, happiness: 1 } },
          addFlags: ["self_built_structure"],
          customAction: "update_overseas_profile",
          customPayload: {
            budgetMode: "精打细算",
            addFocuses: ["survival"],
            metrics: { financePressure: -8, independence: 8, belonging: 3, homesickness: -2 }
          },
          log: "你开始明白，所谓独立，很多时候就是把那些最琐碎的事一件件练熟。"
        },
        {
          text: "被生活成本压得先焦虑起来，买菜和吃饭都开始带着算计和内耗。",
          effects: { age: 1, stats: { happiness: -2, stress: 3, money: -2 } },
          addFlags: ["cost_sensitive_overseas"],
          customAction: "update_overseas_profile",
          customPayload: {
            budgetMode: "处处抠成本",
            addFocuses: ["survival", "isolation"],
            metrics: { financePressure: 10, burnout: 4, loneliness: 4, belonging: -2 }
          },
          log: "国外生活最先把浪漫感磨掉的，往往不是学业，而是每一笔都要自己承担的日常开销。"
        }
      ]
    },
    {
      id: "overseas_first_homesick_night",
      stage: "college",
      title: "第一次明显想家，往往发生在一个很普通的晚上",
      text: "也许只是国内群里在过节，也许只是家里发来一张晚饭照片。你突然意识到，自己已经不在任何默认会被照顾到的半径里了。",
      minAge: 18,
      maxAge: 24,
      weight: 9,
      tags: ["overseas", "college", "mental"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        someFlags: ["overseas_phase_settling", "overseas_phase_parallel"],
        notVisited: ["overseas_holiday_loneliness"]
      },
      choices: [
        {
          text: "和家里认真通了一次电话，承认自己其实没有想象中那么轻松。",
          effects: { age: 1, stats: { familySupport: 2, mental: 1, happiness: 1 } },
          customAction: "update_overseas_profile",
          customPayload: {
            metrics: { homesickness: 6, loneliness: -4, belonging: 2, returnScore: 4 }
          },
          log: "你没有再演“我挺好的”，而是第一次认真承认这条路确实比想象中更难。"
        },
        {
          text: "不太想让家里担心，于是把情绪往回压，第二天照样去上课和买菜。",
          effects: { age: 1, stats: { discipline: 1, mental: -2, stress: 2 } },
          addFlags: ["emotionally_guarded"],
          customAction: "update_overseas_profile",
          customPayload: {
            addFocuses: ["isolation"],
            metrics: { homesickness: 10, loneliness: 8, burnout: 4, independence: 3 }
          },
          log: "你不是不想家，只是不想把脆弱再额外扩散给原本就牵挂你的人。"
        }
      ]
    },
    {
      id: "overseas_roommate_rules",
      stage: "college",
      title: "室友冲突不会写成宏大叙事，它只会体现在凌晨进门声、冰箱和垃圾袋里",
      text: "作息、卫生、访客和做饭味道，任何一件很小的习惯差异，在合租环境里都能很快变成关系问题。",
      minAge: 18,
      maxAge: 25,
      weight: 9,
      tags: ["overseas", "college", "life", "culture"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        someFlags: ["overseas_phase_settling", "overseas_phase_parallel", "overseas_phase_independent"]
      },
      choices: [
        {
          text: "和室友把规则一次说清楚，哪怕尴尬，也比一直憋着强。",
          relationshipEffects: [
            {
              targetId: "marta_kowalska",
              familiarity: 14,
              trust: 10,
              affection: 8,
              status: "familiar",
              interactions: 2,
              addSharedHistory: ["marta_kitchen_rules"],
              history: "你和 Marta 是在一次并不轻松的生活规则谈判里，真正开始把彼此当成熟人看的。"
            }
          ],
          effects: { age: 1, stats: { social: 2, mental: 1 } },
          addFlags: ["boundary_awareness"],
          customAction: "update_overseas_profile",
          customPayload: {
            housingType: "合租 / 室友规则明确",
            addSupportNetworkIds: ["marta_kowalska"],
            metrics: { culturalStress: -4, belonging: 4, independence: 6, loneliness: -2 }
          },
          log: "你在国外第一次学会，很多舒服的关系并不是靠默契，而是靠边界谈出来的。"
        },
        {
          text: "不想起冲突，于是先忍着，结果住处慢慢也开始变成新的压力源。",
          effects: { age: 1, stats: { happiness: -2, stress: 3, mental: -1 } },
          addFlags: ["solo_pattern"],
          customAction: "update_overseas_profile",
          customPayload: {
            housingType: "合租但不太舒服",
            addFocuses: ["isolation"],
            metrics: { loneliness: 6, burnout: 5, culturalStress: 6, belonging: -3 }
          },
          log: "你没有把矛盾闹大，可住的地方也因此一点点变成了无法真正放松的地方。"
        }
      ]
    }
  ];

  const integrationEvents = [
    {
      id: "overseas_full_english_seminar",
      stage: "college",
      title: "全英文课堂里，最难受的常常不是听不懂，而是明明知道一点却说不出来",
      text: "别人接话、举手、追问和即兴反应的速度，会把语言环境压力放大得很具体。你会突然发现，原来“会做题”和“会在这里表达”根本不是一回事。",
      minAge: 19,
      maxAge: 24,
      weight: 10,
      tags: ["overseas", "college", "academic"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        someFlags: ["overseas_phase_settling", "overseas_phase_parallel"]
      },
      choices: [
        {
          text: "哪怕发音和语法都不完美，也逼自己每周至少开口一次。",
          effects: { age: 1, stats: { intelligence: 2, social: 2, stress: 1 } },
          relationshipEffects: [
            {
              targetId: "nora_bennett",
              familiarity: 12,
              trust: 8,
              affection: 6,
              status: "familiar",
              interactions: 1,
              addSharedHistory: ["nora_class_freeze"],
              history: "你在课堂里卡壳时，Nora 很自然地把话接住了，尴尬却没有继续扩大。"
            }
          ],
          customAction: "update_overseas_profile",
          customPayload: {
            phase: "parallel",
            addSupportNetworkIds: ["nora_bennett"],
            addFocuses: ["academic"],
            metrics: { languagePressure: -8, academicPressure: 4, socialComfort: 6, belonging: 4, stayScore: 3 }
          },
          log: "你没有等自己彻底熟练才开口，而是先在不完美里把表达练成了习惯。"
        },
        {
          text: "暂时把自己缩回后排，先靠记笔记和课后补材料把课接住。",
          effects: { age: 1, stats: { intelligence: 2, discipline: 1, happiness: -1 } },
          customAction: "update_overseas_profile",
          customPayload: {
            phase: "parallel",
            addFocuses: ["academic", "isolation"],
            metrics: { languagePressure: 2, academicPressure: 6, socialComfort: -4, loneliness: 4, belonging: -2 }
          },
          log: "你确实没有掉队，但也很清楚自己还没有真正进入那个能自然表达的状态。"
        }
      ]
    },
    {
      id: "overseas_group_project_gap",
      stage: "college",
      title: "小组作业的文化差异，比课程本身更容易把人磨得心累",
      text: "有人先发言再慢慢改，有人喜欢会前准备到非常细，有人把 deadlines 看得很硬，有人把情绪直接带进讨论。真正累人的，不一定是题目，而是协作习惯根本不一样。",
      minAge: 19,
      maxAge: 25,
      weight: 10,
      tags: ["overseas", "college", "academic", "social"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        someFlags: ["overseas_phase_parallel", "overseas_phase_independent"]
      },
      choices: [
        {
          text: "主动承担框架和时间线，把组里节奏先稳下来。",
          relationshipEffects: [
            {
              targetId: "arjun_mehta",
              familiarity: 12,
              trust: 10,
              affection: 6,
              status: "familiar",
              interactions: 2,
              addSharedHistory: ["arjun_group_pull"],
              history: "你在小组协作里撑住节奏时，Arjun 开始把你当成真正能一起做事的人。"
            }
          ],
          effects: { age: 1, stats: { intelligence: 2, discipline: 2, social: 2, stress: 1 } },
          customAction: "update_overseas_profile",
          customPayload: {
            addSupportNetworkIds: ["arjun_mehta"],
            addFocuses: ["academic", "career"],
            metrics: { academicPressure: 4, socialComfort: 4, belonging: 5, careerClarity: 3 }
          },
          log: "你开始摸到国外协作文化的门：不是所有人都按同一种方式认真，但节奏是可以被你带出来的。"
        },
        {
          text: "被不同沟通方式磨得很烦，最后只想先把自己那部分做完就算了。",
          effects: { age: 1, stats: { stress: 3, mental: -1, social: -1 } },
          addFlags: ["overseas_group_fatigue"],
          customAction: "update_overseas_profile",
          customPayload: {
            addFocuses: ["isolation"],
            metrics: { academicPressure: 6, culturalStress: 6, loneliness: 3, belonging: -2 }
          },
          log: "你第一次清楚地感到，文化差异不是抽象概念，它会直接长在协作和情绪耗损里。"
        }
      ]
    },
    {
      id: "overseas_international_dinner",
      stage: "college",
      title: "认识其他国际学生以后，你开始明白“异乡人”并不只是一种国籍",
      text: "有人和你一样第一次离家这么远，有人已经习惯了不停迁移。你会在他们身上看到别的适应方式，也会看到自己没说出口的焦虑。",
      minAge: 19,
      maxAge: 25,
      weight: 9,
      tags: ["overseas", "college", "social"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        someFlags: ["overseas_phase_settling", "overseas_phase_parallel", "overseas_phase_independent"]
      },
      choices: [
        {
          text: "留下来继续聊天，慢慢把自己放进这个混合圈子里。",
          relationshipEffects: [
            {
              targetId: "arjun_mehta",
              familiarity: 10,
              trust: 8,
              affection: 6,
              status: "familiar",
              interactions: 1,
              addSharedHistory: ["arjun_welcome_dinner"],
              history: "你没有吃完就走，而是在那顿国际学生晚餐后，第一次把自己留在了更大的混合圈子里。"
            }
          ],
          effects: { age: 1, stats: { social: 3, happiness: 2 } },
          customAction: "update_overseas_profile",
          customPayload: {
            phase: "parallel",
            addSupportNetworkIds: ["arjun_mehta"],
            addFocuses: ["social"],
            metrics: { loneliness: -6, belonging: 8, socialComfort: 8, culturalStress: -2, stayScore: 2 }
          },
          log: "真正缓解孤独的，不一定是找到同乡，而是终于找到一群也在异地重新长的人。"
        },
        {
          text: "人很多、语言很多、话题很多，反而让你更清楚地感觉到自己格格不入。",
          effects: { age: 1, stats: { happiness: -1, mental: -1, stress: 2 } },
          customAction: "update_overseas_profile",
          customPayload: {
            addFocuses: ["isolation"],
            metrics: { loneliness: 7, belonging: -3, socialComfort: -5, culturalStress: 4 }
          },
          log: "热闹不一定自动带来融入。有时候越热闹，反而越能放大自己的不自然。"
        }
      ]
    },
    {
      id: "overseas_local_party_outsider",
      stage: "college",
      title: "第一次去本地同学的社交局，你会很快知道自己到底适不适应这种场",
      text: "笑点、饮酒节奏、 small talk、谁先离场不算失礼，这些看似不重要的东西，都会让你在一个晚上里迅速意识到文化差异到底有多细。",
      minAge: 19,
      maxAge: 26,
      weight: 8,
      tags: ["overseas", "college", "social", "culture"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        someFlags: ["overseas_phase_parallel", "overseas_phase_independent"]
      },
      choices: [
        {
          text: "不强迫自己装得很会玩，先跟看起来最自然的人慢慢聊。",
          relationshipEffects: [
            {
              targetId: "nora_bennett",
              familiarity: 12,
              trust: 10,
              affection: 8,
              playerInterest: 6,
              theirInterest: 6,
              status: "close",
              interactions: 2,
              addSharedHistory: ["nora_party_walkout"],
              history: "你没有硬撑着融进全场，而是和 Nora 在局外那段更安静的聊天里慢慢靠近了。"
            }
          ],
          effects: { age: 1, stats: { social: 2, mental: 1, happiness: 1 } },
          customAction: "update_overseas_profile",
          customPayload: {
            addSupportNetworkIds: ["nora_bennett"],
            addFocuses: ["social"],
            metrics: { socialComfort: 6, culturalStress: -3, belonging: 5, identityShift: 4 }
          },
          log: "你没有把自己硬塞进不擅长的热闹，而是开始找到一种更像自己的融入方式。"
        },
        {
          text: "硬撑着待完全场，回去以后却只觉得更累，也更想家。",
          effects: { age: 1, stats: { stress: 3, happiness: -2, mental: -1 } },
          customAction: "update_overseas_profile",
          customPayload: {
            addFocuses: ["isolation"],
            metrics: { culturalStress: 8, loneliness: 5, homesickness: 5, belonging: -3 }
          },
          log: "你不是没去参与，只是那种参与并没有真的让你更接近这里。"
        }
      ]
    },
    {
      id: "overseas_holiday_loneliness",
      stage: "college",
      title: "节日一到，朋友圈和街上的热闹会把你的孤独感照得更亮",
      text: "本地人在回家、约会、过节，国内也在另一边过自己的节。你夹在两套时间和情绪里，突然不知道自己该算在哪里。",
      minAge: 19,
      maxAge: 27,
      weight: 8,
      tags: ["overseas", "college", "mental", "holiday"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        someFlags: ["overseas_phase_parallel", "overseas_phase_independent", "overseas_phase_complex"]
      },
      choices: [
        {
          text: "主动凑一个饭局，不管是华人圈还是国际学生，至少别让自己一个人过。",
          relationshipEffects: [
            {
              targetId: "chen_jialin",
              familiarity: 8,
              trust: 8,
              affection: 6,
              status: "close",
              interactions: 1,
              addSharedHistory: ["jialin_budget_sheet"],
              history: "节日那天你没有继续一个人待着，而是跟陈嘉霖和一群同样没回家的人凑了一顿饭。"
            }
          ],
          effects: { age: 1, stats: { happiness: 2, social: 2 } },
          customAction: "update_overseas_profile",
          customPayload: {
            addSupportNetworkIds: ["chen_jialin"],
            addFocuses: ["social"],
            metrics: { loneliness: -7, homesickness: 2, belonging: 6, returnScore: 2 }
          },
          log: "你没有让节日只变成孤独感的放大器，而是努力给自己搭出一点临时的节日感。"
        },
        {
          text: "刷完社交媒体以后更不想出门，只觉得自己像停在别人的生活外面。",
          effects: { age: 1, stats: { happiness: -3, mental: -2, stress: 2 } },
          addFlags: ["holiday_isolation"],
          customAction: "update_overseas_profile",
          customPayload: {
            addFocuses: ["isolation"],
            metrics: { loneliness: 10, homesickness: 8, belonging: -4, returnScore: 5 }
          },
          log: "节日这种东西最残忍的地方，就是它会让“没有归属的感觉”突然变得格外有形。"
        }
      ]
    }
  ];

  const growthEvents = [
    {
      id: "overseas_presentation_week",
      stage: "college",
      title: "presentation 周来得很快，而你的焦虑通常比开场白更早到",
      text: "全英文展示、Q&A 和台下同学的眼神，会把语言、准备度和自我怀疑一次性全推上来。",
      minAge: 19,
      maxAge: 25,
      weight: 10,
      tags: ["overseas", "college", "academic"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        someFlags: ["overseas_phase_parallel", "overseas_phase_independent"]
      },
      choices: [
        {
          text: "把稿子、结构和 rehearsal 做到足够稳，用准备把紧张压下去。",
          effects: { age: 1, stats: { intelligence: 2, discipline: 2, stress: 1 } },
          addFlags: ["presentation_survived"],
          customAction: "update_overseas_profile",
          customPayload: {
            addFocuses: ["academic"],
            metrics: { languagePressure: -5, academicPressure: 5, confidence: 0, socialComfort: 4, careerClarity: 3, belonging: 3 }
          },
          log: "你没有等自己不紧张，而是靠准备把这场必须上的台子硬接住了。"
        },
        {
          text: "展示完以后只记得自己哪里说得不够好，心里开始反复回放那些卡顿。",
          effects: { age: 1, stats: { mental: -2, stress: 3, happiness: -1 } },
          customAction: "update_overseas_profile",
          customPayload: {
            addFocuses: ["academic", "isolation"],
            metrics: { languagePressure: 2, burnout: 5, academicPressure: 6, belonging: -2 }
          },
          log: "台是上完了，可那种“我是不是始终不够像这里的人”的感觉没有马上退下去。"
        }
      ]
    },
    {
      id: "overseas_office_hour_mentor",
      stage: "college",
      title: "去不去 office hour，往往是很多人真正分化开的地方",
      text: "有人会很自然地去找教授追问、聊方向、要反馈；有人会一直觉得自己还不够好，不配占用对方时间。",
      minAge: 19,
      maxAge: 26,
      weight: 9,
      tags: ["overseas", "college", "academic", "career"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        someFlags: ["overseas_phase_parallel", "overseas_phase_independent"]
      },
      choices: [
        {
          text: "鼓起勇气去问问题，哪怕一开始很笨，也先让老师记住你。",
          relationshipEffects: [
            {
              targetId: "professor_anika_reed",
              familiarity: 10,
              trust: 10,
              affection: 4,
              status: "familiar",
              interactions: 1,
              addSharedHistory: ["reed_office_hour"],
              history: "你第一次进 Professor Reed 的 office hour 时很紧，但也正是那一次，她开始记住你。"
            }
          ],
          effects: { age: 1, stats: { intelligence: 2, career: 2, social: 1 } },
          addFlags: ["mentor_support"],
          customAction: "update_overseas_profile",
          customPayload: {
            addMentorIds: ["professor_anika_reed"],
            addFocuses: ["academic", "career"],
            metrics: { academicPressure: -2, careerClarity: 8, belonging: 4, stayScore: 5 }
          },
          log: "你第一次意识到，国外资源也不是自动掉下来的，但只要你走过去，很多门确实会慢慢开。"
        },
        {
          text: "先继续自己闷着做，等真的准备好了再去也不迟。",
          effects: { age: 1, stats: { discipline: 1, stress: 2 } },
          customAction: "update_overseas_profile",
          customPayload: {
            addFocuses: ["academic"],
            metrics: { academicPressure: 4, careerClarity: -2, loneliness: 2, belonging: -1 }
          },
          log: "你不是不努力，只是还没学会把求助和争取资源也当成能力的一部分。"
        }
      ]
    },
    {
      id: "overseas_deadline_stack",
      stage: "college",
      title: "essay、exam、group work 和日常生活叠在一起时，国外读书的压力才会真正长出形状",
      text: "你可能白天在课上做笔记，晚上赶 essay，周末还要买菜、洗衣和回消息。国外生活最容易让人累的地方，就是没有哪个部分会自动暂停。",
      minAge: 20,
      maxAge: 27,
      weight: 10,
      tags: ["overseas", "college", "pressure"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        someFlags: ["overseas_phase_parallel", "overseas_phase_independent", "overseas_phase_complex"]
      },
      choices: [
        {
          text: "给自己搭一套 deadline 清单和生活节奏，先别让所有事同时炸开。",
          effects: { age: 1, stats: { discipline: 3, mental: 1, stress: 1 } },
          addFlags: ["study_system_built"],
          customAction: "update_overseas_profile",
          customPayload: {
            addFocuses: ["academic", "survival"],
            metrics: { academicPressure: 2, burnout: -4, independence: 5, careerClarity: 2 }
          },
          log: "你没有让自己继续被事情推着跑，而是开始主动搭起一套能撑住国外生活的节奏。"
        },
        {
          text: "硬扛着往前冲，效率没立刻掉，可整个人明显开始失衡。",
          effects: { age: 1, stats: { health: -2, mental: -2, stress: 4 } },
          addFlags: ["chronic_stress"],
          customAction: "update_overseas_profile",
          customPayload: {
            addFocuses: ["academic", "isolation"],
            metrics: { academicPressure: 8, burnout: 10, loneliness: 3, homesickness: 2 }
          },
          log: "你短时间内确实还能顶住，但也能感觉到那种靠意志硬撑的成本开始在身体和情绪上结账。"
        }
      ]
    },
    {
      id: "overseas_part_time_shift",
      stage: "college",
      title: "兼职机会来了以后，钱和学业就不再是两条分开的线",
      text: "工资能缓解生活成本，可班表、通勤和打烊时间也会真实地吃掉你的精力。半工半读不是一个标签，而是一套很具体的体力账和时间账。",
      minAge: 19,
      maxAge: 27,
      weight: 10,
      tags: ["overseas", "college", "money", "work"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        someFlags: ["overseas_phase_parallel", "overseas_phase_independent", "overseas_finance_high"]
      },
      choices: [
        {
          text: "接下兼职，把房租和日常先稳住，再说别的。",
          relationshipEffects: [
            {
              targetId: "leo_park",
              familiarity: 14,
              trust: 10,
              affection: 8,
              status: "familiar",
              interactions: 2,
              addSharedHistory: ["leo_first_shift"],
              history: "你第一次在 Leo 手下顶晚班时非常生涩，但也正是那几次收尾，让你开始摸到国外兼职生活的节奏。"
            }
          ],
          effects: { age: 1, stats: { money: 4, career: 2, health: -1, stress: 2 } },
          addFlags: ["part_time_overseas"],
          customAction: "update_overseas_profile",
          customPayload: {
            addSupportNetworkIds: ["leo_park"],
            addFocuses: ["survival", "career"],
            metrics: { financePressure: -10, independence: 6, burnout: 5, academicPressure: 4, careerClarity: 4, stayScore: 2 }
          },
          log: "国外生活的成本没有因为你年轻就少一点，你只能先把现实撑住。"
        },
        {
          text: "还是先把精力押在学业和申请上，暂时不想再分散注意力。",
          effects: { age: 1, stats: { intelligence: 2, discipline: 1, money: -2, stress: 1 } },
          customAction: "update_overseas_profile",
          customPayload: {
            addFocuses: ["academic"],
            metrics: { financePressure: 6, academicPressure: -2, careerClarity: 2, burnout: 1 }
          },
          log: "你知道钱很紧，但也知道一旦把太多班塞进来，学业可能会先掉。"
        }
      ]
    },
    {
      id: "overseas_comparison_spiral",
      stage: "college",
      title: "看见别人适应得很好时，你会很难不拿自己去比",
      text: "有人英语张口就来，有人社交局轻松切换，有人已经拿到教授推荐和 internship。你明知道每个人起点不同，可比较心理还是会自己长出来。",
      minAge: 20,
      maxAge: 28,
      weight: 8,
      tags: ["overseas", "college", "mental"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        someFlags: ["overseas_phase_parallel", "overseas_phase_independent", "overseas_phase_complex"]
      },
      choices: [
        {
          text: "把比较变成信息，认真看别人到底比你多做了什么。",
          relationshipEffects: [
            {
              targetId: "arjun_mehta",
              familiarity: 8,
              trust: 6,
              status: "close",
              interactions: 1,
              addSharedHistory: ["arjun_compare_spiral"],
              history: "Arjun 适应得很快，这既刺激了你，也逼你第一次认真拆解别人的节奏到底是怎么搭起来的。"
            }
          ],
          effects: { age: 1, stats: { intelligence: 1, discipline: 2, mental: 1 } },
          customAction: "update_overseas_profile",
          customPayload: {
            addFocuses: ["academic", "career"],
            metrics: { burnout: -2, careerClarity: 4, socialComfort: 2, identityShift: 3 }
          },
          log: "你没有再把比较只用来否定自己，而是开始把它变成一种拆解现实的方法。"
        },
        {
          text: "越看越觉得自己慢，最后连原本能做的事都开始提不起劲。",
          effects: { age: 1, stats: { mental: -3, happiness: -2, stress: 2 } },
          addFlags: ["comparison_trap"],
          customAction: "update_overseas_profile",
          customPayload: {
            addFocuses: ["isolation"],
            metrics: { burnout: 6, loneliness: 4, belonging: -3, academicPressure: 3 }
          },
          log: "比较最伤人的地方，不是发现别人快，而是它会让你开始怀疑自己是不是从一开始就不该来。"
        }
      ]
    }
  ];

  const independentEvents = [
    {
      id: "overseas_rent_renewal",
      stage: "young_adult",
      title: "续租、搬家还是换更远一点的房子，都会直接决定你的生活质感",
      text: "房租涨幅、通勤时间、室友质量和押金，任何一项都不只是数字。你会发现，国外生活很大一部分成熟感，其实是被住房问题一点点逼出来的。",
      minAge: 21,
      maxAge: 29,
      weight: 9,
      tags: ["overseas", "young_adult", "life", "money"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        someFlags: ["overseas_phase_parallel", "overseas_phase_independent", "overseas_phase_complex"]
      },
      choices: [
        {
          text: "搬去更便宜但更远的地方，把现实成本先压下来。",
          effects: { age: 1, stats: { money: 3, stress: 1, happiness: -1 } },
          addFlags: ["long_commute_life"],
          customAction: "update_overseas_profile",
          customPayload: {
            phase: "independent",
            housingType: "更远但更便宜的住处",
            budgetMode: "生存优先",
            addFocuses: ["survival"],
            metrics: { financePressure: -8, belonging: -1, independence: 6, burnout: 3 }
          },
          log: "你没有选最舒服的住法，而是先把国外生活最硬的一笔账压住。"
        },
        {
          text: "继续留在更方便的区域，哪怕每个月都要更紧地算钱。",
          effects: { age: 1, stats: { happiness: 1, money: -3, stress: 2 } },
          customAction: "update_overseas_profile",
          customPayload: {
            phase: "independent",
            housingType: "通勤方便但更贵的住处",
            budgetMode: "时间优先",
            addFocuses: ["career", "social"],
            metrics: { financePressure: 6, socialComfort: 3, belonging: 3, independence: 5, stayScore: 2 }
          },
          log: "你开始学着给自己的时间和精力定价，而不只是盯着房租数字。"
        }
      ]
    },
    {
      id: "overseas_unexpected_expense",
      stage: "young_adult",
      title: "一笔突然冒出来的费用，会让“国外独立生活”瞬间变得很现实",
      text: "可能是看病、换签材料、电脑坏了，也可能只是押金被卡住。你会发现，真正压人的往往不是大计划，而是这种没有人替你兜底的小事故。",
      minAge: 21,
      maxAge: 30,
      weight: 8,
      tags: ["overseas", "young_adult", "money", "pressure"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        someFlags: ["overseas_phase_independent", "overseas_phase_complex", "overseas_phase_decision"]
      },
      choices: [
        {
          text: "先动用积蓄和分期把事情顶过去，以后再慢慢补回来。",
          effects: { age: 1, stats: { money: -4, stress: 2, discipline: 1 } },
          customAction: "update_overseas_profile",
          customPayload: {
            addFocuses: ["survival"],
            metrics: { financePressure: 8, independence: 4, burnout: 2 }
          },
          log: "你没有人可以立刻帮你收尾，只能自己把现金流和焦虑一起接过去。"
        },
        {
          text: "主动去找老师、学长或同事问办法，尽量别一个人硬扛。",
          relationshipEffects: [
            {
              targetId: "chen_jialin",
              familiarity: 8,
              trust: 10,
              affection: 6,
              status: "close",
              interactions: 1,
              history: "那次突发费用把你压得很烦，是陈嘉霖提醒你并不是所有问题都只能自己咽下去。"
            },
            {
              targetId: "professor_anika_reed",
              familiarity: 6,
              trust: 8,
              affection: 3,
              status: "close",
              interactions: 1,
              addSharedHistory: ["reed_reference_mail"],
              history: "Professor Reed 没有直接替你解决所有问题，但她给出的那封邮件和那条建议，确实替你接住了一口气。"
            }
          ],
          effects: { age: 1, stats: { social: 1, mental: 1, stress: 1 } },
          customAction: "update_overseas_profile",
          customPayload: {
            addSupportNetworkIds: ["chen_jialin"],
            addMentorIds: ["professor_anika_reed"],
            metrics: { financePressure: 3, belonging: 5, loneliness: -3, independence: 5 }
          },
          log: "你开始接受一件事：独立不等于凡事闭嘴，知道什么时候求助，本身也是成年能力。"
        }
      ]
    },
    {
      id: "overseas_first_real_crisis",
      stage: "young_adult",
      title: "第一次真正独立解决大问题以后，你会明显感觉到自己不一样了",
      text: "可能是搬家、签证材料、课程挂科补救、兼职冲突，或者一堆问题同时来。那种没有人能替你最后拍板的感觉，会把人成年得很快。",
      minAge: 22,
      maxAge: 30,
      weight: 9,
      tags: ["overseas", "young_adult", "growth"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        someFlags: ["overseas_phase_independent", "overseas_phase_complex", "overseas_phase_decision"]
      },
      choices: [
        {
          text: "把所有碎问题拆开，一个个解决，最后居然真的撑过去了。",
          effects: { age: 1, stats: { mental: 2, discipline: 2, happiness: 2 } },
          addFlags: ["overseas_self_trust"],
          customAction: "update_overseas_profile",
          customPayload: {
            addFocuses: ["career"],
            metrics: { independence: 10, belonging: 6, burnout: -4, identityShift: 8, stayScore: 4 }
          },
          log: "你第一次非常清楚地感觉到，自己已经不是那个刚落地时什么都想问的人了。"
        },
        {
          text: "虽然也扛过去了，但整个人像被耗空一样，开始怀疑这种日子还要撑多久。",
          effects: { age: 1, stats: { mental: -1, stress: 3, happiness: -1 } },
          customAction: "update_overseas_profile",
          customPayload: {
            addFocuses: ["isolation"],
            metrics: { independence: 6, burnout: 8, returnScore: 5, belonging: -1 }
          },
          log: "你不是没能力解决，只是越来越清楚，能解决和想继续这样活下去，不一定是同一件事。"
        }
      ]
    },
    {
      id: "overseas_found_circle",
      stage: "young_adult",
      title: "慢慢找到自己的圈子以后，国外生活终于不再总像临时停靠",
      text: "可能是一群固定吃饭的人、一个愿意回你消息的小圈子、一个社团、一个共享厨房，或者某个你知道自己会再回去的地方。\n\n现在支撑你的海外关系网：{overseasSupportSummary}",
      minAge: 22,
      maxAge: 30,
      weight: 8,
      tags: ["overseas", "young_adult", "social", "growth"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        someFlags: ["overseas_phase_independent", "overseas_phase_complex"]
      },
      choices: [
        {
          text: "你开始认真经营这些关系，不再把所有联系都当成可有可无。",
          effects: { age: 1, stats: { social: 3, happiness: 2, mental: 1 } },
          customAction: "update_overseas_profile",
          customPayload: {
            phase: "complex",
            addFocuses: ["social"],
            metrics: { belonging: 10, loneliness: -8, socialComfort: 6, stayScore: 5 }
          },
          log: "你终于不是只在国外“待着”，而是真的开始在这里有了会反复回去的人和地方。"
        },
        {
          text: "你知道这些关系重要，却还是习惯性地不敢太依赖任何人。",
          effects: { age: 1, stats: { mental: -1, social: 1 } },
          addFlags: ["guarded_belonging"],
          customAction: "update_overseas_profile",
          customPayload: {
            phase: "complex",
            addFocuses: ["isolation"],
            metrics: { belonging: 4, loneliness: 2, identityShift: 4, returnScore: 2 }
          },
          log: "你不是没有圈子，只是还没完全相信自己可以把一部分重心真的放在这里。"
        }
      ]
    }
  ];

  const relationshipEvents = [
    {
      id: "overseas_domestic_time_difference",
      stage: "young_adult",
      title: "时差和新圈子会悄悄改写一段旧关系的日常手感",
      text: "对话越来越难卡在同一个时间点，新生活里又总有别人和别的事进来。关系并不一定立刻坏掉，但它会先开始失去原来的频率和在场感。",
      minAge: 21,
      maxAge: 30,
      weight: 9,
      tags: ["overseas", "young_adult", "relationship"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        anyRelationshipStatuses: ["long_distance_dating", "distance_cooling", "cross_border_ambiguous"]
      },
      choices: [
        {
          text: "认真解释自己的节奏变化，尽量别让沉默自己长成误会。",
          effects: { age: 1, stats: { social: 1, stress: 1, discipline: 1 } },
          relationshipEffects: [
            {
              targetId: "$domestic_anchor",
              trust: 8,
              commitment: 6,
              continuity: 6,
              tension: -4,
              status: "long_distance_dating",
              history: "你没有把变化全丢给时差，而是认真把新生活的节奏和自己的状态解释给对方听。"
            }
          ],
          customAction: "update_overseas_profile",
          customPayload: {
            addFocuses: ["romance"],
            metrics: { loneliness: -2, homesickness: 2, returnScore: 4 }
          },
          log: "异国关系里真正稀缺的，从来不是道理，而是愿不愿意继续解释和继续在场。"
        },
        {
          text: "懒得每次都解释那么多，很多对话慢慢就被留到“以后再说”。",
          effects: { age: 1, stats: { happiness: -2, stress: 2, mental: -1 } },
          relationshipEffects: [
            {
              targetId: "$domestic_anchor",
              trust: -6,
              continuity: -5,
              tension: 8,
              status: "distance_cooling",
              history: "你们不是没感情了，只是都越来越难在最需要的时候刚好出现在对方那边。"
            }
          ],
          customAction: "update_overseas_profile",
          customPayload: {
            addFocuses: ["isolation"],
            metrics: { loneliness: 4, belonging: -1, returnScore: 5 }
          },
          log: "很多关系不是被一次大事打断，而是在重复的低频里慢慢失去重量。"
        }
      ]
    },
    {
      id: "overseas_new_attraction_values",
      stage: "young_adult",
      title: "新的吸引力来得很具体，而不同文化背景也会把恋爱观差异放大",
      text: "有人觉得关系开始前就该说清边界，有人觉得先靠近再定义也很正常。你会发现，国外感情线复杂的不只是人，还有大家默认的关系规则本来就不一样。",
      minAge: 21,
      maxAge: 30,
      weight: 9,
      tags: ["overseas", "young_adult", "relationship", "culture"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        someFlags: ["overseas_phase_complex", "overseas_phase_independent"]
      },
      choices: [
        {
          text: "你开始被一种更直接、更讲平等的相处方式吸引，也逼自己重新想恋爱到底该怎么谈。",
          relationshipEffects: [
            {
              targetId: "nora_bennett",
              affection: 10,
              trust: 10,
              playerInterest: 10,
              theirInterest: 8,
              ambiguity: 6,
              status: "ambiguous",
              addSharedHistory: ["nora_direct_talk"],
              history: "你和 Nora 聊到关系和边界时，第一次明显意识到自己其实已经被她吸引。"
            }
          ],
          effects: { age: 1, stats: { happiness: 2, mental: 1, social: 1 } },
          customAction: "update_overseas_profile",
          customPayload: {
            addFocuses: ["romance", "social"],
            metrics: { identityShift: 6, belonging: 4, stayScore: 4 }
          },
          log: "国外感情真正改写你的，往往不是一个人，而是那个人背后完全不同的一套相处观。"
        },
        {
          text: "你反而更谨慎了，越是知道规则不同，越怕自己在感情里又走进不清不楚。",
          effects: { age: 1, stats: { mental: 1, happiness: -1 } },
          customAction: "update_overseas_profile",
          customPayload: {
            addFocuses: ["romance"],
            metrics: { identityShift: 4, loneliness: 2, returnScore: 2 }
          },
          log: "你不是不心动，只是比以前更清楚，关系开始得轻松，不代表后面就不会变重。"
        }
      ]
    },
    {
      id: "overseas_social_media_misread",
      stage: "young_adult",
      title: "朋友圈、合照和动态，会把“你现在到底和谁更近”这种问题放大得很快",
      text: "在国内的人并看不到你全部的生活，可他们会从社交媒体上抓住几个足够刺眼的瞬间。很多误会不是凭空来的，而是来自片段信息和不再同步的生活。",
      minAge: 21,
      maxAge: 31,
      weight: 8,
      tags: ["overseas", "young_adult", "relationship", "exposure"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        anyRelationshipStatuses: ["long_distance_dating", "distance_cooling", "cross_border_ambiguous"]
      },
      choices: [
        {
          text: "看到对方不舒服以后，先把话说开，不让猜测继续滚下去。",
          effects: { age: 1, stats: { social: 1, stress: 1 } },
          relationshipEffects: [
            {
              targetId: "$domestic_anchor",
              trust: 6,
              tension: -3,
              continuity: 4,
              history: "你没有让对方继续自己拼图，而是主动把照片背后的真实情况说清了。"
            }
          ],
          customAction: "update_overseas_profile",
          customPayload: {
            addFocuses: ["romance"],
            metrics: { exposureRisk: 4, loneliness: -1, returnScore: 2 }
          },
          log: "你开始明白，异国关系里“及时解释”本身就是一种很重要的在场。"
        },
        {
          text: "觉得只是小事，不想每张照片都解释，结果误会却越积越多。",
          effects: { age: 1, stats: { stress: 2, mental: -1 } },
          relationshipEffects: [
            {
              targetId: "$domestic_anchor",
              trust: -6,
              tension: 8,
              status: "distance_cooling",
              history: "你没觉得那几张照片有多严重，可对方看到的是你一个几乎没再解释的新生活。"
            }
          ],
          customAction: "update_overseas_profile",
          customPayload: {
            addFocuses: ["romance", "isolation"],
            metrics: { exposureRisk: 10, loneliness: 2, returnScore: 4 }
          },
          log: "当两个人只剩片段信息的时候，很多“你应该懂我”的前提都会先失效。"
        }
      ]
    }
  ];

  const turningPointEvents = [
    {
      id: "overseas_burnout_rebalance",
      stage: "young_adult",
      title: "撑到某个节点以后，你不得不重新决定自己到底要把什么排在最前面",
      text: "国外生活最典型的疲惫不是一次爆炸，而是学习、兼职、关系、搬家和未来焦虑一起把人慢慢磨薄。问题到这里已经不是“还能不能扛”，而是你要不要继续用这种方式活。",
      minAge: 22,
      maxAge: 31,
      weight: 9,
      tags: ["overseas", "young_adult", "pressure", "turning"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        someFlags: ["overseas_phase_independent", "overseas_phase_complex", "overseas_burnout_risk"]
      },
      choices: [
        {
          text: "主动砍掉一部分没必要的消耗，把生活重新调回可持续。",
          effects: { age: 1, stats: { mental: 2, health: 2, happiness: 1 } },
          addFlags: ["recovery_turn"],
          customAction: "update_overseas_profile",
          customPayload: {
            phase: "decision",
            removeFocuses: ["isolation"],
            addFocuses: ["career"],
            metrics: { burnout: -10, academicPressure: -4, loneliness: -2, careerClarity: 4, identityShift: 4 }
          },
          log: "你第一次不再只是应付眼前，而是认真问了自己一句：什么样的活法才能让我继续走下去。"
        },
        {
          text: "先继续顶着，想等这阵过去再说，结果整个人更明显地空掉了。",
          effects: { age: 1, stats: { health: -2, mental: -3, stress: 4 } },
          addFlags: ["overworked"],
          customAction: "update_overseas_profile",
          customPayload: {
            phase: "decision",
            addFocuses: ["isolation"],
            metrics: { burnout: 8, returnScore: 6, belonging: -2 }
          },
          log: "有些失衡并不会因为时间自己好，它只会先把你能用来判断的那部分心力一起磨掉。"
        }
      ]
    },
    {
      id: "overseas_internship_breakthrough",
      stage: "young_adult",
      title: "一段项目、推荐或 internship，可能会把你真正带向完全不同的未来",
      text: "真正改变海外路线后半段的，常常不是一个宏大梦想，而是某个老师、某个 reference、某段实习让你第一次看见“自己或许真的能在这里继续走下去”。\n\n现在影响你未来判断的分支倾向：{overseasBranchSummary}",
      minAge: 22,
      maxAge: 31,
      weight: 9,
      tags: ["overseas", "young_adult", "career", "turning"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        someFlags: ["mentor_support", "overseas_focus_career", "overseas_focus_academic", "overseas_phase_decision"]
      },
      choices: [
        {
          text: "抓住机会往研究 / 更高门槛的专业方向走，哪怕压力也会一起上来。",
          relationshipEffects: [
            {
              targetId: "professor_anika_reed",
              trust: 10,
              familiarity: 8,
              status: "close",
              interactions: 1,
              addSharedHistory: ["reed_direction_shift"],
              history: "Professor Reed 没有替你决定未来，但她确实把你往更高门槛的方向推了一把。"
            }
          ],
          effects: { age: 1, stats: { intelligence: 2, career: 3, stress: 2 } },
          customAction: "update_overseas_profile",
          customPayload: {
            phase: "decision",
            addMentorIds: ["professor_anika_reed"],
            addFocuses: ["academic", "career"],
            metrics: { careerClarity: 10, stayScore: 8, visaPressure: 4, identityShift: 5 }
          },
          log: "你第一次不是抽象地说想留下，而是真的看见一条继续往上接的门缝。"
        },
        {
          text: "更想把机会落到工作和本地行业里，先看自己能不能留下来站稳。",
          relationshipEffects: [
            {
              targetId: "leo_park",
              trust: 8,
              familiarity: 8,
              affection: 6,
              status: "close",
              interactions: 1,
              addSharedHistory: ["leo_reference_offer"],
              history: "Leo 很现实地告诉你，本地工作不是梦想问题，而是你愿不愿意继续把自己丢进更硬的现实里。"
            }
          ],
          effects: { age: 1, stats: { career: 3, social: 1, stress: 2 } },
          customAction: "update_overseas_profile",
          customPayload: {
            phase: "decision",
            addSupportNetworkIds: ["leo_park"],
            addFocuses: ["career"],
            metrics: { careerClarity: 9, stayScore: 7, financePressure: -2, visaPressure: 6, belonging: 4 }
          },
          log: "你开始把未来从“继续读书”慢慢转成“能不能在这里真的工作下去”。"
        }
      ]
    },
    {
      id: "overseas_visa_reality",
      stage: "young_adult",
      title: "毕业前后，签证和现实条件会逼你把“留下还是回去”从情绪问题变成选择题",
      text: "你可以喜欢这里，也可以在这里长出归属感，但签证、经济条件、岗位和家里的牵引都会要求你给出更具体的答案。\n\n现在内心的未来拉力：{overseasFuturePull}",
      minAge: 22,
      maxAge: 32,
      weight: 10,
      tags: ["overseas", "young_adult", "decision"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        someFlags: ["overseas_phase_decision", "overseas_phase_complex", "overseas_phase_independent"]
      },
      choices: [
        {
          text: "继续冲留下来的可能性，哪怕接下来每一步都会更现实、更难。",
          effects: { age: 1, stats: { stress: 2, career: 2, discipline: 1 } },
          customAction: "update_overseas_profile",
          customPayload: {
            phase: "decision",
            addFocuses: ["career"],
            metrics: { stayScore: 10, visaPressure: 8, belonging: 4, returnScore: -2 }
          },
          log: "你没有再把“留下”当成一个感性的愿望，而是真的开始为它承受制度和现实的重量。"
        },
        {
          text: "越来越觉得回国也不是退一步，而是另一种更实际的重新开始。",
          effects: { age: 1, stats: { mental: 1, familySupport: 2 } },
          customAction: "update_overseas_profile",
          customPayload: {
            phase: "decision",
            addFocuses: ["career"],
            metrics: { returnScore: 10, stayScore: -2, homesickness: 4, visaPressure: -2 }
          },
          log: "你开始承认，回国并不等于白来一趟，它也可能是一种更完整地把这几年带回去。"
        }
      ]
    },
    {
      id: "overseas_graduation_choice",
      stage: "young_adult",
      title: "毕业以后，国外这几年会不会变成人生长期走向，就看你怎么接这一段",
      text: "到这里为止，国外生活已经不只是一个地点设定。它改写了你的能力、关系、对亲密关系的理解、对未来的价值判断，也把“留下 / 回国”变成了真正会重排人生的一次决策。",
      minAge: 23,
      maxAge: 33,
      weight: 12,
      tags: ["overseas", "young_adult", "decision", "milestone"],
      conditions: {
        requiredFlags: ["life_path_overseas"],
        someFlags: ["overseas_phase_decision"]
      },
      choices: [
        {
          text: "继续把平台往上接，去争更高门槛的研究 / 深造路径。",
          conditions: {
            someFlags: ["mentor_support", "overseas_focus_academic", "overseas_career_clear"],
            minStats: { intelligence: 55 }
          },
          setCareerRoute: "overseas_global_research_route",
          customAction: "update_overseas_profile",
          customPayload: {
            addFocuses: ["academic", "career"],
            metrics: { stayScore: 8, careerClarity: 6, visaPressure: 4, identityShift: 4 }
          }
        },
        {
          text: "试着留在国外工作，把读书这几年硬接成真正的长期生活。",
          conditions: {
            someFlags: ["overseas_focus_career", "overseas_stay_bias", "overseas_career_clear"]
          },
          setCareerRoute: "overseas_local_job_route",
          customAction: "update_overseas_profile",
          customPayload: {
            addFocuses: ["career"],
            metrics: { stayScore: 10, belonging: 5, visaPressure: 8, financePressure: 2 }
          }
        },
        {
          text: "带着这些改变回国，把海外经历重新放进更熟悉的土壤里。",
          setCareerRoute: "overseas_returnee_route",
          customAction: "update_overseas_profile",
          customPayload: {
            metrics: { returnScore: 10, homesickness: 2, identityShift: 5 }
          }
        },
        {
          text: "为了那段仍然放不下的关系或家庭牵引回国，把人生顺序重新排一遍。",
          conditions: {
            someFlags: ["overseas_return_bias", "relationship_heat_school", "adolescent_romance_deepening"],
            anyRelationshipStatuses: ["long_distance_dating", "distance_cooling", "steady", "reconnected"]
          },
          setCareerRoute: "overseas_relationship_return_route",
          customAction: "update_overseas_profile",
          customPayload: {
            addFocuses: ["romance"],
            metrics: { returnScore: 12, stayScore: -2, belonging: -2 }
          }
        },
        {
          text: "先靠短签和临时岗继续留下，哪怕还没有一条真正稳下来的路。",
          conditions: {
            someFlags: ["overseas_stay_bias", "part_time_overseas", "overseas_finance_high", "overseas_visa_anxiety"]
          },
          setCareerRoute: "overseas_survival_extension_route",
          customAction: "update_overseas_profile",
          customPayload: {
            addFocuses: ["survival", "career"],
            metrics: { stayScore: 6, visaPressure: 10, burnout: 5, financePressure: 4 }
          }
        }
      ]
    }
  ];

  const allEventSets = {
    adaptation: adaptationEvents,
    integration: integrationEvents,
    growth: growthEvents,
    independence: independentEvents,
    relationships: relationshipEvents,
    decisions: turningPointEvents
  };

  window.LIFE_OVERSEAS_EVENT_SETS = allEventSets;
  appendWindowList(
    "LIFE_EXTRA_EVENTS",
    Object.keys(allEventSets).reduce(function (list, key) {
      return list.concat(allEventSets[key]);
    }, [])
  );

  const overseasEndings = [
    {
      id: "overseas_rooted_abroad",
      title: "结局：在国外真正站稳，也把异乡慢慢活成了归属",
      text: "你没有把国外只过成一段履历。那些办手续、搬家、熬夜、小组作业、兼职、关系重排和无数次自己兜底的时刻，最后一起把你推到了一个真正能长期站住的位置。",
      baseWeight: 5,
      require: {
        minAge: 56,
        minChoices: 88,
        someFlags: ["overseas_chose_stay", "overseas_settled", "overseas_independent_strong"],
        careerRouteIds: ["overseas_local_job_route", "overseas_global_research_route"]
      },
      weightModifiers: [
        { weight: 14, when: { someFlags: ["overseas_stay_bias", "mentor_support"] } },
        { weight: 10, when: { minStats: { career: 66, mental: 54 } } },
        { weight: 8, when: { requiredTags: ["selfhood"] } }
      ]
    },
    {
      id: "overseas_return_reframed",
      title: "结局：回国以后，你已经不是原来那个会被原地收回去的人",
      text: "你最后还是回来了，但回来并不是把那几年撤销。国外生活让你对关系、边界、职业和自己能承受什么都有了新判断，于是熟悉的环境也被你活出了新的样子。",
      baseWeight: 5,
      require: {
        minAge: 56,
        minChoices: 88,
        someFlags: ["overseas_chose_return", "returnee_identity"],
        careerRouteIds: ["overseas_returnee_route", "overseas_relationship_return_route"]
      },
      weightModifiers: [
        { weight: 12, when: { minStats: { career: 60, mental: 56 } } },
        { weight: 10, when: { someFlags: ["boundary_awareness", "overseas_self_trust"] } },
        { weight: 8, when: { requiredTags: ["family", "selfhood"] } }
      ]
    },
    {
      id: "overseas_inbetween_drift",
      title: "结局：异乡待了很多年，却始终像临时停靠",
      text: "你不是没努力适应，也不是没留下来过。只是语言、身份、关系和归属感始终没有真正并到一条线上。很多年以后回看，你会知道自己其实一直活在一种悬着的中间状态里。",
      baseWeight: 4,
      require: {
        minAge: 56,
        minChoices: 88,
        someFlags: ["life_path_overseas", "overseas_isolated"],
        careerRouteIds: ["overseas_survival_extension_route", "overseas_local_job_route"]
      },
      weightModifiers: [
        { weight: 14, when: { someFlags: ["overseas_visa_anxiety", "overseas_burnout_risk"] } },
        { weight: 10, when: { maxStats: { happiness: 48, mental: 52 } } },
        { weight: 8, when: { requiredTags: ["pressure"] } }
      ]
    },
    {
      id: "overseas_love_rewrites_map",
      title: "结局：一段跨地域的关系，把你整张人生地图都改写了",
      text: "到最后，真正改变你去向的不是哪份 offer 更漂亮，而是你终于承认，有些关系已经足够重要，重要到会让城市、职业和未来排序都跟着改。",
      baseWeight: 4,
      require: {
        minAge: 56,
        minChoices: 88,
        careerRouteIds: ["overseas_relationship_return_route"],
        anyRelationshipStatuses: ["steady", "married", "reconnected", "long_distance_dating"],
        anyRelationshipMinAffection: 62
      },
      weightModifiers: [
        { weight: 12, when: { requiredTags: ["relationship", "family"] } },
        { weight: 10, when: { someFlags: ["returned_for_relationship", "future_planned"] } },
        { weight: 8, when: { minStats: { happiness: 60 } } }
      ]
    }
  ];

  window.LIFE_OVERSEAS_ENDINGS = overseasEndings;
  appendWindowList("LIFE_ENDINGS", overseasEndings);
})();

(function () {
  "use strict";

  /*
    增量扩展事件说明：
    - 本文件只追加事件，不替换原有事件结构。
    - 保持“数据描述”和“引擎逻辑”分离，方便后续单独改某个事件或选项。
    - relationshipEffects.targetId 支持写具体对象 id，也支持 "$active" 表示当前关注对象。
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
      noCurrentPartner: Boolean(source.noCurrentPartner),
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
      clearActive: Boolean(source.clearActive),
    };
  }

  function mutation(value) {
    const source = value && typeof value === "object" ? value : {};
    const effects = source.effects && typeof source.effects === "object" ? source.effects : {};

    return {
      effects: {
        age: typeof effects.age === "number" ? effects.age : 0,
        stats: toStats(effects.stats),
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
      log: typeof source.log === "string" ? source.log : "",
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
      next: Object.prototype.hasOwnProperty.call(source, "next") ? source.next : undefined,
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
      tags: toList(source.tags),
      conditions: condition(source.conditions),
      effectsOnEnter: mutation(source.effectsOnEnter),
      choices: Array.isArray(source.choices) ? source.choices.map(choice) : [],
    };
  }

  const EARLY_STAGE_EXPANSION = [
    event({
      id: "kindergarten_gate",
      stage: "childhood",
      title: "幼儿园门口的那一下分离",
      text: "第一次真正被放进集体生活时，你才发现“离开熟悉的人一会儿”对一个孩子来说并不小。有人哭得天崩地裂，有人硬撑着不回头，也有人在慌乱里慢慢学会适应。",
      minAge: 3,
      maxAge: 4,
      weight: 9,
      tags: ["childhood", "growth"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你第一次在真正意义上离开家，去适应一个不以你为中心运转的小世界。",
      }),
      choices: [
        choice({
          text: "你哭得很凶，但总有人愿意蹲下来安抚你。",
          effects: {
            age: 0,
            stats: { happiness: 4, social: 2 },
          },
          addFlags: ["separation_comfort", "emotional_safety"],
          addTags: ["security", "relationship"],
          log: "你记住了，害怕的时候不是只能自己扛。这个印象后来会影响你如何向别人求助。",
        }),
        choice({
          text: "你强迫自己别哭，很快学会先观察环境和规则。",
          effects: {
            age: 0,
            stats: { intelligence: 4, social: 1 },
          },
          addFlags: ["early_observer", "adapt_fast"],
          addTags: ["discipline", "selfhood"],
          log: "你把不安处理成了观察和适应。它让你显得早熟，也让你更少直接暴露脆弱。",
        }),
        choice({
          text: "你表面配合，回家后却很抗拒再去。",
          effects: {
            age: 0,
            stats: { happiness: -3, health: 2 },
          },
          addFlags: ["separation_resistance", "sensitive_attachment"],
          addTags: ["wound", "selfhood"],
          log: "你对分离的反应比别人更深一些。很多后来对关系的拉扯，都能追溯到这种不想被突然丢下的感觉。",
        }),
      ],
    }),
    event({
      id: "comparison_at_home",
      stage: "childhood",
      title: "第一次被拿去和别人比",
      text: "大人有时只是随口一句“你看谁谁谁”，可孩子会把那句话听得很重。你开始意识到，原来被爱和被期待，在一些家庭里并不是同一件事。",
      minAge: 4,
      maxAge: 6,
      weight: 8,
      tags: ["family", "childhood"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你第一次认真分辨出“我是不是不够好”这种念头。",
      }),
      choices: [
        choice({
          text: "你把这句话记得很深，从此更想证明自己。",
          effects: {
            age: 0,
            stats: { intelligence: 3, happiness: -3, career: 1 },
          },
          addFlags: ["comparison_wound", "high_expectation_child"],
          addTags: ["ambition", "pressure"],
          log: "你很早就把上进和不安绑在了一起。它会推着你往前，也会让你更难安心地停下。",
        }),
        choice({
          text: "你不太服气，心里暗暗决定不要活成别人嘴里的模板。",
          effects: {
            age: 0,
            stats: { happiness: 1, social: 1 },
          },
          addFlags: ["self_definition_seed", "stubborn_pride"],
          addTags: ["selfhood", "defiance"],
          log: "你开始隐约意识到，迎合期待并不是唯一活法。那点倔劲后来会保护你，也会让你更难妥协。",
        }),
        choice({
          text: "你鼓起勇气问父母，为什么总要这样说。",
          effects: {
            age: 0,
            stats: { social: 3, happiness: 2 },
          },
          addFlags: ["family_dialogue", "boundary_awareness"],
          addTags: ["family", "trust"],
          log: "你第一次试着把委屈说出来。哪怕大人未必完全会改，你至少没有默默吞下去。",
        }),
      ],
    }),
    event({
      id: "night_fear_and_comfort",
      stage: "childhood",
      title: "夜里害怕的时候，你是怎么学会安定下来的",
      text: "小孩的恐惧有时没有明确理由，可能只是停电、雷声、噩梦，或者某个夜晚家里气氛不太对。可一个人如何被安抚，往往会变成成年后的底层反应。",
      minAge: 4,
      maxAge: 6,
      weight: 7,
      tags: ["childhood", "emotion"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你开始在很小的年纪里，摸索“害怕的时候该怎么办”这门课。",
      }),
      choices: [
        choice({
          text: "有人会抱抱你、陪你，直到你真的睡着。",
          effects: {
            age: 0,
            stats: { happiness: 5, health: 2 },
          },
          addFlags: ["soothed_childhood", "warm_home"],
          addTags: ["security", "family"],
          log: "你慢慢知道，脆弱并不会自动招来责备。这份底气后来会让你更敢于靠近别人。",
        }),
        choice({
          text: "你学着自己数数、抱住枕头、等情绪过去。",
          effects: {
            age: 0,
            stats: { health: 3, intelligence: 2 },
          },
          addFlags: ["self_soothing_seed", "emotionally_independent"],
          addTags: ["independence", "stability"],
          log: "你提早学会了自我安抚。它让你耐受力很强，也让你更习惯在难受时先自己消化。",
        }),
        choice({
          text: "你怕被嫌麻烦，干脆装作没事。",
          effects: {
            age: 0,
            stats: { happiness: -4, intelligence: 1 },
          },
          addFlags: ["emotional_shutdown", "people_pleaser"],
          addTags: ["distance", "wound"],
          log: "你学会了把害怕和难受藏起来。那不是成熟，只是你太早感觉到情绪可能会给别人添麻烦。",
        }),
      ],
    }),
    event({
      id: "first_interest_class",
      stage: "childhood",
      title: "人生第一门兴趣班",
      text: "大人把你送去兴趣班时，未必真的知道你喜不喜欢。有的人在那里第一次遇见热爱，有的人只记得每周固定的奔波、练习和被评判。",
      minAge: 5,
      maxAge: 7,
      weight: 9,
      tags: ["childhood", "growth"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你第一次被要求在“课外”也持续投入精力，兴趣和压力从这里开始掺在一起。",
      }),
      choices: [
        choice({
          text: "你真心喜欢上了它，愿意自己反复练。",
          effects: {
            age: 0,
            stats: { happiness: 4, intelligence: 3 },
          },
          addFlags: ["long_term_hobby", "craft_seed"],
          addTags: ["craft", "selfhood"],
          log: "你第一次碰到一种不靠催也愿意投入的东西。很多年后，它可能仍会以某种形式留在你身上。",
        }),
        choice({
          text: "你谈不上热爱，但学会了按时练、按要求做完。",
          effects: {
            age: 0,
            stats: { intelligence: 2, health: 2 },
          },
          addFlags: ["routine_builder", "discipline_seed"],
          addTags: ["discipline", "stability"],
          log: "你在重复和坚持里长出了一点耐性。它未必浪漫，却会在很多关键阶段帮到你。",
        }),
        choice({
          text: "你明显抗拒，却一直被大人逼着继续。",
          effects: {
            age: 0,
            stats: { happiness: -5, social: -1 },
          },
          addFlags: ["forced_hobby_memory", "rebellion_seed"],
          addTags: ["pressure", "defiance"],
          log: "你很早就尝到一种感觉：并不是所有“为你好”都会让人觉得被理解。这会影响你后来对权威的耐心。",
        }),
      ],
    }),
    event({
      id: "small_rule_rebellion",
      stage: "childhood",
      title: "第一次认真试探规则边界",
      text: "可能是作息、零食、看电视，也可能只是“我今天就不想照做”。孩子都会试探规则，只是每个家庭对这种试探的回应不同，你也会因此长出不同的性格。",
      minAge: 5,
      maxAge: 7,
      weight: 8,
      tags: ["childhood", "growth"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你开始第一次感到，“我想怎样”和“别人要我怎样”不总是一回事。",
      }),
      choices: [
        choice({
          text: "你学会按约定来，慢慢把自律当成一种本事。",
          effects: {
            age: 0,
            stats: { health: 3, intelligence: 2 },
          },
          addFlags: ["early_self_discipline", "routine_builder"],
          addTags: ["discipline", "stability"],
          log: "你发现规则并不一定只意味着束缚，它也可能帮人建立秩序感。这个能力以后很值钱。",
        }),
        choice({
          text: "你嘴上答应，私下总想钻空子。",
          effects: {
            age: 0,
            stats: { intelligence: 2, happiness: 1 },
          },
          addFlags: ["boundary_tester", "small_rebel"],
          addTags: ["defiance", "selfhood"],
          log: "你开始享受一点点对规则的反制感。它让你有活性，也让你很难完全服从僵硬的安排。",
        }),
        choice({
          text: "你一旦被压得太死，就会突然爆发闹脾气。",
          effects: {
            age: 0,
            stats: { happiness: -2, social: -1 },
          },
          addFlags: ["temper_flash", "rebellion_seed"],
          addTags: ["pressure", "conflict"],
          log: "你不是一直反抗的人，但当压抑积到顶点时，你会用很直接的方式把不满掀出来。",
        }),
      ],
    }),
    event({
      id: "homework_table_primary",
      stage: "school",
      title: "写作业这件小事，慢慢变成了家里每天的气压",
      text: "很多家庭的情绪都会在餐桌和书桌边上反复出现。有人在陪伴里养成习惯，有人在催促里学会拖延，也有人从这里开始把学习和压迫感绑定。",
      minAge: 6,
      maxAge: 8,
      weight: 9,
      tags: ["school", "family"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "写作业第一次不只是学习任务，也成了家庭互动的一部分。",
      }),
      choices: [
        choice({
          text: "家里有人稳定陪你做完，你慢慢养成节奏。",
          effects: {
            age: 0,
            stats: { intelligence: 3, happiness: 2 },
          },
          addFlags: ["study_routine_seed", "parental_support"],
          addTags: ["discipline", "family"],
          log: "你开始知道，规律并不是天生的，很多时候它来自被持续、平静地接住。",
        }),
        choice({
          text: "没人真管你，但你自己摸索出一套办法。",
          effects: {
            age: 0,
            stats: { intelligence: 4, health: 1 },
          },
          addFlags: ["self_driven_study", "emotionally_independent"],
          addTags: ["selfhood", "discipline"],
          log: "你不是被逼着往前走的人，而是很早就习惯了自己给自己兜底。",
        }),
        choice({
          text: "每天都要被吼、被催，学习慢慢成了你最怕的一块。",
          effects: {
            age: 0,
            stats: { happiness: -5, intelligence: 1 },
          },
          addFlags: ["study_anxiety_seed", "family_pressure"],
          addTags: ["pressure", "wound"],
          log: "你并不是不会学，只是太早把“做得不够好”跟情绪惩罚连在了一起。",
        }),
      ],
    }),
    event({
      id: "playground_circle",
      stage: "school",
      title: "操场上的小圈子",
      text: "孩子之间的亲近和排斥都很直接。一起跳绳、组队、午休留位，看起来是小事，却会实打实地改写一个人对“我是不是被欢迎”的判断。",
      minAge: 7,
      maxAge: 9,
      weight: 8,
      tags: ["school", "friendship"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你开始真正体验“同龄人的评价”对心情和自我感觉有多大影响。",
      }),
      choices: [
        choice({
          text: "你慢慢进了一个小圈子，第一次觉得自己也有位置。",
          effects: {
            age: 0,
            stats: { happiness: 4, social: 4 },
          },
          addFlags: ["peer_belonging", "support_network"],
          addTags: ["relationship", "stability"],
          log: "被接纳的感觉没有什么大道理，却会让一个孩子更敢开口、更敢参与。",
        }),
        choice({
          text: "你被排在外面过一阵，开始特别在意别人语气和脸色。",
          effects: {
            age: 0,
            stats: { happiness: -4, intelligence: 2 },
          },
          addFlags: ["social_vigilance", "comparison_wound"],
          addTags: ["wound", "relationship"],
          log: "从那以后，你会更快察觉谁在冷淡、谁在敷衍。敏感有时保护你，也会让你更累。",
        }),
        choice({
          text: "你不太执着进圈子，反而自己玩出了一套乐子。",
          effects: {
            age: 0,
            stats: { happiness: 2, intelligence: 3 },
          },
          addFlags: ["solitary_imagination", "self_definition_seed"],
          addTags: ["selfhood", "curiosity"],
          log: "你没有把热闹当成唯一标准。后来很多独处时刻，你都不至于完全被空下来这件事打垮。",
        }),
      ],
    }),
    event({
      id: "teacher_single_comment",
      stage: "school",
      title: "老师一句话的后劲",
      text: "小学生会很认真地记住大人对自己的评价。一次夸奖、一次否定、一次当众点名，都会比当事人以为的更久地留在你身上。",
      minAge: 8,
      maxAge: 10,
      weight: 7,
      tags: ["school", "growth"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你开始明白，外部评价原来真的会改变一个人怎么想自己。",
      }),
      choices: [
        choice({
          text: "你被认真夸过一次，从此更敢举手和尝试。",
          effects: {
            age: 0,
            stats: { happiness: 3, intelligence: 3, social: 2 },
          },
          addFlags: ["seen_by_teacher", "confidence_seed"],
          addTags: ["visibility", "selfhood"],
          log: "那次被肯定并没有立刻改变命运，但它确实替你点亮了一小块“我也可以”的地方。",
        }),
        choice({
          text: "你因为一次当众批评，开始很怕犯错和被点名。",
          effects: {
            age: 0,
            stats: { happiness: -4, social: -2 },
          },
          addFlags: ["public_shame_memory", "perfectionism_seed"],
          addTags: ["pressure", "wound"],
          log: "你渐渐把“别出错”放到了“先试试看”前面。这种顺序以后会影响很多决定。",
        }),
        choice({
          text: "你发现大人的评价也可能不准，于是更想自己判断自己。",
          effects: {
            age: 0,
            stats: { intelligence: 2, happiness: 1 },
          },
          addFlags: ["self_reference_seed", "boundary_awareness"],
          addTags: ["selfhood", "stability"],
          log: "你没有完全把外界评价当真。那种内在坐标会在后面的很多比较里救你一次又一次。",
        }),
      ],
    }),
    event({
      id: "afterschool_tutoring",
      stage: "school",
      title: "放学后的时间开始被重新分配",
      text: "你发现同龄人的课后生活并不一样。有人补课到很晚，有人在兴趣班里发光，也有人终于拥有一点完全属于自己的空白时间。",
      minAge: 9,
      maxAge: 11,
      weight: 8,
      dedupeKey: "primary_peer_life_mesh",
      dedupeSpacingChoices: 7,
      dedupeMinAgeGap: 2,
      cooldownChoices: 5,
      tags: ["school", "growth"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "从这一阶段开始，课后时间第一次被当成“要怎么投资”的资源。",
      }),
      choices: [
        choice({
          text: "你被安排了很多补习，成绩稳了，心也更绷了。",
          effects: {
            age: 0,
            stats: { intelligence: 4, happiness: -3 },
          },
          addFlags: ["early_tutoring", "achievement_compensation"],
          addTags: ["ambition", "pressure"],
          log: "你很早知道自己不能轻松地往前。后来你确实更会扛事，但也更难自然地松下来。",
        }),
        choice({
          text: "你把时间留给兴趣和活动，学会在投入里找快乐。",
          effects: {
            age: 0,
            stats: { happiness: 4, social: 2, intelligence: 2 },
          },
          addFlags: ["interest_protected", "long_term_hobby"],
          addTags: ["craft", "selfhood"],
          log: "你没有把成长全交给成绩单，这会让你后来更容易拥有不只一种支撑自己的方式。",
        }),
        choice({
          text: "你终于有了一点自由支配的时间，开始按自己的节奏生活。",
          effects: {
            age: 0,
            stats: { happiness: 2, health: 2 },
          },
          addFlags: ["free_time_childhood", "self_definition_seed"],
          addTags: ["selfhood", "stability"],
          log: "你意识到，人需要一点不被安排满的时间，才可能长出真正属于自己的东西。",
        }),
      ],
    }),
    event({
      id: "primary_exam_comparison",
      stage: "school",
      title: "一次考试后，成绩开始有了重量",
      text: "从某个节点起，分数不再只是纸上的数字。它开始带着家长会、亲戚评价、同学位置和你自己对未来的隐约想象，一起压到你身上。",
      minAge: 10,
      maxAge: 12,
      weight: 8,
      tags: ["school", "growth"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你第一次清楚地感到，成绩这件事开始带来身份感和压力感。",
      }),
      choices: [
        choice({
          text: "你被夸得很厉害，慢慢把优秀当成不能掉下来的标签。",
          effects: {
            age: 0,
            stats: { intelligence: 3, happiness: -1 },
          },
          addFlags: ["top_student_identity", "high_expectation_child"],
          addTags: ["ambition", "pressure"],
          log: "被看作“有前途”会带来光亮，也会让你逐渐不敢面对普通表现。",
        }),
        choice({
          text: "你成绩一般，却第一次决定要靠方法慢慢追上来。",
          effects: {
            age: 0,
            stats: { intelligence: 3, health: 1 },
          },
          addFlags: ["late_starter", "study_self_driven"],
          addTags: ["discipline", "growth"],
          log: "你没有突然开窍，而是开始愿意承认差距，再一点点追。这种后劲比一时爆发更难得。",
        }),
        choice({
          text: "你被比较得很难受，心里越来越抗拒把自己只用成绩定义。",
          effects: {
            age: 0,
            stats: { happiness: -2, social: 1 },
          },
          addFlags: ["comparison_wound", "self_definition_seed"],
          addTags: ["selfhood", "wound"],
          log: "你开始强烈地想保住自己不只是一串排名。这会让你日后更在意“我是谁”，而不是“我赢了谁”。",
        }),
      ],
    }),
    event({
      id: "primary_self_management",
      stage: "school",
      title: "你开始第一次自己安排时间",
      text: "到高年级时，很多事情不会再有人一项项替你管。书包、作业、复习、睡觉、玩，你怎么处理这些，慢慢会变成长期能力的雏形。",
      minAge: 11,
      maxAge: 12,
      weight: 7,
      tags: ["school", "growth"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你第一次不只是被安排的人，也开始练习管理自己。",
      }),
      choices: [
        choice({
          text: "你给自己列了小目标，虽然笨拙，但真的慢慢坚持住了。",
          effects: {
            age: 0,
            stats: { intelligence: 3, health: 2 },
          },
          addFlags: ["teen_self_management", "early_self_discipline"],
          addTags: ["discipline", "stability"],
          log: "你不是天生自律，只是开始愿意训练自己。很多后来能不能扛住压力，都跟这个习惯有关。",
        }),
        choice({
          text: "你总是先拖，最后靠临时冲刺解决。",
          effects: {
            age: 0,
            stats: { intelligence: 1, happiness: -2 },
          },
          addFlags: ["deadline_pattern", "stress_loop_seed"],
          addTags: ["pressure", "drift"],
          log: "你练出来的是另一套能力：在慌乱里收拾残局。它很实用，却也很消耗。",
        }),
        choice({
          text: "你很难完全守住计划，但会不断修修补补，找适合自己的节奏。",
          effects: {
            age: 0,
            stats: { intelligence: 2, happiness: 1, health: 1 },
          },
          addFlags: ["flexible_routine", "self_reference_seed"],
          addTags: ["growth", "selfhood"],
          log: "你没有执着于一次就做对，而是在试错里慢慢形成自己的方法。这会让你后面更能持续。",
        }),
      ],
    }),
    event({
      id: "middle_school_best_friend",
      stage: "adolescence",
      title: "初中那种把很多心事都交出去的朋友",
      text: "青春期的友情有时比恋爱更像命门。你们分享座位、秘密、情绪和对未来的想象，也因此第一次体会到关系能带来多大支撑，又能制造多深的失落。",
      minAge: 12,
      maxAge: 14,
      weight: 8,
      tags: ["adolescence", "friendship"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你第一次在同龄人那里，把自己交出去很多。",
      }),
      choices: [
        choice({
          text: "这段友情很稳，让你在青春期有了能喘气的地方。",
          effects: {
            age: 0,
            stats: { happiness: 5, social: 4 },
          },
          addFlags: ["teen_anchor_friend", "support_network"],
          addTags: ["relationship", "stability"],
          log: "有人懂你一点点的时候，很多原本很重的日子都会被分担掉一部分。",
        }),
        choice({
          text: "你们因为秘密、误会或站队闹翻了，你开始更防备关系。",
          effects: {
            age: 0,
            stats: { happiness: -5, social: -2 },
          },
          addFlags: ["trust_break", "emotionally_guarded"],
          addTags: ["relationship", "wound"],
          log: "你第一次明白，亲近的人也会伤人。那之后你会更慢地相信别人。",
        }),
        choice({
          text: "你在这段关系里学会了认真表达，也学会了不把所有情绪都憋住。",
          effects: {
            age: 0,
            stats: { social: 4, happiness: 2 },
          },
          addFlags: ["emotional_honesty", "conflict_solver"],
          addTags: ["relationship", "growth"],
          log: "你慢慢知道，关系不是靠猜来维持的。能说出来，很多事就有机会不变成死结。",
        }),
      ],
    }),
    event({
      id: "ranking_shock",
      stage: "adolescence",
      title: "排名第一次把你按在现实里",
      text: "初中以后，竞争一下子清晰起来。以前你可能只是某个班里的好学生，现在却开始被放进更大的排序里，原来自尊心也会和排名一起上上下下。",
      minAge: 12,
      maxAge: 15,
      weight: 8,
      tags: ["adolescence", "school"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你第一次真切地感到，同样的努力放进更大的场域里，位置并不一定还稳。",
      }),
      choices: [
        choice({
          text: "你被刺激到了，开始更系统地学，哪怕代价是更焦虑。",
          effects: {
            age: 0,
            stats: { intelligence: 4, happiness: -3 },
          },
          addFlags: ["study_system_seed", "achievement_compensation"],
          addTags: ["ambition", "pressure"],
          log: "你没有被直接打垮，而是开始更严密地要求自己。后劲会有，负担也会一起长。",
        }),
        choice({
          text: "你先被打懵了，但慢慢学会把起伏当成过程的一部分。",
          effects: {
            age: 0,
            stats: { intelligence: 3, health: 2 },
          },
          addFlags: ["exam_resilience", "late_starter"],
          addTags: ["growth", "stability"],
          log: "你没有从此一路顺，可你越来越会从一次波动里把自己捞回来。",
        }),
        choice({
          text: "你表面无所谓，心里却越来越怕再次输得难看。",
          effects: {
            age: 0,
            stats: { happiness: -4, social: -1 },
          },
          addFlags: ["comparison_wound", "perfectionism_seed"],
          addTags: ["pressure", "wound"],
          log: "你不是不努力，只是越来越难把努力和自我价值分开看。",
        }),
      ],
    }),
    event({
      id: "body_boundary",
      stage: "adolescence",
      title: "身体变化和边界感一起闯进来",
      text: "青春期不是只发生在生理上，它也会改写一个人怎么看自己、怎么看别人、以及别人有没有权利随意评判你的身体和样子。",
      minAge: 12,
      maxAge: 14,
      weight: 7,
      tags: ["adolescence", "growth"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你开始强烈地意识到自己的身体，也开始对别人的目光变得更敏感。",
      }),
      choices: [
        choice({
          text: "你慢慢学会照顾自己，也开始建立边界。",
          effects: {
            age: 0,
            stats: { health: 4, happiness: 2 },
          },
          addFlags: ["body_confidence_seed", "boundary_awareness"],
          addTags: ["selfhood", "health"],
          log: "你没有完全摆脱不安，但已经开始知道，身体不是只能被评判的对象，也值得被照顾。",
        }),
        choice({
          text: "你越来越在意自己在别人眼里好不好看、正不正常。",
          effects: {
            age: 0,
            stats: { happiness: -4, social: -1 },
          },
          addFlags: ["appearance_anxiety", "comparison_wound"],
          addTags: ["pressure", "wound"],
          log: "你开始把很多情绪都绕着“我看起来怎么样”打转。这种内耗后来很可能继续跟着你。",
        }),
        choice({
          text: "你对那些让你不舒服的玩笑和冒犯反应得很明确。",
          effects: {
            age: 0,
            stats: { social: 3, health: 2 },
          },
          addFlags: ["boundary_awareness", "self_definition_seed"],
          addTags: ["selfhood", "relationship"],
          log: "你知道自己不是非得配合别人所有的轻慢。那种边界感以后会保护你在更多关系里不被吞掉。",
        }),
      ],
    }),
    event({
      id: "teen_interest_circle",
      stage: "adolescence",
      title: "你第一次明确知道，自己对谁会多看几眼",
      text: "青春期的心动终于不再只是模糊的喜欢，而开始落在具体的人身上。你会留意他或她说话的方式、习惯、表情，甚至开始主动安排一些“刚好顺路”的时刻。",
      minAge: 13,
      maxAge: 15,
      weight: 7,
      tags: ["adolescence", "romance"],
      conditions: condition({
        notVisited: ["teen_interest_circle"],
      }),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "这一次，你的喜欢终于有了脸、有了名字，也开始真正影响你的情绪和注意力。",
      }),
      choices: [
        choice({
          text: "图书角、作文展示栏和后来同班后的值日，让你开始留意那个总显得很安静的女生，后来你记住了她叫宋清禾。",
          conditions: condition({
            requiredFlags: ["player_gender_male"],
          }),
          effects: {
            age: 0,
            stats: { happiness: 2, social: 2 },
          },
          addFlags: ["secret_crush_seed"],
          addTags: ["romance", "relationship"],
          addRomanceFlags: ["romance_target_chosen"],
          relationshipEffects: [
            {
              targetId: "song_qinghe",
              affection: 14,
              status: "noticed",
              setActive: true,
              addFlags: ["school_crush"],
              history: "你先是在很多普通校园场景里反复看见宋清禾，后来才慢慢意识到，自己已经开始特别在意她。",
            },
          ],
          log: "你开始更在意安静、细腻、会在普通日子里慢慢长出分量的那种靠近方式。",
        }),
        choice({
          text: "补课班和同桌以后的很多小事，让你开始在意那个嘴上不太软、却总会记得细节的女生，方可。",
          conditions: condition({
            requiredFlags: ["player_gender_male"],
          }),
          effects: {
            age: 0,
            stats: { happiness: 2, social: 1, mental: 1 },
          },
          addFlags: ["secret_crush_seed"],
          addTags: ["romance", "selfhood"],
          addRomanceFlags: ["romance_target_chosen"],
          relationshipEffects: [
            {
              targetId: "fang_ke",
              affection: 14,
              status: "noticed",
              setActive: true,
              addFlags: ["school_crush"],
              history: "你一开始只是记住方可做题快、说话直，后来却开始在很多很小的照应里越来越在意她。",
            },
          ],
          log: "你会被慢热、聪明、需要长时间相处才能真正熟起来的人吸引。",
        }),
        choice({
          text: "在班会、排练和活动准备里，你越来越会先看向那个总能把场子撑亮的人，罗明汐。",
          conditions: condition({
            requiredFlags: ["player_gender_male"],
          }),
          effects: {
            age: 0,
            stats: { intelligence: 2, happiness: 1 },
          },
          addFlags: ["secret_crush_seed", "ambition_seed"],
          addTags: ["romance", "ambition"],
          addRomanceFlags: ["romance_target_chosen"],
          relationshipEffects: [
            {
              targetId: "luo_mingxi",
              affection: 14,
              status: "noticed",
              setActive: true,
              addFlags: ["school_crush"],
              history: "你最开始可能只是被罗明汐的亮眼和热度吸引，后来才发现自己已经开始期待每次活动都能再见到她。",
            },
          ],
          log: "你发现自己也会被那种会把整个校园生活一下带亮的人打动。",
        }),
        choice({
          text: "球场边、运动会和放学路上的热闹，让你开始更常注意那个总能把气氛带起来的人，江循。",
          conditions: condition({
            requiredFlags: ["player_gender_male"],
          }),
          effects: {
            age: 0,
            stats: { happiness: 3, social: 2 },
          },
          addFlags: ["secret_crush_seed"],
          addTags: ["romance", "selfhood"],
          addRomanceFlags: ["romance_target_chosen"],
          relationshipEffects: [
            {
              targetId: "jiang_xun",
              affection: 14,
              status: "noticed",
              setActive: true,
              addFlags: ["school_crush"],
              history: "你先是在热闹里注意到江循，后来才发现自己已经会下意识去找他的身影。",
            },
          ],
          log: "你会被热烈、直接、很有现场感的人吸引，也会在这种靠近里变得更敢一点。",
        }),
        choice({
          text: "图书角、广播站和演讲比赛准备时，你开始更在意那个讲话不快、却总显得很稳的人，陈砚。",
          conditions: condition({
            requiredFlags: ["player_gender_male"],
          }),
          effects: {
            age: 0,
            stats: { intelligence: 2, happiness: 1 },
          },
          addFlags: ["secret_crush_seed", "ambition_seed"],
          addTags: ["romance", "ambition"],
          addRomanceFlags: ["romance_target_chosen"],
          relationshipEffects: [
            {
              targetId: "chen_yan",
              affection: 14,
              status: "noticed",
              setActive: true,
              addFlags: ["school_crush"],
              history: "你先是在安静处一次次碰见陈砚，后来才意识到，自己会开始在意他会不会和你说更多话。",
            },
          ],
          log: "你开始更在意那种克制、可靠、需要慢慢靠近才会显露温度的人。",
        }),
        choice({
          text: "图书角、作文展示栏和后来同班后的值日，让你开始留意那个总显得很安静的女生，后来你记住了她叫宋清禾。",
          conditions: condition({
            requiredFlags: ["player_gender_female"],
          }),
          effects: {
            age: 0,
            stats: { happiness: 2, social: 2 },
          },
          addFlags: ["secret_crush_seed"],
          addTags: ["romance", "relationship"],
          addRomanceFlags: ["romance_target_chosen"],
          relationshipEffects: [
            {
              targetId: "song_qinghe",
              affection: 14,
              status: "noticed",
              setActive: true,
              addFlags: ["school_crush"],
              history: "你先是在很多普通校园场景里反复看见宋清禾，后来才慢慢意识到，自己已经开始特别在意她。",
            },
          ],
          log: "你开始更在意安静、细腻、会在普通日子里慢慢长出分量的那种靠近方式。",
        }),
        choice({
          text: "在班会、排练和活动准备里，你越来越会先看向那个总能把场子撑亮的人，罗明汐。",
          conditions: condition({
            requiredFlags: ["player_gender_female"],
          }),
          effects: {
            age: 0,
            stats: { intelligence: 2, happiness: 1 },
          },
          addFlags: ["secret_crush_seed", "ambition_seed"],
          addTags: ["romance", "ambition"],
          addRomanceFlags: ["romance_target_chosen"],
          relationshipEffects: [
            {
              targetId: "luo_mingxi",
              affection: 14,
              status: "noticed",
              setActive: true,
              addFlags: ["school_crush"],
              history: "你最开始可能只是被罗明汐的亮眼和热度吸引，后来才发现自己已经开始期待每次活动都能再见到她。",
            },
          ],
          log: "你发现自己也会被那种会把整个校园生活一下带亮的人打动。",
        }),
        choice({
          text: "球场边、运动会和放学路上的热闹，让你开始更常注意那个总能把气氛带起来的人，江循。",
          conditions: condition({
            requiredFlags: ["player_gender_female"],
          }),
          effects: {
            age: 0,
            stats: { happiness: 3, social: 2 },
          },
          addFlags: ["secret_crush_seed"],
          addTags: ["romance", "selfhood"],
          addRomanceFlags: ["romance_target_chosen"],
          relationshipEffects: [
            {
              targetId: "jiang_xun",
              affection: 14,
              status: "noticed",
              setActive: true,
              addFlags: ["school_crush"],
              history: "你先是在热闹里注意到江循，后来才发现自己已经会下意识去找他的身影。",
            },
          ],
          log: "你会被鲜活和直接打动，也更容易在这种靠近里变得勇敢一点。",
        }),
        choice({
          text: "图书角、广播站和演讲比赛准备时，你开始更在意那个讲话不快、却总显得很稳的人，陈砚。",
          conditions: condition({
            requiredFlags: ["player_gender_female"],
          }),
          effects: {
            age: 0,
            stats: { happiness: 2, health: 1 },
          },
          addFlags: ["secret_crush_seed"],
          addTags: ["romance", "stability"],
          addRomanceFlags: ["romance_target_chosen"],
          relationshipEffects: [
            {
              targetId: "chen_yan",
              affection: 14,
              status: "noticed",
              setActive: true,
              addFlags: ["school_crush"],
              history: "你先是在安静处一次次碰见陈砚，后来才意识到，自己会开始在意他会不会和你说更多话。",
            },
          ],
          log: "你开始更在意那种克制、可靠、需要慢慢靠近才会显露温度的人。",
        }),
        choice({
          text: "补课班、竞赛训练和雨天一起等车的那些时刻，让你越来越在意那个总把情绪压得很深的人，谭予。",
          conditions: condition({
            requiredFlags: ["player_gender_female"],
          }),
          effects: {
            age: 0,
            stats: { happiness: 1, health: 1, social: 1 },
          },
          addFlags: ["secret_crush_seed"],
          addTags: ["romance", "stability"],
          addRomanceFlags: ["romance_target_chosen"],
          relationshipEffects: [
            {
              targetId: "tan_yu",
              affection: 14,
              status: "noticed",
              setActive: true,
              addFlags: ["school_crush"],
              history: "你是在一次次补课后的同行和等待里慢慢记住谭予的，也因此越来越在意他那些没有说出口的情绪。",
            },
          ],
          log: "你也会被那种压着很多压力、却只在熟人面前露出一点真实情绪的人打动。",
        }),
        choice({
          text: "你决定先把心收住，别让感情太早占掉自己。",
          effects: {
            age: 0,
            stats: { intelligence: 2, happiness: -1 },
          },
          addFlags: ["emotionally_guarded"],
          addTags: ["romance", "distance"],
          addRomanceFlags: ["romance_held_back"],
          log: "你不是没有感觉，只是很早就学会了先把心往后收一点。",
        }),
      ],
    }),
    event({
      id: "night_study_escape",
      stage: "adolescence",
      title: "成绩、情绪和夜晚的处理方式",
      text: "到了初中后半段，很多压力第一次会在晚上集中出现。有人靠学习稳住自己，有人靠短视频、游戏或发呆逃掉一点，有人则开始真正学会照顾自己的状态。",
      minAge: 13,
      maxAge: 15,
      weight: 7,
      tags: ["adolescence", "growth"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你开始摸索，夜里那些没人帮你整理的情绪到底该怎么安放。",
      }),
      choices: [
        choice({
          text: "你用相对稳定的方法收拾学习和情绪，虽然慢，但真的有用。",
          effects: {
            age: 0,
            stats: { intelligence: 3, health: 2 },
          },
          addFlags: ["study_system_seed", "health_managed"],
          addTags: ["discipline", "stability"],
          log: "你逐渐发现，持续并不一定靠狠，很多时候靠的是能不能把自己照顾到还能继续。",
        }),
        choice({
          text: "你常常靠刷屏和发呆先逃开一点，第二天再硬撑回来。",
          effects: {
            age: 0,
            stats: { happiness: 1, health: -2 },
          },
          addFlags: ["stress_loop_seed", "screen_escape"],
          addTags: ["pressure", "drift"],
          log: "你学会了快速麻痹自己一点点，这在当下很有用，可也会让问题不断回头追上来。",
        }),
        choice({
          text: "你会找朋友、写字或运动，把情绪慢慢消化掉。",
          effects: {
            age: 0,
            stats: { happiness: 3, health: 2, social: 2 },
          },
          addFlags: ["healthy_outlet", "support_network"],
          addTags: ["health", "relationship"],
          log: "你不是没压力，只是比很多人更早知道情绪得有出口，不然迟早会反咬生活。",
        }),
      ],
    }),
    event({
      id: "rebellion_or_self_control",
      stage: "adolescence",
      title: "你开始决定，青春期到底要怎么过",
      text: "叛逆和自律并不是绝对对立，它们更像青春期里两种不同的自我主张方式。你要么通过反抗证明自己在长大，要么通过管理自己证明自己已经能扛事。",
      minAge: 14,
      maxAge: 16,
      weight: 7,
      tags: ["adolescence", "growth"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你不再只是被推着走的人，而要慢慢决定：你想成为什么样的大人。",
      }),
      choices: [
        choice({
          text: "你把很多劲用在自我约束上，开始明显和以前不一样。",
          effects: {
            age: 0,
            stats: { intelligence: 3, health: 2 },
          },
          addFlags: ["adolescent_self_discipline", "teen_self_management"],
          addTags: ["discipline", "growth"],
          log: "你不一定立刻轻松了，但确实更能扛，也更能把未来当回事。",
        }),
        choice({
          text: "你通过顶嘴、逃避和对着干来争一点自己的空间。",
          effects: {
            age: 0,
            stats: { happiness: 2, social: -1 },
          },
          addFlags: ["rebellion_peak", "boundary_tester"],
          addTags: ["defiance", "selfhood"],
          log: "你不想再只当乖孩子。很多后来更像你自己的选择，其实也是从这股反作用力里长出来的。",
        }),
        choice({
          text: "你一边想反抗，一边又怕失控，最后常常把自己搞得很拧巴。",
          effects: {
            age: 0,
            stats: { happiness: -3, intelligence: 1 },
          },
          addFlags: ["inner_conflict_teen", "perfectionism_seed"],
          addTags: ["pressure", "selfhood"],
          log: "你没有完全往外爆，也没有真正松掉，于是很多力都先耗在了和自己的拉扯上。",
        }),
      ],
    }),
    event({
      id: "adolescent_confidence_swing",
      stage: "adolescence",
      title: "自信心第一次大起大落",
      text: "青春期的自信常常不是稳定长出来的，而是被成绩、外貌、朋友、喜欢的人和家庭氛围一起拉扯。你开始很真实地感到，自己有时敢，有时又会突然缩回去。",
      minAge: 14,
      maxAge: 16,
      weight: 7,
      tags: ["adolescence", "growth"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你第一次发现，自信并不是一句口号，而是一种会被现实反复试探的状态。",
      }),
      choices: [
        choice({
          text: "你慢慢学会把评价和自我感分开一点，不再总被带着走。",
          effects: {
            age: 0,
            stats: { happiness: 3, health: 2 },
          },
          addFlags: ["self_acceptance_seed", "self_reference_seed"],
          addTags: ["selfhood", "stability"],
          log: "你还会受影响，但已经开始建立自己的坐标。这会在后面很多关键年份救你。",
        }),
        choice({
          text: "你特别需要被认可，一旦没人肯定就会怀疑自己。",
          effects: {
            age: 0,
            stats: { happiness: -4, social: 1 },
          },
          addFlags: ["external_validation_need", "comparison_wound"],
          addTags: ["pressure", "relationship"],
          log: "你把自信寄放在外界太多次，于是每次风向变一点，心里也会跟着晃。",
        }),
        choice({
          text: "你变得有点冷，像是在提前学会不把脆弱随便给别人看。",
          effects: {
            age: 0,
            stats: { intelligence: 2, social: -2 },
          },
          addFlags: ["emotionally_guarded", "self_protection_pattern"],
          addTags: ["distance", "selfhood"],
          log: "你不是不想被理解，只是越来越觉得先把自己收起来，更安全一点。",
        }),
      ],
    }),
    event({
      id: "dormitory_alliance",
      stage: "highschool",
      title: "高中的宿舍、同桌和小联盟",
      text: "高中关系往往被高压和时间表压得更硬。谁能一起熬夜、互相提点、在崩掉的时候递过来一句正常话，都会比以前更重要。",
      minAge: 15,
      maxAge: 17,
      weight: 7,
      tags: ["highschool", "friendship"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "在被高考节奏支配的生活里，你开始重新判断什么样的人值得靠近。",
      }),
      choices: [
        choice({
          text: "你有了一个能互相托底的小圈子，彼此都没那么容易垮。",
          effects: {
            age: 0,
            stats: { happiness: 4, social: 4 },
          },
          addFlags: ["senior_support_circle", "support_network"],
          addTags: ["relationship", "stability"],
          log: "在最绷的阶段有人能互相兜住，真的会直接改变一个人的耐受力。",
        }),
        choice({
          text: "你更多是一个人扛，效率高，但人也越来越紧。",
          effects: {
            age: 0,
            stats: { intelligence: 3, happiness: -3 },
          },
          addFlags: ["solo_grind", "adolescent_self_discipline"],
          addTags: ["discipline", "distance"],
          log: "你把很多能量都留给了目标。它确实有效，只是也让你越来越难自然放松。",
        }),
        choice({
          text: "你在人际里耗了不少心，后来才明白高压下关系也需要边界。",
          effects: {
            age: 0,
            stats: { social: 2, happiness: -2 },
          },
          addFlags: ["boundary_awareness", "social_vigilance"],
          addTags: ["relationship", "growth"],
          log: "你并不是不会相处，而是学会了：不是所有热闹都值得把自己搭进去。",
        }),
      ],
    }),
    event({
      id: "parent_expectation_senior_extra",
      stage: "highschool",
      title: "高中以后，父母的期待变得更具体了",
      text: "从“好好学习”到“到底要考成什么样”，期待开始变成数字、学校名、城市名和别人家孩子的进度。你和家庭的关系，也因此进入一个更敏感的阶段。",
      minAge: 15,
      maxAge: 17,
      weight: 7,
      tags: ["highschool", "family"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你明显感觉到，家里已经不只是希望你过得好，而是希望你“达到某种结果”。",
      }),
      choices: [
        choice({
          text: "你把期待转成动力，开始更自觉地规划目标和执行。",
          effects: {
            age: 0,
            stats: { intelligence: 3, career: 1 },
          },
          addFlags: ["goal_planner", "high_expectation_child"],
          addTags: ["ambition", "discipline"],
          log: "你把压力相对有效地转成了行动力。只是以后你也很可能继续对自己要求过高。",
        }),
        choice({
          text: "你越来越烦被催和被比较，关系变得紧绷。",
          effects: {
            age: 0,
            stats: { happiness: -4, social: -1 },
          },
          addFlags: ["family_conflict_seed", "rebellion_peak"],
          addTags: ["family", "pressure"],
          log: "你不是真的不想努力，只是越来越受不了别人把你活成一张考卷。",
        }),
        choice({
          text: "你试着和父母谈现实和边界，希望一起把预期调到能活下去的程度。",
          effects: {
            age: 0,
            stats: { happiness: 2, social: 3 },
          },
          addFlags: ["family_dialogue", "boundary_awareness"],
          addTags: ["family", "stability"],
          log: "你第一次在高压节点里试图不靠吵架，而靠沟通去重建关系。这很难，但很有后劲。",
        }),
      ],
    }),
    event({
      id: "highschool_contact_choice",
      stage: "highschool",
      title: "你开始决定，要不要把喜欢从心里拿出来一点",
      text: "高中的心动常常夹在学业和自我克制之间。你知道自己不一定有资格把很多精力放在感情上，可一旦真的在意一个人，完全装没事也很难。",
      minAge: 15,
      maxAge: 18,
      weight: 6,
      tags: ["highschool", "romance"],
      conditions: condition({
        requiredRomanceFlags: ["romance_target_chosen"],
        activeRelationshipStatuses: ["noticed", "familiar", "close"],
      }),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你开始反复权衡：是继续只当成一点青春期心事，还是认真往前走一步。",
      }),
      choices: [
        choice({
          text: "你主动制造一些能和{activeLoveName}说上话的机会，慢慢把距离拉近。",
          effects: {
            age: 0,
            stats: { happiness: 3, social: 3 },
          },
          addFlags: ["emotional_openness"],
          addTags: ["romance", "relationship"],
          addRomanceFlags: ["romance_contact_increased"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 12,
              status: "familiar",
              addFlags: ["steady_contact"],
              history: "你开始不只是在意，还真的往前走了几步，让彼此有了更多接触。",
            },
          ],
          log: "你没有让这份喜欢只停在幻想里。哪怕还很青涩，这也是一种真实的靠近。",
        }),
        choice({
          text: "你把喜欢压回去，决定先守住成绩和节奏。",
          effects: {
            age: 0,
            stats: { intelligence: 2, happiness: -2 },
          },
          addFlags: ["career_first", "emotionally_guarded"],
          addTags: ["romance", "ambition"],
          addRomanceFlags: ["romance_held_back"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: -3,
              addFlags: ["timing_blocked"],
              history: "你主动把距离拉开了一点，告诉自己先别让感情打乱生活节奏。",
            },
          ],
          log: "你不是没感觉，只是又一次把现实排在了喜欢前面。",
        }),
        choice({
          text: "你因为怕尴尬和起哄，干脆更少表现出来。",
          effects: {
            age: 0,
            stats: { happiness: -3, social: -1 },
          },
          addFlags: ["emotionally_guarded", "trust_break"],
          addTags: ["romance", "wound"],
          addRomanceFlags: ["romance_shrunk_back"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: -6,
              status: "estranged",
              addFlags: ["awkward_distance"],
              history: "你把喜欢往回收了很多，关系也因此停在了有点可惜的位置。",
            },
          ],
          log: "有些青春期的关系不是因为不喜欢结束的，而是因为谁都不够敢。",
        }),
      ],
    }),
    event({
      id: "study_method_reset",
      stage: "highschool",
      title: "你终于发现，蛮干在高中不太够了",
      text: "越往后，单纯堆时间的收益会越来越有限。你要么开始建立自己的方法，要么继续在混乱里靠意志力硬顶，代价会很快体现出来。",
      minAge: 16,
      maxAge: 18,
      weight: 8,
      tags: ["highschool", "school"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你开始正面面对“努力方式对不对”这个问题，而不是只问自己够不够拼。",
      }),
      choices: [
        choice({
          text: "你搭起了更稳定的方法论，效率和心态都慢慢稳住。",
          effects: {
            age: 0,
            stats: { intelligence: 4, health: 2 },
          },
          addFlags: ["study_system_built", "exam_resilience"],
          addTags: ["discipline", "growth"],
          log: "你终于不再全靠硬扛。这个转折会让你在后面的很多高压阶段都更能活下来。",
        }),
        choice({
          text: "你还是主要靠熬和补时间，短期顶住了，身体却越来越抗议。",
          effects: {
            age: 0,
            stats: { intelligence: 2, health: -4, happiness: -2 },
          },
          addFlags: ["overworked_seed", "chronic_stress"],
          addTags: ["pressure", "ambition"],
          log: "你不是没有成果，只是这种顶法会很早开始让身体替你记账。",
        }),
        choice({
          text: "你承认自己需要留出一点呼吸空间，反而不再那么容易彻底崩。",
          effects: {
            age: 0,
            stats: { health: 3, happiness: 2, intelligence: 2 },
          },
          addFlags: ["health_managed", "flexible_routine"],
          addTags: ["stability", "selfhood"],
          log: "你没有把休息当成偷懒，而是开始理解长期主义这件事。这个观念会越来越重要。",
        }),
      ],
    }),
    event({
      id: "value_conflict_teen_love",
      stage: "highschool",
      title: "喜欢一个人以后，差异也会跟着冒出来",
      text: "真正靠近一点之后，你会发现心动和相处并不是同一回事。说话方式、节奏、边界、对未来的理解，都可能在关系还没开始太久时就悄悄露头。",
      minAge: 16,
      maxAge: 18,
      weight: 5,
      tags: ["highschool", "romance"],
      conditions: condition({
        requiredRomanceFlags: ["romance_target_chosen"],
        activeRelationshipStatuses: ["familiar", "close", "dating"],
      }),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你开始知道，喜欢不等于自动合适，靠近以后很多真实差异反而更清楚。",
      }),
      choices: [
        choice({
          text: "你认真沟通边界和节奏，哪怕青涩，也尽量不让误会越积越多。",
          effects: {
            age: 0,
            stats: { social: 3, happiness: 2 },
          },
          addFlags: ["emotional_honesty"],
          addTags: ["relationship", "growth"],
          addRomanceFlags: ["relationship_maintained"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 10,
              status: "close",
              addFlags: ["talked_things_out"],
              history: "你没有把差异直接处理成沉默，而是认真谈了谈彼此怎么相处。",
            },
          ],
          log: "你很早就学会了一件很多大人都不擅长的事：关系里有问题时，先把话说清楚。",
        }),
        choice({
          text: "你觉得太麻烦，开始慢慢躲，关系也跟着冷掉。",
          effects: {
            age: 0,
            stats: { happiness: -3, social: -1 },
          },
          addFlags: ["solo_pattern", "emotionally_guarded"],
          addTags: ["romance", "distance"],
          addRomanceFlags: ["relationship_neglected"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: -10,
              status: "estranged",
              addFlags: ["avoided_conflict"],
              history: "你没有把矛盾摊开讲，关系就这样一点点冷了下去。",
            },
          ],
          log: "你后来会慢慢发现，很多关系不是被大事砸断的，而是被长期回避耗掉的。",
        }),
        choice({
          text: "你们彼此喜欢过，但在那个阶段还是没走成真正的一条路。",
          effects: {
            age: 0,
            stats: { happiness: 1, intelligence: 2 },
          },
          addFlags: ["missed_love"],
          addTags: ["romance", "growth"],
          addRomanceFlags: ["teen_romance_loss"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: -4,
              status: "familiar",
              addFlags: ["unfinished_story"],
              history: "你们没有真的闹翻，只是留在了一个没能走下去、却会记很久的位置。",
            },
          ],
          log: "有些关系不会彻底消失，只是会从此变成你人生里一块很难定义的旧心事。",
        }),
      ],
    }),
    event({
      id: "pre_exam_burnout",
      stage: "highschool",
      title: "临近大考前，你第一次感觉自己快被榨干了",
      text: "越接近关键节点，很多人越会发现，真正的难题不只是知识，而是能不能在长期高压里不先把自己耗空。你必须处理这份快到极限的疲惫。",
      minAge: 17,
      maxAge: 18,
      weight: 8,
      tags: ["highschool", "growth"],
      conditions: condition({}),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你第一次正面撞上极限，成绩、身体和情绪都在提醒你不可能一直超支。",
      }),
      choices: [
        choice({
          text: "你咬牙重新整理节奏，让自己撑过这段最难的时间。",
          effects: {
            age: 0,
            stats: { health: 2, intelligence: 3 },
          },
          addFlags: ["exam_resilience", "health_managed"],
          addTags: ["growth", "stability"],
          log: "你没有完全轻松下来，但你学会了怎么不在关键时刻先把自己用坏。",
        }),
        choice({
          text: "你继续硬顶，效率并没有更高，人却越来越空。",
          effects: {
            age: 0,
            stats: { intelligence: 1, health: -5, happiness: -4 },
          },
          addFlags: ["overworked_seed", "chronic_stress"],
          addTags: ["pressure", "ambition"],
          log: "你靠意志力把日子继续往前推，但很多看不见的消耗，已经从这个阶段开始积累。",
        }),
        choice({
          text: "你第一次认真求助，让老师、家人或朋友帮你把状态稳住。",
          effects: {
            age: 0,
            stats: { happiness: 3, social: 3, health: 2 },
          },
          addFlags: ["support_network", "emotional_honesty"],
          addTags: ["relationship", "health"],
          log: "你承认自己扛不住的那一下，并没有让你更差，反而让你保住了继续往下走的能力。",
        }),
      ],
    }),
  ];

  const ROMANCE_SYSTEM_EXPANSION = [
    event({
      id: "college_new_acquaintance",
      stage: "college",
      title: "大学里，你终于可以更主动决定想靠近谁",
      text: "到了新的环境之后，喜欢和相处都不再只受班级和座位限制。你开始更清楚地感到，自己想和怎样的人多来往、想把时间给谁、想让谁更进入你的生活。",
      minAge: 18,
      maxAge: 22,
      weight: 6,
      tags: ["college", "romance"],
      conditions: condition({
        noCurrentPartner: true,
      }),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "这一次，关系不再只是被动发生在你身上，你也开始真正拥有选择权。",
      }),
      choices: [
        choice({
          text: "在图书馆、借书台和文学社讨论里，你开始一次次坐到那个总在安静角落的人附近，后来才慢慢和林月熟起来。",
          conditions: condition({
            requiredFlags: ["player_gender_male"],
          }),
          effects: {
            age: 0,
            stats: { happiness: 2, social: 2 },
          },
          addFlags: ["emotional_openness"],
          addTags: ["romance", "relationship"],
          addRomanceFlags: ["romance_target_chosen"],
          relationshipEffects: [
            {
              targetId: "lin_yue",
              affection: 10,
              status: "familiar",
              setActive: true,
              history: "你是先在图书馆和文学社里反复碰上林月，后来才慢慢把关系从认识推向了真正的熟悉。",
            },
          ],
          log: "你没有继续只靠偶然，而是明确地把心往一个方向放了放。",
        }),
        choice({
          text: "社团活动后的逛展、散步和城市漫游，让你慢慢记住了苏晚那种很有自己节奏的生活感。",
          conditions: condition({
            requiredFlags: ["player_gender_male"],
          }),
          effects: {
            age: 0,
            stats: { happiness: 2, social: 2, mental: 1 },
          },
          addFlags: ["emotional_openness"],
          addTags: ["romance", "relationship"],
          addRomanceFlags: ["romance_target_chosen"],
          relationshipEffects: [
            {
              targetId: "su_wan",
              affection: 10,
              status: "familiar",
              setActive: true,
              history: "你不是一下子把苏晚划进重要关系里的，而是在一起逛展、走路和聊天的过程里慢慢熟了起来。",
            },
          ],
          log: "你开始更认真地看待那些能把日常过得舒服、也能让你放松下来的人。",
        }),
        choice({
          text: "专业课、辩论队和深夜讨论项目后，你开始更想知道许棠这种看起来克制的人到底会不会真正向谁打开。",
          conditions: condition({
            requiredFlags: ["player_gender_male"],
          }),
          effects: {
            age: 0,
            stats: { intelligence: 2, social: 1 },
          },
          addFlags: ["emotional_openness"],
          addTags: ["romance", "ambition"],
          addRomanceFlags: ["romance_target_chosen"],
          relationshipEffects: [
            {
              targetId: "xu_tang",
              affection: 10,
              status: "familiar",
              setActive: true,
              history: "你和许棠是从专业课和辩论里的互相接招开始熟起来的，关系也因此慢慢有了私人温度。",
            },
          ],
          log: "你开始把那种聪明、克制、需要慢慢读懂的吸引力，认真放进自己的关系选择里。",
        }),
        choice({
          text: "活动筹备、朋友局和说走就走的短途出行里，你慢慢被沈枝那种很有生命力的热度卷了进去。",
          conditions: condition({
            requiredFlags: ["player_gender_male"],
          }),
          effects: {
            age: 0,
            stats: { happiness: 3, social: 2 },
          },
          addFlags: ["emotional_openness"],
          addTags: ["romance", "selfhood"],
          addRomanceFlags: ["romance_target_chosen"],
          relationshipEffects: [
            {
              targetId: "shen_zhi",
              affection: 10,
              status: "familiar",
              setActive: true,
              history: "你和沈枝并不是靠一次告白熟起来的，而是在很多一起扛事和一起出去的场景里慢慢变近。",
            },
          ],
          log: "你不再只问合不合适，也开始承认自己就是会被鲜活和直接点亮。",
        }),
        choice({
          text: "项目合作、实习和比赛准备里，你越来越在意那个做事总很利落的人，周屿。",
          conditions: condition({
            requiredFlags: ["player_gender_male"],
          }),
          effects: {
            age: 0,
            stats: { intelligence: 2, social: 2 },
          },
          addFlags: ["emotional_openness"],
          addTags: ["romance", "ambition"],
          addRomanceFlags: ["romance_target_chosen"],
          relationshipEffects: [
            {
              targetId: "zhou_yi",
              affection: 10,
              status: "familiar",
              setActive: true,
              history: "你和周屿是从一起做事、一起赶节点开始慢慢熟起来的，关系也因此比一般心动更带着现实重量。",
            },
          ],
          log: "你开始把“谁适合走进生活”也纳入了喜欢的判断里。",
        }),
        choice({
          text: "在图书馆、借书台和文学社讨论里，你开始一次次坐到那个总在安静角落的人附近，后来才慢慢和林月熟起来。",
          conditions: condition({
            requiredFlags: ["player_gender_female"],
          }),
          effects: {
            age: 0,
            stats: { happiness: 2, social: 2 },
          },
          addFlags: ["emotional_openness"],
          addTags: ["romance", "relationship"],
          addRomanceFlags: ["romance_target_chosen"],
          relationshipEffects: [
            {
              targetId: "lin_yue",
              affection: 10,
              status: "familiar",
              setActive: true,
              history: "你是先在图书馆和文学社里反复碰上林月，后来才慢慢把关系从认识推向了真正的熟悉。",
            },
          ],
          log: "你没有继续只靠偶然，而是明确地把心往一个方向放了放。",
        }),
        choice({
          text: "项目合作、实习和比赛准备里，你越来越在意那个做事总很利落的人，周屿。",
          conditions: condition({
            requiredFlags: ["player_gender_female"],
          }),
          effects: {
            age: 0,
            stats: { intelligence: 2, social: 2 },
          },
          addFlags: ["emotional_openness"],
          addTags: ["romance", "ambition"],
          addRomanceFlags: ["romance_target_chosen"],
          relationshipEffects: [
            {
              targetId: "zhou_yi",
              affection: 10,
              status: "familiar",
              setActive: true,
              history: "你和周屿是从一起做事、一起赶节点开始慢慢熟起来的，关系也因此比一般心动更带着现实重量。",
            },
          ],
          log: "你开始把“谁适合走进生活”也纳入了喜欢的判断里。",
        }),
        choice({
          text: "球场、夜宵和朋友局上的一次次同行，让你开始记住程楠那种很真、也很热烈的在场感。",
          conditions: condition({
            requiredFlags: ["player_gender_female"],
          }),
          effects: {
            age: 0,
            stats: { happiness: 3, social: 2 },
          },
          addFlags: ["emotional_openness"],
          addTags: ["romance", "selfhood"],
          addRomanceFlags: ["romance_target_chosen"],
          relationshipEffects: [
            {
              targetId: "cheng_nan",
              affection: 10,
              status: "familiar",
              setActive: true,
              history: "你和程楠的熟悉是从很多有现场感的相处里长出来的，关系也因此带着一种很直接的热度。",
            },
          ],
          log: "你不再只是想着合不合适，也开始承认自己需要被什么样的情绪点亮。",
        }),
        choice({
          text: "志愿活动收尾、一起做饭和被照顾到的小细节，让你越来越在意徐清那种稳稳在场的感觉。",
          conditions: condition({
            requiredFlags: ["player_gender_female"],
          }),
          effects: {
            age: 0,
            stats: { happiness: 2, health: 1 },
          },
          addFlags: ["emotional_openness"],
          addTags: ["romance", "stability"],
          addRomanceFlags: ["romance_target_chosen"],
          relationshipEffects: [
            {
              targetId: "xu_qing",
              affection: 10,
              status: "familiar",
              setActive: true,
              history: "你和徐清不是一下热起来的，而是在很多日常照应和活动收尾里慢慢熟起来的。",
            },
          ],
          log: "你开始认真地把“可靠”也当成喜欢的一部分，而不只是年轻时的一种附加项。",
        }),
        choice({
          text: "实验室、项目组和一起解决问题的过程，让你慢慢注意到陆川那种不声张却很能扛事的可靠。",
          conditions: condition({
            requiredFlags: ["player_gender_female"],
          }),
          effects: {
            age: 0,
            stats: { happiness: 2, health: 1, social: 1 },
          },
          addFlags: ["emotional_openness"],
          addTags: ["romance", "stability"],
          addRomanceFlags: ["romance_target_chosen"],
          relationshipEffects: [
            {
              targetId: "lu_chuan",
              affection: 10,
              status: "familiar",
              setActive: true,
              history: "你和陆川是在一次次并肩解决问题里慢慢熟起来的，关系也因此比表面看起来更有后劲。",
            },
          ],
          log: "你开始认真地把那种安静但可靠的托付感，也放进自己对关系的判断里。",
        }),
        choice({
          text: "你先把精力留给自己，短期内不想让任何关系太深入。",
          effects: {
            age: 0,
            stats: { career: 1, happiness: 1 },
          },
          addFlags: ["solo_pattern"],
          addTags: ["selfhood", "distance"],
          addRomanceFlags: ["romance_held_back"],
          log: "你不是被动失去感情机会，而是主动把人生重心先收回到了自己身上。",
        }),
      ],
    }),
    event({
      id: "campus_connection_upgrade",
      stage: "college",
      title: "你和{activeLoveName}之间，终于不再只是若有若无",
      text: "当你真的持续把时间和注意力给到同一个人，关系会开始变得有重量。它不再只是“我是不是有点喜欢”，而会变成一起吃饭、发消息、等回复、试探边界和判断彼此的重要性。",
      minAge: 18,
      maxAge: 22,
      weight: 7,
      tags: ["college", "romance"],
      conditions: condition({
        requiredRomanceFlags: ["romance_target_chosen"],
        activeRelationshipStatuses: ["noticed", "familiar", "close"],
      }),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你开始发现，真正会改变关系的从来不是一次心动，而是持续地把时间放进去。",
      }),
      choices: [
        choice({
          text: "你主动增加联系和见面，让关系有机会更稳定地向前走。",
          effects: {
            age: 0,
            stats: { happiness: 3, social: 3 },
          },
          addRomanceFlags: ["romance_contact_increased"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 12,
              status: "close",
              addFlags: ["steady_contact"],
              history: "你没有只等关系自然发生，而是明确增加了和对方接触的频率。",
            },
          ],
          log: "你开始知道，喜欢一个人并不只靠感觉，也靠有没有真正把日常往彼此那里放。",
        }),
        choice({
          text: "你相处得不错，但还是保持一点慢，不急着把关系定义得太快。",
          effects: {
            age: 0,
            stats: { happiness: 2, health: 1 },
          },
          addRomanceFlags: ["relationship_maintained"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 8,
              status: "familiar",
              addFlags: ["slow_burn"],
              history: "你选择慢一点地靠近，不催结果，但也没有后退。",
            },
          ],
          log: "你没有把靠近全交给冲动，而是试着用更稳的方式给关系长时间。",
        }),
        choice({
          text: "你因为学业和生活节奏太乱，联系开始一阵一阵的。",
          effects: {
            age: 0,
            stats: { intelligence: 2, happiness: -2 },
          },
          addFlags: ["career_first"],
          addTags: ["romance", "pressure"],
          addRomanceFlags: ["relationship_neglected"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: -9,
              status: "estranged",
              addFlags: ["neglected_by_busy"],
              history: "你不是故意伤人，只是长期忙乱让关系一点点失了温度。",
            },
          ],
          log: "很多关系不是输给不喜欢，而是输给了你们谁都没腾出来的时间。",
        }),
      ],
    }),
    event({
      id: "confession_or_hold",
      stage: "college",
      title: "你要不要把那句话真正说出口",
      text: "关系走到一定程度后，模糊本身就会变成一种选择。你开始明白，不把话说出口并不等于没后果，勇敢和退后一样，都会把人生推向某个方向。",
      minAge: 19,
      maxAge: 23,
      weight: 7,
      tags: ["college", "romance"],
      conditions: condition({
        requiredRomanceFlags: ["romance_target_chosen"],
        activeRelationshipStatuses: ["familiar", "close"],
        activeRelationshipMinAffection: 24,
      }),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "你开始知道，真正的亲密关系很多时候不是“等到了”，而是某个人先承担了不确定。",
      }),
      choices: [
        choice({
          text: "你明确表达心意，愿意承担被拒绝或被认真回应的后果。",
          conditions: condition({
            activeRelationshipMinAffection: 34,
          }),
          effects: {
            age: 0,
            stats: { happiness: 6, social: 3 },
          },
          addFlags: ["first_love", "emotional_openness"],
          addTags: ["romance", "relationship"],
          addRomanceFlags: ["confessed_feelings", "relationship_maintained"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 14,
              status: "dating",
              addFlags: ["confession_success"],
              history: "你把那句最难说出口的话说了出来，关系也因此从暧昧真正跨进了恋爱。",
            },
          ],
          log: "你终于把喜欢从猜测变成了明确的选择。这一步以后会深刻影响你怎么理解亲密关系。",
        }),
        choice({
          text: "你先维持靠近，想再给彼此一点时间，不急着立刻定义。",
          effects: {
            age: 0,
            stats: { happiness: 2, social: 2 },
          },
          addRomanceFlags: ["relationship_maintained"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 6,
              status: "close",
              addFlags: ["careful_progress"],
              history: "你没有急着告白，但也没有退后，而是让关系继续往更真实的相处里走。",
            },
          ],
          log: "你没有把模糊全交给命运，而是选择用更稳的节奏去确认彼此。",
        }),
        choice({
          text: "你明明也有感觉，却还是选择不说，让关系停在这里。",
          effects: {
            age: 0,
            stats: { happiness: -3, intelligence: 2 },
          },
          addFlags: ["missed_love", "emotionally_guarded"],
          addTags: ["romance", "fear"],
          addRomanceFlags: ["romance_held_back"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: -4,
              addFlags: ["untold_feelings"],
              history: "你把话咽了回去。关系没有立刻结束，但那个时机也因此从此不再一样。",
            },
          ],
          log: "你把重要的话再次留在了心里。人生里不少遗憾，往往就是这么悄悄长出来的。",
        }),
      ],
    }),
    event({
      id: "busy_schedule_relationship",
      stage: "young_adult",
      title: "工作和现实开始直接消耗关系",
      text: "进入社会后，感情不再只是有没有心动，而是要和通勤、加班、租房、疲惫、成长速度不同步这些很具体的事一起过。你和{activeLoveName}的关系也开始被现实真正检验。",
      minAge: 23,
      maxAge: 28,
      weight: 7,
      tags: ["young_adult", "romance"],
      conditions: condition({
        activeRelationshipStatuses: ["dating", "close", "steady"],
        activeRelationshipMinAffection: 30,
      }),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "心动开始真正要和现实一起生活。你会发现，一段关系能不能留住，很多时候取决于疲惫时还愿不愿意继续经营。",
      }),
      choices: [
        choice({
          text: "你们认真留时间给彼此，哪怕忙，也尽量不让关系只剩下应付。",
          effects: {
            age: 0,
            stats: { happiness: 5, social: 3 },
          },
          addFlags: ["long_term_partner", "emotional_honesty"],
          addTags: ["family", "relationship"],
          addRomanceFlags: ["relationship_maintained"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 12,
              status: "steady",
              addFlags: ["weathered_busy_period"],
              history: "你们没有让忙碌成为默认借口，而是真的试着在现实里继续留住彼此。",
            },
          ],
          log: "你开始明白，成熟关系不是一直有空，而是在没空的时候仍然愿意认真安排彼此的位置。",
        }),
        choice({
          text: "你越来越忙，消息和见面都往后排，关系开始明显降温。",
          effects: {
            age: 0,
            stats: { career: 3, happiness: -5 },
          },
          addFlags: ["career_first", "solo_pattern"],
          addTags: ["ambition", "romance"],
          addRomanceFlags: ["relationship_neglected"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: -14,
              status: "estranged",
              addFlags: ["neglected_by_busy"],
              history: "长期忙碌让你们的联系越来越像任务，关系也在这种拖延里慢慢冷了下去。",
            },
          ],
          log: "你没有立刻做错什么，只是一次次把关系往后放，最后它真的被放远了。",
        }),
        choice({
          text: "你们试着重新谈规则、边界和期待，不让疲惫直接把关系磨碎。",
          effects: {
            age: 0,
            stats: { social: 3, happiness: 2, health: 1 },
          },
          addFlags: ["emotional_honesty", "boundary_awareness"],
          addTags: ["relationship", "stability"],
          addRomanceFlags: ["relationship_maintained"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 7,
              status: "steady",
              addFlags: ["rules_reworked"],
              history: "你们没有继续靠猜测硬顶，而是把相处方式重新谈了一遍。",
            },
          ],
          log: "你开始真正把关系当成一件需要共同维护的事，而不是一股年轻时自然往前滚的情绪。",
        }),
      ],
    }),
    event({
      id: "relationship_value_gap",
      stage: "family",
      title: "相处久了以后，价值观差异开始变得不能只靠喜欢压过去",
      text: "真正长期的关系里，很多决定都不再是单点选择。钱怎么花、工作怎么排、要不要回家乡、怎么对待家人、怎么分配精力，这些差异如果长期不谈，最后都会变成关系里的硬伤。",
      minAge: 24,
      maxAge: 32,
      weight: 6,
      tags: ["family", "romance"],
      conditions: condition({
        activeRelationshipStatuses: ["dating", "steady"],
        activeRelationshipMinAffection: 36,
      }),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "喜欢走到这里，终于要接受现实问题的长期盘问。值不值得继续，不再只看心动强不强。",
      }),
      choices: [
        choice({
          text: "你们把最难谈的议题都摊开来谈，慢慢形成新的共识。",
          effects: {
            age: 0,
            stats: { happiness: 4, social: 3 },
          },
          addFlags: ["emotional_honesty", "family_builder"],
          addTags: ["family", "relationship"],
          addRomanceFlags: ["relationship_maintained"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 10,
              status: "steady",
              addFlags: ["shared_values"],
              history: "你们认真谈过那些真正会决定以后怎么过日子的事，关系也因此更稳了一层。",
            },
          ],
          log: "你们没有假装一切天然合适，而是靠一次次谈清楚，把关系真正往长期里推。",
        }),
        choice({
          text: "你觉得很多问题留着以后再说，结果分歧一点点越堆越硬。",
          effects: {
            age: 0,
            stats: { happiness: -5, social: -1 },
          },
          addFlags: ["hollow_relationship", "family_pressure"],
          addTags: ["family", "pressure"],
          addRomanceFlags: ["value_misaligned", "relationship_neglected"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: -13,
              status: "estranged",
              addFlags: ["values_unresolved"],
              history: "你们把最难的议题一拖再拖，关系也在这些不被处理的差异里慢慢受损。",
            },
          ],
          log: "真正伤关系的，很多时候不是一次争吵，而是长期不谈和默认对方会自己理解。",
        }),
        choice({
          text: "你意识到彼此想要的人生结构差太多，决定体面退出。",
          effects: {
            age: 0,
            stats: { happiness: 1, money: -2, social: 2 },
          },
          addFlags: ["missed_love", "second_growth"],
          addTags: ["selfhood", "relationship"],
          addRomanceFlags: ["value_misaligned"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: -18,
              status: "broken",
              addFlags: ["ended_over_values"],
              clearActive: true,
              history: "你们承认彼此真的想去的方向不一样，于是选择在还能体面时结束这段关系。",
            },
          ],
          log: "你没有把不合适硬熬成伤害，而是认真承认了感情之外，人生结构也需要匹配。",
        }),
      ],
    }),
    event({
      id: "reconnect_after_distance",
      stage: "family",
      title: "很久以后，你和{activeLoveName}之间出现了一次重新靠近的可能",
      text: "有些关系不会完全消失，它们会在很多年后，以更平静也更现实的方式重新回来。问题不再只是“还喜不喜欢”，而是你们现在是否真的有能力用更成熟的方法再试一次。",
      minAge: 28,
      maxAge: 38,
      weight: 4,
      tags: ["family", "romance"],
      conditions: condition({
        activeRelationshipStatuses: ["estranged", "broken"],
        activeRelationshipMinAffection: 16,
      }),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "那段你以为差不多已经翻篇的关系，又一次回到了你的生活边上。",
      }),
      choices: [
        choice({
          text: "你愿意慢慢重新建立联系，但这一次更重视边界和现实。",
          effects: {
            age: 0,
            stats: { happiness: 5, social: 3 },
          },
          addFlags: ["late_love", "emotional_honesty"],
          addTags: ["family", "growth"],
          addRomanceFlags: ["relationship_rebuilt"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 12,
              status: "reconnected",
              addFlags: ["careful_rebuild"],
              history: "你们没有假装什么都没发生，而是在更成熟的边界里重新试着靠近。",
            },
          ],
          log: "你开始明白，重逢真正宝贵的地方不是浪漫，而是彼此有没有长出更好的处理方式。",
        }),
        choice({
          text: "你们把过去说开了，但也确定彼此还是更适合停在这里。",
          effects: {
            age: 0,
            stats: { happiness: 2, intelligence: 2 },
          },
          addFlags: ["second_growth"],
          addTags: ["selfhood", "growth"],
          addRomanceFlags: ["relationship_closed_with_peace"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: -2,
              status: "broken",
              addFlags: ["goodbye_properly"],
              clearActive: true,
              history: "你们终于把该说的话说完了，也因此真正有机会把这段关系好好放下。",
            },
          ],
          log: "不是所有重逢都要导向继续，有时真正的修复只是终于能平静地告别。",
        }),
        choice({
          text: "你怕重来还是会重蹈覆辙，于是选择保持距离。",
          effects: {
            age: 0,
            stats: { happiness: -1, health: 1 },
          },
          addFlags: ["emotionally_guarded"],
          addTags: ["distance", "selfhood"],
          addRomanceFlags: ["romance_held_back"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: -4,
              addFlags: ["kept_distance_again"],
              history: "你选择不再重新点燃这段关系，哪怕心里并不是完全没波动。",
            },
          ],
          log: "你不是不怀念，只是更怕旧问题在新的阶段里再来一遍。",
        }),
      ],
    }),
    event({
      id: "commitment_or_release",
      stage: "family",
      title: "你终于得决定，这段关系要不要被写进未来",
      text: "交往久了以后，关系不能永远停在“我们先这样”。无论是同居、共同规划、谈婚论嫁，还是认真分开，真正成熟的决定都需要你面对自己对长期生活的真实想法。",
      minAge: 30,
      maxAge: 38,
      weight: 7,
      tags: ["family", "romance"],
      conditions: condition({
        activeRelationshipStatuses: ["dating", "steady", "reconnected"],
        activeRelationshipMinAffection: 48,
      }),
      effectsOnEnter: mutation({
        effects: { age: 0, stats: {} },
        log: "这已经不是“喜不喜欢”的问题，而是“你愿不愿意真的把对方放进未来结构里”。",
      }),
      choices: [
        choice({
          text: "你决定认真往共同生活推进，把承诺变得具体。",
          effects: {
            age: 0,
            stats: { happiness: 6, money: -2, social: 3 },
          },
          addFlags: ["long_term_partner", "family_builder"],
          addTags: ["family", "stability"],
          addRomanceFlags: ["relationship_committed"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 10,
              status: "steady",
              addFlags: ["future_planned"],
              history: "你没有再把这段关系停在模糊地带，而是明确把彼此写进了未来计划里。",
            },
          ],
          log: "你做出的不是最轻的决定，却很可能是最有后劲的一次靠近。",
        }),
        choice({
          text: "你想继续在一起，但还不愿意把关系推进到更深的绑定里。",
          effects: {
            age: 0,
            stats: { happiness: 1, career: 2 },
          },
          addFlags: ["career_first"],
          addTags: ["relationship", "selfhood"],
          addRomanceFlags: ["relationship_maintained"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: -3,
              status: "dating",
              addFlags: ["commitment_delayed"],
              history: "你选择继续关系，但也明确把更重的承诺往后放了放。",
            },
          ],
          log: "你不是不认真，只是还在试图同时保住自由、前途和关系，这通常会让局面更复杂。",
        }),
        choice({
          text: "你承认自己给不了对方想要的未来，选择分开。",
          effects: {
            age: 0,
            stats: { happiness: 2, social: 2, money: -2 },
          },
          addFlags: ["missed_love", "second_growth", "solo_pattern"],
          addTags: ["selfhood", "relationship"],
          addRomanceFlags: ["relationship_released"],
          relationshipEffects: [
            {
              targetId: "$active",
              affection: -15,
              status: "broken",
              addFlags: ["released_over_future"],
              clearActive: true,
              history: "你们没有继续拖着彼此，而是在真正想要的未来不一致时选择了分开。",
            },
          ],
          log: "你没有把承诺说成空话。很多成熟，恰恰体现在敢不敢承认自己给不了什么。",
        }),
      ],
    }),
  ];

  window.LIFE_EXTRA_EVENTS = [...EARLY_STAGE_EXPANSION, ...ROMANCE_SYSTEM_EXPANSION];
})();

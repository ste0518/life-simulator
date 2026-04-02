(function () {
  "use strict";

  /**
   * 监狱 / 羁押线剧情
   * - 灰线法律事件：先进 prison_remand，再经本链在 closing_cell 收监（incarcerated）。
   * - 负债入狱：引擎先切入 prison_debt_legal_endpoint，再并入同一链条。
   */

  function ev(source) {
    return source;
  }

  function ch(source) {
    return source;
  }

  const prisonArcEvents = [
    ev({
      id: "prison_debt_legal_endpoint",
      stage: "career",
      title: "债滚到这份上，执行程序不会再跟你商量体面",
      text: "电话、短信、上门核对、冻结与文书上的措辞，一样样叠上来。你突然看清：当现金薄得像纸、债却厚得像墙时，「再缓两天」这句话已经没人接了。\n\n有人还在走廊里吵，有人已经默默收拾东西。你知道自己正站在一条会把人送进另一种历法的边上。",
      minAge: 18,
      maxAge: 70,
      weight: 1,
      repeatable: false,
      tags: ["crisis", "prison", "finance"],
      conditions: {
        debtToMoneyPrison: { debtAbove: 50, moneyMultiple: 5 }
      },
      choices: [
        ch({
          text: "文书与强制措施落到头上——先被卷进羁押程序。",
          effects: { stats: { stress: 14, mental: -10, career: -4, money: -5 } },
          addFlags: ["prison_remand", "legal_system_blowback"],
          log: "你不是「突然」进去的，是一串数字先把路堵死，再把人推过去。",
          next: "prison_arc_intake"
        }),
        ch({
          text: "砸锅卖铁再凑一笔，把最锋利的刀先挪开半寸。",
          effects: { stats: { money: -18, debt: -10, stress: 12, health: -3, mental: -4 } },
          addFlags: ["debt_buying_time"],
          log: "你买到了一点时间，也知道自己只是把雷往后挪了挪。"
        }),
        ch({
          text: "找律师谈重组与分期，哪怕难看也要把程序走正。",
          effects: { stats: { intelligence: 3, stress: 8, money: -6, debt: -4, mental: 2 } },
          addFlags: ["legal_system_blowback"],
          log: "正规路径慢、贵、也不保证赢，但至少不再只靠侥幸拖着。"
        })
      ]
    }),
    ev({
      id: "prison_arc_intake",
      stage: "career",
      title: "第一道铁门：登记、搜身、编号",
      text: "皮带、鞋带、手机、钥匙——一件件被拿走。你学着用编号回答点名，用眼神量走廊的宽度。外面那套「明天再说」在这里失效，只剩流程、口令和必须遵守的刻度。",
      minAge: 18,
      maxAge: 70,
      weight: 22,
      repeatable: false,
      tags: ["prison", "crisis"],
      conditions: {
        requiredFlags: ["prison_remand"],
        excludedFlags: ["incarcerated"]
      },
      choices: [
        ch({
          text: "你强迫自己记住规则：少问、多看、别逞能。",
          effects: { stats: { discipline: 4, stress: 6, mental: -2 } },
          log: "尊严被压缩成很小的形状，但你还想保住底线。",
          next: "prison_arc_quarters"
        }),
        ch({
          text: "你在心里反复回放怎么走到这里，几乎听不进干部在念什么。",
          effects: { stats: { mental: -4, stress: 8, happiness: -4 } },
          log: "后悔来得又重又迟，可它至少让你看清自己曾跳过哪些提醒。",
          next: "prison_arc_quarters"
        }),
        ch({
          text: "你盯着地面，先把呼吸稳住——怕一开口就崩。",
          effects: { stats: { stress: 5, mental: 2, health: -2 } },
          log: "有时候撑住不等于坚强，只是还没找到可以塌下来的角落。",
          next: "prison_arc_quarters"
        })
      ],
      effectsOnEnter: {
        effects: { stats: {} },
        log: "铁门在身后合上，声音比你想的更闷。"
      }
    }),
    ev({
      id: "prison_arc_quarters",
      stage: "career",
      title: "号房里的时间变得又长又薄",
      text: "大通铺、水房、电视机的音量、有人打鼾有人磨牙——二十四小时被切成无数等长的格子。你会开始理解什么叫「熬」：不是冲刺，是把一分钟掰成很多次呼吸。",
      minAge: 18,
      maxAge: 70,
      weight: 20,
      repeatable: false,
      tags: ["prison", "pressure"],
      conditions: {
        requiredFlags: ["prison_remand"],
        excludedFlags: ["incarcerated"],
        visited: ["prison_arc_intake"]
      },
      choices: [
        ch({
          text: "尽量低调，不站队，先把日子过顺。",
          effects: { stats: { discipline: 3, stress: 3, social: -2 } },
          log: "你不是来交朋友的，是来少惹事的。",
          next: "prison_arc_labor_wind"
        }),
        ch({
          text: "听老人犯讲「里面的规矩」，心里一半不屑一半发毛。",
          effects: { stats: { intelligence: 2, stress: 5, mental: -2 } },
          log: "规矩有的能保命，有的只是另一层暴力，你得自己分辨。",
          next: "prison_arc_labor_wind"
        }),
        ch({
          text: "夜里睡不着，反复想外面谁还在等你、谁已经当没你这个人。",
          effects: { stats: { happiness: -5, mental: -3, stress: 6 } },
          log: "孤独在这里不是形容词，是每盏长明灯下的实体。",
          next: "prison_arc_labor_wind"
        })
      ]
    }),
    ev({
      id: "prison_arc_labor_wind",
      stage: "career",
      title: "劳动、放风、晒太阳也要排队",
      text: "手会磨出泡，背会酸到发麻，可也有人把劳动当成唯一能「累到不想」的方式。放风那几分钟的天显得特别亮，你会贪婪地看云，像偷藏一点外面的证据。",
      minAge: 18,
      maxAge: 70,
      weight: 18,
      repeatable: false,
      tags: ["prison", "health"],
      conditions: {
        requiredFlags: ["prison_remand"],
        excludedFlags: ["incarcerated"],
        visited: ["prison_arc_quarters"]
      },
      choices: [
        ch({
          text: "把活干完，换一点踏实和少被找茬。",
          effects: { stats: { discipline: 3, health: 1, stress: 2, career: 1 } },
          log: "汗水至少诚实，它不跟你讲虚的。",
          next: "prison_arc_visitor_echo"
        }),
        ch({
          text: "放风时拼命深呼吸，把胸口那团闷气吐出去一点。",
          effects: { stats: { health: 2, mental: 2, stress: -1 } },
          log: "风很短，但足够让你记起自己还是活人。",
          next: "prison_arc_visitor_echo"
        }),
        ch({
          text: "身体吃不消仍硬撑，怕显得弱。",
          effects: { stats: { health: -4, stress: 4, discipline: 1 } },
          log: "逞强在这里不加分，只会把代价记到身体上。",
          next: "prison_arc_visitor_echo"
        })
      ]
    }),
    ev({
      id: "prison_arc_visitor_echo",
      stage: "career",
      title: "会见日：玻璃、电话、说不完的半句话",
      text: "有人哭，有人骂，有人沉默到双方都尴尬。你把很多话咽回去，因为知道隔着玻璃说不完整，也怕一说就漏出更大的窟窿。",
      minAge: 18,
      maxAge: 70,
      weight: 17,
      repeatable: false,
      tags: ["prison", "family"],
      conditions: {
        requiredFlags: ["prison_remand"],
        excludedFlags: ["incarcerated"],
        visited: ["prison_arc_labor_wind"]
      },
      choices: [
        ch({
          text: "跟家里报平安，把最难的部分自己咽了。",
          effects: { stats: { familySupport: 2, stress: 6, mental: -2, happiness: -2 } },
          log: "你骗得很温柔，可挂电话那秒肩膀还是塌了一下。",
          next: "prison_arc_reading_legal"
        }),
        ch({
          text: "终于说出口：我错了，后面我会按程序扛。",
          effects: { stats: { mental: 3, stress: 4, familySupport: 3 } },
          addFlags: ["emotional_honesty"],
          log: "认错不解决问题，但至少不再把家人蒙在更厚的雾里。",
          next: "prison_arc_reading_legal"
        }),
        ch({
          text: "没人来，你对着空椅子坐满时间，笑自己以前多热闹。",
          effects: { stats: { happiness: -6, mental: -5, stress: 8 } },
          addFlags: ["solo_pattern"],
          log: "人缘与地位在外面很响，在这里会被剥得很干净。",
          next: "prison_arc_reading_legal"
        })
      ]
    }),
    ev({
      id: "prison_arc_reading_legal",
      stage: "career",
      title: "寄来的法条、信纸和皱巴巴的复印件",
      text: "律师或援助材料一页页钉起来，字很密，条款很冷。你第一次像学生一样划重点——不是为了考高分，是为了搞懂自己还剩哪几步棋。",
      minAge: 18,
      maxAge: 70,
      weight: 16,
      repeatable: false,
      tags: ["prison", "growth"],
      conditions: {
        requiredFlags: ["prison_remand"],
        excludedFlags: ["incarcerated"],
        visited: ["prison_arc_visitor_echo"]
      },
      choices: [
        ch({
          text: "把程序、期限、可申诉点一条条抄在本子上。",
          effects: { stats: { intelligence: 4, discipline: 3, stress: 3 } },
          log: "搞懂规则不等于翻盘，但至少少被人牵着走。",
          next: "prison_arc_closing_cell"
        }),
        ch({
          text: "看多了反而失眠，觉得每条都像在钉你。",
          effects: { stats: { stress: 8, mental: -4, health: -2 } },
          log: "知识有时不是安慰，是放大镜。",
          next: "prison_arc_closing_cell"
        }),
        ch({
          text: "把信纸留给家人写生活琐事，少谈案子，多谈烟火气。",
          effects: { stats: { happiness: 2, mental: 2, stress: -1 } },
          log: "你需要确认外面的世界还在照常运转。",
          next: "prison_arc_closing_cell"
        })
      ]
    }),
    ev({
      id: "prison_arc_closing_cell",
      stage: "career",
      title: "最后一道手续：判决落地，收监执行",
      text: "签字的笔很重。干部念的那串期限与罪名，把你在外面拖了很久的侥幸一次性收束。你知道从这一刻起，「以后」要按另一种日历算——但你也可能比想象中更早学会在里面把日子过实。",
      minAge: 18,
      maxAge: 70,
      weight: 25,
      repeatable: false,
      tags: ["prison", "milestone"],
      conditions: {
        requiredFlags: ["prison_remand"],
        excludedFlags: ["incarcerated"],
        visited: ["prison_arc_reading_legal"]
      },
      choices: [
        ch({
          text: "在文书上签字，认下这一局，准备按刑期把账慢慢还。",
          effects: { stats: { mental: 2, stress: 10, discipline: 4, career: -6 } },
          addFlags: ["incarcerated", "legal_system_blowback"],
          log: "高墙内的日历翻开第一页；外面的人与事，只能先停在门那边。"
        }),
        ch({
          text: "坚持申诉路径，暂时不收监执行——斗争还在继续。",
          effects: { stats: { stress: 14, mental: -4, money: -8, intelligence: 2 } },
          addFlags: ["legal_system_blowback"],
          removeFlags: ["prison_remand"],
          log: "你没进深监，但程序与压力不会因此变轻；只是换了一条更磨人的跑道。"
        }),
        ch({
          text: "申请保外就医或变更措施，赌一把程序上的缝。",
          effects: { stats: { stress: 12, health: 2, money: -10 } },
          addFlags: ["legal_system_blowback"],
          log: "缝很窄，可你仍想把人先从最硬的墙边挪开半寸。"
        })
      ]
    })
  ];

  window.LIFE_EXTRA_EVENTS = (Array.isArray(window.LIFE_EXTRA_EVENTS) ? window.LIFE_EXTRA_EVENTS : []).concat(
    prisonArcEvents
  );
})();

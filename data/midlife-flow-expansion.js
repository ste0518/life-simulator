(function () {
  "use strict";

  /**
   * 中后期事件补池：降低「无事件可抽 → 提前收束」的概率，
   * 并注册 life_flow_padding_* 供引擎在兜底时强制续命（非自然收束年龄段）。
   */

  function ev(source) {
    return source;
  }

  function ch(source) {
    return source;
  }

  const midlifeFlowEvents = [
    ev({
      id: "life_flow_padding_adult",
      stage: "young_adult",
      title: "日子在重复里悄悄往前挪了一格",
      text: "没有大事发生的一周，也会占用人生。你照常起床、通勤、回消息、应付琐事，偶尔停下来才发现：生活很多时候不是靠高光推进，而是靠这些不起眼的连续。",
      minAge: 22,
      maxAge: 72,
      weight: 16,
      repeatable: true,
      cooldownChoices: 5,
      tags: ["misc", "life_padding", "stability"],
      choices: [
        ch({
          text: "把一件拖了很久的小事做完，心里莫名轻一点。",
          effects: { stats: { discipline: 2, stress: -1, mental: 1 } },
          log: "你不是变强了，只是终于少背了一件小事。"
        }),
        ch({
          text: "约朋友吃一顿不用谈正事的饭。",
          effects: { stats: { social: 2, happiness: 2, money: -3 } },
          log: "热闹散去后，你发现自己其实需要这种没有目的的见面。"
        }),
        ch({
          text: "早点睡，承认今天就这样也可以。",
          effects: { stats: { health: 2, stress: -2, happiness: 1 } },
          log: "你第一次不把「没产出」当成罪过。"
        })
      ]
    }),
    ev({
      id: "life_flow_padding_later",
      stage: "later_life",
      title: "年纪上来以后，时间感会变得不一样",
      text: "有些事不再急着要结果，有些人也不再非争个输赢。你更常做的是把日子过顺、把身体顾好、把真正重要的人留在近处。",
      minAge: 58,
      maxAge: 94,
      weight: 18,
      repeatable: true,
      cooldownChoices: 6,
      tags: ["later_life", "life_padding", "reflection"],
      choices: [
        ch({
          text: "整理旧物，翻到年轻时的纸条，笑了一下又收好。",
          effects: { stats: { happiness: 2, mental: 2, stress: -1 } },
          log: "回忆不再刺痛，只是让你更清楚自己从哪走来。"
        }),
        ch({
          text: "学一样很慢的爱好，不为了展示给别人看。",
          effects: { stats: { happiness: 3, discipline: 1, stress: -2 } },
          log: "你把「没用」重新定义成一种奢侈的正当。"
        }),
        ch({
          text: "把体检预约从「再说」改成「这周一定」。",
          effects: { stats: { health: 3, stress: 1, discipline: 1 } },
          log: "你开始用更务实的方式对待后半程。"
        })
      ]
    }),
    ev({
      id: "work_baseline_pulse",
      stage: "career",
      title: "职场里那点不起眼的小进展",
      text: "未必是升职，也未必是加薪。可能只是流程顺了一点、同事配合了一点，或者你终于敢在会议上把话说完整。对长期来说，这些碎进步会堆成底气。",
      minAge: 24,
      maxAge: 52,
      weight: 12,
      repeatable: true,
      tags: ["career", "growth"],
      conditions: { minStats: { career: 6 } },
      choices: [
        ch({
          text: "把一次反馈认真记下来，下次真的改。",
          effects: { stats: { career: 3, discipline: 2, stress: 1 } },
          log: "你开始把成长当成可执行项，而不是情绪。"
        }),
        ch({
          text: "拒绝一件不该你扛的锅，边界清晰了一点。",
          effects: { stats: { mental: 2, stress: -1, career: 1 } },
          log: "体面不是永远说好，而是知道哪里该停。"
        }),
        ch({
          text: "加班后还是去跑步，用身体把压力卸掉一半。",
          effects: { stats: { health: 2, stress: -2, career: 1 } },
          log: "你把「撑住」换成「接住自己」。"
        })
      ]
    }),
    ev({
      id: "stable_relationship_domestic",
      stage: "family",
      title: "稳定关系里，真正磨人的往往是家务账",
      text: "谁洗碗、谁回父母消息、钱怎么存、假期回哪边——这些不浪漫的问题，会反复测试你们是不是真的能一起过日子。",
      minAge: 26,
      maxAge: 55,
      weight: 13,
      repeatable: true,
      tags: ["family", "relationship"],
      conditions: {
        activeRelationshipStatuses: ["steady", "married", "dating", "passionate", "long_distance_dating"]
      },
      choices: [
        ch({
          text: "坐下来把分工写清楚，吵归吵，规则留下。",
          effects: { stats: { stress: 2, happiness: 2, mental: 2 } },
          relationshipEffects: [
            {
              targetId: "$active",
              trust: 4,
              commitment: 3,
              history: "你们用很土的方式，把「一起过」写成了可执行的条款。"
            }
          ],
          log: "不漂亮，但管用。"
        }),
        ch({
          text: "先退让一次，但约好下周再复盘。",
          effects: { stats: { stress: 1, happiness: 1 } },
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 2,
              tension: 2,
              history: "退让不是认输，是给彼此一个喘气的缝。"
            }
          ]
        }),
        ch({
          text: "花钱请保洁解放周末，用钱换一点关系空间。",
          effects: { stats: { money: -5, stress: -2, happiness: 2 } },
          relationshipEffects: [
            {
              targetId: "$active",
              affection: 2,
              history: "你们第一次承认：有些矛盾不是爱不够，是精力不够。"
            }
          ]
        })
      ]
    }),
    ev({
      id: "parenting_school_chat_group",
      stage: "family",
      title: "家长群、作业和那句「别人家孩子」",
      text: "有孩子之后，你会突然进入一套新的社交系统：老师、家长、培训班销售，以及永远刷不完的通知。你不是一个人在烦，但你常常觉得只能自己顶。",
      minAge: 28,
      maxAge: 50,
      weight: 14,
      repeatable: true,
      tags: ["family", "child", "pressure"],
      conditions: { minChildCount: 1 },
      choices: [
        ch({
          text: "和伴侣对齐底线：不攀比，也不甩锅。",
          effects: { stats: { familySupport: 2, stress: -1, mental: 2 } },
          relationshipEffects: [
            {
              targetId: "$active",
              trust: 3,
              commitment: 3,
              history: "你们在家长群的噪音里，先守住了「我们是同一队」。"
            }
          ]
        }),
        ch({
          text: "删掉几条制造焦虑的推送，给自己降噪。",
          effects: { stats: { stress: -2, happiness: 1, mental: 2 } },
          log: "你知道信息并不会因为你多看几条就变善良。"
        }),
        ch({
          text: "咬牙报一门班，同时心疼钱也心疼孩子。",
          effects: { stats: { money: -8, stress: 3, happiness: -1, intelligence: 1 } },
          addFlags: ["parenting_pressure_spend"],
          log: "你把钱花出去的那一刻，既希望有用，也害怕只是买心安。"
        })
      ]
    }),
    ev({
      id: "abroad_life_grocery_math",
      stage: "college",
      title: "国外生活：超市小票也是一课",
      text: "汇率、会员价、临期折扣、自己做饭和外卖之间的换算——你在异国学会的第一项技能，常常不是语言，而是把日子换算成能活下去的数字。",
      minAge: 19,
      maxAge: 40,
      weight: 12,
      repeatable: true,
      tags: ["overseas", "money", "selfhood"],
      conditions: { requiredFlags: ["life_path_overseas"] },
      choices: [
        ch({
          text: "研究菜谱，把预算压下来一点。",
          effects: { stats: { discipline: 2, happiness: 1, stress: -1, money: 1 } },
          log: "你第一次觉得「会过日子」也是一种能力。"
        }),
        ch({
          text: "偶尔放纵一顿，然后默默多走两站路回家。",
          effects: { stats: { happiness: 3, money: -4, health: 1 } },
          log: "你用很小的奢侈，换了一点不想被剥夺的尊严。"
        }),
        ch({
          text: "找同学拼单，把孤独和开销都摊薄。",
          effects: { stats: { social: 3, stress: -2, mental: 1 } },
          log: "你开始明白，海外生活很多时候靠「一起扛」才撑得住。"
        })
      ]
    }),
    ev({
      id: "post_career_burnout_recover",
      stage: "career",
      title: "工作把你掏空过一截之后，身体先开口说话",
      text: "你可能还没辞职，也还没崩溃，但你会突然在某天下班路上意识到：你不是累了，你是空了。恢复不是一句鸡汤，而是一连串很小的选择。",
      minAge: 28,
      maxAge: 58,
      weight: 10,
      repeatable: true,
      tags: ["career", "health", "pressure"],
      conditions: { someFlags: ["overworked", "chronic_stress", "career_first"] },
      choices: [
        ch({
          text: "请几天假，不旅行，只睡觉和发呆。",
          effects: { stats: { health: 3, mental: 3, stress: -3, career: -1 } },
          addFlags: ["recovery_turn"],
          log: "你允许自己暂时从「有用」里退出来。"
        }),
        ch({
          text: "找朋友吐槽，承认自己也撑不住。",
          effects: { stats: { social: 2, mental: 2, stress: -2 } },
          log: "说出口的瞬间，羞耻感轻了一半。"
        }),
        ch({
          text: "继续硬顶，但你知道这是在透支。",
          effects: { stats: { career: 1, health: -2, stress: 4, mental: -2 } },
          log: "你把选择推迟了，但账单不会消失。"
        })
      ]
    }),
    ev({
      id: "legal_line_sealed_sentence",
      stage: "career",
      title: "灰线走到头，会以法律文书的形式来找你",
      text: "你曾为快钱、关系或侥幸付过代价，却总觉得还能收得住。直到传唤、取保或判决真的落到名字上，你才明白：有些事不是「倒霉」，而是早就被写进了因果里。",
      minAge: 20,
      maxAge: 58,
      weight: 3,
      repeatable: false,
      tags: ["career", "risk", "crisis"],
      conditions: {
        someFlags: ["speculative_route", "shady_network", "bad_company", "major_bet_loss"],
        minStats: { debt: 35 }
      },
      choices: [
        ch({
          text: "程序走到收押这一步——先被卷进羁押与收监前的流程。",
          effects: { stats: { career: -12, mental: -12, stress: 28, debt: 12, money: -15 } },
          addFlags: ["prison_remand", "legal_system_blowback"],
          log: "文书比情绪更快；你得先学会在里面把日子过下去。",
          next: "prison_arc_intake"
        }),
        ch({
          text: "侥幸未被收监，但警告与案底阴影会跟你很久。",
          effects: { stats: { stress: 18, mental: -6, career: -4, money: -8 } },
          addFlags: ["legal_system_blowback"],
          log: "自由还在，可你知道有些东西已经回不去了。"
        }),
        ch({
          text: "用赔偿与和解把刑事责任压住一线，代价是倾家荡产式的清账。",
          effects: { stats: { money: -25, debt: 18, stress: 22, health: -4 } },
          addFlags: ["legal_system_blowback"],
          log: "你没有进去，却把自己几年的现金流一把对折。"
        })
      ]
    })
  ];

  window.LIFE_EXTRA_EVENTS = (Array.isArray(window.LIFE_EXTRA_EVENTS) ? window.LIFE_EXTRA_EVENTS : []).concat(
    midlifeFlowEvents
  );
})();

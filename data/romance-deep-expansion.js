(function () {
  "use strict";

  /**
   * 恋爱深水扩展（与 romance-expansion.js 配套）
   *
   * 手动维护索引 window.LIFE_ROMANCE_DEEP_META：
   * - characterEventSuffixes：每人附加的事件 id 后缀（便于搜改）
   * - globalEventIds：不绑定单一角色的感情向事件
   *
   * 依赖：先加载 romance-expansion.js（提供 __LIFE_ROMANCE_FACTORY__）
   */

  const F = window.__LIFE_ROMANCE_FACTORY__;
  if (!F) {
    return;
  }

  const {
    event,
    choice,
    condition,
    mergeConditions,
    relationshipReadyConditions,
    buildEffect,
    stageFromAge,
    getSceneHooks,
    pickText,
    toList,
    getHookSnippet
  } = F;

  function introAgeOf(def) {
    const n = def.appearance && typeof def.appearance.minAge === "number" ? def.appearance.minAge : 16;
    return n;
  }

  function hasStageTag(def, tag) {
    return toList(def.stageTags).includes(tag);
  }

  function skipDeepRomanceChain(def) {
    return def && def.id === "professor_anika_reed";
  }

  function arcTone(def) {
    const t = (def.romanceProfile && def.romanceProfile.arcType) || "slowburn";
    if (t === "intense") {
      return {
        jealous: "情绪几乎不绕弯，话到嘴边就会烫人一点。",
        repair: "吵完也会回头找你，但需要你先接住一步。",
        date: "更想要热闹、并肩被撞见的那种在场感。",
        tease: "起哄声一响，反而更容易把关系推到亮处。"
      };
    }
    if (t === "stable" || t === "steady") {
      return {
        jealous: "会先沉默一会儿，把酸意藏进细节和语气里。",
        repair: "更愿意把事情摊开说清楚，把误会收口。",
        date: "更珍惜吃饭、散步、把普通日子过得稳的那种陪伴。",
        tease: "被起哄时表面镇定，其实耳朵会先红一步。"
      };
    }
    if (t === "regret") {
      return {
        jealous: "越在意越不说透，只会突然安静。",
        repair: "要先把自尊放下一点，才接得住彼此的软话。",
        date: "更适合人少、能慢慢说话的场合。",
        tease: "起哄一来，第一反应往往是退后半步。"
      };
    }
    if (t === "reunion") {
      return {
        jealous: "会联想到以前的错过，醋里带点涩。",
        repair: "更怕再次走散，所以反而更想把话说满。",
        date: "像补偿又像确认，每一次见面都带一点郑重。",
        tease: "玩笑里藏着试探：这次还要不要认真。"
      };
    }
    return {
      jealous: "不会立刻翻脸，但你会明显感觉气氛薄了一层。",
      repair: "需要一点时间，但愿意把结慢慢解开。",
      date: "舒服的节奏比排场更重要。",
      tease: "会笑着挡一下，却把每一句话都听进去了。"
    };
  }

  function buildPeerTease(def) {
    const id = def.id;
    const hooks = getSceneHooks(def.appearance);
    const ctx = getHookSnippet(hooks.repeated, pickText(def.appearance && def.appearance.contexts, "日常相处"));
    const tone = arcTone(def);
    const ia = introAgeOf(def);

    return event({
      id: id + "_deep_peer_tease",
      stage: stageFromAge(Math.max(ia, 13)),
      title: "有人开始拿你和" + def.name + "开玩笑",
      text:
        "在" +
        ctx +
        "里，你们的互动本来还可以装作普通。直到有人把那句玩笑说出口——像把灯突然打开，让你们都无处可躲。" +
        tone.tease,
      minAge: Math.max(ia, 12),
      maxAge: Math.min(ia + 8, 22),
      weight: 5,
      tags: ["romance", "school", "social"],
      conditions: relationshipReadyConditions(id, {
        requiredRelationshipFlags: { [id]: ["introduced"] },
        excludedRelationshipFlags: { [id]: ["deep_peer_tease_done"] },
        minFamiliarity: { [id]: 10 },
        excludedRelationshipStatuses: { [id]: ["broken", "missed"] }
      }),
      choices: [
        choice({
          text: "笑着把场面圆过去，私下再找" + def.name + "把话说清楚。",
          effects: { stats: { social: 2, stress: 1 } },
          addRomanceFlags: ["romance_social_negotiated"],
          relationshipEffects: [
            buildEffect(id, {
              affection: 8,
              trust: 10,
              ambiguity: 8,
              tension: -4,
              continuity: 8,
              interactions: 1,
              status: "ambiguous",
              addFlags: ["deep_peer_tease_done", "peer_tease_clarified"],
              setActive: true,
              history: "你没有让起哄把关系钉死，却借机把彼此的边界和心意往前推了一步。"
            })
          ],
          log: "朋友起哄有时是灾难，有时也是推手。"
        }),
        choice({
          text: "顺着玩笑接两句，看看" + def.name + "会不会也接得住。",
          effects: { stats: { happiness: 2, social: 1 } },
          relationshipEffects: [
            buildEffect(id, {
              affection: 6,
              theirInterest: 8,
              playerInterest: 6,
              ambiguity: 12,
              tension: 2,
              continuity: 6,
              interactions: 1,
              status: "mutual_crush",
              addFlags: ["deep_peer_tease_done", "peer_tease_lean_in"],
              setActive: true,
              history: "你把玩笑当成试探，对方也在你的语气里读到了认真。"
            })
          ],
          log: "有些暧昧是从一群人笑开开始的。"
        }),
        choice({
          text: "立刻否认、拉开距离，不想让关系被架在台面上。",
          effects: { stats: { discipline: 1, happiness: -1, stress: 2 } },
          addFlags: ["emotionally_guarded"],
          relationshipEffects: [
            buildEffect(id, {
              affection: -4,
              theirInterest: -6,
              tension: 10,
              trust: -4,
              continuity: -2,
              interactions: 1,
              status: "familiar",
              addFlags: ["deep_peer_tease_done", "peer_tease_denied"],
              history: "你选择了保护场面，也无意间把对方的期待推远了一点。"
            })
          ],
          log: "否认并不总是谎言，有时是害怕。"
        })
      ]
    });
  }

  function buildWalkHome(def) {
    const id = def.id;
    const hooks = getSceneHooks(def.appearance);
    const ia = introAgeOf(def);
    const bond = getHookSnippet(hooks.bond, "相处里的细节");

    return event({
      id: id + "_deep_walk_home",
      stage: stageFromAge(Math.max(ia, 13)),
      title: "放学路上，你和" + def.name + "意外走成同路",
      text:
        "铃声之后，人群像潮水一样往外涌。你们本来各自有各自的方向，却在路口、车站或便利店前一次次并到同一条线上。" +
        bond +
        "让这段路不像巧合，更像谁都没急着拆穿的那种默许。",
      minAge: Math.max(ia, 12),
      maxAge: Math.min(ia + 10, 24),
      weight: 4,
      tags: ["romance", "continuity", "school"],
      conditions: relationshipReadyConditions(id, {
        anyRelationshipStatuses: ["noticed", "crush", "noticed_by_them", "mutual_crush", "familiar", "close", "ambiguous"],
        minFamiliarity: { [id]: 14 },
        excludedRelationshipFlags: { [id]: ["deep_walk_home_done"] },
        excludedRelationshipStatuses: { [id]: ["broken", "missed"] }
      }),
      choices: [
        choice({
          text: "主动多聊几句，把同路走成习惯。",
          effects: { stats: { happiness: 2, social: 1 } },
          relationshipEffects: [
            buildEffect(id, {
              affection: 10,
              familiarity: 14,
              playerInterest: 10,
              theirInterest: 8,
              continuity: 12,
              interactions: 1,
              status: "close",
              addFlags: ["deep_walk_home_done", "afterschool_ritual"],
              setActive: true,
              history: "放学路成了你们关系的暗线：不必表白，也知道自己正在被等待。"
            })
          ],
          log: "同路是最老派的靠近方式之一，却依然好用。"
        }),
        choice({
          text: "保持礼貌距离，但记住对方等车的小动作。",
          effects: { stats: { mental: 1, happiness: 1 } },
          relationshipEffects: [
            buildEffect(id, {
              affection: 6,
              familiarity: 8,
              playerInterest: 12,
              ambiguity: 10,
              continuity: 8,
              interactions: 1,
              status: "crush",
              addFlags: ["deep_walk_home_done", "afterschool_quiet_crush"],
              history: "你把喜欢压在沉默里，却让细节变得更锋利。"
            })
          ],
          log: "暗恋常常长在同一条路的重复里。"
        }),
        choice({
          text: "刻意换一条路，避免越界。",
          effects: { stats: { discipline: 2, stress: 1 } },
          relationshipEffects: [
            buildEffect(id, {
              affection: -2,
              continuity: -4,
              tension: 6,
              interactions: 1,
              addFlags: ["deep_walk_home_done", "afterschool_avoided"],
              history: "你绕开了同路，也绕开了一次让关系自然升温的机会。"
            })
          ],
          log: "错过有时从换路开始。"
        })
      ]
    });
  }

  function buildDutyOrClub(def) {
    const id = def.id;
    const hooks = getSceneHooks(def.appearance);
    const ia = introAgeOf(def);
    const contact = getHookSnippet(hooks.contact, "一次具体分工");

    return event({
      id: id + "_deep_duty_club",
      stage: stageFromAge(Math.max(ia, 12)),
      title: "值日、社团或补课把你们绑在同一组",
      text:
        "你们被分到同一组收拾、同一张表排练，或在" +
        contact +
        "里不得不并肩。汗水、纸屑、粉笔灰和迟到的夕阳，把“喜欢”这种词磨得更具体：谁递工具、谁收尾、谁记得提醒对方喝水。",
      minAge: Math.max(ia, 11),
      maxAge: Math.min(ia + 9, 21),
      weight: 4,
      tags: ["romance", "school", "warmup"],
      conditions: relationshipReadyConditions(id, {
        minFamiliarity: { [id]: 6 },
        excludedRelationshipFlags: { [id]: ["deep_duty_club_done"] },
        excludedRelationshipStatuses: { [id]: ["broken", "missed", "married"] }
      }),
      choices: [
        choice({
          text: "多承担一点，让对方轻松些。",
          effects: { stats: { happiness: 1, discipline: 1 } },
          relationshipEffects: [
            buildEffect(id, {
              affection: 8,
              trust: 12,
              familiarity: 10,
              theirInterest: 8,
              continuity: 8,
              interactions: 1,
              status: "familiar",
              addFlags: ["deep_duty_club_done", "duty_carried_extra"],
              history: "你用行动把在意说清楚了一次。"
            })
          ],
          log: "并肩干活时的好感，往往比情话更结实。"
        }),
        choice({
          text: "借机开玩笑、把气氛弄松一点。",
          effects: { stats: { social: 2, stress: -1 } },
          relationshipEffects: [
            buildEffect(id, {
              affection: 6,
              familiarity: 12,
              ambiguity: 6,
              playerInterest: 6,
              interactions: 1,
              status: "close",
              addFlags: ["deep_duty_club_done", "duty_banter"],
              setActive: true,
              history: "笑声把距离推近，也让彼此更敢多看一眼。"
            })
          ],
          log: "会开玩笑的相处，最容易长出暧昧。"
        }),
        choice({
          text: "只谈任务，不谈多余的话。",
          effects: { stats: { intelligence: 1 } },
          relationshipEffects: [
            buildEffect(id, {
              familiarity: 6,
              continuity: 4,
              interactions: 1,
              addFlags: ["deep_duty_club_done", "duty_strict_only"],
              history: "你把关系锁在效率里，暂时避开了心动带来的不确定。"
            })
          ],
          log: "克制也是一种选择，只是后面要付利息。"
        })
      ]
    });
  }

  function buildSportsMeet(def) {
    if (!hasStageTag(def, "adolescence") && !hasStageTag(def, "school") && !hasStageTag(def, "highschool")) {
      return null;
    }
    if (introAgeOf(def) > 15) {
      return null;
    }
    const id = def.id;
    const ia = introAgeOf(def);

    return event({
      id: id + "_deep_sports_meet",
      stage: stageFromAge(Math.max(ia, 12)),
      title: "运动会或球赛，把人群里的注意力推到你和" + def.name + "之间",
      text:
        "加油声、哨声和跑鞋擦过跑道的声音混在一起。你在人群里找座位、递水、替班级喊口号——而" +
        def.name +
        "恰好总出现在你最需要伸手的那一秒。比赛把心跳抬得很高，也让人更容易把脸红归咎于天气。",
      minAge: Math.max(ia, 12),
      maxAge: 19,
      weight: 3,
      tags: ["romance", "school", "youth"],
      conditions: relationshipReadyConditions(id, {
        minFamiliarity: { [id]: 8 },
        excludedRelationshipFlags: { [id]: ["deep_sports_done"] },
        excludedRelationshipStatuses: { [id]: ["broken", "missed"] }
      }),
      choices: [
        choice({
          text: "赛后递水、夸一句，把勇气留在具体动作里。",
          effects: { stats: { social: 2, happiness: 2 } },
          relationshipEffects: [
            buildEffect(id, {
              affection: 10,
              theirInterest: 10,
              playerInterest: 8,
              continuity: 8,
              interactions: 1,
              status: "mutual_crush",
              addFlags: ["deep_sports_done", "sports_cheer_moment"],
              setActive: true,
              history: "那天的汗水和掌声，把你们从“认识”推成了“会互相找的人”。"
            })
          ],
          log: "运动会把青春放大。"
        }),
        choice({
          text: "只在远处看着，把心动留在人群后面。",
          effects: { stats: { mental: 1, happiness: -1 } },
          relationshipEffects: [
            buildEffect(id, {
              playerInterest: 10,
              ambiguity: 6,
              theirInterest: 4,
              interactions: 1,
              status: "crush",
              addFlags: ["deep_sports_done", "sports_from_afar"],
              history: "你在人群后把对方看成了光，却没有走近。"
            })
          ],
          log: "有些暗恋永远停在看台。"
        })
      ]
    });
  }

  function buildNightStudy(def) {
    if (!hasStageTag(def, "highschool")) {
      return null;
    }
    const id = def.id;
    const ia = Math.max(introAgeOf(def), 16);

    return event({
      id: id + "_deep_night_study",
      stage: "highschool",
      title: "晚自习后的走廊，灯光把" + def.name + "的影子拉得很长",
      text:
        "教室里还有人埋头刷题，走廊却已经开始安静下来。你们对着一道题争了几句，又在笑声里同时意识到：这点时间原来可以不属于排名，只属于彼此。",
      minAge: ia,
      maxAge: 20,
      weight: 4,
      tags: ["romance", "highschool", "quiet"],
      conditions: relationshipReadyConditions(id, {
        minFamiliarity: { [id]: 18 },
        minTrust: { [id]: 10 },
        excludedRelationshipFlags: { [id]: ["deep_night_study_done"] },
        excludedRelationshipStatuses: { [id]: ["broken", "missed"] }
      }),
      choices: [
        choice({
          text: "把话题从题目拐到以后，轻轻试探彼此的志愿。",
          effects: { stats: { intelligence: 1, stress: 1 } },
          addFlags: ["exam_season_bond"],
          relationshipEffects: [
            buildEffect(id, {
              affection: 8,
              trust: 10,
              commitment: 8,
              continuity: 12,
              ambiguity: 8,
              interactions: 1,
              status: "ambiguous",
              addFlags: ["deep_night_study_done", "night_future_hint"],
              setActive: true,
              history: "你们在试卷和排名之外，第一次把“以后”放在同一张小声对话里。"
            })
          ],
          log: "高三的感情常常和前途绑在一起。"
        }),
        choice({
          text: "只讲题，不讲心事，把线按住。",
          effects: { stats: { discipline: 2, happiness: -1 } },
          relationshipEffects: [
            buildEffect(id, {
              familiarity: 8,
              tension: 4,
              playerInterest: 6,
              interactions: 1,
              addFlags: ["deep_night_study_done", "night_study_only"],
              history: "你把喜欢压在题海里，却也把对方的期待悬在半空。"
            })
          ],
          log: "按住不说到最后，有时会变成错过。"
        })
      ]
    });
  }

  function buildShortTrip(def) {
    const id = def.id;
    const hooks = getSceneHooks(def.appearance);
    const ia = introAgeOf(def);
    const dist = getHookSnippet(hooks.distance, "分流与现实");

    return event({
      id: id + "_deep_short_trip",
      stage: stageFromAge(Math.max(ia + 4, 18)),
      title: "短途出行：你们第一次把关系带出日常半径",
      text:
        "可能是周边城市、展览、爬山或一次临时起意的海边。离开熟悉校门后，" +
        def.name +
        "变得更像“一个人”，而不是某个场景里的角色。" +
        dist +
        "已经能在远处露头，但此刻你们仍想把今天走满。",
      minAge: Math.max(ia + 3, 17),
      maxAge: 32,
      weight: 3,
      tags: ["romance", "travel", "milestone"],
      conditions: relationshipReadyConditions(id, {
        anyRelationshipStatuses: ["ambiguous", "mutual_crush", "close", "dating", "passionate", "steady"],
        minFamiliarity: { [id]: 28 },
        minTrust: { [id]: 18 },
        excludedRelationshipFlags: { [id]: ["deep_short_trip_done"] },
        excludedRelationshipStatuses: { [id]: ["broken", "missed"] }
      }),
      choices: [
        choice({
          text: "认真规划一天，把钱花在交通和体验上。",
          effects: { stats: { happiness: 3, money: -12, stress: -1 } },
          addRomanceFlags: ["romance_memory_made"],
          relationshipEffects: [
            buildEffect(id, {
              affection: 12,
              trust: 10,
              commitment: 10,
              continuity: 14,
              interactions: 1,
              status: "passionate",
              addFlags: ["deep_short_trip_done", "trip_planned_spend"],
              setActive: true,
              history: "你们用一次出行把关系从“聊得来”推成“想一起走更远”。"
            })
          ],
          log: "花钱的不只是行程，也是对彼此的投入。"
        }),
        choice({
          text: "压低预算，靠步行、便当和免费公园把日子过满。",
          effects: { stats: { happiness: 2, discipline: 1 } },
          relationshipEffects: [
            buildEffect(id, {
              affection: 10,
              trust: 12,
              commitment: 8,
              continuity: 12,
              interactions: 1,
              status: "steady",
              addFlags: ["deep_short_trip_done", "trip_budget_tight"],
              setActive: true,
              history: "穷游并不丢人，反而让你们看见彼此在拮据里仍愿意照顾对方。"
            })
          ],
          log: "没钱也能约会，关键是愿不愿意一起扛。"
        }),
        choice({
          text: "临时取消，让计划烂在加班或家庭里。",
          effects: { stats: { stress: 2, happiness: -2 } },
          relationshipEffects: [
            buildEffect(id, {
              affection: -6,
              tension: 12,
              trust: -6,
              continuity: -4,
              interactions: 1,
              status: "cooling",
              addFlags: ["deep_short_trip_done", "trip_cancelled"],
              history: "一次没去成的出行，会在关系里留下“你是不是不够在意”的回声。"
            })
          ],
          log: "爽约的成本，往往比票价贵。"
        })
      ]
    });
  }

  function buildDateNight(def) {
    const id = def.id;
    const tone = arcTone(def);

    return event({
      id: id + "_deep_date_night",
      stage: stageFromAge(Math.max(introAgeOf(def) + 2, 18)),
      title: "交往中的日常约会：" + def.name + "把时间留给你",
      text:
        "确认关系之后，恋爱不再只靠心动撑着。你们要在作业、加班、通勤和疲惫之间，重新学习怎么把彼此放进日程。" +
        tone.date,
      minAge: Math.max(introAgeOf(def) + 1, 16),
      maxAge: 40,
      weight: 4,
      repeatable: true,
      maxVisits: 4,
      cooldownChoices: 6,
      tags: ["romance", "dating", "daily"],
      conditions: mergeConditions(
        relationshipReadyConditions(id, {
          activeRelationshipIds: [id],
          relationshipStatuses: {
            [id]: ["dating", "passionate", "steady", "reconnected", "cooling"]
          },
          minCommitment: { [id]: 34 }
        }),
        condition({ maxTension: { [id]: 78 } })
      ),
      choices: [
        choice({
          text: "订一家想去了很久的店，认真打扮、认真见面。",
          conditions: condition({ minStats: { money: 45 } }),
          effects: { stats: { happiness: 4, money: -22, social: 1 } },
          addRomanceFlags: ["romance_memory_made"],
          relationshipEffects: [
            buildEffect(id, {
              affection: 10,
              trust: 6,
              commitment: 8,
              tension: -6,
              continuity: 10,
              interactions: 1,
              status: "passionate",
              addFlags: ["date_spendy_once"],
              setActive: true,
              history: "你用一次像样约会告诉对方：你不是顺便爱我，你是专门来见我。"
            })
          ],
          log: "花钱的约会不一定更真，但有时更郑重。"
        }),
        choice({
          text: "买菜回家一起做饭，把浪漫放进锅里。",
          effects: { stats: { happiness: 3, health: 1, stress: -1 } },
          addRomanceFlags: ["romance_domestic_anchor"],
          relationshipEffects: [
            buildEffect(id, {
              affection: 12,
              trust: 12,
              commitment: 10,
              tension: -8,
              continuity: 12,
              interactions: 1,
              status: "steady",
              addFlags: ["date_home_cook"],
              setActive: true,
              history: "同居感不一定来自同居，有时来自一顿一起吃的饭。"
            })
          ],
          log: "长期关系往往从厨房开始。"
        }),
        choice({
          text: "实在太累，约会改成视频或语音将就一下。",
          effects: { stats: { stress: -1, happiness: 1 } },
          relationshipEffects: [
            buildEffect(id, {
              affection: 4,
              commitment: -4,
              tension: 6,
              continuity: 4,
              interactions: 1,
              status: "cooling",
              addFlags: ["date_low_energy_remote"],
              history: "将就并不总是错，但连续将就就会像疏远预习。"
            })
          ],
          log: "线上陪伴救急，救不了长期缺席。"
        })
      ]
    });
  }

  function buildJealousy(def) {
    const id = def.id;
    const tone = arcTone(def);

    return event({
      id: id + "_deep_jealousy",
      stage: stageFromAge(Math.max(introAgeOf(def) + 2, 16)),
      title: "吃醋：" + def.name + "第一次把酸意摆到你面前",
      text:
        "也许是社团、同事、旧同学，或某个对你格外热情的人。" +
        def.name +
        "没有立刻发作，但你会明显感觉气氛薄了一层。" +
        tone.jealous,
      minAge: Math.max(introAgeOf(def), 15),
      maxAge: 38,
      weight: 3,
      repeatable: true,
      maxVisits: 3,
      cooldownChoices: 8,
      tags: ["romance", "tension", "dating"],
      conditions: relationshipReadyConditions(id, {
        activeRelationshipIds: [id],
        relationshipStatuses: {
          [id]: ["dating", "passionate", "steady", "ambiguous", "mutual_crush", "reconnected"]
        },
        minCommitment: { [id]: 26 },
        minTheirInterest: { [id]: 30 }
      }),
      choices: [
        choice({
          text: "把边界说清楚，也给对方安全感。",
          effects: { stats: { mental: 2, happiness: 1 } },
          addRomanceFlags: ["romance_repair_attempt"],
          relationshipEffects: [
            buildEffect(id, {
              affection: 8,
              trust: 14,
              tension: -12,
              commitment: 8,
              continuity: 10,
              interactions: 1,
              status: "steady",
              addFlags: ["jealousy_talked_through"],
              setActive: true,
              history: "你没有用“你想多了”糊弄过去，而是把关系里的刺拔了出来。"
            })
          ],
          log: "吃醋是需求，不是罪名。"
        }),
        choice({
          text: "觉得被管得太紧，反问对方是不是不信任你。",
          effects: { stats: { stress: 2, happiness: -1 } },
          relationshipEffects: [
            buildEffect(id, {
              affection: -4,
              trust: -10,
              tension: 18,
              commitment: -6,
              interactions: 1,
              status: "conflict",
              addFlags: ["jealousy_escalated"],
              history: "争执里没有赢家，只有两颗更累的心。"
            })
          ],
          log: "对抗式回应会把醋变成火。"
        }),
        choice({
          text: "先哄住场面，但心里记下这笔不舒服。",
          effects: { stats: { social: 1, mental: -1 } },
          relationshipEffects: [
            buildEffect(id, {
              affection: 2,
              trust: -4,
              tension: 10,
              ambiguity: 6,
              interactions: 1,
              status: "cooling",
              addFlags: ["jealousy_swept_under"],
              history: "表面和好，并不等于真正安心。"
            })
          ],
          log: "拖延的解释，后面要连本带利还。"
        })
      ]
    });
  }

  function buildPublicOrHide(def) {
    const id = def.id;

    return event({
      id: id + "_deep_public_hide",
      stage: stageFromAge(Math.max(introAgeOf(def) + 2, 17)),
      title: "要不要公开：" + def.name + "问你，这段关系要放在什么亮度里",
      text:
        "朋友圈、同事群、家人饭局、同学聚会——每一个场景都在逼你们决定：要把彼此介绍成什么身份。公开不是炫耀，是把未来绑进社会网络；隐藏也不是羞耻，有时是保护，也可能是犹豫。",
      minAge: Math.max(introAgeOf(def) + 1, 17),
      maxAge: 36,
      weight: 3,
      tags: ["romance", "dating", "social"],
      conditions: relationshipReadyConditions(id, {
        activeRelationshipIds: [id],
        relationshipStatuses: {
          [id]: ["dating", "passionate", "steady", "reconnected"]
        },
        minCommitment: { [id]: 40 },
        excludedRelationshipFlags: { [id]: ["public_hide_resolved"] }
      }),
      choices: [
        choice({
          text: "公开，愿意把关系放进彼此的生活圈里承担目光。",
          effects: { stats: { social: 2, stress: 1, happiness: 2 } },
          addRomanceFlags: ["relationship_committed"],
          relationshipEffects: [
            buildEffect(id, {
              affection: 10,
              trust: 12,
              commitment: 14,
              continuity: 10,
              tension: -4,
              interactions: 1,
              status: "steady",
              addFlags: ["public_hide_resolved", "relationship_public"],
              setActive: true,
              history: "你们选择让关系被看见，也选择一起承担随之而来的评判与期待。"
            })
          ],
          log: "公开是把两个人绑进同一张社会时间表。"
        }),
        choice({
          text: "先低调处理，只对最信任的人说实话。",
          effects: { stats: { discipline: 1, mental: 1 } },
          relationshipEffects: [
            buildEffect(id, {
              affection: 6,
              trust: 10,
              ambiguity: 6,
              commitment: 6,
              continuity: 8,
              interactions: 1,
              status: "dating",
              addFlags: ["public_hide_resolved", "relationship_low_profile"],
              history: "你们把关系留在小圈子里保温，也留下“到底什么时候才算正式”的悬念。"
            })
          ],
          log: "低调有时是保护，有时是拖延。"
        }),
        choice({
          text: "拒绝公开，让对方觉得你不想负责。",
          effects: { stats: { happiness: -2, stress: 2 } },
          relationshipEffects: [
            buildEffect(id, {
              affection: -8,
              trust: -14,
              tension: 16,
              commitment: -12,
              interactions: 1,
              status: "conflict",
              addFlags: ["public_hide_resolved", "relationship_hidden_pain"],
              history: "你把关系藏起来，对方却开始怀疑：你是不是只把我当备选。"
            })
          ],
          log: "不愿见光的感情，很容易长成刺。"
        })
      ]
    });
  }

  function buildGaokaoCouple(def) {
    if (!hasStageTag(def, "highschool")) {
      return null;
    }
    const id = def.id;

    return event({
      id: id + "_deep_gaokao_couple",
      stage: "highschool",
      title: "高考压力下，你和" + def.name + "被同一阵风吹着",
      text:
        "排名、模考、志愿表和家长语气，把每个人都勒得更紧。你们原本用来暧昧的时间和精力，被迫拿去换分数。爱情没有消失，只是开始被要求解释：它到底是在帮你，还是在拖你。",
      minAge: 16,
      maxAge: 19,
      weight: 4,
      tags: ["romance", "gaokao", "pressure"],
      conditions: relationshipReadyConditions(id, {
        requiredFlags: ["life_path_gaokao"],
        minFamiliarity: { [id]: 20 },
        anyRelationshipStatuses: ["close", "ambiguous", "mutual_crush", "dating", "passionate", "steady"],
        excludedRelationshipStatuses: { [id]: ["broken", "missed"] },
        excludedRelationshipFlags: { [id]: ["gaokao_couple_done"] }
      }),
      choices: [
        choice({
          text: "把彼此当战友：互查知识点、互盯作息，也把情绪接住。",
          effects: { stats: { intelligence: 2, stress: 1, happiness: 1 } },
          addFlags: ["exam_season_bond"],
          relationshipEffects: [
            buildEffect(id, {
              affection: 8,
              trust: 14,
              commitment: 12,
              continuity: 14,
              tension: -4,
              interactions: 1,
              status: "steady",
              addFlags: ["gaokao_couple_done", "gaokao_partner_mode"],
              setActive: true,
              history: "你们把喜欢变成了并肩冲刺的结构，而不是互相拖累的借口。"
            })
          ],
          log: "高考情侣也可以是彼此的学习系统。"
        }),
        choice({
          text: "主动降温，约定考完再谈感情。",
          effects: { stats: { discipline: 2, happiness: -2, stress: 2 } },
          relationshipEffects: [
            buildEffect(id, {
              affection: -2,
              trust: 6,
              tension: 8,
              commitment: 4,
              continuity: 6,
              interactions: 1,
              status: "cooling",
              addFlags: ["gaokao_couple_done", "gaokao_parked_love"],
              history: "你把关系按下暂停键，也把不确定留给考后。"
            })
          ],
          log: "约定并不总兑现，但它至少给过彼此一个出口。"
        }),
        choice({
          text: "把焦虑撒在对方身上，互相埋怨浪费时间。",
          effects: { stats: { stress: 2, intelligence: -1 } },
          relationshipEffects: [
            buildEffect(id, {
              affection: -10,
              trust: -12,
              tension: 20,
              commitment: -10,
              interactions: 1,
              status: "conflict",
              addFlags: ["gaokao_couple_done", "gaokao_blame_spiral"],
              history: "压力会把最亲的人变成最近的出气口。"
            })
          ],
          log: "考试年分手，有时不是不爱，是太怕。"
        })
      ]
    });
  }

  function buildLDR(def) {
    const id = def.id;

    return event({
      id: id + "_deep_ldr_overseas",
      stage: "young_adult",
      title: "异国时差里，你和" + def.name + "重新学习“在场”",
      text:
        "视频窗口把脸压成一小块，延迟让笑话总是慢半拍。你在这边赶 due、打工、适应语言，对方在那边也有自己的泥潭。恋爱没有变假，只是变难：难在如何把“我想你”翻译成可执行的生活安排。",
      minAge: 18,
      maxAge: 35,
      weight: 4,
      tags: ["romance", "overseas", "distance"],
      conditions: relationshipReadyConditions(id, {
        requiredFlags: ["life_path_overseas"],
        activeRelationshipIds: [id],
        relationshipStatuses: {
          [id]: ["dating", "passionate", "steady", "long_distance_dating", "cooling", "ambiguous"]
        },
        minCommitment: { [id]: 28 }
      }),
      choices: [
        choice({
          text: "固定每周几次视频，把时差写进日历。",
          effects: { stats: { mental: 1, stress: 1, happiness: 2 } },
          addRomanceFlags: ["romance_distance_effort"],
          relationshipEffects: [
            buildEffect(id, {
              affection: 8,
              trust: 12,
              commitment: 10,
              continuity: 14,
              tension: -6,
              interactions: 1,
              status: "long_distance_dating",
              addFlags: ["ldr_routine_set"],
              setActive: true,
              history: "你们用很笨但很真的方式，把远距离熬成可重复的习惯。"
            })
          ],
          log: "异国恋靠的不是激情，是节律。"
        }),
        choice({
          text: "省钱省到联络越来越稀，感情靠回忆撑着。",
          effects: { stats: { money: 6, happiness: -2, stress: 2 } },
          addRomanceFlags: ["romance_distance_cost"],
          relationshipEffects: [
            buildEffect(id, {
              affection: -6,
              trust: -8,
              tension: 12,
              commitment: -8,
              continuity: -6,
              interactions: 1,
              status: "distance_cooling",
              addFlags: ["ldr_thin_contact"],
              history: "每一次“下次再说”，都在消耗当初说爱你的那份确定。"
            })
          ],
          log: "省钱有时以感情为代价。"
        }),
        choice({
          text: "坦诚聊要不要开放关系或暂停名分——把最难听的话先说出来。",
          effects: { stats: { mental: 2, stress: 3 } },
          relationshipEffects: [
            buildEffect(id, {
              affection: -4,
              ambiguity: 18,
              tension: 16,
              commitment: -6,
              interactions: 1,
              status: "triangle",
              addFlags: ["ldr_renegotiate"],
              history: "你们把潜规则摊开，关系要么更清楚，要么更碎。"
            })
          ],
          log: "重谈规则是冒险，也是诚实。"
        })
      ]
    });
  }

  function buildWorkCollision(def) {
    const id = def.id;

    return event({
      id: id + "_deep_work_collision",
      stage: "career",
      title: "工作节奏撞上车恋爱：" + def.name + "问你还要不要一起过日子",
      text:
        "加班、出差、指标和绩效把日历切得很碎。你们不再是学生那样能靠同路回家自然见面——现在要见面，得预约、得改期、得牺牲睡眠。" +
        def.name +
        "的语气里，失望已经比抱怨更安静。",
      minAge: 23,
      maxAge: 40,
      weight: 3,
      repeatable: true,
      maxVisits: 2,
      cooldownChoices: 10,
      tags: ["romance", "career", "pressure"],
      conditions: relationshipReadyConditions(id, {
        activeRelationshipIds: [id],
        relationshipStatuses: {
          [id]: ["dating", "passionate", "steady", "cooling", "conflict", "reconnected"]
        },
        minCommitment: { [id]: 36 },
        minStats: { career: 18 }
      }),
      choices: [
        choice({
          text: "调整边界，哪怕慢一点，也把关系写进固定档期。",
          effects: { stats: { happiness: 2, career: -1, stress: 1 } },
          addRomanceFlags: ["romance_work_life_tradeoff"],
          relationshipEffects: [
            buildEffect(id, {
              affection: 8,
              trust: 10,
              commitment: 8,
              tension: -10,
              continuity: 12,
              interactions: 1,
              status: "steady",
              addFlags: ["work_sched_rebalanced"],
              setActive: true,
              history: "你终于承认：事业再重要，也需要给爱情留不可侵占的块。"
            })
          ],
          log: "长期关系是排程问题，也是价值排序。"
        }),
        choice({
          text: "继续冲刺，相信对方会理解。",
          effects: { stats: { career: 2, happiness: -2, stress: 2 } },
          relationshipEffects: [
            buildEffect(id, {
              affection: -6,
              tension: 14,
              commitment: -10,
              continuity: -8,
              interactions: 1,
              status: "cooling",
              addFlags: ["work_priority_strain"],
              history: "你把理解当成默认，对方却把孤单当成答案。"
            })
          ],
          log: "理解不是无限的。"
        })
      ]
    });
  }

  function buildSickCare(def) {
    const id = def.id;

    return event({
      id: id + "_deep_sick_care",
      stage: stageFromAge(Math.max(introAgeOf(def) + 2, 16)),
      title: "生病那天，" + def.name + "要不要出现在你家门口",
      text:
        "发烧、胃痛或一场拖很久的咳嗽，把日常里的逞强剥掉。你会突然发现：有人愿意为你跑药店、煮粥、替你回消息，这种照顾比情话更狠——它逼你承认自己在被爱着。",
      minAge: Math.max(introAgeOf(def), 14),
      maxAge: 40,
      weight: 3,
      tags: ["romance", "care", "dating"],
      conditions: relationshipReadyConditions(id, {
        activeRelationshipIds: [id],
        relationshipStatuses: {
          [id]: ["dating", "passionate", "steady", "reconnected"]
        },
        minCommitment: { [id]: 32 },
        excludedRelationshipFlags: { [id]: ["sick_care_done"] }
      }),
      choices: [
        choice({
          text: "让对方来，接受被照顾。",
          effects: { stats: { health: 2, happiness: 3, mental: 2 } },
          addRomanceFlags: ["romance_care_bond"],
          relationshipEffects: [
            buildEffect(id, {
              affection: 14,
              trust: 16,
              commitment: 12,
              continuity: 14,
              tension: -8,
              interactions: 1,
              status: "steady",
              addFlags: ["sick_care_done", "care_accepted"],
              setActive: true,
              history: "生病把关系从浪漫叙事拉回生活：你愿意让对方看见你最狼狈的样子。"
            })
          ],
          log: "能示弱的关系，往往更能走远。"
        }),
        choice({
          text: "硬撑说没事，把门关紧。",
          effects: { stats: { discipline: 1, stress: 2 } },
          relationshipEffects: [
            buildEffect(id, {
              affection: -4,
              trust: -8,
              tension: 10,
              interactions: 1,
              status: "cooling",
              addFlags: ["sick_care_done", "care_refused"],
              history: "你把关心挡在门外，也把亲密挡掉了一半。"
            })
          ],
          log: "拒绝被照顾，有时是自尊，有时是疏远。"
        })
      ]
    });
  }

  function buildParentBridge(def) {
    const id = def.id;

    return event({
      id: id + "_deep_parent_bridge",
      stage: stageFromAge(Math.max(introAgeOf(def) + 3, 18)),
      title: "家庭态度插进来：" + def.name + "问你敢不敢把TA带回家说话",
      text:
        "恋爱一旦长出“见家长”四个字，就不再只是两个人的事。资源、面子、职业、户口和期待都会进场。你要决定：是先把关系护住，还是把矛盾提前摊开。",
      minAge: Math.max(introAgeOf(def) + 2, 18),
      maxAge: 34,
      weight: 3,
      tags: ["romance", "family", "dating"],
      conditions: relationshipReadyConditions(id, {
        activeRelationshipIds: [id],
        relationshipStatuses: {
          [id]: ["dating", "passionate", "steady", "reconnected"]
        },
        minCommitment: { [id]: 44 },
        excludedRelationshipFlags: { [id]: ["parent_bridge_done"] }
      }),
      choices: [
        choice({
          text: "认真安排一次见面，把尊重和边界都讲清楚。",
          effects: { stats: { stress: 2, happiness: 1, familySupport: 2 } },
          addRomanceFlags: ["romance_parent_bridge"],
          relationshipEffects: [
            buildEffect(id, {
              affection: 10,
              trust: 14,
              commitment: 16,
              continuity: 12,
              interactions: 1,
              status: "steady",
              addFlags: ["parent_bridge_done", "parents_met_planned"],
              setActive: true,
              history: "你把恋人带进家庭叙事里，也把自己推向更成年人的责任。"
            })
          ],
          log: "见家长是关系的一次升维。"
        }),
        choice({
          text: "先拖着，用“还早”挡掉追问。",
          effects: { stats: { stress: 1, happiness: -1 } },
          relationshipEffects: [
            buildEffect(id, {
              affection: 2,
              tension: 10,
              commitment: -4,
              ambiguity: 8,
              interactions: 1,
              status: "cooling",
              addFlags: ["parent_bridge_done", "parents_stalled"],
              history: "拖延换来短暂安静，却让不安在暗处长。"
            })
          ],
          log: "“还早”有时是缓冲，有时是逃避。"
        }),
        choice({
          text: "在家庭高压里硬顶，替" + def.name + "挡话。",
          conditions: condition({ someFlags: ["family_expectation_high", "control_family", "comparison_ready_home"] }),
          effects: { stats: { stress: 3, happiness: 1, familySupport: -2 } },
          relationshipEffects: [
            buildEffect(id, {
              affection: 12,
              trust: 18,
              commitment: 14,
              tension: 6,
              continuity: 14,
              interactions: 1,
              status: "steady",
              addFlags: ["parent_bridge_done", "parents_high_pressure_side"],
              setActive: true,
              history: "你在原生家庭的音量里选择了站边，也把自己推进更真实的成人关系。"
            })
          ],
          log: "挡话很贵，但有时是爱的形状。"
        })
      ]
    });
  }

  function buildChildCrossroad(def) {
    const id = def.id;

    return event({
      id: id + "_deep_child_crossroad",
      stage: "family",
      title: "孩子落地之后，你和" + def.name + "的爱被重新排版",
      text:
        "睡眠、奶粉、账单和长辈意见把生活挤满。你们会发现：不是不爱了，而是爱被拆成无数可执行事项。有人在疲惫里更靠近，有人在疲惫里更陌生。",
      minAge: 24,
      maxAge: 45,
      weight: 3,
      tags: ["romance", "family", "children"],
      conditions: mergeConditions(
        relationshipReadyConditions(id, {
          activeRelationshipIds: [id],
          relationshipStatuses: {
            [id]: ["dating", "passionate", "steady", "married", "reconnected", "conflict", "cooling"]
          },
          minCommitment: { [id]: 38 }
        }),
        condition({ minChildCount: 1 })
      ),
      choices: [
        choice({
          text: "把育儿分工谈清楚，也保留二人世界的小缝。",
          effects: { stats: { happiness: 2, stress: 1, mental: 1 } },
          addRomanceFlags: ["romance_coparent_team"],
          relationshipEffects: [
            buildEffect(id, {
              affection: 8,
              trust: 12,
              tension: -8,
              commitment: 12,
              continuity: 12,
              interactions: 1,
              status: "steady",
              addFlags: ["child_coparent_pact"],
              setActive: true,
              history: "你们用合伙人的方式继续相爱。"
            })
          ],
          log: "孩子是考验，也可能是同盟的锻造炉。"
        }),
        choice({
          text: "把所有精力给孩子，默认爱情可以等等。",
          effects: { stats: { stress: 2, happiness: -1 } },
          addRomanceFlags: ["romance_neglected_for_child"],
          relationshipEffects: [
            buildEffect(id, {
              affection: -4,
              tension: 12,
              commitment: -6,
              continuity: -6,
              interactions: 1,
              status: "cooling",
              addFlags: ["child_all_in_baby"],
              history: "你把“等等”说太多次，关系就会真的停在那里。"
            })
          ],
          log: "只爱孩子不爱彼此，婚姻会先空。"
        })
      ]
    });
  }

  function buildGiftFromInventory(def) {
    const id = def.id;

    return event({
      id: id + "_deep_gift_inventory",
      stage: stageFromAge(Math.max(introAgeOf(def) + 2, 16)),
      title: "你掏出准备好的礼物：" + def.name + "的眼睛亮了一下",
      text:
        "礼物不一定贵，但它证明你在忙碌里仍愿意为对方留出一截心思。" +
        def.name +
        "接过东西的那一秒，你们的关系从“聊得来”变成了“被记得”。",
      minAge: Math.max(introAgeOf(def), 15),
      maxAge: 40,
      weight: 2,
      repeatable: true,
      maxVisits: 3,
      cooldownChoices: 12,
      tags: ["romance", "gift", "shop"],
      conditions: relationshipReadyConditions(id, {
        activeRelationshipIds: [id],
        relationshipStatuses: {
          [id]: ["ambiguous", "mutual_crush", "close", "dating", "passionate", "steady", "reconnected"]
        },
        minFamiliarity: { [id]: 22 }
      }),
      choices: [
        choice({
          text: "送出零食礼盒，把甜留在日常里。",
          conditions: condition({ inventoryMin: { gift_snack_hamper: 1 } }),
          effects: { stats: { happiness: 2, social: 1 } },
          customAction: "give_relationship_gift",
          customPayload: { itemId: "gift_snack_hamper" },
          addRomanceFlags: ["romance_gift_moment"],
          log: "可送人礼物在商店购入后会进入物品栏；送礼数值由 life-systems 礼物规则结算。"
        }),
        choice({
          text: "送出精装文集，像把一段共读的愿望递过去。",
          conditions: condition({ inventoryMin: { gift_book_literature: 1 } }),
          effects: { stats: { happiness: 2, intelligence: 1 } },
          customAction: "give_relationship_gift",
          customPayload: { itemId: "gift_book_literature" },
          addRomanceFlags: ["romance_gift_moment"],
          log: "礼物与商店、物品栏联动。"
        }),
        choice({
          text: "送出项链，郑重得像一句没说出口的承诺。",
          conditions: condition({ inventoryMin: { gift_necklace_modest: 1 } }),
          effects: { stats: { happiness: 3, stress: 1 } },
          customAction: "give_relationship_gift",
          customPayload: { itemId: "gift_necklace_modest" },
          addRomanceFlags: ["romance_gift_moment", "romance_pledge_hint"],
          log: "贵重礼物会改变关系温度；承诺感由礼物规则与后续事件共同塑造。"
        })
      ]
    });
  }

  function buildRepairSoft(def) {
    const id = def.id;
    const tone = arcTone(def);

    return event({
      id: id + "_deep_repair_soft",
      stage: stageFromAge(Math.max(introAgeOf(def) + 2, 17)),
      title: "吵过之后：" + def.name + "还愿不愿意把语气放软",
      text:
        "冷战、已读不回、嘴硬和委屈堆在一起。" +
        tone.repair +
        "你们都知道，再拖下去就不是情绪问题，而是习惯问题。",
      minAge: Math.max(introAgeOf(def) + 1, 16),
      maxAge: 38,
      weight: 3,
      repeatable: true,
      maxVisits: 2,
      cooldownChoices: 8,
      tags: ["romance", "repair", "conflict"],
      conditions: relationshipReadyConditions(id, {
        activeRelationshipIds: [id],
        relationshipStatuses: {
          [id]: ["cooling", "conflict", "estranged"]
        },
        minCommitment: { [id]: 24 }
      }),
      choices: [
        choice({
          text: "先认错一半：不为输赢，为关系留出口。",
          effects: { stats: { mental: 2, happiness: 1 } },
          addRomanceFlags: ["relationship_rebuilt"],
          relationshipEffects: [
            buildEffect(id, {
              affection: 8,
              trust: 12,
              tension: -16,
              commitment: 8,
              continuity: 10,
              interactions: 1,
              status: "reconnected",
              addFlags: ["soft_apology_bridge"],
              setActive: true,
              history: "你们终于把“谁更对”放下，换成“还要不要一起”。"
            })
          ],
          log: "修复从放下输赢开始。"
        }),
        choice({
          text: "继续冷着，等对方先低头。",
          effects: { stats: { discipline: 1, stress: 2 } },
          relationshipEffects: [
            buildEffect(id, {
              affection: -8,
              trust: -10,
              tension: 10,
              commitment: -12,
              continuity: -8,
              interactions: 1,
              status: "estranged",
              addFlags: ["cold_stalemate"],
              clearActive: true,
              history: "僵持会把爱磨成礼貌，再把礼貌磨成陌生。"
            })
          ],
          log: "冷战赢不了关系。"
        })
      ]
    });
  }

  function buildFuturePlanning(def) {
    const id = def.id;

    return event({
      id: id + "_deep_future_plan",
      stage: stageFromAge(Math.max(introAgeOf(def) + 4, 20)),
      title: "关于以后：" + def.name + "问你愿不愿意把TA写进五年计划",
      text:
        "城市、行业、婚育、房子和是否出国，每一个词都像把未来放到天平上。你们不是在找标准答案，而是在看：两个人的答案能不能叠到同一张纸上。",
      minAge: 20,
      maxAge: 36,
      weight: 3,
      tags: ["romance", "future", "dating"],
      conditions: relationshipReadyConditions(id, {
        activeRelationshipIds: [id],
        relationshipStatuses: {
          [id]: ["dating", "passionate", "steady", "reconnected"]
        },
        minCommitment: { [id]: 52 },
        excludedRelationshipFlags: { [id]: ["future_plan_done"] }
      }),
      choices: [
        choice({
          text: "认真对齐：哪里生活、什么时候见家长、要不要孩子。",
          effects: { stats: { stress: 2, happiness: 2, discipline: 1 } },
          addRomanceFlags: ["relationship_committed", "romance_future_aligned"],
          relationshipEffects: [
            buildEffect(id, {
              affection: 10,
              trust: 16,
              commitment: 18,
              continuity: 16,
              tension: -6,
              interactions: 1,
              status: "steady",
              addFlags: ["future_plan_done", "future_aligned_serious"],
              setActive: true,
              history: "你们把模糊的爱推进到可讨论的未来里。"
            })
          ],
          log: "对齐未来是成人恋爱的分水岭。"
        }),
        choice({
          text: "说“走一步看一步”，把决定留给运气。",
          effects: { stats: { happiness: 1, stress: 1 } },
          addRomanceFlags: ["romance_held_back"],
          relationshipEffects: [
            buildEffect(id, {
              affection: 4,
              ambiguity: 10,
              commitment: -6,
              tension: 8,
              interactions: 1,
              status: "dating",
              addFlags: ["future_plan_done", "future_vague"],
              history: "你把不确定留给了以后，对方却可能把不确定读成不够认真。"
            })
          ],
          log: "模糊有时是温柔，有时是拖延。"
        })
      ]
    });
  }

  function chainForCharacter(def) {
    if (!def || !def.id || skipDeepRomanceChain(def)) {
      return [];
    }
    return [
      buildPeerTease(def),
      buildWalkHome(def),
      buildDutyOrClub(def),
      buildSportsMeet(def),
      buildNightStudy(def),
      buildShortTrip(def),
      buildDateNight(def),
      buildJealousy(def),
      buildPublicOrHide(def),
      buildGaokaoCouple(def),
      buildLDR(def),
      buildWorkCollision(def),
      buildSickCare(def),
      buildParentBridge(def),
      buildChildCrossroad(def),
      buildGiftFromInventory(def),
      buildRepairSoft(def),
      buildFuturePlanning(def)
    ].filter(Boolean);
  }

  function globalRomanceEvents() {
    return [
      event({
        id: "global_romance_social_capital",
        stage: "young_adult",
        title: "恋爱开始改变你的社交与自我形象",
        text:
          "当你认真喜欢一个人，你的时间、话题和朋友圈都会悄悄改道。有人觉得你更温柔，也有人觉得你更难约。感情从来不只发生在两个人之间，它也会重塑你在群体里的位置。",
        minAge: 16,
        maxAge: 32,
        weight: 3,
        repeatable: true,
        maxVisits: 2,
        cooldownChoices: 12,
        tags: ["romance", "social", "reflection"],
        conditions: condition({
          anyRelationshipStatuses: ["dating", "passionate", "steady", "ambiguous", "mutual_crush"]
        }),
        choices: [
          choice({
            text: "把更多社交让给恋人，也接受自己变“重色轻友”一点。",
            effects: { stats: { happiness: 2, social: -2 } },
            addRomanceFlags: ["romance_social_rebalance"],
            log: "恋爱会重新分配你的注意力。"
          }),
          choice({
            text: "刻意保留朋友与独处，不让关系吞掉全部生活。",
            effects: { stats: { social: 2, mental: 1, happiness: 1 } },
            addFlags: ["boundaries_kept"],
            log: "边界感有时是长期关系的保险丝。"
          })
        ]
      }),
      event({
        id: "global_romance_study_tradeoff",
        stage: "college",
        title: "课业与恋爱抢时间",
        text:
          "论文、考试、实习和社团都在伸手要你的小时数。恋爱不是敌人，但它确实会逼你做交换：今晚是陪TA，还是把进度往前推一点？",
        minAge: 18,
        maxAge: 26,
        weight: 3,
        tags: ["romance", "college", "study"],
        conditions: condition({
          activeRelationshipStatuses: ["dating", "passionate", "steady"],
          activeRelationshipMinCommitment: 28,
          minStats: { intelligence: 30 }
        }),
        choices: [
          choice({
            text: "把学习排前，约定固定陪伴时间。",
            effects: { stats: { intelligence: 2, happiness: 1, stress: 1 } },
            relationshipEffects: [
              buildEffect("$active", {
                trust: 8,
                tension: 4,
                commitment: 6,
                continuity: 8,
                interactions: 1,
                addFlags: ["study_pact_made"],
                history: "你们用规则把恋爱从学业里救出来，也救进彼此日程里。"
              })
            ],
            log: "学业与恋爱可以共存，但需要谈判。"
          }),
          choice({
            text: "陪恋人熬夜聊天，第二天用咖啡硬顶。",
            effects: { stats: { happiness: 2, health: -2, intelligence: -1 } },
            relationshipEffects: [
              buildEffect("$active", {
                affection: 8,
                commitment: -4,
                tension: 6,
                interactions: 1,
                addFlags: ["study_slip_for_love"],
                history: "甜蜜很贵，有时贵在下一天的效率里。"
              })
            ],
            log: "熬夜情话有利息。"
          })
        ]
      })
    ];
  }

  const definitions = Array.isArray(window.LIFE_RELATIONSHIPS) ? window.LIFE_RELATIONSHIPS : [];
  const deepEvents = definitions.flatMap(chainForCharacter);
  const globalE = globalRomanceEvents();

  window.LIFE_ROMANCE_DEEP_META = {
    version: 1,
    characterEventSuffixes: [
      "_deep_peer_tease",
      "_deep_walk_home",
      "_deep_duty_club",
      "_deep_sports_meet",
      "_deep_night_study",
      "_deep_short_trip",
      "_deep_date_night",
      "_deep_jealousy",
      "_deep_public_hide",
      "_deep_gaokao_couple",
      "_deep_ldr_overseas",
      "_deep_work_collision",
      "_deep_sick_care",
      "_deep_parent_bridge",
      "_deep_child_crossroad",
      "_deep_gift_inventory",
      "_deep_repair_soft",
      "_deep_future_plan"
    ],
    globalEventIds: globalE.map((e) => e.id)
  };

  window.LIFE_EXTRA_EVENTS = [
    ...(Array.isArray(window.LIFE_EXTRA_EVENTS) ? window.LIFE_EXTRA_EVENTS : []),
    ...deepEvents,
    ...globalE
  ];
})();

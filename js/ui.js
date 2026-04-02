(function () {
  "use strict";

  const engine = window.LifeGameEngine;
  const stateApi = window.LifeState;
  const relationshipArcMap = new Map(
    (Array.isArray(window.LIFE_RELATIONSHIP_ARCS) ? window.LIFE_RELATIONSHIP_ARCS : []).map((arc) => [arc.characterId, arc])
  );

  const elements = {};

  function cacheElements() {
    elements.ageValue = document.getElementById("age-value");
    elements.stageValue = document.getElementById("stage-value");
    elements.genderValue = document.getElementById("gender-value");
    elements.eventTitle = document.getElementById("event-title");
    elements.storyText = document.getElementById("story-text");
    elements.optionsContainer = document.getElementById("options-container");
    elements.statsContainer = document.getElementById("stats-container");
    elements.familyBackgroundContainer = document.getElementById("family-background-container");
    elements.routeContainer = document.getElementById("route-container");
    elements.relationshipsContainer = document.getElementById("relationships-container");
    elements.historyContainer = document.getElementById("history-container");
    elements.storySection = document.getElementById("story-section");
    elements.restartButton = document.getElementById("restart-btn");
  }

  function createParagraphs(container, text) {
    container.innerHTML = "";

    const paragraphs = engine.formatText(text)
      .split(/\n\s*\n/)
      .filter(Boolean);

    paragraphs.forEach((paragraph) => {
      const node = document.createElement("p");
      node.textContent = paragraph;
      container.appendChild(node);
    });
  }

  function appendInsightSection(container, titleText, items, className) {
    if (!Array.isArray(items) || !items.length) {
      return;
    }

    const section = document.createElement("section");
    section.className = className;

    const title = document.createElement("strong");
    title.className = className + "-title";
    title.textContent = titleText;
    section.appendChild(title);

    const list = document.createElement("ul");
    list.className = className + "-list";

    items.forEach((item) => {
      const row = document.createElement("li");
      row.textContent = item;
      list.appendChild(row);
    });

    section.appendChild(list);
    container.appendChild(section);
  }

  function renderEndingAnalysis(container, analysis) {
    if (!analysis) {
      return;
    }

    const wrapper = document.createElement("section");
    wrapper.className = "ending-analysis";

    const title = document.createElement("strong");
    title.className = "ending-analysis-title";
    title.textContent = "为什么会走到这里";
    wrapper.appendChild(title);

    const weight = document.createElement("p");
    weight.className = "ending-analysis-weight";
    weight.textContent = "基础权重 " + analysis.baseWeight + "，最终命中权重 " + analysis.totalWeight;
    wrapper.appendChild(weight);

    if (analysis.baseReasons && analysis.baseReasons.length) {
      const baseList = document.createElement("ul");
      baseList.className = "ending-analysis-list";
      analysis.baseReasons.forEach((reason) => {
        const item = document.createElement("li");
        item.textContent = reason;
        baseList.appendChild(item);
      });
      wrapper.appendChild(baseList);
    }

    if (analysis.matchedModifiers && analysis.matchedModifiers.length) {
      appendInsightSection(wrapper, "额外加权来源", analysis.matchedModifiers, "ending-bonus");
    }

    container.appendChild(wrapper);
  }

  function getGenderLabel(gender) {
    if (gender === "male") {
      return "男";
    }

    if (gender === "female") {
      return "女";
    }

    return "";
  }

  function getRelationshipStageLabel(relationship) {
    const stage = relationship && relationship.relationshipStage ? relationship.relationshipStage : relationship.status;
    return stateApi.RELATIONSHIP_STATUS_LABELS[stage] || stage || "关系未定义";
  }

  function getSharedHistoryLabels(relationship, arcMeta) {
    const historyIds = Array.isArray(relationship && relationship.sharedHistory) ? relationship.sharedHistory.slice(-4).reverse() : [];
    const labelMap = arcMeta && arcMeta.historyLabels && typeof arcMeta.historyLabels === "object" ? arcMeta.historyLabels : {};

    return historyIds.map((historyId) => labelMap[historyId] || historyId);
  }

  function renderStats(state) {
    elements.statsContainer.innerHTML = "";

    stateApi.STAT_KEYS.forEach((key) => {
      const value = state.stats[key];
      const row = document.createElement("div");
      row.className = "stat-card";

      const label = document.createElement("div");
      label.className = "stat-label";
      label.textContent = stateApi.STAT_LABELS[key];

      const bar = document.createElement("div");
      bar.className = "stat-bar";

      const fill = document.createElement("div");
      fill.className = "stat-fill";
      fill.style.width = Math.max(0, Math.min(100, value)) + "%";
      bar.appendChild(fill);

      const number = document.createElement("div");
      number.className = "stat-value";
      number.textContent = String(value);

      row.appendChild(label);
      row.appendChild(bar);
      row.appendChild(number);
      elements.statsContainer.appendChild(row);
    });
  }

  function renderFamilyBackground(state) {
    elements.familyBackgroundContainer.innerHTML = "";

    if (!state.familyBackground) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "正式开始前，这里会显示你抽到的家庭背景。";
      elements.familyBackgroundContainer.appendChild(empty);
      return;
    }

    const card = document.createElement("article");
    card.className = "background-card";

    const title = document.createElement("strong");
    title.className = "background-title";
    title.textContent = state.familyBackground.name;

    const summary = document.createElement("p");
    summary.className = "background-summary";
    summary.textContent = state.familyBackground.summary || "这段家庭背景会持续影响你的人生前期。";

    card.appendChild(title);
    card.appendChild(summary);

    const dimensions = state.familyBackground.dimensions || {};
    if (Object.keys(dimensions).length) {
      const list = document.createElement("div");
      list.className = "background-dimensions";

      Object.entries(dimensions).forEach(([key, value]) => {
        const item = document.createElement("span");
        item.className = "background-dimension";
        item.textContent = key + "：" + value;
        list.appendChild(item);
      });

      card.appendChild(list);
    }

    if (Array.isArray(state.familyBackground.details) && state.familyBackground.details.length) {
      const detailList = document.createElement("ul");
      detailList.className = "background-details";

      state.familyBackground.details.forEach((detail) => {
        const item = document.createElement("li");
        item.textContent = detail;
        detailList.appendChild(item);
      });

      card.appendChild(detailList);
    }

    elements.familyBackgroundContainer.appendChild(card);
  }

  function renderRoutes(state) {
    elements.routeContainer.innerHTML = "";

    const routeItems = [
      {
        label: "升学路线",
        route: state.educationRoute,
        emptyText: "高考或转折节点后，这里会记录你选中的大学 / 去向路线。"
      },
      {
        label: "职业路线",
        route: state.careerRoute,
        emptyText: "进入社会后，这里会记录你选中的工作起步路线。"
      }
    ];

    routeItems.forEach((item) => {
      const card = document.createElement("article");
      card.className = "route-card";

      const label = document.createElement("strong");
      label.className = "route-label";
      label.textContent = item.label;
      card.appendChild(label);

      if (!item.route) {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = item.emptyText;
        card.appendChild(empty);
        elements.routeContainer.appendChild(card);
        return;
      }

      const title = document.createElement("p");
      title.className = "route-title";
      title.textContent = item.route.name;
      card.appendChild(title);

      if (item.route.summary) {
        const summary = document.createElement("p");
        summary.className = "route-summary";
        summary.textContent = item.route.summary;
        card.appendChild(summary);
      }

      if (Array.isArray(item.route.details) && item.route.details.length) {
        const list = document.createElement("ul");
        list.className = "route-details";

        item.route.details.forEach((detail) => {
          const detailItem = document.createElement("li");
          detailItem.textContent = detail;
          list.appendChild(detailItem);
        });

        card.appendChild(list);
      }

      elements.routeContainer.appendChild(card);
    });

    if (state.gaokao && typeof state.gaokao.score === "number") {
      const card = document.createElement("article");
      card.className = "route-card";

      const label = document.createElement("strong");
      label.className = "route-label";
      label.textContent = "高考结算";
      card.appendChild(label);

      const title = document.createElement("p");
      title.className = "route-title";
      title.textContent = (state.gaokao.regionName || "地区未定") + " · " + state.gaokao.score + " 分";
      card.appendChild(title);

      const summary = document.createElement("p");
      summary.className = "route-summary";
      summary.textContent =
        (state.gaokao.performanceLabel || "发挥未定") + "，当前落在“" + (state.gaokao.tierLabel || "区间未定") + "”。";
      card.appendChild(summary);

      const details = document.createElement("ul");
      details.className = "route-details";
      [
        "基础实力约 " + (state.gaokao.baseScore || 0) + " 分",
        state.gaokao.destinationLabel ? "当前去向池：" + state.gaokao.destinationLabel : "",
        state.gaokao.performanceNarrative || ""
      ]
        .filter(Boolean)
        .forEach((detail) => {
          const item = document.createElement("li");
          item.textContent = detail;
          details.appendChild(item);
        });
      card.appendChild(details);

      elements.routeContainer.appendChild(card);
    }

    if (state.overseas && state.overseas.active) {
      const card = document.createElement("article");
      card.className = "route-card";

      const label = document.createElement("strong");
      label.className = "route-label";
      label.textContent = "海外生活";
      card.appendChild(label);

      const title = document.createElement("p");
      title.className = "route-title";
      title.textContent = (state.overseas.routeName || "海外路线") + " · " + (state.overseas.destination || "海外城市");
      card.appendChild(title);

      const summary = document.createElement("p");
      summary.className = "route-summary";
      summary.textContent =
        (state.overseas.supportLevel || "支持方式未定") +
        "，语言压力 " +
        (state.overseas.languagePressure || 0) +
        "，孤独感 " +
        (state.overseas.loneliness || 0) +
        "，经济压力 " +
        (state.overseas.financePressure || 0) +
        "。";
      card.appendChild(summary);

      const details = document.createElement("ul");
      details.className = "route-details";
      [
        state.overseas.domesticConnectionIds && state.overseas.domesticConnectionIds.length
          ? "仍在维系的国内关系：" +
            state.overseas.domesticConnectionIds
              .map((id) => (state.relationships && state.relationships[id] ? state.relationships[id].name : id))
              .join("、")
          : "",
        state.overseas.newConnectionIds && state.overseas.newConnectionIds.length
          ? "海外新关系对象：" +
            state.overseas.newConnectionIds
              .map((id) => (state.relationships && state.relationships[id] ? state.relationships[id].name : id))
              .join("、")
          : "",
        state.overseas.doubleTrack ? "当前存在双线关系拉扯，暴露风险更高。" : ""
      ]
        .filter(Boolean)
        .forEach((detail) => {
          const item = document.createElement("li");
          item.textContent = detail;
          details.appendChild(item);
        });
      if (details.childNodes.length) {
        card.appendChild(details);
      }

      elements.routeContainer.appendChild(card);
    }
  }

  function renderHistory(state) {
    elements.historyContainer.innerHTML = "";

    if (!state.history.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "这里会记录你一路做出的关键选择。";
      elements.historyContainer.appendChild(empty);
      return;
    }

    state.history.forEach((item) => {
      const entry = document.createElement("article");
      entry.className = "history-item";

      const age = document.createElement("span");
      age.className = "history-age";
      age.textContent = item.age + " 岁";

      const text = document.createElement("p");
      text.className = "history-text";
      text.textContent = engine.formatText(item.text);

      entry.appendChild(age);
      entry.appendChild(text);
      elements.historyContainer.appendChild(entry);
    });
  }

  function renderRelationships(state) {
    elements.relationshipsContainer.innerHTML = "";

    const relationships = Object.values(state.relationships || {})
      .filter((relationship) => relationship.met || relationship.affection > 0 || relationship.continuity > 0)
      .sort((left, right) => {
        const leftScore = (left.affection || 0) + (left.continuity || 0) * 0.4 + (left.commitment || 0) * 0.2;
        const rightScore = (right.affection || 0) + (right.continuity || 0) * 0.4 + (right.commitment || 0) * 0.2;
        return rightScore - leftScore;
      });

    if (!relationships.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "这里会追踪你在意的人、关系状态和好感度变化。";
      elements.relationshipsContainer.appendChild(empty);
      return;
    }

    relationships.forEach((relationship) => {
      const card = document.createElement("article");
      card.className = "relationship-card";

      const header = document.createElement("div");
      header.className = "relationship-header";

      const nameRow = document.createElement("div");
      nameRow.className = "relationship-name-row";

      const name = document.createElement("strong");
      name.textContent = relationship.name;

      nameRow.appendChild(name);

      if (relationship.gender) {
        const gender = document.createElement("span");
        gender.className = "relationship-gender";
        gender.textContent = getGenderLabel(relationship.gender);
        nameRow.appendChild(gender);
      }

      const status = document.createElement("span");
      status.className = "relationship-status";
      status.textContent = getRelationshipStageLabel(relationship);

      header.appendChild(nameRow);
      header.appendChild(status);

      const identity = document.createElement("p");
      identity.className = "relationship-identity";
      identity.textContent =
        (relationship.gender ? getGenderLabel(relationship.gender) + "生 · " : "") +
        (relationship.identity || "你们的关系还在慢慢形成。");

      const traits = document.createElement("div");
      traits.className = "relationship-traits";
      const displayTags = [...(relationship.roleTags || []), ...(relationship.traitTags || [])];
      displayTags.forEach((tag) => {
        const badge = document.createElement("span");
        badge.className = "relationship-tag";
        badge.textContent = tag;
        traits.appendChild(badge);
      });

      const meter = document.createElement("div");
      meter.className = "relationship-meter";

      const fill = document.createElement("div");
      fill.className = "relationship-meter-fill";
      fill.style.width = Math.max(0, Math.min(100, relationship.affection)) + "%";
      meter.appendChild(fill);

      const affection = document.createElement("div");
      affection.className = "relationship-affection";
      affection.textContent = "好感度 " + relationship.affection;

      const metrics = document.createElement("div");
      metrics.className = "relationship-metrics";

      [
        ["熟悉", relationship.familiarity || 0],
        ["信任", relationship.trust || 0],
        ["暧昧", relationship.ambiguity || 0],
        ["我方心动", relationship.playerInterest || 0],
        ["对方心动", relationship.theirInterest || 0],
        ["张力", relationship.tension || 0],
        ["承诺", relationship.commitment || 0],
        ["连续性", relationship.continuity || 0]
      ].forEach(([labelText, value]) => {
        const metric = document.createElement("span");
        metric.className = "relationship-metric";
        metric.textContent = labelText + " " + value;
        metrics.appendChild(metric);
      });

      const profile = document.createElement("p");
      profile.className = "relationship-profile";
      profile.textContent =
        relationship.romanceProfile && relationship.romanceProfile.futureFocus
          ? "关系倾向：" + relationship.romanceProfile.futureFocus
          : "关系倾向：这段关系还在慢慢显形。";

      const arcMeta = relationshipArcMap.get(relationship.id);
      let arcSummary = null;
      if (arcMeta) {
        const arcNode = document.createElement("p");
        arcNode.className = "relationship-arc-summary";
        arcNode.textContent = "专属剧情线：" + arcMeta.title + "。 " + arcMeta.summary;
        arcSummary = arcNode;
      }

      const sharedHistoryLabels = getSharedHistoryLabels(relationship, arcMeta);
      let sharedHistoryNode = null;
      if (sharedHistoryLabels.length) {
        const wrapper = document.createElement("div");
        wrapper.className = "relationship-shared-history";

        sharedHistoryLabels.forEach((labelText) => {
          const item = document.createElement("span");
          item.className = "relationship-shared-item";
          item.textContent = labelText;
          wrapper.appendChild(item);
        });

        sharedHistoryNode = wrapper;
      }

      card.appendChild(header);
      card.appendChild(identity);
      if (displayTags.length) {
        card.appendChild(traits);
      }
      card.appendChild(meter);
      card.appendChild(affection);
      card.appendChild(metrics);
      card.appendChild(profile);
      if (arcSummary) {
        card.appendChild(arcSummary);
      }
      if (sharedHistoryNode) {
        card.appendChild(sharedHistoryNode);
      }

      if (relationship.history && relationship.history.length) {
        const latestHistory = document.createElement("p");
        latestHistory.className = "relationship-history";
        latestHistory.textContent = engine.formatText(relationship.history[0].text);
        card.appendChild(latestHistory);
      }

      if (relationship.id === state.activeRelationshipId) {
        const current = document.createElement("div");
        current.className = "relationship-active";
        current.textContent = "当前主要关系";
        card.appendChild(current);
      } else {
        const switchButton = document.createElement("button");
        switchButton.type = "button";
        switchButton.className = "relationship-switch-button";
        switchButton.textContent = "改为当前关注对象";
        switchButton.addEventListener("click", function () {
          engine.setActiveRelationship(relationship.id);
          render();
        });
        card.appendChild(switchButton);
      }

      elements.relationshipsContainer.appendChild(card);
    });
  }

  function addHint(hints, text) {
    if (!text || hints.includes(text)) {
      return;
    }

    hints.push(text);
  }

  function getOptionHints(option, state) {
    const hints = [];
    const stats = option && option.effects && option.effects.stats ? option.effects.stats : {};
    const relationshipEffects = Array.isArray(option.relationshipEffects) ? option.relationshipEffects : [];
    const activeRelationship =
      state && state.activeRelationshipId && state.relationships
        ? state.relationships[state.activeRelationshipId] || null
        : null;

    if ((stats.career || 0) + (stats.intelligence || 0) >= 4) {
      addHint(hints, "偏成长 / 事业");
    } else if ((stats.career || 0) > 0 || (stats.intelligence || 0) > 0) {
      addHint(hints, "成长推进");
    }

    if ((stats.money || 0) >= 3) {
      addHint(hints, "财富提升");
    }

    if ((stats.stress || 0) >= 3) {
      addHint(hints, "压力上升");
    } else if ((stats.stress || 0) <= -2) {
      addHint(hints, "压力缓解");
    }

    if ((stats.health || 0) + (stats.mental || 0) + (stats.happiness || 0) >= 4) {
      addHint(hints, "状态回升");
    } else if ((stats.health || 0) + (stats.mental || 0) + (stats.happiness || 0) <= -4) {
      addHint(hints, "身心消耗");
    }

    if ((stats.social || 0) >= 3) {
      addHint(hints, "社交推进");
    }

    if (Array.isArray(option.addTags)) {
      if (option.addTags.includes("stability")) {
        addHint(hints, "更偏稳定");
      }
      if (option.addTags.includes("family")) {
        addHint(hints, "更偏家庭");
      }
      if (option.addTags.includes("ambition")) {
        addHint(hints, "更偏野心");
      }
      if (option.addTags.includes("risk")) {
        addHint(hints, "风险更高");
      }
      if (option.addTags.includes("selfhood")) {
        addHint(hints, "更偏自我探索");
      }
      if (option.addTags.includes("craft")) {
        addHint(hints, "创作投入");
      }
    }

    if (option.setEducationRoute) {
      addHint(hints, "确定升学路线");
    }

    if (option.setCareerRoute) {
      addHint(hints, "确定职业路线");
    }

    if (option.customAction === "simulate_gaokao") {
      addHint(hints, "结算高考分数");
    }

    if (option.customAction === "resolve_gaokao_destination") {
      addHint(hints, "按区间结算去向");
    }

    if (option.customAction === "start_overseas_route") {
      addHint(hints, "开启海外路线");
    }

    if (option.customAction === "take_non_gaokao_route") {
      addHint(hints, "确定不高考去向");
    }

    if (
      relationshipEffects.some((effect) =>
        (effect.affection || 0) > 0 ||
        (effect.familiarity || 0) > 0 ||
        (effect.trust || 0) > 0 ||
        (effect.playerInterest || 0) > 0 ||
        (effect.theirInterest || 0) > 0 ||
        (effect.commitment || 0) > 0 ||
        (effect.continuity || 0) > 0 ||
        effect.setActive
      )
    ) {
      addHint(hints, activeRelationship ? "推进当前关系" : "关系升温");
    }

    if (
      option.clearActiveRelationship ||
      relationshipEffects.some((effect) =>
        (effect.affection || 0) < 0 ||
        (effect.trust || 0) < 0 ||
        (effect.commitment || 0) < 0 ||
        (effect.tension || 0) > 0 ||
        effect.clearActive
      )
    ) {
      addHint(hints, activeRelationship ? "当前关系更易拉扯" : "关系拉扯");
    }

    return hints.slice(0, 4);
  }

  function renderOptions(event, state) {
    elements.optionsContainer.innerHTML = "";

    const visibleOptions = engine.getVisibleOptions(event);

    visibleOptions.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option-button";

      const content = document.createElement("div");
      content.className = "option-button-content";

      const text = document.createElement("span");
      text.className = "option-main-text";
      text.textContent = engine.formatOptionText(option.text);
      content.appendChild(text);

      const hints = getOptionHints(option, state);
      if (hints.length) {
        const hintRow = document.createElement("div");
        hintRow.className = "option-hints";

        hints.forEach((hint) => {
          const badge = document.createElement("span");
          badge.className = "option-hint";
          badge.textContent = hint;
          hintRow.appendChild(badge);
        });

        content.appendChild(hintRow);
      }

      button.appendChild(content);
      button.addEventListener("click", function () {
        engine.chooseOption(option.index);
        render();
      });

      elements.optionsContainer.appendChild(button);
    });

    if (!visibleOptions.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state danger-text";
      empty.textContent = "当前事件没有可用选项，请检查事件数据配置。";
      elements.optionsContainer.appendChild(empty);
    }
  }

  function renderNamingScreen() {
    elements.storySection.classList.remove("ending-card");
    elements.stageValue.textContent = "未开始";
    elements.eventTitle.textContent = "从名字开始";
    createParagraphs(
      elements.storyText,
      "你刚刚出生，这一生还没有真正展开。\n\n先为自己取一个名字，并选择这一局的性别。然后抽取家庭背景，从 0 岁开始经历属于你的人生。"
    );

    elements.optionsContainer.innerHTML = "";

    const form = document.createElement("form");
    form.className = "name-form";

    const input = document.createElement("input");
    input.className = "name-input";
    input.type = "text";
    input.maxLength = 12;
    input.placeholder = "请输入名字";
    input.autocomplete = "off";
    input.required = true;

    const genderFieldset = document.createElement("fieldset");
    genderFieldset.className = "setup-fieldset";

    const genderLegend = document.createElement("legend");
    genderLegend.className = "setup-legend";
    genderLegend.textContent = "选择这一局的性别";

    const genderGroup = document.createElement("div");
    genderGroup.className = "setup-radio-group";

    [
      { value: "male", label: "男孩" },
      { value: "female", label: "女孩" }
    ].forEach(function (item, index) {
      const optionLabel = document.createElement("label");
      optionLabel.className = "setup-radio-option";

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "player-gender";
      radio.value = item.value;
      radio.required = index === 0;

      const text = document.createElement("span");
      text.textContent = item.label;

      optionLabel.appendChild(radio);
      optionLabel.appendChild(text);
      genderGroup.appendChild(optionLabel);
    });

    genderFieldset.appendChild(genderLegend);
    genderFieldset.appendChild(genderGroup);

    const button = document.createElement("button");
    button.type = "submit";
    button.className = "option-button";
    button.textContent = "带着这个名字开始人生";

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const selectedGender = form.querySelector('input[name="player-gender"]:checked');
      if (!selectedGender) {
        return;
      }

      engine.startGame(input.value, selectedGender.value);
      render();
    });

    form.appendChild(input);
    form.appendChild(genderFieldset);
    form.appendChild(button);
    elements.optionsContainer.appendChild(form);

    requestAnimationFrame(function () {
      input.focus();
    });
  }

  function renderStory(state, event) {
    if (!state.gameStarted) {
      renderNamingScreen();
      return;
    }

    if (state.gameOver && state.ending) {
      elements.storySection.classList.add("ending-card");
      elements.stageValue.textContent = "人生总结";
      elements.eventTitle.textContent = engine.formatText(state.ending.title);
      createParagraphs(elements.storyText, state.ending.text);
      renderEndingAnalysis(elements.storyText, state.ending.analysis);
      elements.optionsContainer.innerHTML = "";

      const restart = document.createElement("button");
      restart.type = "button";
      restart.className = "option-button";
      restart.textContent = "重新开始一局";
      restart.addEventListener("click", function () {
        engine.restart();
        render();
      });
      elements.optionsContainer.appendChild(restart);
      return;
    }

    elements.storySection.classList.remove("ending-card");

    if (!event) {
      elements.stageValue.textContent = "人生总结";
      elements.eventTitle.textContent = "人生暂时停在这里";
      createParagraphs(elements.storyText, "当前没有新的事件可以继续。你可以重新开始，或者继续补充更多事件数据。");
      elements.optionsContainer.innerHTML = "";
      return;
    }

    elements.stageValue.textContent = stateApi.getStageLabel(event.stage);
    elements.eventTitle.textContent = event.title;
    createParagraphs(elements.storyText, event.text);
    renderOptions(event, state);
  }

  function render() {
    const event = engine.getCurrentEvent();
    const state = engine.getState();

    elements.ageValue.textContent = String(state.age);
    elements.genderValue.textContent = state.playerGender === "male" ? "男孩" : state.playerGender === "female" ? "女孩" : "未选择";
    renderStats(state);
    renderFamilyBackground(state);
    renderRoutes(state);
    renderRelationships(state);
    renderStory(state, event);
    renderHistory(state);
  }

  function bindEvents() {
    elements.restartButton.addEventListener("click", function () {
      engine.restart();
      render();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    cacheElements();
    bindEvents();
    render();
  });
})();

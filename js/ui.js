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
    elements.inventoryContainer = document.getElementById("inventory-container");
    elements.familyLifeContainer = document.getElementById("family-life-container");
    elements.storySection = document.getElementById("story-section");
    elements.restartButton = document.getElementById("restart-btn");
    elements.shopOpenBtn = document.getElementById("shop-open-btn");
    elements.shopOpenBtnSecondary = document.getElementById("shop-open-btn-secondary");
    elements.shopHint = document.getElementById("shop-hint");
    elements.shopModal = document.getElementById("shop-modal");
    elements.shopModalBackdrop = document.getElementById("shop-modal-backdrop");
    elements.shopModalClose = document.getElementById("shop-modal-close");
    elements.shopItemsContainer = document.getElementById("shop-items-container");
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

  function triggerStoryTextEnter() {
    const el = elements.storyText;
    if (!el) {
      return;
    }
    el.classList.remove("story-text--enter");
    window.requestAnimationFrame(function () {
      void el.offsetWidth;
      el.classList.add("story-text--enter");
    });
    function onAnimEnd(ev) {
      if (ev.target !== el || ev.animationName !== "storyFade") {
        return;
      }
      el.classList.remove("story-text--enter");
      el.removeEventListener("animationend", onAnimEnd);
    }
    el.addEventListener("animationend", onAnimEnd);
  }

  function statCardModifierClass(key, value) {
    const n = typeof value === "number" ? value : 0;
    const classes = [];
    if (key === "health" && n < 30) {
      classes.push("stat-card--warn");
    }
    if (key === "debt" && n > 45) {
      classes.push("stat-card--warn");
    }
    if (key === "stress" && n > 72) {
      classes.push("stat-card--stress");
    }
    if (key === "mental" && n < 28) {
      classes.push("stat-card--warn");
    }
    if (key === "happiness" && n < 25) {
      classes.push("stat-card--warn");
    }
    if (key === "money" && n < 12) {
      classes.push("stat-card--warn");
    }
    if (key === "familySupport" && n < 18) {
      classes.push("stat-card--warn");
    }
    return classes.join(" ");
  }

  function isHistoryMilestoneText(text) {
    const t = String(text || "");
    const keys = [
      "家庭背景",
      "抽取",
      "高考",
      "志愿",
      "录取",
      "留学",
      "出国",
      "异国",
      "确认关系",
      "交往",
      "恋爱",
      "分手",
      "复合",
      "结婚",
      "婚礼",
      "孩子",
      "生育",
      "怀孕",
      "辞职",
      "离职",
      "工作",
      "人生尽头",
      "结局",
      "移民",
      "签证",
      "入狱",
      "出狱",
      "大学"
    ];
    return keys.some(function (k) {
      return t.indexOf(k) !== -1;
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

  function appendUniversityRecommendations(container, titleText, items) {
    if (!Array.isArray(items) || !items.length) {
      return;
    }

    const section = document.createElement("section");
    section.className = "route-recommendations";

    const title = document.createElement("strong");
    title.className = "route-recommendations-title";
    title.textContent = titleText;
    section.appendChild(title);

    const list = document.createElement("div");
    list.className = "route-university-list";

    items.forEach((item) => {
      if (!item || typeof item !== "object") {
        return;
      }

      const card = document.createElement("article");
      card.className = "route-university-item";

      const name = document.createElement("strong");
      name.className = "route-university-name";
      name.textContent = item.name || "学校待定";
      card.appendChild(name);

      const meta = document.createElement("p");
      meta.className = "route-university-meta";
      meta.textContent = [item.location || "", item.categoryLabel || ""].filter(Boolean).join(" · ");
      card.appendChild(meta);

      if (item.reason) {
        const reason = document.createElement("p");
        reason.className = "route-university-reason";
        reason.textContent = item.reason;
        card.appendChild(reason);
      }

      list.appendChild(card);
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
      const raw = state.stats[key];
      const value = typeof raw === "number" ? raw : 0;
      const row = document.createElement("div");
      const mod = statCardModifierClass(key, value);
      row.className = "stat-card" + (mod ? " " + mod : "");
      row.setAttribute("data-stat", key);

      const label = document.createElement("div");
      label.className = "stat-label";
      label.textContent = stateApi.STAT_LABELS[key];

      const barWrap = document.createElement("div");
      barWrap.className = "stat-bar-wrap";

      const bar = document.createElement("div");
      bar.className = "stat-bar";

      const fill = document.createElement("div");
      fill.className = "stat-fill";
      fill.style.width = Math.max(0, Math.min(100, value)) + "%";
      bar.appendChild(fill);
      barWrap.appendChild(bar);

      const number = document.createElement("div");
      number.className = "stat-value";
      number.textContent = String(value);

      row.appendChild(label);
      row.appendChild(barWrap);
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

    const meta = state.familyBackground.meta;
    if (meta && (meta.advantages.length || meta.costs.length || Object.keys(meta.longTermBias || {}).length)) {
      const metaWrap = document.createElement("div");
      metaWrap.className = "background-meta";

      if (meta.advantages.length) {
        const sub = document.createElement("div");
        sub.className = "background-meta-block";
        const h = document.createElement("div");
        h.className = "background-meta-label";
        h.textContent = "优势";
        sub.appendChild(h);
        const ul = document.createElement("ul");
        ul.className = "background-meta-list";
        meta.advantages.forEach((line) => {
          const li = document.createElement("li");
          li.textContent = line;
          ul.appendChild(li);
        });
        sub.appendChild(ul);
        metaWrap.appendChild(sub);
      }

      if (meta.costs.length) {
        const sub = document.createElement("div");
        sub.className = "background-meta-block";
        const h = document.createElement("div");
        h.className = "background-meta-label";
        h.textContent = "代价与张力";
        sub.appendChild(h);
        const ul = document.createElement("ul");
        ul.className = "background-meta-list";
        meta.costs.forEach((line) => {
          const li = document.createElement("li");
          li.textContent = line;
          ul.appendChild(li);
        });
        sub.appendChild(ul);
        metaWrap.appendChild(sub);
      }

      const bias = meta.longTermBias && typeof meta.longTermBias === "object" ? meta.longTermBias : {};
      const biasLabels = { romance: "恋爱", education: "升学", career: "工作", endings: "结局倾向" };
      Object.entries(bias).forEach(([key, text]) => {
        if (!text || typeof text !== "string") {
          return;
        }
        const sub = document.createElement("div");
        sub.className = "background-meta-block background-meta-bias";
        const h = document.createElement("div");
        h.className = "background-meta-label";
        h.textContent = biasLabels[key] || key;
        sub.appendChild(h);
        const p = document.createElement("p");
        p.className = "background-meta-text";
        p.textContent = text;
        sub.appendChild(p);
        metaWrap.appendChild(sub);
      });

      card.appendChild(metaWrap);
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

    const wl = state.workLife && typeof state.workLife === "object" ? state.workLife : null;
    if (wl && (wl.workLocationId || wl.housingId || (typeof wl.jobApplicationsSent === "number" && wl.jobApplicationsSent > 0))) {
      const cfg = window.LIFE_WORK_LIFE_CONFIG && typeof window.LIFE_WORK_LIFE_CONFIG === "object" ? window.LIFE_WORK_LIFE_CONFIG : {};
      const locs = Array.isArray(cfg.workLocations) ? cfg.workLocations : [];
      const hs = Array.isArray(cfg.housingOptions) ? cfg.housingOptions : [];
      const locLabel = locs.find(function (x) {
        return x && x.id === wl.workLocationId;
      });
      const hLabel = hs.find(function (x) {
        return x && x.id === wl.housingId;
      });
      const card = document.createElement("article");
      card.className = "route-card";
      const label = document.createElement("strong");
      label.className = "route-label";
      label.textContent = "工作与居住（年度结算）";
      card.appendChild(label);
      const p1 = document.createElement("p");
      p1.className = "route-summary";
      p1.textContent =
        "工作地点：" +
        (locLabel && locLabel.label ? locLabel.label : wl.workLocationId || "未定") +
        "；住房：" +
        (hLabel && hLabel.label ? hLabel.label : wl.housingId || "未定") +
        "。";
      card.appendChild(p1);
      if (state.flags && state.flags.indexOf("annual_economy_active") !== -1) {
        const p2 = document.createElement("p");
        p2.className = "muted";
        const est = typeof wl.employmentStatus === "string" && wl.employmentStatus ? wl.employmentStatus : "";
        p2.textContent =
          "已启用按年工资入账与日常扣减；房租按年薪的一定比例每年从财富中扣除。求职发送次数：" +
          (typeof wl.jobApplicationsSent === "number" ? wl.jobApplicationsSent : 0) +
          (est ? "。就业状态：" + est : "") +
          "。";
        card.appendChild(p2);
      }
      elements.routeContainer.appendChild(card);
    }

    if (state.gaokao && typeof state.gaokao.score === "number") {
      const card = document.createElement("article");
      card.className = "route-card";

      const label = document.createElement("strong");
      label.className = "route-label";
      label.textContent = "高考结算";
      card.appendChild(label);

      const title = document.createElement("p");
      title.className = "route-title";
      title.textContent = state.gaokao.score + " 分";
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
        state.gaokao.destinationLabel ? "当前去向：" + state.gaokao.destinationLabel : "",
        state.gaokao.performanceNarrative || ""
      ]
        .filter(Boolean)
        .forEach((detail) => {
          const item = document.createElement("li");
          item.textContent = detail;
          details.appendChild(item);
        });
      card.appendChild(details);
      appendUniversityRecommendations(card, "可选学校", state.gaokao.recommendedUniversities);

      elements.routeContainer.appendChild(card);
    }

    if (state.overseas && state.overseas.active) {
      const focusLabels = Array.isArray(state.overseas.branchFocuses)
        ? state.overseas.branchFocuses
            .map((focusId) =>
              ({
                academic: "学业导向",
                social: "社交扩张",
                career: "实习 / 事业导向",
                survival: "节省生存",
                romance: "情感纠葛",
                isolation: "失衡 / 孤立"
              })[focusId] || focusId
            )
            .filter(Boolean)
        : [];
      const phaseLabel =
        ({
          arrival: "初到适应期",
          settling: "初步融入期",
          parallel: "学业与社交并行期",
          independent: "独立生活期",
          complex: "关系复杂化阶段",
          decision: "毕业去向选择期"
        })[state.overseas.phase] || "海外阶段未定";
      const card = document.createElement("article");
      card.className = "route-card";

      const label = document.createElement("strong");
      label.className = "route-label";
      label.textContent = "海外生活";
      card.appendChild(label);

      const title = document.createElement("p");
      title.className = "route-title";
      title.textContent =
        (state.overseas.selectedUniversityName || state.overseas.routeName || "海外路线") +
        " · " +
        (state.overseas.destination || "海外城市");
      card.appendChild(title);

      const summary = document.createElement("p");
      summary.className = "route-summary";
      summary.textContent =
        phaseLabel +
        " · " +
        (state.overseas.supportLevel || "支持方式未定") +
        (state.overseas.qsBandLabel ? "，学业匹配约落在 " + state.overseas.qsBandLabel : "") +
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
        state.overseas.selectedUniversityName
          ? "选择学校：" +
            state.overseas.selectedUniversityName +
            (state.overseas.selectedUniversityCountry ? "（" + state.overseas.selectedUniversityCountry + "）" : "")
          : "",
        focusLabels.length ? "当前分支倾向：" + focusLabels.join("、") : "",
        state.overseas.housingType ? "居住状态：" + state.overseas.housingType : "",
        state.overseas.budgetMode ? "生活策略：" + state.overseas.budgetMode : "",
        "归属感 " +
          (state.overseas.belonging || 0) +
          "，独立度 " +
          (state.overseas.independence || 0) +
          "，学业压力 " +
          (state.overseas.academicPressure || 0) +
          "，职业清晰度 " +
          (state.overseas.careerClarity || 0),
        "文化冲击 " +
          (state.overseas.culturalStress || 0) +
          "，想家程度 " +
          (state.overseas.homesickness || 0) +
          "，签证 / 去向压力 " +
          (state.overseas.visaPressure || 0) +
          "，失衡风险 " +
          (state.overseas.burnout || 0),
        Array.isArray(state.overseas.supportNetworkIds) && state.overseas.supportNetworkIds.length
          ? "海外支持网：" +
            state.overseas.supportNetworkIds
              .map((id) => (state.relationships && state.relationships[id] ? state.relationships[id].name : id))
              .join("、")
          : "",
        Array.isArray(state.overseas.mentorIds) && state.overseas.mentorIds.length
          ? "导师 / 前辈：" +
            state.overseas.mentorIds
              .map((id) => (state.relationships && state.relationships[id] ? state.relationships[id].name : id))
              .join("、")
          : "",
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
        Math.abs((state.overseas.stayScore || 0) - (state.overseas.returnScore || 0)) >= 12
          ? (state.overseas.stayScore || 0) > (state.overseas.returnScore || 0)
            ? "当前更偏向留在国外继续发展。"
            : "当前更偏向回国重新落地。"
          : "留下还是回国，目前仍在拉扯。",
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

      appendUniversityRecommendations(card, "可选学校", state.overseas.recommendedUniversities);

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
      const formatted = engine.formatText(item.text);
      const entry = document.createElement("article");
      entry.className =
        "history-item" + (isHistoryMilestoneText(formatted) ? " history-item--milestone" : "");

      const age = document.createElement("span");
      age.className = "history-age";
      age.textContent = item.age + " 岁";

      const body = document.createElement("div");
      body.className = "history-body";

      const text = document.createElement("p");
      text.className = "history-text";
      text.textContent = formatted;

      body.appendChild(text);
      entry.appendChild(age);
      entry.appendChild(body);
      elements.historyContainer.appendChild(entry);
    });
  }

  function getGiftItemIdsFromCatalog() {
    const shopItems = Array.isArray(window.LIFE_SHOP_ITEMS) ? window.LIFE_SHOP_ITEMS : [];
    const ids = new Set();
    shopItems.forEach((item) => {
      if (item && item.grantInventory && typeof item.grantInventory.itemId === "string") {
        ids.add(item.grantInventory.itemId);
      }
    });
    return ids;
  }

  function getShopAgeBounds() {
    const cfg = window.LIFE_SHOP_CONFIG && typeof window.LIFE_SHOP_CONFIG === "object" ? window.LIFE_SHOP_CONFIG : {};
    return {
      min: typeof cfg.minAge === "number" ? cfg.minAge : 7,
      max: typeof cfg.maxAge === "number" ? cfg.maxAge : 55
    };
  }

  function getShopCategoryOrder() {
    const cfg = window.LIFE_SHOP_CONFIG && typeof window.LIFE_SHOP_CONFIG === "object" ? window.LIFE_SHOP_CONFIG : {};
    return Array.isArray(cfg.categoryOrder) ? cfg.categoryOrder : ["学习", "娱乐", "服饰", "健康", "礼物", "家庭", "日常"];
  }

  function describeShopPurchaseEffects(item) {
    const lines = [];
    const price = typeof item.price === "number" ? item.price : 0;
    lines.push("需支付：" + price + " " + stateApi.STAT_LABELS.money);
    if (typeof item.summary === "string" && item.summary.trim()) {
      lines.push(item.summary.trim());
    }

    const stats = item.effects && item.effects.stats ? item.effects.stats : {};
    Object.entries(stats).forEach(([key, delta]) => {
      if (typeof delta !== "number" || delta === 0) {
        return;
      }
      const label = stateApi.STAT_LABELS[key] || key;
      const sign = delta > 0 ? "+" : "";
      lines.push(label + " " + sign + delta);
    });

    if (item.grantInventory && typeof item.grantInventory.itemId === "string") {
      const shopItems = Array.isArray(window.LIFE_SHOP_ITEMS) ? window.LIFE_SHOP_ITEMS : [];
      const meta = shopItems.find((row) => row && row.id === item.id);
      const giftName = (meta && meta.name) || item.grantInventory.itemId;
      lines.push("获得「" + giftName + "」进入物品栏（可送给当前选中对象）");
    }

    return lines;
  }

  function isShopAvailableForState(state) {
    const b = getShopAgeBounds();
    return Boolean(
      state &&
        state.gameStarted &&
        !state.gameOver &&
        !state.setupStep &&
        state.age >= b.min &&
        state.age <= b.max
    );
  }

  function setShopModalOpen(open) {
    if (!elements.shopModal) {
      return;
    }
    if (open) {
      elements.shopModal.removeAttribute("hidden");
      elements.shopModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    } else {
      elements.shopModal.setAttribute("hidden", "");
      elements.shopModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }

  function populateShopItems(state) {
    if (!elements.shopItemsContainer) {
      return;
    }
    elements.shopItemsContainer.innerHTML = "";
    const shopItems = Array.isArray(window.LIFE_SHOP_ITEMS) ? window.LIFE_SHOP_ITEMS : [];
    const canUse = isShopAvailableForState(state);
    const categoryOrder = getShopCategoryOrder();
    const orderIndex = new Map(categoryOrder.map((c, i) => [c, i]));

    const visible = canUse
      ? shopItems.filter((item) => item && item.id && engine.isShopItemUnlockedNow(item.id))
      : [];

    if (!visible.length) {
      const p = document.createElement("p");
      p.className = "shop-empty muted";
      p.textContent = canUse
        ? "当前人生阶段暂时没有可购商品。"
        : "尚未到可使用商店的年龄，或仍在开局设置中。";
      elements.shopItemsContainer.appendChild(p);
      return;
    }

    visible.sort((a, b) => {
      const ca = a.category || "其他";
      const cb = b.category || "其他";
      const ia = orderIndex.has(ca) ? orderIndex.get(ca) : 99;
      const ib = orderIndex.has(cb) ? orderIndex.get(cb) : 99;
      if (ia !== ib) {
        return ia - ib;
      }
      const pa = typeof a.price === "number" ? a.price : 0;
      const pb = typeof b.price === "number" ? b.price : 0;
      return pa - pb;
    });

    let lastCategory = null;
    visible.forEach((item) => {
      const cat = item.category || "其他";
      if (cat !== lastCategory) {
        lastCategory = cat;
        const heading = document.createElement("h3");
        heading.className = "shop-category-heading";
        heading.textContent = cat;
        elements.shopItemsContainer.appendChild(heading);
      }

      const card = document.createElement("article");
      card.className = "shop-item-card";

      const top = document.createElement("div");
      top.className = "shop-item-top";

      const name = document.createElement("h3");
      name.className = "shop-item-name";
      name.textContent = item.name || item.id;

      const catSpan = document.createElement("span");
      catSpan.className = "shop-item-category";
      catSpan.textContent = cat;

      top.appendChild(name);
      top.appendChild(catSpan);
      card.appendChild(top);

      const ul = document.createElement("ul");
      ul.className = "shop-item-effects";
      describeShopPurchaseEffects(item).forEach((line) => {
        const li = document.createElement("li");
        li.textContent = line;
        ul.appendChild(li);
      });
      card.appendChild(ul);

      const buy = document.createElement("button");
      buy.type = "button";
      buy.className = "shop-item-buy";
      const affordable = engine.canPurchaseShopItem(item.id);
      buy.disabled = !canUse || !affordable;
      const priceN = typeof item.price === "number" ? item.price : 0;
      const moneyNow = state.stats && typeof state.stats.money === "number" ? state.stats.money : 0;
      const debtCfg = window.LIFE_DEBT_FINANCE_CONFIG && typeof window.LIFE_DEBT_FINANCE_CONFIG === "object" ? window.LIFE_DEBT_FINANCE_CONFIG : {};
      const creditShop =
        debtCfg.enabled !== false &&
        debtCfg.autoBorrowOnShortfall !== false &&
        debtCfg.allowShopPurchaseWhenBroke !== false;
      buy.textContent = !canUse
        ? "当前不可用"
        : !affordable
          ? "不可购买"
          : creditShop && moneyNow < priceN
            ? "购买（约 " + priceN + "，不足将记入负债）"
            : "购买（" + priceN + " " + stateApi.STAT_LABELS.money + "）";

      buy.addEventListener("click", function () {
        engine.purchaseShopItem(item.id);
        render();
      });

      card.appendChild(buy);
      elements.shopItemsContainer.appendChild(card);
    });
  }

  function renderShopEntry(state) {
    if (!elements.shopHint) {
      return;
    }
    const canUse = isShopAvailableForState(state);
    const shopLocked = !state.gameStarted || state.gameOver || Boolean(state.setupStep);
    const shopAgeBlocked = state.gameStarted && !state.gameOver && !state.setupStep && !canUse;
    if (elements.shopOpenBtn) {
      elements.shopOpenBtn.disabled = shopLocked || shopAgeBlocked;
    }
    if (elements.shopOpenBtnSecondary) {
      elements.shopOpenBtnSecondary.disabled = shopLocked || shopAgeBlocked;
    }
    const b = getShopAgeBounds();
    if (!state.gameStarted || state.gameOver) {
      elements.shopHint.textContent =
        "开始人生后，在 " + b.min + "–" + b.max + " 岁可打开商店；货架会随年龄变化。";
    } else if (state.setupStep) {
      elements.shopHint.textContent =
        "完成家庭背景并开局后，年满 " + b.min + " 岁可打开商店；也可等待随机事件「街边的店」。";
    } else if (!canUse) {
      elements.shopHint.textContent =
        state.age < b.min
          ? "年满 " + b.min + " 岁后商店开放；也可等待随机事件「街边的店」。"
          : b.max + " 岁后此处不再开放购物（仍可回顾人生与关系）。";
    } else {
      elements.shopHint.textContent =
        "当前积蓄：" +
        (state.stats && typeof state.stats.money === "number" ? state.stats.money : 0) +
        "。能买到的东西会随人生阶段变；与随机事件「街边的店，总在你心软的时候招手」同一套商品池（已按年龄过滤选项）。";
    }
  }

  function renderInventory(state) {
    if (!elements.inventoryContainer) {
      return;
    }
    elements.inventoryContainer.innerHTML = "";
    const bag = (state && state.inventory) || {};
    const shopItems = Array.isArray(window.LIFE_SHOP_ITEMS) ? window.LIFE_SHOP_ITEMS : [];
    const labelMap = new Map();
    shopItems.forEach((item) => {
      if (!item || !item.id) {
        return;
      }
      labelMap.set(item.id, item.name || item.id);
      if (item.grantInventory && typeof item.grantInventory.itemId === "string") {
        labelMap.set(item.grantInventory.itemId, item.name || item.grantInventory.itemId);
      }
    });
    const giftIds = getGiftItemIdsFromCatalog();
    const entries = Object.keys(bag).filter((id) => (bag[id] || 0) > 0);

    if (!entries.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent =
        "暂无持有物品。可在侧栏「商店」购买礼物；送给对象：在「人际 / 恋爱」里选中对方，且关系处于暧昧/恋爱等阶段时，点物品旁的「送给 Ta」。";
      elements.inventoryContainer.appendChild(empty);
      return;
    }

    const wrap = document.createElement("div");
    wrap.className = "inventory-wrap";

    entries.forEach((id) => {
      const row = document.createElement("div");
      row.className = "inventory-row";

      const label = document.createElement("span");
      label.className = "inventory-label";
      label.textContent = (labelMap.get(id) || id) + " × " + bag[id];
      row.appendChild(label);

      if (giftIds.has(id)) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "inventory-gift-btn";
        const canGive = engine.canGiveGiftFromInventory(id);
        btn.disabled = !canGive;
        btn.textContent = "送给 Ta";
        if (!state.activeRelationshipId) {
          btn.title = "请先在「人际 / 恋爱」卡片上选中一位对象";
        } else if (!canGive) {
          btn.title =
            "需选中对象；低龄时可送同学（初识/熟悉/好感等），年长后还可送给暧昧或恋爱对象（与物品栏规则一致）";
        } else {
          btn.title = "送给当前选中的对象，消耗 1 件";
        }
        btn.addEventListener("click", function () {
          engine.giveGiftFromInventory(id);
          render();
        });
        row.appendChild(btn);
      }

      wrap.appendChild(row);
    });

    const note = document.createElement("p");
    note.className = "muted";
    note.style.fontSize = "0.85rem";
    note.style.marginTop = "0.65rem";
    note.textContent =
      "说明：随机事件里也会出现「把礼物递出去」选项；此处方便你主动送礼。";
    wrap.appendChild(note);

    elements.inventoryContainer.appendChild(wrap);
  }

  function renderFamilyLife(state) {
    if (!elements.familyLifeContainer) {
      return;
    }
    elements.familyLifeContainer.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.className = "family-life-summary";

    const child = (state && state.children) || {};
    const count = typeof child.count === "number" ? child.count : 0;
    const p1 = document.createElement("p");
    p1.textContent = "子女数量：" + count;
    wrap.appendChild(p1);

    const stg = typeof child.stage === "string" && child.stage ? child.stage : "";
    if (count > 0 && stg) {
      const ps = document.createElement("p");
      ps.className = "muted";
      ps.textContent = "育儿阶段（内部 stage）：" + stg;
      wrap.appendChild(ps);
    }

    if (count > 0) {
      const flags = (state && state.flags) || [];
      let care = typeof child.careMode === "string" && child.careMode ? child.careMode : "";
      if (!care) {
        if (flags.indexOf("parenting_nanny_used") !== -1) {
          care = "曾请保姆/月嫂分担";
        } else if (flags.indexOf("parenting_grandparent_help") !== -1) {
          care = "长辈搭手较多";
        } else if (flags.indexOf("parenting_primary_self") !== -1) {
          care = "更多亲自带睡与陪伴";
        } else if (flags.indexOf("parenting_career_slowed") !== -1) {
          care = "曾为育儿调慢职业节奏";
        } else if (flags.indexOf("parenting_absent_risk") !== -1) {
          care = "陪伴偏少、事业优先倾向";
        } else {
          care = "可在「家庭与子女」随机事件里逐步定型";
        }
      }
      const pc = document.createElement("p");
      pc.className = "muted";
      pc.textContent = "抚养侧重：" + care + "。育儿事件前缀 childcare_ 见 data/life-workforce-expansion.js。";
      wrap.appendChild(pc);
    }

    if (Array.isArray(child.tags) && child.tags.length) {
      const p2 = document.createElement("p");
      p2.className = "muted";
      p2.textContent = "家庭标签：" + child.tags.join("、");
      wrap.appendChild(p2);
    }

    const overseas = (state && state.overseas) || {};
    if (overseas.studyLoanActive || (typeof overseas.studyLoanBalance === "number" && overseas.studyLoanBalance > 0)) {
      const loan = document.createElement("p");
      loan.className = "loan-note";
      const bal = typeof overseas.studyLoanBalance === "number" ? overseas.studyLoanBalance : 0;
      loan.textContent =
        "留学贷款未结清（当前余额约 " +
        bal +
        "）。当财富严格大于贷款余额时会自动一次性还清。";
      wrap.appendChild(loan);
    }

    elements.familyLifeContainer.appendChild(wrap);
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
      card.className =
        "relationship-card" + (relationship.id === state.activeRelationshipId ? " relationship-card--active" : "");

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

      let stageBioNode = null;
      const bioPack = engine.getRelationshipDynamicBio(state, relationship.id);
      if (bioPack && bioPack.text) {
        stageBioNode = document.createElement("p");
        stageBioNode.className = "relationship-stage-bio";
        stageBioNode.textContent =
          "现阶段印象：" +
          bioPack.text +
          (bioPack.arcLabel ? "（成年走向倾向：" + bioPack.arcLabel + "）" : "");
      }

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

      let partnerFamilyNode = null;
      const pf = engine.getPartnerFamilyView(state, relationship.id);
      if (pf) {
        const pfWrap = document.createElement("div");
        pfWrap.className = "relationship-partner-family";
        const pfTitle = document.createElement("p");
        pfTitle.className = "relationship-partner-family-title";
        pfTitle.textContent = "Ta 的家庭背景";
        pfWrap.appendChild(pfTitle);
        const pfHint = document.createElement("p");
        pfHint.className = "muted relationship-partner-family-hint";
        pfHint.textContent =
          "亲密度（好感、信任、熟悉度等综合）：" + pf.intimacyScore + " / " + pf.threshold + " 以上可了解更完整的家庭背景。";
        pfWrap.appendChild(pfHint);
        if (!pf.revealed) {
          const vague = document.createElement("p");
          vague.className = "relationship-partner-family-vague";
          vague.textContent = pf.vague || "你还不足以看清 Ta 家庭的全貌；再走近一些，线索才会连成背景。";
          pfWrap.appendChild(vague);
        } else {
          const sum = document.createElement("p");
          sum.className = "relationship-partner-family-full";
          sum.textContent = (pf.revealedTitle ? pf.revealedTitle + "：" : "") + (pf.revealedSummary || "");
          pfWrap.appendChild(sum);
          if (pf.revealedDetails && pf.revealedDetails.length) {
            const ul = document.createElement("ul");
            ul.className = "relationship-partner-family-details";
            pf.revealedDetails.forEach(function (line) {
              const li = document.createElement("li");
              li.textContent = line;
              ul.appendChild(li);
            });
            pfWrap.appendChild(ul);
          }
        }
        partnerFamilyNode = pfWrap;
      }

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
      if (stageBioNode) {
        card.appendChild(stageBioNode);
      }
      if (displayTags.length) {
        card.appendChild(traits);
      }
      card.appendChild(meter);
      card.appendChild(affection);
      card.appendChild(metrics);
      card.appendChild(profile);
      if (partnerFamilyNode) {
        card.appendChild(partnerFamilyNode);
      }
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

      if (typeof engine.canProposeToRelationship === "function" && engine.canProposeToRelationship(state, relationship.id)) {
        const proposeBtn = document.createElement("button");
        proposeBtn.type = "button";
        proposeBtn.className = "relationship-propose-button";
        proposeBtn.textContent = "求婚";
        proposeBtn.setAttribute("aria-label", "向" + relationship.name + "求婚");
        proposeBtn.addEventListener("click", function () {
          engine.attemptProposalFromSidebar(relationship.id);
          render();
        });
        card.appendChild(proposeBtn);
      }

      elements.relationshipsContainer.appendChild(card);
    });
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
    triggerStoryTextEnter();

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
    const submitWrap = document.createElement("span");
    submitWrap.className = "option-button-content";
    const submitLabel = document.createElement("span");
    submitLabel.className = "option-main-text";
    submitLabel.textContent = "带着这个名字开始人生";
    submitWrap.appendChild(submitLabel);
    button.appendChild(submitWrap);

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
      triggerStoryTextEnter();
      elements.optionsContainer.innerHTML = "";

      const restart = document.createElement("button");
      restart.type = "button";
      restart.className = "option-button";
      const rw = document.createElement("span");
      rw.className = "option-button-content";
      const rt = document.createElement("span");
      rt.className = "option-main-text";
      rt.textContent = "重新开始一局";
      rw.appendChild(rt);
      restart.appendChild(rw);
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
      triggerStoryTextEnter();
      elements.optionsContainer.innerHTML = "";
      return;
    }

    elements.stageValue.textContent = stateApi.getStageLabel(event.stage);
    elements.eventTitle.textContent = engine.formatText(event.title);
    createParagraphs(elements.storyText, event.text);
    triggerStoryTextEnter();
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
    renderInventory(state);
    renderShopEntry(state);
    renderFamilyLife(state);
    renderStory(state, event);
    renderHistory(state);

    if (elements.shopModal && !elements.shopModal.hasAttribute("hidden")) {
      populateShopItems(state);
    }
  }

  function bindEvents() {
    elements.restartButton.addEventListener("click", function () {
      engine.restart();
      render();
    });

    function openShopModal() {
      const state = engine.getState();
      if (!isShopAvailableForState(state)) {
        return;
      }
      setShopModalOpen(true);
      populateShopItems(state);
    }

    if (elements.shopOpenBtn) {
      elements.shopOpenBtn.addEventListener("click", openShopModal);
    }

    if (elements.shopOpenBtnSecondary) {
      elements.shopOpenBtnSecondary.addEventListener("click", openShopModal);
    }

    function closeShop() {
      if (elements.shopItemsContainer) {
        elements.shopItemsContainer.innerHTML = "";
      }
      setShopModalOpen(false);
    }

    if (elements.shopModalClose) {
      elements.shopModalClose.addEventListener("click", closeShop);
    }

    if (elements.shopModalBackdrop) {
      elements.shopModalBackdrop.addEventListener("click", closeShop);
    }

    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && elements.shopModal && !elements.shopModal.hasAttribute("hidden")) {
        closeShop();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    cacheElements();
    bindEvents();
    render();
  });
})();

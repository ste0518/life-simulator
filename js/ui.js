(function () {
  "use strict";

  const engine = window.LifeGameEngine;
  const stateApi = window.LifeState;

  const elements = {};

  function cacheElements() {
    elements.ageValue = document.getElementById("age-value");
    elements.stageValue = document.getElementById("stage-value");
    elements.eventTitle = document.getElementById("event-title");
    elements.storyText = document.getElementById("story-text");
    elements.optionsContainer = document.getElementById("options-container");
    elements.statsContainer = document.getElementById("stats-container");
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
      .filter((relationship) => relationship.met || relationship.affection > 0)
      .sort((left, right) => right.affection - left.affection);

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

      const name = document.createElement("strong");
      name.textContent = relationship.name;

      const status = document.createElement("span");
      status.className = "relationship-status";
      status.textContent =
        stateApi.RELATIONSHIP_STATUS_LABELS[relationship.status] || relationship.status || "关系未定义";

      header.appendChild(name);
      header.appendChild(status);

      const identity = document.createElement("p");
      identity.className = "relationship-identity";
      identity.textContent = relationship.identity || "你们的关系还在慢慢形成。";

      const traits = document.createElement("div");
      traits.className = "relationship-traits";
      (relationship.traitTags || []).forEach((tag) => {
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

      card.appendChild(header);
      card.appendChild(identity);
      if ((relationship.traitTags || []).length) {
        card.appendChild(traits);
      }
      card.appendChild(meter);
      card.appendChild(affection);

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

  function renderOptions(event) {
    elements.optionsContainer.innerHTML = "";

    const visibleOptions = engine.getVisibleOptions(event);

    visibleOptions.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option-button";
      button.textContent = engine.formatText(option.text);
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
    createParagraphs(elements.storyText, "你刚刚出生，这一生还没有真正展开。\n\n先为自己取一个名字，然后从 0 岁开始经历属于你的人生。");

    elements.optionsContainer.innerHTML = "";

    const form = document.createElement("form");
    form.className = "name-form";

    const input = document.createElement("input");
    input.className = "name-input";
    input.type = "text";
    input.maxLength = 12;
    input.placeholder = "请输入名字";
    input.autocomplete = "off";

    const button = document.createElement("button");
    button.type = "submit";
    button.className = "option-button";
    button.textContent = "带着这个名字开始人生";

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      engine.startGame(input.value);
      render();
    });

    form.appendChild(input);
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
    renderOptions(event);
  }

  function render() {
    const state = engine.getState();
    const event = engine.getCurrentEvent();

    elements.ageValue.textContent = String(state.age);
    renderStats(state);
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

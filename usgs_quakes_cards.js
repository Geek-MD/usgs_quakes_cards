// usgs_quakes_card.js

class UsgsQuakesListCard extends HTMLElement {
  static getConfigElement() {
    const el = document.createElement("ha-form");
    el.schema = [
      { name: "entity", selector: { entity: { domain: "sensor" } } },
      { name: "title", selector: { text: {} } },
    ];
    return el;
  }

  static getStubConfig(hass, entities) {
    return { entity: entities[0] || "sensor.usgs_quakes_latest" };
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set hass(hass) {
    if (!this.config || !hass) return;

    const entity = hass.states[this.config.entity];
    if (!entity) return;

    const title = this.config.title || "USGS Quakes";
    const attr = entity.attributes;
    const events = attr["formatted_events"]?.split("\n\n") || [];

    const eventBlocks = events
      .map((event, i) => {
        const background = i % 2 === 0 ? "#f0f0f0" : "#ffffff";
        return `<div class="event" style="background:${background}">${event.replaceAll("\n", "<br>")}</div>`;
      })
      .join("");

    this.shadowRoot.innerHTML = `
      <style>
        .card {
          padding: 16px;
          font-size: 14px;
        }
        .title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .event {
          padding: 8px;
          border-radius: 8px;
          margin-bottom: 4px;
        }
      </style>
      <ha-card class="card">
        <div class="title">${title}</div>
        ${eventBlocks}
      </ha-card>
    `;
  }

  setConfig(config) {
    if (!config.entity) throw new Error("Entity is required");
    this.config = config;
  }

  getCardSize() {
    return 4;
  }
}

customElements.define("usgs-quakes-list-card", UsgsQuakesListCard);

class UsgsQuakesUpdateButtonCard extends HTMLElement {
  static getConfigElement() {
    const el = document.createElement("ha-form");
    el.schema = [
      { name: "name", selector: { text: {} } },
      { name: "icon", selector: { icon: {} } },
    ];
    return el;
  }

  static getStubConfig() {
    return { name: "Force Update", icon: "mdi:refresh" };
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set hass(hass) {
    if (!this.config || !hass) return;

    const lang = hass.locale.language;
    const translations = {
      en: "Force Update",
      es: "Forzar Actualización",
      fr: "Forcer la Mise à Jour",
      de: "Aktualisierung Erzwingen",
      it: "Forza Aggiornamento",
    };

    const label = this.config.name || translations[lang] || translations["en"];
    const icon = this.config.icon || "mdi:refresh";

    this.shadowRoot.innerHTML = `
      <style>
        .button {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary-color);
          color: var(--text-primary-color);
          padding: 12px;
          border-radius: 12px;
          font-weight: bold;
          cursor: pointer;
        }
        .button:hover {
          filter: brightness(0.9);
        }
        ha-icon {
          margin-right: 8px;
        }
      </style>
      <ha-card class="button">
        <ha-icon icon="${icon}"></ha-icon>
        <span>${label}</span>
      </ha-card>
    `;

    this.shadowRoot.querySelector(".button").onclick = () => {
      hass.callService("usgs_quakes", "force_feed_update");
    };
  }

  setConfig(config) {
    this.config = config;
  }

  getCardSize() {
    return 1;
  }
}

customElements.define("usgs-quakes-update-button-card", UsgsQuakesUpdateButtonCard);

window.customCards = window.customCards || [];
window.customCards.push(
  {
    type: "usgs-quakes-list-card",
    name: "USGS Quakes - Event List",
    preview: false,
    description: "Displays recent earthquake events from USGS feed."
  },
  {
    type: "usgs-quakes-update-button-card",
    name: "USGS Quakes - Update Button",
    preview: false,
    description: "Button to force update the USGS Quakes feed."
  }
);

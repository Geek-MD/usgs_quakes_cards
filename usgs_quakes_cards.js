// USGS Quakes Card Bundle – List + Button

class UsgsQuakesCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set hass(hass) {
    const entityId = this.config.entity || "sensor.usgs_quakes_latest";
    const stateObj = hass.states[entityId];

    if (!stateObj) {
      this.shadowRoot.innerHTML = `<ha-card><div class="card-content">Entity not found: ${entityId}</div></ha-card>`;
      return;
    }

    const formatted = stateObj.attributes.formatted_events || "";
    const events = formatted.trim().split("\n\n");

    const lang = hass.locale.language;
    const localize = (key) =>
      hass.resources[lang]?.[`component.usgs_quakes.cards.${key}`] || key;

    const title = localize("title");

    const lines = events
      .map((event, index) => {
        const bg = index % 2 === 0 ? "var(--secondary-background-color)" : "var(--card-background-color)";
        return `<div class="event" style="background: ${bg};">${event.replace(/\n/g, "<br />")}</div>`;
      })
      .join('<div class="spacer"></div>');

    this.shadowRoot.innerHTML = `
      <style>
        .card {
          padding: 16px;
        }

        .title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 12px;
        }

        .event {
          padding: 12px;
          border-radius: 12px;
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .spacer {
          height: 4px;
        }
      </style>
      <ha-card class="card">
        <div class="title">${title}</div>
        ${lines}
      </ha-card>
    `;
  }

  setConfig(config) {
    this.config = config;
  }

  getCardSize() {
    return 3;
  }
}

class UsgsQuakesUpdateButtonCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set hass(hass) {
    const serviceDomain = "usgs_quakes";
    const serviceName = "force_feed_update";
    const lang = hass.locale.language;

    const localize = (key) =>
      hass.resources[lang]?.[`component.usgs_quakes.cards.${key}`] || key;

    const buttonText = localize("force_update");

    this.shadowRoot.innerHTML = `
      <style>
        .card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--card-background-color, #f9f9f9);
          border-radius: 16px;
          padding: 16px;
          box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
          cursor: pointer;
          transition: background 0.3s;
        }

        .card:hover {
          background: var(--primary-background-color, #e0e0e0);
        }

        img {
          width: 64px;
          height: 64px;
          margin-bottom: 12px;
        }

        .label {
          font-size: 16px;
          font-weight: bold;
          color: var(--primary-text-color, #333);
          text-align: center;
        }
      </style>
      <div class="card">
        <img src="/local/community/usgs_quakes/icon.png" alt="USGS Icon" />
        <div class="label">${buttonText}</div>
      </div>
    `;

    this.shadowRoot.querySelector(".card").onclick = () => {
      hass.callService(serviceDomain, serviceName);
    };
  }

  setConfig(config) {
    this.config = config;
  }

  getCardSize() {
    return 1;
  }
}

// Register both cards
customElements.define("usgs-quakes-card", UsgsQuakesCard);
customElements.define("usgs-quakes-update-button-card", UsgsQuakesUpdateButtonCard);

window.customCards = window.customCards || [];
window.customCards.push(
  {
    type: "usgs-quakes-card",
    name: "USGS Quakes Card",
    preview: false,
    description: "Formatted list of recent earthquakes from USGS."
  },
  {
    type: "usgs-quakes-update-button-card",
    name: "USGS Quakes - Update Button",
    preview: false,
    description: "Card to force update of USGS Quakes feed."
  }
);

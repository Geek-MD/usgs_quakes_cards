// usgs_quakes_cards.js

class UsgsQuakesListCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set hass(hass) {
    const entityId = this.config.entity || "sensor.usgs_quakes_latest";
    const stateObj = hass.states[entityId];
    const lang = hass.locale.language;

    if (!stateObj) return;

    const events = stateObj.attributes.formatted_events?.split("\n\n") || [];

    const translations = {
      en: "Recent Earthquakes",
      es: "Sismos Recientes",
      fr: "Séismes Récents",
      de: "Aktuelle Erdbeben",
      it: "Terremoti Recenti"
    };

    const title = translations[lang] || translations["en"];

    this.shadowRoot.innerHTML = `
      <style>
        ha-card {
          padding: 16px;
        }
        h1 {
          font-size: 18px;
          margin: 0 0 10px 0;
        }
        ul {
          padding-left: 20px;
        }
        li {
          margin-bottom: 8px;
        }
      </style>
      <ha-card>
        <h1>${title}</h1>
        <ul>
          ${events.map(event => `<li>${event.replaceAll("\n", "<br>")}</li>`).join("")}
        </ul>
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

customElements.define("usgs-quakes-list-card", UsgsQuakesListCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "usgs-quakes-list-card",
  name: "USGS Quakes - List",
  preview: false,
  description: "Card to show recent USGS earthquake events as a list."
});

class UsgsQuakesUpdateButtonCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set hass(hass) {
    const serviceDomain = "usgs_quakes";
    const serviceName = "force_feed_update";
    const lang = hass.locale.language;

    const translations = {
      en: "Force Update",
      es: "Forzar Actualización",
      fr: "Forcer la Mise à Jour",
      de: "Aktualisierung Erzwingen",
      it: "Forza Aggiornamento"
    };

    const buttonText = translations[lang] || translations["en"];

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

customElements.define("usgs-quakes-update-button-card", UsgsQuakesUpdateButtonCard);

window.customCards.push({
  type: "usgs-quakes-update-button-card",
  name: "USGS Quakes - Update Button",
  preview: false,
  description: "Card to force update of USGS Quakes feed."
});

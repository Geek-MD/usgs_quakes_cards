class UsgsQuakesEventsList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set hass(hass) {
    const entity = this.config.entity;
    const stateObj = hass.states[entity];

    if (!stateObj) {
      this.shadowRoot.innerHTML = `<ha-card>Entity not found: ${entity}</ha-card>`;
      return;
    }

    const events = stateObj.attributes?.events;
    if (!Array.isArray(events) || events.length === 0) {
      this.shadowRoot.innerHTML = `<ha-card>No events available in '${entity}'</ha-card>`;
      return;
    }

    const listItems = events.map(ev => `
      <li style="margin-bottom: 10px;">
        <strong>${ev.title}</strong><br/>
        <small>${ev.date_time} - <a href="https://www.google.com/maps?q=${ev.latitude},${ev.longitude}" target="_blank">View on map</a></small>
      </li>
    `).join("");

    this.shadowRoot.innerHTML = `
      <ha-card header="USGS Quakes - Events">
        <ul style="padding: 16px; list-style: none; margin: 0;">
          ${listItems}
        </ul>
      </ha-card>
    `;
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("Missing required 'entity' in configuration.\n\nExample:\n  type: custom:usgs-quakes-events-list\n  entity: sensor.usgs_quakes_latest");
    }
    this.config = config;
  }

  getCardSize() {
    return 4;
  }
}

customElements.define("usgs-quakes-events-list", UsgsQuakesEventsList);

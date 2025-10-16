class UsgsQuakesEventsList extends HTMLElement {
  set hass(hass) {
    const stateObj = hass.states[this.config.entity];
    const events = stateObj?.attributes?.events || [];

    this.innerHTML = `
      <ha-card header="USGS Quakes - Events">
        <ul style="padding: 16px;">
          ${events.map(ev => `
            <li style="margin-bottom: 10px;">
              <strong>${ev.title}</strong><br/>
              <small>${ev.date_time} - <a href="https://www.google.com/maps?q=${ev.latitude},${ev.longitude}" target="_blank">View on map</a></small>
            </li>
          `).join("")}
        </ul>
      </ha-card>
    `;
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("Entity required");
    }
    this.config = config;
  }

  getCardSize() {
    return 4;
  }
}

customElements.define("usgs-quakes-events-list", UsgsQuakesEventsList);

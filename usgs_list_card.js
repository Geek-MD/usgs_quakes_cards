class UsgsQuakesListCard extends HTMLElement {
  set hass(hass) {
    const stateObj = hass.states[this.config.entity];
    const events = stateObj?.attributes?.events || [];

    if (!Array.isArray(events) || events.length === 0) {
      this.innerHTML = `
        <ha-card header="USGS Quakes - Events">
          <div style="padding: 16px;">No earthquake events found</div>
        </ha-card>`;
      return;
    }

    const listItems = events
      .map(ev => {
        const coordsUrl = `https://www.google.com/maps?q=${ev.latitude},${ev.longitude}`;
        return `
          <li style="margin-bottom: 16px; padding-left: 8px;">
            <span style="margin-left: -8px;">•</span>
            <div style="margin-left: 8px;">
              <div><strong>${ev.title}</strong></div>
              <div>Magnitude: ${ev.magnitude}</div>
              <div>${ev.date_time}</div>
              <div><a href="${coordsUrl}" target="_blank">View on map</a></div>
            </div>
          </li>
        `;
      })
      .join("");

    this.innerHTML = `
      <ha-card header="USGS Quakes - Events">
        <ul style="padding: 16px; list-style: none; margin: 0;">
          ${listItems}
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
    return 5;
  }
}

customElements.define("usgs-list-card", UsgsQuakesListCard);

// Register this card for Lovelace UI support
window.customCards = window.customCards || [];
window.customCards.push({
  type: "usgs-list-card",
  name: "USGS Quakes - List Card",
  description: "A list card that displays recent USGS earthquake events from a sensor's attributes."
});

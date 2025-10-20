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
        const coords = ev.coordinates;
        const hasCoords =
          Array.isArray(coords) &&
          coords.length === 2 &&
          Number.isFinite(coords[0]) &&
          Number.isFinite(coords[1]);

        const lat = hasCoords ? coords[0] : null;
        const lon = hasCoords ? coords[1] : null;
        const coordsUrl = hasCoords
          ? `https://www.google.com/maps?q=${lat},${lon}`
          : null;

        return `
          <li style="margin-bottom: 8px; padding-left: 8px;">
            <span style="margin-left: -8px;">• <strong>${ev.title}</strong></span><br/>
            <div style="margin-left: 8px;">
              <span>Magnitude: ${ev.magnitude}</span><br/>
              <span>${ev.date_time || ev.time || ""}</span><br/>
              ${coordsUrl ? `<a href="${coordsUrl}" target="_blank">View on map</a>` : ""}
            </div>
          </li>
        `;
      })
      .join("");

    this.innerHTML = `
      <ha-card header="USGS Quakes - Events">
        <ul style="padding: 8px 16px 16px 16px; list-style: none; margin: 0;">
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

window.customCards = window.customCards || [];
window.customCards.push({
  type: "usgs-list-card",
  name: "USGS Quakes - List Card",
  description: "Displays a list of recent USGS earthquake events from a sensor."
});

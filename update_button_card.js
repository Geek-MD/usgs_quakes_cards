class UsgsQuakesUpdateButton extends HTMLElement {
  set hass(hass) {
    this.hass = hass;
    this.innerHTML = `
      <ha-card>
        <div style="padding: 16px;">
          <mwc-button raised @click="${() => this.updateFeed()}">Update USGS Feed</mwc-button>
        </div>
      </ha-card>
    `;
  }

  updateFeed() {
    this.hass.callService("usgs_quakes", "force_feed_update", {});
  }

  setConfig(config) {
    this.config = config;
  }

  getCardSize() {
    return 1;
  }
}

customElements.define("usgs-quakes-update-button", UsgsQuakesUpdateButton);

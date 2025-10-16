class UsgsQuakesUpdateButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set hass(hass) {
    this.hass = hass;
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <ha-card>
        <div style="padding: 16px;">
          <mwc-button raised id="updateBtn">Update USGS Feed</mwc-button>
        </div>
      </ha-card>
    `;

    this.shadowRoot.getElementById("updateBtn")?.addEventListener("click", () => this.updateFeed());
  }

  updateFeed() {
    if (!this.hass) {
      console.error("Home Assistant instance not available.");
      return;
    }

    this.hass.callService("usgs_quakes", "force_feed_update", {});
  }

  setConfig(config) {
    this.config = config || {};
  }

  getCardSize() {
    return 1;
  }
}

customElements.define("usgs-quakes-update-button", UsgsQuakesUpdateButton);

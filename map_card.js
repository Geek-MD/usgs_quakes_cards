class UsgsQuakesMap extends HTMLElement {
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

    const events = stateObj.attributes.events;
    if (!Array.isArray(events) || events.length === 0) {
      this.shadowRoot.innerHTML = `<ha-card>No earthquake events found in entity '${entity}'</ha-card>`;
      return;
    }

    const coords = events
      .map((e) => [parseFloat(e.latitude), parseFloat(e.longitude)])
      .filter((e) => e.every(Number.isFinite));

    if (coords.length === 0) {
      this.shadowRoot.innerHTML = `<ha-card>No valid coordinates found</ha-card>`;
      return;
    }

    const lats = coords.map((c) => c[0]);
    const lons = coords.map((c) => c[1]);
    const latCenter = (Math.min(...lats) + Math.max(...lats)) / 2;
    const lonCenter = (Math.min(...lons) + Math.max(...lons)) / 2;

    this.shadowRoot.innerHTML = `
      <ha-card header="USGS Quakes - Map">
        <div id="map" style="height: 400px;"></div>
      </ha-card>
    `;

    if (!window.L) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => this.renderMap(coords, latCenter, lonCenter);
      document.head.appendChild(script);
    } else {
      this.renderMap(coords, latCenter, lonCenter);
    }
  }

  renderMap(coords, lat, lon) {
    const mapEl = this.shadowRoot.getElementById("map");
    const map = window.L.map(mapEl).setView([lat, lon], 4);
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    coords.forEach(([lat, lon]) => {
      window.L.marker([lat, lon]).addTo(map);
    });

    const bounds = window.L.latLngBounds(coords);
    map.fitBounds(bounds, { padding: [20, 20] });
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("Missing required 'entity' in configuration.\n\nExample:\n  type: custom:usgs-quakes-map\n  entity: sensor.usgs_quakes_latest");
    }
    this.config = config;
  }

  getCardSize() {
    return 5;
  }
}

customElements.define("usgs-quakes-map", UsgsQuakesMap);

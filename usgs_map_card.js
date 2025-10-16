class UsgsQuakesMap extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set hass(hass) {
    const geoEntities = Object.entries(hass.states).filter(
      ([entity_id, state]) =>
        entity_id.startsWith("geo_location.") &&
        state.attributes?.source === "usgs_quakes" &&
        Number.isFinite(parseFloat(state.attributes.latitude)) &&
        Number.isFinite(parseFloat(state.attributes.longitude))
    );

    if (geoEntities.length === 0) {
      this.shadowRoot.innerHTML = `
        <ha-card>
          <div style="padding: 16px;">No USGS Quake entities found.</div>
        </ha-card>`;
      return;
    }

    const coords = geoEntities.map(([_, e]) => [
      parseFloat(e.attributes.latitude),
      parseFloat(e.attributes.longitude)
    ]);

    const lats = coords.map(c => c[0]);
    const lons = coords.map(c => c[1]);
    const latCenter = (Math.min(...lats) + Math.max(...lats)) / 2;
    const lonCenter = (Math.min(...lons) + Math.max(...lons)) / 2;

    // Clean shadow root
    this.shadowRoot.innerHTML = `
      <ha-card header="USGS Quakes - Map">
        <div id="map" style="height: 400px; width: 100%; border-radius: 8px;"></div>
      </ha-card>
    `;

    // Load Leaflet if not already loaded
    if (!window.L || !window.L.map) {
      const leafletCss = document.createElement("link");
      leafletCss.rel = "stylesheet";
      leafletCss.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(leafletCss);

      const leafletJs = document.createElement("script");
      leafletJs.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      leafletJs.onload = () => this.renderMap(coords, latCenter, lonCenter);
      document.head.appendChild(leafletJs);
    } else {
      this.renderMap(coords, latCenter, lonCenter);
    }
  }

  renderMap(coords, lat, lon) {
    const mapEl = this.shadowRoot.getElementById("map");
    if (!mapEl) return;

    const map = window.L.map(mapEl).setView([lat, lon], 5);

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    coords.forEach(([lat, lon]) => {
      window.L.marker([lat, lon]).addTo(map);
    });

    const bounds = window.L.latLngBounds(coords);
    map.fitBounds(bounds, { padding: [20, 20] });

    // Optional: show a circle for the configured radius (~50km as default)
    const circle = window.L.circle([lat, lon], {
      radius: 50000, // 50km
      color: "#007BFF",
      fillOpacity: 0.05
    });
    circle.addTo(map);
  }

  setConfig(config) {
    this.config = config || {};
  }

  getCardSize() {
    return 5;
  }
}

customElements.define("usgs-quakes-map", UsgsQuakesMap);

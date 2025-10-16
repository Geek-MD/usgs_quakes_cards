class UsgsQuakesMapCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set hass(hass) {
    if (!this.config || !this.config.entity) return;

    const stateObj = hass.states[this.config.entity];

    if (!stateObj) {
      this._renderError(`Entity not found: ${this.config.entity}`);
      return;
    }

    const allEvents = stateObj.attributes.events || [];
    const max = this.config.max_events || 50;
    const events = allEvents.slice(0, max);

    const coords = events
      .map(e => [parseFloat(e.latitude), parseFloat(e.longitude)])
      .filter(e => e.every(Number.isFinite));

    if (coords.length === 0) {
      this._renderError("No events to display");
      return;
    }

    const lats = coords.map(c => c[0]);
    const lons = coords.map(c => c[1]);
    const latCenter = (Math.min(...lats) + Math.max(...lats)) / 2;
    const lonCenter = (Math.min(...lons) + Math.max(...lons)) / 2;

    this._renderCard(coords, latCenter, lonCenter);
  }

  _renderCard(coords, lat, lon) {
    const tileURL = this.config.tile_url || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    const zoom = this.config.zoom || 4;

    this.shadowRoot.innerHTML = `
      <style>
        #map {
          height: 400px;
          border-radius: 6px;
        }
        ha-card {
          padding: 0;
        }
      </style>
      <ha-card header="USGS Quakes - Map">
        <div id="map"></div>
      </ha-card>
    `;

    const render = () => {
      const mapEl = this.shadowRoot.getElementById("map");

      if (this._leafletMap) {
        this._leafletMap.remove();
      }

      this._leafletMap = window.L.map(mapEl).setView([lat, lon], zoom);
      window.L.tileLayer(tileURL, {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this._leafletMap);

      coords.forEach(([lat, lon]) => {
        window.L.marker([lat, lon]).addTo(this._leafletMap);
      });

      const bounds = window.L.latLngBounds(coords);
      this._leafletMap.fitBounds(bounds, { padding: [20, 20] });
    };

    this._ensureLeafletLoaded(render);
  }

  _renderError(message) {
    this.shadowRoot.innerHTML = `
      <ha-card header="USGS Quakes - Map">
        <div style="padding: 16px; color: var(--error-color);">
          ${message}
        </div>
      </ha-card>
    `;
  }

  _ensureLeafletLoaded(callback) {
    if (window.L) {
      callback();
      return;
    }

    const leafletCSS = document.querySelector('link[href*="leaflet.css"]');
    if (!leafletCSS) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const leafletJS = document.querySelector('script[src*="leaflet.js"]');
    if (!leafletJS) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = callback;
      document.head.appendChild(script);
    } else if (leafletJS.onload) {
      leafletJS.onload = callback;
    } else {
      leafletJS.addEventListener("load", callback);
    }
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("The 'entity' field is required");
    }
    this.config = config;
  }

  getCardSize() {
    return 5;
  }
}

customElements.define("usgs-quakes-map", UsgsQuakesMapCard);

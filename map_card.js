class UsgsQuakesMap extends HTMLElement {
  set hass(hass) {
    const geoEntities = Object.entries(hass.states)
      .filter(
        ([entity_id, state]) =>
          entity_id.startsWith("geo_location.") &&
          state.attributes?.source === "usgs_quakes" &&
          Number.isFinite(parseFloat(state.attributes.latitude)) &&
          Number.isFinite(parseFloat(state.attributes.longitude))
      );

    if (geoEntities.length === 0) {
      this.innerHTML = `
        <ha-card>
          <div style="padding: 16px;">No quake entities found</div>
        </ha-card>`;
      return;
    }

    const coords = geoEntities.map(([_, e]) => [
      parseFloat(e.attributes.latitude),
      parseFloat(e.attributes.longitude),
    ]);

    const lats = coords.map((c) => c[0]);
    const lons = coords.map((c) => c[1]);
    const latCenter = (Math.min(...lats) + Math.max(...lats)) / 2;
    const lonCenter = (Math.min(...lons) + Math.max(...lons)) / 2;

    this.innerHTML = `
      <ha-card header="USGS Quakes - Map">
        <div id="map" style="height: 400px;"></div>
      </ha-card>
    `;

    if (!window.L || !window.L.map) {
      const leafletCss = document.createElement("link");
      leafletCss.rel = "stylesheet";
      leafletCss.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(leafletCss);

      const leafletJs = document.createElement("script");
      leafletJs.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      leafletJs.onload = () =>
        this.renderMap(coords, latCenter, lonCenter);
      document.head.appendChild(leafletJs);
    } else {
      this.renderMap(coords, latCenter, lonCenter);
    }
  }

  renderMap(coords, lat, lon) {
    const mapEl =
      this.shadowRoot?.getElementById("map") || this.querySelector("#map");
    const map = window.L.map(mapEl).setView([lat, lon], 4);
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    coords.forEach(([lat, lon]) => {
      window.L.marker([lat, lon]).addTo(map);
    });

    const bounds = window.L.latLngBounds(coords);
    map.fitBounds(bounds, { padding: [20, 20] });
  }

  setConfig(config) {
    // No config.entity required
    this.config = config || {};
  }

  getCardSize() {
    return 5;
  }
}

customElements.define("usgs-quakes-map", UsgsQuakesMap);

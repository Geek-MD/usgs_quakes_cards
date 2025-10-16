class UsgsQuakesMap extends HTMLElement {
  set hass(hass) {
    this.hass = hass;

    // Buscar entidades geo_location del source "usgs_quakes"
    const geoEntities = Object.entries(hass.states)
      .filter(
        ([entity_id, state]) =>
          entity_id.startsWith("geo_location.") &&
          state.attributes?.source === "usgs_quakes" &&
          state.attributes.latitude &&
          state.attributes.longitude
      );

    if (geoEntities.length === 0) {
      this.innerHTML = `<ha-card>No USGS Quakes found</ha-card>`;
      return;
    }

    const coords = geoEntities.map(([_, state]) => [
      parseFloat(state.attributes.latitude),
      parseFloat(state.attributes.longitude),
    ]);

    const titles = geoEntities.map(([_, state]) => state.attributes.friendly_name);

    const latitudes = coords.map(([lat]) => lat);
    const longitudes = coords.map(([, lon]) => lon);
    const latCenter = (Math.min(...latitudes) + Math.max(...latitudes)) / 2;
    const lonCenter = (Math.min(...longitudes) + Math.max(...longitudes)) / 2;

    this.innerHTML = `
      <ha-card header="USGS Quakes - Map">
        <div id="map" style="height: 400px;"></div>
      </ha-card>
    `;

    // Cargar Leaflet si no está presente
    if (!window.L) {
      const leafletCSS = document.createElement("link");
      leafletCSS.rel = "stylesheet";
      leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(leafletCSS);

      const leafletJS = document.createElement("script");
      leafletJS.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      leafletJS.onload = () => this.renderMap(coords, titles, latCenter, lonCenter);
      document.head.appendChild(leafletJS);
    } else {
      this.renderMap(coords, titles, latCenter, lonCenter);
    }
  }

  renderMap(coords, titles, lat, lon) {
    const mapEl = this.shadowRoot?.getElementById("map") || this.querySelector("#map");
    const map = window.L.map(mapEl).setView([lat, lon], 4);

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    coords.forEach(([latitude, longitude], index) => {
      window.L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(titles[index]);
    });

    const bounds = window.L.latLngBounds(coords);
    map.fitBounds(bounds, { padding: [20, 20] });
  }

  setConfig(config) {
    // No se requiere config.entity porque se auto-descubren las entidades
    this.config = config || {};
  }

  getCardSize() {
    return 5;
  }
}

customElements.define("usgs-quakes-map", UsgsQuakesMap);

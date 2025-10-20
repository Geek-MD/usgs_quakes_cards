# 🌍 USGS Quakes - List Card

A custom Lovelace card that displays recent USGS earthquake events retrieved from the `sensor.usgs_quakes_latest` entity.

---

## 📦 Features

- Simple, clean list of recent earthquakes.
- Fully compatible with **USGS Quakes integration**.
- Displays:
  - **Title**
  - **Magnitude**
  - **Date & time**
  - **Link to Google Maps** location (based on `coordinates` array in each event)
- Easy to install via HACS and Lovelace UI.
- Responsive layout with consistent spacing.

---

## 🚀 Installation

### Through HACS (Recommended)

1. Go to **HACS > Frontend**.
2. Click the **3 dots > Custom repositories**.
3. Add:
   - **URL**: `https://github.com/Geek-MD/USGS_Quakes_Cards`
   - **Category**: `Lovelace`
4. Search for **USGS Quakes - List Card** and install.
5. Ensure this resource is added automatically:

```yaml
url: /hacsfiles/usgs_quakes_cards/usgs_list_card.js
type: module
```

If not, add it manually under **Configuration > Dashboards > Resources**.

---

## 🧩 Usage

Add the card from Lovelace UI or manually using YAML:

### From UI
1. Click **Add Card**.
2. Scroll to **Custom: USGS Quakes - List Card**.
3. Set the `entity` field to the sensor ID (usually `sensor.usgs_quakes_latest` or `sensor.usgs_quakes_feed_usgs_quakes_latest` depending on configuration).

### YAML example

```yaml
type: custom:usgs-list-card
entity: sensor.usgs_quakes_latest
```

> 🔁 Make sure the entity contains the attribute `events` as a list of earthquake data. This is automatically provided by the [USGS Quakes Integration](https://github.com/Geek-MD/USGS_Quakes).

---

## 🧪 Development

The card registers itself using `window.customCards`, allowing it to be added via the Lovelace UI.

All data is pulled from the `events` attribute of the sensor, and each entry is expected to include:
```yaml
title: M 5.2 - near location
magnitude: 5.2
time: 2025-10-15T12:00:00.000Z
coordinates: [-30.12, -71.45]
```

---

## 📘 Requirements

- Home Assistant 2023.6 or later.
- The `usgs_quakes` custom integration installed and configured.

---

## 👤 Author

**Edison Montes** – [@_GeekMD_](https://github.com/Geek-MD)  
Part of the [USGS Quakes Project](https://github.com/Geek-MD/USGS_Quakes)

---

## 📄 License

MIT License

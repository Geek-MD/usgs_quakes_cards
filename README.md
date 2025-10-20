# 🌍 USGS Quakes Cards

Custom Lovelace cards to display **recent USGS earthquake events** in Home Assistant.  
Designed to work with the integration [**USGS Quakes**](https://github.com/Geek-MD/USGS_Quakes).

---

## 📦 Features

- **USGS Quakes - Event List Card**
  - Displays recent earthquakes from the `sensor.usgs_quakes_latest` attributes.
  - Includes:
    - **Title**
    - **Location**
    - **Magnitude**
    - **Datetime** (converted to local time)
    - **Google Maps link**
  - Automatically styled with alternating background colors.
  - Fully localized (`en`, `es` supported).

- **USGS Quakes - Update Button Card**
  - Allows manual refresh of the earthquake feed.
  - Stylized button with integration icon and translated text.
  - Calls the `usgs_quakes.force_feed_update` service.

---

## 🛠️ Installation

1. Install via [HACS](https://hacs.xyz/):
   - Add this repo as a custom repository (Lovelace plugin).
   - Search for **USGS Quakes Cards** and install.

2. Add to Lovelace Resources (if not auto-added):
   ```yaml
   - url: /hacsfiles/usgs_quakes_card/usgs_quakes_card.js
     type: module
   ```

3. Use the UI card picker to add:
   - `USGS Quakes Card`
   - `USGS Quakes - Update Button`

---

## ✨ Example YAML (optional)

```yaml
type: custom:usgs-quakes-card
entity: sensor.usgs_quakes_latest
```

```yaml
type: custom:usgs-quakes-update-button-card
```

---

## 🌐 Supported Languages

- English (`en`)
- Español (`es`)

---

## 🔗 Related Projects

- 🔌 [USGS Quakes Integration](https://github.com/Geek-MD/USGS_Quakes)
- 💥 [Earthquake data from USGS](https://earthquake.usgs.gov/)

---

## 👤 Author

Developed by Edison Montes [@_GeekMD_](https://github.com/Geek-MD)  
[https://github.com/Geek-MD/usgs_quakes_cards](https://github.com/Geek-MD/usgs_quakes_cards)

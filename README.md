[![Geek-MD - USGS Quakes Cards](https://img.shields.io/static/v1?label=Geek-MD&message=USGS%20Quakes%20Cards&color=blue&logo=github)](https://github.com/Geek-MD/usgs_quakes_cards)
[![Stars](https://img.shields.io/github/stars/Geek-MD/usgs_quakes_cards?style=social)](https://github.com/Geek-MD/usgs_quakes_cards)
[![Forks](https://img.shields.io/github/forks/Geek-MD/usgs_quakes_cards?style=social)](https://github.com/Geek-MD/usgs_quakes_cards)

[![GitHub Release](https://img.shields.io/github/release/Geek-MD/usgs_quakes_cards?include_prereleases&sort=semver&color=blue)](https://github.com/Geek-MD/usgs_quakes_cards/releases)
[![License](https://img.shields.io/badge/License-MIT-blue)](#license)
![HACS Plugin](https://img.shields.io/badge/HACS-Plugin-blue)

# USGS Quakes Cards

**USGS Quakes Cards** is a set of Lovelace UI cards to display earthquake information from the [USGS Quakes](https://github.com/Geek-MD/USGS_Quakes) integration in [Home Assistant](https://www.home-assistant.io).

---

## 📦 Cards Included

### ✅ List Card (`usgs-quakes-list-card`)
Displays a scrollable list of recent earthquakes pulled from the sensor `sensor.usgs_quakes_latest`.

### 🔘 Update Button Card (`usgs-quakes-update-button-card`)
A configurable button that lets you manually refresh the USGS Quakes feed.

---

## 📦 Installation

### Option 1: HACS (Recommended)
1. Open HACS in Home Assistant.
2. Go to **Frontend → Custom Repositories**.
3. Add:
   ```
   https://github.com/Geek-MD/usgs_quakes_cards
   ```
   Choose type: **Plugin**.
4. Click "Add" and install the plugin.
5. Restart Home Assistant.

### Option 2: Manual Installation
1. Download this repository.
2. Copy all `.js` files to:
   ```
   /config/www/community/usgs_quakes_cards/
   ```
3. Add the following to your `configuration.yaml` or via **Resources** in the UI:
   ```yaml
   url: /local/community/usgs_quakes_cards/usgs_quakes_card.js
   type: module
   ```
4. Restart Home Assistant.

---

## 🧩 Card Types

### 1. `usgs-quakes-list-card`
Shows a list of formatted events pulled from the `sensor.usgs_quakes_latest` attributes.

- Supports translation.
- Works fully with UI editor.

### 2. `usgs-quakes-update-button-card`
Displays a rounded button with icon and label that calls `usgs_quakes.force_feed_update` when clicked.

- Fully customizable via UI: icon, label, service.
- Supports translation.

---

## 🛠️ YAML Configuration Examples

### List Card (`usgs-quakes-list-card`)

```yaml
type: custom:usgs-quakes-list-card
title: "Recent Earthquakes"
entity: sensor.usgs_quakes_latest
```

| Option   | Description                                        | Default                      |
|----------|----------------------------------------------------|------------------------------|
| `title`  | Custom title shown at the top of the card          | *(none)*                     |
| `entity` | Sensor entity providing the earthquake data        | `sensor.usgs_quakes_latest` |

---

### Button Card (`usgs-quakes-update-button-card`)

```yaml
type: custom:usgs-quakes-update-button-card
name: "Refresh Feed"
icon: mdi:earth
service: usgs_quakes.force_feed_update
```

| Option    | Description                                     | Default                          |
|-----------|-------------------------------------------------|----------------------------------|
| `name`    | Text displayed on the button                    | _(Translated)_ "Force Update"    |
| `icon`    | Icon shown on the button (Material Design icon) | `mdi:reload`                     |
| `service` | Service to call when the button is pressed      | `usgs_quakes.force_feed_update` |

---

## 🌐 Translations

The cards support localization and will auto-adjust based on the user's language in Home Assistant. Currently supported languages:

- English (default)
- Spanish
- French
- German
- Italian

More languages coming soon. Contributions welcome!

---

## 📄 License

MIT © Edison Montes [_@GeekMD_](https://github.com/Geek-MD)

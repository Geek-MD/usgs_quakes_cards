# USGS Quakes Cards

This repository provides **Lovelace cards** to visualize **USGS Earthquake data** collected via the [USGS Quakes integration](https://github.com/Geek-MD/USGS_Quakes) for Home Assistant.

Currently available cards:

- **🧾 List Card**: Displays a clean, readable list of the latest earthquake events from the integration.
- *(Coming soon: Map Card)*

---

## 📦 Installation via HACS

1. Go to **HACS > Frontend**.
2. Click the three dots (⋮) in the top right and select **Custom repositories**.
3. Add this repository:  
   ```
   https://github.com/Geek-MD/usgs_quakes_cards
   ```
   Select **Lovelace** as category.
4. Install the **USGS Quakes Cards**.
5. After installation, **refresh your browser cache** (Ctrl+F5 or Cmd+Shift+R).

---

## 🧾 USGS List Card

This card displays the list of recent earthquakes retrieved by the `sensor.usgs_quakes_latest`, including:

- Title
- Magnitude
- Date and time
- Link to view location on Google Maps

### ➕ Adding the card

Once installed, you can:

- Add it **from the UI**:
  - Go to your Lovelace dashboard
  - Click **Add Card** > **Custom** > **USGS Quakes - List Card**
- Or add it manually via YAML:

```yaml
type: custom:usgs-list-card
entity: sensor.usgs_quakes_latest
```

### 🔍 Example Output

Each earthquake event is displayed with:
- A bullet point
- The event title in **bold**
- Magnitude and timestamp
- A link to view the coordinates on a map

---

## 🛠 Requirements

- You must have the [USGS Quakes](https://github.com/Geek-MD/USGS_Quakes) integration installed and configured.
- The `sensor.usgs_quakes_latest` must be available and contain recent events.

---

## 📁 File Structure

| File                  | Description                                      |
|-----------------------|--------------------------------------------------|
| `usgs_list_card.js`   | Main list card component                         |
| `hacs.json`           | HACS metadata file                               |
| `README.md`           | This file                                        |
| `.github/workflows/`  | GitHub Actions validation for HACS compliance    |

---

## 👨‍💻 Author

Developed by [Geek-MD](https://github.com/Geek-MD)  
Check out the full USGS integration here:  
👉 https://github.com/Geek-MD/USGS_Quakes

---

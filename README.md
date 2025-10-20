# USGS Quakes Cards

Custom Lovelace cards for the [USGS Quakes](https://github.com/Geek-MD/USGS_Quakes) integration in Home Assistant.

These cards enhance the earthquake monitoring experience by providing a visual map, a list of recent events, and a quick update button.

## Cards Included

- **Map Card (`usgs-map-card`)**  
  Displays all recent earthquakes on an interactive map with auto-zoom.

## Installation

1. Copy the contents of the `dist/` folder (or download from [Releases](https://github.com/Geek-MD/usgs_quakes_cards/releases)) into your Home Assistant `www/usgs_quakes_cards/` folder.
2. In **Home Assistant → Settings → Dashboards → Resources**, add:

```yaml
# Example for each card
url: /local/usgs_quakes_cards/map_card.js
type: module
```

3. Refresh your browser (Ctrl + F5).
4. Use the cards in your Lovelace dashboard via manual YAML configuration.

## Example Usage

```yaml
type: custom:usgs-quakes-map
```

## License

MIT © Edison Montes [@Geek-MD](https://github.com/Geek-MD)

import { terser } from "rollup-plugin-terser";

export default {
  input: {
    "map_card": "src/map_card.js",
    "events_list_card": "src/events_list_card.js",
    "update_button_card": "src/update_button_card.js"
  },
  output: {
    dir: "dist",
    format: "es",
    entryFileNames: "[name].js"
  },
  plugins: [terser()]
};

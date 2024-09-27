/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from "./vuetify";
import { router } from "@/router";
import { pinia } from "@/store";

import { Chart, registerables } from "chart.js";

// Types
import type { App } from "vue";

export function registerPlugins(app: App) {
  Chart.register(...registerables);
  app.use(vuetify).use(router).use(pinia);
}

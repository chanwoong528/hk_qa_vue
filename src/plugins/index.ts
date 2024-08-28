/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from "./vuetify";
import { router } from "@/router";
import { pinia } from "@/store";

import { VueQueryPlugin } from '@tanstack/vue-query'


// Types
import type { App } from "vue";

export function registerPlugins(app: App) {
  app
    .use(router)
    .use(vuetify)
    .use(pinia)
    .use(VueQueryPlugin, {
      enableDevtoolsV6Plugin: true,
    })

}

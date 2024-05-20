import { createMemoryHistory, createRouter } from "vue-router";

import HomeView from "@/pages/HomeView.vue";
import AboutView from "@/pages/AboutView.vue";

// Composables
export const routes = [
  { path: "/", component: HomeView, label: "Home" },
  { path: "/about", component: AboutView, label: "About" },
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

import { createMemoryHistory, createRouter } from "vue-router";

import HomeView from "@/pages/HomeView.vue";
import AboutView from "@/pages/AboutView.vue";
import LoginView from "@/pages/LoginView.vue";

// Composables
export const routes = [
  { path: "/", component: HomeView, label: "Home" },
  { path: "/about", component: AboutView, label: "About" },
  { path: "/login", component: LoginView, label: "Login" },
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

import { createMemoryHistory, createRouter } from "vue-router";

import HomeView from "@/pages/HomeView.vue";
import AboutView from "@/pages/AboutView.vue";
import LoginView from "@/pages/LoginView.vue";

// Composables
export const NAV_LIST = [
  {
    path: "/",
    component: HomeView,
    label: "Home",
    meta: { requiresAuth: true },
  },
  {
    path: "/about",
    component: AboutView,
    label: "About",
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    component: LoginView,
    label: "Login",
    meta: { requiresAuth: false },
  },
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes: NAV_LIST,
});

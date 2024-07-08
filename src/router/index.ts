import { createWebHistory, createRouter } from "vue-router";

import HomeView from "@/pages/HomeView.vue";
import LoginView from "@/pages/LoginView.vue";
import UsersView from "@/pages/UsersView.vue";
import type { Component } from "vue";

interface NavItem {
  path: string;
  component: Component,
  label: string;
  meta: {
    requiresAuth?: boolean
    requiresAdmin?: boolean,
    requiresMaster?: boolean,
  },
}


// Composables
export const NAV_LIST: NavItem[] = [
  {
    path: "/",
    component: HomeView,
    label: "Home",
    meta: { requiresAuth: true },
  },
  {
    path: "/user",
    component: UsersView,
    label: "Users",
    meta: {
      requiresAuth: true,
      requiresMaster: true
    },
  },
  {
    path: "/login",
    component: LoginView,
    label: "Login",
    meta: { requiresAuth: false },
  },
];

export const router = createRouter({

  history: createWebHistory('/'),
  routes: NAV_LIST,
});

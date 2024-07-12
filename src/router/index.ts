import { createWebHistory, createRouter } from "vue-router";
import type { Component } from "vue";

import HomeView from "@/pages/HomeView.vue";
import LoginView from "@/pages/LoginView.vue";
import UsersView from "@/pages/UsersView.vue";
import SwTypeDetailView from "@/pages/SwTypeDetailView.vue";

interface NavItem {
  path: string;
  component: Component,
  label: string;
  directTo?: string; // for dynamic route
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
    path: "/sw-type/:id",
    directTo: "/sw-type/",
    component: SwTypeDetailView,
    label: "SW Type Detail",
    meta: {
      requiresAuth: true,
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

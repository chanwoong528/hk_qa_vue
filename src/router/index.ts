import { createWebHistory, createRouter } from "vue-router";
import type { Component } from "vue";

import HomeView from "@/pages/HomeView.vue";
import LoginView from "@/pages/LoginView.vue";
import UsersView from "@/pages/UsersView.vue";
import BoardDetailView from "@/pages/BoardDetailView.vue";
import SwTypeView from "@/pages/SwTypeView.vue";
import SwTypeDetailView from "@/pages/SwTypeDetailView.vue";
import VerifyView from "@/pages/VerifyView.vue";
import ResetPwView from "@/pages/ResetPwView.vue";

interface NavItem {
  path: string;
  component: Component;
  props?: any;
  label: string;
  code: string;
  directTo?: string; // for dynamic route
  meta: {
    requiresAuth?: boolean;
    requiresAdmin?: boolean;
    requiresMaster?: boolean;
    hidden?: boolean;
  };
}

// Composables
export const NAV_LIST: NavItem[] = [
  {
    path: "/",
    component: HomeView,
    label: "홈",
    code: "Home",
    meta: { requiresAuth: true },
  },
  {
    path: "/user",
    component: UsersView,
    label: "유저 목록",
    code: "Users",
    meta: {
      requiresAuth: true,
      requiresMaster: true,
    },
  },
  {
    path: "/board/:id",
    component: BoardDetailView,
    label: "게시판 상세",
    code: "Board",
    props: true,
    meta: {
      requiresAuth: true,
      hidden: true,
    },
  },
  {
    path: "/sw-type",
    component: SwTypeView,
    label: "HK SW 목록",
    code: "SW list",
    meta: {
      requiresAuth: true,
      requiresMaster: true,
    },
  },
  {
    path: "/sw-type/:id",
    directTo: "/sw-type/",
    component: SwTypeDetailView,
    label: "한국일보 서비스",
    code: "SW Type Detail",
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/login",
    component: LoginView,
    label: "Login",
    code: "Login",
    meta: { requiresAuth: false },
  },
  {
    path: "/verify",
    component: VerifyView,
    label: "Verify Email",
    code: "Verify Email",
    meta: { requiresAuth: false },
  },
  {
    path: "/reset-password",
    component: ResetPwView,
    label: "Reset Password",
    code: "Reset Password",
    meta: { requiresAuth: false },
  },
];

export const router = createRouter({
  history: createWebHistory("/"),
  routes: NAV_LIST,
});

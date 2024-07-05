<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { storeToRefs } from "pinia";

import { NAV_LIST } from "@/router/index.ts";
import { useUserStore } from "@/store/userStore";

import SideHeader from "./SideHeader.vue";
import { authApi } from "@/services/domain/authService";
import type { IUserInfo } from "@/types/types";

const route = useRoute();
const router = useRouter();
const store = useUserStore();
const { isLoggedIn } = storeToRefs(store);

onBeforeMount(() => {
  if (!!localStorage.getItem("accessToken")) {
    authApi
      .GET_loginCheck()
      .then((loginResult) => {
        store.setUser(loginResult as IUserInfo);
        return router.push("/");
      })
      .catch((err) => {
        alert("Session expired. Please login again.");
      });
  }
  store.setResetUser();
  return router.push("/login");
});
</script>
<template>
  <template v-if="!isLoggedIn">
    <template>
      <h1>Hello App!</h1>
      <p>isLoggedIn {{ isLoggedIn }}</p>
    </template>
    <p><strong>Current route path:</strong> {{ route.fullPath }}</p>
    <nav>
      <ul>
        <template v-for="navItem in NAV_LIST">
          <li
            v-if="
              !!isLoggedIn
                ? navItem.meta.requiresAuth
                : !navItem.meta.requiresAuth
            "
          >
            <RouterLink :to="navItem.path"> {{ navItem.label }}</RouterLink>
          </li>
        </template>
      </ul>
    </nav>
  </template>
  <template v-else>
    <SideHeader />
  </template>
</template>

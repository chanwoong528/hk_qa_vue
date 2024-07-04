<script setup lang="ts">
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import { NAV_LIST } from "@/router/index.ts";
import { useUserStore } from "@/store/userStore";
import { is } from "@babel/types";

const route = useRoute();
const router = useRouter();
const store = useUserStore();
const { user, isLoggedIn } = storeToRefs(store);

watch(
  () => [route.fullPath, isLoggedIn.value, user.value?.access_token],
  async (newId, oldId) => {
    console.log("loggedIn>> ", isLoggedIn.value);
    if (!user.value?.access_token) {
      router.push("/login");
      return store.setResetUser();
    }
    if (route.path === "/login") {
      return !!isLoggedIn.value && router.push("/");
    }
    if (route.path !== "/login") {
      return !isLoggedIn.value && router.push("/login");
    }
  }
);
</script>

<template v-if="!isLoggedIn">
  <template v-if="!isLoggedIn">
    <h1>Hello App!</h1>
    <p>isLoggedIn {{ isLoggedIn }}</p>
  </template>

  <template v-else>
    <h1>hello {{ user?.email }}</h1>
  </template>

  <p><strong>Current route path:</strong> {{ route.fullPath }}</p>
  <nav>
    <!-- <v-navigation-drawer>
      <v-list-item title="My Application" subtitle="Vuetify"></v-list-item>
      <v-divider></v-divider>
      <template v-for="navItem in NAV_LIST">
        <v-list-item
          link
          :to="navItem.path"
          v-if="
            !!isLoggedIn
              ? navItem.meta.requiresAuth
              : !navItem.meta.requiresAuth
          "
          >{{ navItem.label }}</v-list-item
        >
      </template>
    </v-navigation-drawer> -->

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

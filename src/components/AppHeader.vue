<script setup lang="ts">
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import { routes } from "@/router/index.ts";
import { useUserStore } from "@/store/userStore";

const route = useRoute();
const router = useRouter();

const store = useUserStore();
const { user } = storeToRefs(store);

watch(
  () => [route.fullPath, user.value?.id],
  async (newId) => {
    if (route.path === "/login") {
      !!user.value?.access_token && router.push("/");
    }
    console.log(newId);
  }
);
</script>

<template>
  <template v-if="!user?.access_token">
    <h1>Hello App!</h1>
  </template>

  <template v-else>
    <h1>hello {{ user.email }}</h1>
  </template>

  <p><strong>Current route path:</strong> {{ route.fullPath }}</p>
  <nav>
    <ul>
      <li v-for="route in routes">
        <RouterLink :to="route.path"> {{ route.label }}</RouterLink>
      </li>
    </ul>
  </nav>
</template>

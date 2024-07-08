<script lang="ts" setup>
import { NAV_LIST } from "@/router/index.ts";
import { useUserStore } from "@/store/userStore";
import { E_Role } from "@/types/enum.d";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const store = useUserStore();
const { user } = storeToRefs(store);

const computedNavList = computed(() => {
  if (!user) return NAV_LIST;

  if (user.value?.role === E_Role.master) return NAV_LIST;

  if (user.value?.role === E_Role.admin)
    return NAV_LIST.filter((navItem) => !navItem.meta.requiresMaster);

  if (user.value?.role === E_Role.tester)
    return NAV_LIST.filter(
      (navItem) => !navItem.meta.requiresAdmin || !navItem.meta.requiresMaster
    );
});
</script>

<template>
  <v-navigation-drawer permanent>
    <v-list-item title="HK QA TEST" :subtitle="user?.username">
      <p>{{ user?.role }}</p>
    </v-list-item>
    <v-divider></v-divider>
    <template v-for="navItem in computedNavList">
      <v-list-item link :to="navItem.path" v-if="!!navItem.meta.requiresAuth">{{
        navItem.label
      }}</v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { NAV_LIST } from "@/router/index.ts";
import { useUserStore } from "@/store/userStore";
import { storeToRefs } from "pinia";

const store = useUserStore();
const { user } = storeToRefs(store);
</script>

<template>
  <v-navigation-drawer permanent>
    <v-list-item title="HK QA TEST" :subtitle="user?.username"></v-list-item>
    <v-divider></v-divider>
    <template v-for="navItem in NAV_LIST">
      <v-list-item link :to="navItem.path" v-if="!!navItem.meta.requiresAuth">{{
        navItem.label
      }}</v-list-item>
    </template>
  </v-navigation-drawer>
</template>

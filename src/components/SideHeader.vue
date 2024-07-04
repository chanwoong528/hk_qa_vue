<script lang="ts" setup>
import { NAV_LIST } from "@/router/index.ts";
</script>

<template>
  <v-navigation-drawer>
    <v-list-item title="My Application" subtitle="Vuetify"></v-list-item>
    <v-divider></v-divider>
    <template v-for="navItem in NAV_LIST">
      <v-list-item link :to="navItem.path" v-if="!!navItem.meta.requiresAuth">{{
        navItem.label
      }}</v-list-item>
    </template>
  </v-navigation-drawer>
</template>

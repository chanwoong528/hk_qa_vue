<script lang="ts" setup>
import AppHeader from "@/components/AppHeader.vue";
import TempSocketInfo from "@/components/TempSocketInfo.vue";
// import { socket, chatMessages, id } from "@/socket/socket";
</script>

<template>
  <v-app>
    <v-main>
      <TempSocketInfo />
      <AppHeader />
      <router-view />
    </v-main>
  </v-app>
</template>

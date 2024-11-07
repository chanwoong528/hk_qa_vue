<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useSwStore } from "@/store/swStore";
import DefaultLayout from "@/layout/DefaultLayout.vue";

import SwList from "@/components/list/SwList.vue";

const swStore = useSwStore();
const { swTypes } = storeToRefs(swStore);
</script>

<template>
  <DefaultLayout>
    <header class="user-header">
      <h3>Service Management</h3>
    </header>

    <SwList v-if="swTypes.length > 0" :sw-list="swTypes" />
  </DefaultLayout>
</template>

<style scoped></style>

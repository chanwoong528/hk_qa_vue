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
    <div class="box-wrap">
    <header class="user-header">
      <h3>Service Management</h3>
    </header>

    <SwList v-if="swTypes.length > 0" :swList="swTypes" />
    </div>
  </DefaultLayout>
</template>

<style scoped>
.user-header {
  padding: 14px 24px 16px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  margin: 0 -24px;
  margin-bottom: 14px;

  h3 {
    font-size: 24px;
    font-weight: 600;
  }
}
</style>

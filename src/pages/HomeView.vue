<script setup lang="ts">
import DefaultLayout from "@/layout/DefaultLayout.vue";
import SwList from "@/components/list/SwList.vue";
import { storeToRefs } from "pinia";
import { useSwStore } from "@/store/swStore";
import { E_SwTypeListType } from "@/types/enum.d";

const swStore = useSwStore();
const { swTypes } = storeToRefs(swStore);
</script>

<template>
  <DefaultLayout>
    <header class="home-header">
      <h3>H(ankookilbo) I(ntelligence) Q(A system)</h3>
    </header>
    <SwList :type="E_SwTypeListType.section" :swList="swTypes" />
  </DefaultLayout>
</template>

<style scoped>
.home-header {
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
}
</style>

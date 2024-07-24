<script setup lang="ts">
import DefaultLayout from "@/layout/DefaultLayout.vue";
import SwList from "@/components/list/SwList.vue";
import { storeToRefs } from "pinia";
import { useSwStore } from "@/store/swStore";

const swStore = useSwStore();
const { swTypes } = storeToRefs(swStore);
</script>

<template>
  <DefaultLayout>
    <header class="home-header">
      <h3>Home</h3>
    </header>
    <SwList :swList="swTypes" />
  </DefaultLayout>
</template>

<style lang="scss" scoped>
@import "./home.scss";
</style>

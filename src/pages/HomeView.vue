<script setup lang="ts">
import { onMounted, ref } from "vue";
import { swApi } from "@/services/domain/swService";
import type { ISwType } from "@/types/types";

import DefaultLayout from "@/layout/DefaultLayout.vue";
import SwList from "@/components/list/SwList.vue";

const swList = ref<ISwType[]>([]);

onMounted(() => {
  swApi.GET_sw().then((swListRes) => {
    swList.value = swListRes as ISwType[];
  });
});
</script>

<template>
  <DefaultLayout>
    <SwList :swList="swList" />
  </DefaultLayout>
</template>

<style lang="scss" scoped>
@import "./home.scss";
</style>

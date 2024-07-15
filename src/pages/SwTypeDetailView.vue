<script setup lang="ts">
import { swVersionApi } from "@/services/domain/swService";
import { ISwVersion } from "@/types/types";
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";

import SwVersionList from "@/components/list/SwVersionList.vue";

const route = useRoute();
const swVersionList = ref<ISwVersion[]>([]);

onMounted(() => {
  swVersionApi
    .GET_swVersionsBySwTypeId(route.params.id as string)
    .then((res) => {
      swVersionList.value = res as ISwVersion[];
    });
});

watch(
  () => route.params.id,
  (newId, oldId) => {
    console.log(newId, oldId);
    swVersionApi.GET_swVersionsBySwTypeId(newId as string).then((res) => {
      swVersionList.value = res as ISwVersion[];
    });
  }
);
</script>

<template>
  <div>{{ swVersionList[0] }}</div>
  <SwVersionList :swVersionList="swVersionList" />
</template>

<style scoped></style>

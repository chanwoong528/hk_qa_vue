<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { useRoute } from "vue-router";

import { storeToRefs } from "pinia";
import { useSwStore } from "@/store/swStore";
import { swVersionApi } from "@/services/domain/swService";
import { testSessionApi } from "@/services/domain/testSessionService";

import type { ISwType, ISwVersion, ITestSession } from "@/types/types";

import SwVersionList from "@/components/list/SwVersionList.vue";
import DefaultLayout from "@/layout/DefaultLayout.vue";

const route = useRoute();
const swVersionList = ref<ISwVersion[]>([]);
const swStore = useSwStore();
const { swTypes } = storeToRefs(swStore);

onMounted(() => onFetchSwVersionList(route.params.id as string));

watch(
  () => route.params.id,
  (newId, _) => onFetchSwVersionList(newId as string)
);

const swTitle = computed(
  () =>
    swTypes.value.find((swType: ISwType) => swType.swTypeId === route.params.id)
      ?.typeTitle
);

const onFetchSwVersionList = (swTypeId: string) => {
  return swVersionApi.GET_swVersionsBySwTypeId(swTypeId).then((res) => {
    swVersionList.value = res as ISwVersion[];
  });
};

const onSubmitStatus = (selectedTestSession: Partial<ITestSession>) => {
  //TODO: typescript better way than partial
  if (!!selectedTestSession.sessionId && !!selectedTestSession.status) {
    testSessionApi
      .PATCH_testSession(
        selectedTestSession.sessionId,
        selectedTestSession.status
      )
      .then((_) => {
        //TODO: handle success instead of call api again
        onFetchSwVersionList(route.params.id as string);
      });
  }
};
</script>

<template>
  <DefaultLayout>
    <h3>Versions for {{ swTitle }}</h3>
    <SwVersionList
      :swVersionList="swVersionList"
      @onSubmitStatus="onSubmitStatus"
    />
  </DefaultLayout>
</template>

<style scoped></style>

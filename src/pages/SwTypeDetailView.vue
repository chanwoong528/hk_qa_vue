<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

import { useUserStore } from "@/store/userStore";
import { useSwStore } from "@/store/swStore";
import { swVersionApi } from "@/services/domain/swService";
import { testSessionApi } from "@/services/domain/testSessionService";

import type { ISwType, ISwVersion, ITestSession } from "@/types/types";
import { E_Role } from "@/types/enum.d";

import SwVersionList from "@/components/list/SwVersionList.vue";
import DefaultLayout from "@/layout/DefaultLayout.vue";
import ModalWrap from "@/components/ModalWrap.vue";
import NewVersionForm from "@/components/form/NewVersionForm.vue";

const route = useRoute();

const userStore = useUserStore();
const { loggedInUser } = storeToRefs(userStore);

const swStore = useSwStore();
const { swTypes } = storeToRefs(swStore);

const swVersionList = ref<ISwVersion[]>([]);
const openModalNewVersion = ref<boolean>(false);
const submitErrorFlag = ref<boolean>(true);

onMounted(() => onFetchSwVersionList(route.params.id as string));

watch(
  () => route.params.id,
  (newId, _) => onFetchSwVersionList(newId as string)
);
watch(
  () => [openModalNewVersion.value, submitErrorFlag.value],
  ([newModalFlag, newErrFlag]) => {
    if (!!newModalFlag) {
      submitErrorFlag.value = true;
    }

    if (!newModalFlag && newErrFlag) {
      let confirmFlag = confirm("Listed below will not be save, Sure to exit?");
      if (!confirmFlag) return (openModalNewVersion.value = true);
    }
  }
);

const curSwTypeInfo = computed(() =>
  swTypes.value.find((swType: ISwType) => swType.swTypeId === route.params.id)
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
        submitErrorFlag.value = true;
        onFetchSwVersionList(route.params.id as string);
      });
  }
};

const onSubmitNewVersion = (
  versionTitle: string,
  versionDesc: string,
  tag: string,
  files?: File
) => {
  if (!!curSwTypeInfo.value?.swTypeId) {
    return swVersionApi
      .POST_swVersion({
        swTypeId: curSwTypeInfo.value.swTypeId,
        versionTitle,
        versionDesc,
        tag,
        files,
      })
      .then((res) => {
        submitErrorFlag.value = false;
        onFetchSwVersionList(res.swType.swTypeId);
        openModalNewVersion.value = false;
      });
  }

  return alert("Error: swTypeId is not found");
};
</script>

<template>
  <ModalWrap v-model="openModalNewVersion" title="Create New Version">
    <NewVersionForm @onSubmitNewVersion="onSubmitNewVersion" />
  </ModalWrap>
  <DefaultLayout>
    <header class="sw-detail-header">
      <h3>Versions for {{ curSwTypeInfo?.typeTitle }}</h3>
      <v-btn
        v-if="loggedInUser?.role !== E_Role.tester"
        variant="elevated"
        color="primary"
        @click="openModalNewVersion = true"
      >
        New Version
        <v-icon icon="mdi-plus"></v-icon>
      </v-btn>
    </header>

    <SwVersionList
      :swVersionList="swVersionList"
      :onFetchSwVersionList="onFetchSwVersionList"
      @onSubmitStatus="onSubmitStatus"
    />
  </DefaultLayout>
</template>

<style scoped>
.sw-detail-header {
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
}
</style>

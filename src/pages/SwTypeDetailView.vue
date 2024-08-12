<script setup lang="ts">
import { ref, watch, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

import { useUserStore } from "@/store/userStore";

import { swVersionApi } from "@/services/domain/swService";
import { testSessionApi } from "@/services/domain/testSessionService";

import type { ISwType, ISwVersion, ITestSession } from "@/types/types";
import { E_ModalType, E_Role } from "@/types/enum.d";

import SwVersionList from "@/components/list/SwVersionList.vue";
import DefaultLayout from "@/layout/DefaultLayout.vue";
import ModalWrap from "@/components/ModalWrap.vue";
import NewVersionForm from "@/components/form/NewVersionForm.vue";
import { useSwStore } from "@/store/swStore";

const route = useRoute();

const userStore = useUserStore();
const { loggedInUser } = storeToRefs(userStore);

const swStore = useSwStore();
const { swTypes } = storeToRefs(swStore);

const swVersionList = ref<ISwVersion[]>([]);
const openModalNewVersion = ref<boolean>(false);
const editVersionFlag = ref<boolean>(false);
const editVersionInfo = reactive<Partial<ISwVersion & { swTypeId: string }>>(
  {}
);

const submitErrorFlag = ref<boolean>(true);
const swTypeInfo = ref<ISwType>();

onMounted(() => onFetchSwVersionList(route.params.id as string));

watch(
  () => [route.params.id, swTypes.value],
  ([newId, newSwTypes]) => {
    if (!!newSwTypes) {
      swTypeInfo.value = swTypes.value.find(
        (swType) => swType.swTypeId === newId
      ) as ISwType;
    }
    onFetchSwVersionList(newId as string);
  }
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

const onFetchSwVersionList = (swTypeId: string) => {
  return swVersionApi
    .GET_swVersionsBySwTypeId(swTypeId)
    .then((res) => (swVersionList.value = res as ISwVersion[]));
};

const onSubmitStatus = (
  selectedTestSession: Partial<ITestSession>,
  dbSavedTestSession: Partial<ITestSession>,
  openModalUpdateStatus: any
) => {
  //TODO: typescript better way than partial
  if (
    !!selectedTestSession.sessionId &&
    !!selectedTestSession.status &&
    !!selectedTestSession.reasonContent
  ) {
    if (
      selectedTestSession.status === dbSavedTestSession.status &&
      selectedTestSession.reasonContent === dbSavedTestSession.reasonContent
    ) {
      return alert("바뀐점이 없습니다.");
    }

    return testSessionApi
      .PATCH_testSession(
        selectedTestSession.sessionId,
        selectedTestSession.status,
        selectedTestSession.reasonContent
      )
      .then((_) => {
        //TODO: handle success instead of call api again
        submitErrorFlag.value = true;
        openModalUpdateStatus.value = false;
        onFetchSwVersionList(route.params.id as string);
      });
  } else {
    return alert("Please fill out all fields");
  }
};

const onSubmitNewVersion = (
  versionTitle: string,
  versionDesc: string,
  tag: string,
  file?: File
) => {
  // console.log("onSubmitNewVersion", versionTitle, versionDesc, tag, file);

  if (!!route.params.id) {
    return swVersionApi
      .POST_swVersion({
        swTypeId: Array.isArray(route.params.id)
          ? route.params.id[0]
          : route.params.id,
        versionTitle,
        versionDesc,
        tag,
        ...(file && { file }),
      })
      .then((res) => {
        submitErrorFlag.value = false;
        onFetchSwVersionList(res.swType.swTypeId);
        openModalNewVersion.value = false;
      });
  }

  return alert("Error: swTypeId is not found");
};

const onSubmitEditVersion = (
  swVersionId: string,
  versionTitle: string,
  versionDesc: string,
  tag: string,
  file?: File
) => {
  return swVersionApi
    .PATCH_swVersion({
      swVersionId,
      versionTitle,
      versionDesc,
      tag,
      ...(file && { file }),
    })
    .then((res) => {
      submitErrorFlag.value = false;
      openModalNewVersion.value = false;
      onFetchSwVersionList(route.params.id as string);
    });
};

const onClickEditVersion = (curSwVer: ISwVersion) => {
  openModalNewVersion.value = true;
  editVersionFlag.value = true;
  // console.log("onClickEditVersion top class", curSwVer);
  Object.assign(editVersionInfo, curSwVer);
};
</script>

<template>
  <ModalWrap
    v-model="openModalNewVersion"
    :title="editVersionFlag ? '버전 정보 수정' : '신규 버전'"
    :type="E_ModalType.full"
  >
    <NewVersionForm
      @onSubmitNewVersion="onSubmitNewVersion"
      @onSubmitEditVersion="onSubmitEditVersion"
      :editFlag="editVersionFlag"
      :editVersionInfo="editVersionInfo"
    />
  </ModalWrap>
  <DefaultLayout>
    <header class="sw-detail-header">
      <h3>{{ swTypeInfo?.typeTitle }} 개발 버전 목록</h3>
      <v-btn
        v-if="loggedInUser?.role !== E_Role.tester"
        variant="outlined"
        color="primary"
        @click="
          () => {
            openModalNewVersion = true;
            editVersionFlag = false;
          }
        "
      >
        새로운 버전 등록
        <v-icon icon="mdi-plus"></v-icon>
      </v-btn>
    </header>

    <SwVersionList
      :swVersionList="swVersionList"
      :onFetchSwVersionList="onFetchSwVersionList"
      @onSubmitStatus="onSubmitStatus"
      @onClickEditVersion="onClickEditVersion"
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

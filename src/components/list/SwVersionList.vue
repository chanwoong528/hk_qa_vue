<script setup lang="ts">
import { reactive, ref } from "vue";
import type { ISwVersion, ITestSession } from "@/types/types";
import SwVersionItem from "@/components/list/SwVersionItem.vue";
import ModalWrap from "@/components/ModalWrap.vue";
import TestStatusForm from "@/components/form/TestStatusForm.vue";
import { E_TestStatus, E_SwVersionModalType } from "@/types/enum.d";

const props = defineProps({
  swVersionList: {
    type: Array as () => ISwVersion[],
  },
});

const emit = defineEmits(["onSubmitStatus"]);
const openModalUpdateStatus = ref<boolean>(false);
const openModalAddTester = ref<boolean>(false);

const selectedTestSession = reactive<Partial<ITestSession>>({
  sessionId: "",
  status: E_TestStatus.pending,
});

const toggleModal = (type?: E_SwVersionModalType) => {
  switch (type) {
    case E_SwVersionModalType.addTester:
      return (openModalAddTester.value = !openModalAddTester.value);
    default:
      return (openModalUpdateStatus.value = !openModalUpdateStatus.value);
  }
};

const onSubmitStatus = () => {
  emit("onSubmitStatus", selectedTestSession);
};

const onClickTester = (testerInfo: ITestSession, loggedInUserId: string) => {
  selectedTestSession.sessionId = testerInfo.sessionId;
  selectedTestSession.status = testerInfo.status;
};

const onClickAddTester = () => {
  console.log("clcickeD! ");
};
</script>

<template>
  <ModalWrap
    v-model="openModalUpdateStatus"
    title="Change Status"
    haveBtnCtl
    @onSubmit="onSubmitStatus"
  >
    <TestStatusForm v-model="selectedTestSession" />
  </ModalWrap>
  <ModalWrap
    v-model="openModalAddTester"
    title="Add Tester"
    haveBtnCtl
    @onSubmit="onSubmitStatus"
  >
    tester
  </ModalWrap>
  <v-expansion-panels>
    <SwVersionItem
      v-for="swVersion in props.swVersionList"
      :key="swVersion.swVersionId"
      :swVersion="swVersion"
      :toggleModal="toggleModal"
      @onClickTester="onClickTester"
      @onClickAddTester="onClickAddTester"
    />
  </v-expansion-panels>
</template>

<style scoped></style>

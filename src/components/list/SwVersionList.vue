<script setup lang="ts">
import { reactive, ref } from "vue";
import type { ISwVersion, ITestSession } from "@/types/types";
import SwVersionItem from "@/components/list/SwVersionItem.vue";
import ModalWrap from "@/components/ModalWrap.vue";
import TestStatusForm from "@/components/form/TestStatusForm.vue";

const openModal = ref<boolean>(false);

const selectedTestSession = reactive({
  testStatus: "",
});

const props = defineProps({
  swVersionList: {
    type: Array as () => ISwVersion[],
  },
});
const toggleModal = () => {
  openModal.value = !openModal.value;
};

const onSubmitStatus = () => {
  console.log(selectedTestSession);
  console.log("submitted");
  //TODO:API call
};

const onClickTester = (testerInfo: ITestSession, loggedInUserId: string) => {
  console.log(testerInfo, loggedInUserId);
  selectedTestSession.testStatus = testerInfo.status;
};
</script>

<template>
  <ModalWrap
    v-model="openModal"
    title="Change Status"
    haveBtnCtl
    @onSubmit="onSubmitStatus"
  >
    <TestStatusForm v-model="selectedTestSession" />
  </ModalWrap>
  <v-expansion-panels>
    <SwVersionItem
      v-for="swVersion in props.swVersionList"
      :key="swVersion.swVersionId"
      :swVersion="swVersion"
      :toggleModal="toggleModal"
      @onClickTester="onClickTester"
    />
  </v-expansion-panels>
</template>

<style scoped></style>

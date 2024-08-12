<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store/userStore";

import { E_TestStatus } from "@/types/enum.d";
import type { ISwVersion, ITestSession } from "@/types/types.d";

const store = useUserStore();
const { loggedInUser } = storeToRefs(store);
const props = defineProps({
  swVersion: {
    type: Object as () => ISwVersion,
  },
});
const renderIconForVersionStatus = (status: E_TestStatus) => {
  switch (status) {
    case E_TestStatus.failed:
      return "mdi-close-circle";
    case E_TestStatus.passed:
      return "mdi-check";
    default:
      return "mdi-alert-circle";
  }
};

const renderTestStatus = (type: E_TestStatus) => {
  switch (type) {
    case E_TestStatus.failed:
      return "error";
    case E_TestStatus.passed:
      return "teal";
    default:
      return "warning";
  }
};

const emit = defineEmits(["onClickLoggedInUserStatus"]);
const onClickLoggedInUserStatus = (tester: ITestSession) => {
  emit("onClickLoggedInUserStatus", tester);
};
</script>
<template>
  <div
    class="tester-con"
    v-if="
      !!props.swVersion?.testSessions &&
      props.swVersion?.testSessions.length > 0
    "
  >
    <p>현재 테스터</p>

    <v-chip
      v-for="tester in props.swVersion?.testSessions.sort((a, b) =>
        a.createdAt > b.createdAt ? 1 : -1
      )"
      :class="tester.user.id === loggedInUser?.id ? ' on' : ''"
      class="mr-2 mb-2"
      :variant="tester.user.id === loggedInUser?.id ? 'tonal' : 'outlined'"
      label
      :color="renderTestStatus(tester.status as E_TestStatus)"
      @click="onClickLoggedInUserStatus(tester)"
    >
      <v-icon icon="mdi-account-circle-outline" start></v-icon>
      {{ tester.user.id === loggedInUser?.id ? "me" : tester.user.username }}
      <v-icon :icon="renderIconForVersionStatus(tester.status)" end></v-icon>
      <v-tooltip
        activator="parent"
        location="end"
        :color="renderTestStatus(tester.status as E_TestStatus)"
        max-width="300"
      >
        <div v-if="tester.status === E_TestStatus.pending">
          <p>
            [{{ tester.user.username }}] <br />아직 QA를 진행하지 않았습니다.
          </p>
        </div>
        <div v-else>
          <p>[{{ tester.user.username }}]</p>
          <div class="html-con" v-html="tester.reasonContent"></div>
        </div>
      </v-tooltip>
    </v-chip>
  </div>
  <div v-else>
    <p>등록된 테스터가 없습니다.</p>
  </div>
</template>

<style scoped lang="scss">
.html-con {
  width: 100%;
  :deep(img) {
    width: 100%;
  }
}
</style>

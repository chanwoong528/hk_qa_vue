<script setup lang="ts">
import { useUserStore } from "@/store/userStore";
import { storeToRefs } from "pinia";

import { E_TestStatus } from "@/types/enum.d";
import type { ISwVersion, ITestSession } from "@/types/types.d";

const store = useUserStore();
const { loggedInUser } = storeToRefs(store);

const props = defineProps({
  swVersion: {
    type: Object as () => ISwVersion,
  },
  toggleModal: Function,
});

const emit = defineEmits(["onClickTester"]);

const testSessionsPassStatus =
  props.swVersion?.testSessions &&
  props.swVersion?.testSessions.length > 0 &&
  !props.swVersion?.testSessions.some(
    (tester) =>
      tester.status === E_TestStatus.failed ||
      tester.status === E_TestStatus.pending
  );

const renderTestStatus = (type: E_TestStatus) => {
  switch (type) {
    case E_TestStatus.failed:
      return "error";
    case E_TestStatus.passed:
      return "primary";
    default:
      return "warning";
  }
};

const onClickLoggedInUserStatus = (tester: ITestSession) => {
  if (tester.user.id === loggedInUser.value?.id) {
    console.log("open modal");
    // emit("toggleDialog", testerId, loggedInUser.value?.id);
    console.log(props.toggleModal);

    if (props.toggleModal) {
      props.toggleModal();
      emit("onClickTester", tester, loggedInUser.value?.id);
    }
  }
};
</script>

<template>
  <v-expansion-panel>
    <v-expansion-panel-title>
      {{ props.swVersion?.versionTitle }}
      <template v-slot:actions="{ expanded }">
        <v-icon :icon="!!expanded ? 'mdi-minus' : 'mdi-plus'"></v-icon>
        <v-icon
          :color="!!testSessionsPassStatus ? 'teal' : 'error'"
          :icon="!!testSessionsPassStatus ? 'mdi-check' : 'mdi-alert-circle'"
        ></v-icon>
      </template>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <p>
        {{ props.swVersion?.versionDesc }}
      </p>
      <div
        v-if="
          !!props.swVersion?.testSessions &&
          props.swVersion?.testSessions.length > 0
        "
      >
        <v-chip
          v-for="tester in props.swVersion?.testSessions"
          :class="tester.user.id === loggedInUser?.id ? ' on' : ''"
          class="mr-2 mb-2"
          label
          :color="renderTestStatus(tester.status as E_TestStatus)"
          @click="onClickLoggedInUserStatus(tester)"
        >
          <v-icon icon="mdi-account-circle-outline" start></v-icon>
          {{
            tester.user.id === loggedInUser?.id ? "me" : tester.user.username
          }}
        </v-chip>
      </div>
      <div v-else>
        <p>no tester registered</p>
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<style scoped>
.v-chip:hover {
  cursor: not-allowed;
}
.v-chip.on:hover {
  cursor: pointer;
}
</style>

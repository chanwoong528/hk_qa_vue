<script setup lang="ts">
import { reactive, ref } from "vue";
import { E_TestStatus } from "@/types/enum.d";
import type { ITestSession } from "@/types/types";

const testSessionModel = defineModel();
const initialState = testSessionModel.value;
const state = reactive(initialState as Partial<ITestSession>);

const btnList = ref<{ code: E_TestStatus; label: string }[]>([
  { code: E_TestStatus.pending, label: "대기" },
  { code: E_TestStatus.passed, label: "패스" },
  { code: E_TestStatus.failed, label: "실패" },
]);

const renderClassForETestStatus = (status: E_TestStatus) => {
  switch (status) {
    case E_TestStatus.failed:
      return "text-error";
    case E_TestStatus.passed:
      return "text-success";
    default:
      return "text-warning";
  }
};
const renderRadioBtnTestStatus = (status: E_TestStatus) => {
  switch (status) {
    case E_TestStatus.failed:
      return "error";
    case E_TestStatus.passed:
      return "success";
    default:
      return "warning";
  }
};
</script>

<template>
  <div>
    <v-radio-group v-model="state.status" hide-details>
      <v-radio
        v-for="btn in btnList"
        :key="btn"
        :color="renderRadioBtnTestStatus(btn.code)"
        :label="btn.label"
        :value="btn.code"
        :class="renderClassForETestStatus(btn.code)"
      >
        <template v-slot:label>
          <p>
            <strong class="label-text">
              {{ btn.label }}
            </strong>
          </p>
        </template>
      </v-radio>
    </v-radio-group>
  </div>
</template>

<style scoped lang="scss">
.label-text {
  color: #000;
  opacity: 1;
  font-weight: 600;
}
</style>

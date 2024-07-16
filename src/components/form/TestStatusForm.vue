<script setup lang="ts">
import { reactive, ref } from "vue";
import { E_TestStatus } from "@/types/enum.d";
import type { ITestSession } from "@/types/types";

const testSessionModel = defineModel();
const initialState = testSessionModel.value;
const state = reactive(initialState as Partial<ITestSession>);
const btnList = ref<E_TestStatus[]>([
  E_TestStatus.pending,
  E_TestStatus.passed,
  E_TestStatus.failed,
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
</script>

<template>
  <v-container fluid>
    <v-radio-group v-model="state.status">
      <v-radio v-for="btn in btnList" :key="btn" :label="btn" :value="btn">
        <template v-slot:label>
          <p>
            <strong :class="renderClassForETestStatus(btn)">
              {{ btn }}
            </strong>
          </p>
        </template>
      </v-radio>
    </v-radio-group>
  </v-container>
</template>

<style scoped></style>

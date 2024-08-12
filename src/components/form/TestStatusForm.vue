<script setup lang="ts">
import { reactive, ref } from "vue";
import { E_TestStatus } from "@/types/enum.d";
import type { ITestSession } from "@/types/types";

const testSessionModel = defineModel();
console.log(testSessionModel.value);
const initialState = testSessionModel.value;
const state = reactive(initialState as Partial<ITestSession>);

const btnList = ref<{ code: E_TestStatus; label: string }[]>([
  { code: E_TestStatus.pending, label: "대기" },
  { code: E_TestStatus.passed, label: "패스" },
  { code: E_TestStatus.failed, label: "실패" },
]);
const isEditorFocused = ref<boolean>(false);

const onFocusEditorCon = (clickedCon: boolean) => {
  isEditorFocused.value = clickedCon;
};
const onBlurEditorCon = (isFocusOut: boolean) => {
  if (!!isFocusOut && isEditorFocused.value) {
    isEditorFocused.value = false;
  }
};

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
        @click="onFocusEditorCon(false)"
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
  <div
    :class="{ focus: isEditorFocused }"
    class="editor-con"
    :tabindex="0"
    @focus="onFocusEditorCon(true)"
    @click="onFocusEditorCon(true)"
  >
    <p>
      <v-icon icon="mdi-text-box-multiple-outline"></v-icon>
      테스트 결과
    </p>
    <RichEditor
      v-model="state.reasonContent"
      :isEditorFocused="isEditorFocused"
      @onBlurEditorCon="onBlurEditorCon"
    />
  </div>
</template>

<style scoped lang="scss">
.v-selection-control-group {
  display: flex;
}
.label-text {
  color: #000;
  opacity: 1;
  font-weight: 600;
}
.editor-con {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  min-height: 300px;

  border: 1px solid #9d9d9d;
  border-radius: 4px;
  &.focus {
    border: 2px solid #212121;
  }
  p {
    padding: 8px 0 8px 12px;
  }
}
</style>

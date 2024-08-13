<script setup lang="ts">
import { reactive, ref } from "vue";
import { E_TestStatus } from "@/types/enum.d";
import type { ILogInfo, ITestSession } from "@/types/types";
import { useUserStore } from "@/store/userStore";
import { storeToRefs } from "pinia";
import HistoryList from "@/components/list/HistoryList.vue";
import { logApi } from "@/services/domain/logService";
const enum E_Tab {
  formTestStatus = "formTestStatus",
  history = "history",
}

const testSessionModel = defineModel<Partial<ITestSession>>();
const initialState = testSessionModel.value;
const state = reactive(initialState as Partial<ITestSession>);

const logListByUser = ref<ILogInfo[]>([]);
const curTab = ref<string>(E_Tab.formTestStatus);

const userStore = useUserStore();
const { loggedInUser } = storeToRefs(userStore);

const btnList = ref<{ code: E_TestStatus; label: string }[]>([
  { code: E_TestStatus.pending, label: "대기" },
  { code: E_TestStatus.passed, label: "통과" },
  { code: E_TestStatus.failed, label: "실패" },
]);

const isEditorFocused = ref<boolean>(false);

const onClickHistoryTab = () => {
  if (testSessionModel?.value?.user?.id) {
    return fetchLogForUser(testSessionModel.value?.user?.id);
  }
};

const fetchLogForUser = (userId: string) => {
  return logApi.GET_testerStatusUpdateLogByUserId(userId).then((res) => {
    logListByUser.value = res;
  });
};

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
  <v-tabs v-model="curTab" color="primary" direction="horizontal">
    <v-tab
      prepend-icon="mdi-account"
      text="현재 상태"
      :value="E_Tab.formTestStatus"
    ></v-tab>
    <v-tab
      prepend-icon="mdi mdi-math-log"
      text="변경 로그"
      @click="onClickHistoryTab"
      :value="E_Tab.history"
    ></v-tab>
  </v-tabs>

  <v-tabs-window v-model="curTab">
    <v-tabs-window-item :value="E_Tab.formTestStatus">
      <div>
        <v-radio-group v-model="state.status" hide-details>
          <v-radio
            v-for="btn in btnList"
            :key="btn.code"
            :color="renderRadioBtnTestStatus(btn.code)"
            :label="btn.label"
            :value="btn.code"
            :class="renderClassForETestStatus(btn.code)"
            :disabled="loggedInUser?.id !== state.user?.id"
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
        v-if="loggedInUser?.id === state.user?.id"
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
      <div v-else class="reason-con">
        <p>
          <v-icon icon="mdi-text-box-multiple-outline"></v-icon>
          테스트 관련 설명
        </p>
        <div class="status-reason-html-con" v-html="state.reasonContent" />
      </div>
    </v-tabs-window-item>
  </v-tabs-window>

  <v-tabs-window v-model="curTab">
    <v-tabs-window-item :value="E_Tab.history">
      <HistoryList v-model="logListByUser" />
    </v-tabs-window-item>
  </v-tabs-window>
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
.reason-con {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  min-height: 300px;
  width: 600px;
  p {
    padding: 8px 0 8px 12px;
    border-bottom: 2px solid #212121;
  }

  .status-reason-html-con {
    width: 100%;
    padding: 8px 0 8px 12px;
  }
}
.editor-con {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  min-height: 300px;
  width: 600px;

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

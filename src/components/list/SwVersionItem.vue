<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "@/store/userStore";
import { storeToRefs } from "pinia";

import { E_Role, E_SwVersionModalType, E_TestStatus } from "@/types/enum.d";
import { formatDateTime } from "@/utils/common/formatter";
import type { ISwVersion, ITestSession } from "@/types/types.d";

const store = useUserStore();
const { loggedInUser } = storeToRefs(store);

const props = defineProps({
  swVersion: {
    type: Object as () => ISwVersion,
  },
  itemType: String,
  toggleModal: Function,
});

const emit = defineEmits([
  "onClickTester",
  "onClickAddTester",
  "onClickDetailView",
  "onClickEditVersion",
]);

const testSessionsPassStatus = computed(() => {
  if (
    props.swVersion?.testSessions &&
    props.swVersion?.testSessions.length > 0
  ) {
    if (
      props.swVersion?.testSessions.some(
        (tester) => tester.status === E_TestStatus.failed
      )
    )
      return E_TestStatus.failed;
    if (
      props.swVersion?.testSessions.every(
        (tester) => tester.status === E_TestStatus.passed
      )
    )
      return E_TestStatus.passed;

    return E_TestStatus.pending;
  }
  return E_TestStatus.pending;
});

const onClickLoggedInUserStatus = (tester: ITestSession) => {
  if (!!props.toggleModal) {
    if (tester.status === E_TestStatus.pending)
      return alert("테스트가 진행중입니다.");

    props.toggleModal();
    return emit("onClickTester", tester, loggedInUser.value?.id);
  }
};
const onClickEditVersion = () => {
  emit("onClickEditVersion", props.swVersion?.swVersionId);
};
const onClickAddTester = () => {
  if (!!props.toggleModal) {
    props.toggleModal(E_SwVersionModalType.addTester);
    emit("onClickAddTester", props.swVersion?.swVersionId);
  }
};

const onClickDetailView = () => {
  if (!!props.toggleModal) {
    props.toggleModal(E_SwVersionModalType.detailView);
    emit("onClickDetailView", props.swVersion?.swVersionId);
  }
};

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
const renderColorIcon = (status: E_TestStatus) => {
  switch (status) {
    case E_TestStatus.failed:
      return "error";
    case E_TestStatus.passed:
      return "teal";
    default:
      return "warning";
  }
};
</script>

<template>
  <v-expansion-panel v-if="itemType === 'panel'">
    <v-expansion-panel-title>
      <div class="title-header">
        <h3>
          {{ props.swVersion?.versionTitle }}
        </h3>
        <div class="title-header--left">
          <p v-if="!!props.swVersion?.createdAt" class="date">
            {{ formatDateTime(props.swVersion?.createdAt) }}
          </p>
          <p class="author">
            {{ props.swVersion?.user.username }}
          </p>
        </div>
      </div>
      <template v-slot:actions="{ expanded }">
        <v-icon :icon="!!expanded ? 'mdi-minus' : 'mdi-plus'"></v-icon>
        <v-icon
          :color="renderColorIcon(testSessionsPassStatus)"
          :icon="renderIconForVersionStatus(testSessionsPassStatus)"
        ></v-icon>
      </template>
    </v-expansion-panel-title>

    <v-expansion-panel-text>
      <div class="desc-wrap">
        <v-btn class="edit-btn" variant="outlined" @click="onClickEditVersion">
          <v-icon class="mdi mdi-application-edit" start></v-icon>
          수정
        </v-btn>
        <div class="desc-inner-html" v-html="props.swVersion?.versionDesc" />
      </div>
      <a v-if="props.swVersion?.fileSrc" :href="props.swVersion?.fileSrc"
        >첨부 파일</a
      >
      <div class="version-ctrl-con">
        <v-divider :thickness="2"></v-divider>
        <TestListChips
          :swVersion="props.swVersion"
          @onClickLoggedInUserStatus="onClickLoggedInUserStatus"
        />

        <div class="modify-tester-btn-con">
          <v-btn
            v-if="loggedInUser?.role !== E_Role.tester"
            @click="onClickAddTester"
            class="text-none text-subtitle-1"
            variant="outlined"
          >
            <v-icon icon="mdi-account-multiple-plus" start></v-icon>
            테스터 관리
          </v-btn>
          <v-btn
            @click="onClickDetailView"
            class="text-none text-subtitle-1"
            variant="outlined"
          >
            상세보기
            <v-icon icon="mdi-dots-horizontal-circle-outline" end></v-icon>
          </v-btn>
        </div>
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>

  <div class="default-type-item" v-else>
    <a v-if="props.swVersion?.fileSrc" :href="props.swVersion?.fileSrc"
      >Download File</a
    >
    <div
      class="desc-inner-html expand"
      v-html="props.swVersion?.versionDesc"
    ></div>

    <div class="version-ctrl-con">
      <v-divider :thickness="2"></v-divider>
      <TestListChips
        :swVersion="props.swVersion"
        @onClickLoggedInUserStatus="onClickLoggedInUserStatus"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.modify-tester-btn-con {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.v-chip:hover {
  cursor: not-allowed;
}
.v-chip.on:hover {
  cursor: pointer;
}

.default-type-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;

  margin-top: 20px;
}
.v-expansion-panel-title {
  background-color: #ececec;
  .title-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &--left {
      padding: 0 8px;
      display: flex;
      flex-direction: column;

      justify-content: center;
      gap: 4px;
      p {
        font-size: 0.8rem;
        color: #999;
        font-weight: 600;
      }
    }
    // .date {
    // }
    // .author {
    // }
  }
}

.desc-wrap {
  position: relative;
  .edit-btn {
    position: absolute;
    top: 0;
    right: 0;
  }
  .desc-inner-html {
    overflow: hidden;
    max-height: 300px;
    margin: 20px 0;
    &.expand {
      max-height: none;
      :deep(img) {
        border: 1px solid #ececec;
      }
    }
  }
}

.version-ctrl-con {
  display: flex;
  flex-direction: column;
  gap: 20px;
  .tester-con {
    p {
      font-size: 1rem;
      font-weight: 800;
      margin: 10px 0;
    }
  }
}
</style>

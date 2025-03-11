<script setup lang="ts">
import { computed } from "vue";

import { storeToRefs } from "pinia";
import { useUserStore } from "@/store/userStore";

import { E_TestStatus } from "@/types/enum.d";
import type { ISwVersion, ITestSession } from "@/types/types.d";
import { formatDateTime, renderIconForVersionStatus, renderTestStatus } from "@/utils/common/formatter";

const store = useUserStore();
const { loggedInUser } = storeToRefs(store);

const props = defineProps({
  swVersion: {
    type: Object as () => ISwVersion,
  },
});

const emit = defineEmits(["onClickLoggedInUserStatus"]);
const onClickLoggedInUserStatus = (tester: ITestSession) => {
  emit("onClickLoggedInUserStatus", tester);
};

const sortedTestSessions = computed(() => {
  return props.swVersion?.testSessions 
    ? [...props.swVersion.testSessions].sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
    : [];
});
</script>

<template>
  <div v-if="!!props.swVersion?.testSessions && props.swVersion?.testSessions.length > 0">
    <div class="tester-con">
      <p>현재 테스터</p>
      <v-chip
        v-for="tester in sortedTestSessions"
        :key="tester.user.id"
        :class="tester.user.id === loggedInUser?.id ? ' on' : ''"
        class="mr-2 mb-2"
        :variant="tester.user.id === loggedInUser?.id ? 'tonal' : 'tonal'"
        :color="renderTestStatus(tester.status as E_TestStatus)"
        @click.stop="onClickLoggedInUserStatus(tester)"
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
            <p>[{{ tester.user.username }}] <br />아직 QA를 진행하지 않았습니다.</p>
          </div>
          <div v-else>
            <p>[{{ tester.user.username }}] {{ formatDateTime(tester.updatedAt) }}</p>
            <div class="html-con" v-html="tester.reasonContent"></div>
          </div>
        </v-tooltip>
      </v-chip>
    </div>
  </div>
  <div v-else class="wrap">
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

.wrap {
  &.detail {
    min-height: 300px;
  }
}
.tester-con {
  padding-bottom: 6px;
  border-bottom: 1px dashed #ddd;
  p {
    padding-bottom: 10px;
    font-weight: 500;
  }
}

.chart-con {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 20px;

  border: 10px solid #f5f5f5;

  .chart-left-con {
    flex: 1;
    display: flex;

    .chart-wrap {
      max-width: 500px;
    }
  }

  .chart-info {
    flex: 1;
    // max-width: 500px;

    border: 10px solid red;
  }
}
</style>

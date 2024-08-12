<script setup lang="ts">
import { E_TestStatus } from "@/types/enum.d";
import type { ILogInfo } from "@/types/types";
import { formatDateTime } from "@/utils/common/formatter";

const logListModel = defineModel<ILogInfo[]>();

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
const renderIconForVersionStatus = (status: E_TestStatus) => {
  switch (status) {
    case E_TestStatus.failed:
      return "mdi-close-circle-outline";
    case E_TestStatus.passed:
      return "mdi-check";
    default:
      return "mdi mdi-alert-circle-outline";
  }
};
</script>
<template>
  <div class="timeline-wrap">
    <v-timeline align="start" density="compact">
      <v-timeline-item
        v-for="log in logListModel"
        :key="log.id"
        size="small"
        fill-dot
        :dot-color="renderTestStatus(log.content.status)"
        :icon="renderIconForVersionStatus(log.content.status)"
      >
        <v-expansion-panels
          v-if="!!log.content.reasonContent"
          variant="accordion"
        >
          <v-expansion-panel>
            <v-expansion-panel-title>
              {{ formatDateTime(log.createdAt) }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div v-html="log.content.reasonContent" />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <p v-else class="no-content">{{ formatDateTime(log.createdAt) }}</p>

        <!-- <div v-html="log.content.reasonContent" /> -->
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<style scoped>
.timeline-wrap {
  padding: 30px;
}
.no-content {
  padding: 0 24px;
}
</style>

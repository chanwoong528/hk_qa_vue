<script setup lang="ts">

import { computed, onMounted, onUnmounted, ref } from "vue";
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

import type { ISwVersion, ITestSession } from "@/types/types";
import { E_TestStatus } from "@/types/enum.d";

import { renderIconForVersionStatus, renderTestStatus, formatDateTime } from "@/utils/common/formatter";



const props = defineProps({
  swVersion: {
    type: Object as () => ISwVersion,
  },
});


const dataHeaders = ref([
  { title: "테스터", key: "tester" },
  { title: "상태", key: "status" },
  { title: "테스트 날짜", key: "updatedAt" },
  { title: "테스트 결과", key: "comment" },
] as const);

const loadedData = ref(false);


onMounted(() => {
  loadedData.value = true;
})
onUnmounted(() => {
  loadedData.value = false;
});

const computedData = computed(() => {

  const testSessions = props.swVersion?.testSessions;

  return {
    chartData: computeChartData(testSessions || []),
    tableHeader: computeFormatTableHeader(testSessions || []),
    infoData: computeTestSessionsInfo(testSessions || []),

  }

});

const computeFormatTableHeader = (testSessions: ITestSession[]) => {
  return testSessions.toSorted((a, b) => (a.createdAt > b.createdAt ? 1 : -1)).map((tester) => {
    return {
      tester: tester.user.username,
      status: tester.status,
      createdAt: formatDateTime(tester.createdAt),
      comment: tester.reasonContent,
    };
  });

  // return [...testSessions].sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
  //   .map((tester) => {
  //     return {
  //       tester: tester.user.username,
  //       status: tester.status,
  //       createdAt: formatDateTime(tester.createdAt),
  //       comment: tester.reasonContent,
  //     };
  //   })
}


const computeChartData = (testSessions: ITestSession[]) => {
  const testStatus = testSessions.map((tester) => tester.status);

  const testStatusCount = testStatus.reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: (acc[cur] || 0) + 1,
    }),
    {
      [E_TestStatus.pending]: 0,
      [E_TestStatus.passed]: 0,
      [E_TestStatus.failed]: 0,
    }
  );

  loadedData.value = true;

  const labels = Object.keys(testStatusCount);
  const data = Object.values(testStatusCount);

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: ["#FB8C00", "#0A9789", "#B00020"],
      },
    ],
  };
};
const computeTestSessionsInfo = (testSessions: ITestSession[]) => {
  const testStatusCount = {
    [E_TestStatus.pending]: 0,
    [E_TestStatus.passed]: 0,
    [E_TestStatus.failed]: 0,
    total: 0,
  };
  const temp = testSessions.reduce(
    (acc, tester) => {
      const status = tester.status;
      acc[status] = (acc[status] || 0) + 1;
      acc.total += 1;
      return acc;
    },
    { ...testStatusCount } // Spread the initial values so you don't mutate the original
  );
  return temp;
}

const renderLabelKOR = (status: E_TestStatus) => {
  switch (status) {
    case E_TestStatus.failed:
      return "실패";
    case E_TestStatus.passed:
      return "성공";

    case E_TestStatus.pending:
      return "대기";
    default:
      return "전체";
  }
};
const renderPercentage = (statusCount: number, total: number) => {
  if (!!total && total > 0) {
    return ((statusCount / total) * 100).toFixed(2) + "%";
  }
  return 0;
};

</script>

<template>
  <div class="wrap">
    <div class="chart-con">
      <div class="chart-left-con">
        <div class="chart-wrap" v-if="!!loadedData && !!computedData.chartData">
          <!-- <Doughnut :data="computedData.chartData || undefined" /> -->
          <Doughnut :data="computedData.chartData" />
        </div>
        <div>
          <v-list>
            <v-list-item v-for="statusInfo in Object.keys(computedData.infoData as Record<E_TestStatus, number>)"
              :key="statusInfo">

              <v-icon v-if="statusInfo !== 'total'" :color="renderTestStatus(statusInfo as E_TestStatus)"
                :icon="renderIconForVersionStatus(statusInfo as E_TestStatus)"></v-icon>

              <v-icon :icon="renderTestStatus(statusInfo as E_TestStatus)"></v-icon>
              <p v-if="statusInfo !== 'total'">
                <span>
                  {{ renderLabelKOR(statusInfo as E_TestStatus) }}: {{
                    (computedData.infoData as Record<E_TestStatus, number>)[statusInfo as E_TestStatus] }}
                </span>
                <br />
                <span>
                  {{

                    renderPercentage(
                      (computedData.infoData as Record<E_TestStatus, number>)[statusInfo as E_TestStatus],
                      !!computedData.infoData?.total ? computedData.infoData?.total : 0
                    )
                  }}


                </span>
              </p>
            </v-list-item>
          </v-list>
        </div>
      </div>
      <div class="chart-info">
        <p class="success-percentage">
          {{ (computedData.infoData[E_TestStatus.passed] / computedData.infoData["total"] * 100).toFixed(1) }} %
        </p>
        <p>성공 </p>

      </div>
    </div>

    <v-data-table :headers="dataHeaders" :items="computedData.tableHeader" :items-per-page="5" class="elevation-1">
      <template v-slot:item.status="{ item }">
        <v-icon :color="renderTestStatus(item.status as E_TestStatus)"
          :icon="renderIconForVersionStatus(item.status)"></v-icon>
      </template>

      <template v-slot:item.comment="{ item }">
        <div v-if="item.status === E_TestStatus.pending">
          <p>아직 QA를 진행하지 않았습니다.</p>
        </div>

        <div v-if="item.comment === ''">-</div>

        <div class="html-con" v-html="item.comment"></div>
      </template>

      <template #bottom></template>
    </v-data-table>
  </div>
</template>


<style scoped lang="scss">
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
      max-height: 500px;

    }
  }

  .chart-info {
    flex: 1;
    // max-width: 500px;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    .success-percentage {
      font-size: 5rem;
      font-weight: 600;
      color: #0A9789;
    }

  }
}
</style>
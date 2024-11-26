<script setup lang="ts">
import { JenkinsDeploymentClass } from "@/entity/JenkinsDeployment";

import { ref } from "vue";

const props = defineProps<{
  jenkinsDeploymentList: JenkinsDeploymentClass[];
  tag: string;
}>();

const curModalTab = ref<string>(props.jenkinsDeploymentList[0].title);

// watch(curModalTab, newVal => {
//   curWindowInfo.value = props.jenkinsDeploymentList.find(jenkins => jenkins.title === newVal) || null;
// });
const emit = defineEmits(["onClickdeploy"]);

const onClickDeploy = (jenkinsDeploymentId: string) => {
  emit("onClickdeploy", jenkinsDeploymentId);
};
</script>
<template>
  <section @click.stop="">
    <div v-if="props.jenkinsDeploymentList.length > 0" class="tab-list">
      <v-tabs v-model="curModalTab" color="primary">
        <v-tab v-for="jenkins in props.jenkinsDeploymentList" :key="jenkins.title" :value="jenkins.title">
          {{ jenkins.title }}
        </v-tab>
      </v-tabs>
    </div>
    <v-tabs-window v-model="curModalTab" class="tab-window">
      <v-tabs-window-item v-for="curWind in props.jenkinsDeploymentList" :value="curWind.title" class="ma-2">
        <v-chip
          @click="onClickDeploy(curWind.jenkinsDeploymentId as string)"
          color="blue-grey-darken-3"
          class="ma-2"
          :disabled="!curWind.isReadyForAnotherDeploy()"
          >배포
          <v-progress-circular
            v-if="!curWind.isReadyForAnotherDeploy()"
            color="primary"
            size="20"
            indeterminate
          ></v-progress-circular>
        </v-chip>

        <v-list v-if="curWind?.deployLogs.filter(item => item.tag === props.tag).length > 0">
          <v-list-item>
            <div class="deploy-log-item title">
              <p>Build Number</p>
              <p>배포 사유</p>
              <p>상태</p>
            </div>
          </v-list-item>

          <v-list-item v-for="deploylog in curWind?.deployLogs.filter(item => item.tag === props.tag)">
            <div class="deploy-log-item">
              <p>{{ deploylog.buildNumber }}</p>
              <p v-html="deploylog.reason"></p>
              <p>
                <v-icon :color="deploylog.renderStatusIcon().color" :icon="deploylog.renderStatusIcon().icon"></v-icon>
              </p>
            </div>
          </v-list-item>
        </v-list>
        <p class="empty-info" v-else>배포 내역이 없습니다.</p>
      </v-tabs-window-item>
    </v-tabs-window>
  </section>
</template>

<style scoped lang="scss">
.tab-list {
  button {
    border: 1px solid #ccc;
    border-collapse: collapse;
  }
}
.deploy-log-item {
  display: flex;
  border-bottom: 1px dashed #ccc;
  border-radius: 4px;
  &.title {
    background-color: #eee;
    p {
      font-weight: 700;
    }
  }
  p {
    padding: 1rem;
    flex: 1;
  }
}
.empty-info {
  padding: 1rem;
  flex: 1;
}
</style>

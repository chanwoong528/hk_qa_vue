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

const onClickRevert = (jenkinsDeploymentId: string, tag: string) => {
  emit("onClickdeploy", jenkinsDeploymentId, tag);
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
      <v-tabs-window-item
        v-for="curWind in props.jenkinsDeploymentList"
        :value="curWind.title"
        :key="curWind.jenkinsDeploymentId"
        class="ma-2"
      >
        <v-chip
          @click="onClickDeploy(curWind.jenkinsDeploymentId as string)"
          color="blue-grey-darken-3"
          class="ma-2"
          :disabled="!curWind.isReadyForAnotherDeploy()"
          >배포 {{ curWind.title }}
          <v-progress-circular
            v-if="!curWind.isReadyForAnotherDeploy()"
            color="primary"
            size="20"
            indeterminate
          ></v-progress-circular>
        </v-chip>

        <v-list v-if="curWind?.deployLogs.some(item => props.tag.includes(item.tag.split('-')[0]))">
          <v-list-item>
            <div class="deploy-log-item title">
              <p>Build Number</p>
              <p>태그</p>
              <p>배포 사유</p>
              <p>상태</p>
              <p>Revert</p>
            </div>
          </v-list-item>

          <v-list-item
            v-for="deploylogItem in curWind?.deployLogs.filter(item => {
              return props.tag.includes(item.tag.split('-')[0]);
            })"
            :key="deploylogItem.jenkinsDeploymentId"
          >
            <div class="deploy-log-item">
              <p>{{ deploylogItem.buildNumber }}</p>
              <p>{{ deploylogItem.tag }}</p>
              <p v-html="deploylogItem.reason"></p>
              <p>
                <v-icon
                  :color="deploylogItem.renderStatusIcon().color"
                  :icon="deploylogItem.renderStatusIcon().icon"
                ></v-icon>
              </p>
              <p>
                <v-btn
                  variant="tonal"
                  color="primary"
                  @click="onClickRevert(curWind.jenkinsDeploymentId as string, `${deploylogItem.tag}`)"
                >
                  Revert
                </v-btn>
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

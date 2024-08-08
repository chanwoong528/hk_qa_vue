<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import type {
  ISwVersion,
  ITestSession,
  IUserInfo,
  IComment,
} from "@/types/types";

import {
  E_TestStatus,
  E_SwVersionModalType,
  E_ModalType,
} from "@/types/enum.d";

import { userApi } from "@/services/domain/userService";
import { testSessionApi } from "@/services/domain/testSessionService";

import AddTesterForm from "@/components/form/AddTesterForm.vue";
import CommentList from "@/components/list/CommentList.vue";
import SwVersionItem from "@/components/list/SwVersionItem.vue";
import ModalWrap from "@/components/ModalWrap.vue";
import TestStatusForm from "@/components/form/TestStatusForm.vue";
import { commentApi } from "@/services/domain/commentService";

const props = defineProps({
  swVersionList: {
    type: Array as () => ISwVersion[],
  },
  onFetchSwVersionList: {
    type: Function,
  },
});

const emit = defineEmits(["onSubmitStatus"]);

const userList = ref<IUserInfo[]>([]);
const testSessionUserList = ref<IUserInfo[]>([]);
const curSwVersionId = ref<string>("");

const commentListForVersion = ref<IComment[]>([]);

const openModalDetailView = ref<boolean>(false);
const openModalUpdateStatus = ref<boolean>(false);
const openModalAddTester = ref<boolean>(false);

const selectedTestSession = reactive<Partial<ITestSession>>({
  sessionId: "",
  status: E_TestStatus.pending,
});

const curSwVersionInfo = computed(() => {
  return props.swVersionList?.find(
    (sw) => sw.swVersionId === curSwVersionId.value
  );
});

const toggleModal = (type?: E_SwVersionModalType) => {
  switch (type) {
    case E_SwVersionModalType.addTester:
      return (openModalAddTester.value = !openModalAddTester.value);
    case E_SwVersionModalType.detailView:
      return (openModalDetailView.value = !openModalDetailView.value);
    default:
      return (openModalUpdateStatus.value = !openModalUpdateStatus.value);
  }
};

const onSubmitStatus = () => {
  emit("onSubmitStatus", selectedTestSession);
};

const onClickTester = (testerInfo: ITestSession, loggedInUserId: string) => {
  selectedTestSession.sessionId = testerInfo.sessionId;
  selectedTestSession.status = testerInfo.status;
};

const onClickAddTester = (swVerId: string) => {
  curSwVersionId.value = swVerId;
  const targetSwVersion = props.swVersionList?.find(
    (sw) => sw.swVersionId === swVerId
  );

  userApi.GET_users().then((usersData) => {
    const curTesters = targetSwVersion?.testSessions.map((tester) => {
      const targetUsers = usersData.find((user) => user.id === tester.user.id);
      if (targetUsers) return targetUsers;
    });
    testSessionUserList.value = curTesters as IUserInfo[];
    userList.value = usersData as IUserInfo[];
  });
};

const onClickDetailView = (swVerId: string) => {
  curSwVersionId.value = swVerId;
  return commentApi
    .GET_commentsBySwVersionId(swVerId)
    .then((res) => (commentListForVersion.value = res));
};

const onSubmitAddTesters = (testers: IUserInfo[]) => {
  const tobeDeleted = testSessionUserList.value
    .filter(
      (tester) => !testers.some((newTester) => newTester.id === tester.id)
    )
    .map((tester) => tester.id);

  const tobeAdded = testers
    .filter(
      (tester) =>
        !testSessionUserList.value.some(
          (oldTester) => oldTester.id === tester.id
        )
    )
    .map((tester) => tester.id);

  testSessionApi
    .PUT_deleteOrAddTestSession(curSwVersionId.value, tobeDeleted, tobeAdded)
    .then((res) => {
      props.onFetchSwVersionList &&
        props.onFetchSwVersionList(props.swVersionList?.[0]?.swType?.swTypeId);
      toggleModal(E_SwVersionModalType.addTester);
    })
    .catch((error) => alert(error));
};
</script>

<template>
  <ModalWrap
    v-model="openModalUpdateStatus"
    title="QA 항목 상태 변경"
    haveBtnCtl
    @onSubmit="onSubmitStatus"
  >
    <TestStatusForm v-model="selectedTestSession" />
  </ModalWrap>

  <ModalWrap v-model="openModalAddTester" title="테스터 관리">
    <AddTesterForm
      :userList="userList"
      :curTesterList="testSessionUserList"
      @onSubmitAddTesters="onSubmitAddTesters"
    />
  </ModalWrap>
  <!-- Detail Modal for Specific Version -->
  <ModalWrap
    v-model="openModalDetailView"
    :type="E_ModalType.full"
    :title="curSwVersionInfo?.versionTitle + '버전'"
  >
    <SwVersionItem
      :swVersion="curSwVersionInfo"
      :toggleModal="toggleModal"
      @onClickTester="onClickTester"
      @onClickAddTester="onClickAddTester"
      @onClickDetailView="onClickDetailView"
    />
    <CommentList
      v-model="commentListForVersion"
      :swVersion="curSwVersionInfo"
    />
  </ModalWrap>
  <!-- Detail Modal for Specific Version -->

  <v-expansion-panels>
    <SwVersionItem
      v-for="swVersion in props.swVersionList"
      :key="swVersion.swVersionId"
      :swVersion="swVersion"
      :toggleModal="toggleModal"
      itemType="panel"
      @onClickTester="onClickTester"
      @onClickAddTester="onClickAddTester"
      @onClickDetailView="onClickDetailView"
    />
  </v-expansion-panels>
</template>

<style scoped lang="scss">
.test-status-modal {
  :deep(".v-card") {
    border: 10px solid red;
  }
}
</style>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { storeToRefs } from "pinia";

import { useUserStore } from "@/store/userStore";
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
import { commentApi } from "@/services/domain/commentService";

import AddTesterForm from "@/components/form/AddTesterForm.vue";
import TestStatusForm from "@/components/form/TestStatusForm.vue";

import CommentList from "@/components/list/CommentList.vue";
import SwVersionItem from "@/components/list/SwVersionItem.vue";

import ModalWrap from "@/components/ModalWrap.vue";

const props = defineProps({
  swVersionList: {
    type: Array as () => ISwVersion[],
  },
  onFetchSwVersionList: {
    type: Function,
  },
});

const userStore = useUserStore();
const { loggedInUser } = storeToRefs(userStore);

const emit = defineEmits(["onSubmitStatus", "onClickEditVersion"]);

const userList = ref<IUserInfo[]>([]);

const testSessionUserList = ref<IUserInfo[]>([]);
const curSwVersionId = ref<string>("");

const commentListForVersion = ref<IComment[]>([]);

const openModalDetailView = ref<boolean>(false);
const openModalAddTester = ref<boolean>(false);

const openModalUpdateStatus = ref<boolean>(false);
const openModalTesterLog = ref<boolean>(false);

const dbSavedTestSession = reactive<Partial<ITestSession>>({
  sessionId: "",
  status: E_TestStatus.pending,
  reasonContent: "",
});

const selectedTestSession = reactive<Partial<ITestSession>>({
  sessionId: "",
  status: E_TestStatus.pending,
  reasonContent: "",
});

const curSwVersionInfo = computed(() => {
  return props.swVersionList?.find(
    (sw) => sw.swVersionId === curSwVersionId.value
  );
});

const toggleModal = (type?: E_SwVersionModalType, testerId?: string) => {
  switch (type) {
    case E_SwVersionModalType.addTester:
      return (openModalAddTester.value = !openModalAddTester.value);
    case E_SwVersionModalType.detailView:
      return (openModalDetailView.value = !openModalDetailView.value);
    case E_SwVersionModalType.testerLog:
      return (openModalTesterLog.value = !openModalTesterLog.value);

    default:
      return (openModalUpdateStatus.value = !openModalUpdateStatus.value);
  }
};

const onSubmitStatus = () => {
  emit(
    "onSubmitStatus",
    selectedTestSession,
    dbSavedTestSession,
    openModalUpdateStatus
  );
};

const onClickTester = (testerInfo: ITestSession, loggedInUserId: string) => {
  selectedTestSession.sessionId = testerInfo.sessionId;
  selectedTestSession.status = testerInfo.status;
  selectedTestSession.reasonContent = testerInfo.reasonContent;
  selectedTestSession.user = testerInfo.user;

  dbSavedTestSession.sessionId = testerInfo.sessionId;
  dbSavedTestSession.status = testerInfo.status;
  dbSavedTestSession.reasonContent = testerInfo.reasonContent;
  dbSavedTestSession.user = testerInfo.user;
};

const onClickAddTester = (swVerId: string) => {
  curSwVersionId.value = swVerId;
  const targetSwVersion = props.swVersionList?.find(
    (sw) => sw.swVersionId === swVerId
  );

  return userApi.GET_users().then((usersData) => {
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

const onClickEditVersion = (swVerId: string) => {
  curSwVersionId.value = swVerId;
  emit("onClickEditVersion", curSwVersionInfo.value);
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

  return testSessionApi
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
  <!-- //'QA 항목 상태 변경' -->
  <ModalWrap
    v-model="openModalUpdateStatus"
    :title="
      selectedTestSession.user?.id === loggedInUser?.id
        ? '내 상태 변경'
        : 'QA 항목 상태'
    "
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
      @onClickEditVersion="onClickEditVersion"
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

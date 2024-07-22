<script setup lang="ts">
import { reactive, ref } from "vue";
import type { ISwVersion, ITestSession, IUserInfo } from "@/types/types";
import SwVersionItem from "@/components/list/SwVersionItem.vue";
import ModalWrap from "@/components/ModalWrap.vue";
import TestStatusForm from "@/components/form/TestStatusForm.vue";
import { E_TestStatus, E_SwVersionModalType } from "@/types/enum.d";
import AddTesterForm from "../form/AddTesterForm.vue";
import { userApi } from "@/services/domain/userService";
import { testSessionApi } from "@/services/domain/testSessionService";

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
const openModalUpdateStatus = ref<boolean>(false);
const openModalAddTester = ref<boolean>(false);
const curSwVersionId = ref<string>("");

const selectedTestSession = reactive<Partial<ITestSession>>({
  sessionId: "",
  status: E_TestStatus.pending,
});

const toggleModal = (type?: E_SwVersionModalType) => {
  switch (type) {
    case E_SwVersionModalType.addTester:
      return (openModalAddTester.value = !openModalAddTester.value);
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

const onSubmitAddTesters = (testers: IUserInfo[]) => {
  const tobeDeleted = testSessionUserList.value
    .filter(
      (tester) => !testers.some((newTester) => newTester.id === tester.id)
    )
    .map((tester) => tester.id);
  // .map((tester) => ({ userId: tester.id, username: tester.username }));

  const tobeAdded = testers
    .filter(
      (tester) =>
        !testSessionUserList.value.some(
          (oldTester) => oldTester.id === tester.id
        )
    )
    .map((tester) => tester.id);
  // .map((tester) => ({ userId: tester.id, username: tester.username }));

  testSessionApi
    .PUT_deleteOrAddTestSession(curSwVersionId.value, tobeDeleted, tobeAdded)
    .then((res) => {
      props.onFetchSwVersionList &&
        props.onFetchSwVersionList(props.swVersionList?.[0]?.swType?.swTypeId);
    })
    .catch((error) => alert(error));

  // testSessionApi.POST_AllTestSession(apiParams).then((res) => {});
};
</script>

<template>
  <ModalWrap
    v-model="openModalUpdateStatus"
    title="Change Status"
    haveBtnCtl
    @onSubmit="onSubmitStatus"
  >
    <TestStatusForm v-model="selectedTestSession" />
  </ModalWrap>

  <ModalWrap v-model="openModalAddTester" title="Modify TesterLists">
    <AddTesterForm
      :userList="userList"
      :curTesterList="testSessionUserList"
      @onSubmitAddTesters="onSubmitAddTesters"
    />
  </ModalWrap>
  <v-expansion-panels>
    {{ curSwVersionId }}
    <SwVersionItem
      v-for="swVersion in props.swVersionList"
      :key="swVersion.swVersionId"
      :swVersion="swVersion"
      :toggleModal="toggleModal"
      @onClickTester="onClickTester"
      @onClickAddTester="onClickAddTester"
    />
  </v-expansion-panels>
</template>

<style scoped></style>

<script setup lang="ts">
import { reactive, ref, computed, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";

import { useUserStore } from "@/store/userStore";
import type { ISwVersion, ITestSession, IUserInfo, IComment } from "@/types/types";

import { E_TestStatus, E_SwVersionModalType, E_ModalType } from "@/types/enum.d";

import { userApi } from "@/services/domain/userService";
import { testSessionApi } from "@/services/domain/testSessionService";
import { commentApi } from "@/services/domain/commentService";
import { sseApi } from "@/services/domain/sseService";

import AddTesterForm from "@/components/form/AddTesterForm.vue";
import TestStatusForm from "@/components/form/TestStatusForm.vue";

import CommentList from "@/components/list/CommentList.vue";
import SwVersionItem from "@/components/list/SwVersionItem.vue";

import ModalWrap from "@/components/ModalWrap.vue";
import { countReactions } from "@/utils/common/formatter";

import { useRoute } from "vue-router";
import TestListChart from "./TestListChart.vue";
import UnitTestList from "./UnitTestList.vue";
// import UnitTestList from "./UnitTestList.vue";
// import TestListChips from "./TestListChips.vue";

const route = useRoute();

const props = defineProps({
  swVersionList: {
    type: Array as () => ISwVersion[],
  },
  onFetchSwVersionList: {
    type: Function,
  },
});

const detailViewTabs = ["버전 개요", "테스터"];
const curModalTab = ref<string>("버전 개요");

const userStore = useUserStore();
const { loggedInUser } = storeToRefs(userStore);

const panelOpened = ref(props.swVersionList?.[0]?.swVersionId ?? 0);


const emit = defineEmits(["onSubmitStatus", "onClickEditVersion"]);

const userList = ref<IUserInfo[]>([]);

const testSessionUserList = ref<IUserInfo[]>([]);
const curSwVersionId = ref<string>("");

const commentListForVersion = ref<IComment[]>([]);
const commentPage = ref<number>(1);
const commnetLastPage = ref<number>(1);

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

const sseTrigger = reactive({ type: "", date: "" });

const eventSse = sseApi();

onMounted(() => {
  if (!!route.query.open) {
    return (panelOpened.value = route.query.open as string);
  }
});
watch(
  () => route.params.id as string,
  (newId) => {
    if (!!newId) {
      return (panelOpened.value = 0);
    }
  },
);

watch(
  () => [openModalDetailView.value],
  ([newToggle]) => {
    if (!!newToggle) {
      eventSse.onMsg(curSwVersionId.value as string, sseTrigger);
      commentPage.value = 1;
    } else {
      curModalTab.value = detailViewTabs[0];
      eventSse.close();
    }
  },
);

watch(
  () => sseTrigger.date,
  (newDate) => {
    onFetchCommentsBySwVersionId();
  },
);

watch(
  () => commentPage.value,
  (newPage) => {
    onFetchCommentsBySwVersionId(newPage as number);
  },
);

const computedIsLastPage = computed(() => {
  if (commnetLastPage.value === 0) {
    return true;
  }

  return commentPage.value === commnetLastPage.value;
});

const curSwVersionInfo = computed(() => {
  return props.swVersionList?.find((sw) => sw.swVersionId === curSwVersionId.value);
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
  emit("onSubmitStatus", selectedTestSession, dbSavedTestSession, openModalUpdateStatus);
};

const onClickTester = (testerInfo: ITestSession, loggedInUserId: string) => {
  selectedTestSession.sessionId = testerInfo.sessionId;
  selectedTestSession.status = testerInfo.status;
  selectedTestSession.reasonContent = testerInfo.reasonContent;
  selectedTestSession.user = testerInfo.user;
  selectedTestSession.swVersion = testerInfo.swVersion;

  dbSavedTestSession.sessionId = testerInfo.sessionId;
  dbSavedTestSession.status = testerInfo.status;
  dbSavedTestSession.reasonContent = testerInfo.reasonContent;
  dbSavedTestSession.user = testerInfo.user;
};

const onClickLoadNextPage = () => {
  commentPage.value++;
};

const onFetchCommentsBySwVersionId = (page?: number) => {
  return commentApi.GET_commentsBySwVersionId(curSwVersionId.value, page).then((res) => {
    const { commentList, page, lastPage } = res as unknown as {
      commentList: IComment[];
      page: number;
      total: number;
      lastPage: number;
    };

    commnetLastPage.value = lastPage;

    const commentListWithReactionCount = commentList.map((comment) => {
      return {
        ...comment,
        counts: countReactions(comment.reactions),
        childComments: comment.childComments.map((child) => {
          return {
            ...child,
            counts: countReactions(child.reactions),
          };
        }),
      };
    });
    if (!!page && page > 1) {
      return (commentListForVersion.value = [
        ...commentListForVersion.value,
        ...(commentListWithReactionCount as IComment[]),
      ]);
    }
    commentListForVersion.value = commentListWithReactionCount as IComment[];
  });
};

const onSubmitComment = (params: any) => {
  if (!curSwVersionId.value) return alert("버전이 선택되지 않았습니다.");

  params.swVersionId = curSwVersionId.value;
  return commentApi.POST_comment(params).then((res) => {
    return onFetchCommentsBySwVersionId();
  });
};

const onSubmitEditComment = (commentId: string, content: string) => {
  return commentApi.PATCH_comment({ commentId, content }).then((res) => {
    return onFetchCommentsBySwVersionId();
  });
};
const onClickDeleteComment = (commentId: string) => {
  return commentApi.DELETE_comment(commentId).then((res) => {
    return onFetchCommentsBySwVersionId();
  });

};

const onClickAddTester = (swVerId: string) => {
  curSwVersionId.value = swVerId;
  const targetSwVersion = props.swVersionList?.find((sw) => sw.swVersionId === swVerId);

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

  return commentApi.GET_commentsBySwVersionId(swVerId).then((res) => onFetchCommentsBySwVersionId());
};

const onClickEditVersion = (swVerId: string) => {
  curSwVersionId.value = swVerId;
  emit("onClickEditVersion", curSwVersionInfo.value);
};

const onSubmitAddTesters = (testers: IUserInfo[]) => {
  const tobeDeleted = testSessionUserList.value
    .filter((tester) => !testers.some((newTester) => newTester.id === tester.id))
    .map((tester) => tester.id);

  const tobeAdded = testers
    .filter((tester) => !testSessionUserList.value.some((oldTester) => oldTester.id === tester.id))
    .map((tester) => tester.id);

  return testSessionApi
    .PUT_deleteOrAddTestSession(curSwVersionId.value, tobeDeleted, tobeAdded)
    .then((res) => {
      props.onFetchSwVersionList && props.onFetchSwVersionList(props.swVersionList?.[0]?.swType?.swTypeId);
      toggleModal(E_SwVersionModalType.addTester);
    })
    .catch((error) => alert(error));
};
</script>

<template>
  <!-- //'QA 항목 상태 변경' -->
  <ModalWrap v-model="openModalUpdateStatus"
    :title="selectedTestSession.user?.id === loggedInUser?.id ? '내 상태 변경' : 'QA 항목 상태'" haveBtnCtl
    @onSubmit="onSubmitStatus">
    <TestStatusForm v-model="selectedTestSession" />
  </ModalWrap>

  <ModalWrap v-model="openModalAddTester" title="테스터 관리">
    <AddTesterForm :userList="userList" :curTesterList="testSessionUserList" @onSubmitAddTesters="onSubmitAddTesters" />
  </ModalWrap>
  <!-- Detail Modal for Specific Version -->
  <ModalWrap v-model="openModalDetailView" :type="E_ModalType.full" :title="curSwVersionInfo?.versionTitle + ' 버전'">
    <div>
      <v-tabs v-model="curModalTab" color="primary">
        <v-tab v-for="tab in detailViewTabs" :key="tab" :value="tab">
          {{ tab }}
        </v-tab>
      </v-tabs>
    </div>
    <v-tabs-window v-model="curModalTab" class="tab-window">
      <v-tabs-window-item :value="detailViewTabs[0]">
        <SwVersionItem :swVersion="curSwVersionInfo" :toggleModal="toggleModal" @onClickTester="onClickTester"
          @onClickAddTester="onClickAddTester" @onClickDetailView="onClickDetailView" />
        <UnitTestList :swVersion="curSwVersionInfo" />
        <CommentList v-model="commentListForVersion" :page="commentPage" :computedLastPage="computedIsLastPage"
          @onFetchCommentsBySwVersionId="onFetchCommentsBySwVersionId" @onSubmitComment="onSubmitComment"
          @onClickDeleteComment="onClickDeleteComment" @onSubmitEditComment="onSubmitEditComment"
          @onClickLoadNextPage="onClickLoadNextPage" />
      </v-tabs-window-item>

      <v-tabs-window-item :value="detailViewTabs[1]">
        <TestListChart :swVersion="curSwVersionInfo" />
      </v-tabs-window-item>
    </v-tabs-window>
  </ModalWrap>
  <!-- Detail Modal for Specific Version -->

  <section class="version-list-con">
    <header>
      <h4>진행중인 버전</h4>
    </header>
    <v-expansion-panels v-model="panelOpened">
      <SwVersionItem v-for="(swVersion, idx) in props.swVersionList?.filter((ver) => {
        if (
          !ver.testSessions.every((tester) => tester.status === E_TestStatus.passed) ||
          ver.testSessions.length === 0
        )
          return ver;
      })" :key="swVersion.swVersionId" :swVersion="swVersion" :toggleModal="toggleModal"
        :isCurOpen="swVersion.swVersionId === panelOpened || idx === 0" itemType="panel" @onClickTester="onClickTester"
        @onClickAddTester="onClickAddTester" @onClickDetailView="onClickDetailView"
        @onClickEditVersion="onClickEditVersion" />
    </v-expansion-panels>
  </section>
  <section class="version-list-con finished" v-if="(props.swVersionList ?? []).filter((ver) => {
    if (ver.testSessions.every((tester) => tester.status === E_TestStatus.passed) && ver.testSessions.length > 0)
      return ver;
  }).length > 0
    ">
    <header>
      <h4>종료된 버전</h4>
    </header>
    <v-expansion-panels v-model="panelOpened">
      <SwVersionItem v-for="(swVersion, idx) in props.swVersionList?.filter((ver) => {
        if (ver.testSessions.every((tester) => tester.status === E_TestStatus.passed) && ver.testSessions.length > 0)
          return ver;
      })" :key="swVersion.swVersionId" :swVersion="swVersion" :toggleModal="toggleModal"
        :isCurOpen="swVersion.swVersionId === panelOpened || idx === 0" itemType="panel" @onClickTester="onClickTester"
        @onClickAddTester="onClickAddTester" @onClickDetailView="onClickDetailView"
        @onClickEditVersion="onClickEditVersion" />
    </v-expansion-panels>
  </section>
</template>

<style scoped lang="scss">
.version-list-con {
  position: relative;
  z-index: 1;
  padding: 20px 0;

  &.finished {
    z-index: 0;
  }

  header {
    h4 {
      font-size: 20px;
      font-weight: 700;
      padding-bottom: 10px;
    }
  }
}

// .tab-window {
//   // min-height: 400px;
// }
</style>

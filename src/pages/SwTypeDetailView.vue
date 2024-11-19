<script setup lang="ts">
import { ref, watch, onMounted, reactive, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

import { useUserStore } from "@/store/userStore";

import { swVersionApi, testUnitApi } from "@/services/domain/swService";
import { testSessionApi } from "@/services/domain/testSessionService";

import type { ISwType, ISwVersion, ITestSession, ITestUnit, IUserInfo } from "@/types/types";
import { E_ModalType, E_Role } from "@/types/enum.d";

import SwVersionList from "@/components/list/SwVersionList.vue";
import DefaultLayout from "@/layout/DefaultLayout.vue";
import ModalWrap from "@/components/ModalWrap.vue";
import NewVersionForm from "@/components/form/NewVersionForm.vue";
import AddMaintainerForm from "@/components/form/AddMaintainerForm.vue";
import NewBoardForm from "@/components/form/NewBoardForm.vue";

import { useSwStore } from "@/store/swStore";
import { userApi } from "@/services/domain/userService";

import { maintainerApi } from "@/services/domain/maintainerService";
import BoardClass from "@/entity/Board";
import { boardApi } from "@/services/domain/boardService";
import { checkEditorValueEmpty } from "@/utils/common/validator";
import { buildLogApi, jenkinsDeploymentApi } from "@/services/domain/jenkinsDeploymentService";
import { JenkinsDeploymentClass } from "@/entity/JenkinsDeployment";
import { sseApiForJenkinsDeployment } from "@/services/domain/sseService";

const route = useRoute();

const userStore = useUserStore();
const { loggedInUser } = storeToRefs(userStore);

const swStore = useSwStore();
const { swTypes } = storeToRefs(swStore);

const maintainerList = ref<IUserInfo[]>([]);
const userList = ref<IUserInfo[]>([]);
const swVersionList = ref<ISwVersion[]>([]);
const boardList = ref<BoardClass[]>([]);
const boardPageInfo = reactive({ page: 1, totalPage: 1 });

const jenkinsDeploymentList = ref<JenkinsDeploymentClass[]>([]);

const editVersionFlag = ref<boolean>(false);
const editVersionInfo = reactive<Partial<ISwVersion & { swTypeId: string }>>({});

const modalStatus = reactive({
  openModalAddMaintainer: false,
  openModalNewVersion: false,
  openModalNewBoard: false,
});

const tabs = ["요청 사항", "업데이트 사항"];
const curTab = ref<string>(tabs[0]);

const submitErrorFlag = ref<boolean>(true);
const swTypeInfo = ref<ISwType>();

const sseTrigger = reactive({ type: "", date: "" });
const sseForJenkinsDeployment = sseApiForJenkinsDeployment();

onMounted(() => {
  Promise.all([
    onFetchMaintainerList(route.params.id as string),
    onFetchSwVersionList(route.params.id as string),
    onFetchBoardList(route.params.id as string),
    onFetchJenkinsDeployment(route.params.id as string),
  ]);
  sseForJenkinsDeployment.onMsg(route.params.id as string, sseTrigger);
});

onUnmounted(() => {
  sseForJenkinsDeployment.close();
});

watch(
  () => sseTrigger.date,
  newDate => {
    onFetchJenkinsDeployment(route.params.id as string);
  }
);
watch(
  () => [route.params.id, swTypes.value],
  ([newId, newSwTypes]) => {
    if (!!newSwTypes) {
      swTypeInfo.value = swTypes.value.find(swType => swType.swTypeId === newId) as ISwType;
    }
    curTab.value = tabs[0];

    Promise.all([
      onFetchMaintainerList(newId as string),
      onFetchSwVersionList(newId as string),
      onFetchBoardList(newId as string),
      onFetchJenkinsDeployment(newId as string),
    ]);
  }
);

watch(
  () => [modalStatus.openModalNewVersion, submitErrorFlag.value],
  ([newModalFlag, newErrFlag]) => {
    if (!!newModalFlag) {
      submitErrorFlag.value = true;
    }

    if (!newModalFlag && newErrFlag) {
      let confirmFlag = confirm("Listed below will not be save, Sure to exit?");
      if (!confirmFlag) return (modalStatus.openModalNewVersion = true);
    }
  }
);
watch(
  () => [curTab.value, boardPageInfo.page],
  ([newTab, newPage], [oldTab, oldPage]) => {
    const boardType = newTab === "요청 사항" ? "req" : "update";
    onFetchBoardList(route.params.id as string, boardType, newTab === oldTab ? Number(newPage) : 1);
  }
);

const onFetchSwVersionList = (swTypeId: string) => {
  return swVersionApi.GET_swVersionsBySwTypeId(swTypeId).then(res => (swVersionList.value = res as ISwVersion[]));
};

const onFetchJenkinsDeployment = (swTypeId: string) => {
  return jenkinsDeploymentApi.GET_jenkinsDeploymentBySwType(swTypeId).then(res => {
    jenkinsDeploymentList.value = res.map(dep => new JenkinsDeploymentClass(dep));
  });
};

const onFetchBoardList = (swTypeId: string, boardType: "req" | "update" = "req", page: number = 1) => {
  return boardApi.GET_boardList(swTypeId, boardType, page).then(res => {
    boardList.value = res.boardList as BoardClass[];
    boardPageInfo.totalPage = res.lastPage as number;
    boardPageInfo.page = res.page as number;
  });
};

const onSubmitStatus = (
  selectedTestSession: Partial<ITestSession>,
  dbSavedTestSession: Partial<ITestSession>,
  openModalUpdateStatus: any
) => {
  if (!!selectedTestSession.sessionId && !!selectedTestSession.status && !!selectedTestSession.reasonContent) {
    if (
      selectedTestSession.status === dbSavedTestSession.status &&
      selectedTestSession.reasonContent === dbSavedTestSession.reasonContent
    ) {
      return alert("바뀐점이 없습니다.");
    }

    return testSessionApi
      .PATCH_testSession(selectedTestSession.sessionId, selectedTestSession.status, selectedTestSession.reasonContent)
      .then(_ => {
        submitErrorFlag.value = true;
        openModalUpdateStatus.value = false;
        onFetchSwVersionList(route.params.id as string);
      });
  } else {
    return alert("Please fill out all fields");
  }
};

const onSubmitNewVersion = async (
  versionTitle: string,
  versionDesc: string,
  tag: string,
  file?: File,
  unitTestList?: Partial<ITestUnit>[]
) => {
  try {
    if (!!checkEditorValueEmpty(versionDesc)) return alert("버전 설명을 입력해주세요");

    const createSwVersion = await swVersionApi.POST_swVersion({
      swTypeId: Array.isArray(route.params.id) ? route.params.id[0] : route.params.id,
      versionTitle,
      versionDesc,
      tag,
      ...(file && { file }),
    });
    if (!!unitTestList && unitTestList?.length > 0) {
      if (unitTestList.some(item => !item.unitDesc)) {
        return alert("유닛테스트를 작성 해주세요");
      }

      await testUnitApi.POST_testUnits(unitTestList, createSwVersion.swVersionId);
    }
    submitErrorFlag.value = false;

    modalStatus.openModalNewVersion = false;
    return onFetchSwVersionList(createSwVersion.swType.swTypeId);
  } catch (error) {
    if ((error as { statusCode: number; message: string }).statusCode === 409) {
      return alert("버전 제목이 중복됩니다.");
    }

    return alert("Error: 문제가 발생하였습니다. 다시 시도해주세요.");
  }
};

const onSubmitEditVersion = async (
  swVersionId: string,
  versionTitle: string,
  versionDesc: string,
  tag: string,
  file?: File,
  unitTestList?: Partial<ITestUnit>[]
) => {
  try {
    if (!!checkEditorValueEmpty(versionDesc)) return alert("버전 설명을 입력해주세요");

    await swVersionApi.PATCH_swVersion({
      swVersionId,
      versionTitle,
      versionDesc,
      tag,
      ...(file && { file }),
    });
    // console.log("@@@@ ", unitTestList, !!unitTestList, unitTestList?.length > 0);

    // if (!!unitTestList && unitTestList?.length > 0) {
    if (unitTestList?.some(item => !item.unitDesc)) {
      return alert("유닛테스트를 작성 해주세요");
    }

    await testUnitApi.PATCH_testUnit(unitTestList ?? [], swVersionId);
    // }

    submitErrorFlag.value = false;

    modalStatus.openModalNewVersion = false;
    onFetchSwVersionList(route.params.id as string);
  } catch (error) {
    if ((error as { statusCode: number; message: string }).statusCode === 409) {
      return alert("버전 제목이 중복됩니다.");
    }

    return alert("Error: 문제가 발생하였습니다. 다시 시도해주세요.");
  }
};

const onClickEditVersion = (curSwVer: ISwVersion) => {
  modalStatus.openModalNewVersion = true;
  editVersionFlag.value = true;

  Object.assign(editVersionInfo, curSwVer);
};

const onFetchMaintainerList = (swTypeId: string) => {
  return maintainerApi.GET_maintainerListBySwTypeId(swTypeId).then(res => {
    const dataMaintainerList = (res as { user: IUserInfo }[]).map(maintainer => maintainer.user) as IUserInfo[];
    maintainerList.value = dataMaintainerList;
  });
};

const onClickManageMaintainer = () => {
  modalStatus.openModalAddMaintainer = true;

  return userApi.GET_users().then(usersData => {
    userList.value = usersData as IUserInfo[];
    onFetchMaintainerList(route.params.id as string);
  });
};

const onSubmitAddMaintainers = (maintainers: IUserInfo[]) => {
  const tobeDeleted = maintainerList.value
    .filter(person => !maintainers.some(newMaintainer => newMaintainer.id === person.id))
    .map(maintainer => maintainer.id);

  const tobeAdded = maintainers
    .filter(person => !maintainerList.value.some(oldMaintainer => oldMaintainer.id === person.id))
    .map(maintainer => maintainer.id);

  maintainerApi
    .PUT_deleteOrAddMaintainer(route.params.id as string, tobeDeleted, tobeAdded)
    .then(res => {
      modalStatus.openModalAddMaintainer = false;

      onFetchMaintainerList(route.params.id as string);
    })
    .catch(error => alert(error));
};

const onSubmitNewBoard = (boardParam: BoardClass) => {
  boardApi.POST_newBoard({ ...boardParam, swTypeId: route.params.id as string }).then(res => {
    modalStatus.openModalNewBoard = false;
    onFetchBoardList(route.params.id as string, curTab.value === "요청 사항" ? "req" : "update");
  });
};

const onClickJenkinsDeployment = (jenkinsDeploymentId: string, tag: string) => {
  console.log("@@@@@@@@@@@@@@@@", jenkinsDeploymentId, tag);

  buildLogApi.POST_buildLog({ jenkinsDeploymentId, tag }).then(res => {
    onFetchJenkinsDeployment(route.params.id as string);
  });
};
</script>

<template>
  <ModalWrap
    v-model="modalStatus.openModalNewVersion"
    :title="editVersionFlag ? '버전 정보 수정' : '신규 버전'"
    :type="E_ModalType.full"
  >
    <NewVersionForm
      @onSubmitNewVersion="onSubmitNewVersion"
      @onSubmitEditVersion="onSubmitEditVersion"
      :editFlag="editVersionFlag"
      :editVersionInfo="editVersionInfo"
    />
  </ModalWrap>

  <ModalWrap v-model="modalStatus.openModalAddMaintainer" title="관리자 관리">
    <AddMaintainerForm
      :userList="userList"
      :curMaintainerList="maintainerList"
      @onSubmitAddMaintainers="onSubmitAddMaintainers"
    />
  </ModalWrap>

  <ModalWrap v-model="modalStatus.openModalNewBoard" title="새로운 게시글" :type="E_ModalType.full">
    <NewBoardForm @onSubmitNewBoard="onSubmitNewBoard" />
  </ModalWrap>

  <DefaultLayout>
    <header class="sw-detail-header">
      <h3>{{ swTypeInfo?.typeTitle }} 개발 버전 목록</h3>

      <div class="header-btn-con" v-if="loggedInUser?.role !== E_Role.tester">
        <v-btn variant="outlined" color="primary" @click="onClickManageMaintainer">
          <v-icon icon="mdi-account-multiple-plus" start></v-icon>
          관리자 관리
        </v-btn>
        <v-btn
          variant="outlined"
          color="primary"
          @click="
            () => {
              modalStatus.openModalNewVersion = true;
              editVersionFlag = false;
            }
          "
        >
          새로운 버전 등록
          <v-icon icon="mdi-plus"></v-icon>
        </v-btn>
      </div>
    </header>
    <section v-if="loggedInUser?.role !== E_Role.tester" class="maintainer-con box-wrap">
      <header>
        <h4>Maintainer</h4>
      </header>
      <div class="maintainer-chips">
        <v-chip
          color="blue-grey-darken-3"
          v-for="maintainer in maintainerList"
          :class="maintainer.id === loggedInUser?.id ? ' on' : ''"
          class="mr-2 mb-2"
          :variant="maintainer.id === loggedInUser?.id ? 'tonal' : 'outlined'"
          label
        >
          {{ maintainer.id === loggedInUser?.id ? "me" : maintainer.username }}
        </v-chip>
      </div>
    </section>

    <div class="content-con">
      <div class="list-con">
        <SwVersionList
          :swVersionList="swVersionList"
          :jenkinsDeploymentList="jenkinsDeploymentList"
          :onFetchSwVersionList="onFetchSwVersionList"
          @onClickJenkinsDeployment="onClickJenkinsDeployment"
          @onSubmitStatus="onSubmitStatus"
          @onClickEditVersion="onClickEditVersion"
        />
      </div>
      <section class="list-con">
        <div class="board-con box-wrap">
          <div class="board-con-header">
            <v-tabs v-model="curTab" color="primary">
              <v-tab v-for="tab in tabs" :key="tab" :value="tab">
                {{ tab }}
              </v-tab>
            </v-tabs>
            <v-btn
              color="primary"
              variant="tonal"
              flat
              @click="
                () => {
                  modalStatus.openModalNewBoard = true;
                }
              "
            >
              새로운 게시글 등록
              <v-icon icon="mdi-plus"></v-icon>
            </v-btn>
          </div>
          <v-card flat>
            <v-tabs-window v-model="curTab">
              <v-tabs-window-item :value="tabs[0]">
                <BoardRequestList :boardList="boardList" :curTab="curTab" />
                <v-pagination
                  v-model="boardPageInfo.page"
                  :length="boardPageInfo.totalPage"
                  class="my-4"
                  size="small"
                ></v-pagination>
              </v-tabs-window-item>

              <v-tabs-window-item :value="tabs[1]">
                <BoardRequestList :boardList="boardList" :curTab="curTab" />
                <v-pagination
                  v-model="boardPageInfo.page"
                  :length="boardPageInfo.totalPage"
                  class="my-4"
                  size="small"
                ></v-pagination>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-card>
        </div>
      </section>
    </div>
  </DefaultLayout>
</template>

<style scoped lang="scss">
.sw-detail-header {
  padding: 20px 0;
  display: flex;
  justify-content: space-between;

  .header-btn-con {
    display: flex;
    gap: 10px;
  }

  h3 {
    font-size: 24px;
    font-weight: 500;
  }
}

.maintainer-con {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 14px;
  padding: 14px 0 6px 24px;

  h4 {
    padding-bottom: 10px;
  }

  .maintainer-chips {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
}

.content-con {
  display: flex;
  gap: 40px;
  margin-top: 40px;

  .list-con {
    width: calc(40% - 40px);

    &:first-child {
      width: 60%;
      flex-shrink: 0;
    }
  }

  .board-con {
    padding: 0;
  }

  .board-con-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 20px;
    border-bottom: 1px solid #ddd;

    .v-tabs {
      button {
        font-size: 16px;
        font-weight: 500;
        letter-spacing: -0.006em;
      }
    }
  }
}
</style>

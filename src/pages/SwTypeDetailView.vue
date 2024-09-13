<script setup lang="ts">
import { ref, watch, onMounted, reactive } from "vue";
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

import { useSwStore } from "@/store/swStore";
import { userApi } from "@/services/domain/userService";

import { maintainerApi } from "@/services/domain/maintainerService";

const route = useRoute();

const userStore = useUserStore();
const { loggedInUser } = storeToRefs(userStore);

const swStore = useSwStore();
const { swTypes } = storeToRefs(swStore);

const maintainerList = ref<IUserInfo[]>([]);
const userList = ref<IUserInfo[]>([]);

const swVersionList = ref<ISwVersion[]>([]);
const openModalNewVersion = ref<boolean>(false);
const editVersionFlag = ref<boolean>(false);
const editVersionInfo = reactive<Partial<ISwVersion & { swTypeId: string }>>({});

const openModalAddMaintainer = ref<boolean>(false);

const submitErrorFlag = ref<boolean>(true);
const swTypeInfo = ref<ISwType>();

onMounted(() => {
  Promise.all([onFetchMaintainerList(route.params.id as string), onFetchSwVersionList(route.params.id as string)]);
});

watch(
  () => [route.params.id, swTypes.value],
  ([newId, newSwTypes]) => {
    if (!!newSwTypes) {
      swTypeInfo.value = swTypes.value.find((swType) => swType.swTypeId === newId) as ISwType;
    }

    Promise.all([onFetchMaintainerList(newId as string), onFetchSwVersionList(newId as string)]);
  },
);
watch(
  () => [openModalNewVersion.value, submitErrorFlag.value],
  ([newModalFlag, newErrFlag]) => {
    if (!!newModalFlag) {
      submitErrorFlag.value = true;
    }

    if (!newModalFlag && newErrFlag) {
      let confirmFlag = confirm("Listed below will not be save, Sure to exit?");
      if (!confirmFlag) return (openModalNewVersion.value = true);
    }
  },
);

const onFetchSwVersionList = (swTypeId: string) => {
  return swVersionApi.GET_swVersionsBySwTypeId(swTypeId).then((res) => (swVersionList.value = res as ISwVersion[]));
};

const onSubmitStatus = (
  selectedTestSession: Partial<ITestSession>,
  dbSavedTestSession: Partial<ITestSession>,
  openModalUpdateStatus: any,
) => {
  //TODO: typescript better way than partial
  if (!!selectedTestSession.sessionId && !!selectedTestSession.status && !!selectedTestSession.reasonContent) {
    if (
      selectedTestSession.status === dbSavedTestSession.status &&
      selectedTestSession.reasonContent === dbSavedTestSession.reasonContent
    ) {
      return alert("바뀐점이 없습니다.");
    }

    return testSessionApi
      .PATCH_testSession(selectedTestSession.sessionId, selectedTestSession.status, selectedTestSession.reasonContent)
      .then((_) => {
        //TODO: handle success instead of call api again
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
  unitTestList?: Partial<ITestUnit>[],
) => {
  // console.log("onSubmitNewVersion", versionTitle, versionDesc, tag, file);
  try {
    const createSwVersion = await swVersionApi.POST_swVersion({
      swTypeId: Array.isArray(route.params.id) ? route.params.id[0] : route.params.id,
      versionTitle,
      versionDesc,
      tag,
      ...(file && { file }),
    });
    if (!!unitTestList && unitTestList?.length > 0) {
      if (unitTestList.some((item) => !item.unitDesc)) {
        return alert("유닛테스트를 작성 해주세요");
      }

      await testUnitApi.POST_testUnits(unitTestList, createSwVersion.swVersionId);
    }
    submitErrorFlag.value = false;
    openModalNewVersion.value = false;
    return onFetchSwVersionList(createSwVersion.swType.swTypeId);
  } catch (error) {
    return alert("Error:Something wrong with creating new version");
  }
};

const onSubmitEditVersion = async (
  swVersionId: string,
  versionTitle: string,
  versionDesc: string,
  tag: string,
  file?: File,
  unitTestList?: Partial<ITestUnit>[],
) => {
  try {
    await swVersionApi.PATCH_swVersion({
      swVersionId,
      versionTitle,
      versionDesc,
      tag,
      ...(file && { file }),
    });

    if (!!unitTestList && unitTestList?.length > 0) {
      if (unitTestList.some((item) => !item.unitDesc)) {
        return alert("유닛테스트를 작성 해주세요");
      }

      await testUnitApi.PATCH_testUnit(unitTestList, swVersionId);
    }

    submitErrorFlag.value = false;
    openModalNewVersion.value = false;
    onFetchSwVersionList(route.params.id as string);
  } catch (error) {
    console.log(error);
    return alert("Error:Something wrong with editing version");
  }
};

const onClickEditVersion = (curSwVer: ISwVersion) => {
  openModalNewVersion.value = true;
  editVersionFlag.value = true;

  Object.assign(editVersionInfo, curSwVer);
};

const onFetchMaintainerList = (swTypeId: string) => {
  return maintainerApi.GET_maintainerListBySwTypeId(swTypeId).then((res) => {
    const dataMaintainerList = (res as { user: IUserInfo }[]).map((maintainer) => maintainer.user) as IUserInfo[];
    maintainerList.value = dataMaintainerList;
  });
};

const onClickManageMaintainer = () => {
  openModalAddMaintainer.value = true;

  return userApi.GET_users().then((usersData) => {
    userList.value = usersData as IUserInfo[];
    onFetchMaintainerList(route.params.id as string);
  });
};

const onSubmitAddMaintainers = (maintainers: IUserInfo[]) => {
  const tobeDeleted = maintainerList.value
    .filter((person) => !maintainers.some((newMaintainer) => newMaintainer.id === person.id))
    .map((maintainer) => maintainer.id);

  const tobeAdded = maintainers
    .filter((person) => !maintainerList.value.some((oldMaintainer) => oldMaintainer.id === person.id))
    .map((maintainer) => maintainer.id);

  maintainerApi
    .PUT_deleteOrAddMaintainer(route.params.id as string, tobeDeleted, tobeAdded)
    .then((res) => {
      openModalAddMaintainer.value = false;
      onFetchMaintainerList(route.params.id as string);
    })
    .catch((error) => alert(error));
};
</script>

<template>
  <ModalWrap
    v-model="openModalNewVersion"
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

  <ModalWrap v-model="openModalAddMaintainer" title="관리자 관리">
    <AddMaintainerForm
      :userList="userList"
      :curMaintainerList="maintainerList"
      @onSubmitAddMaintainers="onSubmitAddMaintainers"
    />
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
              openModalNewVersion = true;
              editVersionFlag = false;
            }
          "
        >
          새로운 버전 등록
          <v-icon icon="mdi-plus"></v-icon>
        </v-btn>
      </div>
    </header>
    <section v-if="loggedInUser?.role !== E_Role.tester" class="maintainer-con">
      <header>
        <h4>Maintainer</h4>
      </header>
      <div>
        <v-chip
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

    <SwVersionList
      :swVersionList="swVersionList"
      :onFetchSwVersionList="onFetchSwVersionList"
      @onSubmitStatus="onSubmitStatus"
      @onClickEditVersion="onClickEditVersion"
    />
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
}
.maintainer-con {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 10px;
}
</style>

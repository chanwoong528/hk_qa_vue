<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useDate } from "vuetify";

import { storeToRefs } from "pinia";
import { useUserStore } from "@/store/userStore";

import {
  //  E_ReactionParentType, E_ReactionType,
  E_Role,
  E_SwVersionModalType,
  E_TestStatus,
} from "@/types/enum.d";
import type { ISwVersion, ITestSession, ITestUnit } from "@/types/types.d";

import { swVersionApi, testUnitApi } from "@/services/domain/swService";
// import { reactionApi } from "@/services/domain/reactionService";

import { formatDateTime, formatDate, formatDateForServer, countReactions, renderIconForVersionStatus, renderTestStatus } from "@/utils/common/formatter";
import UnitTestList from "./UnitTestList.vue";
import TestListChips from "./TestListChips.vue";


const store = useUserStore();
const { loggedInUser } = storeToRefs(store);

const dateAdapter = useDate();

const props = defineProps({
  swVersion: {
    type: Object as () => ISwVersion,
  },
  isCurOpen: Boolean,
  itemType: String,
  toggleModal: Function,
});
const unitList = ref<ITestUnit[]>([]);
const openCalender = ref<boolean>(false);
const selectedDate = ref<string>();

watch(
  () => [props.isCurOpen, props.swVersion?.swVersionId],
  ([newOpen, newVerId]) => {
    if (!!newOpen && !!newVerId) {
      fetchUnitList(newVerId as string);

      if (!!props.swVersion?.dueDate) {
        selectedDate.value = dateAdapter.parseISO(props.swVersion.dueDate) as string;
      }
    }
  },
);

const fetchUnitList = (swVersionId: string) => {
  testUnitApi.GET_testUnitsBySwVersionId(swVersionId).then((res) => {
    const unitListWithReactionCount = res.map((unit) => {
      return {
        ...unit,
        counts: countReactions(unit.reactions),
      };
    });
    return (unitList.value = unitListWithReactionCount as ITestUnit[]);
  });
};

const emit = defineEmits(["onClickTester", "onClickAddTester", "onClickDetailView", "onClickEditVersion"]);

const testSessionsPassStatus = computed(() => {
  if (props.swVersion?.testSessions && props.swVersion?.testSessions.length > 0) {
    if (props.swVersion?.testSessions.some((tester) => tester.status === E_TestStatus.failed))
      return E_TestStatus.failed;
    if (props.swVersion?.testSessions.every((tester) => tester.status === E_TestStatus.passed))
      return E_TestStatus.passed;

    return E_TestStatus.pending;
  }
  return E_TestStatus.pending;
});

const onClickLoggedInUserStatus = (tester: ITestSession) => {
  if (!!props.toggleModal) {
    if (tester.status === E_TestStatus.pending && loggedInUser.value?.id !== tester.user.id)
      return alert("테스트가 진행중입니다.");

    props.toggleModal();
    return emit("onClickTester", tester, loggedInUser.value?.id);
  }
};

const copyToClipboard = () => {
  const parsedUrl = new URL(window.location.href);
  const targetUrl = `${parsedUrl.origin}${parsedUrl.pathname}?open=${props.swVersion?.swVersionId}`

  // clipboard API 사용
  if (navigator.clipboard !== undefined) {
    navigator.clipboard
      .writeText(targetUrl)

  } else {
    // execCommand 사용
    const textArea = document.createElement('textarea');
    textArea.value = targetUrl;
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, 99999);
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('복사 실패', err);
    }
    textArea.setSelectionRange(0, 0);
    document.body.removeChild(textArea);
  }


}

const onClickEditVersion = () => {
  openCalender.value = false;

  const testers = props.swVersion?.testSessions;
  const versionAuthor = props.swVersion?.user;
  if (
    testers?.some((tester) => tester.user.id === loggedInUser.value?.id) ||
    versionAuthor?.id === loggedInUser.value?.id
  ) {
    emit("onClickEditVersion", props.swVersion?.swVersionId);

    return fetchUnitList(props.swVersion?.swVersionId as string);
  }

  return alert("테스트 참여자 또는 버전 작성자만 수정 가능합니다.");
};
const onClickAddTester = () => {
  if (!!props.toggleModal) {
    props.toggleModal(E_SwVersionModalType.addTester);
    emit("onClickAddTester", props.swVersion?.swVersionId);
  }
};

const onClickDetailView = () => {
  if (!!props.toggleModal) {
    props.toggleModal(E_SwVersionModalType.detailView);
    emit("onClickDetailView", props.swVersion?.swVersionId);
  }
};



const onSubmitDueDate = () => {
  if (!selectedDate.value) return alert("마감일을 선택해주세요");

  swVersionApi
    .PATCH_swVersionDueDate(props.swVersion?.swVersionId as string, formatDateForServer(selectedDate.value))
    .then((res) => {
      openCalender.value = false;
    });
};
</script>

<template>
  <v-expansion-panel v-if="itemType === 'panel'" :value="props.swVersion?.swVersionId">
    <v-expansion-panel-title variant = "tonal">
      <div class="title-header">
        <h3>
          {{ props.swVersion?.versionTitle }}
        </h3>
      </div>
      <template v-slot:actions="{ expanded }">
        <v-chip  size="small" :color="renderTestStatus(testSessionsPassStatus)">{{renderIconForVersionStatus(testSessionsPassStatus)}}</v-chip>
        <v-icon  size="x-large" :icon="!!expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
      </template>
    </v-expansion-panel-title>

    <v-expansion-panel-text @Click.stop="onClickDetailView">
      <div class="desc-wrap">

        <div class="edit-btn-con">
          <div class="title-header--left">
            <p v-if="!!props.swVersion?.createdAt" class="date">
              <strong>생성 :</strong> {{ formatDateTime(props.swVersion?.createdAt) }}
            </p>
            <p class="author">
             <strong>만든이 :</strong> {{ props.swVersion?.user.username }}
            </p>
          </div>
          <v-snackbar :timeout="2000" rounded="pill">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" variant="tonal" @click.stop="copyToClipboard" size="small" color="blue-grey" >
                <v-icon class="mdi mdi-link-variant" size="large"></v-icon>
              </v-btn>
            </template>
            복사되었습니다.
          </v-snackbar>
          <v-btn class="edit-btn" variant="tonal" color="primary" size="small" @click.stop="openCalender = true">
            <template v-if="!selectedDate">
              <v-icon class="mdi mdi-calendar-check" start></v-icon>
              마감일
            </template>
            <template v-else> Due: {{ formatDate(selectedDate) }} </template>
          </v-btn>
          <div class="date-picker" v-if="!!openCalender" @click.stop>
            <v-btn class="close-btn" icon="mdi-close" @click="openCalender = false" variant="plain"></v-btn>
            <v-date-picker v-model="selectedDate" show-adjacent-months> </v-date-picker>
            <v-btn variant="plain" @click="onSubmitDueDate">ok</v-btn>
          </div>
          <v-btn class="edit-btn" variant="tonal" color="primary" size="small" @click.stop="onClickEditVersion">
            <v-icon class="mdi mdi-application-edit" start></v-icon>
            수정
          </v-btn>
        </div>
        <div class="desc-inner-html" v-html="props.swVersion?.versionDesc" />
      </div>
      <a v-if="props.swVersion?.fileSrc" :href="props.swVersion?.fileSrc">첨부 파일</a>

      <UnitTestList :swVersion="props.swVersion" />

      <div class="version-ctrl-con">
        <TestListChips :swVersion="props.swVersion" @onClickLoggedInUserStatus="onClickLoggedInUserStatus" />

        <div class="modify-tester-btn-con">
          <v-btn v-if="loggedInUser?.role !== E_Role.tester" @click.stop="onClickAddTester"
            class="text-none text-subtitle-1" variant="tonal" color="primary" >
            <v-icon icon="mdi-account-multiple-plus" start></v-icon>
            테스터 관리
          </v-btn>
          <v-btn @click.stop="onClickDetailView" class="text-none text-subtitle-1" variant="flat" color="grey-lighten-3">
            상세보기
            <v-icon icon="mdi-dots-horizontal-circle-outline" end></v-icon>
          </v-btn>
        </div>
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>

  <div class="default-type-item" v-else>
    <a v-if="props.swVersion?.fileSrc" :href="props.swVersion?.fileSrc">Download File</a>
    <div class="desc-inner-html expand" v-html="props.swVersion?.versionDesc"></div>

    <div class="version-ctrl-con">
      <v-divider :thickness="2"></v-divider>
      <!-- <TestListChips :swVersion="props.swVersion" @onClickLoggedInUserStatus="onClickLoggedInUserStatus" /> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.test-unit-list {
  display: flex;
  flex-direction: column;
  padding: 8px 24px 16px;

  >li {
    position: relative;
    padding-bottom: 30px;
  }

  .reactions-con {
    display: flex;
    position: absolute;
    list-style: none;
    gap: 4px;
    bottom: 0;
  }
}
.title-header--left {
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 14px;
  padding-right: 6px;
  strong {
    font-weight: 500;
    color: #000;
  }
}
.modify-tester-btn-con {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.default-type-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;

  margin-top: 20px;
}
.v-expansion-panel--active > .v-expansion-panel-title:not(.v-expansion-panel-title--static) {
  min-height: 54px;
  background: #f4f8ff;
  border-bottom-style: solid;
  h3 {
    opacity: 1;
  }
}

.v-expansion-panel {
  &:last-child:not(.v-expansion-panel--active) {
    .v-expansion-panel-title {
      border-bottom-width: 0;
    }
  }
}
.v-expansion-panel-title {
  border-bottom:1px dashed rgb(221 221 221 / 80%) ;
  padding-right:24px;
  min-height: 54px;
  
  .v-chip {
    margin-right: 8px;
  }
  .title-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  
    h3 {
      font-weight: 500;
      opacity: 0.8;
    }

    &--left {
      padding: 0 8px;
      display: flex;
      flex-direction: column;

      justify-content: center;
      gap: 4px;

      p {
        font-size: 0.8rem;
        color: #999;
        font-weight: 600;
      }
    }

    // .date {
    // }
    // .author {
    // }
  }
}
.v-expansion-panel-text {
    padding: 10px 2px;
    border-bottom:1px solid #ddd;
  
}
.desc-wrap {
  position: relative;
  padding-top: 40px;

  .edit-btn-con {
    display: flex;
    gap: 10px;
    position: absolute;
    top: 0;
    right: 0;

    .date-picker {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      position: absolute;
      right: 0;
      z-index: 1000;
      box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.8);
      background-color: #fff;
      border-radius: 8px;

      // border: 10px solid red;
      .close-btn {
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }

  .desc-inner-html {
    overflow: hidden;
    max-height: 300px;
    padding: 20px;
    background: #f9f9f9;
    &.expand {
      max-height: none;

      :deep(img) {
        border: 1px solid #ececec;
      }
    }
  }
}

.version-ctrl-con {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .tester-con {
    p {
      font-size: 1rem;
      font-weight: 800;
      margin: 10px 0;
    }
  }
}
</style>

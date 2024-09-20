<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useDate } from "vuetify";

import { storeToRefs } from "pinia";
import { useUserStore } from "@/store/userStore";

import { E_ReactionParentType, E_ReactionType, E_Role, E_SwVersionModalType, E_TestStatus } from "@/types/enum.d";
import type { IReaction, ISwVersion, ITestSession, ITestUnit } from "@/types/types.d";

import { swVersionApi, testUnitApi } from "@/services/domain/swService";
import { reactionApi } from "@/services/domain/reactionService";

import { renderIconForReaction, formatDateTime, formatDate, formatDateForServer } from "@/utils/common/formatter";

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

function countReactions(reactions: IReaction[]): Record<string, number> {
  const reactionCounts: Record<string, number> = {};

  reactions.forEach((reaction) => {
    const type = reaction.reactionType;
    if (!!type) {
      if (reactionCounts[type]) {
        reactionCounts[type]++;
      } else {
        reactionCounts[type] = 1;
      }
    }
  });
  return reactionCounts;
}

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

const REACT_BTN_LIST: { type: E_ReactionType; icon: string; color: string }[] = [
  {
    type: E_ReactionType.check,
    icon: "mdi-check",
    color: "teal",
  },
  {
    type: E_ReactionType.stop,
    icon: "mdi-close-circle",
    color: "error",
  },
];

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
const onClickEditVersion = () => {
  const testers = props.swVersion?.testSessions;
  const versionAuthor = props.swVersion?.user;
  if (
    testers?.some((tester) => tester.user.id === loggedInUser.value?.id) ||
    versionAuthor?.id === loggedInUser.value?.id
  ) {
    return emit("onClickEditVersion", props.swVersion?.swVersionId);
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

const renderIconForVersionStatus = (status: E_TestStatus) => {
  switch (status) {
    case E_TestStatus.failed:
      return "mdi-close-circle";
    case E_TestStatus.passed:
      return "mdi-check";
    default:
      return "mdi-alert-circle";
  }
};

const onClickReactionBtn = (btnType: E_ReactionType, testUnitId: string) => {
  const testers = props.swVersion?.testSessions;
  const versionAuthor = props.swVersion?.user;

  if (
    !testers?.some((tester) => tester.user.id === loggedInUser.value?.id) &&
    versionAuthor?.id !== loggedInUser.value?.id
  ) {
    return alert("테스트 참여자 또는 버전 작성자만 가능합니다.");
  }
  return reactionApi.POST_reaction(E_ReactionParentType.testUnit, btnType, testUnitId).then(() => {
    fetchUnitList(props.swVersion?.swVersionId as string);
  });
};
const renderColorIcon = (status: E_TestStatus) => {
  switch (status) {
    case E_TestStatus.failed:
      return "error";
    case E_TestStatus.passed:
      return "teal";
    default:
      return "warning";
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
  <v-expansion-panel v-if="itemType === 'panel'">
    <v-expansion-panel-title>
      <div class="title-header">
        <h3>
          {{ props.swVersion?.versionTitle }}
        </h3>
        <div class="title-header--left">
          <p v-if="!!props.swVersion?.createdAt" class="date">
            {{ formatDateTime(props.swVersion?.createdAt) }}
          </p>
          <p class="author">
            {{ props.swVersion?.user.username }}
          </p>
        </div>
      </div>
      <template v-slot:actions="{ expanded }">
        <v-icon :icon="!!expanded ? 'mdi-minus' : 'mdi-plus'"></v-icon>
        <v-icon
          :color="renderColorIcon(testSessionsPassStatus)"
          :icon="renderIconForVersionStatus(testSessionsPassStatus)"
        ></v-icon>
      </template>
    </v-expansion-panel-title>

    <v-expansion-panel-text>
      <div class="desc-wrap">
        <div class="edit-btn-con">
          <div>
            <v-btn class="edit-btn" variant="outlined" @click="openCalender = true">
              <template v-if="!selectedDate">
                <v-icon class="mdi mdi-calendar-check" start></v-icon>
                마감일
              </template>
              <template v-else> Due: {{ formatDate(selectedDate) }} </template>
            </v-btn>
            <div class="date-picker" v-if="!!openCalender">
              <v-btn class="close-btn" icon="mdi-close" @click="openCalender = false" variant="plain"></v-btn>
              <v-date-picker v-model="selectedDate" show-adjacent-months> </v-date-picker>
              <v-btn variant="plain" @click="onSubmitDueDate">ok</v-btn>
            </div>
          </div>

          <v-btn class="edit-btn" variant="outlined" @click="onClickEditVersion">
            <v-icon class="mdi mdi-application-edit" start></v-icon>
            수정
          </v-btn>
        </div>
        <div class="desc-inner-html" v-html="props.swVersion?.versionDesc" />
      </div>
      <a v-if="props.swVersion?.fileSrc" :href="props.swVersion?.fileSrc">첨부 파일</a>

      <section v-if="unitList.length > 0">
        <h5>유닛 테스트 목록</h5>
        <ul class="test-unit-list">
          <li v-for="testUnit in unitList" :key="testUnit.testUnitId">
            <ul v-if="testUnit.reactions" class="reactions-con">
              <li v-for="reactionKey in Object.keys(testUnit.counts as object)">
                <v-chip
                  link
                  v-if="testUnit?.counts && !!testUnit?.counts"
                  @click="onClickReactionBtn(reactionKey as E_ReactionType, testUnit.testUnitId as string)"
                >
                  <v-icon
                    :icon="renderIconForReaction(reactionKey as E_ReactionType).icon"
                    :color="renderIconForReaction(reactionKey as E_ReactionType).color"
                  ></v-icon>
                  {{ testUnit.counts[reactionKey as E_ReactionType] }}

                  <v-tooltip activator="parent" location="end" max-width="300">
                    <p v-for="person in testUnit.reactions.filter((reaction) => reaction.reactionType === reactionKey)">
                      {{ person.user.username }}
                    </p>
                  </v-tooltip>
                </v-chip>
              </li>
            </ul>
            <v-speed-dial location="right center" transition="fade-transition" open-on-hover>
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn variant="text" v-bind="activatorProps">
                  {{ testUnit.unitDesc }}
                </v-btn>
              </template>
              <v-btn
                v-for="btn in REACT_BTN_LIST"
                :key="btn.icon"
                icon
                size="x-small"
                @click="onClickReactionBtn(btn.type, testUnit.testUnitId as string)"
              >
                <v-icon :icon="btn.icon" :color="btn.color"></v-icon>
              </v-btn>
            </v-speed-dial>
          </li>
        </ul>
      </section>

      <div class="version-ctrl-con">
        <v-divider :thickness="2"></v-divider>
        <TestListChips :swVersion="props.swVersion" @onClickLoggedInUserStatus="onClickLoggedInUserStatus" />

        <div class="modify-tester-btn-con">
          <v-btn
            v-if="loggedInUser?.role !== E_Role.tester"
            @click="onClickAddTester"
            class="text-none text-subtitle-1"
            variant="outlined"
          >
            <v-icon icon="mdi-account-multiple-plus" start></v-icon>
            테스터 관리
          </v-btn>
          <v-btn @click="onClickDetailView" class="text-none text-subtitle-1" variant="outlined">
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
      <TestListChips :swVersion="props.swVersion" @onClickLoggedInUserStatus="onClickLoggedInUserStatus" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.test-unit-list {
  display: flex;
  flex-direction: column;
  padding: 8px 24px 16px;
  > li {
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

.v-expansion-panel-title {
  background-color: #ececec;
  .title-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    margin: 20px 0;
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

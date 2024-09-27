<script setup lang="ts">
import { reactionApi } from "@/services/domain/reactionService";
import { testUnitApi } from "@/services/domain/swService";
import { useUserStore } from "@/store/userStore";
import { E_ReactionParentType, E_ReactionType } from "@/types/enum.d";
import { IReaction, ITestUnit } from "@/types/types";
import { countReactions, renderIconForReaction } from "@/utils/common/formatter";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { ref } from "vue";

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

const props = defineProps({
  swVersion: {
    type: Object as () => any,
    required: true,
  },
});
const unitList = ref<ITestUnit[]>([]);

const store = useUserStore();
const { loggedInUser } = storeToRefs(store);

onMounted(() => {
  fetchUnitList(props.swVersion?.swVersionId as string);
});

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

const onClickReactionBtn = (btnType: E_ReactionType, testUnitId: string) => {
  const testers = props.swVersion?.testSessions;
  const versionAuthor = props.swVersion?.user;

  if (
    !testers?.some((tester: IReaction) => tester.user.id === loggedInUser.value?.id) &&
    versionAuthor?.id !== loggedInUser.value?.id
  ) {
    return alert("테스트 참여자 또는 버전 작성자만 가능합니다.");
  }
  return reactionApi.POST_reaction(E_ReactionParentType.testUnit, btnType, testUnitId).then(() => {
    fetchUnitList(props.swVersion?.swVersionId as string);
  });
};
</script>

<template>
  <section v-if="unitList.length > 0">
    <h5>유닛 테스트 목록</h5>
    <ul class="test-unit-list">
      <li v-for="testUnit in unitList" :key="testUnit.testUnitId">
        <ul v-if="testUnit.reactions" class="reactions-con">
          <li v-for="reactionKey in Object.keys(testUnit.counts as object)">
            <v-chip
              link
              v-if="testUnit?.counts && !!testUnit?.counts"
              @click.stop="onClickReactionBtn(reactionKey as E_ReactionType, testUnit.testUnitId as string)"
            >
              <v-icon
                :icon="renderIconForReaction(reactionKey as E_ReactionType).icon"
                :color="renderIconForReaction(reactionKey as E_ReactionType).color"
              ></v-icon>
              {{ testUnit.counts[reactionKey as E_ReactionType] }}

              <v-tooltip activator="parent" location="end" max-width="300">
                <p
                  v-for="person in testUnit.reactions.filter(
                    (reaction: IReaction) => reaction.reactionType === reactionKey,
                  )"
                >
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
            @click.stop="onClickReactionBtn(btn.type, testUnit.testUnitId as string)"
          >
            <v-icon :icon="btn.icon" :color="btn.color"></v-icon>
          </v-btn>
        </v-speed-dial>
      </li>
    </ul>
  </section>
</template>

<style scoped></style>

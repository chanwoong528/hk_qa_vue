<script setup lang="ts">
//get router.params.id and fetch data
import CommentList from "@/components/list/CommentList.vue";
import BoardClass from "@/entity/Board";
import DefaultLayout from "@/layout/DefaultLayout.vue";
import { boardApi } from "@/services/domain/boardService";
import { commentApi } from "@/services/domain/commentService";
import { sseApi } from "@/services/domain/sseService";
import { IComment } from "@/types/types";
import { countReactions } from "@/utils/common/formatter";

import { ref, onMounted, reactive, computed, watch, onUnmounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const id = ref(route.params.id);

const boardInfo = reactive(new BoardClass());

const commetListForBoard = ref<IComment[]>([]);
const commentPage = ref<number>(1);
const commnetLastPage = ref<number>(1);
const sseTrigger = reactive({ type: "", date: "" });

const eventSse = sseApi();

const computedIsLastPage = computed(() => {
  if (commnetLastPage.value === 0) {
    return true;
  }

  return commentPage.value === commnetLastPage.value;
});

onMounted(() => {
  Promise.all([onFetchBoardDetail(id.value as string), onFetchCommentListByBoardId(id.value as string)]);
  eventSse.onMsg(id.value as string, sseTrigger);
});

onUnmounted(() => {
  eventSse.close();
});
watch(
  () => commentPage.value,
  (newPage) => {
    onFetchCommentListByBoardId(id.value as string, newPage as number);
  },
);

watch(
  () => sseTrigger.date,
  (newDate) => {
    onFetchCommentListByBoardId(id.value as string);
  },
);

const onFetchBoardDetail = (id: string) => {
  boardApi.GET_boardDetail(id).then((res) => {
    Object.assign(boardInfo, res);
  });
};
const onFetchCommentListByBoardId = (id: string, page?: number) => {
  commentApi.GET_commentsByBoardId(id, page).then((res) => {
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
      return (commetListForBoard.value = [
        ...commetListForBoard.value,
        ...(commentListWithReactionCount as IComment[]),
      ]);
    }
    commetListForBoard.value = commentListWithReactionCount as IComment[];
  });
};

const onClickBack = () => history.back();

const onClickLoadNextPage = () => {
  commentPage.value++;
};

const onSubmitComment = (params: any) => {
  if (!id.value) return alert("게시글이 없습니다.");

  params.boardId = id.value;
  return commentApi.POST_comment(params).then((res) => {
    onFetchCommentListByBoardId(id.value as string);
  });
};
</script>

<template>
  <DefaultLayout>
    <v-btn variant="tonal" icon="mdi mdi-keyboard-backspace" @click="onClickBack"> </v-btn>

    <v-card class="pa-10 mb-10">
      <section>
        <header>
          <h3>
            {{ boardInfo.title }}
          </h3>
          <div class="left-con">
            <p>
              {{ boardInfo.convertBoardTypeKor() }}
            </p>
            <p>
              {{ boardInfo.formatDate() }}
            </p>
            <p>
              {{ boardInfo.user.username }}
            </p>
          </div>
        </header>

        <div v-html="boardInfo.content" class="board-content"></div>
      </section>
    </v-card>
    <CommentList
      hideAdmin
      v-model="commetListForBoard"
      :computedLastPage="computedIsLastPage"
      @onClickLoadNextPage="onClickLoadNextPage"
      @onSubmitComment="onSubmitComment"
    />
  </DefaultLayout>
</template>

<style scoped lang="scss">
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  h3 {
    font-size: 24px;
    font-weight: 700;
  }

  .left-con {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  p {
    font-size: 14px;
    margin-right: 10px;
  }
}
.board-content {
  padding-top: 20px;
  min-height: 500px;
}
</style>

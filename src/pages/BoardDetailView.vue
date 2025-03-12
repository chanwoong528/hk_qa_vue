<script setup lang="ts">
//get router.params.id and fetch data
import RichEditor from "@/components/RichEditor.vue";
import CommentList from "@/components/list/CommentList.vue";
import BoardClass from "@/entity/Board";
import DefaultLayout from "@/layout/DefaultLayout.vue";
import { boardApi } from "@/services/domain/boardService";
import { commentApi } from "@/services/domain/commentService";
import { sseApi } from "@/services/domain/sseService";
import { useUserStore } from "@/store/userStore";
import { IComment } from "@/types/types";
import { countReactions } from "@/utils/common/formatter";
import { storeToRefs } from "pinia";

import { ref, onMounted, reactive, computed, watch, onUnmounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const id = ref(route.params.id);

const userStore = useUserStore();
const { loggedInUser } = storeToRefs(userStore);

const editMode = ref<boolean>(false);
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
  Promise.all([
    onFetchBoardDetail(id.value as string),
    onFetchCommentListByBoardId(id.value as string),
  ]);
  eventSse.onMsg(id.value as string, sseTrigger);
});

onUnmounted(() => {
  eventSse.close();
});
watch(
  () => commentPage.value,
  newPage => {
    onFetchCommentListByBoardId(id.value as string, newPage as number);
  }
);

watch(
  () => sseTrigger.date,
  newDate => {
    onFetchCommentListByBoardId(id.value as string);
  }
);

const onFetchBoardDetail = (id: string) => {
  boardApi.GET_boardDetail(id).then(res => {
    Object.assign(boardInfo, res);
  });
};
const onFetchCommentListByBoardId = (id: string, page?: number) => {
  commentApi.GET_commentsByBoardId(id, page).then(res => {
    const { commentList, page, lastPage } = res as unknown as {
      commentList: IComment[];
      page: number;
      total: number;
      lastPage: number;
    };
    commnetLastPage.value = lastPage;

    const commentListWithReactionCount = commentList.map(comment => {
      return {
        ...comment,
        counts: countReactions(comment.reactions),
        childComments: comment.childComments.map(child => {
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

const onSubmitEditComment = (commentId: string, content: string) => {
  return commentApi.PATCH_comment({ commentId, content }).then(res => {
    return onFetchCommentListByBoardId(id.value as string);
  });
};
const onClickDeleteComment = (commentId: string) => {
  return commentApi.DELETE_comment(commentId).then(res => {
    return onFetchCommentListByBoardId(id.value as string);
  });
};

const onClickEditBoard = () => {
  editMode.value = !editMode.value;
};

const onSubmitEditBoard = () => {
  return boardApi
    .PATCH_board({
      boardId: id.value,
      title: boardInfo.title,
      content: boardInfo.content,
      userId: loggedInUser.value?.id,
    })
    .then(res => {
      editMode.value = false;
      return onFetchBoardDetail(id.value as string);
    });
};

const onSubmitComment = (params: any) => {
  if (!id.value) return alert("게시글이 없습니다.");

  params.boardId = id.value;
  return commentApi.POST_comment(params).then(res => {
    onFetchCommentListByBoardId(id.value as string);
  });
};
</script>

<template>
  <DefaultLayout>
    <div class="board-detail-btn-con">
      <v-btn
        variant="tonal"
        icon="mdi mdi-keyboard-backspace"
        @click="onClickBack"
      >
      </v-btn>

      <div v-if="loggedInUser?.id === boardInfo.user.id" class="board-ctl-con">
        <v-btn
          v-if="!editMode"
          variant="outlined"
          color="primary"
          @click="onClickEditBoard"
        >
          <v-icon icon="mdi-pencil" prepend></v-icon>
          수정
        </v-btn>

        <v-btn
          v-if="!!editMode"
          variant="outlined"
          color="success"
          @click="onSubmitEditBoard"
        >
          <v-icon icon="mdi-content-save-outline" prepend></v-icon>
          저장
        </v-btn>
        <v-btn
          v-if="!!editMode"
          variant="outlined"
          color="error"
          @click="onClickEditBoard"
        >
          <v-icon icon="mdi-cancel" prepend></v-icon>
          취소
        </v-btn>
      </div>
    </div>

    <v-card class="pa-10 mb-10">
      <section>
        <header>
          <h3 v-if="!editMode">
            {{ boardInfo.title }}
          </h3>
          <v-text-field
            v-else
            v-model="boardInfo.title"
            label="제목"
            outlined
          ></v-text-field>
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

        <div
          v-if="!editMode"
          v-html="boardInfo.content"
          class="board-content"
        ></div>
        <RichEditor v-else class="board-content" v-model="boardInfo.content" />
      </section>
    </v-card>
    <CommentList
      hideAdmin
      v-model="commetListForBoard"
      :computedLastPage="computedIsLastPage"
      @onClickLoadNextPage="onClickLoadNextPage"
      @onSubmitComment="onSubmitComment"
      @onSubmitEditComment="onSubmitEditComment"
      @onClickDeleteComment="onClickDeleteComment"
    />
  </DefaultLayout>
</template>

<style scoped lang="scss">
.board-detail-btn-con {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  gap: 40px;

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

.board-ctl-con {
  display: flex;
  gap: 10px;
}
</style>

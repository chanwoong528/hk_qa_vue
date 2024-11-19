<script setup lang="ts">
import { E_EditorType, E_ReactionParentType, E_ReactionType, E_Role } from "@/types/enum.d";
import type { IComment } from "@/types/types";
import { ref } from "vue";

import CommentReactionList from "./CommentReactionList.vue";

import { formatDateTime } from "@/utils/common/formatter";
import { reactionApi } from "@/services/domain/reactionService";
import { renderIconForReaction } from "@/utils/common/formatter";
import { useUserStore } from "@/store/userStore";
import { storeToRefs } from "pinia";
import RichEditor from "../RichEditor.vue";

const openChildComments = defineModel<boolean>();

const props = defineProps({
  comment: {
    type: Object as () => IComment,
  },
  hideAdmin: Boolean,

  child: Boolean,
});

const mouseOver = ref<boolean>(false);

const isEditorFocused = ref<boolean>(false);

const openEditorForReply = ref<boolean>(false);
const openEditorForEdit = ref<boolean>(false);

console.log(props.comment);

// const commentStatus = ref<string>("") // 수정 | 답글작성 | 답글보기 ;

const curCommentId = ref<string>("");
const reCommentVal = ref<string>("");

const userStore = useUserStore();
const { loggedInUser } = storeToRefs(userStore);

const emit = defineEmits([
  "onSubmitComment",
  "onFetchCommentsBySwVersionId",
  "onSubmitEditComment",
  "onClickDeleteComment",
  "toggleChildComments",
]);

const onBlurEditorCon = (isFocusOut: boolean) => {
  if (!!isFocusOut && isEditorFocused.value) {
    isEditorFocused.value = false;
  }
};
const onFocusEditorCon = (clickedCon: boolean) => {
  isEditorFocused.value = clickedCon;
};
const onSubmitReComment = () => {
  if (!!curCommentId.value) {
    emit("onSubmitComment", curCommentId.value, reCommentVal.value);
  }
  reCommentVal.value = "";
  openEditorForReply.value = false;
  return;
};
const onClickReply = () => {
  if (!!props.comment?.commentId) {
    curCommentId.value = props.comment.commentId;
    reCommentVal.value = "";
    openEditorForReply.value = !openEditorForReply.value;
  }
};
const onClickEdit = () => {
  if (!!props.comment?.commentId) {
    curCommentId.value = props.comment.commentId;
    reCommentVal.value = props.comment.content;
    openEditorForEdit.value = !openEditorForEdit.value;
  }
};
const onClickDeleteComment = () => {
  if (!!props.comment?.commentId) {
    return emit("onClickDeleteComment", props.comment.commentId);
  }
};

const onSubmitEditComment = () => {
  openEditorForEdit.value = false;
  if (!!curCommentId.value) {
    emit("onSubmitEditComment", curCommentId.value, reCommentVal.value);
  }
};

const onFetchCommentsBySwVersionId = () => {
  emit("onFetchCommentsBySwVersionId");
};

const onClickReactionBtn = (btnType: E_ReactionType, parentId?: string) => {
  if (!props.comment?.commentId) return;

  reactionApi
    .POST_reaction(E_ReactionParentType.comment, btnType, parentId ? parentId : props.comment.commentId)
    .then(res => {
      mouseOver.value = false;
      return onFetchCommentsBySwVersionId();
    });
};

const renderCommentUserName = () => {
  if (!!props.hideAdmin && loggedInUser?.value?.role === E_Role.tester && props.comment?.user.role !== E_Role.tester)
    return "admin";

  return props.comment?.user.username;
};
</script>

<template>
  <v-list-item class="pr-0 pb-0 comment-item" @mouseleave="mouseOver = false">
    <CommentReactionList :isActivated="mouseOver" @onClickReactionBtn="onClickReactionBtn" />

    <v-card class="mx-auto comment-card" :variant="child ? 'tonal' : 'outlined'">
      <template v-slot:title>
        <p class="comment-title" @mouseover="mouseOver = true">
          {{ renderCommentUserName() }}

          <!-- {{ !!hideAdmin && loggedInUser?.role === E_Role.tester ? "admin" : props.comment?.user.username }} -->
          <span class="date" v-if="props.comment?.createdAt">{{ formatDateTime(props.comment?.createdAt) }}</span>
        </p>
      </template>
      <v-card-text v-if="!openEditorForEdit" v-html="props.comment?.content"></v-card-text>
      <!--  :editorType="E_EditorType.comment" -->
      <RichEditor v-else v-model="reCommentVal" :isEditorFocused="isEditorFocused" @onBlurEditorCon="onBlurEditorCon" />

      <ul v-if="props.comment?.reactions && !openEditorForEdit" class="reactions-con">
        <li v-for="reactionKey in Object.keys(props.comment.counts as object)">
          <v-chip
            link
            v-if="props.comment?.counts && !!props.comment?.counts"
            @click="onClickReactionBtn(reactionKey as E_ReactionType, props.comment.commentId as string)"
          >
            <v-icon
              :icon="renderIconForReaction(reactionKey as E_ReactionType).icon"
              :color="renderIconForReaction(reactionKey as E_ReactionType).color"
            >
            </v-icon>
            {{ props.comment.counts[reactionKey as E_ReactionType] }}

            <v-tooltip activator="parent" location="end" max-width="300">
              <p v-for="person in props.comment.reactions.filter(reaction => reaction.reactionType === reactionKey)">
                {{ person.user.username }}
              </p>
            </v-tooltip>
          </v-chip>
        </li>
        <li v-if="!props.child" class="comment-btn-bottom">
          <div class="comment-btn-con">
            <v-btn
              v-if="!!props.comment?.childComments && props.comment?.childComments.length > 0"
              @click="() => emit('toggleChildComments', comment?.commentId)"
              variant="plain"
            >
              <v-icon :icon="openChildComments ? 'mdi-menu-up-outline' : 'mdi-menu-down-outline'" prepend></v-icon>
              답글 {{ comment?.childComments.length }}개
            </v-btn>

            <div class="comment-btn-control" v-if="loggedInUser?.id === props.comment?.user.id">
              <v-btn class="reply-btn" v-if="!openEditorForEdit" variant="plain" color="primary" @click="onClickEdit">
                <v-icon icon="mdi-pencil" prepend></v-icon>
                수정
              </v-btn>
              <v-btn
                class="reply-btn"
                v-if="openEditorForEdit"
                variant="plain"
                color="success"
                @click="onSubmitEditComment"
              >
                <v-icon icon="mdi-content-save-outline" prepend></v-icon>
                저장
              </v-btn>

              <v-btn
                class="reply-btn"
                v-if="!openEditorForEdit"
                variant="plain"
                color="error"
                @click="onClickDeleteComment"
              >
                <v-icon icon="mdi-delete" prepend></v-icon>
                삭제
              </v-btn>
              <v-btn class="reply-btn" v-if="openEditorForEdit" variant="tonal" color="error" @click="onClickEdit">
                <v-icon icon="mdi-cancel" prepend></v-icon>
                취소
              </v-btn>
            </div>
          </div>

          <v-chip @click="onClickReply" variant="tonal">
            <v-icon icon="mdi-arrow-right-bottom"></v-icon>
            답글
          </v-chip>
        </li>
      </ul>
    </v-card>

    <div v-if="openEditorForReply" class="child-comment-con" @click="onFocusEditorCon(true)">
      <RichEditor
        :editorType="E_EditorType.comment"
        v-model="reCommentVal"
        :isEditorFocused="isEditorFocused"
        @onBlurEditorCon="onBlurEditorCon"
      />
      <div class="reply-btn-con">
        <v-btn @click="openEditorForReply = false" variant="outlined" color="warning">취소</v-btn>
        <v-btn @click="onSubmitReComment">답글</v-btn>
      </div>
    </div>
  </v-list-item>
</template>

<style scoped lang="scss">
.comment-btn-bottom {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.comment-btn-con {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;

  .comment-btn-control {
    margin-left: auto;
  }

  .reply-btn {
    margin-left: auto;
  }
}

.comment-item {
  position: relative;
  padding-left: 0 !important;
  padding-top: 0;

  .comment-card {
    padding-bottom: 10px;
  }

  .reactions-con {
    display: flex;
    width: 100%;
    list-style: none;
    gap: 4px;
    bottom: 6px;
    padding: 0px 10px;
  }
}

.child-comment-con {
  display: flex;
  flex-direction: column;
  justify-content: end;
  border: 1px solid #ccc;
  margin: 20px 14px;

  .reply-btn-con {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
  }
}

// .reaction-btn-con {
// }

.comment-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;

  .date {
    font-size: 13px;
    color: grey;
    margin-left: 10px;
    font-weight: 400;
  }
}
.v-btn--variant-plain {
  padding: 0;
  height: auto;
}
</style>

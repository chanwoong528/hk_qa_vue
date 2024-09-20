<script setup lang="ts">
import type { IComment } from "@/types/types";
import { E_EditorType, E_ReactionParentType, E_ReactionType } from "@/types/enum.d";
import { ref, defineProps } from "vue";

import { formatDateTime } from "@/utils/common/formatter";
import CommentReactionList from "./CommentReactionList.vue";
import { reactionApi } from "@/services/domain/reactionService";
import { renderIconForReaction } from "@/utils/common/formatter";
const props = defineProps({
  comment: {
    type: Object as () => IComment,
  },

  child: Boolean,
});

const mouseOver = ref<boolean>(false);

const isEditorFocused = ref<boolean>(false);
const openChildComments = ref<boolean>(false);
const openEditorForReply = ref<boolean>(false);
const curCommentId = ref<string>("");
const reCommentVal = ref<string>("");

const emit = defineEmits(["onSubmitComment", "onFetchCommentsBySwVersionId"]);
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
  return;
};
const onClickReply = () => {
  if (!!props.comment?.commentId) {
    curCommentId.value = props.comment.commentId;
    openEditorForReply.value = !openEditorForReply.value;
  }
};

const onFetchCommentsBySwVersionId = () => {
  emit("onFetchCommentsBySwVersionId");
};

const onClickReactionBtn = (btnType: E_ReactionType, parentId?: string) => {
  if (!props.comment?.commentId) return;

  reactionApi
    .POST_reaction(E_ReactionParentType.comment, btnType, parentId ? parentId : props.comment.commentId)
    .then((res) => {
      mouseOver.value = false;
      return onFetchCommentsBySwVersionId();
    });
};
</script>

<template>
  <v-list-item class="pr-0 pb-0 comment-item" @mouseleave="mouseOver = false">
    <CommentReactionList :isActivated="mouseOver" @onClickReactionBtn="onClickReactionBtn" />

    <v-card class="mx-auto comment-card" :variant="child ? 'tonal' : 'outlined'">
      <template v-slot:title>
        <p class="comment-title" @mouseover="mouseOver = true">
          {{ props.comment?.user.username }}
          <span class="date" v-if="props.comment?.createdAt">{{ formatDateTime(props.comment?.createdAt) }}</span>
        </p>
      </template>
      <v-card-text v-html="props.comment?.content"></v-card-text>
      <ul v-if="props.comment?.reactions" class="reactions-con">
        <li v-for="reactionKey in Object.keys(props.comment.counts as object)">
          <v-chip
            link
            v-if="props.comment?.counts && !!props.comment?.counts"
            @click="onClickReactionBtn(reactionKey as E_ReactionType, props.comment.commentId as string)"
          >
            <v-icon
              :icon="renderIconForReaction(reactionKey as E_ReactionType).icon"
              :color="renderIconForReaction(reactionKey as E_ReactionType).color"
            ></v-icon>
            {{ props.comment.counts[reactionKey as E_ReactionType] }}

            <v-tooltip activator="parent" location="end" max-width="300">
              <p v-for="person in props.comment.reactions.filter((reaction) => reaction.reactionType === reactionKey)">
                {{ person.user.username }}
              </p>
            </v-tooltip>
          </v-chip>
        </li>
      </ul>
    </v-card>

    <div class="comment-btn-con">
      <v-btn
        v-if="!!props.comment?.childComments && props.comment?.childComments.length > 0"
        @click="openChildComments = !openChildComments"
        variant="plain"
      >
        답글 {{ comment?.childComments.length }}개
      </v-btn>
      <v-btn
        class="reply-btn"
        v-if="!child && !openEditorForReply"
        variant="plain"
        color="primary"
        @click="onClickReply"
      >
        답글
      </v-btn>
    </div>

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
    <v-list line="one" v-if="openChildComments">
      <CommentItem
        v-for="childComment in comment?.childComments"
        :key="childComment.commentId"
        :comment="childComment"
        @onFetchCommentsBySwVersionId="onFetchCommentsBySwVersionId"
        child
      />
    </v-list>
  </v-list-item>
</template>

<style scoped lang="scss">
.comment-btn-con {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  .reply-btn {
    margin-left: auto;
  }
}

.comment-item {
  position: relative;
  .comment-card {
    padding-bottom: 30px;
  }
  .reactions-con {
    display: flex;
    position: absolute;
    list-style: none;
    gap: 4px;
    left: 10px;
    bottom: 10px;
  }
}
.child-comment-con {
  display: flex;
  flex-direction: column;
  justify-content: end;
  padding: 10px 2px 10px 16px;
  .reply-btn-con {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
  }
}
.reaction-btn-con {
}

.comment-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  font-weight: bold;
  .date {
    font-size: 12px;
    color: grey;
    margin-left: 10px;
  }
}
</style>

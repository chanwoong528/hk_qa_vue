<script setup lang="ts">
import type { IComment } from "@/types/types";
import { E_EditorType } from "@/types/enum.d";
import { ref, defineProps } from "vue";

import { formatDateTime } from "@/utils/common/formatter";
const props = defineProps({
  comment: {
    type: Object as () => IComment,
  },
  child: Boolean,
});

const isEditorFocused = ref<boolean>(false);
const openChildComments = ref<boolean>(false);
const openEditorForReply = ref<boolean>(false);
const curCommentId = ref<string>("");
const reCommentVal = ref<string>("");

const emit = defineEmits(["onSubmitComment"]);
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
</script>

<template>
  <v-list-item class="pr-0">
    <v-card class="mx-auto" :variant="child ? 'tonal' : 'outlined'">
      <template v-slot:title>
        <p class="comment-title">
          {{ props.comment?.user.username }}
          <span class="date" v-if="props.comment?.createdAt">{{
            formatDateTime(props.comment?.createdAt)
          }}</span>
        </p>
      </template>
      <v-card-text v-html="props.comment?.content"></v-card-text>
    </v-card>
    <div class="comment-btn-con">
      <v-btn
        v-if="
          !!props.comment?.childComments &&
          props.comment?.childComments.length > 0
        "
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

    <div
      v-if="openEditorForReply"
      class="child-comment-con"
      @click="onFocusEditorCon(true)"
    >
      <RichEditor
        :editorType="E_EditorType.comment"
        v-model="reCommentVal"
        :isEditorFocused="isEditorFocused"
        @onBlurEditorCon="onBlurEditorCon"
      />
      <div class="reply-btn-con">
        <v-btn
          @click="openEditorForReply = false"
          variant="outlined"
          color="warning"
          >취소</v-btn
        >
        <v-btn @click="onSubmitReComment">답글</v-btn>
      </div>
    </div>
    <v-list line="one" v-if="openChildComments">
      <CommentItem
        v-for="childComment in comment?.childComments"
        :comment="childComment"
        :key="childComment.commentId"
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

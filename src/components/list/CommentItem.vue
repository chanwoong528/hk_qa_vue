<script setup lang="ts">
import type { IComment } from "@/types/types";
import { E_EditorType } from "@/types/enum.d";
import { ref, defineProps } from "vue";

const props = defineProps({
  comment: {
    type: Object as () => IComment,
  },
  child: Boolean,
});

const openChildComments = ref<boolean>(false);
const openEditorForReply = ref<boolean>(false);
const curCommentId = ref<string>("");
const reCommentVal = ref<string>("");

const emit = defineEmits(["onSubmitComment"]);
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
          <span class="date">{{ props.comment?.createdAt }}</span>
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
        {{ comment?.childComments.length }} comments
      </v-btn>
      <v-btn
        class="reply-btn"
        v-if="!child && !openEditorForReply"
        variant="plain"
        color="primary"
        @click="onClickReply"
      >
        reply
      </v-btn>
    </div>

    <div class="child-comment-con" v-if="openEditorForReply">
      <RichEditor :editorType="E_EditorType.comment" v-model="reCommentVal" />
      <v-btn @click="onSubmitReComment">reply</v-btn>
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
  button {
    margin-left: auto;
    margin-top: auto;
    min-width: auto;
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

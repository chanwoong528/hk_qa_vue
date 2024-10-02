<script setup lang="ts">
import { computed, ref } from "vue";
import { E_EditorType } from "@/types/enum.d";
import RichEditor from "../RichEditor.vue";
import type { IComment } from "@/types/types";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store/userStore";

import CommentItem from "./CommentItem.vue";
import { checkEditorValueEmpty } from "@/utils/common/validator";


const commentListModel = defineModel<IComment[]>();


const props = defineProps({
  page: {
    type: Number,
    required: false,
  },
  computedLastPage: {
    type: Boolean,
    required: false,
  },
  hideAdmin: {
    type: Boolean,
    required: false,
  },
});
const emit = defineEmits(["onFetchCommentsBySwVersionId", "onClickLoadNextPage", "onSubmitComment", "onSubmitEditComment", "onClickDeleteComment"]);

const userStore = useUserStore();
const { loggedInUser } = storeToRefs(userStore);

const commentVal = ref<string>("");

const isCommentEmpty = computed(() => {
  return checkEditorValueEmpty(commentVal.value);
});


const isEditorFocused = ref<boolean>(false);
const openChildComments = ref<string[]>([]);



const onFocusEditorCon = (clickedCon: boolean) => {
  isEditorFocused.value = clickedCon;
};
const onBlurEditorCon = (isFocusOut: boolean) => {
  if (!!isFocusOut && isEditorFocused.value) {
    isEditorFocused.value = false;
  }
};

const onClickLoadNextPage = () => {
  emit("onClickLoadNextPage");
};
const onFetchCommentsBySwVersionId = () => {
  emit("onFetchCommentsBySwVersionId");
};

const onSubmitComment = (parentId?: string, reCommentVal?: string) => {
  if ((isCommentEmpty.value && !reCommentVal) || !loggedInUser.value?.id) return alert("Please write a comment");

  let params = {
    content: !!reCommentVal ? reCommentVal : commentVal.value,
    userId: loggedInUser.value?.id,
    ...(typeof parentId === "string" && { parentId: parentId }),
  };
  emit("onSubmitComment", params);
  commentVal.value = "";
};

const onSubmitEditComment = (commentId: string, content: string) => {
  if (checkEditorValueEmpty(content)) return alert("Please write a comment");
  emit("onSubmitEditComment", commentId, content);
};


const onClickDeleteComment = (commentId: string) => {
  emit("onClickDeleteComment", commentId);
};

const toggleChildComments = (commentId: string) => {
  if (openChildComments.value.includes(commentId)) {
    openChildComments.value = openChildComments.value.filter((id) => id !== commentId);
  } else {
    openChildComments.value = [...openChildComments.value, commentId];
  }
};



</script>
<template>
  <div class="editor-con" @click="onFocusEditorCon(true)">
    <RichEditor :editorType="E_EditorType.comment" v-model="commentVal" :isEditorFocused="isEditorFocused"
      @onBlurEditorCon="onBlurEditorCon" />
    <div class="comment-btn-con">
      <v-btn @click="onSubmitComment">댓글</v-btn>
    </div>
  </div>

  <div class="comment-list-con">
    <v-list lines="three" class="p-20">

      <template v-for="comment in commentListModel" :key="comment.commentId" :comment="comment">

        <CommentItem :comment="comment" :hideAdmin="props.hideAdmin" @onSubmitComment="onSubmitComment"
          @onSubmitEditComment="onSubmitEditComment" @onClickDeleteComment="onClickDeleteComment"
          @onFetchCommentsBySwVersionId="onFetchCommentsBySwVersionId" @toggleChildComments="toggleChildComments" />

        <v-list line="one" v-if="openChildComments.includes(comment.commentId)">
          <CommentItem v-for="childComment in comment.childComments" :key="childComment.commentId" :comment="childComment"
            :hideAdmin="props.hideAdmin" @onSubmitComment="onSubmitComment" @onSubmitEditComment="onSubmitEditComment"
            @onClickDeleteComment="onClickDeleteComment" @onFetchCommentsBySwVersionId="onFetchCommentsBySwVersionId"
            child />
        </v-list>
      </template>


    </v-list>
    <v-btn v-if="!props.computedLastPage" @click="onClickLoadNextPage">Load More</v-btn>
  </div>
</template>

<style scoped>
.editor-con {
  padding: 10px 0;
  display: flex;
  flex-direction: column;
}

.comment-btn-con {
  margin-left: auto;
  margin-top: auto;
  min-width: auto;
}
</style>

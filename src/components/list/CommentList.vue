<script setup lang="ts">
import { computed, ref } from "vue";
import { E_EditorType } from "@/types/enum.d";
import RichEditor from "../RichEditor.vue";
import type { IComment, ISwVersion } from "@/types/types";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store/userStore";
import { commentApi } from "@/services/domain/commentService";

const commentListModel = defineModel<IComment[]>();

const props = defineProps({
  swVersion: {
    type: Object as () => ISwVersion,
  },
});
const emit = defineEmits(["onFetchCommentsBySwVersionId"]);

const userStore = useUserStore();
const { loggedInUser } = storeToRefs(userStore);

const commentVal = ref<string>("");

const isCommentEmpty = computed(() => {
  return checkEditorValueEmpty(commentVal.value);
});

const checkEditorValueEmpty = (content: string) => {
  let regex = /(<([^>]+)>)/gi;
  return content.replace(regex, "").length === 0;
};
const isEditorFocused = ref<boolean>(false);

const onFocusEditorCon = (clickedCon: boolean) => {
  isEditorFocused.value = clickedCon;
};
const onBlurEditorCon = (isFocusOut: boolean) => {
  if (!!isFocusOut && isEditorFocused.value) {
    isEditorFocused.value = false;
  }
};

const onFetchCommentsBySwVersionId = (swVersionId?: string) => {
  emit(
    "onFetchCommentsBySwVersionId",
    swVersionId ? swVersionId : props.swVersion?.swVersionId
  );
};

const onSubmitComment = (parentId?: string, reCommentVal?: string) => {
  if (
    (isCommentEmpty.value && !reCommentVal) ||
    !loggedInUser.value?.id ||
    !props.swVersion?.swVersionId
  )
    return alert("Please write a comment");

  let params = {
    swVersionId: props.swVersion?.swVersionId,
    content: !!reCommentVal ? reCommentVal : commentVal.value,
    userId: loggedInUser.value?.id,
    ...(typeof parentId === "string" && { parentId: parentId }),
  };
  return commentApi.POST_comment(params).then((res) => {
    commentVal.value = "";
    return onFetchCommentsBySwVersionId(params.swVersionId);
  });
};
</script>
<template>
  <div class="editor-con" @click="onFocusEditorCon(true)">
    <RichEditor
      :editorType="E_EditorType.comment"
      v-model="commentVal"
      :isEditorFocused="isEditorFocused"
      @onBlurEditorCon="onBlurEditorCon"
    />
    <div class="comment-btn-con">
      <v-btn @click="onSubmitComment">댓글</v-btn>
    </div>
  </div>
  <div class="comment-list-con">
    <v-list lines="three" class="p-20">
      <CommentItem
        v-for="comment in commentListModel"
        :key="comment.commentId"
        :comment="comment"
        @onSubmitComment="onSubmitComment"
        @onFetchCommentsBySwVersionId="onFetchCommentsBySwVersionId"
      />
    </v-list>
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

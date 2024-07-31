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

const onSubmitComment = (parentId?: string, reCommentVal?: string) => {
  console.log("Comment: ", isCommentEmpty.value);
  console.log(
    commentVal.value,
    isCommentEmpty.value,
    loggedInUser.value,
    props.swVersion?.swVersionId
  );
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
    return commentApi
      .GET_commentsBySwVersionId(params.swVersionId)
      .then((res) => {
        commentListModel.value = res;
        return (commentVal.value = "");
      });
  });
};
</script>
<template>
  <div class="editor-con">
    <RichEditor :editorType="E_EditorType.comment" v-model="commentVal" />
    <div class="comment-btn-con">
      <v-btn @click="onSubmitComment">Comment</v-btn>
    </div>
  </div>
  <div>
    <v-list lines="three" class="p-2">
      <CommentItem
        v-for="comment in commentListModel"
        :comment="comment"
        @onSubmitComment="onSubmitComment"
      />
    </v-list>
  </div>
</template>

<style scoped lang="scss">
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

<script setup lang="ts">
import { PropType, ref, watch } from "vue";
import { QuillEditor } from "@vueup/vue-quill";

import ImageCompress from "quill-image-compress";
import QuillResizeImage from "quill-resize-image";
import MagicUrl from "quill-magic-url";

import { E_EditorType } from "@/types/enum.d";

import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "@vueup/vue-quill/dist/vue-quill.bubble.css";

const modelValue = defineModel<string>();

const editorRef = ref(null);
const props = defineProps({
  editorType: {
    type: String as PropType<E_EditorType>,
    required: false,
  },
  isEditorFocused: {
    type: Boolean,
    required: false,
  },
  placeHolder: {
    type: String,
  },
});
watch(
  () => modelValue.value,
  (newVal) => {
    let regex = /(<([^>]+)>)/gi;
    let isValEmpty = newVal?.replace(regex, "").length === 0;
    if (isValEmpty && editorRef.value) {
      return (editorRef.value as any).setHTML("");
    }
  },
);
watch(
  () => props.isEditorFocused,
  (newVal) => {
    if (!!newVal && editorRef.value) {
      (editorRef.value as any).focus();
    }
  },
);
const emit = defineEmits(["onBlurEditorCon"]);

const onBlur = () => {
  emit("onBlurEditorCon", true);
};

const options = {
  theme: "",
  placeholder: !!props.placeHolder
    ? props.placeHolder
    : props.editorType === E_EditorType.comment
      ? "댓글 추가"
      : "버전 설명을 입력해주세요",
  readOnly: false,
};
const modules = [
  {
    name: "ImageCompress",
    module: ImageCompress,
    options: {
      quality: 0.9,
      imageType: "image/jpeg",
    },
  },

  {
    name: "QuillResizeImage",
    module: QuillResizeImage,
    options: {
      handleStyles: {
        backgroundColor: "black",
        border: "black",
        color: "black",
        // other camelCase styles for size display
      },
    },
  },
  {
    name: "MagicUrl",
    module: MagicUrl,
  },
];
</script>

<template>
  <div
    class="editor-wrap"
    :class="
      props.editorType === E_EditorType.comment
        ? !!props.isEditorFocused
          ? ' focused comment-editor'
          : ' comment-editor'
        : ''
    "
  >
    <QuillEditor
      ref="editorRef"
      theme="snow"
      contentType="html"
      v-model:content="modelValue"
      :toolbar="props.editorType === E_EditorType.comment ? 'essential' : 'full'"
      :modules="modules"
      :options="options"
      @blur="onBlur"
    >
    </QuillEditor>
  </div>
</template>

<style lang="scss">
.hide--toolbar {
  display: flex;
  flex-direction: column;
}
.editor-wrap {
  .ql-toolbar.ql-snow {
    border: none;
  }
  .ql-container.ql-snow {
    border: none;
    .ql-editor {
      height: 100%;
    }
  }
  &.comment-editor {
    border-bottom: 1px solid #999;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    &.focused {
      .ql-container.ql-snow {
        border-bottom: 2px solid black;
      }
    }
    // .ql-toolbar.ql-snow {
    // }
  }
}
</style>

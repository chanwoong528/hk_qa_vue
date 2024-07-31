<script setup lang="ts">
import { PropType, ref, watch } from "vue";
import { QuillEditor } from "@vueup/vue-quill";

import ImageCompress from "quill-image-compress";
import QuillResizeImage from "quill-resize-image";

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
});
watch(
  () => modelValue.value,
  (newVal) => {
    let regex = /(<([^>]+)>)/gi;
    let isValEmpty = newVal?.replace(regex, "").length === 0;
    if (isValEmpty && editorRef.value) {
      return (editorRef.value as any).setHTML("");
    }
  }
);

const options = {
  theme: "",
  placeholder: "Write something...",
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
];
</script>

<template>
  <QuillEditor
    ref="editorRef"
    theme="snow"
    contentType="html"
    v-model:content="modelValue"
    :toolbar="props.editorType === E_EditorType.comment ? 'essential' : 'full'"
    :modules="modules"
    :options="options"
  >
  </QuillEditor>

  <!-- @ready="(edit) => console.log('editor is ready', edit.editor)" -->
</template>

<style lang="scss">
.hide--toolbar {
  display: flex;
  flex-direction: column;
}
</style>

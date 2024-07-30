<script setup lang="ts">
import { QuillEditor } from "@vueup/vue-quill";
import ImageCompress from "quill-image-compress";
import QuillResizeImage from "quill-resize-image";

import "@vueup/vue-quill/dist/vue-quill.snow.css";

const modelValue = defineModel<string>();

const options = {
  theme: "snow",
  modules: {
    toolbar: true,
  },
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
    theme="snow"
    contentType="html"
    v-model:content="modelValue"
    :modules="modules"
    :options="options"
    @ready="(edit) => console.log('editor is ready', edit.editor)"
  />
</template>

<style scoped></style>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Quill from "quill"; // Full build
// import Quill from "quill/core"; // Core build
import { QuillyEditor } from "vue-quilly";
import "quill/dist/quill.core.css"; // Required
import "quill/dist/quill.snow.css"; // For snow theme (optional)
import "quill/dist/quill.bubble.css"; // For bubble theme (optional)

const editor = ref<InstanceType<typeof QuillyEditor>>();
// const model = ref<string>("<p>Hello Quilly!</p>");

const modelValue = defineModel<string>("<p>Hello Quilly!</p>");
// Quill instance

// const quill = ref<Quill | null>(null);
// Remove the declaration of the 'quill' variable
onMounted(() => {
  editor.value?.initialize(Quill)!;
});

const options = {
  theme: "snow", // If you need Quill theme
  modules: {
    toolbar: true,
  },
  placeholder: "Compose an epic...",
  readOnly: false,
};
</script>

<template>
  <QuillyEditor
    ref="editor"
    v-model="modelValue"
    :options="options"
    @update:modelValue="(value) => console.log('HTML model updated:', value)"
    @text-change="
      ({ delta, oldContent, source }) =>
        console.log('text-change', delta, oldContent, source)
    "
    @selection-change="
      ({ range, oldRange, source }) =>
        console.log('selection-change', range, oldRange, source)
    "
    @editor-change="
      (eventName) => console.log('editor-change', `eventName: ${eventName}`)
    "
    @focus="(quill) => console.log('focus', quill)"
    @blur="(quill) => console.log('blur', quill)"
    @ready="(quill) => console.log('ready', quill)"
  />
</template>

<style scoped></style>

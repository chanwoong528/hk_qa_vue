<script setup lang="ts">
import { reactive, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

import RichEditor from "../RichEditor.vue";

const initialState = {
  versionTitle: "",
  versionDesc: "Write description for new version",
  tag: "",
  file: "",
};
const state = reactive({
  ...initialState,
});
const rules = {
  versionTitle: {
    required: helpers.withMessage("Title is required", required),
  },
  versionDesc: {
    required: helpers.withMessage("Description is required", required),
  },
  tag: { required: helpers.withMessage("Gitlab url is required", required) },
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

const v$ = useVuelidate(rules, state);

const emit = defineEmits(["onSubmitNewVersion"]);

const onSubmitNewVersion = () => {
  if (!!v$.value.$errors.map((e) => e.$message).join(", ")) return;
  emit(
    "onSubmitNewVersion",
    state.versionTitle,
    state.versionDesc,
    state.tag,
    state.file
  );
};
</script>
<template>
  <form @submit.prevent="">
    <v-text-field
      :error-messages="
        v$.versionTitle.$errors.map((e) => e.$message).join(', ')
      "
      density="compact"
      placeholder="버전 제목"
      prepend-inner-icon="mdi-xml"
      variant="outlined"
      @blur="v$.versionTitle.$touch"
      @input="v$.versionTitle.$touch"
      v-model="state.versionTitle"
    />
    <!-- <v-text-field
      class="rich-editor-input"
      :error-messages="v$.versionDesc.$errors.map((e) => e.$message).join(', ')"
      density="compact"
      placeholder="Version Description"
      prepend-inner-icon="mdi-text-box-multiple-outline"
      variant="outlined"
      @blur="v$.versionDesc.$touch"
      @input="v$.versionDesc.$touch"
      v-model="state.versionDesc"
    /> -->
    <div
      :class="{ focus: isEditorFocused }"
      class="editor-con"
      :tabindex="0"
      @focus="onFocusEditorCon(true)"
      @click="onFocusEditorCon(true)"
    >
      <p>
        <v-icon icon="mdi-text-box-multiple-outline"></v-icon>
        버전 설명
      </p>
      <RichEditor
        v-model="state.versionDesc"
        :isEditorFocused="isEditorFocused"
        @onBlurEditorCon="onBlurEditorCon"
      />
    </div>

    <v-text-field
      :error-messages="v$.tag.$errors.map((e) => e.$message).join(', ')"
      density="compact"
      placeholder="Gitlab Url"
      prepend-inner-icon="mdi-gitlab"
      variant="outlined"
      @blur="v$.tag.$touch"
      @input="v$.tag.$touch"
      v-model="state.tag"
    />
    <v-file-input
      label="파일 첨부(필요시)"
      chips
      density="compact"
      variant="outlined"
      @change="state.file = $event.target.files[0]"
    ></v-file-input>
    <v-btn
      color="blue"
      size="large"
      variant="tonal"
      block
      type="submit"
      @click="
        {
          v$.$validate();
          onSubmitNewVersion();
        }
      "
    >
      신규 버전 생성
    </v-btn>
  </form>
</template>

<style scoped lang="scss">
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 0;
  .editor-con {
    border: 1px solid #9d9d9d;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    min-height: 300px;
    &.focus {
      border: 2px solid #212121;
    }
    p {
      padding: 8px 0 8px 12px;
    }
  }
}
</style>

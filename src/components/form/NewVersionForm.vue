<script setup lang="ts">
import { reactive, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

import RichEditor from "@/components/RichEditor.vue";
import AddTestUnitForm from "@/components/form/AddTestUnitForm.vue";
import type { ISwVersion, ITestUnit } from "@/types/types.d";
const props = defineProps({
  editVersionInfo: {
    type: Object as () => Partial<ISwVersion>,
    required: false,
  },
  editFlag: {
    type: Boolean,
    required: false,
  },
});

const unitTestList = ref<Partial<ITestUnit>[]>(
  !!props.editFlag
    ? !!props.editVersionInfo?.testUnits && props.editVersionInfo?.testUnits?.length > 0
      ? props.editVersionInfo?.testUnits
      : []
    : // : [{ unitDesc: "" }],
    [],
);

const initialState = !!props.editFlag
  ? {
    versionTitle: props.editVersionInfo?.versionTitle,
    versionDesc: props.editVersionInfo?.versionDesc,
    tag: props.editVersionInfo?.tag,
    fileSrc: props.editVersionInfo?.fileSrc,
  }
  : {
    versionTitle: "",
    versionDesc: "버전 설명",
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

const emit = defineEmits(["onSubmitNewVersion", "onSubmitEditVersion"]);

const onSubmitNewVersion = () => {
  if (!!v$.value.$errors.map((e) => e.$message).join(", ")) return;

  if (!!props.editFlag) {
    emit(
      "onSubmitEditVersion",
      props.editVersionInfo?.swVersionId,
      state.versionTitle,
      state.versionDesc,
      state.tag,
      state.file,
      unitTestList.value,
    );
    return;
  }
  return emit("onSubmitNewVersion", state.versionTitle, state.versionDesc, state.tag, state.file, unitTestList.value);
};
</script>
<template>
  <form @submit.prevent="">
    <v-text-field :error-messages="v$.versionTitle.$errors.map((e) => e.$message).join(', ')" density="compact"
      placeholder="버전 제목" prepend-inner-icon="mdi-xml" variant="outlined" @blur="v$.versionTitle.$touch"
      @input="v$.versionTitle.$touch" v-model="state.versionTitle" />
    <!-- :disabled="!!props.editFlag" -->

    <div :class="{ focus: isEditorFocused }" class="editor-con" :tabindex="0" @focus="onFocusEditorCon(true)"
      @click="onFocusEditorCon(true)">
      <p>
        <v-icon icon="mdi-text-box-multiple-outline"></v-icon>
        버전 설명
      </p>
      <RichEditor v-model="state.versionDesc" :isEditorFocused="isEditorFocused" @onBlurEditorCon="onBlurEditorCon" />
    </div>

    <v-text-field :error-messages="v$.tag.$errors.map((e) => e.$message).join(', ')" density="compact"
      placeholder="Gitlab Url" prepend-inner-icon="mdi-gitlab" variant="outlined" @blur="v$.tag.$touch"
      @input="v$.tag.$touch" v-model="state.tag" />
    <a v-if="initialState.fileSrc" class="cur-file-btn" :href="initialState.fileSrc" target="_blank">현재 파일</a>
    <v-file-input label="파일 첨부(필요시)" chips density="compact" variant="outlined"
      @change="state.file = $event.target.files[0]"></v-file-input>
    <AddTestUnitForm v-model="unitTestList" />
    <v-btn color="blue" size="large" variant="tonal" block type="submit" @click="
                        {
      v$.$validate();
      onSubmitNewVersion();
    }
      ">
      {{ props.editFlag ? "버전 수정" : "신규 버전 생성" }}
    </v-btn>
  </form>
</template>

<style scoped lang="scss">
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 0;

  // .cur-file-btn {}
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

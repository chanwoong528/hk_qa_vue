<script setup lang="ts">
import { JenkinsDeploymentClass } from "@/entity/JenkinsDeployment";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import { reactive, ref } from "vue";

const props = defineProps<{
  selectedJenkinsDeployment: JenkinsDeploymentClass & { tag: string };
}>();

const emit = defineEmits(["onSubmitJenkinsDeployment"]);

const isEditorFocused = ref<boolean>(false);

const initialState = {
  tag: props.selectedJenkinsDeployment.tag,
  reason: "",
};
const state = reactive({
  ...initialState,
});

const rules = {
  tag: {
    required: helpers.withMessage("tag is required", required),
  },
  reason: {
    required: helpers.withMessage("reason is required", required),
  },
};
const v$ = useVuelidate(rules, state);

const onFocusEditorCon = (clickedCon: boolean) => {
  isEditorFocused.value = clickedCon;
};
const onBlurEditorCon = (isFocusOut: boolean) => {
  if (!!isFocusOut && isEditorFocused.value) {
    isEditorFocused.value = false;
  }
};

const onSumbitDeployLog = () => {
  if (!!v$.value.$errors.map(e => e.$message).join(", ")) return;

  emit("onSubmitJenkinsDeployment", props.selectedJenkinsDeployment.jenkinsDeploymentId, state.tag, state.reason);
};
</script>

<template>
  <form @submit.prevent="">
    <v-text-field
      :error-messages="v$.tag.$errors.map(e => e.$message).join(', ')"
      density="compact"
      placeholder="Jenkins tag"
      prepend-inner-icon="mdi mdi-tag"
      variant="outlined"
      @blur="v$.tag.$touch"
      @input="v$.tag.$touch"
      v-model="state.tag"
      disabled
    />
    <div
      :class="{ focus: isEditorFocused }"
      class="editor-con"
      :tabindex="0"
      @focus="onFocusEditorCon(true)"
      @click="onFocusEditorCon(true)"
    >
      <p>
        <v-icon icon="mdi-text-box-multiple-outline"></v-icon>
        배포 사유
      </p>
      <RichEditor
        v-model="state.reason"
        placeHolder="배포 사유"
        :isEditorFocused="isEditorFocused"
        @onBlurEditorCon="onBlurEditorCon"
      />
    </div>

    <v-btn
      color="blue"
      size="large"
      variant="tonal"
      block
      type="submit"
      @click="
        {
          v$.$validate();
          onSumbitDeployLog();
        }
      "
    >
      배포 시작
    </v-btn>
  </form>
</template>

<style scoped lang="scss">
form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 0;
}

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
</style>

<script setup lang="ts">
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

const initialState = {
  versionTitle: "",
  versionDesc: "",
  tag: "",
  // files: "",
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
const v$ = useVuelidate(rules, state);

const emit = defineEmits(["onSubmitNewVersion"]);

const onSubmitNewVersion = () => {
  emit(
    "onSubmitNewVersion",
    state.versionTitle,
    state.versionDesc,
    state.tag
    // state.files
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
      placeholder="Version Title"
      prepend-inner-icon="mdi-xml"
      variant="outlined"
      @blur="v$.versionTitle.$touch"
      @input="v$.versionTitle.$touch"
      v-model="state.versionTitle"
    />
    <v-text-field
      :error-messages="v$.versionDesc.$errors.map((e) => e.$message).join(', ')"
      density="compact"
      placeholder="Version Description"
      prepend-inner-icon="mdi-text-box-multiple-outline"
      variant="outlined"
      @blur="v$.versionDesc.$touch"
      @input="v$.versionDesc.$touch"
      v-model="state.versionDesc"
    />
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
    <!-- <v-file-input
      label="Upload File"
      chips
      multiple
      density="compact"
      variant="outlined"
    ></v-file-input> -->
    <v-btn
      class="mb-8"
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
      Create New Version
    </v-btn>
  </form>
</template>

<style scoped></style>

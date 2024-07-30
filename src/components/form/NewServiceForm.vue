<script setup lang="ts">
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

const initialState = {
  typeTitle: "",
  typeDesc: "",

  // files: "",
};
const emit = defineEmits(["onSubmitNewService"]);

const state = reactive({
  ...initialState,
});
const rules = {
  typeTitle: {
    required: helpers.withMessage("Title is required", required),
  },
  typeDesc: {
    required: helpers.withMessage("Description is required", required),
  },
};
const v$ = useVuelidate(rules, state);
const onSubmitNewService = () => {
  if (!!v$.value.$errors.map((e) => e.$message).join(", ")) return;
  emit("onSubmitNewService", state.typeTitle, state.typeDesc);
};
</script>
<template>
  <form @submit.prevent="">
    <v-text-field
      :error-messages="v$.typeTitle.$errors.map((e) => e.$message).join(', ')"
      density="compact"
      placeholder="Service Title"
      prepend-inner-icon="mdi-xml"
      variant="outlined"
      @blur="v$.typeTitle.$touch"
      @input="v$.typeTitle.$touch"
      v-model="state.typeTitle"
    />
    <v-text-field
      :error-messages="v$.typeDesc.$errors.map((e) => e.$message).join(', ')"
      density="compact"
      placeholder="Service Description"
      prepend-inner-icon="mdi-text-box-multiple-outline"
      variant="outlined"
      @blur="v$.typeDesc.$touch"
      @input="v$.typeDesc.$touch"
      v-model="state.typeDesc"
    />
    <v-btn
      color="blue"
      size="large"
      variant="tonal"
      block
      type="submit"
      @click="
        {
          v$.$validate();
          onSubmitNewService();
        }
      "
    >
      Create New Service
    </v-btn>
  </form>
</template>

<style scoped></style>

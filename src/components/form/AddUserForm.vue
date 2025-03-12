<script setup lang="ts">
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { email, required, helpers } from "@vuelidate/validators";
const emit = defineEmits(["submitUser"]);
const initialState = {
  email: "",
  username: "",
};

const state = reactive({
  ...initialState,
});
const rules = {
  email: {
    required: helpers.withMessage("Email is required", required),
    email: helpers.withMessage("Enter valid Email form", email),
  },
  username: {
    required: helpers.withMessage("Username is required", required),
  },
};
const v$ = useVuelidate(rules, state);

const onClickSubmit = () => {
  if (!!v$.value.$errors.map(e => e.$message).join(", ")) return;
  emit("submitUser", state);
};
</script>
<template>
  <form @submit.prevent="">
    <v-text-field
      :error-messages="v$.email.$errors.map(e => e.$message).join(', ')"
      density="compact"
      placeholder="Email address"
      prepend-inner-icon="mdi-email-outline"
      variant="outlined"
      @blur="v$.email.$touch"
      @input="v$.email.$touch"
      v-model="state.email"
    />
    <v-text-field
      :error-messages="v$.username.$errors.map(e => e.$message).join(', ')"
      density="compact"
      placeholder="Username"
      prepend-inner-icon="mdi-account-outline"
      variant="outlined"
      @blur="v$.username.$touch"
      @input="v$.username.$touch"
      v-model="state.username"
    />
    <v-btn
      class="mt-2"
      color="blue"
      size="large"
      variant="tonal"
      block
      type="submit"
      @click="
        {
          v$.$validate();
          onClickSubmit();
        }
      "
    >
      등록</v-btn
    >
  </form>
</template>

<style scoped>
form {
  padding-top: 20px;
}
</style>

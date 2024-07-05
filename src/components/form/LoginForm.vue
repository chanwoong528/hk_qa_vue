<script setup lang="ts">
import { reactive, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { email, required, helpers } from "@vuelidate/validators";
const props = defineProps({
  toggleDialog: Function,
});

const pwVisible = ref<boolean>(false);

const initialState = {
  email: "",
  pw: "",
};
const state = reactive({
  ...initialState,
});
const rules = {
  email: {
    required: helpers.withMessage("Email is required", required),
    email: helpers.withMessage("Enter valid Email form", email),
  },
  pw: { required: helpers.withMessage("Password is required", required) },
};
const v$ = useVuelidate(rules, state);
const emit = defineEmits(["handleLogin", "toggleDialog"]);

const handleSubmitEmail = () => {
  emit(
    "handleLogin",
    v$.value.$errors.map((e) => e.$message).join(", "),
    state.email,
    state.pw
  );
};
</script>

<template>
  <form @submit.prevent="">
    <v-text-field
      :error-messages="v$.email.$errors.map((e) => e.$message).join(', ')"
      density="compact"
      placeholder="Email address"
      prepend-inner-icon="mdi-email-outline"
      variant="outlined"
      @blur="v$.email.$touch"
      @input="v$.email.$touch"
      v-model="state.email"
    />
    <div
      class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
    >
      Password
      <v-btn
        variant="plain"
        class="text-caption text-blue"
        @click="props.toggleDialog"
      >
        Forgot login password?
      </v-btn>
    </div>
    <v-text-field
      :error-messages="v$.pw.$errors.map((e) => e.$message).join(', ')"
      :append-inner-icon="pwVisible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="pwVisible ? 'text' : 'password'"
      density="compact"
      placeholder="Enter your password"
      prepend-inner-icon="mdi-lock-outline"
      variant="outlined"
      @click:append-inner="pwVisible = !pwVisible"
      @blur="v$.pw.$touch"
      @input="v$.pw.$touch"
      v-model="state.pw"
    ></v-text-field>
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
          handleSubmitEmail();
        }
      "
    >
      Login
    </v-btn>
  </form>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";

const initialState = {
  email: "",
};

const state = reactive({
  ...initialState,
});

const rules = {
  email: { required, email },
};

const v$ = useVuelidate(rules, state);

const emit = defineEmits(["userEmail"]);

const handleSubmitEmail = (closeFlag?: boolean) => {
  if (!!v$.value.$errors.map((e) => e.$message).join(", ")) return;
  emit(
    "userEmail",
    v$.value.$errors.map((e) => e.$message).join(", "),
    state.email,
    closeFlag
  );
};
</script>

<template>
  <form @submit.prevent="">
    <v-text-field
      v-model="state.email"
      :error-messages="v$.email.$errors.map((e) => e.$message).join(', ')"
      label="E-mail"
      required
      @blur="v$.email.$touch"
      @input="v$.email.$touch"
    ></v-text-field>
    <v-btn
      class="me-4"
      type="submit"
      variant="outlined"
      color="primary"
      @click="
        {
          v$.$validate();
          handleSubmitEmail();
        }
      "
    >
      Send Verification Email
    </v-btn>
    <v-btn
      type="close"
      @click="handleSubmitEmail(true)"
      variant="outlined"
      color="error"
    >
      close
    </v-btn>
  </form>
</template>

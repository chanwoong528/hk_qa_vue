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
</script>

<template>
  <form>
    <v-text-field
      v-model="state.email"
      :error-messages="v$.email.$errors.map((e) => e.$message).join(', ')"
      label="E-mail"
      required
      @blur="v$.email.$touch"
      @input="v$.email.$touch"
    ></v-text-field>
    <v-btn class="me-4" @click="v$.$validate">Send Verification Email</v-btn>
  </form>
</template>

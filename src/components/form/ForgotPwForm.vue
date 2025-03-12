<script setup lang="ts">
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { email, required, helpers } from "@vuelidate/validators";

const initialState = {
  email: "",
};

const state = reactive({
  ...initialState,
});

const rules = {
  email: {
    required: helpers.withMessage("이메일을 입력해주세요", required),
    email: helpers.withMessage("이메일 형식이 아닙니다", email),
  },
};

const v$ = useVuelidate(rules, state);

const emit = defineEmits(["handleForgotPw"]);

const handleSubmitEmail = (closeFlag?: boolean) => {
  if (!!v$.value.$errors.map(e => e.$message).join(", ")) return;
  emit(
    "handleForgotPw",
    v$.value.$errors.map(e => e.$message).join(", "),
    state.email,
    closeFlag
  );
};
</script>

<template>
  <form @submit.prevent="">
    <v-text-field
      v-model="state.email"
      :error-messages="v$.email.$errors.map(e => e.$message).join(', ')"
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
      이메일 보내기
    </v-btn>
    <v-btn
      type="close"
      @click="handleSubmitEmail(true)"
      variant="outlined"
      color="error"
    >
      닫기
    </v-btn>
  </form>
</template>

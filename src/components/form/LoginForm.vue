<script setup lang="ts">
import { reactive, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { email, required, helpers } from "@vuelidate/validators";
import UserClass from "@/entity/User";

const props = defineProps({
  toggleDialog: Function,
});

const pwVisible = ref<boolean>(false);

const state = reactive(new UserClass());

const rules = {
  email: {
    required: helpers.withMessage("이메일을 입력해주세요", required),
    email: helpers.withMessage("이메일 형식이 아닙니다", email),
  },
  pw: { required: helpers.withMessage("패스워드를 입력해주세요", required) },
};
const v$ = useVuelidate(rules, state);
const emit = defineEmits(["handleLogin", "toggleDialog"]);

const handleSubmitEmail = () => {
  emit("handleLogin", v$.value.$errors.map((e) => e.$message).join(", "), state.email, state.pw);
};
</script>

<template>
  <form @submit.prevent="">
    <div class="text-subtitle-1 text-medium-emphasis">Email</div>

    <v-text-field
      :error-messages="v$.email.$errors.map((e) => e.$message).join(', ')"
      placeholder="이메일"
      prepend-inner-icon="mdi-email-outline"
      variant="outlined"
      @blur="v$.email.$touch"
      @input="v$.email.$touch"
      v-model="state.email"
    />
    <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">Password</div>
    <v-text-field
      :error-messages="v$.pw.$errors.map((e) => e.$message).join(', ')"
      :append-inner-icon="pwVisible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="pwVisible ? 'text' : 'password'"
      placeholder="비밀번호"
      prepend-inner-icon="mdi-lock-outline"
      variant="outlined"
      @click:append-inner="pwVisible = !pwVisible"
      @blur="v$.pw.$touch"
      @input="v$.pw.$touch"
      v-model="state.pw"
    ></v-text-field>
    <div class="btn-con">
      <v-btn
        color="primary"
        variant="elevated"
        size="x-large"
        rounded="xl"
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
      <v-btn variant="plain" class="text-caption" @click="props.toggleDialog"> 비밀번호 찾기 </v-btn>
    </div>
  </form>
</template>

<style lang="scss" scoped>
form {
  max-width: 360px;
  width: 100%;
  input {
    padding: 20px;
  }
  .btn-con {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 20px;
    gap: 10px;
    button {
      width: 100%;
      // background-color:;
    }
  }
}
</style>

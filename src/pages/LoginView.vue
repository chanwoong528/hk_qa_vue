<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { authApi } from "@/services/domain/authService";
import { useUserStore } from "@/store/userStore";

import ForgotPwForm from "@/components/form/ForgotPwForm.vue";
import LoginForm from "@/components/form/LoginForm.vue";
import ModalWrap from "@/components/ModalWrap.vue";

import type { IUserInfo } from "@/types/types";
import HIQ_LOGO from "@/assets/hiq_logo_text.svg";
import { userApi } from "@/services/domain/userService";

const router = useRouter();
const store = useUserStore();
const { setUser } = store;

const isDialogOpen = ref<boolean>(false);

const toggleDialog = () => {
  isDialogOpen.value = !isDialogOpen.value;
};

const handleForgotPw = (errors: Object, email: string, closeFlag?: boolean) => {
  if (!!closeFlag) {
    return toggleDialog();
  }
  if (!errors) {
    // console.log("Forgot pw no error", email);
    //TODO: api call forget pw -> send verfication email
    userApi.POST_forgetPw(email).then((res) => {
      alert("이메일 전송 완료")
    });
  }
};

const handleLogin = (error: Object, email: string, pw: string) => {
  if (!error) {
    authApi
      .POST_login({ email, pw })
      .then((res) => {
        if (!!res.isPwDefault) {
          alert("Please reset your password");
        }
        setUser(res as IUserInfo);
        return router.push("/");
      })
      .catch((err) => {
        const errorCode = err.statusCode;
        const errorMsg = err.message;
        console.log(errorMsg)
        switch (errorCode) {
          case 401:
            return alert(errorMsg);
          case 404:
            return alert("User does not exist");
          default:
            return alert("Something went wrong");
        }
      });
  }
};
</script>

<template>
  <ModalWrap v-model="isDialogOpen" title="비밀번호 초기화할 이메일을 입력해 주세요">
    <ForgotPwForm @handleForgotPw="handleForgotPw" />
  </ModalWrap>
  <div>
    <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
      <h1>
        <img :src="HIQ_LOGO" alt="HK QA Tester" />
      </h1>
      <div class="text-subtitle-1 text-medium-emphasis">Email</div>

      <LoginForm @handle-login="handleLogin" :toggleDialog="toggleDialog" />
    </v-card>
  </div>
</template>
<style scoped lang="scss">
h1 {
  width: 50%;
  margin: 0 auto;

  img {
    width: 100%;
  }
}
</style>

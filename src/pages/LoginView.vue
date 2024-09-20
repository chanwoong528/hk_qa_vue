<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { authApi } from "@/services/domain/authService";
import { useUserStore } from "@/store/userStore";

import ForgotPwForm from "@/components/form/ForgotPwForm.vue";
import LoginForm from "@/components/form/LoginForm.vue";
import ModalWrap from "@/components/ModalWrap.vue";

import type { IUserInfo } from "@/types/types";
import { userApi } from "@/services/domain/userService";

import HIQ_LOGO from "@/assets/hiq_logo_text.svg";

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
      alert("이메일 전송 완료");
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
  <div class="login-wrap">
    <div class="login-left-con">
      <h1>
        <img :src="HIQ_LOGO" alt="HK QA Tester" />
      </h1>

      <h3><strong>품질 향상</strong>과 <strong>방향성</strong>을 <strong>제시</strong>하는 가이드</h3>
      <p class="acronym-expand">
        <span class="acronym">Q</span>uality <span class="acronym"> I</span>mprovement &
        <span class="acronym">N</span>avigation <span class="acronym">G</span>uide
      </p>
    </div>
    <div class="login-right-con">
      <LoginForm @handle-login="handleLogin" :toggleDialog="toggleDialog" />
    </div>

    <!-- <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg"> </v-card> -->
  </div>
</template>
<style scoped lang="scss">
.login-wrap {
  display: flex;
  height: 100vh;

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  .login-left-con {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;

    width: 50%;
    background-image: url(~@/assets/login_bg.jpg);
    background-size: 100%;
    background-position: center;

    h1 {
      max-width: 164px;
      margin-bottom: 20px;
    }
  }
  .login-right-con {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 50%;
  }

  .v-card {
    width: 448px;
    background-color: white;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    padding: 24px;
  }
}

h1 {
  width: 50%;
  margin: 0 auto;

  img {
    width: 100%;
  }
}

.acronym-expand {
  .acronym {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
  }
}
</style>

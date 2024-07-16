<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { authApi } from "@/services/domain/authService";
import { useUserStore } from "@/store/userStore";

import ForgotPwForm from "@/components/form/ForgotPwForm.vue";
import LoginForm from "@/components/form/LoginForm.vue";
import ModalWrap from "@/components/ModalWrap.vue";

import type { IUserInfo } from "@/types/types";

const router = useRouter();
const store = useUserStore();
const { setUser } = store;

const isDialogOpen = ref<boolean>(false);

const toggleDialog = () => {
  isDialogOpen.value = !isDialogOpen.value;
};

const handleForgotPw = (errors: Object, email: String, closeFlag?: boolean) => {
  if (!!closeFlag) {
    return toggleDialog();
  }
  if (!errors) {
    // console.log("Forgot pw no error", email);
    //TODO: api call forget pw -> send verfication email
  }
};

const handleLogin = (error: Object, email: string, pw: string) => {
  if (!error) {
    authApi
      .POST_login({ email, pw })
      .then((res) => {
        setUser(res as IUserInfo);
        return router.push("/");
      })
      .catch((err) => {
        console.warn("handleLogin[err]: ", err);
        if (err.statusCode === 401) {
          return alert("Invalid email or password");
        }
      });
  }
};
</script>

<template>
  <ModalWrap v-model="isDialogOpen" title="Reset Password">
    <ForgotPwForm @userEmail="handleForgotPw" />
  </ModalWrap>
  <div>
    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <h1>HK QA Tester</h1>
      <div class="text-subtitle-1 text-medium-emphasis">Account</div>

      <LoginForm @handle-login="handleLogin" :toggleDialog="toggleDialog" />
    </v-card>
  </div>
</template>

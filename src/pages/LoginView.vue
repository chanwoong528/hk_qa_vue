<script setup lang="ts">
import { reactive, ref } from "vue";
import { authApi } from "@/services/domain/authService";
import { useUserStore } from "@/store/userStore";

import ForgotPwForm from "@/components/form/ForgotPwForm.vue";
import ModalWrap from "@/components/ModalWrap.vue";

import { IUserInfo } from "@/types/types";

const store = useUserStore();
const { setUser } = store;

const pwVisible = ref<boolean>(false);
const isDialogOpen = ref<boolean>(false);

const loginInfo = reactive({
  email: "",
  pw: "",
});

const toggleDialog = () => {
  isDialogOpen.value = !isDialogOpen.value;
};

const handleForgotPw = (errors: Object, email: String, closeFlag?: boolean) => {
  if (!!closeFlag) {
    return toggleDialog();
  }

  if (!errors) {
    console.log("Forgot pw no error", email);
    //TODO: api call forget pw -> send verfication email
  }
};

const handleLogin = () => {
  authApi
    .POST_login(loginInfo)
    .then((res) => setUser(res as IUserInfo))
    .catch((err) => {
      console.log("err[handleLogin]:  ", err);
    });
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
      <v-text-field
        density="compact"
        placeholder="Email address"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        @input="loginInfo.email = $event.target.value"
      />
      <div
        class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
      >
        Password
        <v-btn
          variant="plain"
          class="text-caption text-blue"
          @click="toggleDialog"
        >
          Forgot login password?
        </v-btn>
      </div>

      <v-text-field
        :append-inner-icon="pwVisible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="pwVisible ? 'text' : 'password'"
        density="compact"
        placeholder="Enter your password"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="pwVisible = !pwVisible"
        @input="loginInfo.pw = $event.target.value"
      ></v-text-field>

      <v-btn
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        block
        @click="handleLogin"
      >
        Log In
      </v-btn>
    </v-card>
  </div>
</template>

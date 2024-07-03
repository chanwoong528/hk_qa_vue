<script setup lang="ts">
import { ref } from "vue";

import ForgotPwForm from "@/components/form/ForgotPwForm.vue";
import ModalWrap from "@/components/ModalWrap.vue";

const pwVisible = ref(false);
const isDialogOpen = ref<boolean>(false);

const toggleDialog = () => {
  isDialogOpen.value = !isDialogOpen.value;
};

const handleForgotPw = (email: string) => {
  console.log("Forgot password", email);

  if (!email) return;

  return toggleDialog();
};
</script>

<template>
  <ModalWrap :dialog="isDialogOpen" @toggle-dialog="toggleDialog">
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
      ></v-text-field>

      <v-btn class="mb-8" color="blue" size="large" variant="tonal" block>
        Log In
      </v-btn>
    </v-card>
  </div>
</template>

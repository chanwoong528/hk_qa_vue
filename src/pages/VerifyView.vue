<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import { authApi } from "@/services/domain/authService";
import { router } from "@/router";

const route = useRoute();
const verifyToken = ref<string>();

onBeforeMount(() => (verifyToken.value = route.query.token as string));

const onClickVerifyEmail = () => {
  if (!!verifyToken.value) {
    authApi
      .POST_verifyEmailByToken(verifyToken.value)
      .then((res) => {
        if (res.code === 200) {
          router.push("/login");
          return alert("Email verified successfully, please login");
        }
        throw res;
      })
      .catch((err) => {
        return alert("Email verification failed");
      });
  }
};
</script>
<template>
  <div>{{ verifyToken }}</div>

  <v-btn variant="elevated" color="primary" @click="onClickVerifyEmail">
    Click to Verify Email
  </v-btn>
</template>

<style scoped></style>

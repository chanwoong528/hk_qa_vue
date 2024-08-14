v-base
<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import { router } from "@/router";
import { authApi } from "@/services/domain/authService";

const route = useRoute();
const verifyToken = ref<string>();

onBeforeMount(() => (verifyToken.value = route.query.token as string));

const onClickVerifyEmail = () => {
  if (!!verifyToken.value) {
    authApi
      .POST_resetPw(verifyToken.value)
      .then((res) => {
        if (res.code === 200) {
          router.push("/login");
          return alert("비밀번호 초기화 되었습니다, 다시 로그인 해주세요.");
        }
        throw res;
      })
      .catch((err) => {
        return alert("에러가 생겼습니다. ");
      });
  }
};
</script>
<template>
  <div>{{ verifyToken }}</div>

  <v-btn variant="elevated" color="primary" @click="onClickVerifyEmail">
    Reset Password
  </v-btn>
</template>

<style scoped></style>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { storeToRefs } from "pinia";

import { useUserStore } from "@/store/userStore";
import { authApi } from "@/services/domain/authService";
import { NAV_LIST } from "@/router/index.ts";

import type { IUserInfo } from "@/types/types";

import SideHeader from "@/components/SideHeader.vue";
import ResetPwForm from "@/components/form/ResetPwForm.vue";

const route = useRoute();
const router = useRouter();
const store = useUserStore();
const { loggedInUser } = storeToRefs(store);

const openResetPwModal = computed(() => {
  if (!!loggedInUser.value?.isPwDefault) return true;

  return false;
});
const fetchAuthByAccToken = () => {
  return authApi
    .GET_loginCheck()
    .then((loginResult) => {
      store.setUser(loginResult as IUserInfo);
      // return router.push("/");
    })
    .catch((err) => {
      alert("Session expired. Please login again.");
    });
};

watch(
  () => [route.path, route.query.token],
  ([newPath, newToken]) => {
    if (!!localStorage.getItem("accessToken")) {
      return fetchAuthByAccToken();
    } else {
      store.setResetUser();
      if (!newToken) {
        return router.push("/login");
      }
    }
  }
);
</script>
<template>
  <ModalWrap v-model="openResetPwModal" title="Reset Password">
    <ResetPwForm :fetchAuthByAccToken="fetchAuthByAccToken" />
  </ModalWrap>
  <template v-if="!loggedInUser?.id">
    <template>
      <h1>Hello App!</h1>
    </template>
    <p><strong>Current route path:</strong> {{ route.fullPath }}</p>
    <nav>
      <ul>
        <template v-for="navItem in NAV_LIST">
          <li
            v-if="
              !!loggedInUser?.id
                ? navItem.meta.requiresAuth
                : !navItem.meta.requiresAuth
            "
          >
            <RouterLink :to="navItem.path"> {{ navItem.label }}</RouterLink>
          </li>
        </template>
      </ul>
    </nav>
  </template>
  <template v-else>
    <SideHeader />
  </template>
</template>

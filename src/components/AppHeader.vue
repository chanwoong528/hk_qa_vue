<script setup lang="ts">
import { computed, watch } from "vue";
import {
  useRoute,
  useRouter,
  // RouterLink
} from "vue-router";
import { storeToRefs } from "pinia";

import { useUserStore } from "@/store/userStore";
import { authApi } from "@/services/domain/authService";

import SideHeader from "@/components/SideHeader.vue";
import ResetPwForm from "@/components/form/ResetPwForm.vue";
import { UserClass } from "@/entity/User";

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
    .then(loginResult => {
      return store.setUser(loginResult as UserClass);
    })
    .catch(err => {
      store.setResetUser();
      alert("Session expired. Please login again.");
      return router.push("/login");
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
    <!-- <nav>
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
    </nav> -->
  </template>
  <template v-else>
    <SideHeader />
  </template>
</template>

<script setup lang="ts">
import DefaultLayout from "@/layout/DefaultLayout.vue";
import UserList from "@/components/list/UserList.vue";
import { ref } from "vue";
import { onMounted } from "vue";
import { userApi } from "@/services/domain/userService";
import { IUserInfo } from "@/types/types";

const userList = ref<IUserInfo[]>([]);

onMounted(() => {
  userApi.GET_users().then((usersData) => {
    console.log("usersData: ", usersData);
    userList.value = usersData as IUserInfo[];
  });
});
</script>

<template>
  <DefaultLayout>
    <div class="main">
      <h1>userPage</h1>
      <p>aaa</p>
    </div>
    <UserList :userList="userList" />
  </DefaultLayout>
</template>

<style scoped></style>

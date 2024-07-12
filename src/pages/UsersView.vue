<script setup lang="ts">
import DefaultLayout from "@/layout/DefaultLayout.vue";
import UserList from "@/components/list/UserList.vue";
import { ref } from "vue";
import { onMounted } from "vue";
import { userApi } from "@/services/domain/userService";
import { IUserInfo } from "@/types/types";
import { E_Role } from "@/types/enum";

const userList = ref<IUserInfo[]>([]);

onMounted(() => {
  userApi.GET_users().then((usersData) => {
    userList.value = usersData as IUserInfo[];
  });
});

const onChangeSelectRole = (id: string, role: E_Role) => {
  userApi.PATCH_user({ id: id, role: role });
};
</script>

<template>
  <DefaultLayout>
    <UserList :userList="userList" @onChangeSelectRole="onChangeSelectRole" />
  </DefaultLayout>
</template>

<style scoped></style>

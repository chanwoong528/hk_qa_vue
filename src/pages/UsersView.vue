<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";

import { useUserStore } from "@/store/userStore";
import { userApi } from "@/services/domain/userService";

import type { IUserInfo } from "@/types/types";
import { E_Role, E_UserStatus } from "@/types/enum.d";

import DefaultLayout from "@/layout/DefaultLayout.vue";
import UserList from "@/components/list/UserList.vue";
import ModalWrap from "@/components/ModalWrap.vue";
import AddUserForm from "@/components/form/AddUserForm.vue";

const userList = ref<IUserInfo[]>([]);
const userStore = useUserStore();
const { loggedInUser } = storeToRefs(userStore);

const openModalNewUser = ref<boolean>(false);

onMounted(() => fetchUsers());

const fetchUsers = () => {
  return userApi.GET_users("all").then((usersData) => {
    userList.value = usersData as IUserInfo[];
  });
};

const onChangeSelectRole = (id: string, role: E_Role) => {
  userApi.PATCH_user({ id: id, role: role });
};

const onChangeUserStatus = (id: string, userStatus: E_UserStatus) => {
  userApi.PATCH_user({ id: id, userStatus: userStatus });
};

const onToggleNewUser = () => {
  openModalNewUser.value = !openModalNewUser.value;
};

const onSubmitAddUser = (
  newUser: Partial<IUserInfo> & { username: string; email: string }
) => {
  return userApi.POST_user(newUser).then((res) => {
    console.log(res);
    fetchUsers();
    alert("New user added successfully!");
    openModalNewUser.value = false;
  });
};
</script>

<template>
  <ModalWrap v-model="openModalNewUser" title="Add New User">
    <AddUserForm @submitUser="onSubmitAddUser" />
  </ModalWrap>
  <DefaultLayout>
    <header class="user-header">
      <h3>User Management</h3>
      <v-btn
        v-if="loggedInUser?.role !== E_Role.tester"
        variant="elevated"
        color="primary"
        @click="onToggleNewUser"
      >
        New User
        <v-icon icon="mdi-plus"></v-icon>
      </v-btn>
    </header>
    <UserList
      :userList="userList"
      @onChangeSelectRole="onChangeSelectRole"
      @onChangeUserStatus="onChangeUserStatus"
    />
  </DefaultLayout>
</template>

<style scoped>
.user-header {
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
}
</style>

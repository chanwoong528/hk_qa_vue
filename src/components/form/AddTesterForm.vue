<script setup lang="ts">
import { ref, watch } from "vue";
import UserList from "../list/UserList.vue";

import type { IUserInfo } from "@/types/types";
import { E_UserListType } from "@/types/enum.d";

const props = defineProps({
  userList: {
    type: Array as () => IUserInfo[],
    required: true,
  },
  curTesterList: {
    type: Array as () => IUserInfo[],
    required: false,
  },
});

const selectedUsers = ref<IUserInfo[]>([]);
const emit = defineEmits(["onSubmitAddTesters"]);

watch(
  () => props.curTesterList,
  (newVal) => {
    selectedUsers.value = newVal ?? [];
  }
);

const onSubmit = () => {
  emit("onSubmitAddTesters", selectedUsers.value);
};
</script>

<template>
  <form @submit.prevent="">
    <UserList
      v-model="selectedUsers"
      :table-type="E_UserListType.checkbox"
      :user-list="props.userList"
    />
    <v-btn
      color="blue"
      size="large"
      variant="tonal"
      block
      type="submit"
      @click="onSubmit"
    >
      테스터 확정
    </v-btn>
  </form>

  <!-- <pre>{{ selectedUsers }}</pre> -->
</template>

<style scoped></style>

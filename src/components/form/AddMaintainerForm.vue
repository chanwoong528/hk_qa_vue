<script setup lang="ts">
import { ref, watch } from "vue";
import UserList from "../list/UserList.vue";

import { E_UserListType } from "@/types/enum.d";
import { UserClass } from "@/entity/User";

const props = defineProps({
  userList: {
    type: Array as () => UserClass[],
    required: true,
  },
  curMaintainerList: {
    type: Array as () => UserClass[],
    required: false,
  },
});

const selectedUsers = ref<UserClass[]>([]);
const emit = defineEmits(["onSubmitAddMaintainers"]);

watch(
  () => props.curMaintainerList,
  newVal => {
    selectedUsers.value = newVal ?? [];
  }
);

const onSubmit = () => {
  emit("onSubmitAddMaintainers", selectedUsers.value);
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
      관리자 확정
    </v-btn>
  </form>

  <!-- <pre>{{ selectedUsers }}</pre> -->
</template>

<style scoped></style>

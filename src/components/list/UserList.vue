<script setup lang="ts">
import { E_Role, E_UserListType, E_UserStatus } from "@/types/enum.d";
import type { IUserInfo } from "@/types/types";
import { PropType } from "vue";

import { formatDateTime } from "@/utils/common/formatter";
import { ref } from "vue";

const props = defineProps({
  userList: {
    type: Array as () => IUserInfo[],
    required: true,
  },
  tableType: {
    type: String as PropType<E_UserListType>,
    required: false,
  },
});

const headers = ref([
  {
    title: "Email",
    align: "start",

    key: "email",
  },
  { title: "이름", key: "username" },
  { title: "등록 날짜", key: "createdAt" },
  { title: "관리역할 / 계정상태", key: "actions", sortable: false },
] as const);

const checkboxHeader = ref([
  {
    title: "Email",
    align: "start",
    key: "email",
  },
  { title: "이름", key: "username" },
  { title: "역할", key: "role" },
] as const);

const model = defineModel<IUserInfo[]>();
const emit = defineEmits(["onChangeSelectRole", "onChangeUserStatus"]);
</script>

<template>
  <section v-if="tableType === E_UserListType.checkbox">
    <v-data-table
      v-model="model"
      :items-per-page="0"
      :headers="checkboxHeader"
      :items="props.userList"
      :sort-by="[{ key: 'createdAt', order: 'asc' }]"
      show-select
      return-object
    >
      <template #bottom></template>
    </v-data-table>
  </section>

  <section v-else>
    <v-data-table
      :items-per-page="0"
      :headers="headers"
      :items="
        props.userList.map((user) => ({
          ...user,
          createdAt: user.createdAt && formatDateTime(user.createdAt),
        }))
      "
      :sort-by="[{ key: 'createdAt', order: 'asc' }]"
    >
      <template v-slot:item.actions="{ item }">
        <v-select
          v-model="item.role"
          :items="Object.values(E_Role)"
          @update:modelValue="emit('onChangeSelectRole', item.id, item.role)"
          hide-details
        ></v-select>
        <v-select
          v-model="item.userStatus"
          :items="Object.values(E_UserStatus)"
          @update:modelValue="
            emit('onChangeUserStatus', item.id, item.userStatus)
          "
          hide-details
        ></v-select>
      </template>
      <template #bottom></template>
    </v-data-table>
  </section>
</template>

<style scoped></style>

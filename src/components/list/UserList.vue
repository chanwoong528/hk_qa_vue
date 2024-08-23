<script setup lang="ts">
import { E_Role, E_UserListType, E_UserStatus } from "@/types/enum.d";
import type { IUserInfo } from "@/types/types";
import { computed, PropType } from "vue";

import { formatDateTime } from "@/utils/common/formatter";
import { ref } from "vue";

import { userApi } from "@/services/domain/userService";

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

const computedUserList = computed(() => {
  return props.userList.filter((user) => {
    if (!serachUserTerm.value) return user;

    return user.email.includes(serachUserTerm.value) || user.username.includes(serachUserTerm.value);
  });
});

const serachUserTerm = ref<string>("");

const headers = ref([
  {
    title: "Email",
    align: "start",

    key: "email",
  },
  { title: "이름", key: "username" },
  { title: "등록 날짜", key: "createdAt" },
  { title: "관리역할 / 계정상태", key: "actions", sortable: false },
  { title: "인증메일 보내기", key: "verification", sortable: false },
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

const onClickSendVerificationEmail = (email: string) => {
  return userApi
    .POST_sendVerificationEmail(email)
    .then(() => alert("Email Sent!"))
    .catch((err) => alert(err.message));
};

const model = defineModel<IUserInfo[]>();
const emit = defineEmits(["onChangeSelectRole", "onChangeUserStatus"]);
</script>

<template>
  <section v-if="tableType === E_UserListType.checkbox">
    <v-text-field
      class="search-user"
      v-model="serachUserTerm"
      append-inner-icon="mdi mdi-magnify"
      clear-icon="mdi-close-circle"
      label="유저 검색"
      type="text"
      variant="filled"
      clearable
      @click:clear="serachUserTerm = ''"
    >
    </v-text-field>

    <v-data-table
      v-model="model"
      :items-per-page="0"
      :headers="checkboxHeader"
      :items="computedUserList"
      :sort-by="[{ key: 'createdAt', order: 'asc' }]"
      show-select
      return-object
    >
      <template #bottom></template>
    </v-data-table>
  </section>

  <section v-else>
    <v-text-field
      class="serach-user"
      v-model="serachUserTerm"
      append-inner-icon="mdi mdi-magnify"
      clear-icon="mdi-close-circle"
      label="유저 검색"
      type="text"
      variant="filled"
      clearable
      @click:clear="serachUserTerm = ''"
    >
    </v-text-field>
    <v-data-table
      :items-per-page="0"
      :headers="headers"
      :items="
        computedUserList.map((user) => ({
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
        >
        </v-select>
        <v-select
          v-model="item.userStatus"
          :items="Object.values(E_UserStatus)"
          @update:modelValue="emit('onChangeUserStatus', item.id, item.userStatus)"
          hide-details
        ></v-select>
      </template>
      <template v-slot:item.verification="{ item }">
        <v-btn v-if="item.userStatus !== E_UserStatus.ok" @click="onClickSendVerificationEmail(item.email)"
          >인증 메일 보내기
        </v-btn>
        <p v-else>
          인증 완료
          <v-icon color="teal" icon="mdi-check" end></v-icon>
        </p>
      </template>

      <template #bottom></template>
    </v-data-table>
  </section>
</template>

<style scoped>
.serach-user {
  max-width: 400px;
}
</style>

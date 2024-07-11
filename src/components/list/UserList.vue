<script setup lang="ts">
import { E_Role } from "@/types/enum.d";
import type { IUserInfo } from "@/types/types";
import { ref } from "vue";

const props = defineProps({
  userList: {
    type: Array as () => IUserInfo[],
    required: true,
  },
});

const headers = ref([
  {
    title: "Email",
    align: "start",
    sortable: false,
    key: "email",
  },
  { title: "Username", key: "username" },
  { title: "Created Date ", key: "createdAt" },
  { title: "Role", key: "actions", sortable: false },
] as const);
const emit = defineEmits(["onChangeSelectRole"]);
</script>

<template>
  <section>
    <v-data-table
      :headers="headers"
      :items="props.userList"
      :sort-by="[{ key: 'createdAt', order: 'asc' }]"
    >
      <template v-slot:item.actions="{ item }">
        <v-select
          v-model="item.role"
          :items="Object.values(E_Role)"
          @update:modelValue="emit('onChangeSelectRole', item.id, item.role)"
          hide-details
        ></v-select>
      </template>
    </v-data-table>
  </section>
</template>

<style scoped></style>

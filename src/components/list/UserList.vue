<script setup lang="ts">
import type { E_Role } from "@/types/enum.d";
import { ref } from "vue";

const props = defineProps({
  userList: {
    type: Array,
    required: true,
  },
});

// console.log(Object.value(E_Role));

// console.log(Object.keys());

const headers = ref([
  {
    title: "Email",
    align: "start",
    sortable: false,
    key: "email",
  },
  { title: "Role", key: "role" },
  { title: "Username", key: "username" },
  { title: "Created Date ", key: "createdAt" },

  { title: "Actions", key: "actions", sortable: false },
] as const);
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="props.userList"
    :sort-by="[{ key: 'createdAt', order: 'asc' }]"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>User List</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
      </v-toolbar>
    </template>

    <!-- <template v-slot:item.actions="{ item }">
      <v-select :items="" density="compact" label="Compact"></v-select>
    </template> -->

    <!-- <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template> -->
  </v-data-table>
</template>

<style scoped></style>

<script setup lang="ts">
import type { ISwType } from "@/types/types";
import { E_SwTypeListType } from "@/types/enum.d";
import { PropType, ref } from "vue";

const props = defineProps({
  swList: {
    type: Array as () => ISwType[],
  },
  type: {
    type: String as PropType<E_SwTypeListType>,
    required: false,
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
  { title: "Role/Status", key: "actions", sortable: false },
] as const);
</script>

<template>
  <section v-if="type === E_SwTypeListType.section">
    <header>
      <h4>현재 한국일보 서비스 리스트</h4>
    </header>
    <v-row cols="12" md="4">
      <v-col v-for="swItem in props.swList" :key="swItem.swTypeId">
        <v-card
          elevation="16"
          max-width="344"
          append-icon="mdi-open-in-new"
          :to="`/sw-type/${swItem.swTypeId}`"
          link
        >
          <template v-slot:title> {{ swItem.typeTitle }} </template>
          <template v-slot:subtitle> {{ swItem.showStatus }} </template>
          <template v-slot:text>
            {{ swItem.typeDesc }}
          </template>
        </v-card>
      </v-col>
    </v-row>
  </section>
  <section v-else>
    <v-data-table
      :headers="headers"
      :items="props.swList"
      :sort-by="[{ key: 'createdAt', order: 'asc' }]"
    >
    </v-data-table>
  </section>
</template>

<style scoped>
header {
  padding: 10px 0;
}
</style>

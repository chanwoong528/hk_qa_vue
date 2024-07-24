<script setup lang="ts">
import type { ISwType } from "@/types/types";

const props = defineProps({
  swList: {
    type: Array as () => ISwType[],
  },
});
</script>

<template>
  <section>
    <h4>HK Software List</h4>

    <v-row cols="12" md="4">
      <v-col v-for="swItem in props.swList" :key="swItem.swTypeId">
        <v-card>
          <template v-slot:title> {{ swItem.typeTitle }} </template>
          <template v-slot:subtitle> {{ swItem.showStatus }} </template>
          <template v-slot:text>
            {{ swItem.typeDesc }}
          </template>
        </v-card>
      </v-col>
    </v-row>
  </section>
</template>

<style scoped></style>

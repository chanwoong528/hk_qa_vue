<script setup lang="ts">
import DefaultLayout from "@/layout/DefaultLayout.vue";
import { useCounterStore } from "@/store/counterStore";
import { storeToRefs } from "pinia";
const store = useCounterStore();

const { name, count } = storeToRefs(store);
const { increment } = store;
</script>
<template>
  <DefaultLayout>
    <div>
      <h1>About</h1>
      <h2>{{ name }}</h2>
      <h2>{{ count }}</h2>
      <v-btn @click="increment()"> Button </v-btn>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { useCounterStore } from "@/store/counterStore";
import { storeToRefs } from "pinia";
const store = useCounterStore();

const { name, count } = storeToRefs(store);
const { increment } = store;
</script>
<template>
  <div>
    <h1>About</h1>
    <h2>{{ name }}</h2>
    <h2>{{ count }}</h2>
    <v-btn @click="increment()"> Button </v-btn>
  </div>
</template>

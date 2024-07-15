<script setup lang="ts">
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

const testSessionModel = defineModel();

const initialState = {
  testStatus: testSessionModel,
};
const state = reactive({
  ...initialState,
});
const rules = {
  testStatus: { required },
};
const v$ = useVuelidate(rules, state);
</script>
<template>
  <div>
    <v-btn>pass</v-btn>
    <v-btn>failed</v-btn>
    <v-btn>pending</v-btn>
    {{ testSessionModel }}
  </div>
</template>

<style scoped></style>

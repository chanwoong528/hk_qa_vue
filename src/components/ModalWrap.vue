<script setup lang="ts">
defineProps({
  haveBtnCtl: Boolean,
  title: String,
});

const model = defineModel<boolean>();

const emit = defineEmits(["onSubmit"]);

const toggleDialog = () => {
  model.value = !model.value;
  emit("onSubmit");
};
</script>

<template>
  <div class="text-center">
    <v-dialog v-model="model" width="auto">
      <v-card class="mx-auto pa-8" min-width="400">
        <h4 v-if="title" class="pb-8">{{ title }}</h4>
        <slot></slot>
        <template v-slot:actions v-if="!!haveBtnCtl">
          <v-btn class="ms-auto" text="Ok" @click="toggleDialog"></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

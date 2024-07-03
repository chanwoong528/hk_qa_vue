<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps<{
  dialog: boolean;
}>();

const emit = defineEmits(["toggle-dialog"]);
const isOpen = computed(() => props.dialog);
</script>

<template>
  <div class="text-center pa-4">
    <v-dialog v-model="isOpen" width="auto">
      <v-card class="mx-auto pa-8" min-width="400">
        <slot></slot>
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="Ok"
            @click="$emit('toggle-dialog')"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

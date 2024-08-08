<script setup lang="ts">
import { E_ModalType } from "@/types/enum.d";

defineProps({
  haveBtnCtl: Boolean,
  title: String,
  type: String as () => E_ModalType,
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
    <v-dialog
      v-model="model"
      width="100%"
      transition="dialog-bottom-transition"
    >
      <v-card
        class="mx-auto pa-8"
        min-width="500px"
        :width="type === E_ModalType.full ? 'auto' : 'auto'"
      >
        <v-toolbar>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-btn icon="mdi-close" @click="model = false"></v-btn>
        </v-toolbar>
        <slot></slot>
        <template v-slot:actions v-if="!!haveBtnCtl">
          <v-btn class="ms-auto" text="Ok" @click="toggleDialog"></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss">
button[type="submit"] {
  margin-left: auto;
  margin-top: auto;
  min-width: auto;
}
</style>

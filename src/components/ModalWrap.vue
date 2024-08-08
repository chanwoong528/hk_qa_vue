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

const renderModalSizeByModalType = (type?: E_ModalType) => {
  switch (type) {
    case E_ModalType.full:
      return {
        "min-width": "80%",
        width: "auto",
      };

    default:
      return {
        "min-width": "300px",
        width: "auto",
      };
  }
};
</script>

<template>
  <div class="text-center">
    <v-dialog
      v-model="model"
      width="100%"
      transition="dialog-bottom-transition"
    >
      <v-card class="mx-auto" v-bind="renderModalSizeByModalType(type)">
        <v-toolbar>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-btn icon="mdi-close" @click="model = false"></v-btn>
        </v-toolbar>
        <div class="px-8 pb-4">
          <div><slot></slot></div>
        </div>
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

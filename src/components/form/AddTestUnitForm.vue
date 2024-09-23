<script setup lang="ts">
import type { ITestUnit } from "@/types/types.d";

const unitTestListModel = defineModel<Partial<ITestUnit>[]>();
const onClickAddUnit = () => {
  if (!!unitTestListModel.value) unitTestListModel.value.push({ unitDesc: "" });
};

const onInput = (e: Event, idx: number) => {
  const target = e.target as HTMLInputElement;

  if (unitTestListModel.value) unitTestListModel.value[idx].unitDesc = target.value;
};

const onClickDeleteUnit = (idx: number) => {
  unitTestListModel.value?.splice(idx, 1);
};
</script>

<template>
  <section class="unittest-section">
    <header>
      <h4>유닛 테스트 목록</h4>
      <v-btn v-if="unitTestListModel?.length === 0" density="compact" size="x-large" icon @click="onClickAddUnit">
        <v-icon color="green"> mdi-plus </v-icon>
      </v-btn>
    </header>

    <v-text-field
      v-for="(item, idx) in unitTestListModel"
      :key="idx"
      v-model="item.unitDesc"
      @input="(e: Event) => onInput(e, idx)"
    >
      <template v-slot:append>
        <v-btn
          :key="idx"
          v-if="idx === (unitTestListModel?.length ?? 0) - 1"
          density="compact"
          size="x-large"
          icon
          @click="onClickAddUnit"
        >
          <v-icon color="green"> mdi-plus </v-icon>
        </v-btn>
      </template>
      <template v-slot:prepend>
        <v-btn density="compact" size="x-large" icon @click="onClickDeleteUnit(idx)">
          <v-icon color="red"> mdi-minus </v-icon>
        </v-btn>
      </template>
    </v-text-field>
  </section>
</template>

<style scoped lang="scss">
.unittest-section {
  header {
    display: flex;
    gap: 10px;
    align-items: center;
  }
}
</style>

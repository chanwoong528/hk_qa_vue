<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  boardList: {
    type: Array as () => any[],
    required: true,
  },
});

const computedBoardList = computed(() => {
  return props.boardList.filter((board) => board.boardType === "update");
});
</script>
<template>
  <div>업데이트 목록</div>

  {{ computedBoardList }}
</template>

<style scoped></style>

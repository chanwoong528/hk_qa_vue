<script setup lang="ts">
import BoardClass from "@/entity/Board";
import { computed } from "vue";

const props = defineProps({
  boardList: {
    type: Array as () => any[],
    required: true,
  },
  curTab: {
    type: String,
    required: false,
  },
});

const computedBoardList = computed(() => {
  return props.boardList.map((board) => new BoardClass(board));
});
</script>
<template>
  <v-list lines="two">
    <v-list-item
      v-for="board in computedBoardList"
      :key="board.boardId"
      :title="board.title"
      link
      :to="`/board/${board.boardId}`"
    >
      <v-list-item-subtitle>
        <span>
          {{ board.user.username }}
        </span>
        <span>
          {{ board.formatDate() }}
        </span>
      </v-list-item-subtitle>
    </v-list-item>
  </v-list>
</template>

<style scoped></style>

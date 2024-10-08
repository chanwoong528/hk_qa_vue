<script setup lang="ts">
import { E_ReactionType } from "@/types/enum.d";
import { renderIconForReaction } from "@/utils/common/formatter";
const props = defineProps({
  isActivated: Boolean,
});

const emit = defineEmits(["onClickReactionBtn"]);
const REACT_BTN_LIST: { type: E_ReactionType; icon: string; color: string }[] =
  [
    {
      type: E_ReactionType.check,
      icon: renderIconForReaction(E_ReactionType.check).icon,
      color: renderIconForReaction(E_ReactionType.check).color,
    },
    {
      type: E_ReactionType.stop,
      icon: renderIconForReaction(E_ReactionType.stop).icon,
      color: renderIconForReaction(E_ReactionType.stop).color,
    },
    {
      type: E_ReactionType.like,
      icon: renderIconForReaction(E_ReactionType.like).icon,
      color: renderIconForReaction(E_ReactionType.like).color,
    },
    {
      type: E_ReactionType.wow,
      icon: renderIconForReaction(E_ReactionType.wow).icon,
      color: renderIconForReaction(E_ReactionType.wow).color,
    },
  ];
const onClickReactionBtn = (btnType: E_ReactionType) => {
  emit("onClickReactionBtn", btnType);
};
</script>

<template>
  <div class="reaction-btn-con" :class="!!props.isActivated ? ' on' : ''">
    <v-btn v-for="btn in REACT_BTN_LIST" :key="btn.icon" icon size="x-small" @click="onClickReactionBtn(btn.type)">
      <v-icon :icon="btn.icon" :color="btn.color"></v-icon>
    </v-btn>
  </div>
</template>

<style scoped lang="scss">
.reaction-btn-con {
  display: flex;
  gap: 4px;
  position: absolute;
  top: 10px;
  left: 0;
  padding-inline: 16px;
  transition: transform 0.3s, opacity 0.3s;
  pointer-events: none;
  opacity: 0;

  &.on {
    transform: translateY(-50%);
    z-index: 1;
    opacity: 1;
    pointer-events: auto;
  }
}
</style>

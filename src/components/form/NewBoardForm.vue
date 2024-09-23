<script setup lang="ts">
import BoardClass from "@/entity/Board";
import { useUserStore } from "@/store/userStore";
import useVuelidate from "@vuelidate/core";
import { helpers } from "@vuelidate/validators";
import { reactive, ref } from "vue";

import { E_BoardType, E_Role } from "@/types/enum.d";

const isEditorFocused = ref<boolean>(false);
const userStore = useUserStore();
const { loggedInUser } = userStore;

const emit = defineEmits(["onSubmitNewBoard"]);

const initialState = new BoardClass();
const state = reactive({
  ...initialState,
});

const rules = {
  title: {
    required: helpers.withMessage("Title is required", (value: string) => !!value),
  },
  content: {
    required: helpers.withMessage("Content is required", (value: string) => !!value),
  },
};
const v$ = useVuelidate(rules, state);

const boardTypeLabel = ["업데이트", "요청"];

const convertBoardTypeLabel = (typeLabel: string) => {
  switch (typeLabel) {
    case "업데이트":
      return E_BoardType.update;
    case "요청":
      return E_BoardType.req;
    default:
      return E_BoardType.req;
  }
};

const onFocusEditorCon = (clickedCon: boolean) => {
  isEditorFocused.value = clickedCon;
};
const onBlurEditorCon = (isFocusOut: boolean) => {
  if (!!isFocusOut && isEditorFocused.value) {
    isEditorFocused.value = false;
  }
};

const onSubmit = () => {
  if (!!v$.value.$errors.map((e) => e.$message).join(", ")) return;

  const boardParam = {
    ...state,
    boardType: convertBoardTypeLabel(state.boardType),
  };
  emit("onSubmitNewBoard", boardParam);
};
</script>

<template>
  <form @submit.prevent="">
    <div class="boardtype-con">
      <v-select
        v-if="loggedInUser?.role !== E_Role.tester"
        v-model="state.boardType"
        label="게시판 타입"
        :items="boardTypeLabel"
        hide-details
        max-width="200"
      >
      </v-select>
    </div>

    <v-text-field
      :error-messages="v$.title.$errors.map((e) => e.$message).join(', ')"
      placeholder="제목"
      variant="outlined"
      @blur="v$.title.$touch"
      @input="v$.title.$touch"
      v-model="state.title"
    />
    <div
      :class="{ focus: isEditorFocused }"
      class="editor-con"
      :tabindex="0"
      @focus="onFocusEditorCon(true)"
      @click="onFocusEditorCon(true)"
    >
      <p>
        <v-icon icon="mdi-text-box-multiple-outline"></v-icon>
        게시글 내용
      </p>
      <RichEditor
        v-model="state.content"
        placeHolder="게시글 내용"
        :isEditorFocused="isEditorFocused"
        @onBlurEditorCon="onBlurEditorCon"
      />
    </div>
    <v-btn
      color="blue"
      size="large"
      variant="tonal"
      block
      type="submit"
      @click="
        {
          v$.$validate();
          onSubmit();
        }
      "
    >
      게시글 작성
    </v-btn>
  </form>
</template>

<style scoped lang="scss">
form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 0;
}
.editor-con {
  border: 1px solid #9d9d9d;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  min-height: 300px;

  &.focus {
    border: 2px solid #212121;
  }

  p {
    padding: 8px 0 8px 12px;
  }
}
.boardtype-con {
  display: flex;
  align-items: center;
  gap: 20px;

  p {
    padding: 8px 0 8px 12px;
  }
}
</style>

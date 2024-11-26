<script setup lang="ts">
import { PropType, ref, watch, onMounted, onBeforeUnmount } from "vue";
import Quill from "quill";

import ImageCompress from "quill-image-compress";
import QuillResizeImage from "quill-resize-image";
import QuillImageDropAndPaste from "quill-image-drop-and-paste";

import MagicUrl from "quill-magic-url";

import { E_EditorType } from "@/types/enum.d";

Quill.register("modules/magicUrl", MagicUrl);
Quill.register("modules/imageCompress", ImageCompress);
Quill.register("modules/imageDropAndPaste", QuillImageDropAndPaste);
Quill.register("modules/resizeImage", QuillResizeImage);

const props = defineProps({
  editorType: {
    type: String as PropType<E_EditorType>,
    required: false,
  },
  isEditorFocused: {
    type: Boolean,
    required: false,
  },
  placeHolder: {
    type: String,
  },
});

const quillEditor = ref(null);
let quillInstance: Quill | null = null;

onMounted(() => {
  quillInstance = new Quill(quillEditor.value!, {
    theme: "snow", // Quill의 Snow 테마 사용
    placeholder: !!props.placeHolder ? props.placeHolder : "Write something...",

    modules: {
      toolbar: {
        container: [
          ["bold", "italic", "underline"], // 텍스트 서식 툴
          [{ list: "ordered" }, { list: "bullet" }], // 목록 툴
          ["link", "image"], // 링크와 이미지 툴
        ],
        handler: {
          // link: function (value: any) {
          //   console.log(value)
          // }
        },
      },
      imageDropAndPaste: {
        // add an custom image handler
        handler: () => {
          //do nothing
          return;
        },
      },
      magicUrl: true,
      imageCompress: {
        quality: 0.9, // default
        maxWidth: 1200, // default
        maxHeight: 1200, // default
        imageType: "image/jpeg", // default
        debug: process.env.NODE_ENV === "dev",
        handleOnPaste: true, //default
      },
      resizeImage: {
        displaySize: true,
      },
    },
  });

  quillInstance.root.innerHTML = modelValue.value!;

  // Quill 텍스트 변경 시 이벤트 처리
  quillInstance.on("text-change", () => {
    // console.log('Content:', (quillInstance as Quill).root.innerHTML);
    modelValue.value = (quillInstance as Quill).root.innerHTML;
  });

  // blur handler
  quillInstance.on("selection-change", range => {
    if (range === null) onBlur();
  });
});

// 컴포넌트가 제거되기 전에 Quill 인스턴스를 정리
onBeforeUnmount(() => {
  quillInstance = null;
});

const modelValue = defineModel<string>();

const editorRef = ref(null);

watch(
  () => modelValue.value,
  newVal => {
    let regex = /(<([^>]+)>)/gi;
    let isValEmpty = newVal?.replace(regex, "").length === 0;
    if (isValEmpty && editorRef.value) {
      return (editorRef.value as any).setHTML("");
    }
  }
);
// watch(
//   () => props.isEditorFocused,
//   (newVal) => {
//     if (!!newVal && !!quillInstance) {
//       // (editorRef.value as any).focus();
//       // quillInstance?.focus();
//     }
//   },
// );
const emit = defineEmits(["onBlurEditorCon"]);

const onBlur = () => {
  emit("onBlurEditorCon", true);
};

import "quill/dist/quill.snow.css";
</script>

<template>
  <div class="editor-wrap" @blur="onBlur">
    <div
      ref="quillEditor"
      class="quill-editor"
      :class="
        props.editorType === E_EditorType.comment
          ? !!props.isEditorFocused
            ? ' focused comment-editor'
            : ' comment-editor'
          : ''
      "
    />
  </div>
</template>

<style lang="scss">
.hide--toolbar {
  display: flex;
  flex-direction: column;
}
.editor-con {
  display: flex;
  flex-direction: column;
  border: 1px solid #666;
}
.editor-wrap {
  // position: relative;

  .ql-toolbar.ql-snow {
    border: none;
    z-index: 2;
    padding: 3px;
    box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.14);
  }

  .ql-container.ql-snow {
    border: none;

    .ql-editor {
      height: 100%;
    }
  }

  &.comment-editor {
    border-bottom: 1px solid #999;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

    &.focused {
      .ql-container.ql-snow {
        border-bottom: 2px solid black;
      }
    }

    // .ql-toolbar.ql-snow {
    // }
  }
}
.comment-btn-con {
}

.comment-list-con {
  margin-top: 20px;
  border-top: 1px solid #ddd;
  .v-list {
    padding-top: 0;
  }
  .v-card {
    border: none;
    border-bottom: 1px solid #ddd;
    border-radius: 0;
  }
  .v-card--variant-tonal {
    background: #f7f7f7;
    .v-card-item {
      position: relative;
      &:after {
        content: "";
        position: absolute;
        width: calc(100% - 20px);
        height: 1px;
        left: 10px;
        //border-bottom:1px dashed #ddd;
        bottom: 0;
      }
    }
    .v-card-text {
      padding-top: 10px;
    }

    .v-card__underlay {
      opacity: 0;
    }
  }
  .v-card--variant-outlined {
    .v-card-item {
      position: relative;
      padding: 8px 12px;
      &:after {
        content: "";
        position: absolute;
        width: calc(100% - 20px);
        height: 1px;
        left: 10px;
        //border-bottom:1px dashed #ddd;
        bottom: 0;
      }
    }
    .v-card-text {
      padding-top: 10px;
    }
  }
}
</style>

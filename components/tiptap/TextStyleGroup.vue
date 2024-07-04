<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

withDefaults(
  defineProps<{
    tiptapEditor: Editor
    fullOption?: boolean
  }>(),
  {
    fullOption: false,
  },
)

const selectColor = (editor: any) => {
  const selectionColor = editor.getAttributes('textStyle').color
  if (selectionColor) {
    return selectionColor
  }
}
</script>

<template>
  <DGPopover
    mode="hover"
    :popper="{ placement: 'top-start', offsetDistance: 0 }"
  >
    <AButton
      use-leading
      button-size="sm"
      icon-name="ri:palette-line"
      :icon-size="14"
    />
    <template #panel>
      <div class="flex gap-1 p-0.5">
        <TiptapEditColorInput
          :color-value="tiptapEditor ? selectColor(tiptapEditor) : null"
          :tiptap-editor="tiptapEditor"
          :tooltip-text="$t('tiptap.colors')"
        />
        <TiptapEditNormalButtons
          :is-active="tiptapEditor.isActive('bold')"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().toggleBold().run() : null"
          icon-type="ri:bold"
          :tooltip-text="$t('tiptap.bold')"
        />
        <TiptapEditNormalButtons
          v-if="fullOption"
          :is-active="tiptapEditor.isActive('italic')"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().toggleItalic().run() : null"
          icon-type="ri:italic"
          :tooltip-text="$t('tiptap.italic')"
        />
      </div>
    </template>
  </DGPopover>
</template>

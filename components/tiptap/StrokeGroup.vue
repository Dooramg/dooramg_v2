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
</script>

<template>
  <DGPopover
    mode="hover"
    :popper="{ placement: 'top-start', offsetDistance: 0 }"
  >
    <AButton
      use-leading
      button-size="sm"
      icon-name="ri:quill-pen-line"
      :icon-size="14"
    />
    <template #panel>
      <div class="flex gap-1 p-0.5">
        <TiptapEditNormalButtons
          :is-active="tiptapEditor.isActive('underline')"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().toggleUnderline().run() : null"
          icon-type="ri:underline"
          :tooltip-text="$t('tiptap.underline')"
        />
        <TiptapEditNormalButtons
          :is-active="tiptapEditor.isActive('strike')"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().toggleStrike().run() : null"
          icon-type="ri:strikethrough-2"
          :tooltip-text="$t('tiptap.strikethrough')"
        />
        <TiptapEditNormalButtons
          v-if="fullOption"
          :is-active="tiptapEditor.isActive('highlight')"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().toggleHighlight().run() : null"
          icon-type="ri:mark-pen-fill"
          :tooltip-text="$t('tiptap.marker1')"
        />
        <TiptapEditNormalButtons
          :is-active="tiptapEditor.isActive('highlight', { color: '#ffc078' })"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().toggleHighlight({ color: '#ffc078' }).run() : null"
          icon-type="ri:mark-pen-line"
          :tooltip-text="$t('tiptap.marker2')"
        />
      </div>
    </template>
  </DGPopover>
</template>

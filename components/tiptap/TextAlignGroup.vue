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
    v-if="fullOption"
    mode="click"
    :popper="{ placement: 'top-start', offsetDistance: 0 }"
  >
    <AButton
      use-leading
      button-size="sm"
      icon-name="ri:menu-add-line"
      :icon-size="14"
    />
    <template #panel>
      <div class="flex gap-1 p-0.5">
        <TiptapEditNormalButtons
          :is-active="tiptapEditor.isActive({ textAlign: 'left' })"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().setTextAlign('left').run() : null"
          icon-type="ri:align-left"
          :tooltip-text="$t('tiptap.alignLeft')"
        />
        <TiptapEditNormalButtons
          :is-active="tiptapEditor.isActive({ textAlign: 'center' })"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().setTextAlign('center').run() : null"
          icon-type="ri:align-center"
          :tooltip-text="$t('tiptap.alignCenter')"
        />
        <TiptapEditNormalButtons
          :is-active="tiptapEditor.isActive({ textAlign: 'right' })"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().setTextAlign('right').run() : null"
          icon-type="ri:align-right"
          :tooltip-text="$t('tiptap.alignRight')"
        />
        <TiptapEditNormalButtons
          :is-active="tiptapEditor.isActive({ textAlign: 'justify' })"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().setTextAlign('justify').run() : null"
          icon-type="ri:align-justify"
          :tooltip-text="$t('tiptap.alignJustify')"
        />
      </div>
    </template>
  </DGPopover>
</template>

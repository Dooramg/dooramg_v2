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
      icon-name="ri:heading"
      :icon-size="14"
    />
    <template #panel>
      <div class="flex gap-1 p-0.5">
        <TiptapEditNormalButtons
          :is-active="tiptapEditor.isActive('heading', { level: 1 })"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().toggleHeading({ level: 1 }).run() : null"
          icon-type="ri:h-1"
          :tooltip-text="$t('tiptap.h1')"
        />
        <TiptapEditNormalButtons
          :is-active="tiptapEditor.isActive('heading', { level: 2 })"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().toggleHeading({ level: 2 }).run() : null"
          icon-type="ri:h-2"
          :tooltip-text="$t('tiptap.h2')"
        />
        <TiptapEditNormalButtons
          :is-active="tiptapEditor.isActive('heading', { level: 3 })"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().toggleHeading({ level: 3 }).run() : null"
          icon-type="ri:h-3"
          :tooltip-text="$t('tiptap.h3')"
        />
        <TiptapEditNormalButtons
          :is-active="tiptapEditor.isActive('heading', { level: 4 })"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().toggleHeading({ level: 4 }).run() : null"
          icon-type="ri:h-4"
          :tooltip-text="$t('tiptap.h4')"
        />
        <TiptapEditNormalButtons
          :is-active="tiptapEditor.isActive('heading', { level: 5 })"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().toggleHeading({ level: 5 }).run() : null"
          icon-type="ri:h-5"
          :tooltip-text="$t('tiptap.h5')"
        />
        <TiptapEditNormalButtons
          :editor="tiptapEditor"
          :is-active="tiptapEditor.isActive('heading', { level: 6 })"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().toggleHeading({ level: 6 }).run() : null"
          icon-type="ri:h-6"
          :tooltip-text="$t('tiptap.h6')"
        />
      </div>
    </template>
  </DGPopover>
</template>

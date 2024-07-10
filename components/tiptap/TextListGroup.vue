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
    mode="hover"
    :popper="{ placement: 'top-start', offsetDistance: 0 }"
  >
    <AButton
      use-leading
      button-size="sm"
      icon-name="ri:list-settings-line"
      :icon-size="14"
    />
    <template #panel>
      <div class="flex gap-1 p-0.5">
        <TiptapEditNormalButtons
          :is-active="tiptapEditor.isActive('bulletList')"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().toggleBulletList().run() : null"
          icon-type="ri:list-unordered"
          :tooltip-text="$t('tiptap.dotList')"
        />
        <TiptapEditNormalButtons
          :is-active="tiptapEditor.isActive('orderedList')"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().toggleOrderedList().run() : null"
          icon-type="ri:list-ordered"
          :tooltip-text="$t('tiptap.list')"
        />
        <TiptapEditNormalButtons
          :is-active="tiptapEditor.isActive('taskList')"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().toggleTaskList().run() : null"
          icon-type="ri:task-line"
          :tooltip-text="$t('tiptap.tasks')"
        />
        <TiptapEditNormalButtons
          :is-active="tiptapEditor.isActive('blockquote')"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().toggleBlockquote().run() : null"
          icon-type="ri:double-quotes-l"
          :tooltip-text="$t('tiptap.quotes')"
        />
      </div>
    </template>
  </DGPopover>
</template>

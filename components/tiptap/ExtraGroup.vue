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
    mode="click"
    :popper="{ placement: 'top-start', offsetDistance: 0 }"
  >
    <AButton
      use-leading
      button-size="sm"
      icon-name="ri:more-line"
      :icon-size="14"
    />
    <template #panel>
      <div class="flex gap-1 p-0.5">
        <TiptapEditSpecialButtons
          v-if="fullOption"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().setHorizontalRule().run() : null"
          icon-type="ri:separator"
          :tooltip-text="$t('tiptap.separator')"
        />
        <TiptapEditNormalButtons
          :is-active="false"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().setHardBreak().run() : null"
          icon-type="ri:corner-down-left-line"
          :tooltip-text="$t('tiptap.moreLine')"
        />
        <TiptapEditNormalButtons
          :is-active="tiptapEditor.isActive('code')"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().toggleCode().run() : null"
          icon-type="ri:code-box-line"
          :tooltip-text="$t('tiptap.code')"
        />
        <TiptapEditSpecialButtons
          v-if="fullOption"
          :disabled="!tiptapEditor.can().chain().focus().undo().run()"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().undo().run() : null"
          icon-type="ri:arrow-go-back-line"
          :tooltip-text="$t('tiptap.goBack')"
        />
        <TiptapEditSpecialButtons
          v-if="fullOption"
          :disabled="!tiptapEditor.can().chain().focus().redo().run()"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().redo().run() : null"
          icon-type="ri:arrow-go-forward-line"
          :tooltip-text="$t('tiptap.goForward')"
        />
      </div>
    </template>
  </DGPopover>
</template>

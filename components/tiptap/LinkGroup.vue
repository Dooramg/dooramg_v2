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

const emits = defineEmits([
  'open:hyper-link',
  'open:youtube-link',
])
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
      icon-name="ri:cloud-line"
      :icon-size="14"
    />
    <template #panel>
      <div class="flex gap-1 p-0.5">
        <TiptapEditNormalButtons
          :is-active="tiptapEditor.isActive('link')"
          :action="() => tiptapEditor ? emits('open:hyper-link') : null"
          icon-type="ri:link"
          :tooltip-text="$t('tiptap.link')"
        />
        <TiptapEditNormalButtons
          :is-active="tiptapEditor.isActive('link')"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().unsetLink().run() : null"
          icon-type="ri:link-unlink"
          :tooltip-text="$t('tiptap.unlink')"
        />
        <TiptapEditNormalButtons
          :is-active="false"
          :action="() => tiptapEditor ? emits('open:youtube-link') : null"
          icon-type="ri:youtube-line"
          :tooltip-text="$t('tiptap.youtube')"
        />
      </div>
    </template>
  </DGPopover>
</template>

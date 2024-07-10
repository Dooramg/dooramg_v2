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
      icon-name="ri:font-family"
      :icon-size="14"
    />
    <template #panel>
      <div class="flex gap-1 p-0.5">
        <TiptapEditTextButtons
          :is-active="tiptapEditor.isActive('textStyle', { fontFamily: 'Pretendard' })"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().setFontFamily('Pretendard').run() : null"
          font-family-name="Pretendard"
          :text="$t('tiptap.pretendard')"
        />
        <TiptapEditTextButtons
          :is-active="tiptapEditor.isActive('textStyle', { fontFamily: 'DungGeunMo' })"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().setFontFamily('DungGeunMo').run() : null"
          font-family-name="DungGeunMo"
          :text="$t('tiptap.dungGeunMo')"
        />
        <TiptapEditTextButtons
          :is-active="tiptapEditor.isActive('textStyle', { fontFamily: 'Shilla_CultureB-Bold' })"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().setFontFamily('Shilla_CultureB-Bold').run() : null"
          font-family-name="Shilla_CultureB-Bold"
          :text="$t('tiptap.shillaCulture')"
        />
        <TiptapEditTextButtons
          :is-active="tiptapEditor.isActive('textStyle', { fontFamily: 'EliceDigitalBaeum_Bold' })"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().setFontFamily('EliceDigitalBaeum_Bold').run() : null"
          font-family-name="EliceDigitalBaeum_Bold"
          :text="$t('tiptap.eliceDigital')"
        />
        <TiptapEditTextButtons
          :is-active="tiptapEditor.isActive('textStyle', { fontFamily: 'KOTRAHOPE' })"
          :action="() => tiptapEditor ? tiptapEditor.chain().focus().setFontFamily('KOTRAHOPE').run() : null"
          font-family-name="KOTRAHOPE"
          :text="$t('tiptap.kotraHope')"
        />
      </div>
    </template>
  </DGPopover>
</template>

<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

const props = withDefaults(
  defineProps<{
    colorValue?: string
    tiptapEditor: Editor
    tooltipText?: string
  }>(),
  {
    colorValue: '#ffffff',
    tooltipText: '',
  },
)

const localColorValue = ref(props.colorValue)

const imageColor = (event: Event) => {
  const target = event.target as HTMLButtonElement
  let color = ''
  target
    ? color = target.value
    : color = ''
  return color
}
</script>

<template>
  <DGTooltip
    :text="tooltipText"
    placement="bottom"
  >
    <DGInput
      v-model="localColorValue"
      type="color"
      @input="tiptapEditor.chain().focus().setColor(imageColor($event)).run()"
    />
  </DGTooltip>
</template>

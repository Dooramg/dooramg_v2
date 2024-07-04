<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    isActive: boolean
    action: () => void
    fontFamilyName?: string
    text?: string
  }>(),
  {
    fontFamilyName: '',
    text: '',
  },
)

const emits = defineEmits([
  'select-button',
])

const clickAction = () => {
  props.action()
  emits('select-button')
}
</script>

<template>
  <DGTooltip
    :text="text"
    placement="bottom"
  >
    <AButton
      button-size="sm"
      :style="{ fontFamily: fontFamilyName }"
      :button-text="text"
      @click="clickAction"
    />
  </DGTooltip>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    iconType: string
    action: () => void
    disabled?: boolean
    tooltipText?: string
  }>(),
  {
    disabled: false,
    tooltipText: '',
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
    :text="tooltipText"
    placement="bottom"
  >
    <AButton
      use-leading
      button-size="sm"
      :icon-name="iconType"
      :icon-size="14"
      @click="clickAction"
    />
  </DGTooltip>
</template>

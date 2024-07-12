<script setup lang="ts">
import type { ButtonSize, ButtonVariant } from '#ui/types'

withDefaults(
  defineProps<{
    customClass?: string
    roundButton?: boolean
    buttonDisabled?: boolean
    buttonPadding?: boolean
    buttonBlock?: boolean
    buttonTruncate?: boolean
    buttonColor?: string
    buttonType?: 'button' | 'submit' | 'reset'
    buttonSize?: ButtonSize | undefined
    buttonVariant?: ButtonVariant | undefined
    useLeading?: boolean
    iconName?: string
    iconSize?: number
    buttonText?: string
    tooltipText?: string
    shortcutsText?: Array<string>
  }>(),
  {
    customClass: '',
    roundButton: false,
    buttonDisabled: false,
    buttonPadding: true,
    buttonBlock: false,
    buttonTruncate: false,
    buttonColor: 'gray',
    buttonSize: 'md',
    buttonType: 'button',
    buttonVariant: 'solid',
    useLeading: false,
    iconName: '',
    iconSize: 24,
    buttonText: '',
    tooltipText: '',
    shortcutsText: () => [],
  },
)

defineEmits([
  'mouseenter:button',
  'mouseleave:button',
])
</script>

<template>
  <DGTooltip
    :text="tooltipText ? tooltipText : buttonText"
    :shortcuts="shortcutsText"
    :ui="{ wrapper: customClass, base: !tooltipText && !buttonText ? 'hidden' : '[@media(pointer:coarse)]:hidden h-6 px-2 py-1 text-xs font-normal truncate relative' }"
  >
    <DGButton
      :class="customClass"
      :ui="roundButton ? { rounded: 'rounded-full' } : {}"
      :disabled="buttonDisabled"
      :block="buttonBlock"
      :truncate="buttonTruncate"
      :padded="buttonPadding"
      :color="buttonColor"
      :size="buttonSize"
      :type="buttonType"
      :variant="buttonVariant"
      :label="!tooltipText ? buttonText : ''"
      :aria-label="buttonText"
      @mouseenter="$emit('mouseenter:button')"
      @mouseleave="$emit('mouseleave:button')"
    >
      <template
        v-if="useLeading"
        #leading
      >
        <Icon
          v-if="iconName"
          :name="iconName"
          :width="iconSize"
          :height="iconSize"
        />
      </template>
    </DGButton>
  </DGTooltip>
</template>

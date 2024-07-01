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
    buttonSize?: ButtonSize | undefined
    buttonVariant?: ButtonVariant | undefined
    useLeading?: boolean
    iconName?: string
    iconSize?: number
    buttonText?: string
  }>(),
  {
    customClass: '',
    roundButton: false,
    buttonDisabled: false,
    buttonPadding: true,
    buttonBlock: false,
    buttonTruncate: false,
    buttonColor: 'amber',
    buttonSize: 'md',
    buttonVariant: 'solid',
    useLeading: false,
    iconName: '',
    iconSize: 24,
    buttonText: '',
  },
)

defineEmits([
  'mouseenter:button',
  'mouseleave:button',
])
</script>

<template>
  <DGButton
    :class="customClass"
    :ui="roundButton ? { rounded: 'rounded-full' } : {}"
    :disabled="buttonDisabled"
    :block="buttonBlock"
    :truncate="buttonTruncate"
    :padded="buttonPadding"
    :color="buttonColor"
    :size="buttonSize"
    :variant="buttonVariant"
    :label="buttonText"
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
</template>

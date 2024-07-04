<script setup lang="ts">
import type { ButtonSize, ButtonVariant } from '#ui/types'

const props = withDefaults(
  defineProps<{
    inputClass?: string
    inputColor?: string
    inputSize?: string
    inputPlaceholder?: string
    useLeading?: boolean
    clearable?: boolean
    useTrailing?: boolean
    leadingIconName?: string
    iconSize?: number
    trailingButtonSize?: ButtonSize | undefined
    trailingButtonVariant?: ButtonVariant | undefined
  }>(),
  {
    inputClass: '',
    inputColor: 'amber',
    inputSize: 'md',
    inputPlaceholder: '',
    useLeading: false,
    clearable: false,
    useTrailing: false,
    leadingIconName: '',
    iconSize: 24,
    trailingButtonSize: 'sm',
    trailingButtonVariant: 'soft',
  },
)

defineEmits([
  'click:trailing',
])

const inputData = defineModel('inputData', {
  type: String,
  default: '',
})

const switchInputUi = () => {
  const trailingUi = props.clearable || props.useTrailing

  const uiConfig = {
    icon: {
      trailing: trailingUi ? { pointer: '' } : {},
    },
  }

  return trailingUi ? uiConfig : {}
}
</script>

<template>
  <DGInput
    v-model="inputData"
    :class="inputClass"
    :color="inputColor"
    :size="inputSize"
    :placeholder="inputPlaceholder"
    :ui="switchInputUi()"
  >
    <template
      v-if="useLeading"
      #leading
    >
      <Icon
        v-if="leadingIconName"
        :name="leadingIconName"
        :size="`${iconSize}`"
      />
    </template>
    <template
      v-if="clearable || useTrailing"
      #trailing
    >
      <AButton
        v-if="useTrailing"
        :button-size="trailingButtonSize"
        button-variant="ghost"
        :button-padding="false"
        use-leading
        icon-name="i-line-md-search"
        @click="$emit('click:trailing')"
      />
      <AButton
        v-if="clearable"
        v-show="inputData"
        button-variant="ghost"
        :button-padding="false"
        use-leading
        icon-name="line-md:menu-to-close-alt-transition"
        @click="() => inputData = ''"
      />
    </template>
  </DGInput>
</template>

<script setup lang="ts">
import type { InputSize, ButtonSize, ButtonVariant } from '#ui/types'

const props = withDefaults(
  defineProps<{
    inputClass?: string
    inputColor?: string
    inputType?: string
    inputSize?: InputSize | undefined
    inputPlaceholder?: string
    inputDisabled?: boolean
    useLeading?: boolean
    clearable?: boolean
    useTrailing?: boolean
    useTrailingText?: boolean
    leadingIconName?: string
    iconSize?: number
    trailingButtonSize?: ButtonSize | undefined
    trailingButtonVariant?: ButtonVariant | undefined
    trailingText?: string
  }>(),
  {
    inputClass: '',
    inputColor: 'amber',
    inputType: 'text',
    inputSize: 'md',
    inputPlaceholder: '',
    inputDisabled: false,
    useLeading: false,
    clearable: false,
    useTrailing: false,
    useTrailingText: false,
    leadingIconName: '',
    iconSize: 24,
    trailingButtonSize: 'sm',
    trailingButtonVariant: 'soft',
    trailingText: '',
  },
)

const emit = defineEmits([
  'click:trailing',
  'click:clear',
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

const clickClear = () => {
  inputData.value = ''
  emit('click:clear')
}
</script>

<template>
  <DGInput
    v-model="inputData"
    :class="inputClass"
    :color="inputColor"
    :size="inputSize"
    :type="inputType"
    :placeholder="inputPlaceholder"
    :disabled="inputDisabled"
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
      v-if="clearable || useTrailing || useTrailingText"
      #trailing
    >
      <div class="flex gap-2">
        <div class="flex items-center gap-2">
          <AButton
            v-if="useTrailing"
            :button-size="trailingButtonSize"
            button-variant="ghost"
            button-padding
            use-leading
            :tooltip-text="$t('buttons.search')"
            icon-name="i-line-md-search"
            @click="() => $emit('click:trailing')"
          />
          <span class="text-lg text-neutral-500 dark:text-neutral-400">
            {{ trailingText }}
          </span>
          <AButton
            v-if="clearable"
            v-show="inputData"
            button-variant="ghost"
            :button-padding="false"
            use-leading
            icon-name="line-md:menu-to-close-alt-transition"
            @click="clickClear"
          />
        </div>
      </div>
    </template>
  </DGInput>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    customClass?: string
    top?: string
    width?: string
    title?: string
    titleClass?: string
    hideFirstButton?: boolean
    hideSecondButton?: boolean
    firstButtonText?: string
    secondButtonText?: string
  }>(),
  {
    customClass: '',
    top: '36vh',
    width: '400px',
    title: '',
    titleClass: '',
    hideFirstButton: false,
    hideSecondButton: false,
    firstButtonText: '',
    secondButtonText: '',
  },
)

const emits = defineEmits([
  'click:first-button',
  'click:second-button',
  'close',
])

const dialogTrigger = defineModel('dialogTrigger', {
  type: Boolean,
  default: false,
})
</script>

<template>
  <ADialog
    :dialog-trigger="dialogTrigger"
    :custom-class="customClass"
    :title="title"
    :dialog-title-class="titleClass"
    :double-first-text="firstButtonText"
    :double-second-text="secondButtonText"
    @click:first-button="emits('click:first-button')"
    @click:second-button="emits('click:second-button')"
    @close="emits('close')"
  >
    <slot />
  </ADialog>
</template>

<script setup lang="ts">
const modalTrigger = ref(false)

const props = withDefaults(
  defineProps<{
    dialogTrigger?: boolean
    fullScreen?: boolean
    preventClose?: boolean
    dialogTitleClass?: string
    title?: string
    doubleFirstText?: string
    doubleSecondText?: string
    hideDoubleButton?: boolean
    hideFirstButton?: boolean
    hideSecondButton?: boolean
    disableFirstButton?: boolean
  }>(),
  {
    dialogTrigger: false,
    fullScreen: false,
    preventClose: false,
    dialogTitleClass: '',
    title: '',
    doubleFirstText: '',
    doubleSecondText: '',
    hideDoubleButton: false,
    hideFirstButton: false,
    hideSecondButton: false,
    disableFirstButton: false,
  },
)

const emits = defineEmits([
  'close',
  'click:first-button',
  'click:second-button',
])

watch(() => props.dialogTrigger, (value) => {
  modalTrigger.value = value
}, { immediate: true })

watch(() => modalTrigger.value, (value) => {
  if (!value) {
    emits('close')
  }
}, { immediate: true })
</script>

<template>
  <DGModal
    v-model="modalTrigger"
    :fullscreen="fullScreen"
    overlay
    :prevent-close="preventClose"
  >
    <DGCard :ui="{ divide: 'divide-amber-500 dark:divide-amber-400', background: 'bg-stone-100/60 dark:bg-neutral-900' }">
      <template #header>
        <div
          v-if="title"
          class="flex items-center justify-between"
        >
          <span :class="dialogTitleClass">
            {{ title }}
          </span>
          <AButton
            button-variant="ghost"
            use-leading
            icon-name="line-md:menu-to-close-alt-transition"
            @click="modalTrigger = false"
          />
        </div>
      </template>
      <slot />
      <template
        v-if="!hideDoubleButton"
        #footer
      >
        <div class="A-dialog-double-button flex justify-end gap-4 ">
          <AButton
            v-if="!hideFirstButton"
            :button-disabled="disableFirstButton"
            button-size="md"
            :button-text="doubleFirstText"
            @click="emits('click:first-button')"
          />
          <AButton
            v-if="!hideSecondButton"
            button-size="md"
            :button-text="doubleSecondText"
            @click="emits('click:second-button')"
          />
        </div>
      </template>
    </DGCard>
  </DGModal>
</template>

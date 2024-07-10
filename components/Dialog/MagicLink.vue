<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const { t } = useLocale()
const { width } = useWindowSize()

const { emailRegex } = useUi()

withDefaults(
  defineProps<{
    customClass?: string
    title?: string
    doubleFirstText?: string
    doubleSecondText?: string
  }>(),
  {
    customClass: '',
    title: '',
    doubleFirstText: '',
    doubleSecondText: '',
  },
)

const emits = defineEmits([
  'close',
  'submit-email',
])

const schema = object({
  password: string()
    .required(t('validate.inputEmail'))
    .matches(emailRegex, t('validate.inputFormat')),
})

type Schema = InferType<typeof schema>

const magicLinkForm = reactive({
  email: '',
})

const dialogTrigger = defineModel('dialogTrigger', {
  type: Boolean,
  default: false,
})

const submitEmail = (event: FormSubmitEvent<Schema>) => {
  if (!event.isTrusted) {
    return
  }

  emits('submit-email', magicLinkForm.email)
  closeDialog()
}

const closeDialog = () => {
  magicLinkForm.email = ''
  emits('close')
}
</script>

<template>
  <ADialog
    :dialog-trigger="dialogTrigger"
    :custom-class="customClass"
    :draggable="false"
    :title="title"
    :width="width < 700 ? '90dvw' : '500px'"
    hide-single-button
    :double-first-text="doubleFirstText"
    :double-second-text="doubleSecondText"
    @click:first-button="submitEmail"
    @click:second-button="closeDialog"
    @close="closeDialog"
  >
    <DGForm
      :schema="schema"
      :state="magicLinkForm"
      class="space-y-2"
      @submit="submitEmail"
    >
      <DGFormGroup
        :label="$t('texts.magicEmail')"
        name="magicLink"
        size="xl"
        required
      >
        <DGInput
          v-model="magicLinkForm.email"
          color="amber"
          :placeholder="$t('placeholder.inputEmail')"
          type="email"
          aria-label="email"
          clearable
          @keyup.enter="submitEmail"
        />
      </DGFormGroup>
    </DGForm>
  </ADialog>
</template>

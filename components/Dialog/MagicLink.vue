<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const { t } = useLocale()

const { emailRegex } = useUi()

withDefaults(
  defineProps<{
    title?: string
    doubleFirstText?: string
    doubleSecondText?: string
  }>(),
  {
    title: '',
    doubleFirstText: '',
    doubleSecondText: '',
  },
)

const emits = defineEmits([
  'submit:email',
  'close:dialog',
])

const schema = object({
  email: string()
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

const submitEmail = async (event: FormSubmitEvent<Schema>) => {
  if (!event.isTrusted) {
    return
  }

  emits('submit:email', magicLinkForm.email)
  closeDialog()
}

const closeDialog = () => {
  magicLinkForm.email = ''
  emits('close:dialog')
}
</script>

<template>
  <ADialog
    :dialog-trigger="dialogTrigger"
    :title="title"
    dialog-title-class="text-xl font-bold"
    hide-double-button
    @close="closeDialog"
  >
    <DGForm
      :schema="schema"
      :state="magicLinkForm"
      class="flex flex-col items-end space-y-4"
      @submit="submitEmail"
    >
      <DGFormGroup
        :label="$t('texts.magicEmail')"
        name="email"
        class="w-full"
        size="xl"
        required
      >
        <AInput
          v-model:input-data="magicLinkForm.email"
          input-color="amber"
          :input-placeholder="$t('placeholder.inputEmail')"
          input-type="email"
          clearable
        />
      </DGFormGroup>
      <DGFormGroup>
        <div class="flex gap-4">
          <AButton
            button-type="submit"
            :button-text="doubleFirstText"
          />
          <AButton
            :button-text="doubleSecondText"
            @click="closeDialog"
          />
        </div>
      </DGFormGroup>
    </DGForm>
  </ADialog>
</template>

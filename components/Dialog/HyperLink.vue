<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const { t } = useLocale()

const { hyperLinkRegex } = useUi()

const dialogTrigger = defineModel('dialogTrigger', {
  type: Boolean,
  default: false,
})

const emits = defineEmits([
  'close:dialog',
  'submit:link',
])

const schema = object({
  hyperLink: string()
    .required(t('messages.linkRequire'))
    .matches(hyperLinkRegex, t('messages.linkFormat')),
})

type Schema = InferType<typeof schema>

const formData = reactive({
  hyperLink: '',
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  if (!event.isTrusted) {
    return
  }

  emits('submit:link', formData.hyperLink)
  closeDialog(false)
}

const closeDialog = (trigger: boolean) => {
  emits('close:dialog', trigger)
  formData.hyperLink = ''
}
</script>

<template>
  <ADialog
    :dialog-trigger="dialogTrigger"
    :title="$t('board.dialog.hyperLinkTitle')"
    :double-second-text="$t('buttons.close')"
    hide-first-button
    @click:second-button="closeDialog"
    @close="closeDialog"
  >
    <DGForm
      :schema="schema"
      :state="formData"
      class="mt-2 space-y-2"
      @submit="onSubmit"
    >
      <DGFormGroup
        :label="$t('tiptap.link')"
        name="hyperLink"
        required
      >
        <DGInput
          v-model="formData.hyperLink"
          color="amber"
          :placeholder="$t('board.dialog.hyperLinkTitle')"
          aria-label="hyperLink"
        />
      </DGFormGroup>
      <AButton
        custom-class="submit-button"
        button-size="md"
        :icon-size="18"
        :button-text="$t('buttons.save')"
        type="submit"
      />
    </DGForm>
  </ADialog>
</template>

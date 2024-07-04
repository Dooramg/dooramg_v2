<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const { t } = useLocale()

const { youtubeRegex } = useUi()

const dialogTrigger = defineModel('dialogTrigger', {
  type: Boolean,
  default: false,
})

const emits = defineEmits([
  'close:dialog',
  'submit:link',
])

const schema = object({
  youtube: string()
    .required(t('messages.youtubeRequire'))
    .matches(youtubeRegex, t('messages.youtubeFormat')),
})

type Schema = InferType<typeof schema>

const formData = reactive({
  youtube: '',
})

const onSubmit = (event: FormSubmitEvent<Schema>) => {
  if (!event.isTrusted) {
    return
  }
  emits('submit:link', formData.youtube)
  closeDialog(false)
}

const closeDialog = (trigger: boolean) => {
  emits('close:dialog', trigger)
  formData.youtube = ''
}
</script>

<template>
  <ADialog
    :dialog-trigger="dialogTrigger"
    :title="$t('board.dialog.youtubeLinkTitle')"
    :double-second-text="$t('buttons.close')"
    hide-first-button
    @click:second-button="closeDialog(false)"
    @close="closeDialog(false)"
  >
    <DGForm
      :schema="schema"
      :state="formData"
      class="mt-2 space-y-2"
      @submit="onSubmit"
    >
      <DGFormGroup
        :label="$t('tiptap.youtube')"
        name="youtube"
        required
      >
        <DGInput
          v-model="formData.youtube"
          color="amber"
          :placeholder="$t('board.dialog.youtubeLinkTitle')"
          aria-label="youtube"
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

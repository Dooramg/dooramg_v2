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
    .required(t('validate.inputLink'))
    .matches(youtubeRegex, t('validate.youtubeFormat')),
})

type Schema = InferType<typeof schema>

const formData = reactive({
  youtube: '',
})

const submitYoutubeLink = async (event: FormSubmitEvent<Schema>) => {
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
    dialog-title-class="text-xl font-bold"
    hide-double-button
    @close="closeDialog(false)"
  >
    <DGForm
      :schema="schema"
      :state="formData"
      class="flex flex-col items-end space-y-4"
      @submit="submitYoutubeLink"
    >
      <DGFormGroup
        :label="$t('tiptap.youtube')"
        name="youtube"
        class="w-full"
        size="xl"
        required
      >
        <AInput
          v-model:input-data="formData.youtube"
          input-color="amber"
          :input-placeholder="$t('board.dialog.youtubeLinkTitle')"
          clearable
        />
      </DGFormGroup>
      <DGFormGroup>
        <div class="flex gap-4">
          <AButton
            button-type="submit"
            :button-text="$t('buttons.save')"
          />
          <AButton
            :button-text="$t('buttons.close')"
            @click="closeDialog(false)"
          />
        </div>
      </DGFormGroup>
    </DGForm>
  </ADialog>
</template>

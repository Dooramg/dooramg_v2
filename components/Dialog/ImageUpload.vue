<script setup lang="ts">
const toast = useToast()
const { t } = useLocale()
const { genUid } = useUi()

const { loadStorage, uploadStorage } = useFetchComposable()

const dialogTrigger = defineModel('dialogTrigger', {
  type: Boolean,
  default: false,
})

const emits = defineEmits([
  'close:dialog',
  'submit:image',
])

const exportUrl = ref('')
const hyperLink = ref('')
const imageHyperLinkTrigger = ref(false)
const limitType = ['image/jpeg', 'image/jpg', 'image/webp', 'image/png', 'image/svg+xml']

const uploadFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target && target.files && target.files[0]) {
    const file = target.files[0]
    if (!limitType.includes(file.type)) {
      toast.add({ title: t('messages.imageUploadFormat'), color: 'amber', timeout: 3000 })
    }
    else if (file.size / 1024 / 1024 > 5) {
      toast.add({ title: t('messages.imageUploadSmallSize'), color: 'amber', timeout: 3000 })
    }
    else {
      uploadImage(file)
    }
  }
}

const uploadImage = async (file: File) => {
  const fileExt = file.name.split('.').pop()
  const filePath = `${genUid()}.${fileExt}`

  await uploadStorage('notice_board', filePath, file)

  toast.add({ title: t('messages.successImageUpload'), color: 'amber', timeout: 3000 })
  await downloadImage(filePath)
}

const downloadImage = async (imageName: string) => {
  if (!imageName) {
    return
  }

  exportUrl.value = await loadStorage('notice_board', imageName)
}

const submitImage = () => {
  if (!exportUrl.value) {
    toast.add({ title: t('messages.imageRequire'), color: 'orange', timeout: 3000 })
    return
  }

  emits('submit:image', exportUrl.value, imageHyperLinkTrigger.value ? hyperLink.value : '')
  toast.add({ title: t('messages.successImageUpload'), color: 'amber', timeout: 3000 })
  closeDialog(false)
}

const closeDialog = (trigger: boolean) => {
  imageHyperLinkTrigger.value = false
  hyperLink.value = ''
  emits('close:dialog', trigger)
}
</script>

<template>
  <ADialog
    :dialog-trigger="dialogTrigger"
    :title="$t('board.dialog.imageUploadTitle')"
    :double-first-text="$t('buttons.save')"
    :double-second-text="$t('buttons.close')"
    @click:first-button="submitImage"
    @click:second-button="closeDialog(false)"
    @close="closeDialog(false)"
  >
    <div class="flex flex-col gap-6">
      <DGFormGroup :label="$t('buttons.upload')">
        <DGInput
          type="file"
          @change="uploadFile"
        >
          <template #trailing>
            <Icon name="line-md:cloud-upload-outline-loop" />
          </template>
        </DGInput>
      </DGFormGroup>
      <DGFormGroup :label="$t('buttons.insertLink')">
        <div class="flex flex-col gap-2">
          <AInput
            v-if="imageHyperLinkTrigger"
            v-model:input-data="hyperLink"
            clearable
            input-color="amber"
          />
          <DGCheckbox
            v-model="imageHyperLinkTrigger"
            color="amber"
            :label="imageHyperLinkTrigger ? $t('buttons.noUse') : $t('buttons.insertLink')"
          />
        </div>
      </DGFormGroup>
      <NuxtImg
        v-if="exportUrl"
        class="image-preview"
        :src="exportUrl"
        width="300"
        height="200"
        fit="cover"
        alt="image-prev"
        :draggable="false"
        @contextmenu.prevent
      />
    </div>
  </ADialog>
</template>

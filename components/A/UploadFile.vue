<script setup lang="ts">
const toast = useToast()

const props = withDefaults(
  defineProps<{
    draggable?: boolean
    customClass?: string
    fileTypeAlarm?: string
    fileSizeAlarm?: string
    limitType?: string[]
    limitWidth?: number
    limitHeight?: number
    limitSize?: number
  }>(),
  {
    draggable: true,
    customClass: 'upload-drag-files',
    fileTypeAlarm: '',
    fileSizeAlarm: '',
    limitType: () => [],
    limitWidth: 0,
    limitHeight: 0,
    limitSize: 0,
  },
)

const emit = defineEmits([
  'upload:file',
])

const uploadFile = (fileList: FileList) => {
  const file = fileList[0]
  if (!props.limitType.includes(file.type)) {
    toast.add({ title: props.fileTypeAlarm, color: 'red', timeout: 3000 })
  }
  else if (file.size / props.limitHeight / props.limitWidth > props.limitSize) {
    toast.add({ title: props.fileSizeAlarm, color: 'red', timeout: 3000 })
  }
  else {
    emit('upload:file', file)
  }
}
</script>

<template>
  <div class="flex flex-column items-center gap-6">
    <DGFormGroup
      :label="$t('buttons.upload')"
      :help="props.fileTypeAlarm.concat(' ', props.fileSizeAlarm)"
    >
      <DGInput
        type="file"
        @change="uploadFile"
      >
        <template #trailing>
          <Icon name="line-md:cloud-upload-outline-loop" />
        </template>
      </DGInput>
    </DGFormGroup>
  </div>
</template>

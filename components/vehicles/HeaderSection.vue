<script setup lang="ts">
const toast = useToast()
const { t } = useI18n()
const { params } = useRoute()
const { comma, genUid } = useUi()

const { updateData, loadStorage, uploadStorage } = useFetchComposable()

const editableTrigger = defineModel('editableTrigger', {
  type: Boolean,
  default: false,
})

const selectedVehicleData = defineModel('selectedVehicleData', {
  type: Object,
  default: () => ({}),
})

const updatedVehicleData = defineModel('updatedVehicleData', {
  type: Object,
  default: () => ({}),
})

const validateEditTrigger = defineModel('validateEditTrigger', {
  type: Boolean,
  default: false,
})

const emits = defineEmits([
  'validate:input',
  'update:image',
])

const manageVehicleId = String(params.vehicleId)

const uploadImage = async (file: File) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${genUid()}.${fileExt}`

  await uploadStorage('vehicle_image', fileName, file)
  const updateImageUrl = await downloadImage(fileName)

  await updateData('vehicles', { bikeImageName: fileName, bikeImage: updateImageUrl }, manageVehicleId)

  emits('update:image', updateImageUrl)
  toast.add({ title: t('messages.uploadSuccess.title'), description: t('messages.uploadSuccess.description'), color: 'amber', timeout: 3000 })
  editableTrigger.value = false
}

const downloadImage = async (imageName: string) => {
  if (!imageName) {
    return
  }

  return await loadStorage('vehicle_image', imageName)
}
</script>

<template>
  <DGCard>
    <div class="w-full flex flex-col gap-4">
      <div class="flex flex-wrap gap-4">
        <DGAvatar
          v-show="selectedVehicleData?.manufacturer?.logoImage"
          :src="selectedVehicleData?.manufacturer?.logoImage"
          size="2xl"
          :alt="selectedVehicleData?.manufacturer?.name"
          :ui="{ background: 'bg-transparent' }"
        />
        <div class="flex-auto" />
        <div class="w-full md:w-2/3 flex flex-col justify-end items-end gap-2">
          <div class="flex flex-col gap-1">
            <p
              v-if="selectedVehicleData?.manufacturer?.name"
              class="text-xl font-bold text-right"
            >
              {{ selectedVehicleData?.manufacturer?.name }}
            </p>
            <p
              v-if="selectedVehicleData?.vehicleModel?.name"
              class="text-sm text-right"
            >
              {{ selectedVehicleData?.vehicleModel?.name }}
            </p>
          </div>
          <DGDivider class="w-full" />
          <div class="flex flex-col gap-1">
            <p
              v-if="selectedVehicleData?.makeYear"
              class="text-xl font-bold text-right"
            >
              {{ $t('unit.makeYear', { makeYear: selectedVehicleData?.makeYear }) }}
            </p>
            <div class="w-fit flex flex-col gap-1">
              <p
                v-if="selectedVehicleData?.displacement"
                class="text-sm text-right"
              >
                {{ $t('unit.displacement', { displacement: comma(selectedVehicleData?.displacement || 0) }) }}
              </p>
              <div
                v-if="!selectedVehicleData?.displacement"
                class="flex flex-col items-end gap-1"
              >
                <AInput
                  v-if="editableTrigger"
                  v-model:input-data="updatedVehicleData.displacement"
                  :input-placeholder="$t('placeholder.displacement')"
                  input-type="number"
                  clearable
                  @click:clear="() => validateEditTrigger = false"
                  @update:model-value="() => $emit('validate:input', updatedVehicleData.displacement < 1)"
                />
                <p class="text-xs text-rose-400 dark:text-rose-6000">
                  {{ $t('placeholder.displacement') }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <DGAvatar
            v-if="selectedVehicleData?.bikeImage"
            img-class="object-cover"
            :src="selectedVehicleData?.bikeImage ? selectedVehicleData?.bikeImage : updatedVehicleData.bikeImage ?? '/image/no_bike_image.jpg'"
            size="3xl"
            alt="bike-image"
            :ui="{ rounded: 'rounded-2xl', size: { '3xl': 'h-[200px] w-full' } }"
          />
          <AUploadFile
            v-if="editableTrigger"
            :file-size-alarm="$t('validate.imageUploadLargeSize')"
            :file-type-alarm="$t('validate.imageUploadFormat')"
            :limit-type="['image/jpeg', 'image/png', 'image/gif']"
            :limit-height="2048"
            :limit-width="2048"
            :limit-size="10"
            @upload:file="(file: File) => uploadImage(file)"
          />
        </div>
      </div>
    </div>
  </DGCard>
</template>

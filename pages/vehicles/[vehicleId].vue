<script setup lang="ts">
const toast = useToast()
const { t } = useLocale()
const { params } = useRoute()
const { comma, genUid, checkNumber, digitsRoundUp } = useUi()

const { loadCodeList } = useLoadCode()
const { refreshUserData } = useLoadUser()
const { refreshVehicleData } = useLoadVehicles()
const { updateData, upsertData, deleteData, loadStorage, uploadStorage } = useFetchComposable()

const { headTextList, middleTextList, tailTextList } = storeToRefs(usePlateStore())
const { userCoreId } = storeToRefs(useUserInfoStore())
const { vehicleData, selectedVehicleData } = storeToRefs(useVehicleStore())

useHead({
  title: t('pageTitle.vehicles'),
})

definePageMeta({
  layout: 'without-navigator',
  middleware: 'auth',
})

const manageVehicleId = String(params.vehicleId)

const updatedVehicleData = ref({
  displacement: 0,
  totalDistance: 0,
  totalFuelAmount: 0,
  totalEfficient: 0,
  totalPaidAmount: 0,
  fuelTypeId: '',
  tankSize: 0,
  officialFuelEfficient: 0,
  memo: '',
  plateHeadText: '',
  plateMiddleText: '',
  plateTailText: '',
  plateNumber: '',
})
const selectPlateHeadId = ref('')
const selectPlateMiddleId = ref('')
const selectPlateTailId = ref('')

const editableTrigger = ref(false)
const validateEditTrigger = ref(true)
const deleteConfirmTrigger = ref(false)

const { data: fuelData } = useAsyncData('fuelData', async () => {
  const { data } = await useFetch('/api/addVehicle/fuelData', { headers: useRequestHeaders(['cookie']) })
  if (!data.value) {
    return
  }
  return data.value
}, {
  immediate: true,
})

const { data: diaryTypeData } = useAsyncData('diaryType', async () => {
  const { data }: SerializeObject = await useFetch('/api/management/type', {
    headers: useRequestHeaders(['cookie']),
    query: {
      queryString: 'MTC003',
    },
  })

  return data.value
}, {
  immediate: true,
})

const uploadImage = async (file: File) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${genUid()}.${fileExt}`

  await uploadStorage('vehicle_image', fileName, file)
  await updateData('vehicles', { bikeImageName: fileName, bikeImage: await downloadImage(fileName) }, manageVehicleId)

  toast.add({ title: t('messages.uploadSuccess.title'), description: t('messages.uploadSuccess.description'), color: 'amber', timeout: 3000 })
  await refreshVehicleData()
  editableTrigger.value = false
}

const downloadImage = async (imageName: string) => {
  if (!imageName) {
    return
  }

  return await loadStorage('vehicle_image', imageName)
}

const clickEditButton = () => {
  editableTrigger.value = !editableTrigger.value

  if (editableTrigger.value) {
    updatedVehicleData.value = {
      displacement: selectedVehicleData.value?.displacement ?? 0,
      totalDistance: selectedVehicleData.value?.totalDistance ?? 0,
      totalFuelAmount: selectedVehicleData.value?.totalFuelAmount ?? 0,
      totalEfficient: selectedVehicleData.value?.totalEfficient ?? 0,
      totalPaidAmount: selectedVehicleData.value?.totalPaidAmount ?? 0,
      fuelTypeId: selectedVehicleData.value?.fuelTypeId ?? '',
      tankSize: selectedVehicleData.value?.tankSize ?? 0,
      officialFuelEfficient: selectedVehicleData.value?.officialFuelEfficient ?? 0,
      memo: selectedVehicleData.value?.memo ?? '',
      plateHeadText: selectedVehicleData.value?.plateHeadText ?? '',
      plateMiddleText: selectedVehicleData.value?.plateMiddleText ?? '',
      plateTailText: selectedVehicleData.value?.plateTailText ?? '',
      plateNumber: selectedVehicleData.value?.plateNumber ?? '',
    }
  }
}

const selectPlateHeadText = async (id: string) => {
  validateEditTrigger.value = false
  const selectionHeadText = headTextList.value.find((headText: Code) => headText.id === id)

  updatedVehicleData.value.plateHeadText = selectionHeadText?.codeName ?? ''
  await loadCodeList(selectionHeadText?.code ?? '')
}

const selectPlateMiddleText = async (id: string) => {
  validateEditTrigger.value = false
  const selectionMiddleText = middleTextList.value.find((middleText: Code) => middleText.id === id)

  updatedVehicleData.value.plateMiddleText = selectionMiddleText?.codeName ?? ''
}

const selectPlateTailText = async (id: string) => {
  updatedVehicleData.value.plateNumber.length !== 4
    ? validateEditTrigger.value = false
    : validateEditTrigger.value = true

  const selectionTailText = tailTextList.value.find((tailText: Code) => tailText.id === id)

  updatedVehicleData.value.plateTailText = selectionTailText?.codeName ?? ''
}

const validateInput = (trigger: boolean) => {
  !trigger ? validateEditTrigger.value = true : validateEditTrigger.value = false
}

const validatePlateNumber = (value: string) => {
  if (!checkNumber(value)) {
    toast.add({ title: t('validate.inputNumber'), color: 'red', timeout: 3000 })
    updatedVehicleData.value.plateNumber = value.slice(0, value.length - 1)
    validateEditTrigger.value = false
    return
  }

  if (value.length === 4) {
    validateEditTrigger.value = true
    return
  }
  if (value.length <= 3) {
    toast.add({ title: t('validate.input4Digits'), color: 'red', timeout: 3000 })
    validateEditTrigger.value = false
    return
  }
  if (value.length > 4) {
    toast.add({ title: t('validate.input4Digits'), color: 'red', timeout: 3000 })
    updatedVehicleData.value.plateNumber = value.slice(0, 4)
    return
  }

  validateEditTrigger.value = true
}

const updateVehicle = async () => {
  updatedVehicleData.value.totalEfficient = await calculateTotalEfficient(updatedVehicleData.value.totalDistance, updatedVehicleData.value.totalFuelAmount)
  if (!selectedVehicleData.value?.totalDistance) {
    const initDiaryData = {
      vehicleId: manageVehicleId,
      manageTypeId: diaryTypeData.value?.id,
      userId: userCoreId.value,
      title: t('vehicleDetail.initialTitle'),
      driveDistance: updatedVehicleData.value.totalDistance,
      totalDistance: updatedVehicleData.value.totalDistance,
      fuelAmount: updatedVehicleData.value.totalFuelAmount ?? 0,
      paidAmount: updatedVehicleData.value.totalPaidAmount,
      efficient: digitsRoundUp((updatedVehicleData.value.totalDistance / (updatedVehicleData.value.totalFuelAmount ?? 1)), 'round', 100),
    }
    await upsertData('vehicleManagement', initDiaryData, '', '')
  }

  await updateData('vehicles', updatedVehicleData.value, manageVehicleId)

  toast.add({ title: t('messages.updateSuccess.title'), description: t('messages.updateSuccess.description'), color: 'amber', timeout: 3000 })
  navigateTo('/vehicles')
}

const confirmDelete = async () => {
  await deleteData('vehicleManagement', false, 'vehicleId', manageVehicleId, '', '', '', '')
  await deleteData('vehicles', false, 'id', manageVehicleId, '', '', '', '')
  await updateData('userInfo', { mainVehicleId: vehicleData.value?.at(0)?.id }, userCoreId.value)

  refreshVehicleData()
  refreshUserData()
  deleteConfirmTrigger.value = false
  toast.add({ title: t('messages.deleteVehicleSuccess.title'), description: t('messages.deleteVehicleSuccess.description'), color: 'amber', timeout: 3000 })
  navigateTo('/vehicles')
}

const calculateTotalEfficient = (totalDistance: number, totalFuelAmount: number) => {
  return totalDistance
    ? digitsRoundUp(totalDistance / totalFuelAmount, 'round', 1000)
    : 0
}

await loadCodeList('CMA')
await loadCodeList('CTM')
</script>

<template>
  <div class="w-dvw md:w-[500px] flex flex-col mt-8 px-8 pb-28 gap-4">
    <div class="w-full flex flex-wrap justify-between gap-2">
      <p class="text-2xl font-bold">
        {{ selectedVehicleData?.carNickName?.concat($t('vehicleDetail.title')) }}
      </p>
      <AButton
        :button-text="editableTrigger ? $t('buttons.cancel') : $t('buttons.editShort')"
        @click="clickEditButton"
      />
    </div>
    <DGCard>
      <div class="w-full flex flex-col gap-4">
        <div class="flex flex-wrap gap-4">
          <DGAvatar
            :src="selectedVehicleData?.manufacturer.logoImage"
            size="2xl"
            :alt="selectedVehicleData?.manufacturer.name"
            :ui="{ background: 'bg-transparent' }"
          />
          <div class="flex-auto" />
          <div class="w-full md:w-2/3 flex flex-col justify-end items-end gap-2">
            <div class="flex flex-col gap-1">
              <p
                v-if="selectedVehicleData?.manufacturer.name"
                class="text-xl font-bold text-right"
              >
                {{ selectedVehicleData?.manufacturer.name }}
              </p>
              <p
                v-if="selectedVehicleData?.vehicleModel.name"
                class="text-sm text-right"
              >
                {{ selectedVehicleData?.vehicleModel.name }}
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
                    @update:model-value="() => validateInput(updatedVehicleData.displacement < 1)"
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
              img-class="object-cover"
              :src="selectedVehicleData?.bikeImage ? selectedVehicleData?.bikeImage : '/image/no_bike_image.jpg'"
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
    <DGCard>
      <div class="flex flex-col gap-4">
        <div class="w-full flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <p
              v-if="selectedVehicleData?.totalDistance"
              class="text-md font-bold text-pretty"
            >
              {{ $t('labelTexts.totalDistance') }}
            </p>
            <p
              v-else
              class="text-xs text-rose-400 dark:text-rose-600"
            >
              {{ $t('placeholder.totalDistance') }}
            </p>
            <DGTooltip
              v-if="editableTrigger"
              :text="$t('vehicleDetail.updateVehicleCaution')"
              :popper="{ placement: 'top' }"
            >
              <Icon
                class="cursor-pointer text-rose-400 dark:text-rose-600"
                name="i-line-md-alert-circle"
                size="20px"
              />
            </DGTooltip>
          </div>
          <div class="w-full flex justify-end">
            <p
              v-if="selectedVehicleData?.totalDistance && !editableTrigger"
              class="text-lg font-bold text-right text-pretty"
            >
              {{ $t('unit.distance', { distance: comma(selectedVehicleData.totalDistance) }) }}
            </p>
            <AInput
              v-if="editableTrigger"
              v-model:input-data="updatedVehicleData.totalDistance"
              :input-placeholder="$t('placeholder.totalDistance')"
              input-class="w-full md:w-1/2"
              input-type="number"
              clearable
              @click:clear="() => validateEditTrigger = false"
              @update:model-value="() => validateInput(updatedVehicleData.totalDistance < 1)"
            />
          </div>
        </div>
        <DGDivider />
        <div class="w-full flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <p
              v-if="selectedVehicleData?.totalFuelAmount"
              class="text-md font-bold text-pretty"
            >
              {{ $t('labelTexts.totalFuelAmount') }}
            </p>
            <p
              v-else
              class="text-xs text-rose-400 dark:text-rose-600"
            >
              {{ $t('placeholder.totalFuelAmount') }}
            </p>
            <DGTooltip
              v-if="editableTrigger"
              :text="$t('vehicleDetail.updateVehicleCaution')"
              :popper="{ placement: 'top' }"
            >
              <Icon
                class="cursor-pointer text-rose-400 dark:text-rose-600"
                name="i-line-md-alert-circle"
                size="20px"
              />
            </DGTooltip>
          </div>
          <div class="w-full flex justify-end">
            <p
              v-if="selectedVehicleData?.totalFuelAmount && !editableTrigger"
              class="text-lg font-bold text-right text-pretty"
            >
              {{ $t('unit.fuelAmount', { fuelAmount: comma(selectedVehicleData?.totalFuelAmount || 0) }) }}
            </p>
            <AInput
              v-if="editableTrigger"
              v-model:input-data="updatedVehicleData.totalFuelAmount"
              :input-placeholder="$t('placeholder.totalFuelAmount')"
              input-class="w-full md:w-1/2"
              input-type="number"
              clearable
              @click:clear="() => validateEditTrigger = false"
              @update:model-value="() => validateInput(updatedVehicleData.totalFuelAmount < 1)"
            />
          </div>
        </div>
        <DGDivider />
        <div class="w-full flex flex-col gap-1">
          <p
            v-if="selectedVehicleData?.totalEfficient"
            class="text-md font-bold text-pretty"
          >
            {{ $t('labelTexts.totalEfficient') }}
          </p>
          <p
            v-if="selectedVehicleData?.totalEfficient"
            class="text-lg font-bold text-right text-pretty"
          >
            {{ $t('unit.fuelEfficient', { efficient: comma(selectedVehicleData?.totalEfficient) }) }}
          </p>
        </div>
        <DGDivider v-if="selectedVehicleData?.totalEfficient" />
        <div class="w-full flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <p
              v-if="selectedVehicleData?.totalPaidAmount"
              class="text-md font-bold text-pretty"
            >
              {{ $t('labelTexts.totalPaidAmount') }}
            </p>
            <p
              v-else
              class="text-xs text-rose-400 dark:text-rose-600"
            >
              {{ $t('placeholder.totalPaidAmount') }}
            </p>
            <DGTooltip
              v-if="editableTrigger"
              :text="$t('vehicleDetail.updateVehicleCaution')"
              :popper="{ placement: 'top' }"
            >
              <Icon
                class="cursor-pointer text-rose-400 dark:text-rose-600"
                name="i-line-md-alert-circle"
                size="20px"
              />
            </DGTooltip>
          </div>
          <div class="w-full flex justify-end">
            <p
              v-if="selectedVehicleData?.totalPaidAmount && !editableTrigger"
              class="text-lg font-bold text-right text-pretty"
            >
              {{ $t('unit.priceText', { price: comma(selectedVehicleData?.totalPaidAmount ?? 0) }) }}
            </p>
            <AInput
              v-if="editableTrigger"
              v-model:input-data="updatedVehicleData.totalPaidAmount"
              :input-placeholder="$t('placeholder.totalPaidAmount')"
              input-class="w-full md:w-1/2"
              input-type="number"
              clearable
              @click:clear="() => validateEditTrigger = false"
              @update:model-value="() => validateInput(updatedVehicleData.totalPaidAmount < 1)"
            />
          </div>
        </div>
      </div>
    </DGCard>
    <DGCard>
      <div class="flex flex-col gap-4">
        <div class="w-full flex flex-col gap-1">
          <p
            v-if="selectedVehicleData?.fuelData.codeName"
            class="text-md font-bold text-pretty"
          >
            {{ $t('labelTexts.fuelType') }}
          </p>
          <DGSkeleton
            v-else
            class="h-8 w-[50px]"
          />
          <div
            v-if="selectedVehicleData?.fuelData.codeName"
            class="flex flex-col items-end gap-2"
          >
            <p
              v-if="!editableTrigger"
              class="text-lg font-bold text-right text-pretty"
            >
              {{ selectedVehicleData?.fuelData.codeName }}
            </p>
            <DGSelect
              v-else
              v-model="updatedVehicleData.fuelTypeId"
              class="w-1/2"
              :options="fuelData"
              color="amber"
              value-attribute="id"
              option-attribute="codeName"
            />
          </div>
          <DGSkeleton
            v-else
            class="h-8 w-[50px]"
          />
        </div>
        <DGDivider />
        <div class="w-full flex flex-col gap-1">
          <p
            v-if="selectedVehicleData?.tankSize"
            class="text-md font-bold text-pretty"
          >
            {{ $t('labelTexts.tankSize') }}
          </p>
          <p
            v-else
            class="text-xs text-rose-400 dark:text-rose-600"
          >
            {{ $t('placeholder.tankSize') }}
          </p>
          <div class="w-full flex justify-end">
            <p
              v-if="selectedVehicleData?.tankSize && !editableTrigger"
              class="text-lg font-bold text-right text-pretty"
            >
              {{ $t('unit.fuelAmount', { fuelAmount: comma(selectedVehicleData?.tankSize) }) }}
            </p>
            <AInput
              v-if="editableTrigger"
              v-model:input-data="updatedVehicleData.tankSize"
              :input-placeholder="$t('placeholder.tankSize')"
              input-class="w-full md:w-1/2"
              input-type="number"
              clearable
              @click:clear="() => validateEditTrigger = false"
              @update:model-value="() => validateInput(updatedVehicleData.tankSize < 1)"
            />
          </div>
        </div>
        <DGDivider />
        <div class="w-full flex flex-col gap-1">
          <p
            v-if="selectedVehicleData?.officialFuelEfficient"
            class="text-md font-bold text-pretty"
          >
            {{ $t('labelTexts.officialFuelEfficient') }}
          </p>
          <p
            v-else
            class="text-xs text-rose-400 dark:text-rose-600"
          >
            {{ $t('placeholder.officialFuelEfficient') }}
          </p>
          <div class="w-full flex justify-end">
            <p
              v-if="selectedVehicleData?.officialFuelEfficient && !editableTrigger"
              class="text-lg font-bold text-right text-pretty"
            >
              {{ $t('unit.fuelEfficient', { efficient: comma(selectedVehicleData?.officialFuelEfficient) }) }}
            </p>
            <AInput
              v-if="editableTrigger"
              v-model:input-data="updatedVehicleData.officialFuelEfficient"
              :input-placeholder="$t('placeholder.officialFuelEfficient')"
              input-class="w-full md:w-1/2"
              input-type="number"
              clearable
              @click:clear="() => validateEditTrigger = false"
              @update:model-value="() => validateInput(updatedVehicleData.officialFuelEfficient < 1)"
            />
          </div>
        </div>
        <DGDivider />
      </div>
    </DGCard>
    <DGCard>
      <div class="flex flex-col gap-4">
        <div class="w-full flex flex-col gap-1">
          <p
            v-if="selectedVehicleData?.memo"
            class="text-md font-bold text-pretty"
          >
            {{ $t('labelTexts.memo') }}
          </p>
          <p
            v-else
            class="text-xs text-rose-400 dark:text-rose-600"
          >
            {{ $t('placeholder.memo') }}
          </p>
          <DGTextarea
            v-model="updatedVehicleData.memo"
            :disabled="!editableTrigger"
            color="amber"
            autoresize
            :placeholder="selectedVehicleData?.memo"
          />
        </div>
        <DGDivider />
        <div class="w-full flex flex-col gap-1">
          <p
            v-if="selectedVehicleData?.carNumber"
            class="text-md font-bold text-pretty"
          >
            {{ $t('labelTexts.vehicleNumber') }}
          </p>
          <DGSkeleton
            v-else
            class="h-8 w-[50px]"
          />
          <div
            v-if="selectedVehicleData?.carNumber"
            class="w-full flex justify-end items-end"
          >
            <ALicensePlate
              v-if="!editableTrigger"
              :head-text="selectedVehicleData?.plateHeadText ?? '서울'"
              :middle-text="selectedVehicleData?.plateMiddleText ?? '강남'"
              :tail-text="selectedVehicleData?.plateTailText ?? '차'"
              :number-text="parseInt(selectedVehicleData?.plateNumber ?? '1004')"
            />
            <div
              v-else
              class="w-full flex flex-col items-end gap-2"
            >
              <DGSelect
                v-model="selectPlateHeadId"
                class="w-1/2"
                :options="headTextList"
                color="amber"
                value-attribute="id"
                option-attribute="codeName"
                @update:model-value="(id: string) => selectPlateHeadText(id)"
              />
              <DGSelect
                v-if="selectPlateHeadId"
                v-model="selectPlateMiddleId"
                class="w-1/2"
                :options="middleTextList"
                color="amber"
                value-attribute="id"
                option-attribute="codeName"
                @update:model-value="(id: string) => selectPlateMiddleText(id)"
              />
              <DGSelect
                v-if="selectPlateHeadId && selectPlateMiddleId"
                v-model="selectPlateTailId"
                class="w-1/2"
                :options="tailTextList"
                color="amber"
                value-attribute="id"
                option-attribute="codeName"
                @update:model-value="(id: string) => selectPlateTailText(id)"
              />
              <AInput
                v-if="selectPlateTailId"
                v-model="updatedVehicleData.plateNumber"
                input-class="w-full md:w-1/2"
                input-size="sm"
                clearable
                @update:model-value="(value: string) => validatePlateNumber(value)"
                @click:clear="() => updatedVehicleData.plateNumber = ''"
              />
            </div>
          </div>
          <DGSkeleton
            v-else
            class="h-8 w-[50px]"
          />
        </div>
        <DGDivider />
      </div>
    </DGCard>
    <div
      v-if="editableTrigger && validateEditTrigger"
      class="w-full flex justify-between"
    >
      <AButton
        :button-text="$t('buttons.delete')"
        button-color="rose"
        button-variant="ghost"
        @click="() => deleteConfirmTrigger = true"
      />
      <AButton
        :button-text="$t('buttons.save')"
        button-color="amber"
        @click="updateVehicle"
      />
    </div>
    <DialogConfirm
      :dialog-trigger="deleteConfirmTrigger"
      title-class="text-2xl font-bold"
      :full-screen="false"
      :title="$t('vehicleDetail.deleteDialog.title')"
      :first-button-text="$t('vehicleDetail.deleteDialog.confirm')"
      :second-button-text="$t('vehicleDetail.deleteDialog.reject')"
      @click:first-button="confirmDelete"
      @click:second-button="() => deleteConfirmTrigger = false"
      @close="() => deleteConfirmTrigger = false"
    >
      {{ $t('vehicleDetail.deleteDialog.title') }}
    </DialogConfirm>
  </div>
</template>

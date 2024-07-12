<script setup lang="ts">
const toast = useToast()
const { t } = useLocale()
const { params } = useRoute()
const { checkNumber, digitsRoundUp } = useUi()

const { loadCodeList } = useLoadCode()
const { refreshUserData } = useLoadUser()
const { refreshVehicleData } = useLoadVehicles()
const { updateData, upsertData, deleteData } = useFetchComposable()

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
  bikeImage: '',
  bikeImageName: '',
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

// const { data: fuelDataList } = useAsyncData('fuelDataList', async () => {
//   const { data } = await useFetch('/api/addVehicle/fuelData', { headers: useRequestHeaders(['cookie']) })
//   if (!data.value) {
//     return
//   }
//   return data.value
// }, {
//   immediate: true,
// })

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
      bikeImage: selectedVehicleData.value?.bikeImage ?? '',
      bikeImageName: selectedVehicleData.value?.bikeImageName ?? '',
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

const updateImage = async (imageUrl: string) => {
  updatedVehicleData.value.bikeImage = imageUrl
  await refreshVehicleData()
  changeVehicleData(manageVehicleId)
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

const changeVehicleData = (vehicleId: string) => {
  selectedVehicleData.value = vehicleData.value?.find(vehicle => vehicle.id === vehicleId)
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
    <VehiclesHeaderSection
      v-model:selected-vehicle-data="selectedVehicleData"
      v-model:updated-vehicle-data="updatedVehicleData"
      v-model:editable-trigger="editableTrigger"
      v-model:validate-edit-trigger="validateEditTrigger"
      @validate:input="validateInput"
      @update:image="updateImage"
    />
    <VehiclesSecondSection
      v-model:selected-vehicle-data="selectedVehicleData"
      v-model:updated-vehicle-data="updatedVehicleData"
      v-model:editable-trigger="editableTrigger"
      v-model:validate-edit-trigger="validateEditTrigger"
      @validate:input="validateInput"
    />
    <VehiclesThirdSection
      v-model:selected-vehicle-data="selectedVehicleData"
      v-model:updated-vehicle-data="updatedVehicleData"
      v-model:editable-trigger="editableTrigger"
      v-model:validate-edit-trigger="validateEditTrigger"
      @validate:input="validateInput"
    />
    <VehiclesFourthSection
      v-model:selected-vehicle-data="selectedVehicleData"
      v-model:updated-vehicle-data="updatedVehicleData"
      v-model:editable-trigger="editableTrigger"
      v-model:validate-edit-trigger="validateEditTrigger"
      v-model:select-plate-head-id="selectPlateHeadId"
      v-model:select-plate-middle-id="selectPlateMiddleId"
      v-model:select-plate-tail-id="selectPlateTailId"
      @select:plate-head-id="selectPlateHeadText"
      @select:plate-middle-id="selectPlateMiddleText"
      @select:plate-tail-id="selectPlateTailText"
      @validate:plate-number="validatePlateNumber"
    />
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
      <p class="break-keep">
        {{ $t('vehicleDetail.updateVehicleCaution') }}
      </p>
    </DialogConfirm>
  </div>
</template>

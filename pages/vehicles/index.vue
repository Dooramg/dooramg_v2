<script setup lang="ts">
const toast = useToast()
const { t } = useLocale()
const { updateData } = useFetchComposable()

const { refreshUserData } = useLoadUser()
const { refreshVehicleData } = useLoadVehicles()
const { userInfoData, userCoreId } = storeToRefs(useUserInfoStore())
const { vehicleData, selectedVehicleData } = storeToRefs(useVehicleStore())

useHead({
  title: t('pageTitle.vehicles'),
})

definePageMeta({
  layout: 'with-navigator',
  middleware: 'auth',
})

const selectVehicleData = async (vehicleId: string, carNickname: string) => {
  changeVehicleData(vehicleId)

  if (userInfoData.value?.mainVehicleId !== vehicleId) {
    await updateData('userInfo', { mainVehicleId: vehicleId }, userCoreId.value)
    await refreshUserData()

    toast.add({ title: t('messages.vehicleSelect.title', { nickname: carNickname }), description: t('messages.vehicleSelect.description'), color: 'amber', timeout: 2000 })
    return
  }

  await navigateTo(`/vehicles/${vehicleId}`)
}

const changeVehicleData = (vehicleId: string) => {
  selectedVehicleData.value = vehicleData.value?.find(vehicle => vehicle.id === vehicleId)
}

await refreshVehicleData()
</script>

<template>
  <div class="w-dvw md:w-[500px] flex flex-col mt-8 px-8 pb-28 gap-4">
    <p class="text-2xl font-bold">
      {{ $t('vehicles.title') }}
    </p>
    <DGDivider />
    <VehiclesSelectionCard @click:card="selectVehicleData" />
    <DGDivider />
    <VehiclesCard @click:card="selectVehicleData" />
  </div>
</template>

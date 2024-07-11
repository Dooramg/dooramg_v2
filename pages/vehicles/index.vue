<script setup lang="ts">
const toast = useToast()
const { t } = useLocale()
const { comma } = useUi()
const { updateData } = useFetchComposable()

const { refreshUserData } = useLoadUser()
const { refreshVehicleData } = useLoadVehicles()
const { userInfoData, userCoreId } = storeToRefs(useUserInfoStore())
const { vehicleData, selectedVehicleData, vehicleCount } = storeToRefs(useVehicleStore())

useHead({
  title: t('pageTitle.vehicles'),
})

definePageMeta({
  layout: 'with-navigator',
  middleware: 'auth',
})

const selectVehicleData = async (vehicleId: string, carNickname: string) => {
  if (userInfoData.value?.mainVehicleId !== vehicleId) {
    changeVehicleData(vehicleId)
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

refreshVehicleData()
</script>

<template>
  <div class="w-dvw md:w-[500px] flex flex-col mt-8 px-8 pb-28 gap-4">
    <p class="text-2xl font-bold">
      {{ $t('vehicles.title') }}
    </p>
    <DGDivider />
    <DGCard
      :ui="{
        background: 'bg-neutral-100 dark:bg-neutral-900',
        header: { padding: 'px-4 py-2 sm:p-4' },
        body: { padding: 'px-4 py-2 sm:p-4' },
      }"
    >
      <template #header>
        <p class="text-lg sm:text-xl font-bold">
          {{ vehicleCount !== 0 ? $t('vehicles.description') : $t('vehicles.noDescription') }}
        </p>
      </template>
      <div class="w-full flex justify-end">
        <div
          v-if="vehicleCount !== 0"
          class="flex flex-col items-end gap-1"
        >
          <p class="text-base sm:text-lg font-bold">
            {{ selectedVehicleData?.carNickName ? $t('vehicles.mainVehicle', { nickname: selectedVehicleData.carNickName }) : '로딩중..' }}
          </p>
          <ALicensePlate
            :head-text="selectedVehicleData?.plateHeadText ?? '서울'"
            :middle-text="selectedVehicleData?.plateMiddleText ?? '강남'"
            :tail-text="selectedVehicleData?.plateTailText ?? '차'"
            :number-text="parseInt(selectedVehicleData?.plateNumber ?? '1004')"
          />
        </div>
        <AButton
          v-else
          button-color="sky"
          button-size="xl"
          button-variant="outline"
          :button-text="$t('buttons.vehicleInsert')"
          @click="navigateTo('/vehicles/new')"
        />
      </div>
    </DGCard>
    <DGDivider />
    <DGCard
      v-for="(vehicle, index) in vehicleData"
      :key="index"
      :ui="{
        base: 'cursor-pointer hover:text-sky-800 hover:dark:text-sky-200',
        background: userInfoData?.mainVehicleId === vehicle.id ? 'bg-amber-100 dark:bg-amber-900' : 'bg-neutral-100 dark:bg-neutral-900',
        header: { padding: 'px-4 py-2 sm:p-4' },
        body: { padding: 'px-4 py-2 sm:p-4' },
      }"
      @click="selectVehicleData(vehicle.id, vehicle?.carNickName ?? '')"
    >
      <template #header>
        <div class="flex flex-wrap items-center gap-4">
          <DGAvatar
            :src="vehicle.manufacturer.logoImage"
            size="lg"
            :alt="vehicle.manufacturer.name"
            :ui="{ background: 'bg-transparent' }"
          />
          <div class="flex flex-col gap-1">
            <p class="text-lg font-bold">
              {{ $t('main.model', { model: vehicle.vehicleModel.name === '직접입력' ? vehicle.manualModelName : vehicle.vehicleModel.name, makeYear: vehicle.makeYear }) }}
            </p>
            <p class="text-sm font-bold">
              {{ $t('unit.displacement', { displacement: comma(vehicle.displacement ?? 0) }) }}
            </p>
          </div>
          <div class="flex-auto" />
          <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {{ vehicle.carNickName }}
          </p>
        </div>
      </template>
      <DGAvatar
        img-class="object-cover"
        :src="vehicle.bikeImage ? vehicle.bikeImage : '/image/no_bike_image.jpg'"
        size="3xl"
        alt="bike-image"
        :ui="{ rounded: 'rounded-2xl', size: { '3xl': 'h-[180px] w-full md:w-[180px]' } }"
      />
    </DGCard>
  </div>
</template>

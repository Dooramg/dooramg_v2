<script setup lang="ts">
import { sub } from 'date-fns'

const toast = useToast()
const { t } = useLocale()
const { comma, digitsRoundUp } = useUi()
const { updateData, deleteData } = useFetchComposable()

const { userInfoData } = storeToRefs(useUserInfoStore())
const { selectedVehicleData } = storeToRefs(useVehicleStore())
const { allDiaryCount } = storeToRefs(useDiaryStore())

useHead({
  title: t('pageTitle.diary'),
})

definePageMeta({
  layout: 'with-navigator',
  middleware: 'auth',
})

const searchMonth = ref({ start: sub(new Date(), { days: 30 }), end: new Date() })

const { data: diaryData, refresh: refreshDiaryData } = await useAsyncData('diaryData', async () => {
  if (!userInfoData.value?.mainVehicleId) {
    return null
  }

  const { data }: SerializeObject = await useFetch('/api/management', {
    headers: useRequestHeaders(['cookie']),
    query: {
      vehicleId: userInfoData.value?.mainVehicleId,
      dateFilter: true,
      startDate: searchMonth.value.start,
      endDate: searchMonth.value.end,
    },
  })

  return data.value
}, {
  immediate: true,
  watch: [searchMonth],
})

const deleteProcess = async (diaryData: DiaryData) => {
  const recoverData = {
    currentFuelAmount: recoverCurrentFuel(selectedVehicleData.value?.currentFuelAmount ?? 0, selectedVehicleData.value?.officialFuelEfficient ?? 0, diaryData.driveDistance, diaryData.fuelAmount),
    totalFuelAmount: diaryData.manageType.code === 'MTC002' ? selectedVehicleData.value?.totalFuelAmount ?? 0 : recoverAmount(selectedVehicleData.value?.totalFuelAmount ?? 0, diaryData.fuelAmount, true),
    totalDistance: recoverAmount(selectedVehicleData.value?.totalDistance ?? 0, diaryData.driveDistance, true),
    totalPaidAmount: recoverAmount(selectedVehicleData.value?.totalPaidAmount ?? 0, diaryData.paidAmount, false),
    totalEfficient: recoverTotalEfficient(selectedVehicleData.value?.totalDistance ?? 0, selectedVehicleData.value?.totalFuelAmount ?? 0, diaryData.driveDistance, diaryData.fuelAmount),
  }

  toast.add({ title: t('messages.deleteDiarySuccess.title'), description: t('messages.deleteDiarySuccess.description'), color: 'amber', timeout: 3000 })
  await updateData('vehicles', recoverData, diaryData.vehicleId)
  await deleteData('vehicleManagement', false, '', diaryData.id, '', '', '', '')
  await refreshDiaryData()
}

const recoverCurrentFuel = (currentFuelAmount: number, officialFuelEfficient: number, driveDistance: number, fuelAmount: number) => {
  return currentFuelAmount
    ? digitsRoundUp(currentFuelAmount + (driveDistance / (officialFuelEfficient !== 0 ? officialFuelEfficient : 10)) - fuelAmount, 'round', 100)
    : 0
}

const recoverTotalEfficient = (totalDistance: number, totalFuelAmount: number, driveDistance: number, fuelAmount: number) => {
  return digitsRoundUp((totalDistance - driveDistance) / (totalFuelAmount ? totalFuelAmount - fuelAmount : 1), 'round', 100)
}

const recoverAmount = (totalAmount: number, amount: number, roundUp: boolean) => {
  return roundUp
    ? (totalAmount ? digitsRoundUp(totalAmount - amount, 'round', 100) : 0)
    : (totalAmount ? totalAmount - amount : 0)
}
</script>

<template>
  <div class="w-dvw md:w-[500px] flex flex-col mt-8 px-8 pb-28 gap-4">
    <div class="w-full flex items-center justify-end flex-wrap gap-4">
      <p class="text-2xl font-bold">
        {{ $t('diary.title', { carNickName: selectedVehicleData?.carNickName ?? '' }) }}
      </p>
      <div class="flex-auto" />
      <AButton
        v-if="allDiaryCount !== 0"
        button-size="lg"
        :button-text="$t('buttons.rideInsert')"
        @click="navigateTo(`/diary/${selectedVehicleData?.id}`)"
      />
    </div>
    <DGDivider v-if="allDiaryCount !== 0" />
    <DGCard
      v-if="allDiaryCount !== 0"
      :ui="{ base: 'cursor-pointer hover:text-sky-800 hover:dark:text-sky-200' }"
      @click="navigateTo(`/vehicles/${selectedVehicleData?.id}`)"
    >
      <div class="w-full flex flex-col gap-4">
        <DGAvatar
          img-class="object-cover"
          :src="selectedVehicleData?.bikeImage ? selectedVehicleData?.bikeImage : '/image/no_bike_image.jpg'"
          size="3xl"
          :alt="selectedVehicleData?.bikeImage ?? ''"
          :ui="{ rounded: 'rounded-2xl', size: { '3xl': 'h-[180px] w-full md:w-[180px]' } }"
        />
        <div class="flex-auto" />
        <div class="text-md md:text-lg font-bold flex flex-col gap-2">
          <p>
            {{ $t('diary.summary.label.distance', { distance: comma(selectedVehicleData?.totalDistance ?? 0) }) }}
          </p>
          <p>
            {{ $t('diary.summary.label.efficient', { efficient: comma(selectedVehicleData?.totalEfficient ?? 0) }) }}
          </p>
          <p>
            {{ $t('diary.summary.label.totalFuel', { totalFuel: comma(selectedVehicleData?.totalFuelAmount ?? 0) }) }}
          </p>
          <p>
            {{ $t('diary.summary.label.paidAmount', { paidAmount: comma(selectedVehicleData?.totalPaidAmount ?? 0) }) }}
          </p>
          <p>
            {{ !selectedVehicleData?.currentFuelAmount ? $t('diary.summary.expectNoFuel') : $t('diary.summary.label.fuel', { fuel: comma(selectedVehicleData?.currentFuelAmount) }) }}
          </p>
        </div>
      </div>
    </DGCard>
    <DGDivider />
    <ADataRangePicker
      v-if="userInfoData?.mainVehicleId && allDiaryCount !== 0"
      v-model:search-month="searchMonth"
      class="w-fit"
    />
    <div
      v-if="!diaryData || allDiaryCount === 0"
      class="flex flex-col justify-center mt-40 gap-4"
    >
      <div
        v-if="userInfoData?.mainVehicleId && allDiaryCount === 0"
        class="flex flex-col gap-4"
      >
        <p class="text-2xl font-bold text-center">
          {{ $t('diary.noDiary') }}
        </p>
        <AButton
          v-if="allDiaryCount === 0"
          class="flex justify-center"
          button-variant="outline"
          button-size="xl"
          button-block
          :button-text="$t('buttons.rideSetting')"
          @click="navigateTo(`/vehicles/${userInfoData?.mainVehicleId}`)"
        />
      </div>
      <div
        v-if="!userInfoData?.mainVehicleId && allDiaryCount === 0"
        class="flex flex-col gap-4"
      >
        <p class="text-2xl font-bold text-center">
          {{ $t('diary.noVehicle') }}
        </p>
        <AButton
          button-color="sky"
          button-size="xl"
          button-variant="outline"
          button-block
          :button-text="$t('buttons.vehicleInsert')"
          @click="navigateTo('/vehicles/new')"
        />
      </div>
    </div>
    <DiaryListCard
      v-if="diaryData"
      v-model:diary-data="diaryData.serverData"
      :is-main-diary="false"
      @delete:diary="(diary: DiaryData) => deleteProcess(diary)"
    />
  </div>
</template>

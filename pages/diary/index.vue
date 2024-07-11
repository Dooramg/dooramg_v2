<script setup lang="ts">
import { sub } from 'date-fns'

const client = useSupabaseClient()

const toast = useToast()
const { t } = useLocale()
const { comma, digitsRoundUp } = useUi()

const { updateData, deleteData } = useFetchComposable()
const { refreshVehicleData } = useLoadVehicles()

const { userInfoData } = storeToRefs(useUserInfoStore())
const { selectedVehicleData } = storeToRefs(useVehicleStore())

useHead({
  title: t('pageTitle.diary'),
})

definePageMeta({
  layout: 'with-navigator',
  middleware: 'auth',
})

const searchMonth = ref({ start: sub(new Date(), { days: 30 }), end: new Date() })
const diaryDataCount = ref(0)

const { data: diaryData, refresh: refreshDiaryData } = useAsyncData('diaryData', async () => {
  if (!userInfoData.value?.mainVehicleId) {
    return null
  }

  const { data, count, error } = await client
    .from('vehicleManagement')
    .select('*, manageType(codeName, code), vehicles(carNickName)', { count: 'exact' })
    .eq('vehicleId', userInfoData.value?.mainVehicleId)
    .gt('createdAt', useDateFormat(searchMonth.value.start, 'YYYY-MM-DD').value)
    .lt('createdAt', useDateFormat(searchMonth.value.end, 'YYYY-MM-DD').value)
    .order('createdAt', { ascending: false })

  if (error) {
    throw createError({ statusMessage: error.message })
  }

  diaryDataCount.value = count ?? 0

  return { fetchData: data, count }
}, {
  immediate: true,
  watch: [searchMonth],
})

const { data: allDiaryDataCount, refresh: refreshAllDiaryData } = useAsyncData('allDiaryData', async () => {
  if (!userInfoData.value?.mainVehicleId) {
    return
  }

  const { count, error } = await client
    .from('vehicleManagement')
    .select('*, manageType(codeName, code), vehicles(carNickName)', { count: 'exact' })
    .eq('vehicleId', userInfoData.value?.mainVehicleId)
    .order('createdAt', { ascending: false })

  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return count
}, {
  immediate: true,
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

await refreshVehicleData()
await refreshAllDiaryData()
</script>

<template>
  <div class="w-dvw md:w-[500px] flex flex-col mt-8 px-8 pb-28 gap-4">
    <div class="w-full flex items-center justify-end flex-wrap gap-4">
      <p class="text-2xl font-bold">
        {{ $t('diary.title', { carNickName: selectedVehicleData?.carNickName ?? '' }) }}
      </p>
      <div class="flex-auto" />
      <AButton
        v-if="allDiaryDataCount !== 0"
        button-size="lg"
        :button-text="$t('buttons.rideInsert')"
        @click="navigateTo(`/diary/${selectedVehicleData?.id}`)"
      />
    </div>
    <DGDivider v-if="allDiaryDataCount !== 0" />
    <DGCard
      v-if="allDiaryDataCount !== 0"
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
      v-if="userInfoData?.mainVehicleId && allDiaryDataCount !== 0"
      v-model:search-month="searchMonth"
      class="w-fit"
    />
    <div
      v-if="!userInfoData?.mainVehicleId && allDiaryDataCount === 0"
      class="flex flex-col justify-center mt-40 gap-4"
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
    <div
      v-if="userInfoData?.mainVehicleId"
      class="flex flex-col justify-center gap-4"
    >
      <p
        v-if="allDiaryDataCount === 0"
        class="text-2xl font-bold text-center mt-40"
      >
        {{ $t('diary.noDiary') }}
      </p>
      <p
        v-if="allDiaryDataCount !== 0 && diaryData?.count === 0"
        class="text-2xl font-bold text-center mt-40"
      >
        {{ $t('diary.noDiaryMonth') }}
      </p>
      <AButton
        v-if="allDiaryDataCount === 0"
        class="flex justify-center"
        button-variant="outline"
        button-size="xl"
        button-block
        :button-text="$t('buttons.rideSetting')"
        @click="navigateTo(`/vehicles/${userInfoData?.mainVehicleId}`)"
      />
    </div>
    <DiaryListCard
      v-if="diaryData"
      v-model:diary-data="diaryData.fetchData"
      :is-main-diary="false"
      @delete:diary="(diary: DiaryData) => deleteProcess(diary)"
    />
  </div>
</template>

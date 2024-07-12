<script setup lang="ts">
import { sub } from 'date-fns'

const client = useSupabaseClient()

const toast = useToast()
const { t } = useLocale()
const { digitsRoundUp } = useUi()

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
    totalFuelAmount: diaryData.manageType.code === 'MTC002'
      ? selectedVehicleData.value?.totalFuelAmount ?? 0
      : recoverAmount(selectedVehicleData.value?.totalFuelAmount ?? 0, diaryData.fuelAmount, true),
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
    <DiaryVehicleCard :all-diary-data-count="allDiaryDataCount" />
    <DGDivider />
    <ADataRangePicker
      v-if="userInfoData?.mainVehicleId && allDiaryDataCount !== 0"
      v-model:search-month="searchMonth"
      class="w-fit"
    />
    <DiaryEmptyVehicle :all-diary-data-count="allDiaryDataCount" />
    <DiaryEmpty
      :diary-data="diaryData"
      :all-diary-data-count="allDiaryDataCount"
    />
    <DiaryListCard
      v-if="diaryData"
      v-model:diary-data="diaryData.fetchData"
      :is-main-diary="false"
      @delete:diary="(diary: DiaryData) => deleteProcess(diary)"
    />
  </div>
</template>

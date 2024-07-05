<script setup lang="ts">
import { sub } from 'date-fns'

const { t } = useLocale()
const { comma } = useUi()

const { userInfoData: userStoreData } = storeToRefs(useUserInfoStore())

useHead({
  title: t('pageTitle.diary'),
})

definePageMeta({
  layout: 'with-navigator',
  middleware: 'auth',
})

const searchMonth = ref({ start: sub(new Date(), { days: 30 }), end: new Date() })

const { data: vehicleData }: SerializeObject = await useFetch('/api/vehicles', {
  headers: useRequestHeaders(['cookie']),
  query: {
    vehicleId: userStoreData.value?.mainVehicleId,
  },
})

const { data: diaryData, refresh: _refreshDiaryData } = await useAsyncData('diaryData', async () => {
  const { data: serverData }: SerializeObject = await useFetch('/api/management', {
    headers: useRequestHeaders(['cookie']),
    query: {
      vehicleId: userStoreData.value?.mainVehicleId,
      dateFilter: true,
      startDate: searchMonth.value.start,
      endDate: searchMonth.value.end,
    },
  })

  return serverData.value
}, {
  immediate: true,
  watch: [searchMonth],
})
</script>

<template>
  <div class="w-dvw md:w-[500px] flex flex-col mt-8 px-4 gap-4">
    <div class="w-full flex items-center justify-end flex-wrap gap-4">
      <p class="text-2xl font-bold">
        {{ $t('diary.title', { carNickName: vehicleData?.carNickName ?? '' }) }}
      </p>
      <div class="flex-auto" />
      <AButton
        button-size="lg"
        button-color="amber"
        :button-text="$t('buttons.rideInsert')"
      />
    </div>
    <DGDivider />
    <DGCard>
      <div class="w-full flex flex-wrap gap-4">
        <DGAvatar
          img-class="object-cover"
          :src="vehicleData?.bikeImage ?? ''"
          size="4xl"
          :alt="vehicleData?.bikeImage ?? ''"
          :ui="{ rounded: 'rounded-2xl', size: { '4xl': 'h-[140px] w-[140px]' } }"
        />
        <div class="flex-auto" />
        <div class="flex flex-col gap-2">
          <p class="text-lg font-bold">
            {{ $t('diary.summary.label.distance', { distance: comma(vehicleData?.totalDistance) }) }}
          </p>
          <p class="text-lg font-bold">
            {{ $t('diary.summary.label.efficient', { efficient: comma(vehicleData?.totalEfficient) }) }}
          </p>
          <p class="text-lg font-bold">
            {{ $t('diary.summary.label.totalFuel', { totalFuel: comma(vehicleData?.totalFuelAmount) }) }}
          </p>
          <p class="text-lg font-bold">
            {{ $t('diary.summary.label.payAmount', { payAmount: comma(vehicleData?.totalPaidAmount) }) }}
          </p>
          <p class="text-lg font-bold">
            {{ !vehicleData?.currentFuelAmount ? $t('diary.summary.expectNoFuel') : $t('diary.summary.label.fuel', { fuel: comma(vehicleData?.currentFuelAmount) }) }}
          </p>
        </div>
      </div>
    </DGCard>
    <DGDivider />
    <ADataRangePicker v-model:search-month="searchMonth" />
    <div v-if="!diaryData || diaryData.count">
      <p>
        {{ $t('diary.noDiary') }}
      </p>
    </div>
    {{ diaryData }}
  </div>
</template>

<script setup lang="ts">
const client = useSupabaseClient()

const { vehicleCount } = storeToRefs(useVehicleStore())
const { individualArticleCount } = storeToRefs(useBoardStore())
const { userInfoData } = storeToRefs(useUserInfoStore())
const { allDiaryCount } = storeToRefs(useDiaryStore())

const fuelCount = ref(0)
const tripCount = ref(0)
const registrationCount = ref(0)

const { refresh: refreshAllDiaryDta }: SerializeObject = await useAsyncData('allDiaryData', async () => {
  if (!userInfoData.value?.mainVehicleId) {
    return
  }

  const { data, count, error } = await client
    .from('vehicleManagement')
    .select('*, manageType(codeName, code), vehicles(carNickName)', { count: 'exact' })
    .eq('vehicleId', userInfoData.value?.mainVehicleId)
    .order('createdAt', { ascending: false })

  if (error) {
    throw createError({ statusMessage: error.message })
  }

  calculateCounts(data)
  allDiaryCount.value = count ?? 0

  return data
}, {
  immediate: true,
})

const mergeGroupCount = computed(() => {
  return allDiaryCount.value + individualArticleCount.value + vehicleCount.value
})

const calculateCounts = (data: DiaryData[]) => {
  fuelCount.value = data.filter((diary: DiaryData) => diary.manageType.code === 'MTC001').length ?? 0
  tripCount.value = data.filter((diary: DiaryData) => diary.manageType.code === 'MTC002').length ?? 0
  registrationCount.value = data.filter((diary: DiaryData) => diary.manageType.code === 'MTC003').length ?? 0
}

refreshAllDiaryDta()
</script>

<template>
  <DGMeterGroup
    size="lg"
    :max="mergeGroupCount"
  >
    <template #indicator>
      <div class="flex flex-wrap gap-1.5 justify-between text-sm">
        <p class="text-md md:text-xl font-bold">
          {{ $t('main.manageTitle') }}
        </p>
        <p class="text-xs md:text-base text-neutral-600 dark:text-neutral-300">
          {{ $t('main.totalPoint', { point: mergeGroupCount }) }}
        </p>
      </div>
    </template>
    <DGMeter
      :value="vehicleCount"
      color="red"
      :label="$t('main.vehiclesPoint', { count: vehicleCount ?? 0 })"
      icon="i-tabler-pencil-plus"
    />
    <DGMeter
      :value="registrationCount"
      color="yellow"
      :label="$t('main.registrationPoint', { count: registrationCount ?? 0 })"
      icon="i-tabler-pencil-plus"
    />
    <DGMeter
      :value="fuelCount"
      color="emerald"
      :label="$t('main.fuelPoint', { count: fuelCount ?? 0 })"
      icon="i-tabler-gas-station"
    />
    <DGMeter
      :value="tripCount"
      color="sky"
      :label="$t('main.tripPoint', { count: tripCount ?? 0 })"
      icon="i-tabler-map"
    />
    <DGMeter
      :value="individualArticleCount ?? 0"
      color="violet"
      :label="$t('main.communityPoint', { count: individualArticleCount ?? 0 })"
      icon="i-tabler-article"
    />
  </DGMeterGroup>
  <div />
</template>

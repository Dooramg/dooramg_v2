<script setup lang="ts">
const user = useSupabaseUser()
const client = useSupabaseClient()

const toast = useToast()
const { comma } = useUi()

const { userInfoData, userCoreId } = storeToRefs(useUserInfoStore())
const { vehicleCount, selectedVehicleData } = storeToRefs(useVehicleStore())
const { individualArticleCount } = storeToRefs(useBoardStore())
const { allDiaryData, mainDiaryData, allDiaryCount, mainDiaryCount, fuelCount, tripCount, registrationCount } = storeToRefs(useDiaryStore())

definePageMeta({
  layout: 'main',
  middleware: 'auth',
})

const megerGroupCount = computed(() => {
  return allDiaryCount.value + individualArticleCount.value + vehicleCount.value
})

useAsyncData('initUserInfo', async () => {
  if (!user.value?.id) {
    return
  }

  const { data, error } = await client
    .from('userInfo')
    .select('*')
    .eq('id', user.value?.id)
    .single()

  if (!data && error) {
    toast.add({ title: error.message, description: 'at initUserInfo', color: 'red', timeout: 3000 })
    throw createError({ statusMessage: error.message })
  }

  userInfoData.value = data

  if (data) {
    userCoreId.value = (data as any).id as string
  }

  return data
}, {
  immediate: true,
  watch: [user],
})

await useAsyncData('allDiaryData', async () => {
  if (!userInfoData.value?.mainVehicleId) {
    return
  }

  const { data, count, error } = await client
    .from('vehicleManagement')
    .select('*, manageType(codeName, code), vehicles(carNickName)', { count: 'exact' })
    .eq('vehicleId', userInfoData.value?.mainVehicleId)
    .order('createdAt', { ascending: false })

  if (error) {
    toast.add({ title: error.message, description: 'at allDiaryData', color: 'red', timeout: 3000 })
    throw createError({ statusMessage: error.message })
  }

  allDiaryData.value = data
  allDiaryCount.value = count ?? 0
}, {
  immediate: true,
})

await useAsyncData('diaryData', async () => {
  if (!userInfoData.value?.mainVehicleId) {
    return
  }

  const { data, count, error } = await client
    .from('vehicleManagement')
    .select('*, manageType(codeName, code), vehicles(carNickName)', { count: 'exact' })
    .eq('vehicleId', userInfoData.value?.mainVehicleId)
    .order('createdAt', { ascending: false })
    .range(0, 2)

  if (error) {
    toast.add({ title: error.message, description: 'at diaryData', color: 'red', timeout: 3000 })
    throw createError({ statusMessage: error.message })
  }

  mainDiaryData.value = data
  mainDiaryCount.value = count ?? 0
}, {
  immediate: true,
})

await useAsyncData('myArticleData', async () => {
  if (!user.value?.id) {
    return
  }

  const { count, error } = await client
    .from('boardCommunity')
    .select('*, communityLikeCount(*), userInfo(nickName, isAdmin)', { count: 'exact' })
    .order('createdAt', { ascending: false })
    .eq('userId', user.value?.id)

  if (error) {
    toast.add({ title: error.message, description: 'at myArticleData', color: 'red', timeout: 3000 })
    throw createError({ statusMessage: error.message })
  }

  individualArticleCount.value = count ?? 0
}, {
  immediate: true,
  watch: [user],
})

const diaryDetailColor = (code: string) => {
  switch (code) {
    case 'MTC001':
      return 'border-yellow-400'
    case 'MTC002':
      return 'border-teal-400'
    case 'MTC003':
      return 'border-rose-400'
    default:
      return 'border-neutral-400'
  }
}
</script>

<template>
  <div class="w-dvw md:w-[500px] flex flex-col mt-8 px-8 pb-28 gap-4">
    <div
      class="relative w-full h-fit flex flex-col rounded-xl cursor-pointer"
      @click="navigateTo(`/vehicles/${selectedVehicleData?.id}`)"
    >
      <div
        class="w-full h-[380px] inset-0 bg-cover bg-center rounded-xl opacity-50"
        :style="{ backgroundImage: `url(${selectedVehicleData?.bikeImage ? selectedVehicleData.bikeImage : 'https://api.dooramg.com/storage/v1/object/public/assets/no_bike_image.jpg'})` }"
      />
      <div class="absolute h-[180px] w-full px-4 py-2">
        <div class="flex flex-col flex-wrap gap-3">
          <div class="flex flex-col">
            <div class="flex items-center gap-4">
              <p class="text-3xl font-bold break-keep">
                {{ $t('main.hi', { carNickName: selectedVehicleData?.carNickName }) }}
              </p>
              <div class="flex-auto" />
              <DGAvatar
                :src="selectedVehicleData?.manufacturer.logoImage"
                size="lg"
                alt="brand-logo"
                :ui="{ background: 'bg-transparent' }"
              />
            </div>
            <p class="text-md font-bold">
              {{ $t('main.model', { model: selectedVehicleData?.vehicleModel.name === '직접입력' ? selectedVehicleData.manualModelName : selectedVehicleData?.vehicleModel.name, makeYear: selectedVehicleData?.makeYear }) }}
            </p>
          </div>
          <div class="w-full flex flex-col-reverse items-end gap-3">
            <div class="w-full flex flex-col gap-2">
              <p class="text-md font-bold">
                {{ !selectedVehicleData?.currentFuelAmount ? $t('main.noEfficient') : $t('main.currentFuel', { fuel: comma(selectedVehicleData?.currentFuelAmount) }) }}
              </p>
              <p class="text-md font-bold">
                {{ $t('main.efficient', { efficient: comma(selectedVehicleData?.totalEfficient ?? 0) }) }}
              </p>
              <p class="text-md font-bold">
                {{ $t('main.distance', { distance: comma(selectedVehicleData?.totalDistance ?? 0) }) }}
              </p>
            </div>
            <div class="flex-auto hidden sm:flex" />
            <ALicensePlate
              :head-text="selectedVehicleData?.plateHeadText ?? '서울'"
              :middle-text="selectedVehicleData?.plateMiddleText ?? '강남'"
              :tail-text="selectedVehicleData?.plateTailText ?? '차'"
              :number-text="parseInt(selectedVehicleData?.plateNumber ?? '1004')"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="userInfoData?.mainVehicleId"
      class="w-full flex flex-wrap justify-end gap-4"
    >
      <AButton
        button-color="amber"
        button-size="xl"
        button-variant="outline"
        :button-text="mainDiaryCount ? $t('buttons.rideInsert') : $t('buttons.rideSetting')"
        @click="navigateTo(mainDiaryCount ? `/diary/${userInfoData.mainVehicleId}` : `/vehicles/${userInfoData.mainVehicleId}`)"
      />
      <AButton
        button-color="sky"
        button-size="xl"
        button-variant="outline"
        :button-text="$t('buttons.vehicleInsert')"
        @click="navigateTo('/vehicles/new')"
      />
    </div>
    <DGMeterGroup
      size="lg"
      :max="megerGroupCount"
    >
      <template #indicator>
        <div class="flex flex-wrap gap-1.5 justify-between text-sm">
          <p class="text-md md:text-xl font-bold">
            {{ $t('main.manageTitle') }}
          </p>
          <p class="text-xs md:text-base text-neutral-600 dark:text-neutral-300">
            {{ $t('main.totalPoint', { point: megerGroupCount }) }}
          </p>
        </div>
      </template>
      <DGMeter
        :value="vehicleCount ?? 0"
        color="red"
        :label="$t('main.vehiclesPoint', { count: vehicleCount ?? 0 })"
        icon="i-tabler-pencil-plus"
      />
      <DGMeter
        :value="registrationCount ?? 0"
        color="yellow"
        :label="$t('main.registrationPoint', { count: registrationCount ?? 0 })"
        icon="i-tabler-pencil-plus"
      />
      <DGMeter
        :value="fuelCount ?? 0"
        color="emerald"
        :label="$t('main.fuelPoint', { count: fuelCount ?? 0 })"
        icon="i-tabler-gas-station"
      />
      <DGMeter
        :value="tripCount ?? 0"
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
    <DGDivider />
    <div class="w-full flex flex-col gap-4">
      <p class="text-2xl font-bold">
        {{ $t('main.latestDiary') }}
      </p>
      <DGCard
        v-for="(diary, index) in mainDiaryData"
        :key="index"
        :ui="{ base: `border-2 ${diaryDetailColor(diary.manageType.code)}` }"
      >
        <template #header>
          <div class="flex flex-wrap items-center gap-2">
            <DGBadge
              color="amber"
              size="lg"
              variant="soft"
              :label="diary.manageType.codeName"
            />
            <div
              v-if="diary.manageType.code === 'MTC001'"
              class="flex items-center gap-2"
            >
              <DGAvatar
                img-class="object-cover"
                :src="diary.stationImage ? diary.stationImage : 'https://via.placeholder.com/150?text=%3F&font-size=50'"
                size="md"
                :alt="diary?.stationImage"
              />
              <p class="text-lg font-bold">
                {{ diary.fuelStationName }}
              </p>
            </div>
            <div class="flex-auto" />
            <ANuxtTime
              custom-class="text-base font-bold"
              :date-time="diary.createdAt"
            />
          </div>
        </template>
        <div class="text-md md:text-lg font-bold flex flex-col gap-2">
          <p v-if="diary.manageType.code === 'MTC002'">
            {{ $t('diary.summary.destination', { destination: diary.destination }) }}
          </p>
          <p v-if="diary.efficient">
            {{ $t('diary.summary.sectionEfficient', { efficient: comma(diary.efficient) }) }}
          </p>
          <p v-if="diary.fuelAmount">
            {{ $t('diary.summary.fuel', { fuel: comma(diary.fuelAmount) }) }}
          </p>
          <p>
            {{ $t('diary.summary.paidAmount', { paidAmount: comma(diary.paidAmount) }) }}
          </p>
          <p v-if="diary.driveDistance">
            {{ $t('diary.summary.distance', { distance: comma(diary.driveDistance) }) }}
          </p>
        </div>
      </DGCard>
      <AButton
        class="flex justify-center"
        button-variant="outline"
        button-size="xl"
        :button-text="mainDiaryCount ? $t('main.moreDiary') : $t('buttons.rideSetting')"
        @click="mainDiaryCount ? navigateTo('/diary') : navigateTo(`/vehicles/${userInfoData?.mainVehicleId}`)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const client = useSupabaseClient()

const { comma } = useUi()
const { generateTempName } = useUi()
const { url } = useImageStorage()

const { refreshVehicleData } = useLoadVehicles()
const { upsertData, updateData } = useFetchComposable()

const { userInfoData, userCoreId } = storeToRefs(useUserInfoStore())
const { vehicleData, selectedVehicleData } = storeToRefs(useVehicleStore())
const { individualArticleCount } = storeToRefs(useBoardStore())
const { mainDiaryCount } = storeToRefs(useDiaryStore())

definePageMeta({
  layout: 'main',
  middleware: 'auth',
})

const initUserInfoData = async () => {
  const { data, error } = await client
    .from('userInfo')
    .select('*')
    .eq('id', String(user.value?.id))
    .single()

  if (error) {
    console.warn('error Login: ', error)
  }

  if (!data) {
    await upsertData('userInfo', saveData(), '', '')
    userInfoData.value = saveData()

    return
  }

  userCoreId.value = user.value?.id ?? ''
  userInfoData.value = data

  await updateMainVehicle()
}

const updateMainVehicle = async () => {
  if (!vehicleData.value) {
    await refreshVehicleData()
  }

  const initMainVehicleId = vehicleData.value?.[0]?.id ?? ''
  await updateData('userInfo', { mainVehicleId: userInfoData.value?.mainVehicleId ?? initMainVehicleId }, String(user.value?.id))
}

const saveData = () => {
  return {
    id: user.value?.id ?? userCoreId.value,
    nickName: user.value?.user_metadata.full_name ? user.value?.user_metadata.full_name : generateTempName(),
    email: user.value?.email,
    avatarImage: user.value?.user_metadata.avatar_url ? user.value?.user_metadata.avatar_url : url(true, '/assets/logo-non-text.png'),
    signInAt: user.value?.created_at,
  }
}

const checkSelectVehicleData = () => {
  selectedVehicleData.value = userInfoData.value?.mainVehicleId
    ? vehicleData.value?.find(vehicle => vehicle.id === userInfoData.value?.mainVehicleId)
    : vehicleData.value?.[0]
}

const { data: mainDiaryData, refresh: refreshMainDiaryData }: SerializeObject = await useAsyncData('diaryData', async () => {
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
    throw createError({ statusMessage: error.message })
  }

  mainDiaryCount.value = count ?? 0

  return data
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
    throw createError({ statusMessage: error.message })
  }

  individualArticleCount.value = count ?? 0
}, {
  immediate: true,
  watch: [user],
})

watch(user, async () => {
  if (user.value) {
    await initUserInfoData()
    checkSelectVehicleData()
    refreshMainDiaryData()
  }
}, {
  immediate: true,
})
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
    <LazyMainMeter />
    <DGDivider />
    <div class="w-full flex flex-col gap-4">
      <p class="text-2xl font-bold">
        {{ $t('main.latestDiary') }}
      </p>
      <LazyDiaryListCard
        v-if="mainDiaryData"
        :diary-data="mainDiaryData"
        is-main-diary
      />
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

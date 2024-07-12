<script setup lang="ts">
const user = useSupabaseUser()
const client = useSupabaseClient()

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
  if (initMainVehicleId) {
    await updateData('userInfo', { mainVehicleId: userInfoData.value?.mainVehicleId ?? initMainVehicleId }, String(user.value?.id))
  }
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

const { data: mainDiaryData, refresh: refreshMainDiaryData }: SerializeObject = useAsyncData('diaryData', async () => {
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

useAsyncData('myArticleData', async () => {
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
  <div>
    <MainEmpty v-if="!userInfoData?.mainVehicleId" />
    <div
      v-else
      class="w-dvw md:w-[500px] flex flex-col mt-8 px-8 pb-28 gap-4"
    >
      <MainDisplayCard />
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
          button-block
          button-size="xl"
          :button-text="mainDiaryCount ? $t('main.moreDiary') : $t('buttons.rideSetting')"
          @click="mainDiaryCount ? navigateTo('/diary') : navigateTo(`/vehicles/${userInfoData?.mainVehicleId}`)"
        />
      </div>
    </div>
  </div>
</template>

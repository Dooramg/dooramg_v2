<script setup lang="ts">
const user = useSupabaseUser()
const client = useSupabaseClient<SupabaseDataBase>()

const { userCoreId, userInfoData } = storeToRefs(useUserInfoStore())

const { vehicleData: vehicleStoreData } = storeToRefs(useVehicleStore())
const { refreshVehicleData } = useLoadVehicle()

const { generateTempName } = useUi()
const { url } = useImageStorage()

const loadUserData = async () => {
  if (!user.value) {
    return
  }

  const { data, error } = await client
    .from('userInfo')
    .select('*')
    .eq('id', String(user.value?.id))
    .single()

  if (error) {
    console.warn('error Login: ', error)
  }

  if (!data) {
    await client
      .from('userInfo')
      .upsert(saveData())
    userInfoData.value = saveData()
    return
  }

  userCoreId.value = data.id
  userInfoData.value = data
  refreshVehicleData()
  updateMainVehicle()
  navigateTo('/main')
}

const updateMainVehicle = async () => {
  if (!vehicleStoreData.value) {
    return
  }

  await client
    .from('userInfo')
    .update({ mainVehicleId: vehicleStoreData.value[0].id })
    .eq('id', String(user.value?.id))
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

watch(() => user, () => {
  if (user.value) {
    loadUserData()
  }
}, { immediate: true })
</script>

<template>
  <div class="h-dvh flex flex-col items-center justify-center">
    <div class="flex flex-col items-center gap-8">
      <Icon
        name="svg-spinners:clock"
        :width="120"
        :height="120"
      />
      <p class="text-2xl font-bold">
        {{ $t('login.process') }}
      </p>
    </div>
  </div>
</template>

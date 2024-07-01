<script setup lang="ts">
const client = useSupabaseClient<SupabaseDataBase>()

const { userInfoData: userStoreData } = storeToRefs(useUserInfoStore())

const { data: avatarImage } = useAsyncData('avatarImage', async () => {
  if (!userStoreData.value?.avatarImageName) {
    return userStoreData.value?.avatarImage
  }
  const { data } = await client.storage
    .from('user_avatar')
    .getPublicUrl(userStoreData.value?.avatarImageName)
  return data.publicUrl
})
</script>

<template>
  <DGAvatar
    class="mr-2"
    img-class="object-cover"
    :src="avatarImage"
    size="md"
    alt="Dooramg Avatar"
  />
</template>

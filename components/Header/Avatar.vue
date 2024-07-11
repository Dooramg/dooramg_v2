<script setup lang="ts">
const { userInfoData } = storeToRefs(useUserInfoStore())

console.log('header', userInfoData.value)
</script>

<template>
  <DGAvatar
    img-class="object-cover"
    :src="userInfoData?.avatarImage"
    size="md"
    alt="Dooramg Avatar"
  />
</template>

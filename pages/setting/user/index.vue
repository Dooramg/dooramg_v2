<script setup lang="ts">
const { auth } = useSupabaseClient()

const toast = useToast()
const { t } = useI18n()

const { userCoreId, userInfoData } = storeToRefs(useUserInfoStore())
const { vehicleData } = storeToRefs(useVehicleStore())

useHead({
  title: t('pageTitle.user'),
})

definePageMeta({
  layout: 'without-navigator',
  middleware: 'auth',
})

const logoutProcess = async () => {
  const { error } = await auth.signOut()
  if (error) {
    toast.add({ title: error.message, color: 'red', timeout: 2000 })
  }
  userCoreId.value = ''
  userInfoData.value = null
  vehicleData.value = null
  toast.add({ title: t('messages.logoutSuccess.title'), description: t('messages.logoutSuccess.description'), color: 'amber', timeout: 2000 })
  navigateTo('/login')
}
</script>

<template>
  <div class="flex flex-col mt-8">
    <p class="text-2xl font-bold px-8">
      {{ $t('user.title') }}
    </p>
    <div
      v-if="userInfoData"
      class="w-dvw md:w-[500px] flex flex-col items-center gap-8 mt-20 px-8"
    >
      <div class="flex items-end gap-4 mt-4">
        <DGAvatar
          img-class="object-cover"
          :src="userInfoData.avatarImage"
          size="3xl"
          :alt="userInfoData.nickName"
        />
        <p class="text-lg">
          {{ $t('user.surHello', { userName: userInfoData.nickName }) }}
        </p>
      </div>
      <div class="flex flex-col items-start gap-4 text-md">
        <p>
          {{ $t('user.email', { email: userInfoData.email }) }}
        </p>
        <p>
          {{ userInfoData.mobile ? $t('user.mobile', { mobile: userInfoData.mobile }) : $t('messages.noMobile') }}
        </p>
        <p>
          {{ userInfoData.address ? $t('user.address', { address: userInfoData.address.concat(', ', userInfoData.addressDetail ?? '') }) : $t('messages.noAddress') }}
        </p>
      </div>
      <div class="flex justify-center items-center mt-4 gap-8">
        <AButton
          use-leading
          button-variant="outline"
          :button-text="$t('buttons.edit')"
          icon-name="i-line-md-edit-twotone-full"
          :icon-size="16"
          @click="navigateTo('/setting/user/edit')"
        />
        <AButton
          use-leading
          button-variant="outline"
          :button-text="$t('buttons.logout')"
          icon-name="i-line-md-logout"
          :icon-size="16"
          @click="logoutProcess"
        />
      </div>
    </div>
  </div>
</template>

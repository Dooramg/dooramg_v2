<script setup lang="ts">
const client = useSupabaseClient<SupabaseDataBase>()
const { auth } = useSupabaseClient()

const toast = useToast()
const { t } = useLocale()
const { go, back } = useRouter()
const { path } = useRoute()

const { userCoreId, userInfoData } = storeToRefs(useUserInfoStore())
const { vehicleData } = storeToRefs(useVehicleStore())

const deleteConfirmTrigger = ref(false)
const isEditPage = computed(() => path.includes('edit'))

const deleteAccount = async () => {
  await client
    .from('vehicleManagement')
    .delete()
    .eq('userId', userInfoData.value?.id ?? '')

  await client
    .from('vehicles')
    .delete()
    .eq('userId', userInfoData.value?.id ?? '')

  await client
    .from('userInfo')
    .delete()
    .eq('id', userInfoData.value?.id ?? '')
  toast.add({ title: t('messages.logindeleteAccountSuccessSuccess.title'), description: t('messages.deleteAccountSuccess.description'), color: 'amber', timeout: 2000 })
  logoutProcess()
}

const logoutProcess = async () => {
  const { error } = await auth
    .signOut()

  if (error) {
    toast.add({ title: error.message, color: 'red', timeout: 2000 })
  }

  userCoreId.value = ''
  userInfoData.value = null
  vehicleData.value = null
  navigateTo('/login')
}
</script>

<template>
  <div class="h-dvh w-auto lg:w-[500px] flex flex-col items-start">
    <div class="w-dvw md:w-[500px] mt-4 px-4 md:px-0 flex justify-start">
      <Icon
        class="ml-2 cursor-pointer"
        name="line-md:arrow-small-left"
        :width="36"
        :height="36"
        @click="back"
      />
      <div class="flex-auto" />
      <Icon
        class="refresh cursor-pointer"
        name="line-md:rotate-270"
        :width="36"
        :height="36"
        @click="go(0)"
      />
      <AButton
        v-if="isEditPage"
        custom-class="mr-4"
        button-size="sm"
        button-variant="outline"
        :button-text="$t('buttons.deleteAccount')"
        @click="() => deleteConfirmTrigger = true"
      />
    </div>
    <slot />
    <InstallPwa />
    <DialogConfirm
      :dialog-trigger="deleteConfirmTrigger"
      custom-class="confirm-dialog"
      :full-screen="false"
      :title="$t('setting.deleteDialog.title')"
      :first-button-text="$t('setting.deleteDialog.confirm')"
      :second-button-text="$t('setting.deleteDialog.reject')"
      @click-first-button="deleteAccount"
      @click-second-button="() => deleteConfirmTrigger = false"
      @close-dialog="() => deleteConfirmTrigger = false"
    >
      <div
        v-for="(text, index) in $tm('setting.deleteDialog.description')"
        :key="index"
        class="ml-16"
      >
        <p class="text-lg">
          {{ $rt(text) }}
        </p>
      </div>
    </DialogConfirm>
  </div>
</template>

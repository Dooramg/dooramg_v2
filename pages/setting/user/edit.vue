<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const { updateData, loadStorage, uploadStorage, deleteData, logout } = useFetchComposable()
const { vehicleData } = storeToRefs(useVehicleStore())
const { emailRegex, numberRegex } = useUi()
const toast = useToast()
const { t } = useLocale()

const client = useSupabaseClient<SupabaseDataBase>()

const { userCoreId, userInfoData } = storeToRefs(useUserInfoStore())

useHead({
  title: t('pageTitle.user'),
})

definePageMeta({
  layout: 'without-navigator',
  middleware: 'auth',
})

const schema = object({
  nickName: string()
    .required(t('validate.inputNickName')),
  mobile: string()
    .required(t('validate.inputMobile'))
    .min(10, t('validate.inputMobileMin'))
    .max(15, t('validate.inputMobileMax'))
    .matches(numberRegex, t('validate.inputMobileFormat')),
  email: string()
    .required(t('validate.inputEmail'))
    .matches(emailRegex, t('validate.inputFormat')),
})

type Schema = InferType<typeof schema>

const editUserData = ref({
  id: '',
  email: '',
  nickName: '',
  avatarImage: '',
  avatarImageName: '',
  mobile: '',
  address: '',
  addressDetail: '',
})
const postCodeTrigger = ref(false)
const insertAddressDetail = ref(false)
const deleteConfirmTrigger = ref(false)

const initEditUserData = () => {
  if (!userInfoData.value) {
    return
  }
  editUserData.value.id = userInfoData.value.id
  editUserData.value.email = userInfoData.value.email ?? ''
  editUserData.value.nickName = userInfoData.value.nickName ?? ''
  editUserData.value.mobile = userInfoData.value.mobile ?? ''
  editUserData.value.address = userInfoData.value.address ?? ''
  editUserData.value.addressDetail = userInfoData.value.addressDetail ?? ''
  editUserData.value.avatarImage = userInfoData.value.avatarImage ?? ''
  editUserData.value.avatarImageName = userInfoData.value.avatarImageName ?? ''
}

initEditUserData()

const genUid = () => {
  return (new Date().getTime() + Math.random().toString(36).substring(2, 16))
}

const uploadImage = async (file: File) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${genUid()}.${fileExt}`

  await uploadStorage('user_avatar', fileName, file)

  toast.add({ title: t('messages.uploadSuccess.title'), description: t('messages.uploadSuccess.description'), color: 'emerald', timeout: 3000 })
  await downloadImage(fileName)
}

const downloadImage = async (imageName: string) => {
  if (!imageName) {
    return
  }

  const imageUrl = await loadStorage('user_avatar', imageName)

  editUserData.value.avatarImage = imageUrl
  editUserData.value.avatarImageName = imageName

  if (userInfoData.value) {
    userInfoData.value.avatarImage = imageUrl
    userInfoData.value.avatarImageName = imageName
  }
}

const updateUserInfo = async (event: FormSubmitEvent<Schema>) => {
  if (!event.isTrusted || !editUserData.value) {
    return
  }

  await updateData('userInfo', editUserData.value, editUserData.value.id)

  toast.add({ title: t('messages.updateSuccess.title'), description: t('messages.updateSuccess.description'), color: 'amber', timeout: 2000 })
  updateUserData()
  navigateTo('/setting')
}

const SearchInputAddress = () => {
  postCodeTrigger.value = true
}

const selectAddress = (address: string) => {
  if (!userInfoData.value) {
    return
  }

  userInfoData.value.address = address
  postCodeTrigger.value = false
  insertAddressDetail.value = true
}

const updateUserData = async () => {
  const { data, error } = await client
    .from('userInfo')
    .select('*')
    .eq('id', userCoreId.value)
    .single()

  if (error) {
    toast.add({ title: error.message, color: 'red', timeout: 2000 })
  }

  userInfoData.value = data
}

const deleteAccount = async () => {
  await deleteData('vehicleManagement', false, 'id', userInfoData.value?.id ?? '', '', '', '', '')
  await deleteData('vehicles', false, 'id', userInfoData.value?.id ?? '', '', '', '', '')
  await deleteData('userInfo', false, 'id', userInfoData.value?.id ?? '', '', '', '', '')

  await logout()

  userCoreId.value = ''
  userInfoData.value = null
  vehicleData.value = null
  navigateTo('/login')
}

watch(userInfoData, () => {
  if (!userInfoData.value) {
    return
  }

  userInfoData.value.avatarImageName
    ? downloadImage(userInfoData.value.avatarImageName)
    : editUserData.value.avatarImage = userInfoData.value.avatarImage || ''
})
</script>

<template>
  <div class="flex flex-col mt-8">
    <p class="text-2xl font-bold px-8">
      {{ $t('user.title') }}
    </p>
    <DGForm
      :schema="schema"
      :state="editUserData"
      class="w-dvw md:w-[500px] space-y-2 mt-8 px-8 gap-4"
      @submit="updateUserInfo"
    >
      <DGFormGroup
        :label="$t('labelTexts.avatar')"
        name="avatar"
        size="xl"
        required
      >
        <DGAvatar
          img-class="object-cover"
          :src="editUserData.avatarImage"
          size="3xl"
          :alt="editUserData.nickName"
        />
        <AUploadFile
          :file-size-alarm="$t('validate.imageUploadSize')"
          :file-type-alarm="$t('validate.imageUploadFormat')"
          :limit-type="['image/jpeg', 'image/png', 'image/gif']"
          :limit-height="2048"
          :limit-width="2048"
          :limit-size="10"
          @upload:file="(file: File) => uploadImage(file)"
        />
      </DGFormGroup>
      <DGFormGroup
        :label="$t('labelTexts.nickName')"
        name="magicLink"
        size="xl"
        required
      >
        <AInput
          v-model:input-data="editUserData.nickName"
          clearable
          :input-placeholder="$t('placeholder.inputNickName')"
          leading-icon-name="i-line-md-person-filled"
        />
      </DGFormGroup>
      <DGFormGroup
        :label="$t('labelTexts.mobile')"
        name="mobile"
        size="xl"
        required
      >
        <AInput
          v-model:input-data="editUserData.mobile"
          clearable
          :input-placeholder="$t('placeholder.inputMobile')"
          leading-icon-name="i-line-md-phone-twotone"
          @change="() => editUserData.mobile = editUserData.mobile.replace(/-/g, '')"
        />
      </DGFormGroup>
      <DGFormGroup
        :label="$t('labelTexts.email')"
        name="address"
        size="xl"
        required
      >
        <AInput
          v-model:input-data="editUserData.email"
          clearable
          :input-placeholder="$t('placeholder.inputEmail')"
          leading-icon-name="i-line-md-email-twotone"
        />
      </DGFormGroup>
      <DGFormGroup
        :label="$t('labelTexts.address')"
        name="address"
        size="xl"
      >
        <AInput
          v-model:input-data="editUserData.address"
          clearable
          :input-placeholder="$t('placeholder.inputAddress')"
          leading-icon-name="i-line-md-map-marker-twotone"
          @keyup.enter="SearchInputAddress"
        >
          <template #trailing-slot>
            <AButton
              v-if="editUserData.address"
              custom-class="mr-2"
              use-leading
              :button-padding="false"
              button-variant="ghost"
              icon-name="line-md:search"
              @click="SearchInputAddress"
            />
          </template>
        </AInput>
      </DGFormGroup>
      <DGFormGroup
        v-if="insertAddressDetail || editUserData.address"
        :label="$t('labelTexts.detailAddress')"
        name="addressDetail"
        size="xl"
      >
        <AInput
          v-model:input-data="editUserData.addressDetail"
          clearable
          :input-placeholder="$t('placeholder.inputAddress')"
        />
      </DGFormGroup>
      <DGFormGroup class="flex justify-end pt-4">
        <div class="w-dvw md:w-[400px] flex gap-4">
          <AButton
            custom-class="mr-4"
            button-size="xs"
            button-variant="ghost"
            :button-text="$t('buttons.deleteAccount')"
            @click="() => deleteConfirmTrigger = true"
          />
          <div class="flex-auto" />
          <AButton
            use-leading
            button-variant="outline"
            button-size="md"
            icon-name="line-md:pencil-twotone"
            :icon-size="18"
            :button-text="$t('buttons.save')"
            @click="updateUserInfo"
          />
          <AButton
            use-leading
            button-variant="outline"
            button-size="md"
            icon-name="line-md:close-circle-twotone"
            :icon-size="18"
            :button-text="$t('buttons.cancel')"
            @click="navigateTo('/setting/user')"
          />
        </div>
      </DGFormGroup>
    </DGForm>
    <DialogPostCode
      :dialog-trigger="postCodeTrigger"
      :search-keyword="editUserData.address"
      @address:select="selectAddress"
      @close="() => postCodeTrigger = false"
    />
    <DialogConfirm
      :dialog-trigger="deleteConfirmTrigger"
      title-class="text-2xl font-bold"
      :full-screen="false"
      :title="$t('setting.deleteDialog.title')"
      :first-button-text="$t('setting.deleteDialog.confirm')"
      :second-button-text="$t('setting.deleteDialog.reject')"
      @click:first-button="deleteAccount"
      @click:second-button="() => deleteConfirmTrigger = false"
      @close="() => deleteConfirmTrigger = false"
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

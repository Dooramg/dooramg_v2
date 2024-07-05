<script setup lang="ts">
const toast = useToast()
const { t } = useLocale()

const { upsertData } = useFetchComposable()

const { userCoreId } = storeToRefs(useUserInfoStore())

useHead({
  title: t('pageTitle.noticeWrite'),
})

definePageMeta({
  layout: 'without-navigator',
  middleware: 'auth',
})

const writeCommunityDetailData = ref({
  userId: userCoreId.value,
  title: '',
  content: '',
  isPublished: true,
  useLocation: false,
  locationAddress: '',
  latitude: 0,
  longitude: 0,
})

const createCommunityArticle = async () => {
  await upsertData('boardCommunity', writeCommunityDetailData.value, '', '')

  toast.add({ title: t('messages.articleWriteSuccess.title'), description: t('messages.articleWriteSuccess.description'), color: 'amber', timeout: 2000 })
  navigateTo('/board/community')
}

const updateNaverMapData = (markAddress: NaverResAddr, latitude: number, longitude: number) => {
  markAddress.roadAddress
    ? writeCommunityDetailData.value.locationAddress = markAddress.roadAddress
    : writeCommunityDetailData.value.locationAddress = markAddress.jibunAddress
  writeCommunityDetailData.value.latitude = latitude
  writeCommunityDetailData.value.longitude = longitude
}
</script>

<template>
  <div class="w-dvw md:w-[500px] flex flex-col items-end mt-8 px-4 gap-4">
    <p class="w-full text-xl font-bold">
      {{ $t('board.community.writeTitle') }}
    </p>
    <AInput
      v-model:input-data="writeCommunityDetailData.title"
      class="w-full"
      clearable
      input-color="amber"
      :input-placeholder="$t('placeholder.noticeTitle')"
    />
    <div class="w-full flex justify-center gap-4">
      <p class="text-md font-bold">
        {{ $t('labelTexts.published') }}
      </p>
      <div class="flex-auto" />
      <DGCheckbox
        v-model="writeCommunityDetailData.isPublished"
        color="amber"
        :label="writeCommunityDetailData.isPublished ? $t('buttons.public') : $t('buttons.secret')"
      />
    </div>
    <TiptapTextEditor
      :text-data="writeCommunityDetailData.content"
      full-option
      @update:model-value="(text: string) => writeCommunityDetailData.content = text"
    />
    <div class="w-full flex justify-center items-center gap-2">
      <p class="text-md font-bold">
        {{ $t('labelTexts.useLocation') }}
      </p>
      <DGTooltip
        :text="$t('board.useMapInformation')"
        placement="top"
      >
        <Icon
          name="i-line-md-question-circle"
          :width="20"
          :height="20"
        />
      </DGTooltip>
      <div class="flex-auto" />
      <div class="flex items-center gap-2">
        <p>
          {{ writeCommunityDetailData.useLocation ? $t('buttons.use') : $t('buttons.noUse') }}
        </p>
        <DGToggle
          v-model="writeCommunityDetailData.useLocation"
          color="amber"
        />
      </div>
    </div>
    <NaverMaps
      v-if="writeCommunityDetailData.useLocation"
      class="w-full"
      :is-readable="false"
      @update:address="updateNaverMapData"
    />
    <AInput
      v-if="writeCommunityDetailData.useLocation && writeCommunityDetailData.locationAddress"
      v-model:input-data="writeCommunityDetailData.locationAddress"
      class="w-full"
      clearable
      input-color="amber"
      :input-placeholder="$t('placeholder.selectAddress')"
    />
    <AButton
      custom-class="w-fit"
      :button-text="$t('buttons.write')"
      @click="createCommunityArticle"
    />
  </div>
</template>

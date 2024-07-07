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

const writeNoticeDetailData = ref({
  userId: userCoreId.value,
  title: '',
  content: '',
  isPublished: true,
  useLocation: false,
  locationAddress: '',
  latitude: 0,
  longitude: 0,
})

const createNoticeArticle = async () => {
  await upsertData('boardNotice', writeNoticeDetailData.value, '', '')

  toast.add({ title: t('messages.articleWriteSuccess.title'), description: t('messages.articleWriteSuccess.description'), color: 'amber', timeout: 2000 })
  navigateTo('/board/notice')
}
</script>

<template>
  <div class="w-dvw md:w-[500px] flex flex-col items-end mt-8 px-8 gap-4">
    <p class="w-full text-xl font-bold">
      {{ $t('board.notice.writeTitle') }}
    </p>
    <DGDivider />
    <AInput
      v-model:input-data="writeNoticeDetailData.title"
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
        v-model="writeNoticeDetailData.isPublished"
        color="amber"
        :label="writeNoticeDetailData.isPublished ? $t('buttons.public') : $t('buttons.secret')"
      />
    </div>
    <TiptapTextEditor
      :text-data="writeNoticeDetailData.content"
      full-option
      @update:model-value="(text: string) => writeNoticeDetailData.content = text"
    />
    <DGDivider />
    <AButton
      custom-class="w-fit"
      :button-text="$t('buttons.write')"
      @click="createNoticeArticle"
    />
  </div>
</template>

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
  title: '',
  content: '',
  userId: userCoreId.value,
  locationAddress: '',
  latitude: 0,
  longitude: 0,
  isPublished: true,
  useLocation: false,
})

const createNoticeArticle = async () => {
  await upsertData('boardNotice', writeNoticeDetailData.value, '', '')

  toast.add({ title: t('messages.articleWriteSuccess.title'), description: t('messages.articleWriteSuccess.description'), color: 'amber', timeout: 2000 })
  navigateTo('/board/notice')
}
</script>

<template>
  <div class="w-dvw md:w-[500px] flex flex-col items-end mt-8 px-4 gap-4">
    <p class="w-full text-xl font-bold">
      {{ $t('board.notice.writeTitle') }}
    </p>
    <AInput
      v-model:input-data="writeNoticeDetailData.title"
      class="w-full"
      clearable
      input-color="amber"
      :input-placeholder="$t('placeholder.noticeTitle')"
    />
    <DGCheckbox
      v-model="writeNoticeDetailData.isPublished"
      color="amber"
      :label="writeNoticeDetailData.isPublished ? $t('buttons.public') : $t('buttons.secret')"
    />
    <TiptapTextEditor
      :text-data="writeNoticeDetailData.content"
      full-option
      @update:model-value="(text: string) => writeNoticeDetailData.content = text"
    />
    <AButton
      custom-class="w-fit"
      :button-text="$t('buttons.write')"
      @click="createNoticeArticle"
    />
  </div>
</template>

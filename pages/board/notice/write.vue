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
  <BoardWrite
    v-model:write-board-data="writeNoticeDetailData"
    board-type="notice"
    @create:article="createNoticeArticle"
  />
</template>

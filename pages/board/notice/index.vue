<script setup lang="ts">
const { t } = useLocale()
const { query } = useRoute()
const router = useRouter()

// const { userInfoData: userStoreData, userCoreId } = storeToRefs(useUserInfoStore())
const { noticeArticleCount } = storeToRefs(useBoardStore())

useHead({
  title: t('pageTitle.notice'),
})

definePageMeta({
  layout: 'with-navigator',
  middleware: 'auth',
})

const currentPage = ref(1)
const currentPageSize = ref(10)

currentPage.value = parseInt(query.page as string) || 1
currentPageSize.value = parseInt(query.count as string) || 10

watch(() => currentPage.value, () => {
  router.push({
    query: {
      ...router.currentRoute.value.query,
      page: currentPage.value,
    },
  })
}, {
  immediate: true,
})

const { data: boardNoticeData, refresh: _refreshBoardNotice, pending: _pendingBoardNotice } = useAsyncData('boardNotice', async () => {
  const { data: serverData }: SerializeObject = await useFetch('/api/notice', {
    headers: useRequestHeaders(['cookie']),
    query: {
      page: currentPage.value,
      pageCount: currentPageSize.value,
    },
  })

  const transformData: BoardData[] = serverData.value.data.map((article: BoardData) => ({
    ...article,
    createdAt: computed(() => useDateFormat(article.createdAt ?? '', 'YYYY-MM-DD HH:MM:ss').value),
  }))

  noticeArticleCount.value = serverData.value.count
  return transformData
}, {
  immediate: true,
  watch: [currentPage, currentPageSize],
})
</script>

<template>
  <BoardList
    v-model:board-data="boardNoticeData"
    v-model:article-count="noticeArticleCount"
    v-model:current-page="currentPage"
    v-model:current-page-size="currentPageSize"
    board-type="notice"
  />
</template>

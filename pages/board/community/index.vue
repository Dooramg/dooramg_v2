<script setup lang="ts">
const client = useSupabaseClient()

const { t } = useLocale()
const { query } = useRoute()
const router = useRouter()

const { userCoreId } = storeToRefs(useUserInfoStore())
const { communityArticleCount } = storeToRefs(useBoardStore())

useHead({
  title: t('pageTitle.community'),
})

definePageMeta({
  layout: 'with-navigator',
  middleware: 'auth',
})

const searchType = ref('searchTotal')
const textType = ref('title')
const searchText = ref('')

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

const { data: blockData } = useAsyncData('blockData', async () => {
  const { data } = await client
    .from('block')
    .select('*')
    .eq('blockerUserId', userCoreId.value)

  if (!data) {
    return null
  }

  return data
}, {
  immediate: true,
})

const { data: boardCommunityData, refresh: refreshBoardCommunity, pending: _pendingBoardCommunity } = useAsyncData('boardCommunity', async () => {
  const { data: serverData }: SerializeObject = await useFetch('/api/community', {
    headers: useRequestHeaders(['cookie']),
    query: {
      page: currentPage.value,
      pageCount: currentPageSize.value,
      searchType: searchType.value,
      textType: textType.value,
      searchText: searchText.value,
    },
  })

  communityArticleCount.value = serverData.value.count

  if (serverData.value.count === 0) {
    currentPage.value = 1
    communityArticleCount.value = 1
  }

  const transformData: BoardData[] = serverData.value.data.map((article: BoardData) => ({
    ...article,
    createdAt: computed(() => useDateFormat(article.createdAt ?? '', 'YYYY-MM-DD HH:MM:ss').value),
  }))

  return transformData
}, {
  immediate: true,
  watch: [currentPage, currentPageSize],
})

const { data: boardNoticeData }: SerializeObject = await useFetch('/api/notice', {
  headers: useRequestHeaders(['cookie']),
  query: {
    dataRange: 4,
  },
})

const hideBlockedArticle = (writeUserId: string, initialState: boolean) => {
  const isBlockArticle = blockData.value?.find((block: SupabaseDataBase['public']['Tables']['block']['Row']) => block.blockedUserId === writeUserId)

  return !isBlockArticle && initialState
}

const searchCommunity = () => {
  searchType.value = searchText.value === '' ? 'searchTotal' : 'searchText'
  refreshBoardCommunity()
}
</script>

<template>
  <BoardList
    v-model:board-data="boardCommunityData"
    v-model:article-count="communityArticleCount"
    v-model:current-page="currentPage"
    v-model:current-page-size="currentPageSize"
    v-model:text-type="textType"
    v-model:search-text="searchText"
    :notice-data-in-community="boardNoticeData.data"
    board-type="community"
    @search:community="searchCommunity"
    @hide:blocked-article="(userId: string, additionalTrigger: boolean) => hideBlockedArticle(userId, additionalTrigger)"
  />
</template>

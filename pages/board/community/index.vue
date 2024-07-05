<script setup lang="ts">
const { t } = useLocale()
const { query } = useRoute()
const router = useRouter()

const { userCoreId } = storeToRefs(useUserInfoStore())

useHead({
  title: t('pageTitle.notice'),
})

definePageMeta({
  layout: 'with-navigator',
  middleware: 'auth',
})

const searchType = ref('searchTotal')
const searchTypeList = [
  { value: 'title', label: t('labelTexts.title') },
  { value: 'content', label: t('labelTexts.content') },
]
const textType = ref('title')
const searchText = ref('')

const currentPage = ref(1)
const currentPageSize = ref(10)
const articleCount = ref(0)

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

  const transformData: BoardData[] = serverData.value.data.map((article: BoardData) => ({
    ...article,
    createdAt: computed(() => useDateFormat(article.createdAt ?? '', 'YYYY-MM-DD HH:MM:ss').value),
  }))

  articleCount.value = serverData.value.count
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

const searchCommunity = () => {
  searchType.value = searchText.value === '' ? 'searchTotal' : 'searchText'
  refreshBoardCommunity()
}
</script>

<template>
  <div class="flex flex-col mt-8">
    <p class="text-2xl font-bold px-4">
      {{ $t('board.notice.title') }}
    </p>
    <div class="w-dvw md:w-[500px] flex flex-col items-end mt-4 px-4 gap-4">
      <AVerticalFlicking
        :vertical-data="boardNoticeData.data"
        flicking-class="w-full h-14 border-2 rounded-md px-2 py-4 my-2 text-lg"
        @click:flicking="(id: string) => navigateTo(`/board/notice/${id}`)"
      />
      <DGDivider />
      <div class="w-full flex flex-wrap justify-end gap-4">
        <AButton
          button-size="lg"
          button-color="amber"
          :button-text="$t('buttons.write')"
          @click="navigateTo('/board/community/write')"
        />
        <div class="flex-auto" />
        <DGSelect
          v-model="textType"
          color="amber"
          size="lg"
          :options="searchTypeList"
          option-attribute="label"
          value-attribute="value"
        />
        <AInput
          v-model:input-data="searchText"
          use-trailing
          input-size="lg"
          @keyup.enter="searchCommunity"
          @click:trailing="searchCommunity"
        />
      </div>
      <DGCard
        v-for="content, index in boardCommunityData"
        v-show="(content.userId === userCoreId && !content.isPublished) || content.isPublished"
        :key="content.id"
        :ui="{
          base: 'w-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer',
          footer: { padding: 'px-2 py-2 sm:px-4' },
        }"
        @click="navigateTo(`/board/community/${content.id}`)"
      >
        <template #footer>
          <div class="flex justify-between items-center gap-2">
            <DGBadge
              v-show="index === 0"
              color="orange"
              variant="soft"
              :label="$t('texts.latestArticle')"
            />
            <DGBadge
              :color="content.useLocation ? 'violet' : 'red'"
              variant="soft"
              :label="content.useLocation ? $t('texts.meeting') : $t('texts.article')"
            />
            <DGBadge
              v-show="!content.isPublished"
              color="red"
              variant="outline"
              :label="$t('texts.secretArticle')"
            />
            <div class="flex-auto" />
            <ANuxtTime
              custom-class="flex justify-end text-xs"
              :date-time="content.createdAt"
            />
          </div>
        </template>
        <p class="truncate">
          {{ content.title }}
        </p>
      </DGCard>
      <DGPagination
        v-model="currentPage"
        class="flex justify-center mx-2 mb-40"
        :active-button="{ variant: 'ghost', color: 'orange' }"
        :inactive-button="{ variant: 'ghost', color: 'grey' }"
        :prev-button="{ variant: 'ghost', color: 'amber' }"
        :next-button="{ variant: 'ghost', color: 'amber' }"
        :first-button="{ variant: 'ghost', color: 'amber' }"
        :last-button="{ variant: 'ghost', color: 'amber' }"
        :page-count="currentPageSize"
        :total="articleCount ?? 0"
        show-first
        show-last
      />
    </div>
  </div>
</template>

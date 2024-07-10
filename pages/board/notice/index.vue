<script setup lang="ts">
const { t } = useLocale()
const { query } = useRoute()
const router = useRouter()

const { userInfoData: userStoreData, userCoreId } = storeToRefs(useUserInfoStore())
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
  <div class="w-dvw md:w-[500px] flex flex-col mt-8 px-8 gap-4">
    <p class="text-2xl font-bold">
      {{ $t('board.notice.title') }}
    </p>
    <div class="w-full flex flex-col items-end mt-4 gap-4">
      <AButton
        v-if="userStoreData?.isAdmin"
        button-size="lg"
        button-variant="soft"
        :button-text="$t('buttons.write')"
        @click="navigateTo('/board/notice/write')"
      />
      <DGCard
        v-for="content, index in boardNoticeData"
        v-show="(content.userId === userCoreId && !content.isPublished) || content.isPublished"
        :key="content.id"
        :ui="{
          base: 'w-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer',
          footer: { padding: 'px-2 py-2 sm:px-4' },
        }"
        @click="navigateTo(`/board/notice/${content.id}`)"
      >
        <template #footer>
          <div class="flex flex-wrap justify-between items-center gap-2">
            <DGBadge
              v-show="index === 0"
              color="orange"
              variant="soft"
              :label="$t('texts.latestArticle')"
            />
            <DGBadge
              color="red"
              variant="soft"
              :label="$t('texts.notice')"
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
        :total="noticeArticleCount"
        show-first
        show-last
      />
    </div>
  </div>
</template>

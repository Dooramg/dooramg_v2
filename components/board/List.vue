<script setup lang="ts">
const { userInfoData } = storeToRefs(useUserInfoStore())

const { t } = useLocale()

withDefaults(
  defineProps<{
    boardType?: 'notice' | 'community' | ''
    noticeDataInCommunity?: BoardData[]
  }>(),
  {
    boardType: '',
    noticeDataInCommunity: () => [],
  },
)

defineEmits([
  'search:community',
  'hide:blocked-article',
])

const boardData = defineModel('boardData', {
  type: Object,
  default: () => ({}),
})

const textType = defineModel('textType', {
  type: String,
  default: 'title',
})

const searchText = defineModel('searchText', {
  type: String,
  default: '',
})

const currentPage = defineModel('currentPage', {
  type: Number,
  default: 1,
})

const currentPageSize = defineModel('currentPageSize', {
  type: Number,
  default: 10,
})

const articleCount = defineModel('articleCount', {
  type: Number,
  default: 0,
})

const searchTypeList = [
  { value: 'title', label: t('labelTexts.title') },
  { value: 'content', label: t('labelTexts.content') },
]
</script>

<template>
  <div class="w-dvw md:w-[500px] flex flex-col mt-8 px-8 gap-4">
    <p class="text-2xl font-bold">
      {{ boardType === 'community' ? $t('board.community.title') : $t('board.notice.title') }}
    </p>
    <div class="w-full flex flex-col items-end mt-4 gap-4">
      <AVerticalFlicking
        v-if="boardType === 'community'"
        :vertical-data="noticeDataInCommunity"
        flicking-class="w-full h-14 border-2 rounded-md px-2 py-4 my-2 text-lg"
        @click:flicking="(id: string) => navigateTo(`/board/notice/${id}`)"
      />
      <DGDivider v-if="boardType === 'community'" />
      <div class="w-full flex flex-wrap justify-end gap-4">
        <DGSelect
          v-if="boardType === 'community'"
          v-model="textType"
          color="amber"
          size="lg"
          :options="searchTypeList"
          option-attribute="label"
          value-attribute="value"
        />
        <AInput
          v-if="boardType === 'community'"
          v-model:input-data="searchText"
          use-trailing
          input-size="lg"
          @keyup.enter="() => $emit('search:community')"
          @click:trailing="() => $emit('search:community')"
        />
        <div class="flex-auto" />
        <AButton
          button-size="lg"
          button-color="amber"
          :button-text="$t('buttons.write')"
          @click="navigateTo(`/board/${boardType}/write`)"
        />
      </div>
      <DGCard
        v-for="content, index in boardData"
        v-show="() => $emit('hide:blocked-article', content.userId, (userInfoData?.isAdmin && !content.isPublished) || content.isPublished)"
        :key="content.id"
        :ui="{
          base: 'w-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer',
          footer: { padding: 'px-2 py-2 sm:px-4' },
        }"
        @click="navigateTo(`/board/${boardType}/${content.id}`)"
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
      <div
        v-if="boardData?.length === 0"
        class="w-full flex justify-center items-center my-20"
      >
        <p class="text-xl font-bold">
          {{ $t('board.noResult') }}
        </p>
      </div>
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
        :total="articleCount"
        show-first
        show-last
      />
    </div>
  </div>
</template>

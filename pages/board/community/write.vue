<script setup lang="ts">
const toast = useToast()
const { t } = useLocale()

const { upsertData } = useFetchComposable()

const { userCoreId } = storeToRefs(useUserInfoStore())

useHead({
  title: t('pageTitle.communityWrite'),
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
  <BoardWrite
    v-model:write-board-data="writeCommunityDetailData"
    board-type="community"
    @update:map-data="updateNaverMapData"
    @create:article="createCommunityArticle"
  />
</template>

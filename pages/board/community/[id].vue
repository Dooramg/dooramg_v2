<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const client = useSupabaseClient()

const toast = useToast()
const { t } = useLocale()
const { params } = useRoute()

const { updateData, upsertData, deleteData } = useFetchComposable()

const { userInfoData: userStoreData, userCoreId } = storeToRefs(useUserInfoStore())

useHead({
  title: t('pageTitle.community'),
})

definePageMeta({
  layout: 'without-navigator',
  middleware: 'auth',
})

const schema = object({
  comment: string()
    .required(t('validate.inputComment')),
})

type Schema = InferType<typeof schema>

const boardId = computed(() => {
  if (!params.id) {
    return ''
  }

  return params.id as string
})

const adminTrigger = computed(() => {
  if (!userStoreData.value) {
    return false
  }

  return userStoreData.value?.isAdmin
})

const editCommunityDetailData = ref({
  title: '',
  content: '',
  isPublished: false,
  useLocation: false,
  locationAddress: '',
  latitude: 0,
  longitude: 0,
})

const insertCommentData = ref<CommentForm>({
  boardId: boardId.value,
  userId: userCoreId.value,
  comment: '',
})

const reportCommentId = ref('')
const blockUserId = ref('')
const blockUserNickName = ref('')
const likeCount = ref(0)

const editCommunityTrigger = ref(false)
const deleteConfirmTrigger = ref(false)
const reportArticleConfirmTrigger = ref(false)
const reportCommentConfirmTrigger = ref(false)
const blockUserConfirmTrigger = ref(false)
const naverMapsLoadTrigger = ref(false)

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

const { data: communityDetailData, refresh: communityDetailRefresh } = useAsyncData('communityDetail', async () => {
  const { data }: SerializeObject = await useFetch('/api/community/detail', {
    headers: useRequestHeaders(['cookie']),
    query: {
      id: boardId.value,
    },
  })

  const transformData: BoardData = {
    ...data.value,
    createdAt: useDateFormat(data.value.createdAt ?? '', 'YYYY-MM-DD HH:MM:ss'),
  }

  naverMapsLoadTrigger.value = true

  likeCount.value = data.value.communityLikeCount.length
  return transformData
}, {
  immediate: true,
})

const { data: commentData, refresh: communityCommentRefresh }: SerializeObject = await useFetch('/api/community/comment', {
  headers: useRequestHeaders(['cookie']),
  query: {
    id: boardId.value,
  },
})

const countUpLike = () => {
  const alreadyLiked = communityDetailData.value?.communityLikeCount?.find((likeData: LikeCountData) => likeData.userId === userCoreId.value)

  if (alreadyLiked) {
    toast.add({ title: t('messages.alreadyLike.title'), description: t('messages.alreadyLike.description'), color: 'red', timeout: 2000 })
    return
  }

  upsertLikeCount(communityDetailData.value?.communityLikeCount?.length ?? 1)
}

const reportCommunityArticle = async () => {
  const { data }: SerializeObject = await client
    .from('communityReport')
    .select('*, userInfo(id), boardCommunity(id)')
    .eq('reportUserId', userCoreId.value)
    .eq('boardId', boardId.value)

  if (data.length) {
    toast.add({ title: t('messages.alreadyCommunityReport.title'), description: t('messages.alreadyCommunityReport.description'), color: 'amber', timeout: 2000 })
    return
  }

  await upsertData('communityReport', {
    boardId: boardId.value,
    reportUserId: userCoreId.value,
  }, '', '')

  toast.add({ title: t('messages.communityReportSuccess.title'), description: t('messages.communityReportSuccess.description'), color: 'amber', timeout: 2000 })
  reportArticleConfirmTrigger.value = false
}

const upsertLikeCount = async (count: number) => {
  await upsertData('communityLikeCount', {
    boardId: boardId.value,
    likeCount: ++count,
    userId: userCoreId.value,
  }, 'boardId', boardId.value)

  await communityDetailRefresh()

  likeCount.value = count
  toast.add({ title: t('messages.countUpLike.title'), description: t('messages.countUpLike.description'), color: 'amber', timeout: 2000 })
}

const openReportCommentDialog = (commentId: string) => {
  reportCommentId.value = commentId
  reportCommentConfirmTrigger.value = true
}

const reportCommunityComment = async () => {
  const { data }: SerializeObject = await client
    .from('communityCommentReport')
    .select('*, userInfo(id), communityCommentList(id)')
    .eq('reportUserId', userCoreId.value)
    .eq('commentId', reportCommentId.value)

  if (data.length) {
    toast.add({ title: t('messages.alreadyCommunityCommentReport.title'), description: t('messages.alreadyCommunityCommentReport.description'), color: 'amber', timeout: 2000 })
    return
  }

  await upsertData('communityCommentReport', {
    commentId: reportCommentId.value,
    reportUserId: userCoreId.value,
  }, '', '')

  toast.add({ title: t('messages.communityCommentReportSuccess.title'), description: t('messages.communityCommentReportSuccess.description'), color: 'amber', timeout: 2000 })
  reportCommentConfirmTrigger.value = false
}

const openBlockConfirmDialog = (writeUserId: string, writeUserNickName: string) => {
  if (userCoreId.value === writeUserId) {
    return
  }

  blockUserId.value = writeUserId
  blockUserNickName.value = writeUserNickName
  blockUserConfirmTrigger.value = true
}

const blockUser = async () => {
  await upsertData('block', {
    blockerUserId: userCoreId.value,
    blockedUserId: blockUserId.value,
  }, '', '')

  toast.add({ title: t('messages.blockUserSuccess.title', { nickName: communityDetailData.value?.userInfo?.nickName }), description: t('messages.blockUserSuccess.description', { nickName: communityDetailData.value?.userInfo?.nickName }), color: 'amber', timeout: 2000 })
  navigateTo('/board/community')
}

const initEditingCommunityDetailData = () => {
  editCommunityDetailData.value.title = communityDetailData.value?.title ?? ''
  editCommunityDetailData.value.content = communityDetailData.value?.content ?? ''
  editCommunityDetailData.value.isPublished = communityDetailData.value?.isPublished ?? false
  editCommunityDetailData.value.useLocation = communityDetailData.value?.useLocation ?? false
  editCommunityDetailData.value.locationAddress = communityDetailData.value?.locationAddress ?? ''
  editCommunityDetailData.value.latitude = communityDetailData.value?.latitude ?? 0
  editCommunityDetailData.value.longitude = communityDetailData.value?.longitude ?? 0
}

initEditingCommunityDetailData()

const updateNaverMapData = (markAddress: NaverResAddr, latitude: number, longitude: number) => {
  markAddress.roadAddress
    ? editCommunityDetailData.value.locationAddress = markAddress.roadAddress
    : editCommunityDetailData.value.locationAddress = markAddress.jibunAddress

  editCommunityDetailData.value.latitude = latitude
  editCommunityDetailData.value.longitude = longitude
}

const editingCommunityDetail = () => {
  editCommunityTrigger.value = !editCommunityTrigger.value

  if (!editCommunityTrigger.value) {
    communityDetailRefresh()
    initEditingCommunityDetailData()
  }
}

const updateCommunityArticle = async () => {
  await updateData('boardCommunity', editCommunityDetailData.value, boardId.value)

  toast.add({ title: t('messages.articleUpdateSuccess.title'), description: t('messages.articleUpdateSuccess.description'), color: 'amber', timeout: 2000 })
  editCommunityTrigger.value = false
  naverMapsLoadTrigger.value = false

  communityDetailRefresh()
  navigateTo('/board/community')
}

const insertComment = async (event: FormSubmitEvent<Schema>) => {
  if (!event.isTrusted || insertCommentData.value.comment === '') {
    return
  }

  await upsertData('communityCommentList', insertCommentData.value, '', '')

  toast.add({ title: t('messages.commentWriteSuccess.title'), description: t('messages.commentWriteSuccess.description'), color: 'amber', timeout: 2000 })
  communityCommentRefresh()
}

const deleteComment = async (commentId: string) => {
  await deleteData('communityCommentList', false, 'id', commentId, '', '', '', '')

  toast.add({ title: t('messages.commentDeleteSuccess.title'), description: t('messages.commentDeleteSuccess.description'), color: 'amber', timeout: 2000 })
  communityCommentRefresh()
}

const deleteCommunityArticle = async () => {
  await deleteData('boardCommunity', false, 'id', boardId.value, '', '', '', '')
  await deleteData('communityCommentList', false, 'boardId', boardId.value, '', '', '', '')
  await deleteData('communityLikeCount', false, 'boardId', boardId.value, '', '', '', '')

  toast.add({ title: t('messages.articleDeleteSuccess.title'), description: t('messages.articleDeleteSuccess.description'), color: 'amber', timeout: 2000 })
  navigateTo('/board/community')
}

const hideBlockedComment = (writeUserId: string) => {
  const isBlockArticle = blockData.value?.find((block: SupabaseDataBase['public']['Tables']['block']['Row']) => block.blockedUserId === writeUserId)

  return !isBlockArticle
}

setTimeout(() => {
  naverMapsLoadTrigger.value = true
}, 300)

onUnmounted(() => {
  naverMapsLoadTrigger.value = false
})
</script>

<template>
  <div class="w-dvw md:w-[500px] flex flex-col items-end mt-8 px-8 gap-4">
    <DGCard
      v-if="communityDetailData"
      :ui="{
        base: 'w-full',
        footer: { padding: 'px-2 py-2 sm:px-4' },
      }"
    >
      <template #header>
        <BoardDetailHeader
          board-type="community"
          :board-detail-data="communityDetailData"
          :edit-trigger="editCommunityTrigger"
          :admin-trigger="adminTrigger"
          :like-count="likeCount"
          @edit:board-detail="editingCommunityDetail"
          @update:board-detail="updateCommunityArticle"
          @update:count-up-like="countUpLike"
          @open:block-confirm-dialog="(userId: string, nickName: string) => openBlockConfirmDialog(userId, nickName)"
          @open:report-article-confirm-dialog="() => reportArticleConfirmTrigger = true"
          @open:delete-confirm-dialog="() => deleteConfirmTrigger = true"
        />
      </template>
      <BoardDetail
        v-model:edit-board-detail-data="editCommunityDetailData"
        :edit-trigger="editCommunityTrigger"
        :map-load-trigger="naverMapsLoadTrigger"
        :board-detail-data="communityDetailData"
        @update:naver-map-data="updateNaverMapData"
      />
      <template
        v-if="!editCommunityTrigger"
        #footer
      >
        <BoardDetailComment
          v-model:insert-comment-data="insertCommentData"
          :comment-data="commentData"
          :edit-community-trigger="editCommunityTrigger"
          @block:comment="(userId: string) => hideBlockedComment(userId)"
          @delete:comment="(commentId: string) => deleteComment(commentId)"
          @open:block-confirm-dialog="(writeUserId: string, writeUserNickName: string) => openBlockConfirmDialog(writeUserId, writeUserNickName)"
          @open:report-comment-dialog="(commentId: string) => openReportCommentDialog(commentId)"
          @insert:comment="(event: FormSubmitEvent<Schema>) => insertComment(event)"
        />
      </template>
    </DGCard>
    <DialogConfirm
      :dialog-trigger="deleteConfirmTrigger"
      title-class="text-2xl font-bold"
      :full-screen="false"
      :title="$t('texts.deleteArticle')"
      :first-button-text="$t('board.dialog.confirm')"
      :second-button-text="$t('board.dialog.reject')"
      @click:first-button="deleteCommunityArticle"
      @click:second-button="() => deleteConfirmTrigger = false"
      @close="() => deleteConfirmTrigger = false"
    >
      <p class="break-keep">
        {{ $t('board.dialog.deleteTitle') }}
      </p>
    </DialogConfirm>
    <DialogConfirm
      :dialog-trigger="reportArticleConfirmTrigger"
      title-class="text-2xl font-bold"
      :full-screen="false"
      :title="$t('board.dialog.reportTitle')"
      :first-button-text="$t('board.dialog.confirm')"
      :second-button-text="$t('board.dialog.reject')"
      @click:first-button="reportCommunityArticle"
      @click:second-button="() => reportArticleConfirmTrigger = false"
      @close="() => reportArticleConfirmTrigger = false"
    >
      <p class="break-keep">
        {{ $t('board.dialog.reportDescription') }}
      </p>
    </DialogConfirm>
    <DialogConfirm
      :dialog-trigger="reportCommentConfirmTrigger"
      title-class="text-2xl font-bold"
      :full-screen="false"
      :title="$t('board.dialog.reportTitle')"
      :first-button-text="$t('board.dialog.confirm')"
      :second-button-text="$t('board.dialog.reject')"
      @click:first-button="reportCommunityComment"
      @click:second-button="() => reportCommentConfirmTrigger = false"
      @close="() => reportCommentConfirmTrigger = false"
    >
      <p class="break-keep">
        {{ $t('board.dialog.reportTitle') }}
      </p>
    </DialogConfirm>
    <DialogConfirm
      :dialog-trigger="blockUserConfirmTrigger"
      title-class="text-2xl font-bold"
      :full-screen="false"
      :title="$t('board.dialog.blockTitle', { nickName: blockUserNickName })"
      :first-button-text="$t('board.dialog.confirm')"
      :second-button-text="$t('board.dialog.reject')"
      @click:first-button="blockUser"
      @click:second-button="() => blockUserConfirmTrigger = false"
      @close="() => blockUserConfirmTrigger = false"
    >
      <p class="break-keep">
        {{ $t('board.dialog.blockDescription', { nickName: blockUserNickName }) }}
      </p>
    </DialogConfirm>
  </div>
</template>

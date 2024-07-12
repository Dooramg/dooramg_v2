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
  title: t('pageTitle.notice'),
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

const editNoticeDetailData = ref({
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

const editNoticeTrigger = ref(false)
const deleteConfirmTrigger = ref(false)
const reportCommentConfirmTrigger = ref(false)
const blockUserConfirmTrigger = ref(false)

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

const { data: noticeDetailData, refresh: noticeDetailRefresh } = useAsyncData('noticeDetail', async () => {
  const { data }: SerializeObject = await useFetch('/api/notice/detail', {
    headers: useRequestHeaders(['cookie']),
    query: {
      id: boardId.value,
    },
  })

  const transformData: BoardData = {
    ...data.value,
    createdAt: useDateFormat(data.value.createdAt ?? '', 'YYYY-MM-DD HH:MM:ss'),
  }

  likeCount.value = data.value.noticeLikeCount.length
  return transformData
}, {
  immediate: true,
})

const { data: commentData, refresh: noticeCommentRefresh }: SerializeObject = await useFetch('/api/notice/comment', {
  headers: useRequestHeaders(['cookie']),
  query: {
    id: boardId.value,
  },
})

const countUpLike = () => {
  const alreadyLiked = noticeDetailData.value?.noticeLikeCount?.find((likeData: LikeCountData) => likeData.userId === userCoreId.value)

  if (alreadyLiked) {
    toast.add({ title: t('messages.alreadyLike.title'), description: t('messages.alreadyLike.description'), color: 'red', timeout: 2000 })
    return
  }

  upsertLikeCount(noticeDetailData.value?.noticeLikeCount?.length ?? 1)
}

const upsertLikeCount = async (count: number) => {
  await upsertData('noticeLikeCount', {
    boardId: boardId.value,
    likeCount: ++count,
    userId: userCoreId.value,
  }, 'boardId', boardId.value)

  await noticeDetailRefresh()

  likeCount.value = count
  toast.add({ title: t('messages.countUpLike.title'), description: t('messages.countUpLike.description'), color: 'amber', timeout: 2000 })
}

const editingNoticeDetail = () => {
  editNoticeDetailData.value.title = noticeDetailData.value?.title ?? ''
  editNoticeDetailData.value.content = noticeDetailData.value?.content ?? ''
  editNoticeDetailData.value.isPublished = noticeDetailData.value?.isPublished ?? false

  editNoticeTrigger.value = !editNoticeTrigger.value
}

const updateNoticeArticle = async () => {
  await updateData('boardNotice', editNoticeDetailData.value, boardId.value)

  toast.add({ title: t('messages.articleUpdateSuccess.title'), description: t('messages.articleUpdateSuccess.description'), color: 'amber', timeout: 2000 })
  editNoticeTrigger.value = false

  noticeDetailRefresh()
  navigateTo('/board/notice')
}

const insertComment = async (event: FormSubmitEvent<Schema>) => {
  if (!event.isTrusted || insertCommentData.value.comment === '') {
    return
  }

  await upsertData('noticeCommentList', insertCommentData.value, '', '')

  toast.add({ title: t('messages.commentWriteSuccess.title'), description: t('messages.commentWriteSuccess.description'), color: 'amber', timeout: 2000 })
  noticeCommentRefresh()
}

const deleteComment = async (commentId: string) => {
  await deleteData('noticeCommentList', false, 'id', commentId, '', '', '', '')

  toast.add({ title: t('messages.commentDeleteSuccess.title'), description: t('messages.commentDeleteSuccess.description'), color: 'amber', timeout: 2000 })
  noticeCommentRefresh()
}

const deleteNoticeArticle = async () => {
  await deleteData('boardNotice', false, 'id', boardId.value, '', '', '', '')
  await deleteData('noticeCommentList', false, 'boardId', boardId.value, '', '', '', '')
  await deleteData('noticeLikeCount', false, 'boardId', boardId.value, '', '', '', '')

  toast.add({ title: t('messages.articleDeleteSuccess.title'), description: t('messages.articleDeleteSuccess.description'), color: 'amber', timeout: 2000 })
  navigateTo('/board/notice')
}

const openReportCommentDialog = (commentId: string) => {
  reportCommentId.value = commentId
  reportCommentConfirmTrigger.value = true
}

const reportCommunityComment = async () => {
  const { data }: SerializeObject = await client
    .from('noticeCommentReport')
    .select('*, userInfo(id), noticeCommentList(id)')
    .eq('reportUserId', userCoreId.value)
    .eq('commentId', reportCommentId.value)

  if (data.length) {
    toast.add({ title: t('messages.alreadyCommunityCommentReport.title'), description: t('messages.alreadyCommunityCommentReport.description'), color: 'amber', timeout: 2000 })
    return
  }

  await upsertData('noticeCommentReport', {
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

  toast.add({ title: t('messages.blockUserSuccess.title', { nickName: noticeDetailData.value?.userInfo?.nickName }), description: t('messages.blockUserSuccess.description', { nickName: noticeDetailData.value?.userInfo?.nickName }), color: 'amber', timeout: 2000 })
  navigateTo('/board/notice')
}

const hideBlockedComment = (writeUserId: string) => {
  const isBlockArticle = blockData.value?.find((block: SupabaseDataBase['public']['Tables']['block']['Row']) => block.blockedUserId === writeUserId)

  return !isBlockArticle
}
</script>

<template>
  <div class="w-dvw md:w-[500px] flex flex-col items-end mt-8 px-8 gap-4">
    <DGCard
      v-if="noticeDetailData"
      :ui="{
        base: 'w-full',
        footer: { padding: 'px-2 py-2 sm:px-4' },
      }"
    >
      <template #header>
        <BoardDetailHeader
          board-type="notice"
          :board-detail-data="noticeDetailData"
          :edit-trigger="editNoticeTrigger"
          :admin-trigger="adminTrigger"
          :like-count="likeCount"
          @edit:board-detail="editingNoticeDetail"
          @update:board-detail="updateNoticeArticle"
          @update:count-up-like="countUpLike"
          @open:block-confirm-dialog="(userId: string, nickName: string) => openBlockConfirmDialog(userId, nickName)"
          @open:delete-confirm-dialog="() => deleteConfirmTrigger = true"
        />
      </template>
      <BoardDetail
        v-model:edit-board-detail-data="editNoticeDetailData"
        :edit-trigger="editNoticeTrigger"
        :map-load-trigger="false"
        :board-detail-data="noticeDetailData"
      />
      <template
        v-if="!editNoticeTrigger"
        #footer
      >
        <BoardDetailComment
          v-model:insert-comment-data="insertCommentData"
          :comment-data="commentData"
          :edit-community-trigger="editNoticeTrigger"
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
      @click:first-button="deleteNoticeArticle"
      @click:second-button="() => deleteConfirmTrigger = false"
      @close="() => deleteConfirmTrigger = false"
    >
      <p class="break-keep">
        {{ $t('board.dialog.deleteTitle') }}
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

<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

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
})

const insertCommentData = ref<CommentForm>({
  boardId: boardId.value,
  userId: userCoreId.value,
  comment: '',
})

const likeCount = ref(0)
const editNoticeTrigger = ref(false)
const deleteConfirmTrigger = ref(false)

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
  editNoticeDetailData.value = {
    title: noticeDetailData.value?.title ?? '',
    content: noticeDetailData.value?.content ?? '',
    isPublished: noticeDetailData.value?.isPublished ?? false,
  }

  editNoticeTrigger.value = !editNoticeTrigger.value
}

const updateNoticeArticle = async () => {
  await updateData('boardNotice', editNoticeDetailData.value, boardId.value)

  toast.add({ title: t('messages.articleUpdateSuccess.title'), description: t('messages.articleUpdateSuccess.description'), color: 'amber', timeout: 2000 })
  noticeDetailRefresh()
  editNoticeTrigger.value = false
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
        <div>
          <p class="text-xl font-bold">
            {{ noticeDetailData.title }}
          </p>
          <div class="flex flex-wrap items-center mt-2 gap-2">
            <DGBadge
              v-show="noticeDetailData.userId === userStoreData?.id"
              color="amber"
              variant="soft"
              :label="$t('texts.myArticle')"
            />
            <DGBadge
              color="red"
              variant="soft"
              :label="$t('texts.notice')"
            />
            <DGBadge
              v-show="!noticeDetailData.isPublished"
              color="red"
              variant="outline"
              :label="$t('texts.secretArticle')"
            />
            <div class="flex-auto" />
            <ANuxtTime
              custom-class="flex justify-end text-xs"
              :date-time="noticeDetailData.createdAt"
            />
          </div>
          <div
            v-show="noticeDetailData.userInfo"
            class="flex items-center justify-center mt-2 gap-2"
          >
            <DGChip
              :show="noticeDetailData.userInfo?.isAdmin"
              size="3xl"
              color="amber"
              position="top-left"
            >
              <DGBadge
                :label="noticeDetailData.userInfo?.nickName"
                color="amber"
                variant="soft"
              />
              <template #content>
                <Icon name="fluent-emoji-flat:crown" />
              </template>
            </DGChip>
            <div class="flex-auto" />
            <AButton
              v-show="adminTrigger"
              button-size="xs"
              :button-text="editNoticeTrigger ? $t('buttons.cancel') : $t('buttons.edit')"
              @click="editingNoticeDetail"
            />
            <AButton
              v-show="adminTrigger && editNoticeTrigger"
              button-size="xs"
              :button-text="$t('buttons.save')"
              @click="updateNoticeArticle"
            />
            <AButton
              v-show="adminTrigger && editNoticeTrigger"
              button-size="xs"
              :button-text="$t('buttons.delete')"
              @click="() => deleteConfirmTrigger = true"
            />
            <AButton
              v-show="!editNoticeTrigger"
              use-leading
              button-size="xs"
              button-color="amber"
              button-variant="outline"
              icon-name="i-line-md-thumbs-up"
              :icon-size="14"
              :button-text="String(likeCount)"
              @click="countUpLike"
            />
          </div>
        </div>
      </template>
      <div
        v-if="!editNoticeTrigger"
        v-dompurify-html="noticeDetailData.content"
        class="board-content"
      />
      <div
        v-else
        class="flex flex-col gap-4"
      >
        <AInput
          v-model:input-data="editNoticeDetailData.title"
          clearable
          input-color="amber"
          :input-placeholder="$t('placeholder.inputTitle')"
        />
        <DGCheckbox
          v-model="editNoticeDetailData.isPublished"
          color="amber"
          :label="editNoticeDetailData.isPublished ? $t('buttons.public') : $t('buttons.secret')"
        />
        <TiptapTextEditor
          :text-data="editNoticeDetailData.content"
          full-option
          @update:model-value="(text: string) => editNoticeDetailData.content = text"
        />
      </div>
      <template
        v-if="!editNoticeTrigger"
        #footer
      >
        <p class="text-xl font-bold mt-4">
          {{ $t('board.commentTitle') }}
        </p>
        <div
          v-for="commentList in commentData"
          :key="commentList.id"
        >
          <DGCard
            class="mt-4"
            :ui="{
              background: userCoreId === commentList.userId ? 'bg-amber-200 dark:bg-amber-900' : 'bg-neutral-100 dark:bg-neutral-900',
              header: { padding: 'px-1 py-1 sm:p-2' },
              body: { padding: 'px-2 py-1 sm:p-4' },
              footer: { padding: 'px-1 py-1 sm:p-2' },
            }"
          >
            <template #header>
              <div class="flex items-center justify-center px-1 gap-2">
                <DGChip
                  :show="commentList.userInfo.isAdmin"
                  size="3xl"
                  color="amber"
                  position="top-left"
                >
                  <DGBadge
                    :label="commentList.userInfo.nickName"
                    color="amber"
                    variant="soft"
                  />
                  <template #content>
                    <Icon name="fluent-emoji-flat:crown" />
                  </template>
                </DGChip>
                <DGBadge
                  v-show="commentList.userId === userCoreId"
                  color="red"
                  variant="soft"
                  label="내 댓글"
                />
                <div class="flex-auto" />
                <AButton
                  v-show="commentList.userId === userCoreId || userStoreData?.isAdmin"
                  button-size="xs"
                  :button-text="$t('buttons.delete')"
                  @click="deleteComment(commentList.id)"
                />
              </div>
            </template>
            <div v-dompurify-html="commentList.comment" />
            <template
              v-if="commentList.userInfo.id === userCoreId || userStoreData?.isAdmin"
              #footer
            >
              <div class="flex justify-start px-1">
                <ANuxtTime
                  custom-class="flex justify-end text-xs"
                  :date-time="commentList.createdAt"
                />
              </div>
            </template>
          </DGCard>
        </div>
        <div class="border-t mt-8 border-dashed border-zinc-800">
          <p class="text-xl font-bold mt-8">
            {{ $t('board.commentWriteTitle') }}
          </p>
          <DGForm
            class="my-4"
            :schema="schema"
            :state="insertCommentData"
            @submit="insertComment"
          >
            <DGFormGroup name="comment" required>
              <TiptapTextEditor
                :text-data="insertCommentData.comment"
                comment-option
                @update:model-value="(text: string) => insertCommentData.comment = text"
              />
            </DGFormGroup>
            <DGFormGroup class="flex justify-end mt-4">
              <AButton
                button-type="submit"
                :button-text="$t('buttons.save')"
              />
            </DGFormGroup>
          </DGForm>
        </div>
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
  </div>
</template>

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

const likeCount = ref(0)
const editCommunityTrigger = ref(false)
const deleteConfirmTrigger = ref(false)
const naverMapsLoadTrigger = ref(false)

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
  if (!event.isTrusted) {
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
        <div>
          <p class="text-xl font-bold">
            {{ communityDetailData.title }}
          </p>
          <div class="flex items-center mt-2 gap-2">
            <DGBadge
              v-show="communityDetailData.userId === userCoreId"
              color="amber"
              variant="outline"
              :label="$t('texts.myArticle')"
            />
            <DGBadge
              color="red"
              variant="soft"
              :label="$t('texts.article')"
            />
            <DGBadge
              v-show="!communityDetailData.isPublished"
              color="red"
              variant="outline"
              :label="$t('texts.secretArticle')"
            />
            <div class="flex-auto" />
            <ANuxtTime
              custom-class="flex justify-end text-xs"
              :date-time="communityDetailData.createdAt"
            />
          </div>
          <div
            v-show="communityDetailData.userInfo"
            class="flex items-center justify-center mt-2 gap-2"
          >
            <DGChip
              :show="communityDetailData.userInfo?.isAdmin"
              size="3xl"
              color="amber"
              position="top-left"
            >
              <DGBadge
                :label="communityDetailData.userInfo?.nickName"
                color="amber"
                variant="soft"
              />
              <template #content>
                <Icon name="fluent-emoji-flat:crown" />
              </template>
            </DGChip>
            <div class="flex-auto" />
            <AButton
              v-show="communityDetailData.userId === userCoreId"
              button-size="xs"
              :button-text="editCommunityTrigger ? $t('buttons.cancel') : $t('buttons.edit')"
              @click="editingCommunityDetail"
            />
            <AButton
              v-show="communityDetailData.userId === userCoreId && editCommunityTrigger"
              button-size="xs"
              :button-text="$t('buttons.save')"
              @click="updateCommunityArticle"
            />
            <AButton
              v-show="(communityDetailData.userId === userCoreId || adminTrigger) && editCommunityTrigger"
              button-size="xs"
              :button-text="$t('buttons.delete')"
              @click="() => deleteConfirmTrigger = true"
            />
            <AButton
              v-show="!editCommunityTrigger"
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
      <div class="flex flex-col gap-4">
        <div
          v-if="!editCommunityTrigger"
          v-dompurify-html="communityDetailData.content"
        />
        <div
          v-else
          class="flex flex-col gap-4"
        >
          <AInput
            v-model:input-data="editCommunityDetailData.title"
            clearable
            input-color="amber"
            :input-placeholder="$t('placeholder.inputTitle')"
          />
          <DGCheckbox
            v-model="editCommunityDetailData.isPublished"
            color="amber"
            :label="editCommunityDetailData.isPublished ? $t('buttons.public') : $t('buttons.secret')"
          />
          <TiptapTextEditor
            :text-data="editCommunityDetailData.content"
            full-option
            @update:model-value="(text: string) => editCommunityDetailData.content = text"
          />
        </div>
        <div
          v-if="communityDetailData.useLocation"
          class="flex flex-col gap-4"
        >
          <p v-show="!editCommunityTrigger">
            {{ $t('naverMaps.address', { address: editCommunityDetailData.locationAddress }) }}
          </p>
          <AInput
            v-show="editCommunityTrigger && editCommunityDetailData.locationAddress"
            v-model:input-data="editCommunityDetailData.locationAddress"
            class="w-full"
            input-disabled
            clearable
            input-color="amber"
            :input-placeholder="$t('placeholder.selectAddress')"
          />
          <NaverMaps
            v-if="naverMapsLoadTrigger && !editCommunityTrigger"
            is-readable
            :load-latitude="communityDetailData.latitude"
            :load-longitude="communityDetailData.longitude"
          />
          <NaverMaps
            v-if="naverMapsLoadTrigger && editCommunityTrigger"
            :is-readable="false"
            :load-latitude="editCommunityDetailData.latitude"
            :load-longitude="editCommunityDetailData.longitude"
            @update:address="updateNaverMapData"
          />
        </div>
      </div>
      <template
        v-if="!editCommunityTrigger"
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
            <DGFormGroup>
              <TiptapTextEditor
                :text-data="insertCommentData.comment"
                comment-option
                @update:model-value="(text: string) => insertCommentData.comment = text"
              />
            </DGFormGroup>
            <DGFormGroup class="flex justify-end mt-4">
              <AButton
                :button-text="$t('buttons.save')"
                @click="insertComment"
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
      @click:first-button="deleteCommunityArticle"
      @click:second-button="() => deleteConfirmTrigger = false"
      @close="() => deleteConfirmTrigger = false"
    >
      {{ $t('board.dialog.deleteTitle') }}
    </DialogConfirm>
  </div>
</template>

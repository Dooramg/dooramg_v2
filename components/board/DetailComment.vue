<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const client = useSupabaseClient()

const { t } = useLocale()

const { userInfoData: userStoreData, userCoreId } = storeToRefs(useUserInfoStore())

type Schema = InferType<typeof schema>

withDefaults(
  defineProps<{
    commentData?: CommentData[] | null
    editTrigger?: boolean
  }>(),
  {
    commentData: () => [],
    editTrigger: false,
  },
)

defineEmits([
  'block:comment',
  'open:block-confirm-dialog',
  'open:report-comment-dialog',
  'insert:comment',
  'delete:comment',
])

const insertCommentData = defineModel('insertCommentData', {
  type: Object,
  default: () => ({}),
})

const schema = object({
  comment: string()
    .required(t('validate.inputComment')),
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

const hideBlockedComment = (writeUserId: string) => {
  const isBlockArticle = blockData.value?.find((block: SupabaseDataBase['public']['Tables']['block']['Row']) => block.blockedUserId === writeUserId)

  return !isBlockArticle
}
</script>

<template>
  <div>
    <p class="text-xl font-bold mt-4">
      {{ $t('board.commentTitle') }}
    </p>
    <div
      v-for="commentList in commentData"
      v-show="hideBlockedComment(commentList.userId)"
      :key="commentList.id"
    >
      <DGCard
        class="mt-4"
        :ui="{
          background: userCoreId === commentList?.userId ? 'bg-amber-200 dark:bg-amber-900' : 'bg-neutral-100 dark:bg-neutral-900',
          header: { padding: 'px-1 py-1 sm:p-2' },
          body: { padding: 'px-2 py-1 sm:p-4' },
          footer: { padding: 'px-1 py-1 sm:p-2' },
        }"
      >
        <template #header>
          <div class="flex items-center justify-center px-1 gap-2">
            <DGChip
              :show="commentList.userInfo?.isAdmin"
              size="3xl"
              color="amber"
              position="top-left"
            >
              <DGTooltip
                :text="userCoreId === commentList?.userId ? commentList?.userInfo?.nickName : $t('buttons.userBlock', { user: commentList.userInfo?.nickName })"
                :ui="{ wrapper: 'cursor-pointer' }"
              >
                <DGBadge
                  :label="commentList.userInfo?.nickName"
                  color="amber"
                  size="md"
                  variant="soft"
                  @click="() => $emit('open:block-confirm-dialog', commentList?.userId, commentList.userInfo?.nickName ?? '')"
                />
              </DGTooltip>
              <template #content>
                <Icon name="fluent-emoji-flat:crown" />
              </template>
            </DGChip>
            <DGBadge
              v-show="commentList.userId === userCoreId"
              color="red"
              size="md"
              variant="soft"
              label="내 댓글"
            />
            <div class="flex-auto" />
            <AButton
              v-if="!editTrigger && commentList.userId !== userCoreId"
              use-leading
              button-size="md"
              button-color="red"
              button-variant="outline"
              :tooltip-text="$t('buttons.commentReport')"
              icon-name="i-line-md-bell"
              :icon-size="14"
              @click="() => $emit('open:report-comment-dialog', commentList.id)"
            />
            <AButton
              v-if="commentList.userId === userCoreId || userStoreData?.isAdmin"
              button-size="md"
              :button-text="$t('buttons.delete')"
              @click="() => $emit('delete:comment', commentList.id)"
            />
          </div>
        </template>
        <div
          v-dompurify-html="commentList.comment"
          class="board-content"
        />
        <template
          v-if="commentList.userInfo?.id === userCoreId || userStoreData?.isAdmin"
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
        @submit="(event: FormSubmitEvent<Schema>) => $emit('insert:comment', event)"
      >
        <DGFormGroup
          name="comment"
          required
        >
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
  </div>
</template>

<script setup lang="ts">
const { userCoreId } = storeToRefs(useUserInfoStore())

withDefaults(
  defineProps<{
    boardType?: 'notice' | 'community' | ''
    boardDetailData?: BoardData | null
    editTrigger?: boolean
    adminTrigger?: boolean | null
    likeCount?: number
  }>(),
  {
    boardType: '',
    boardDetailData: null,
    editTrigger: false,
    adminTrigger: false,
    likeCount: 0,
  },
)

defineEmits([
  'edit:board-detail',
  'update:board-detail',
  'update:count-up-like',
  'open:block-confirm-dialog',
  'open:report-article-confirm-dialog',
  'open:delete-confirm-dialog',
])
</script>

<template>
  <div>
    <p class="text-xl font-bold">
      {{ boardDetailData?.title }}
    </p>
    <div class="flex flex-wrap items-center mt-2 gap-2">
      <DGBadge
        v-show="boardDetailData?.userId === userCoreId"
        color="amber"
        size="md"
        variant="outline"
        :label="$t('texts.myArticle')"
      />
      <DGBadge
        color="red"
        size="md"
        variant="soft"
        :label="$t('texts.article')"
      />
      <DGBadge
        v-show="!boardDetailData?.isPublished"
        color="red"
        size="md"
        variant="outline"
        :label="$t('texts.secretArticle')"
      />
      <div class="flex-auto" />
      <ANuxtTime
        custom-class="flex justify-end text-xs"
        :date-time="boardDetailData?.createdAt"
      />
    </div>
    <div
      v-show="boardDetailData?.userInfo"
      class="flex items-center justify-center mt-2 gap-2"
    >
      <DGChip
        :show="boardDetailData?.userInfo?.isAdmin"
        size="3xl"
        color="amber"
        position="top-left"
        :ui="{ wrapper: 'cursor-pointer' }"
      >
        <DGChip
          v-if="boardType === 'notice'"
          :show="boardDetailData?.userInfo?.isAdmin"
          size="3xl"
          color="amber"
          position="top-left"
        >
          <DGBadge
            :label="boardDetailData?.userInfo?.nickName"
            color="amber"
            variant="soft"
          />
          <template #content>
            <Icon name="fluent-emoji-flat:crown" />
          </template>
        </DGChip>
        <DGTooltip
          v-if="boardType === 'community'"
          :text="userCoreId === boardDetailData?.userId ? boardDetailData?.userInfo?.nickName : $t('buttons.userBlock', { user: boardDetailData?.userInfo?.nickName })"
          :ui="{ wrapper: 'cursor-pointer' }"
        >
          <DGBadge
            :label="boardDetailData?.userInfo?.nickName"
            color="amber"
            size="md"
            variant="soft"
            @click="() => $emit('open:block-confirm-dialog', boardDetailData?.userId, boardDetailData?.userInfo?.nickName ?? '')"
          />
        </DGTooltip>
        <template #content>
          <Icon name="fluent-emoji-flat:crown" />
        </template>
      </DGChip>
      <div class="flex-auto" />
      <AButton
        v-if="boardDetailData?.userId === userCoreId"
        button-size="sm"
        :button-text="editTrigger ? $t('buttons.cancel') : $t('buttons.edit')"
        @click="() => $emit('edit:board-detail')"
      />
      <AButton
        v-if="boardDetailData?.userId === userCoreId && editTrigger"
        button-size="sm"
        :button-text="$t('buttons.save')"
        @click="() => $emit('update:board-detail')"
      />
      <AButton
        v-if="(boardDetailData?.userId === userCoreId || adminTrigger) && editTrigger"
        button-size="sm"
        :button-text="$t('buttons.delete')"
        @click="() => $emit('open:delete-confirm-dialog')"
      />
      <AButton
        v-show="!editTrigger"
        use-leading
        button-size="sm"
        button-color="amber"
        button-variant="outline"
        icon-name="i-line-md-thumbs-up"
        :icon-size="14"
        :button-text="String(likeCount)"
        @click="() => $emit('update:count-up-like')"
      />
      <AButton
        v-show="boardType === 'community' && (!editTrigger && boardDetailData?.userId !== userCoreId)"
        use-leading
        button-size="md"
        button-color="red"
        button-variant="outline"
        :tooltip-text="$t('buttons.articleReport')"
        icon-name="i-line-md-bell"
        :icon-size="14"
        @click="() => $emit('open:report-article-confirm-dialog')"
      />
      <DGPopover
        mode="hover"
        :popper="{ arrow: true, placement: 'top' }"
        :ui="{ wrapper: 'flex items-center justify-center' }"
      >
        <Icon
          name="i-line-md-alert-loop"
          color="orange"
          :width="24"
          :height="24"
        />
        <template #panel>
          <div class="w-[200px] sm:w-fit break-keep px-2 py-1">
            <p
              v-for="(text, index) in $tm('validate.inputContentWarning')"
              :key="index"
            >
              {{ $rt(text) }}
            </p>
          </div>
        </template>
      </DGPopover>
    </div>
  </div>
</template>

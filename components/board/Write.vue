<script setup lang="ts">
withDefaults(
  defineProps<{
    boardType?: 'notice' | 'community' | ''
  }>(),
  {
    boardType: '',
  },
)

defineEmits([
  'update:map-data',
  'create:article',
])

const writeBoardData = defineModel('writeBoardData', {
  type: Object,
  default: () => ({}),
})
</script>

<template>
  <div class="w-dvw md:w-[500px] flex flex-col items-end mt-8 px-8 gap-4">
    <p class="w-full text-xl font-bold">
      {{ boardType === 'community' ? $t('board.community.writeTitle') : $t('board.notice.writeTitle') }}
    </p>
    <DGDivider />
    <AInput
      v-model:input-data="writeBoardData.title"
      class="w-full"
      clearable
      input-color="amber"
      :input-placeholder="boardType === 'community' ? $t('placeholder.communityTitle') : $t('placeholder.noticeTitle')"
    />
    <div class="w-full flex justify-center gap-4">
      <p class="text-md font-bold">
        {{ $t('labelTexts.published') }}
      </p>
      <div class="flex-auto" />
      <DGCheckbox
        v-model="writeBoardData.isPublished"
        color="amber"
        :label="writeBoardData.isPublished ? $t('buttons.public') : $t('buttons.secret')"
      />
    </div>
    <TiptapTextEditor
      :text-data="writeBoardData.content"
      full-option
      @update:model-value="(text: string) => writeBoardData.content = text"
    />
    <div
      v-if="boardType === 'community'"
      class="w-full flex justify-center items-center gap-2"
    >
      <p class="text-md font-bold">
        {{ $t('labelTexts.useLocation') }}
      </p>
      <DGTooltip
        :text="$t('board.useMapInformation')"
        placement="top"
      >
        <Icon
          name="i-line-md-question-circle"
          :width="20"
          :height="20"
        />
      </DGTooltip>
      <div class="flex-auto" />
      <div class="flex items-center gap-2">
        <p>
          {{ writeBoardData.useLocation ? $t('buttons.use') : $t('buttons.noUse') }}
        </p>
        <DGToggle
          v-model="writeBoardData.useLocation"
          color="amber"
        />
      </div>
    </div>
    <NaverMaps
      v-if="boardType === 'community' && writeBoardData.useLocation"
      class="w-full"
      :is-readable="false"
      @update:address="(address: NaverResAddr, latitude: number, longitude: number) => $emit('update:map-data', address, latitude, longitude)"
    />
    <AInput
      v-if="boardType === 'community' && writeBoardData.useLocation && writeBoardData.locationAddress"
      v-model:input-data="writeBoardData.locationAddress"
      class="w-full"
      clearable
      input-color="amber"
      :input-placeholder="$t('placeholder.selectAddress')"
    />
    <DGDivider />
    <AButton
      custom-class="w-fit"
      :button-text="$t('buttons.write')"
      @click="() => $emit('create:article')"
    />
  </div>
</template>

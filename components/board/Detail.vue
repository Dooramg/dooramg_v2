<script setup lang="ts">
withDefaults(
  defineProps<{
    boardDetailData?: BoardData | null
    editTrigger?: boolean
    mapLoadTrigger?: boolean
  }>(),
  {
    boardDetailData: null,
    editTrigger: false,
    mapLoadTrigger: false,
  },
)

defineEmits([
  'update:naver-map-data',
])

const editBoardDetailData = defineModel('editBoardDetailData', {
  type: Object,
  default: () => ({}),
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      v-if="!editTrigger"
      v-dompurify-html="boardDetailData?.content"
      class="board-content"
    />
    <div
      v-else
      class="flex flex-col gap-4"
    >
      <AInput
        v-model:input-data="editBoardDetailData.title"
        clearable
        input-color="amber"
        :input-placeholder="$t('placeholder.inputTitle')"
      />
      <DGCheckbox
        v-model="editBoardDetailData.isPublished"
        color="amber"
        :label="editBoardDetailData.isPublished ? $t('buttons.public') : $t('buttons.secret')"
      />
      <TiptapTextEditor
        :text-data="editBoardDetailData.content"
        full-option
        @update:model-value="(text: string) => editBoardDetailData.content = text"
      />
    </div>
    <div
      v-if="boardDetailData?.useLocation"
      class="flex flex-col gap-4"
    >
      <p v-show="!editTrigger">
        {{ $t('naverMaps.address', { address: editBoardDetailData.locationAddress }) }}
      </p>
      <AInput
        v-show="editTrigger && editBoardDetailData.locationAddress"
        v-model:input-data="editBoardDetailData.locationAddress"
        class="w-full"
        input-disabled
        clearable
        input-color="amber"
        :input-placeholder="$t('placeholder.selectAddress')"
      />
      <NaverMaps
        v-if="mapLoadTrigger && !editTrigger"
        is-readable
        :load-latitude="boardDetailData?.latitude"
        :load-longitude="boardDetailData?.longitude"
      />
      <NaverMaps
        v-if="mapLoadTrigger && editTrigger"
        :is-readable="false"
        :load-latitude="editBoardDetailData.latitude"
        :load-longitude="editBoardDetailData.longitude"
        @update:address="(markAddress: NaverResAddr, latitude: number, longitude: number) => $emit('update:naver-map-data', markAddress, latitude, longitude)"
      />
    </div>
  </div>
</template>

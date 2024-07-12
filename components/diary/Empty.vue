<script setup lang="ts">
const { userInfoData } = storeToRefs(useUserInfoStore())

withDefaults(
  defineProps<{
    diaryData?: { fetchData: DiaryData[] | never[], count: number | null } | null
    allDiaryDataCount?: number | null
  }>(),
  {
    diaryData: null,
    allDiaryDataCount: 0,
  },
)
</script>

<template>
  <div
    v-if="userInfoData?.mainVehicleId"
    class="flex flex-col justify-center gap-4"
  >
    <p
      v-if="allDiaryDataCount === 0"
      class="text-2xl font-bold text-center mt-40"
    >
      {{ $t('diary.noDiary') }}
    </p>
    <p
      v-if="allDiaryDataCount !== 0 && diaryData?.count === 0"
      class="text-2xl font-bold text-center mt-40"
    >
      {{ $t('diary.noDiaryMonth') }}
    </p>
    <AButton
      v-if="allDiaryDataCount === 0"
      class="flex justify-center"
      button-variant="outline"
      button-size="xl"
      button-block
      :button-text="$t('buttons.rideSetting')"
      @click="navigateTo(`/vehicles/${userInfoData?.mainVehicleId}`)"
    />
  </div>
</template>

<script setup lang="ts">
const { userInfoData } = storeToRefs(useUserInfoStore())

withDefaults(
  defineProps<{
    allDiaryDataCount?: number | null
  }>(),
  {
    allDiaryDataCount: 0,
  },
)
</script>

<template>
  <div
    v-if="!userInfoData?.mainVehicleId && allDiaryDataCount === 0"
    class="flex flex-col justify-center mt-40 gap-4"
  >
    <p class="text-2xl font-bold text-center">
      {{ $t('diary.noVehicle') }}
    </p>
    <AButton
      button-color="sky"
      button-size="xl"
      button-variant="outline"
      button-block
      :button-text="$t('buttons.vehicleInsert')"
      @click="navigateTo('/vehicles/new')"
    />
  </div>
</template>

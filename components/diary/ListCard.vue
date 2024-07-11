<script setup lang="ts">
const { comma } = useUi()

withDefaults(
  defineProps<{
    isMainDiary?: boolean
  }>(),
  {
    isMainDiary: false,
  },
)

defineEmits(
  ['delete:diary'],
)

const diaryDataList = defineModel('diaryData', {
  type: Array as () => DiaryData[],
  default: () => [],
})

const diaryDetailColor = (code: string) => {
  switch (code) {
    case 'MTC001':
      return 'border-yellow-400'
    case 'MTC002':
      return 'border-teal-400'
    case 'MTC003':
      return 'border-rose-400'
    default:
      return 'border-neutral-400'
  }
}
</script>

<template>
  <DGCard
    v-for="(diary, index) in diaryDataList"
    :key="index"
    :ui="{ base: `border-2 ${diaryDetailColor(diary.manageType?.code)}` }"
  >
    <template #header>
      <div class="flex flex-wrap items-center gap-2">
        <DGBadge
          color="amber"
          size="lg"
          variant="soft"
          :label="diary.manageType?.codeName"
        />
        <div
          v-if="diary.manageType?.code === 'MTC001'"
          class="flex items-center gap-2"
        >
          <DGAvatar
            img-class="object-cover"
            :src="diary.stationImage ? diary.stationImage : 'https://via.placeholder.com/150?text=%3F&font-size=50'"
            size="md"
            :alt="diary?.stationImage"
          />
          <p class="text-lg font-bold">
            {{ diary.fuelStationName }}
          </p>
        </div>
        <div class="flex-auto" />
        <ANuxtTime
          custom-class="text-base font-bold"
          :date-time="diary.createdAt"
        />
      </div>
    </template>
    <div class="text-md md:text-lg font-bold flex flex-col gap-2">
      <p v-if="diary.manageType?.code === 'MTC002'">
        {{ $t('diary.summary.destination', { destination: diary.destination }) }}
      </p>
      <p v-if="(isMainDiary && diary.efficient) || (!isMainDiary && diary.manageType?.code === 'MTC001')">
        {{ $t('diary.summary.sectionEfficient', { efficient: comma(diary.efficient) }) }}
      </p>
      <p v-if="(isMainDiary && diary.fuelAmount) || (!isMainDiary && diary.manageType?.code === 'MTC001')">
        {{ $t('diary.summary.fuel', { fuel: comma(diary.fuelAmount) }) }}
      </p>
      <p>
        {{ $t('diary.summary.paidAmount', { paidAmount: comma(diary.paidAmount) }) }}
      </p>
      <p>
        {{ $t('diary.summary.distance', { distance: comma(diary.driveDistance) }) }}
      </p>
      <p v-if="!isMainDiary">
        {{ $t('diary.summary.memo', { memo: diary.memo }) }}
      </p>
    </div>
    <template
      v-if="!index && !isMainDiary"
      #footer
    >
      <div class="flex justify-end">
        <AButton
          button-size="lg"
          button-variant="outline"
          :button-text="$t('buttons.delete')"
          @click="$emit('delete:diary', diary)"
        />
      </div>
    </template>
  </DGCard>
</template>

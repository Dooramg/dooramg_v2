<script setup lang="ts">
const { comma } = useUi()

const { selectedVehicleData } = storeToRefs(useVehicleStore())

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
  <div>
    <DGDivider v-if="allDiaryDataCount !== 0" />
    <DGCard
      v-if="allDiaryDataCount !== 0"
      :ui="{ base: 'cursor-pointer hover:text-sky-800 hover:dark:text-sky-200' }"
      @click="navigateTo(`/vehicles/${selectedVehicleData?.id}`)"
    >
      <div class="w-full flex flex-col gap-4">
        <DGAvatar
          img-class="object-cover"
          :src="selectedVehicleData?.bikeImage ? selectedVehicleData?.bikeImage : '/image/no_bike_image.jpg'"
          size="3xl"
          :alt="selectedVehicleData?.bikeImage ?? ''"
          :ui="{ rounded: 'rounded-2xl', size: { '3xl': 'h-[180px] w-full md:w-[180px]' } }"
        />
        <div class="flex-auto" />
        <div class="text-md md:text-lg font-bold flex flex-col gap-2">
          <p>
            {{ $t('diary.summary.label.distance', { distance: comma(selectedVehicleData?.totalDistance ?? 0) }) }}
          </p>
          <p>
            {{ $t('diary.summary.label.efficient', { efficient: comma(selectedVehicleData?.totalEfficient ?? 0) }) }}
          </p>
          <p>
            {{ $t('diary.summary.label.totalFuel', { totalFuel: comma(selectedVehicleData?.totalFuelAmount ?? 0) }) }}
          </p>
          <p>
            {{ $t('diary.summary.label.paidAmount', { paidAmount: comma(selectedVehicleData?.totalPaidAmount ?? 0) }) }}
          </p>
          <p>
            {{ !selectedVehicleData?.currentFuelAmount ? $t('diary.summary.expectNoFuel') : $t('diary.summary.label.fuel', { fuel: comma(selectedVehicleData?.currentFuelAmount) }) }}
          </p>
        </div>
      </div>
    </DGCard>
  </div>
</template>

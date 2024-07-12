<script setup lang="ts">
const { comma } = useUi()

withDefaults(
  defineProps<{
    aroundStationList?: OpiApiData[]
    selectStationId?: string
    vehicleFuelType?: string
  }>(),
  {
    aroundStationList: () => [],
    selectStationId: () => '',
    vehicleFuelType: () => '',
  },
)

defineEmits([
  'select:station',
])
</script>

<template>
  <DGCard
    v-for="(station, index) in aroundStationList"
    v-show="(vehicleFuelType === 'FUE001' || vehicleFuelType === 'FUE002') && aroundStationList?.length"
    :key="index"
    class="cursor-pointer"
    :class="selectStationId === station.UNI_ID ? 'text-amber-700 dark:text-amber-300' : ''"
    @click="() => $emit('select:station', station)"
  >
    <template #header>
      <div class="flex flex-wrap items-center gap-4">
        <DGAvatar
          :src="station.stationImage"
          size="lg"
          alt="station-logo"
          :ui="{ background: 'bg-transparent' }"
        />
        <p class="text-xl font-bold">
          {{ station.OS_NM }}
        </p>
        <div class="flex-auto" />
        <p v-if="selectStationId === station.UNI_ID">
          {{ $t('management.selectStation') }}
        </p>
      </div>
    </template>
    <div class="flex">
      <p class="text-lg font-bold">
        {{ station.fuelTypeName }}
      </p>
      <div class="flex-auto" />
      <p>
        {{ $t('management.fuelPrice', { price: comma(station.PRICE) }) }}
      </p>
    </div>
  </DGCard>
</template>

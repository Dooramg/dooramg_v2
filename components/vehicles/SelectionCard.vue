<script setup lang="ts">
const { selectedVehicleData, vehicleCount } = storeToRefs(useVehicleStore())

defineEmits([
  'click:card',
])
</script>

<template>
  <DGCard
    :ui="{
      base: 'cursor-pointer hover:text-rose-800 hover:dark:text-rose-200',
      background: 'bg-neutral-100 dark:bg-neutral-900',
      header: { padding: 'px-4 py-2 sm:p-4' },
      body: { padding: 'px-4 py-2 sm:p-4' },
    }"
    @click="() => $emit('click:card', selectedVehicleData?.id ?? '', selectedVehicleData?.carNickName ?? '')"
  >
    <template #header>
      <p class="text-lg sm:text-xl font-bold">
        {{ vehicleCount !== 0 ? $t('vehicles.description') : $t('vehicles.noDescription') }}
      </p>
    </template>
    <div class="w-full flex flex-wrap justify-between gap-4">
      <DGAvatar
        v-if="selectedVehicleData?.bikeImage"
        img-class="object-cover"
        :src="selectedVehicleData?.bikeImage ? selectedVehicleData.bikeImage : '/image/no_bike_image.jpg'"
        size="3xl"
        alt="bike-image"
        :ui="{ rounded: 'rounded-2xl', size: { '3xl': 'h-[180px] w-full md:w-[180px]' } }"
      />
      <div
        v-if="vehicleCount !== 0"
        class="flex flex-col items-end gap-1"
      >
        <p class="text-base sm:text-lg font-bold">
          {{ selectedVehicleData?.carNickName ? $t('vehicles.mainVehicle', { nickname: selectedVehicleData.carNickName }) : '로딩중..' }}
        </p>
        <ALicensePlate
          :head-text="selectedVehicleData?.plateHeadText ?? '서울'"
          :middle-text="selectedVehicleData?.plateMiddleText ?? '강남'"
          :tail-text="selectedVehicleData?.plateTailText ?? '차'"
          :number-text="parseInt(selectedVehicleData?.plateNumber ?? '1004')"
        />
      </div>
      <AButton
        v-else
        button-color="sky"
        button-size="xl"
        button-variant="outline"
        :button-text="$t('buttons.vehicleInsert')"
        @click="navigateTo('/vehicles/new')"
      />
    </div>
  </DGCard>
</template>

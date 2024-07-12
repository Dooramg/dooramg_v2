<script setup lang="ts">
const { comma } = useUi()

const { userInfoData } = storeToRefs(useUserInfoStore())
const { vehicleData } = storeToRefs(useVehicleStore())

defineEmits([
  'click:card',
])
</script>

<template>
  <DGCard
    v-for="(vehicle, index) in vehicleData"
    :key="index"
    :ui="{
      base: 'cursor-pointer hover:text-sky-800 hover:dark:text-sky-200',
      background: userInfoData?.mainVehicleId === vehicle.id ? 'bg-amber-100 dark:bg-amber-900' : 'bg-neutral-100 dark:bg-neutral-900',
      header: { padding: 'px-4 py-2 sm:p-4' },
      body: { padding: 'px-4 py-2 sm:p-4' },
    }"
    @click="() => $emit('click:card', vehicle.id, vehicle?.carNickName ?? '')"
  >
    <template #header>
      <div class="flex flex-wrap items-center gap-4">
        <DGAvatar
          :src="vehicle.manufacturer.logoImage"
          size="lg"
          :alt="vehicle.manufacturer.name"
          :ui="{ background: 'bg-transparent' }"
        />
        <div class="flex flex-col gap-1">
          <p class="text-lg font-bold">
            {{ $t('main.model', { model: vehicle.vehicleModel.name === $t('addVehicle.placeholder.manual') ? vehicle.manualModelName : vehicle.vehicleModel.name, makeYear: vehicle.makeYear }) }}
          </p>
          <p class="text-sm font-bold">
            {{ $t('unit.displacement', { displacement: comma(vehicle.displacement ?? 0) }) }}
          </p>
        </div>
        <div class="flex-auto" />
        <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">
          {{ vehicle.carNickName }}
        </p>
      </div>
    </template>
    <DGAvatar
      img-class="object-cover"
      :src="vehicle.bikeImage ? vehicle.bikeImage : '/image/no_bike_image.jpg'"
      size="3xl"
      alt="bike-image"
      :ui="{ rounded: 'rounded-2xl', size: { '3xl': 'h-[180px] w-full md:w-[180px]' } }"
    />
  </DGCard>
</template>

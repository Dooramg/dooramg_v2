<script setup lang="ts">
const { comma } = useUi()

const { mainDiaryCount } = storeToRefs(useDiaryStore())
const { selectedVehicleData } = storeToRefs(useVehicleStore())
const { userInfoData } = storeToRefs(useUserInfoStore())
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      class="relative w-full h-fit flex flex-col rounded-xl cursor-pointer hover:text-sky-800 hover:dark:text-sky-200"
      @click="navigateTo(`/vehicles/${selectedVehicleData?.id}`)"
    >
      <div
        class="w-full h-[380px] inset-0 bg-cover bg-center rounded-xl opacity-50"
        :style="{ backgroundImage: `url(${selectedVehicleData?.bikeImage ? selectedVehicleData.bikeImage : 'https://api.dooramg.com/storage/v1/object/public/assets/no_bike_image.jpg'})` }"
      />
      <div class="absolute h-[180px] w-full px-4 py-2">
        <div class="flex flex-col flex-wrap gap-3">
          <div class="flex flex-col">
            <div class="flex items-center gap-4">
              <p class="text-3xl font-bold break-keep">
                {{ $t('main.hi', { carNickName: selectedVehicleData?.carNickName }) }}
              </p>
              <div class="flex-auto" />
              <DGAvatar
                :src="selectedVehicleData?.manufacturer.logoImage"
                size="lg"
                alt="brand-logo"
                :ui="{ background: 'bg-transparent' }"
              />
            </div>
            <p class="text-md font-bold">
              {{ $t('main.model', { model: selectedVehicleData?.vehicleModel.name === $t('addVehicle.placeholder.manual') ? selectedVehicleData.manualModelName : selectedVehicleData?.vehicleModel.name, makeYear: selectedVehicleData?.makeYear }) }}
            </p>
          </div>
          <div class="w-full flex flex-col-reverse items-end gap-3">
            <div class="w-full flex flex-col gap-2">
              <p class="text-md font-bold">
                {{ !selectedVehicleData?.currentFuelAmount ? $t('main.noEfficient') : $t('main.currentFuel', { fuel: comma(selectedVehicleData?.currentFuelAmount) }) }}
              </p>
              <p class="text-md font-bold">
                {{ $t('main.efficient', { efficient: comma(selectedVehicleData?.totalEfficient ?? 0) }) }}
              </p>
              <p class="text-md font-bold">
                {{ $t('main.distance', { distance: comma(selectedVehicleData?.totalDistance ?? 0) }) }}
              </p>
            </div>
            <div class="flex-auto hidden sm:flex" />
            <ALicensePlate
              :head-text="selectedVehicleData?.plateHeadText ?? '서울'"
              :middle-text="selectedVehicleData?.plateMiddleText ?? '강남'"
              :tail-text="selectedVehicleData?.plateTailText ?? '차'"
              :number-text="parseInt(selectedVehicleData?.plateNumber ?? '1004')"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="userInfoData?.mainVehicleId"
      class="w-full flex flex-wrap justify-end gap-4"
    >
      <AButton
        button-color="amber"
        button-size="xl"
        button-variant="outline"
        :button-text="mainDiaryCount ? $t('buttons.rideInsert') : $t('buttons.rideSetting')"
        @click="navigateTo(mainDiaryCount ? `/diary/${userInfoData.mainVehicleId}` : `/vehicles/${userInfoData.mainVehicleId}`)"
      />
      <AButton
        button-color="sky"
        button-size="xl"
        button-variant="outline"
        :button-text="$t('buttons.vehicleInsert')"
        @click="navigateTo('/vehicles/new')"
      />
    </div>
  </div>
</template>

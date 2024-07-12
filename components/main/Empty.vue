<template>
  <div class="w-dvw md:w-[500px] flex flex-col mt-10 px-8 pb-28 gap-8">
    <p class="w-full text-2xl font-bold text-center">
      {{ $t('main.noVehicle') }}
    </p>
    <AButton
      button-color="rose"
      button-block
      button-size="xl"
      button-variant="outline"
      :button-text="$t('buttons.vehicleInsert')"
      @click="navigateTo('/vehicles/new')"
    />
  </div>
</template>

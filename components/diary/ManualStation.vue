<script setup lang="ts">
withDefaults(
  defineProps<{
    selectStationTrigger?: boolean
    vehicleFuelType?: string
  }>(),
  {
    selectStationTrigger: false,
    vehicleFuelType: () => '',
  },
)

const manageData = defineModel('manageData', {
  type: Object,
  default: () => ({}),
})

const manualStationPrice = defineModel('manualStationPrice', {
  type: Number,
  default: 0,
})

defineEmits([
  'select:custom-station',
])
</script>

<template>
  <DGCard
    v-if="vehicleFuelType === 'FUE003' || vehicleFuelType === 'FUE004'"
    :class="selectStationTrigger ? 'text-amber-700 dark:text-amber-300' : ''"
  >
    <template #header>
      <div class="flex flex-wrap gap-4">
        <AInput
          v-model:input-data="manageData.fuelStationName"
          :input-placeholder="$t('placeholder.inputStationName')"
          use-leading
          leading-icon-name="i-tabler-gas-station"
          clearable
        />
        <div class="flex-auto" />
        <p v-if="selectStationTrigger">
          {{ $t('management.selectStation') }}
        </p>
      </div>
    </template>
    <div class="flex flex-col gap-4">
      <AInput
        v-model:input-data="manageData.fuelStationCode"
        :input-placeholder="$t('placeholder.inputFuelType')"
        use-leading
        leading-icon-name="i-tabler-list-check"
        clearable
      />
      <AInput
        v-model:input-data="manualStationPrice"
        :input-placeholder="$t('placeholder.inputStationAmount')"
        use-leading
        input-type="number"
        leading-icon-name="i-tabler-coin"
        clearable
      />
    </div>
    <template #footer>
      <AButton
        button-block
        button-color="amber"
        button-size="xl"
        :button-text="!selectStationTrigger ? $t('buttons.select') : $t('buttons.cancel')"
        @click="() => $emit('select:custom-station')"
      />
    </template>
  </DGCard>
</template>

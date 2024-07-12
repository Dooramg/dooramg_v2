<script setup lang="ts">
const { comma } = useUi()

const editableTrigger = defineModel('editableTrigger', {
  type: Boolean,
  default: false,
})

const selectedVehicleData = defineModel('selectedVehicleData', {
  type: Object,
  default: () => ({}),
})

const updatedVehicleData = defineModel('updatedVehicleData', {
  type: Object,
  default: () => ({}),
})

const validateEditTrigger = defineModel('validateEditTrigger', {
  type: Boolean,
  default: false,
})

defineEmits([
  'validate:input',
])
</script>

<template>
  <DGCard>
    <div class="flex flex-col gap-4">
      <div class="w-full flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <p
            v-if="selectedVehicleData?.totalDistance"
            class="text-md font-bold text-pretty"
          >
            {{ $t('labelTexts.totalDistance') }}
          </p>
          <p
            v-else
            class="text-xs text-rose-400 dark:text-rose-600"
          >
            {{ $t('placeholder.totalDistance') }}
          </p>
          <DGTooltip
            v-if="editableTrigger"
            :text="$t('vehicleDetail.updateVehicleCaution')"
            :popper="{ placement: 'top' }"
          >
            <Icon
              class="cursor-pointer text-rose-400 dark:text-rose-600"
              name="i-line-md-alert-circle"
              size="20px"
            />
          </DGTooltip>
        </div>
        <div class="w-full flex justify-end">
          <p
            v-if="selectedVehicleData?.totalDistance && !editableTrigger"
            class="text-lg font-bold text-right text-pretty"
          >
            {{ $t('unit.distance', { distance: comma(selectedVehicleData.totalDistance) }) }}
          </p>
          <AInput
            v-if="editableTrigger"
            v-model:input-data="updatedVehicleData.totalDistance"
            :input-placeholder="$t('placeholder.totalDistance')"
            input-class="w-full md:w-1/2"
            input-type="number"
            clearable
            @click:clear="() => validateEditTrigger = false"
            @update:model-value="() => $emit('validate:input', updatedVehicleData.totalDistance < 1)"
          />
        </div>
      </div>
      <DGDivider />
      <div class="w-full flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <p
            v-if="selectedVehicleData?.totalFuelAmount"
            class="text-md font-bold text-pretty"
          >
            {{ $t('labelTexts.totalFuelAmount') }}
          </p>
          <p
            v-else
            class="text-xs text-rose-400 dark:text-rose-600"
          >
            {{ $t('placeholder.totalFuelAmount') }}
          </p>
          <DGTooltip
            v-if="editableTrigger"
            :text="$t('vehicleDetail.updateVehicleCaution')"
            :popper="{ placement: 'top' }"
          >
            <Icon
              class="cursor-pointer text-rose-400 dark:text-rose-600"
              name="i-line-md-alert-circle"
              size="20px"
            />
          </DGTooltip>
        </div>
        <div class="w-full flex justify-end">
          <p
            v-if="selectedVehicleData?.totalFuelAmount && !editableTrigger"
            class="text-lg font-bold text-right text-pretty"
          >
            {{ $t('unit.fuelAmount', { fuelAmount: comma(selectedVehicleData?.totalFuelAmount || 0) }) }}
          </p>
          <AInput
            v-if="editableTrigger"
            v-model:input-data="updatedVehicleData.totalFuelAmount"
            :input-placeholder="$t('placeholder.totalFuelAmount')"
            input-class="w-full md:w-1/2"
            input-type="number"
            clearable
            @click:clear="() => validateEditTrigger = false"
            @update:model-value="() => $emit('validate:input', updatedVehicleData.totalFuelAmount < 1)"
          />
        </div>
      </div>
      <DGDivider />
      <div class="w-full flex flex-col gap-1">
        <p
          v-if="selectedVehicleData?.totalEfficient"
          class="text-md font-bold text-pretty"
        >
          {{ $t('labelTexts.totalEfficient') }}
        </p>
        <p
          v-if="selectedVehicleData?.totalEfficient"
          class="text-lg font-bold text-right text-pretty"
        >
          {{ $t('unit.fuelEfficient', { efficient: comma(selectedVehicleData?.totalEfficient) }) }}
        </p>
      </div>
      <DGDivider v-if="selectedVehicleData?.totalEfficient" />
      <div class="w-full flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <p
            v-if="selectedVehicleData?.totalPaidAmount"
            class="text-md font-bold text-pretty"
          >
            {{ $t('labelTexts.totalPaidAmount') }}
          </p>
          <p
            v-else
            class="text-xs text-rose-400 dark:text-rose-600"
          >
            {{ $t('placeholder.totalPaidAmount') }}
          </p>
          <DGTooltip
            v-if="editableTrigger"
            :text="$t('vehicleDetail.updateVehicleCaution')"
            :popper="{ placement: 'top' }"
          >
            <Icon
              class="cursor-pointer text-rose-400 dark:text-rose-600"
              name="i-line-md-alert-circle"
              size="20px"
            />
          </DGTooltip>
        </div>
        <div class="w-full flex justify-end">
          <p
            v-if="selectedVehicleData?.totalPaidAmount && !editableTrigger"
            class="text-lg font-bold text-right text-pretty"
          >
            {{ $t('unit.priceText', { price: comma(selectedVehicleData?.totalPaidAmount ?? 0) }) }}
          </p>
          <AInput
            v-if="editableTrigger"
            v-model:input-data="updatedVehicleData.totalPaidAmount"
            :input-placeholder="$t('placeholder.totalPaidAmount')"
            input-class="w-full md:w-1/2"
            input-type="number"
            clearable
            @click:clear="() => validateEditTrigger = false"
            @update:model-value="() => $emit('validate:input', updatedVehicleData.totalPaidAmount < 1)"
          />
        </div>
      </div>
    </div>
  </DGCard>
</template>

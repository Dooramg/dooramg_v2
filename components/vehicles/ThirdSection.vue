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

const { data: fuelDataList } = useAsyncData('fuelDataList', async () => {
  const { data } = await useFetch('/api/addVehicle/fuelData', { headers: useRequestHeaders(['cookie']) })
  if (!data.value) {
    return
  }
  return data.value
}, {
  immediate: true,
})
</script>

<template>
  <DGCard>
    <div class="flex flex-col gap-4">
      <div class="w-full flex flex-col gap-1">
        <p
          v-if="selectedVehicleData?.fuelData?.codeName"
          class="text-md font-bold text-pretty"
        >
          {{ $t('labelTexts.fuelType') }}
        </p>
        <div
          v-if="selectedVehicleData?.fuelData?.codeName"
          class="flex flex-col items-end gap-2"
        >
          <p
            v-if="!editableTrigger"
            class="text-lg font-bold text-right text-pretty"
          >
            {{ selectedVehicleData?.fuelData?.codeName }}
          </p>
          <DGSelect
            v-else
            v-model="updatedVehicleData.fuelTypeId"
            class="w-1/2"
            :options="fuelDataList"
            color="amber"
            value-attribute="id"
            option-attribute="codeName"
          />
        </div>
      </div>
      <DGDivider />
      <div class="w-full flex flex-col gap-1">
        <p
          v-if="selectedVehicleData?.tankSize"
          class="text-md font-bold text-pretty"
        >
          {{ $t('labelTexts.tankSize') }}
        </p>
        <p
          v-else
          class="text-xs text-rose-400 dark:text-rose-600"
        >
          {{ $t('placeholder.tankSize') }}
        </p>
        <div class="w-full flex justify-end">
          <p
            v-if="selectedVehicleData?.tankSize && !editableTrigger"
            class="text-lg font-bold text-right text-pretty"
          >
            {{ $t('unit.fuelAmount', { fuelAmount: comma(selectedVehicleData?.tankSize) }) }}
          </p>
          <AInput
            v-if="editableTrigger"
            v-model:input-data="updatedVehicleData.tankSize"
            :input-placeholder="$t('placeholder.tankSize')"
            input-class="w-full md:w-1/2"
            input-type="number"
            clearable
            @click:clear="() => validateEditTrigger = false"
            @update:model-value="() => $emit('validate:input', updatedVehicleData.tankSize < 1)"
          />
        </div>
      </div>
      <DGDivider />
      <div class="w-full flex flex-col gap-1">
        <p
          v-if="selectedVehicleData?.officialFuelEfficient"
          class="text-md font-bold text-pretty"
        >
          {{ $t('labelTexts.officialFuelEfficient') }}
        </p>
        <p
          v-else
          class="text-xs text-rose-400 dark:text-rose-600"
        >
          {{ $t('placeholder.officialFuelEfficient') }}
        </p>
        <div class="w-full flex justify-end">
          <p
            v-if="selectedVehicleData?.officialFuelEfficient && !editableTrigger"
            class="text-lg font-bold text-right text-pretty"
          >
            {{ $t('unit.fuelEfficient', { efficient: comma(selectedVehicleData?.officialFuelEfficient) }) }}
          </p>
          <AInput
            v-if="editableTrigger"
            v-model:input-data="updatedVehicleData.officialFuelEfficient"
            :input-placeholder="$t('placeholder.officialFuelEfficient')"
            input-class="w-full md:w-1/2"
            input-type="number"
            clearable
            @click:clear="() => validateEditTrigger = false"
            @update:model-value="() => $emit('validate:input', updatedVehicleData.officialFuelEfficient < 1)"
          />
        </div>
      </div>
      <DGDivider />
    </div>
  </DGCard>
</template>

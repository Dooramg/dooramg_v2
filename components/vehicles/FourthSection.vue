<script setup lang="ts">
const { headTextList, middleTextList, tailTextList } = storeToRefs(usePlateStore())

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

const selectPlateHeadId = defineModel('selectPlateHeadId', {
  type: String,
  default: '',
})

const selectPlateMiddleId = defineModel('selectPlateMiddleId', {
  type: String,
  default: '',
})

const selectPlateTailId = defineModel('selectPlateTailId', {
  type: String,
  default: '',
})

defineEmits([
  'select:plate-head-id',
  'select:plate-middle-id',
  'select:plate-tail-id',
  'validate:plate-number',
])
</script>

<template>
  <DGCard>
    <div class="flex flex-col gap-4">
      <div class="w-full flex flex-col gap-1">
        <p
          v-if="selectedVehicleData?.memo"
          class="text-md font-bold text-pretty"
        >
          {{ $t('labelTexts.memo') }}
        </p>
        <p
          v-else
          class="text-xs text-rose-400 dark:text-rose-600"
        >
          {{ $t('placeholder.memo') }}
        </p>
        <DGTextarea
          v-model="updatedVehicleData.memo"
          :disabled="!editableTrigger"
          color="amber"
          autoresize
          :placeholder="selectedVehicleData?.memo"
        />
      </div>
      <DGDivider />
      <div class="w-full flex flex-col gap-1">
        <p
          v-if="selectedVehicleData?.carNumber"
          class="text-md font-bold text-pretty"
        >
          {{ $t('labelTexts.vehicleNumber') }}
        </p>
        <div
          v-if="selectedVehicleData?.carNumber"
          class="w-full flex justify-end items-end"
        >
          <ALicensePlate
            v-if="!editableTrigger"
            :head-text="selectedVehicleData?.plateHeadText ?? '서울'"
            :middle-text="selectedVehicleData?.plateMiddleText ?? '강남'"
            :tail-text="selectedVehicleData?.plateTailText ?? '차'"
            :number-text="parseInt(selectedVehicleData?.plateNumber ?? '1004')"
          />
          <div
            v-else
            class="w-full flex flex-col items-end gap-2"
          >
            <DGSelect
              v-model="selectPlateHeadId"
              class="w-1/2"
              :options="headTextList"
              color="amber"
              value-attribute="id"
              option-attribute="codeName"
              @update:model-value="(id: string) => $emit('select:plate-head-id', id)"
            />
            <DGSelect
              v-if="selectPlateHeadId"
              v-model="selectPlateMiddleId"
              class="w-1/2"
              :options="middleTextList"
              color="amber"
              value-attribute="id"
              option-attribute="codeName"
              @update:model-value="(id: string) => $emit('select:plate-middle-id', id)"
            />
            <DGSelect
              v-if="selectPlateHeadId && selectPlateMiddleId"
              v-model="selectPlateTailId"
              class="w-1/2"
              :options="tailTextList"
              color="amber"
              value-attribute="id"
              option-attribute="codeName"
              @update:model-value="(id: string) => $emit('select:plate-tail-id', id)"
            />
            <AInput
              v-if="selectPlateTailId"
              v-model="updatedVehicleData.plateNumber"
              input-class="w-full md:w-1/2"
              input-size="sm"
              clearable
              @update:model-value="(value: string) => $emit('validate:plate-number', value)"
              @click:clear="() => updatedVehicleData.plateNumber = ''"
            />
          </div>
        </div>
      </div>
    </div>
  </DGCard>
</template>

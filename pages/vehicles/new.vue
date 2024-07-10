<script setup lang="ts">
import { format } from 'date-fns'
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const toast = useToast()
const { t } = useLocale()
const { checkNumber, numberRegex } = useUi()

const { insertData, updateData } = useFetchComposable()
const { loadCodeList } = useLoadCode()

const { userCoreId } = storeToRefs(useUserInfoStore())
const { headTextList, middleTextList, tailTextList } = storeToRefs(usePlateStore())

useHead({
  title: t('pageTitle.management'),
})

definePageMeta({
  layout: 'with-navigator',
  middleware: 'auth',
})

const vehicleModelData = ref()
const vehicleData = ref<InsertVehicleData>({
  carNickName: '',
  plateHeadText: '',
  plateMiddleText: '',
  plateTailText: '',
  plateNumber: '',
  carNumber: '',
  manufacturerId: '',
  vehicleModelId: '',
  manualModelName: '',
  makeYear: format(new Date(), 'yyyy'),
  fuelTypeId: '',
  userId: userCoreId.value,
})

const selectManualModelTrigger = ref(false)

const schema = object({
  carNickName: string()
    .required(t('validate.carNickName')),
  plateHeadText: string()
    .required(t('validate.plateHeadText')),
  plateMiddleText: string()
    .required(t('validate.plateMiddleText')),
  plateTailText: string()
    .required(t('validate.plateTailText')),
  plateNumber: string()
    .required(t('validate.plateNumber'))
    .min(4, t('validate.input4Digits'))
    .max(4, t('validate.input4Digits'))
    .matches(numberRegex, t('validate.inputNumber')),
  manufacturerId: string()
    .required(t('validate.manufacturerId')),
  vehicleModelId: string()
    .required(t('validate.vehicleModelId')),
  fuelTypeId: string()
    .required(t('validate.fuelTypeId')),
  makeYear: string()
    .required(t('validate.makeYear')),
})

type Schema = InferType<typeof schema>

const { data: manufacturerData } = useAsyncData('manufacturerData', async () => {
  const { data } = await useFetch('/api/addVehicle/manufacturer', {
    headers: useRequestHeaders(['cookie']),
  })

  if (!data.value) {
    return
  }

  return data.value
})

const { data: fuelData } = useAsyncData('fuelData', async () => {
  const { data } = await useFetch('/api/addVehicle/fuelData', { headers: useRequestHeaders(['cookie']) })
  if (!data.value) {
    return
  }
  return data.value
})

const selectPlateHeadText = async (codeName: string) => {
  const selectionHeadText = headTextList.value.find((headText: Code) => headText.codeName === codeName)

  await loadCodeList(selectionHeadText?.code ?? '')
}

const combinationCarNumber = () => {
  vehicleData.value.carNumber = vehicleData.value.plateHeadText.concat(' ', vehicleData.value.plateMiddleText, ' ', vehicleData.value.plateTailText, ' ', vehicleData.value.plateNumber ?? '')
}

const selectManufacturer = async (manufacturerId: string) => {
  const { data } = await useFetch('/api/addVehicle/vehicleModel', {
    headers: useRequestHeaders(['cookie']),
    params: {
      manufacturerId,
    },
  })

  vehicleModelData.value = data.value
}

const selectModel = (modelId: string) => {
  const manualModel = vehicleModelData.value.find((model: VehicleModelData) => model.id === modelId).name === '직접입력'

  manualModel
    ? selectManualModelTrigger.value = true
    : selectManualModelTrigger.value = false
}

const addVehicle = async (event: FormSubmitEvent<Schema>) => {
  if (!event.isTrusted) {
    return
  }

  const newVehicleData: SerializeObject = await insertData('vehicles', vehicleData.value)
  await updateData('userInfo', { mainVehicleId: newVehicleData?.id ?? '' }, userCoreId.value)

  toast.add({ title: t('messages.addVehicleSuccess.title'), description: t('messages.addVehicleSuccess.description'), color: 'amber', timeout: 3000 })
  navigateTo('/vehicles')
}

await loadCodeList('CMA')
await loadCodeList('CTM')
</script>

<template>
  <div class="w-dvw md:w-[500px] flex flex-col mt-8 px-8 pb-28 gap-4">
    <p class="text-2xl font-bold">
      {{ $t('pageTitle.management') }}
    </p>
    <DGForm
      :schema="schema"
      :state="vehicleData"
      class="w-auto space-y-4"
      @submit="addVehicle"
    >
      <DGFormGroup
        :label="$t('labelTexts.vehicleNickName')"
        name="carNickName"
        size="xl"
        eager-validation
        required
      >
        <AInput
          v-model:input-data="vehicleData.carNickName"
          :placeholder="t('validate.carNickName')"
          input-size="xl"
          clearable
          @update:model-value="combinationCarNumber"
        />
      </DGFormGroup>
      <DGFormGroup
        v-if="vehicleData.carNickName"
        :label="$t('labelTexts.vehicleHead')"
        name="plateHeadText"
        size="xl"
        :help="$t('addVehicle.notify.carHead')"
        required
      >
        <DGSelect
          v-model="vehicleData.plateHeadText"
          :options="headTextList"
          color="amber"
          value-attribute="codeName"
          option-attribute="codeName"
          @update:model-value="selectPlateHeadText"
        />
      </DGFormGroup>
      <DGFormGroup
        v-show="vehicleData.plateHeadText"
        :label="$t('labelTexts.vehicleMiddle')"
        name="plateMiddleText"
        size="xl"
        :help="$t('addVehicle.notify.carMiddle')"
        required
      >
        <DGSelect
          v-model="vehicleData.plateMiddleText"
          :options="middleTextList"
          color="amber"
          value-attribute="codeName"
          option-attribute="codeName"
        />
      </DGFormGroup>
      <DGFormGroup
        v-show="vehicleData.plateMiddleText"
        :label="$t('labelTexts.vehicleTail')"
        name="plateTailText"
        size="xl"
        :help="$t('addVehicle.notify.carTail')"
        required
      >
        <DGSelect
          v-model="vehicleData.plateTailText"
          :options="tailTextList"
          color="amber"
          value-attribute="codeName"
          option-attribute="codeName"
        />
      </DGFormGroup>
      <DGFormGroup
        v-show="vehicleData.plateTailText"
        :label="$t('labelTexts.vehicleNumber')"
        name="plateNumber"
        size="xl"
        eager-validation
        required
      >
        <AInput
          v-model:input-data="vehicleData.plateNumber"
          :placeholder="$t('validate.plateNumber')"
          input-size="xl"
          clearable
          @update:model-value="combinationCarNumber"
        />
      </DGFormGroup>
      <ALicensePlate
        v-if="vehicleData.plateHeadText && vehicleData.plateMiddleText && vehicleData.plateTailText && vehicleData.plateNumber?.length === 4"
        :head-text="vehicleData?.plateHeadText ?? '서울'"
        :middle-text="vehicleData?.plateMiddleText ?? '강남'"
        :tail-text="vehicleData?.plateTailText ?? '차'"
        :number-text="parseInt(vehicleData?.plateNumber ?? '1004')"
      />
      <DGFormGroup
        v-show="vehicleData.plateNumber?.length === 4 && checkNumber(vehicleData.plateNumber)"
        :label="$t('labelTexts.manufacturer')"
        name="manufacturerId"
        size="xl"
        :help="$t('addVehicle.notify.manufacturer')"
        required
      >
        <DGSelect
          v-model="vehicleData.manufacturerId"
          :options="manufacturerData"
          color="amber"
          value-attribute="id"
          option-attribute="name"
          @update:model-value="selectManufacturer"
        />
      </DGFormGroup>
      <DGFormGroup
        v-show="vehicleData.manufacturerId"
        :label="$t('labelTexts.vehicleModel')"
        name="plateHeadText"
        size="xl"
        :help="!selectManualModelTrigger ? $t('addVehicle.notify.models') : $t('addVehicle.notify.manualVehicleModel')"
        required
      >
        <div class="flex flex-col gap-4">
          <DGSelect
            v-model="vehicleData.vehicleModelId"
            :options="vehicleModelData"
            color="amber"
            value-attribute="id"
            option-attribute="name"
            @update:model-value="selectModel"
          />
          <AInput
            v-show="selectManualModelTrigger"
            v-model:input-data="vehicleData.manualModelName"
            :placeholder="t('validate.manualVehicleModel')"
            input-size="xl"
            clearable
          />
        </div>
      </DGFormGroup>
      <DGFormGroup
        v-show="vehicleData.vehicleModelId"
        :label="$t('labelTexts.makeYear')"
        name="makeYear"
        size="xl"
        required
      >
        <ADatePicker v-model:search-month="vehicleData.makeYear" />
      </DGFormGroup>
      <DGFormGroup
        v-show="vehicleData.vehicleModelId && vehicleData.makeYear"
        :label="$t('labelTexts.fuelType')"
        name="fuelTypeId"
        size="xl"
        :help="$t('addVehicle.notify.fuel')"
        required
      >
        <DGSelect
          v-model="vehicleData.fuelTypeId"
          :options="fuelData"
          color="amber"
          value-attribute="id"
          option-attribute="codeName"
        />
      </DGFormGroup>
      <DGFormGroup>
        <AButton
          v-if="vehicleData.carNickName && vehicleData.plateNumber"
          v-show="vehicleData.fuelTypeId"
          button-size="xl"
          button-variant="outline"
          :button-text="$t('buttons.save')"
          @click="addVehicle"
        />
      </DGFormGroup>
    </DGform>
  </div>
</template>

<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const toast = useToast()
const { t } = useLocale()
const { params } = useRoute()
const { url } = useImageStorage()
const { digitsRoundUp } = useUi()

const { upsertData, updateData } = useFetchComposable()
const { katechCoords } = storeToRefs(useUserLocation())
const { opiAroundQuery } = useQuery()

const { userCoreId } = storeToRefs(useUserInfoStore())
const { selectedVehicleData } = storeToRefs(useVehicleStore())

useHead({
  title: t('pageTitle.diary'),
})

definePageMeta({
  layout: 'with-navigator',
  middleware: 'auth',
})

const schema = object({
  totalDistance: string()
    .required(t('validate.carNickName'))
    .test('totalDistance', t('validate.lessTotalDistance'), (value) => {
      if (selectedVehicleData.value?.totalDistance && selectedVehicleData.value.totalDistance < Number(value)) {
        return true
      }
    }),
})

type Schema = InferType<typeof schema>

const manageVehicleData = ref<ManageVehicleData>({
  vehicleId: params.vehicleId as string,
  manageTypeId: '',
  userId: userCoreId.value,
  title: '',
  memo: '',
  driveDistance: 0,
  totalDistance: 0,
  fuelAmount: 0,
  paidAmount: 0,
  efficient: 0,
  destination: '',
  fuelStationName: '',
  fuelStationCode: '',
  stationImage: '',
})
const aroundStationList = ref()

const selectStationId = ref('')
const selectStationPrice = ref(0)
const diarySelectOption = ref('')
const vehicleFuelType = ref('')

const selectStationTrigger = ref(false)

const { data: fuelDataList } = useAsyncData('fuelDataList', async () => {
  const { data } = await useFetch('/api/addVehicle/fuelData', {
    headers: useRequestHeaders(['cookie']),
  })
  return data.value
}, {
  immediate: true,
})

const { data: totalStationList } = useAsyncData('totalStationList', async () => {
  const { data } = await useFetch('/api/management/fuelStation', {
    headers: useRequestHeaders(['cookie']),
  })

  return data.value
}, {
  immediate: true,
})

const loadManageType = async (code: string) => {
  const { data }: SerializeObject = await useFetch('/api/management/type', {
    headers: useRequestHeaders(['cookie']),
    query: {
      queryString: code,
    },
  })

  if (!data.value) {
    return
  }

  code === 'MTC002'
    ? selectStationTrigger.value = true
    : selectStationTrigger.value = false

  manageVehicleData.value.manageTypeId = data.value.id

  initManageData(true)
}

const selectFuelType = async () => {
  const opiFuelCode = fuelDataList.value?.filter((fuelData: SupabaseDataBase['public']['Tables']['fuelData']['Row']) => fuelData.code === vehicleFuelType.value).at(-1)?.opiCode

  if (!opiFuelCode) {
    return
  }

  const { data } = await useFetch('/api/common/opiApi', {
    params: {
      query: opiAroundQuery('/aroundAll.do', 'json', katechCoords.value.lon, katechCoords.value.lat, 2000, 2, opiFuelCode),
    },
  })

  await loadAroundFuelStation(data.value.RESULT.OIL, vehicleFuelType.value)
}

const loadAroundFuelStation = async (opiData: OpiApiData[], selectFuelCode: string) => {
  aroundStationList.value = opiData.map((opiData: OpiApiData) => {
    const loadData = {
      ...opiData,
      fuelTypeName: fuelDataList.value?.filter((fuelData: SupabaseDataBase['public']['Tables']['fuelData']['Row']) => fuelData.code === selectFuelCode)[0].codeName,
      stationImage: totalStationList.value?.filter((station: SupabaseDataBase['public']['Tables']['fuelStation']['Row']) => station.code === opiData.POLL_DIV_CD).at(-1)?.logoImage,
    }
    return loadData
  })
}

const selectCustomStation = () => {
  selectStationTrigger.value
    ? initManageData(false)
    : manageVehicleData.value.stationImage = url(true, '/custom_logo.svg')

  selectStationTrigger.value = !selectStationTrigger.value
}

const calculateFuelAmountByPaid = (paidAmount: number) => {
  if (paidAmount > 999 && diarySelectOption.value === 'MTC001') {
    manageVehicleData.value.fuelAmount = digitsRoundUp(paidAmount / selectStationPrice.value, 'round', 100)
  }
}

const addNewDiary = async (event: FormSubmitEvent<Schema>) => {
  if (!event.isTrusted) {
    return
  }

  manageVehicleData.value.driveDistance = manageVehicleData.value.totalDistance - (selectedVehicleData.value?.totalDistance ? selectedVehicleData.value.totalDistance : 0)

  const currentFuelAmount = selectedVehicleData.value?.currentFuelAmount as number > 0
    ? calculateCurrentFuelAmount(selectedVehicleData.value?.currentFuelAmount as number, calculateFuelAmount(manageVehicleData.value.driveDistance, selectedVehicleData.value?.officialFuelEfficient ?? 10), manageVehicleData.value.fuelAmount)
    : manageVehicleData.value.fuelAmount

  currentFuelAmount < 0
    ? manageVehicleData.value.fuelAmount = 0
    : manageVehicleData.value.fuelAmount = digitsRoundUp(currentFuelAmount, 'round', 100)

  manageVehicleData.value.efficient = calculateEfficient(manageVehicleData.value.driveDistance, manageVehicleData.value.fuelAmount
    ? manageVehicleData.value.fuelAmount
    : calculateEfficient(manageVehicleData.value.driveDistance, selectedVehicleData.value?.officialFuelEfficient ?? 10))

  const updateVehicleInfo = {
    currentFuelAmount: manageVehicleData.value.fuelAmount,
    totalDistance: manageVehicleData.value.totalDistance,
    totalFuelAmount: calculateSummery(selectedVehicleData.value?.totalFuelAmount ?? 0, manageVehicleData.value.fuelAmount),
    totalPaidAmount: calculateSummery(selectedVehicleData.value?.totalPaidAmount ?? 0, manageVehicleData.value.paidAmount),
    totalEfficient: calculateEfficient(manageVehicleData.value.totalDistance, selectedVehicleData.value?.totalFuelAmount ?? 0 + manageVehicleData.value.fuelAmount),
  }

  await upsertData('vehicleManagement', manageVehicleData.value, '', '')
  await updateData('vehicles', updateVehicleInfo, manageVehicleData.value.vehicleId as string)

  toast.add({ title: t('messages.addDiarySuccess.title'), description: t('messages.addDiarySuccess.description'), color: 'amber', timeout: 3000 })

  navigateTo('/')
}

const calculateCurrentFuelAmount = (currentFuel: number, spendFuel: number, chargeFuel: number) => {
  return digitsRoundUp(currentFuel - spendFuel + chargeFuel, 'round', 100)
}

const calculateSummery = (firstNum: number, secondNum: number) => {
  return digitsRoundUp(firstNum + secondNum, 'round', 100)
}

const calculateFuelAmount = (distance: number, efficient: number) => {
  return digitsRoundUp(distance / efficient, 'round', 100)
}

const calculateEfficient = (distance: number, fuelAmount: number) => {
  return digitsRoundUp(distance / fuelAmount, 'round', 100)
}

const selectStation = (station: OpiApiData) => {
  selectStationId.value = station.UNI_ID
  selectStationPrice.value = station.PRICE

  manageVehicleData.value.fuelStationName = station.OS_NM
  manageVehicleData.value.fuelStationCode = station.POLL_DIV_CD
  manageVehicleData.value.stationImage = station.stationImage

  selectStationTrigger.value = true
}

const initManageData = (allInitialize: boolean) => {
  if (allInitialize) {
    vehicleFuelType.value = ''
    manageVehicleData.value.title = ''
    manageVehicleData.value.destination = ''
    manageVehicleData.value.memo = ''
    manageVehicleData.value.totalDistance = 0
    manageVehicleData.value.paidAmount = 0
    manageVehicleData.value.fuelAmount = 0
    manageVehicleData.value.driveDistance = 0
  }

  selectStationId.value = ''
  selectStationPrice.value = 0

  manageVehicleData.value.fuelStationName = ''
  manageVehicleData.value.fuelStationCode = ''
  manageVehicleData.value.stationImage = ''
}

watch(() => vehicleFuelType.value, () => {
  initManageData(false)

  selectStationTrigger.value = false
}, {
  immediate: true,
})
</script>

<template>
  <div class="w-dvw md:w-[500px] flex flex-col mt-8 px-8 pb-28 gap-4">
    <DiarySelectOption
      v-model:select-option="diarySelectOption"
      @update:select-option="(code: string) => loadManageType(code)"
    />
    <DGForm
      :schema="schema"
      :state="manageVehicleData"
      class="w-auto space-y-4"
      @submit="addNewDiary"
    >
      <DGFormGroup
        v-if="diarySelectOption === 'MTC001'"
        :label="$t('labelTexts.fuelType')"
        name="vehicleFuelType"
        size="xl"
        :help="(vehicleFuelType === 'FUE001' || vehicleFuelType === 'FUE002') && !selectStationTrigger ? $t('management.fuelType') : ''"
        required
      >
        <div class="flex flex-col gap-4">
          <DGSelect
            v-model="vehicleFuelType"
            :options="fuelDataList"
            color="amber"
            value-attribute="code"
            option-attribute="codeName"
            @update:model-value="selectFuelType"
          />
          <DiaryAroundStation
            :around-station-list="aroundStationList"
            :select-station-id="selectStationId"
            :vehicle-fuel-type="vehicleFuelType"
            @select:station="(station: OpiApiData) => selectStation(station)"
          />
          <div v-if="(vehicleFuelType === 'FUE001' || vehicleFuelType === 'FUE002') && !aroundStationList?.length">
            {{ $t('management.noAroundStation') }}
          </div>
          <DiaryManualStation
            v-model:manage-data="manageVehicleData"
            v-model:manual-station-price="selectStationPrice"
            :select-station-trigger="selectStationTrigger"
            :vehicle-fuel-type="vehicleFuelType"
            @select:custom-station="selectCustomStation"
          />
        </div>
      </DGFormGroup>
      <DGFormGroup
        v-if="selectStationTrigger"
        :label="$t('labelTexts.totalDistance')"
        name="totalDistance"
        size="xl"
        :help="$t('management.totalDistance')"
        required
      >
        <AInput
          v-model:input-data="manageVehicleData.totalDistance"
          :input-placeholder="$t('placeholder.totalDistance')"
          use-leading
          input-type="number"
          leading-icon-name="i-tabler-road"
          clearable
        />
      </DGFormGroup>
      <DGFormGroup
        v-if="(manageVehicleData.totalDistance && diarySelectOption === 'MTC001') || (manageVehicleData.totalDistance && diarySelectOption === 'MTC002')"
        :label="diarySelectOption === 'MTC001' ? $t('labelTexts.fuelPaidAmount') : $t('labelTexts.paidAmount')"
        name="paidAmount"
        size="xl"
        :help="diarySelectOption === 'MTC001' ? $t('placeholder.fuelPaidAmount') : $t('placeholder.paidAmount')"
        required
      >
        <AInput
          v-model:input-data="manageVehicleData.paidAmount"
          :input-placeholder="diarySelectOption === 'MTC001' ? $t('placeholder.fuelPaidAmount') : $t('placeholder.paidAmount')"
          use-leading
          input-type="number"
          leading-icon-name="i-tabler-coin"
          clearable
          @update:model-value="calculateFuelAmountByPaid"
        />
      </DGFormGroup>
      <DGFormGroup
        v-if="manageVehicleData.totalDistance && manageVehicleData.paidAmount && diarySelectOption === 'MTC001'"
        :label="$t('labelTexts.fuelAmount')"
        name="fuelAmount"
        size="xl"
      >
        <AInput
          v-model:input-data="manageVehicleData.fuelAmount"
          use-leading
          input-type="number"
          leading-icon-name="i-tabler-gas-station"
          input-disabled
          use-trailing-text
          trailing-text="l"
        />
      </DGFormGroup>
      <DGFormGroup
        v-if="manageVehicleData.totalDistance && diarySelectOption === 'MTC002'"
        :label="$t('labelTexts.title')"
        name="title"
        size="xl"
      >
        <AInput
          v-model:input-data="manageVehicleData.title"
          :input-placeholder="$t('placeholder.inputTitle')"
          clearable
        />
      </DGFormGroup>
      <DGFormGroup
        v-if="manageVehicleData.totalDistance && diarySelectOption === 'MTC002'"
        :label="$t('labelTexts.destination')"
        name="destination"
        size="xl"
      >
        <AInput
          v-model:input-data="manageVehicleData.destination"
          :input-placeholder="$t('placeholder.destination')"
          clearable
        />
      </DGFormGroup>
      <DGFormGroup
        v-if="manageVehicleData.totalDistance"
        :label="$t('labelTexts.memo')"
        name="memo"
        size="xl"
      >
        <DGTextarea
          v-model="manageVehicleData.memo"
          color="amber"
          autoresize
          :placeholder="$t('placeholder.memo')"
        />
      </DGFormGroup>
      <DGFormGroup v-if="(diarySelectOption === 'MTC001' && manageVehicleData.paidAmount) || (diarySelectOption === 'MTC002' && manageVehicleData.title && manageVehicleData.destination)">
        <AButton
          button-block
          button-size="xl"
          button-type="submit"
          :button-text="$t('buttons.save')"
        />
      </DGFormGroup>
    </DGForm>
  </div>
</template>

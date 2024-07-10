<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const toast = useToast()
const { t } = useLocale()
const { params } = useRoute()
const { url } = useImageStorage()
const { comma, digitsRoundUp } = useUi()

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

const diaryOption = ref([
  {
    label: t('management.type.fuel'),
    value: 'MTC001',
  },
  {
    label: t('management.type.drive'),
    value: 'MTC002',
  },
])

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

watch(() => vehicleFuelType.value, () => {
  selectStationId.value = ''
  selectStationPrice.value = 0

  manageVehicleData.value.fuelStationName = ''
  manageVehicleData.value.fuelStationCode = ''
  manageVehicleData.value.stationImage = ''

  selectStationTrigger.value = false
}, {
  immediate: true,
})

const { data: fuelDataList } = useAsyncData('fuelDataList', async () => {
  const { data } = await useFetch('/api/addVehicle/fuelData', {
    headers: useRequestHeaders(['cookie']),
  })
  return data.value
})

const { data: totalStationList } = useAsyncData('totalStationList', async () => {
  const { data } = await useFetch('/api/management/fuelStation', {
    headers: useRequestHeaders(['cookie']),
  })

  return data.value
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

  selectStationId.value = ''
  selectStationPrice.value = 0
  vehicleFuelType.value = ''

  manageVehicleData.value.title = ''
  manageVehicleData.value.destination = ''
  manageVehicleData.value.memo = ''
  manageVehicleData.value.totalDistance = 0
  manageVehicleData.value.paidAmount = 0
  manageVehicleData.value.fuelAmount = 0
  manageVehicleData.value.driveDistance = 0
  manageVehicleData.value.fuelStationName = ''
  manageVehicleData.value.fuelStationCode = ''
  manageVehicleData.value.stationImage = ''
}

const selectFuelType = async () => {
  const opiFuelCode = fuelDataList.value?.filter((fuelData: SupabaseDataBase['public']['Tables']['fuelData']['Row']) => fuelData.code === vehicleFuelType.value).at(-1)?.opiCode

  if (!opiFuelCode) {
    return
  }

  const { data, refresh } = await useFetch('/api/common/opiApi', {
    params: {
      query: opiAroundQuery('/aroundAll.do', 'json', katechCoords.value.lon, katechCoords.value.lat, 2000, 2, opiFuelCode),
    },
  })

  if (!data.value) {
    await refresh()
  }

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

const selectStation = (station: OpiApiData) => {
  selectStationId.value = station.UNI_ID
  selectStationPrice.value = station.PRICE

  manageVehicleData.value.fuelStationName = station.OS_NM
  manageVehicleData.value.fuelStationCode = station.POLL_DIV_CD
  manageVehicleData.value.stationImage = station.stationImage

  selectStationTrigger.value = true
}

const selectCustomStation = () => {
  if (!selectStationTrigger.value) {
    manageVehicleData.value.stationImage = url(true, '/custom_logo.svg')
  }
  else {
    selectStationId.value = ''
    selectStationPrice.value = 0

    manageVehicleData.value.fuelStationName = ''
    manageVehicleData.value.fuelStationCode = ''
    manageVehicleData.value.stationImage = ''
  }

  selectStationTrigger.value = !selectStationTrigger.value
}

const calculateFuelAmount = (paidAmount: number) => {
  if (paidAmount > 999 && diarySelectOption.value === 'MTC001') {
    manageVehicleData.value.fuelAmount = digitsRoundUp(paidAmount / selectStationPrice.value, 'round', 100)
  }
}

const addDiary = async (event: FormSubmitEvent<Schema>) => {
  if (!event.isTrusted) {
    return
  }

  manageVehicleData.value.driveDistance = manageVehicleData.value.totalDistance - (selectedVehicleData.value?.totalDistance ? selectedVehicleData.value.totalDistance : 0)

  const calculateCurrentFuelAmount = selectedVehicleData.value?.currentFuelAmount as number > 0
    ? ((selectedVehicleData.value?.currentFuelAmount as number - digitsRoundUp(manageVehicleData.value.driveDistance / (selectedVehicleData.value?.officialFuelEfficient ?? 10), 'round', 100)) + manageVehicleData.value.fuelAmount)
    : manageVehicleData.value.fuelAmount

  calculateCurrentFuelAmount < 0
    ? manageVehicleData.value.fuelAmount = 0
    : manageVehicleData.value.fuelAmount = digitsRoundUp(calculateCurrentFuelAmount, 'round', 100)

  manageVehicleData.value.efficient = digitsRoundUp(manageVehicleData.value.driveDistance / (manageVehicleData.value.fuelAmount ? manageVehicleData.value.fuelAmount : (manageVehicleData.value.driveDistance / (selectedVehicleData.value?.officialFuelEfficient ?? 10))), 'round', 100)

  const updateVehicleInfo = {
    currentFuelAmount: manageVehicleData.value.fuelAmount,
    totalDistance: manageVehicleData.value.totalDistance,
    totalFuelAmount: digitsRoundUp((selectedVehicleData.value?.totalFuelAmount ?? 0) + manageVehicleData.value.fuelAmount, 'round', 100),
    totalPaidAmount: (selectedVehicleData.value?.totalPaidAmount ?? 0) + manageVehicleData.value.paidAmount,
    totalEfficient: digitsRoundUp(manageVehicleData.value.totalDistance / (selectedVehicleData.value?.totalFuelAmount ?? 0 + manageVehicleData.value.fuelAmount), 'round', 100),
  }

  await upsertData('vehicleManagement', manageVehicleData.value, '', '')
  await updateData('vehicles', updateVehicleInfo, manageVehicleData.value.vehicleId as string)

  toast.add({ title: t('messages.addDiarySuccess.title'), description: t('messages.addDiarySuccess.description'), color: 'amber', timeout: 3000 })

  navigateTo('/')
}
</script>

<template>
  <div class="w-dvw md:w-[500px] flex flex-col mt-8 px-8 pb-28 gap-4">
    <div
      class="w-full flex items-center justify-end flex-wrap gap-4"
      :class="!diarySelectOption ? 'flex-col items-stretch' : 'flex-row'"
    >
      <p class="text-2xl font-bold">
        {{ $t('management.title') }}
      </p>
      <div class="flex-auto" />
      <DGRadioGroup
        v-model="diarySelectOption"
        :options="diaryOption"
        color="amber"
        :legend="$t('management.legend')"
        @update:model-value="(code:string) => loadManageType(code)"
      />
    </div>
    <p
      v-if="!diarySelectOption"
      class="w-full text-center text-2xl font-bold mt-10"
    >
      {{ $t('management.legend') }}
    </p>
    <DGForm
      :schema="schema"
      :state="manageVehicleData"
      class="w-auto space-y-4"
      @submit="addDiary"
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
          <DGCard
            v-for="(station, index) in aroundStationList"
            v-show="(vehicleFuelType === 'FUE001' || vehicleFuelType === 'FUE002') && aroundStationList?.length"
            :key="index"
            class="cursor-pointer"
            :class="selectStationId === station.UNI_ID ? 'text-amber-700 dark:text-amber-300' : ''"
            @click="selectStation(station)"
          >
            <template #header>
              <div class="flex flex-wrap items-center gap-4">
                <DGAvatar
                  :src="station.stationImage"
                  size="lg"
                  alt="station-logo"
                  :ui="{ background: 'bg-transparent' }"
                />
                <p class="text-xl font-bold">
                  {{ station.OS_NM }}
                </p>
                <div class="flex-auto" />
                <p v-if="selectStationId === station.UNI_ID">
                  {{ $t('management.selectStation') }}
                </p>
              </div>
            </template>
            <div class="flex">
              <p class="text-lg font-bold">
                {{ station.fuelTypeName }}
              </p>
              <div class="flex-auto" />
              <p>
                {{ $t('management.fuelPrice', { price: comma(station.PRICE) }) }}
              </p>
            </div>
          </DGCard>
          <div v-if="(vehicleFuelType === 'FUE001' || vehicleFuelType === 'FUE002') && !aroundStationList?.length">
            {{ $t('management.noAroundStation') }}
          </div>
          <DGCard
            v-if="vehicleFuelType === 'FUE003' || vehicleFuelType === 'FUE004'"
            :class="selectStationTrigger ? 'text-amber-700 dark:text-amber-300' : ''"
          >
            <template #header>
              <div class="flex flex-wrap gap-4">
                <AInput
                  v-model:input-data="manageVehicleData.fuelStationName"
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
                v-model:input-data="manageVehicleData.fuelStationCode"
                :input-placeholder="$t('placeholder.inputFuelType')"
                use-leading
                leading-icon-name="i-tabler-list-check"
                clearable
              />
              <AInput
                v-model:input-data="selectStationPrice"
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
                @click="selectCustomStation"
              />
            </template>
          </DGCard>
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
          @update:model-value="calculateFuelAmount"
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
          :button-text="$t('buttons.save')"
          @click="addDiary"
        />
      </DGFormGroup>
    </DGForm>
  </div>
</template>

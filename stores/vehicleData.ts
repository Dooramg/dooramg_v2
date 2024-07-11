import { defineStore } from 'pinia'

export const useVehicleStore = defineStore('vehicleStore', () => {
  const { userInfoData } = toRefs(useUserInfoStore())
  /**
   * ! Pinia State !
   *
   * @param vehicleData 차량 정보
   * @param vehicleCount 보유 차량 개수
   * @param selectedVehicleData 선택된 차량 정보
   * @param noVehicleData 차량 정보 없음
   * @param exsistDiaryRecord 일지 기록 여부
   * @param fuelData 연료 타입정보
   *
   */
  const vehicleData = ref<StoreVehicleData[] | null | undefined>()

  const vehicleCount = computed(() => {
    return Number(vehicleData.value?.length)
  })

  const selectedVehicleData = computed<StoreVehicleData | null | undefined>(() => {
    console.log('userInfoData.value?.mainVehicleId in selectedVehicleData computed', userInfoData.value?.mainVehicleId)
    console.log('vehicleData.value in selectedVehicleData computed', vehicleData.value)

    return !userInfoData.value?.mainVehicleId
      ? vehicleData.value?.[0]
      : vehicleData.value?.filter(vehicle => vehicle.id === userInfoData.value?.mainVehicleId)[0]
  })

  const noVehicleData = computed<boolean>(() => vehicleData.value?.length === 0)

  const fuelData = ref<FuelData[] | null | undefined>()

  const exsistDiaryRecord = ref(false)

  return {
    vehicleData,
    vehicleCount,
    selectedVehicleData,
    noVehicleData,
    fuelData,
    exsistDiaryRecord,
  }
}, {
  persist: {
    storage: persistedState.localStorage,
  },
})

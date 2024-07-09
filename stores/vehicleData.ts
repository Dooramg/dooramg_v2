import { defineStore } from 'pinia'

export const useVehicleStore = defineStore('vehicleStore', () => {
  const { userInfoData } = toRefs(useUserInfoStore())
  /**
   * ! Pinia State !
   *
   * @param vehicleData 차량 정보
   * @param selectedVehicleData 선택된 차량 정보
   * @param noVehicleData 차량 정보 없음
   * @param exsistDiaryRecord 일지 기록 여부
   * @param fuelData 연료 타입정보
   *
   */
  const vehicleData = ref<StoreVehicleData[] | null | undefined>()

  const selectedVehicleData = computed<StoreVehicleData | null | undefined>(() => {
    return !userInfoData.value?.mainVehicleId
      ? vehicleData.value?.[0]
      : vehicleData.value?.filter(vehicle => vehicle.id === userInfoData.value?.mainVehicleId)[0]
  })

  const noVehicleData = computed<boolean>(() => vehicleData.value?.length === 0)

  const fuelData = ref<FuelData[] | null | undefined>()

  const exsistDiaryRecord = ref(false)

  return {
    vehicleData,
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

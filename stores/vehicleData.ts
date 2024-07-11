import { defineStore } from 'pinia'

export const useVehicleStore = defineStore('vehicleStore', () => {
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

  const selectedVehicleData = ref<StoreVehicleData>()

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

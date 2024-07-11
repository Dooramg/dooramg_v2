import { defineStore } from 'pinia'

export const useVehicleStore = defineStore('vehicleStore', () => {
  /**
   * ! Pinia State !
   *
   * @param vehicleData 차량 정보
   * @param selectedVehicleData 선택된 차량 정보
   * @param vehicleCount 보유 차량 개수
   *
   */
  const vehicleData = ref<StoreVehicleData[] | null | undefined>()
  const selectedVehicleData = ref<StoreVehicleData>()
  const vehicleCount = ref(0)

  return {
    vehicleData,
    vehicleCount,
    selectedVehicleData,
  }
}, {
  persist: {
    storage: persistedState.localStorage,
  },
})

export const useLoadVehicles = () => {
  const { userCoreId } = storeToRefs(useUserInfoStore())
  const { vehicleData } = storeToRefs(useVehicleStore())

  const { refresh: refreshVehicleData } = useAsyncData('userData', async () => {
    const { data } = await useFetch('/api/vehicles', {
      headers: useRequestHeaders(['cookie']),
      query: {
        userId: userCoreId.value,
      },
    })

    vehicleData.value = data?.value as StoreVehicleData[]
  }, {
    immediate: true,
  })

  return {
    refreshVehicleData,
  }
}

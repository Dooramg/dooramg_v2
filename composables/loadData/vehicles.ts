export const useLoadVehicles = () => {
  const user = useSupabaseUser()

  const { vehicleData, vehicleCount } = storeToRefs(useVehicleStore())

  const { refresh: refreshVehicleData } = useAsyncData('userData', async () => {
    const { data } = await useFetch('/api/vehicles', {
      headers: useRequestHeaders(['cookie']),
      query: {
        userId: user.value?.id,
      },
    })

    vehicleData.value = data?.value as StoreVehicleData[]
    vehicleCount.value = data?.value?.length ?? 0
  }, {
    immediate: true,
  })

  return {
    refreshVehicleData,
  }
}

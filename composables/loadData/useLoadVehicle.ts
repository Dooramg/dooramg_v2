export const useLoadVehicle = () => {
  const client = useSupabaseClient<SupabaseDataBase>()

  const { userInfoData } = storeToRefs(useUserInfoStore())
  const { vehicleData } = storeToRefs(useVehicleStore())

  const { refresh: refreshVehicleData } = useAsyncData('loadVehicleData', async () => {
    const { data, error } = await client
      .from('vehicles')
      .select('*, fuelData(id, codeName, opiCode, code), vehicleModel(name), manufacturer(name, logoImage)')
      .eq('userId', String(userInfoData.value.id))
      .order('createdAt', { ascending: true })

    if (error) {
      throw createError({ statusMessage: error.message })
    }

    vehicleData.value = data as StoreVehicleData[]
  })

  return {
    refreshVehicleData,
  }
}

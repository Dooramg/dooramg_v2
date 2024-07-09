import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<SupabaseDataBase>(event)
  const id = String(getQuery(event).vehicleId)

  const dateFilter = getQuery(event).dateFilter
  const startDate = getQuery(event).startDate
  const endDate = getQuery(event).endDate
  const range = Number(getQuery(event).rangeCount)

  if (dateFilter) {
    const { data, count, error } = await client
      .from('vehicleManagement')
      .select('*, manageType(codeName, code), vehicles(carNickName)', { count: 'exact' })
      .eq('vehicleId', id)
      .gt('createdAt', startDate)
      .lt('createdAt', endDate)
      .order('createdAt', { ascending: false })

    if (error) {
      throw createError({ statusMessage: error.message })
    }

    return { serverData: data, count }
  }
  else if (range) {
    const { data, count, error } = await client
      .from('vehicleManagement')
      .select('*, manageType(codeName, code), vehicles(carNickName)', { count: 'exact' })
      .eq('vehicleId', id)
      .order('createdAt', { ascending: false })
      .range(0, range)

    if (error) {
      throw createError({ statusMessage: error.message })
    }

    return { serverData: data, count }
  }
  else {
    const { data, count, error } = await client
      .from('vehicleManagement')
      .select('*, manageType(codeName, code), vehicles(carNickName)', { count: 'exact' })
      .eq('vehicleId', id)
      .order('createdAt', { ascending: false })

    if (error) {
      throw createError({ statusMessage: error.message })
    }

    return { serverData: data, count }
  }
})

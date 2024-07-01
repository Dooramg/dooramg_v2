import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<SupabaseDataBase>(event)
  const queryString = getQuery(event).queryString
  const vehicleId = getQuery(event).vehicleId

  const { data } = await client
    .from('vehicleManagement')
    .select(String(queryString))
    .eq('vehicleId', String(vehicleId))
    .order('createdAt', { ascending: false })

  if (!data) {
    return
  }

  return data
})

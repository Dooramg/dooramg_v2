import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<SupabaseDataBase>(event)
  const vehicleId = getQuery(event).vehicleId
  const queryString = getQuery(event).queryString

  const { data, error } = await client
    .from('vehicles')
    .select(String(queryString))
    .eq('id', String(vehicleId))

  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return { vehicleData: data }
})

import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<SupabaseDataBase>(event)
  const vehicleId = getQuery(event).vehicleId

  const { data, error } = await client
    .from('vehicles')
    .select('*')
    .eq('id', String(vehicleId))
    .single()

  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data
})

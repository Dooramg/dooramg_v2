import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<SupabaseDataBase>(event)
  const query = getQuery(event).manufacturerId

  const { data, error } = await client
    .from('vehicleModel')
    .select('*')
    .eq('manufacturerId', String(query))

  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data
})

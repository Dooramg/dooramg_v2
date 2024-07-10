import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<SupabaseDataBase>(event)
  const id = String(getQuery(event).userId)

  const { data, error } = await client
    .from('vehicles')
    .select('*, fuelData(id, codeName, opiCode, code), vehicleModel(name), manufacturer(name, logoImage)')
    .eq('userId', id)
    .order('createdAt', { ascending: true })

  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data
})

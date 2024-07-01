import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<SupabaseDataBase>(event)

  const { data, error } = await client
    .from('manufacturer')
    .select('*')

  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data
})

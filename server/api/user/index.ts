import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<SupabaseDataBase>(event)
  const id = String(getQuery(event).userId)

  const { data, error } = await client
    .from('userInfo')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data
})

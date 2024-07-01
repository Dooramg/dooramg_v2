import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const client = await serverSupabaseClient<SupabaseDataBase>(event)
  const queryString = getQuery(event).queryString
  const userId = getQuery(event).userId

  const { data, error } = await client
    .from('vehicles')
    .select(String(queryString))
    .eq('userId', userId ?? String(user?.id))
    .order('createdAt', { ascending: true })

  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data
})

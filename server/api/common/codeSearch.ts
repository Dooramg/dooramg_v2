import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<SupabaseDataBase>(event)
  const query = getQuery(event).searchText

  const { data, error } = await client
    .from('code')
    .select('code, codeName, codeCategory')
    .textSearch('codeCategory', String(query))

  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data
})

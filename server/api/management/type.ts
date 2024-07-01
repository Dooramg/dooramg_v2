import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<SupabaseDataBase>(event)
  const queryString = getQuery(event).queryString

  if (queryString) {
    const { data, error } = await client
      .from('manageType')
      .select('*')
      .eq('code', queryString)
      .single()

    if (error) {
      throw createError({ statusMessage: error.message })
    }

    return data
  }
  else {
    const { data, error } = await client
      .from('manageType')
      .select('*')

    if (error) {
      throw createError({ statusMessage: error.message })
    }

    return data
  }
})

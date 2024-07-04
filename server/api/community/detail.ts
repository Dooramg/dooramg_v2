import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<SupabaseDataBase>(event)

  const query = getQuery(event)

  const { data, error } = await client
    .from('boardCommunity')
    .select('*, communityLikeCount(*), userInfo(nickName, isAdmin)')
    .order('createdAt', { ascending: false })
    // .eq('isPublished', true)
    .eq('id', query.id as string)
    .single()

  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data
})

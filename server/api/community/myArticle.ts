import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<SupabaseDataBase>(event)

  const query = getQuery(event)
  const userId = query.userId as string

  const { data, count, error } = await client
    .from('boardCommunity')
    .select('*, communityLikeCount(*), userInfo(nickName, isAdmin)', { count: 'exact' })
    .order('createdAt', { ascending: false })
    .eq('userId', userId)

  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return { serverData: data, count }
})

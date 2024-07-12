import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<SupabaseDataBase>(event)

  const query = getQuery(event)

  const { data, error } = await client
    .from('communityCommentList')
    .select('*, userInfo(nickName, isAdmin)')
    .order('createdAt', { ascending: false })
    .eq('boardId', query.id as string)

  if (error) {
    throw createError({ statusMessage: error.message })
  }

  return data
})

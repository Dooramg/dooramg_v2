import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<SupabaseDataBase>(event)

  const query = getQuery(event)

  const rangeCount = query.dataRange ? Number(query.dataRange) : 0
  const page = query.page ? Number(query.page) : 1
  const pageCount = query.pageCount ? Number(query.pageCount) : 10

  const supabasePageCalc = (page: number, pageCount: number, firstRange: boolean): number => {
    return firstRange
      ? (page - 1) * pageCount
      : (page * pageCount) - 1
  }

  if (!rangeCount) {
    const { data, count, error } = await client
      .from('boardNotice')
      .select('*, noticeLikeCount(*), userInfo(nickName, isAdmin)', { count: 'exact' })
      .order('createdAt', { ascending: false })
      // .eq('isPublished', true)
      .range(supabasePageCalc(page, pageCount, true), supabasePageCalc(page, pageCount, false))

    if (error) {
      throw createError({ statusMessage: error.message })
    }

    return { data, count }
  }
  else {
    const { data, count, error } = await client
      .from('boardNotice')
      .select('*, noticeLikeCount(*), userInfo(nickName, isAdmin)', { count: 'exact' })
      .order('createdAt', { ascending: false })
      // .eq('isPublished', true)
      .range(0, rangeCount)

    if (error) {
      throw createError({ statusMessage: error.message })
    }

    return { data, count }
  }
})

import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<SupabaseDataBase>(event)

  const query = getQuery(event)
  const searchType = query.searchType
  const textType = query.textType as string
  const searchText = query.searchText as string

  const page = query.page ? Number(query.page) : 1
  const pageCount = query.pageCount ? Number(query.pageCount) : 10

  const supabasePageCalc = (page: number, pageCount: number, firstRange: boolean): number => {
    return firstRange
      ? (page - 1) * pageCount
      : (page * pageCount) - 1
  }

  if (searchType === 'searchTotal') {
    const { data, error } = await client
      .from('boardCommunity')
      .select('*, communityLikeCount(*), userInfo(nickName, isAdmin)')
      .order('createdAt', { ascending: false })
      // .eq('isPublished', true)
      .range(supabasePageCalc(page, pageCount, true), supabasePageCalc(page, pageCount, false))

    if (error) {
      throw createError({ statusMessage: error.message })
    }

    return data
  }
  else {
    const { data, error } = await client
      .from('boardCommunity')
      .select('*, communityLikeCount(*), userInfo(nickName, isAdmin)')
      .order('createdAt', { ascending: false })
      // .eq('isPublished', true)
      .textSearch(textType, searchText, {
        type: 'websearch',
        config: 'english',
      })
      .range(supabasePageCalc(page, pageCount, true), supabasePageCalc(page, pageCount, false))

    if (error) {
      throw createError({ statusMessage: error.message })
    }

    return data
  }
})

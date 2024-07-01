export const useLoadUser = () => {
  const user = useSupabaseUser()
  const client = useSupabaseClient<SupabaseDataBase>()

  const { userCoreId, userInfoData } = storeToRefs(useUserInfoStore())

  const { refresh: refreshUserData } = useAsyncData('userData', async () => {
    const { data, error } = await client
      .from('userInfo')
      .select('*')
      .eq('id', String(user.value?.id))
      .single()

    if (error) {
      throw createError({ statusMessage: error.message })
    }

    userInfoData.value = data
    userCoreId.value = data?.id
  })

  return {
    refreshUserData,
  }
}

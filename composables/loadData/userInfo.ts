export const useLoadUser = () => {
  const user = useSupabaseUser()

  const { userCoreId, userInfoData } = storeToRefs(useUserInfoStore())

  const { refresh: refreshUserData } = useAsyncData('userData', async () => {
    const { data } = await useFetch('/api/user', {
      headers: useRequestHeaders(['cookie']),
      query: {
        userId: user.value?.id,
      },
    })

    userInfoData.value = data?.value
    userCoreId.value = data?.value?.id ?? ''
  }, {
    immediate: true,
  })

  return {
    refreshUserData,
  }
}

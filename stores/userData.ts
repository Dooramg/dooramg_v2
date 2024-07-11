import { defineStore } from 'pinia'

export const useUserInfoStore = defineStore('userInfoData', () => {
  /**
   * ! Pinia State !
   *
   * @param userCoreId 사용자 UID
   * @param userInfoData 사용자 정보
   *
   */

  const userCoreId = ref<string>('')
  const userInfoData = ref<UserData>()

  return {
    userCoreId,
    userInfoData,
  }
}, {
  persist: {
    storage: persistedState.localStorage,
  },
})

import { defineStore } from 'pinia'

export const useUserInfoStore = defineStore('UserInfoData', () => {
  /**
   * ! Pinia State !
   *
   * @param userCoreId 사용자 UID
   * @param userInfoData 사용자 정보
   *
   */

  const userCoreId = ref<string>('')
  const userInfoData = ref<UserData | null>()

  return {
    userCoreId,
    userInfoData,
  }
}, {
  persist: {
    storage: persistedState.localStorage,
  },
})

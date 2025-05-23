import { defineStore } from 'pinia'

export const useUserInfoStore = defineStore('userInfoData', () => {
  /**
   * ! Pinia State !
   *
   * @param userCoreId 사용자 UID
   * @param userInfoData 사용자 정보
   *
   */

  const userCoreId = ref('')
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

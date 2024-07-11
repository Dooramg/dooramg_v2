import { defineStore } from 'pinia'

export const useDiaryStore = defineStore('diaryDataStore', () => {
  /**
   * ! Pinia State !
   *
   * @param mainDiaryCount 메인 다이어리 개수
   *
   */

  const mainDiaryCount = ref(0)

  return {
    mainDiaryCount,
  }
}, {
  persist: {
    storage: persistedState.localStorage,
  },
})

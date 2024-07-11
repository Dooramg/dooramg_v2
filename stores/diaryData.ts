import { defineStore } from 'pinia'

export const useDiaryStore = defineStore('diaryDataStore', () => {
  /**
   * ! Pinia State !
   *
   * @param allDiaryCount 모든 다이어리 개수
   * @param mainDiaryCount 메인 다이어리 개수
   *
   */

  const allDiaryCount = ref(0)
  const mainDiaryCount = ref(0)

  return {
    allDiaryCount,
    mainDiaryCount,
  }
}, {
  persist: {
    storage: persistedState.localStorage,
  },
})

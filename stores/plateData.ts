import { defineStore } from 'pinia'

export const usePlateStore = defineStore('plateStore', () => {
  /**
   * ! Pinia State !
   *
   * @param headTextList 번호판 첫번째 텍스트 리스트
   * @param middleTextList 번호판 두번째 텍스트 리스트
   * @param tailTextList 번호판 세번째 텍스트 리스트
   *
   */

  const headTextList = ref<Code[]>([])
  const middleTextList = ref<Code[]>([])
  const tailTextList = ref<Code[]>([])

  return {
    headTextList,
    middleTextList,
    tailTextList,
  }
}, {
  persist: {
    storage: persistedState.localStorage,
  },
})

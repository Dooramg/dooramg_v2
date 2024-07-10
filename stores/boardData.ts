import { defineStore } from 'pinia'

export const useBoardStore = defineStore('boardDataStore', () => {
  /**
   * ! Pinia State !
   *
   * @param individualArticleCount 개인 게시글 수
   * @param communityArticleCount 커뮤니티 게시글 수
   * @param noticeArticleCount 공지사항 게시글 수
   *
   */

  const individualArticleCount = ref(0)
  const communityArticleCount = ref(0)
  const noticeArticleCount = ref(0)

  return {
    individualArticleCount,
    communityArticleCount,
    noticeArticleCount,
  }
}, {
  persist: {
    storage: persistedState.localStorage,
  },
})

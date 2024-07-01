import { defineStore } from 'pinia'

export const useBoardStore = defineStore('BoardData', () => {
  /**
   * ! Pinia State !
   *
   * @param noticeLike 공지 좋아요 데이터
   * @param communityLike 커뮤니티 좋아요 데이터
   *
   */

  const noticeLike = ref<LikeCountData[]>([])
  const communityLike = ref<LikeCountData[]>([])

  return {
    noticeLike,
    communityLike,
  }
}, {
  persist: {
    storage: persistedState.localStorage,
  },
})

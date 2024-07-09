import { defineStore } from 'pinia'

export const useDiaryStore = defineStore('diaryDataStore', () => {
  /**
   * ! Pinia State !
   *
   * @param allDiaryData 모든 다이어리 데이터
   * @param mainDiaryData 메인 다이어리 데이터
   * @param allDiaryCount 모든 다이어리 개수
   * @param fuelCount 연료 주입 수
   * @param tripCount 여행 수
   *
   */

  const allDiaryData = ref<DiaryData[]>([])
  const mainDiaryData = ref<DiaryData[]>([])

  const allDiaryCount = ref(0)
  const fuelCount = computed(() => {
    return allDiaryData.value.filter((diary: DiaryData) => diary.manageType.code === 'MTC001').length
  })
  const tripCount = computed(() => {
    return allDiaryData.value.filter((diary: DiaryData) => diary.manageType.code === 'MTC002').length
  })
  const registrationCount = computed(() => {
    return allDiaryData.value.filter((diary: DiaryData) => diary.manageType.code === 'MTC003').length
  })

  return {
    allDiaryData,
    mainDiaryData,
    allDiaryCount,
    fuelCount,
    tripCount,
    registrationCount,
  }
}, {
  persist: {
    storage: persistedState.localStorage,
  },
})

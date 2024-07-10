import { defineStore } from 'pinia'

export const useUserLocation = defineStore('userLocation', () => {
  /**
   * ! Pinia State !
   *
   * @param latitude 위도
   * @param longitude 경도
   * @param katechCoord KATECH 좌표
   *
   */
  const latitude = ref(0)
  const longitude = ref(0)

  const { data: katechCoords, refresh: refreshKatechCoords } = useAsyncData('katechCoords', async () => {
    if (!latitude.value || !longitude.value) {
      return
    }

    const { data } = await useFetch('/api/common/skGeoApi', {
      params: {
        query: useQuery().skGeoQuery('/geo/coordconvert?version=1',
          latitude.value,
          longitude.value,
          'WGS84GEO',
          'KATECH',
        ),
      },
    })

    if (!data.value) {
      return
    }

    return data.value?.coordinate
  })

  return {
    latitude,
    longitude,
    katechCoords,
    refreshKatechCoords,
  }
}, {
  persist: {
    storage: persistedState.localStorage,
  },
})

<script setup lang="ts">
import { NaverMap, NaverMarker, NaverInfoWindow } from 'vue3-naver-maps'

const mapOfDom = ref()
const marker = ref()
const infoWindow = ref()
const infoWindowTrigger = ref(false)

const { latitude } = storeToRefs(useUserLocation())
const { longitude } = storeToRefs(useUserLocation())

const props = withDefaults(
  defineProps<{
    isReadable: boolean
    loadLatitude?: number
    loadLongitude?: number
  }>(),
  {
    loadLatitude: 0,
    loadLongitude: 0,
  },
)

const emits = defineEmits([
  'update:address',
])

const markerLatitude = ref(0)
const markerLongitude = ref(0)
const markerAddress = ref<NaverResAddr>()

const mapOptions = {
  zoom: 16,
  zoomControl: true,
  zoomControlOptions: {
    position: 'TOP_RIGHT',
    style: 2,
  },
}

const infoWindowOption = {
  anchorSize: {
    width: 10,
    height: 8,
  },
}

const loadMap = (map: any) => {
  mapOfDom.value = map
  const latLng = new window.naver.maps.LatLng(props.isReadable ? props.loadLatitude : latitude.value, props.isReadable ? props.loadLongitude : longitude.value)
  map.setCenter(latLng)
}

const loadMarker = (markerObject: any) => {
  marker.value = markerObject
}

const loadInfoWindow = (infoWindowObject: any) => {
  infoWindow.value = infoWindowObject
  infoWindow.value.setOptions(infoWindowOption)
}

const clickMap = (map: any) => {
  if (props.isReadable) {
    return
  }
  marker.value.setPosition(map.coord)
}

const clickMarker = async (markerObject: any) => {
  if (!infoWindowTrigger.value) {
    markerLatitude.value = markerObject.coord.y
    markerLongitude.value = markerObject.coord.x
    await window.naver.maps.Service.reverseGeocode({
      coords: window.naver.maps.LatLng(markerObject.coord.y, markerObject.coord.x),
      orders: 'legalcode,admcode,addr,roadaddr',
    }, returnData)
  }
  infoWindowTrigger.value = !infoWindowTrigger.value
}

const returnData = (status: any, response: any) => {
  if (status !== 200) {
    return alert('잘못됨!')
  }
  markerAddress.value = response.v2.address
  emits('update:address', markerAddress.value, markerLatitude.value, markerLongitude.value)
}
</script>

<template>
  <naver-map
    class="naver-map"
    :map-options="mapOptions"
    @click="clickMap"
    @on-load="loadMap"
  >
    <naver-marker
      :latitude="isReadable ? loadLatitude : latitude"
      :longitude="isReadable ? loadLongitude : longitude"
      @on-load="loadMarker"
      @click="clickMarker"
    />
    <naver-info-window
      :marker="marker"
      :open="infoWindowTrigger"
      :options="infoWindowOption"
      @on-load="loadInfoWindow"
      @click="() => infoWindowTrigger = false"
    >
      <div class="info-window-component">
        {{ markerAddress?.roadAddress ? $t('naverMaps.address', { address: markerAddress.roadAddress }) : $t('naverMaps.address', { address: markerAddress?.jibunAddress }) }}
      </div>
    </naver-info-window>
  </naver-map>
</template>

<script lang="ts" setup>
import type { VueDaumPostcodeCompleteResult } from 'vue-daum-postcode'

const colorMode = useColorMode()

withDefaults(
  defineProps<{
    customClass?: string
    searchWord?: string
  }>(),
  {
    customClass: '',
    searchWord: '',
  },
)

const emits = defineEmits([
  'select-address',
])

const colorTheme = computed(() => {
  const theme = {
    bgColor: 'inherit',
    searchBgColor: 'inherit',
    contentBgColor: 'inherit',
    pageBgColor: 'inherit',
    textColor: 'inherit',
    queryTextColor: 'inherit',
    outlineColor: 'inherit',
  }
  switch (colorMode.value) {
    case 'light' :
      theme.bgColor = '#fbf9f9'
      theme.searchBgColor = '#fbf9f9'
      theme.contentBgColor = '#fbf9f9'
      break
    case 'sepia' :
      theme.bgColor = '#ede8e8'
      theme.searchBgColor = '#ede8e8'
      theme.contentBgColor = '#ede8e8'
      theme.pageBgColor = '#cfbbb9'
      theme.textColor = '#1a0c0a'
      theme.queryTextColor = '#e7ae4b'
      theme.outlineColor = '#412f33'
      break
    case 'dark' :
      theme.bgColor = '#0b0505'
      theme.searchBgColor = '#0b0505'
      theme.contentBgColor = '#0b0505'
      theme.pageBgColor = '#1a0c0a'
      theme.textColor = '#fafdff'
      theme.queryTextColor = '#f6e1bc'
      theme.outlineColor = '#ede8e8'
      break
  }
  return theme
})

const onComplete = (newResult: VueDaumPostcodeCompleteResult) => {
  if (!newResult) {
    return
  }

  let selectedAddress = ''
  switch (newResult.userLanguageType) {
    case 'K' :
      switch (newResult.userSelectedType) {
        case 'J' :
          selectedAddress = newResult.autoJibunAddress
          break
        case 'R' :
          selectedAddress = newResult.roadAddress
      }
      break
    case 'E' :
      switch (newResult.userSelectedType) {
        case 'J' :
          selectedAddress = newResult.autoJibunAddressEnglish
          break
        case 'R' :
          selectedAddress = newResult.roadAddressEnglish
      }
      break
  }
  emits('select-address', selectedAddress)
}
</script>

<template>
  <PostCode
    :class="customClass"
    :q="searchWord"
    :animation="true"
    :no-shorthand="true"
    :please-read-guide="2"
    :please-read-guide-timer="1"
    :max-suggest-items="1"
    :hide-map-btn="true"
    :theme="colorTheme"
    @complete="onComplete"
  />
</template>

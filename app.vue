<script setup lang="ts">
const { t } = useLocale()
const { meta } = useRoute()
const { coords, resume } = useGeolocation()

const userLocation = useUserLocation()

const { refreshKatechCoords } = userLocation
const { latitude, longitude } = storeToRefs(userLocation)

const seoTitle = '두람쥐'
const seoDescription = '이세상 모든 이륜자동차(오토바이)를 위한 두바퀴 차계부 입니다.'
const seoUrl = 'https://www.dooramg.com'
const seoImage = 'https://www.dooramg.com/image/image_og.png'

useHead({
  titleTemplate: (title: string | undefined) => {
    let returnTitle = null
    title && !title?.includes(t('pageTitle.drg').concat(' | '))
      ? returnTitle = t('pageTitle.drg').concat(' | ', title)
      : returnTitle = null
    return returnTitle
  },
})

watchEffect(() => {
  if (coords.value.latitude === Infinity) {
    resume()
    return
  }

  latitude.value = coords.value.latitude
  longitude.value = coords.value.longitude
  refreshKatechCoords()
})

if (import.meta.server) {
  useHead({
    title: (meta.title as string) ?? 'Dooramg',
    htmlAttrs: {
      lang: 'ko',
    },
    meta: () => [
      { name: 'msapplication-TileColor', content: '#fff7e9' },
      { name: 'theme-color', content: '#fff7e9' },
    ],
    link: [
      { rel: 'canonical', href: seoUrl },
      { rel: 'icon', type: 'image/png', href: '/image/logo-non-text.png' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/image/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/image/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/image/favicon-16x16.png' },
      { rel: 'manifest', href: '/dooramg.webmanifest' },
      { rel: 'mask-icon', href: '/image/safari-pinned-tab.svg', color: '#5bbad5' },
    ],
  })
}

useSeoMeta({
  charset: 'utf-16',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0',
  formatDetection: 'telephone=no',
  themeColor: '#783931',
  keywords: 'Dooramg,두람쥐,모터사이클,오토바이,차계부,할리데이비슨,오토바이차계부,바이크,motorcycle,harleydavidson,harley,honda,혼다,ducati,두카티,bmw,비엠더블유,ktm,케이티엠,yamaha,야마하,royalenfield,로얄엔필드,custom,커스텀,커스텀바이크,custombike,custombikes,커스텀바이크',
  title: seoTitle,
  author: 'Dewdew',
  description: seoDescription,
  ogType: 'website',
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogUrl: seoUrl,
  ogImage: seoImage,
  ogImageSecureUrl: seoImage,
  ogImageType: 'image/png',
  ogImageWidth: '410',
  ogImageHeight: '200',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: seoImage,
})
</script>

<template>
  <div>
    <VitePwaManifest />
    <NuxtLayout>
      <div>
        <NuxtLoadingIndicator
          color="repeating-linear-gradient(to right,#bdbdbd 0%,#cb8a80 100%)"
          :height="5"
        />
        <NuxtPage />
        <DGNotifications />
        <MarkerSvg />
      </div>
      <InstallPwa />
    </NuxtLayout>
  </div>
</template>

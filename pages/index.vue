<script setup lang="ts">
const user = useSupabaseUser()
const { url } = useImageStorage()

definePageMeta({
  middleware: 'logined',
})

const firstImage = url(true, '/assets/introImage/signup.png')
const secondImage = url(true, '/assets/introImage/add_content.png')
const thirdImage = url(true, '/assets/introImage/get_start.png')

const activeIndex = ref(0)
const isLast = ref(false)

const introData = ref([
  {
    title: '반갑습니다 👋🏻',
    description: '이륜차 차계부 두람쥐에 어서오세요!!',
    imageUrl: '',
  },
  {
    title: 'DRG 이용방법 🎲',
    description: '간단한 회원가입이 필요해요❗️',
    imageUrl: firstImage,
  },
  {
    title: 'DRG 이용방법 🎲',
    description: '두바퀴를 등록해주세요! 🛵',
    imageUrl: secondImage,
  },
  {
    title: '준비완료 🤎',
    description: '이제 사용하러 가시죠! 🌰',
    imageUrl: thirdImage,
  },
])

const introTitle = computed(() => {
  return introData.value[activeIndex.value].title
})

const introDescription = computed(() => {
  return introData.value[activeIndex.value].description
})

const introImageUrl = computed(() => {
  return introData.value[activeIndex.value].imageUrl
})

const buttonAction = () => {
  if (activeIndex.value++ > 1) {
    isLast.value = true
  }
}
</script>

<template>
  <div
    v-show="!user"
    class="h-dvh flex flex-col justify-center items-center gap-8"
  >
    <IntroHeader
      :title="introTitle"
      :description="introDescription"
      :index="activeIndex"
    />
    <IntroController
      :index="activeIndex"
      :image-url="introImageUrl"
      :is-last="isLast"
      @click-next="buttonAction"
    />
  </div>
</template>

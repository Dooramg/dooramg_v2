<script setup lang="ts">
const staticTexts = reactive({
  title: 'Not Found!',
  description: '페이지를 찾을 수 없어요:(',
  button: 'Home',
  largeText: '404',
})
</script>

<template>
  <NuxtLayout>
    <div class="w-full h-screen flex flex-col items-center justify-center gap-6">
      <div class="flex flex-col gap-2 border-4 p-4 rounded-xl">
        <p class="text-3xl font-bold">
          {{ staticTexts.title }}
        </p>
        <p class="text-3xl font-bold">
          {{ staticTexts.description }}
        </p>
        <NuxtLink
          class="flex items-center justify-center w-fit mx-auto mt-3 text-xl font-bold border-2 p-2 hover:bg-gray-500 rounded-lg"
          to="/"
        >
          {{ staticTexts.button }}
        </NuxtLink>
      </div>
      <div class="fixed top-2/3 left-1/3 text-9xl text-[30em] font-bold">
        {{ staticTexts.largeText }}
      </div>
    </div>
  </NuxtLayout>
</template>

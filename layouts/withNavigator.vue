<script setup lang="ts">
const { go, back } = useRouter()
</script>

<template>
  <div class="h-dvh w-auto lg:w-[500px] flex flex-col items-center">
    <div class="h-8 w-dvw md:w-[500px] mt-4 px-4 md:px-2 flex items-center gap-4">
      <Icon
        class="cursor-pointer m-1"
        name="line-md:arrow-small-left"
        :width="36"
        :height="36"
        @click="back()"
      />
      <div class="flex-auto" />
      <Icon
        class="cursor-pointer"
        name="line-md:rotate-270"
        :width="36"
        :height="36"
        @click="go(0)"
      />
      <NuxtLink
        class="flex justify-center items-center"
        to="/setting/user"
      >
        <HeaderAvatar />
      </NuxtLink>
    </div>
    <slot />
    <ANavigationBar />
  </div>
</template>

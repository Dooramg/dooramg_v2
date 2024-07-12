<script setup lang="ts">
const { go, back } = useRouter()
</script>

<template>
  <div class="h-dvh w-auto lg:w-[500px] flex flex-col items-center">
    <div class="h-8 w-dvw md:w-[500px] my-4 px-8 md:px-4 flex items-center gap-4">
      <Icon
        class="ml-2 cursor-pointer hover:text-red-200"
        name="line-md:arrow-small-left"
        :width="48"
        :height="48"
        @click="back()"
      />
      <div class="flex-auto" />
      <Icon
        class="cursor-pointer hover:text-red-200"
        name="line-md:rotate-270"
        :width="48"
        :height="48"
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

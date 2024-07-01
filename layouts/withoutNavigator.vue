<script setup lang="ts">
const { go, back } = useRouter()
</script>

<template>
  <div class="h-dvh w-auto lg:w-[500px] flex flex-col items-start">
    <div class="w-dvw md:w-[500px] mt-4 px-4 md:px-0 flex justify-start">
      <Icon
        class="ml-2 cursor-pointer"
        name="line-md:arrow-small-left"
        :width="36"
        :height="36"
        @click="back"
      />
      <div class="flex-auto" />
      <Icon
        class="refresh cursor-pointer"
        name="line-md:rotate-270"
        :width="36"
        :height="36"
        @click="go(0)"
      />
    </div>
    <slot />
    <InstallPwa />
  </div>
</template>

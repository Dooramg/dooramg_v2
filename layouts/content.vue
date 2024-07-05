<script setup lang="ts">
const { back } = useRouter()
</script>

<template>
  <div class="h-dvh w-auto lg:w-[500px] flex flex-col items-center">
    <div class="w-dvw md:w-[500px] my-4 px-4 md:px-2 flex items-end">
      <Icon
        class="ml-2 cursor-pointer"
        name="line-md:arrow-small-left"
        :width="36"
        :height="36"
        @click="back"
      />
      <div class="flex-auto" />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const { go } = useRouter()
</script>

<template>
  <div class="h-dvh w-auto lg:w-[500px] flex flex-col items-center">
    <div class="w-dvw md:w-[500px] mt-4 px-4 md:px-0 flex items-center gap-4">
      <NuxtImg
        class="cursor-pointer"
        src="/image/logo-text.svg"
        :width="100"
        :height="40"
        alt="logo"
      />
      <div class="flex-auto" />
      <Icon
        class="refresh cursor-pointer"
        name="line-md:rotate-270"
        :width="36"
        :height="36"
        @click="go(0)"
      />
      <NuxtLink
        v-if="user?.id"
        to="/setting/user"
      >
        <HeaderAvatar />
      </NuxtLink>
    </div>
    <slot />
    <InstallPwa />
    <ANavigationBar />
  </div>
</template>

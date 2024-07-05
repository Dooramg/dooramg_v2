<template>
  <div class="h-dvh w-auto lg:w-[500px] flex flex-col items-center justify-center">
    <div class="fixed w-dvw md:w-[500px] my-4 px-4 md:px-2 top-0 flex justify-start">
      <NuxtImg
        class="cursor-pointer"
        :width="50"
        loading="lazy"
        src="/image/logo.png"
        @click="navigateTo('/')"
      />
    </div>
    <slot />
    <div class="flex items-center gap-3 mt-8">
      <SwitchTheme switch-size="lg" />
      <SwitchLanguage />
      <DGButton
        size="sm"
        color="amber"
        :label="$t('buttons.policy')"
        @click="navigateTo('/document')"
      />
    </div>
  </div>
</template>

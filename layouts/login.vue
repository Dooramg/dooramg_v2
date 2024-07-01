<template>
  <div class="h-dvh w-auto lg:w-[500px] flex flex-col items-center">
    <div class="w-dvw md:w-[500px] mt-4 px-4 md:px-0 flex justify-start">
      <NuxtImg
        class="cursor-pointer"
        :width="80"
        loading="lazy"
        src="/image/logo-text.svg"
        @click="navigateTo('/')"
      />
    </div>
    <slot />
    <InstallPwa />
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

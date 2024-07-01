<script setup lang="ts">
const { t } = useLocale()

useHead({
  title: t('pageTitle.setting'),
})

definePageMeta({
  layout: 'with-navigator',
  middleware: 'auth',
})
</script>

<template>
  <div class="w-dvw md:w-[400px] flex flex-col mt-8">
    <p class="text-2xl font-bold px-8">
      {{ $t('setting.title') }}
    </p>
    <div class="w-auto flex flex-col items-center mt-20 px-8 gap-4">
      <AButton
        custom-class="w-full flex justify-center"
        button-size="lg"
        button-variant="outline"
        :button-text="t('buttons.userInfo')"
        @click="navigateTo('/setting/user')"
      />
      <AButton
        custom-class="w-full flex justify-center"
        button-size="lg"
        button-variant="outline"
        :button-text="t('buttons.notice')"
        @click="navigateTo('/board/notice')"
      />
      <AButton
        custom-class="w-full flex justify-center"
        button-size="lg"
        button-variant="outline"
        :button-text="t('buttons.patch')"
        @click="navigateTo('/patch')"
      />
      <AButton
        custom-class="w-full flex justify-center"
        button-size="lg"
        button-variant="outline"
        :button-text="t('buttons.policy')"
        @click="navigateTo('/document')"
      />
    </div>
    <div class="flex justify-center items-center mt-20 px-8 gap-4">
      <SwitchTheme switch-size="lg" />
      <SwitchLanguage />
    </div>
    <FooterSetting />
  </div>
</template>

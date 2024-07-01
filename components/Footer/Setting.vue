<template>
  <div class="flex flex-col justify-center mt-8">
    <div class="flex justify-center mb-20 gap-8">
      <AButton
        use-leading
        button-size="xs"
        button-padded="false"
        button-variant="outline"
        icon-name="i-line-md-github-twotone"
        :icon-size="18"
        :button-text="$t('setting.contactGithub')"
        @click="navigateTo('https://github.com/yeonjulee1005/')"
      />
      <AButton
        use-leading
        button-size="xs"
        button-padded="false"
        button-variant="outline"
        icon-name="i-line-md-email-twotone-alt"
        :icon-size="18"
        :button-text="$t('setting.contactEmail')"
        @click="navigateTo('mailto:yeonju.lee1005@kakao.com', { external: true })"
      />
    </div>
    <p class="text-xs text-center">
      {{ $t('setting.copyright') }}
    </p>
    <p class="text-xs text-center">
      {{ $t('setting.developer') }}
    </p>
    <p class="text-xs text-center">
      {{ $t('texts.webVersion', { version: useRuntimeConfig().public.appVersion.replaceAll('"', '') }) }}
    </p>
  </div>
</template>

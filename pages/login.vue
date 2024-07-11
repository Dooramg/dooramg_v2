<script setup lang="ts">
import { track } from '@vercel/analytics'

const toast = useToast()
const deviceCheck = useDevice()
const { t } = useLocale()

const { auth } = useSupabaseClient()

useHead({
  title: t('pageTitle.login'),
})

definePageMeta({
  layout: 'login',
  middleware: 'logined',
})

const magicLinkDialogTrigger = ref(false)
const isApp = ref(false)
const isApple = deviceCheck.isApple

onMounted(() => {
  isApp.value = navigator ? navigator.userAgent.includes('APP_Dooramg') : false
})

const getUrl = () => {
  let url = useRuntimeConfig().public.siteUrl ?? 'http://localhost:4040/'
  url = url.includes('http') ? url : `https://${url}`
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
  return url.concat('confirm')
}

const userLogin = (provider: 'kakao' | 'github' | 'apple' | 'google' | 'discord' | 'magic') => {
  track('Login Provider', { provider })
  switch (provider) {
    case 'magic' :
      magicLinkDialogTrigger.value = true
      break
    case 'apple' :
      loginOauthApple(provider)
      break
    default :
      loginOAuth(provider)
  }
}

const loginOauthApple = async (provider: 'apple') => {
  await auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: getUrl(),
    },
  })
}

const loginOAuth = async (provider: 'kakao' | 'github' | 'apple' | 'google' | 'discord') => {
  const { error } = await auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: getUrl(),
    },
  })

  toast.add({ title: t('messages.loginSuccess.title'), description: t('messages.loginSuccess.description'), color: 'amber', timeout: 2000 })

  if (error) {
    toast.add({ title: t('messages.loginFailed.title'), description: t('messages.loginFailed.description'), color: 'amber', timeout: 2000 })
  }
}

const loginMagicLink = async (email: string) => {
  const { error } = await auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: getUrl(),
    },
  })

  toast.add({ title: t('messages.magicLinkSuccess.title'), description: t('messages.magicLinkSuccess.description'), color: 'amber', timeout: 2000 })

  if (error) {
    toast.add({ title: error.message, color: 'red', timeout: 2000 })
  }
}
</script>

<template>
  <div class="w-dvw md:w-[400px] px-4 md:px-0 flex flex-col justify-center items-center gap-4 mt-8">
    <div class="text-2xl font-bold mb-4">
      {{ $t('login.title') }}
    </div>
    <AButton
      custom-class="w-full flex justify-center"
      button-size="lg"
      use-leading
      icon-name="tabler:mail-bolt"
      :icon-size="24"
      :button-text="$t('texts.magicEmail')"
      @click="userLogin('magic')"
    />
    <AButton
      custom-class="w-full flex justify-center"
      button-size="lg"
      use-leading
      icon-name="tabler:message-circle"
      :icon-size="24"
      :button-text="$t('texts.kakao')"
      @click="userLogin('kakao')"
    />
    <AButton
      custom-class="w-full flex justify-center"
      button-size="lg"
      use-leading
      icon-name="tabler:brand-github"
      :icon-size="24"
      :button-text="$t('texts.gitHub')"
      @click="userLogin('github')"
    />
    <AButton
      custom-class="w-full flex justify-center"
      button-size="lg"
      use-leading
      icon-name="tabler:brand-apple"
      :icon-size="24"
      :button-text="$t('texts.apple')"
      @click="userLogin('apple')"
    />
    <AButton
      v-if="!isApp || (isApp && !isApple)"
      custom-class="w-full flex justify-center"
      button-size="lg"
      use-leading
      icon-name="tabler:brand-google"
      :icon-size="24"
      :button-text="$t('texts.google')"
      @click="userLogin('google')"
    />
    <AButton
      custom-class="w-full flex justify-center"
      button-size="lg"
      use-leading
      icon-name="tabler:brand-discord"
      :icon-size="24"
      :button-text="$t('texts.discord')"
      @click="userLogin('discord')"
    />
    <DialogMagicLink
      v-model:dialog-trigger="magicLinkDialogTrigger"
      :title="$t('login.magicLinkDialogTitle')"
      :double-first-text="$t('buttons.send')"
      :double-second-text="$t('buttons.close')"
      @submit:email="loginMagicLink"
      @close:dialog="() => magicLinkDialogTrigger = false"
    />
  </div>
</template>

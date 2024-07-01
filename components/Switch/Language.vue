<script setup lang="ts">
const { t, locale, setLocale } = useLocale()

const locales = [
  { label: t('localeMenu.korean'), value: 'ko' },
  { label: t('localeMenu.english'), value: 'en' },
]

const selectLocale = computed({
  get() {
    return locale.value
  },
  set(value) {
    setLocale(value)
  },
})
</script>

<template>
  <DGSelectMenu
    v-model="selectLocale"
    color="amber"
    size="sm"
    variant="outline"
    :options="locales"
    value-attribute="value"
    option-attribute="label"
  >
    <template #label>
      <Icon
        :name="selectLocale === 'ko' ? 'circle-flags:kr' : 'circle-flags:us'"
        :width="20"
        :height="20"
      />
      {{ selectLocale === 'ko' ? t('localeMenu.korean') : t('localeMenu.english') }}
    </template>
  </DGSelectMenu>
</template>

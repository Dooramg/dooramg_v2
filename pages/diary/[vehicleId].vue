<script setup lang="ts">
const { t } = useLocale()

useHead({
  title: t('pageTitle.diary'),
})

definePageMeta({
  layout: 'with-navigator',
  middleware: 'auth',
})
</script>

<template>
  <div>
    다이어리 등록
  </div>
</template>

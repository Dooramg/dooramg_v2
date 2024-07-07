<script setup lang="ts">
const { t } = useLocale()
const { params } = useRoute()

useHead({
  title: t('pageTitle.vehicles'),
})

definePageMeta({
  layout: 'without-navigator',
  middleware: 'auth',
})

console.log(params.vehicleId)
</script>

<template>
  <div>
    {{ params.vehicleId }}
  </div>
</template>

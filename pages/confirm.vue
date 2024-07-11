<script setup lang="ts">
const user = useSupabaseUser()

watch(() => user, async () => {
  if (user.value) {
    navigateTo('/main')
  }
}, { immediate: true })
</script>

<template>
  <div class="h-dvh flex flex-col items-center justify-center">
    <div class="flex flex-col items-center gap-8">
      <Icon
        name="svg-spinners:clock"
        :width="120"
        :height="120"
      />
      <p class="text-2xl font-bold">
        {{ $t('login.process') }}
      </p>
    </div>
  </div>
</template>

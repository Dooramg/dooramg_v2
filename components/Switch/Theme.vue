<script setup lang="ts">
const colorMode = useColorMode()

withDefaults(
  defineProps<{
    customClass?: string
    switchSize?: 'sm' | 'md' | 'lg'
  }>(),
  {
    customClass: '',
    switchSize: 'md',
  },
)

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  },
})
</script>

<template>
  <DGToggle
    v-model="isDark"
    :size="switchSize"
    :class="customClass"
    color="amber"
    on-icon="i-tabler-moon"
    off-icon="i-tabler-sun"
  />
</template>

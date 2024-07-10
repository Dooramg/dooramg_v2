<script setup lang="ts">
import type { ToggleSize } from '#ui/types'

const colorMode = useColorMode()

withDefaults(
  defineProps<{
    customClass?: string
    toggleSize?: ToggleSize | undefined
  }>(),
  {
    customClass: '',
    toggleSize: 'lg',
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
    :size="toggleSize"
    :class="customClass"
    color="amber"
    on-icon="i-tabler-moon"
    off-icon="i-tabler-sun"
  />
</template>

<script setup lang="ts">
const { width } = useWindowSize()

withDefaults(
  defineProps<{
    index?: number
    imageUrl?: string
    isLast?: boolean
  }>(),
  {
    index: 0,
    imageUrl: '',
    isLast: false,
  },
)

const emits = defineEmits([
  'click-next',
])
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <NuxtImg
      v-if="index"
      class="intro-image"
      :src="imageUrl"
      quality="40"
      preload
      :width="width < 600 ? 200 : 300"
      format="png"
    />
    <div class="flex flex-row justify-center items-center gap-4">
      <AButton
        :button-text="$t('buttons.skip')"
        @click="navigateTo('/login')"
      />
      <AButton
        :button-text="isLast ? $t('buttons.goLogin') : $t('buttons.next')"
        @click="isLast ? navigateTo('/login') : emits('click-next')"
      />
    </div>
  </div>
</template>

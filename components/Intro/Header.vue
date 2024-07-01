<script setup lang="ts">
const { width } = useWindowSize()

const settingIconSize = computed(() => {
  return width.value < 500 ? 80 : 140
})

withDefaults(
  defineProps<{
    title?: string
    description?: string
    index?: number
  }>(),
  {
    title: '',
    description: '',
    index: 0,
  },
)
</script>

<template>
  <div class="flex flex-col justify-center items-center gap-2">
    <p class="text-4xl font-bold">
      {{ title }}
    </p>
    <p class="text-xl font-medium">
      {{ description }}
    </p>
    <Icon
      v-if="!index"
      class="my-10"
      name="line-md:cog-loop"
      :width="settingIconSize"
      :height="settingIconSize"
    />
  </div>
</template>

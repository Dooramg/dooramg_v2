<script setup lang="ts">
const { locale } = useLocale()

withDefaults(
  defineProps<{
    dateTime?: string | ComputedRef<string> | null
    customClass?: string
    fullDateTime?: boolean
    capitalDateTime?: boolean
  }>(),
  {
    dateTime: '',
    customClass: '',
    fullDateTime: true,
    capitalDateTime: false,
  },
)
</script>

<template>
  <div>
    <NuxtTime
      v-if="fullDateTime"
      :datetime="dateTime"
      :locale="locale"
      :class="customClass"
      :year="capitalDateTime ? 'numeric' : '2-digit'"
      :month="capitalDateTime ? 'long' : 'short'"
      :day="capitalDateTime ? 'numeric' : '2-digit'"
      :hour="capitalDateTime ? 'numeric' : '2-digit'"
      :minute="capitalDateTime ? 'numeric' : '2-digit'"
    />
    <!-- :second="capitalDateTime ? 'numeric' : '2-digit'" -->
    <NuxtTime
      v-else
      :datetime="dateTime"
      :locale="locale"
      :class="customClass"
      :year="capitalDateTime ? 'numeric' : '2-digit'"
      :month="capitalDateTime ? 'long' : 'short'"
      :day="capitalDateTime ? 'numeric' : '2-digit'"
    />
  </div>
</template>

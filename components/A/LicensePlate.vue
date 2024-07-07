<script setup lang="ts">
withDefaults(
  defineProps<{
    customClass?: string
    headText?: string
    middleText?: string
    tailText?: string
    numberText?: number
  }>(),
  {
    customClass: '',
    headText: '',
    middleText: '',
    tailText: '',
    numberText: 0,
  },
)
</script>

<template>
  <div
    class="w-fit border-4 border-sky-500/80 rounded-lg px-4 py-2"
    :class="customClass"
  >
    <div class="w-full flex justify-around items-center gap-1">
      <Icon
        class="text-sky-500/80"
        name="i-ic-round-pentagon"
        :width="18"
        :height="18"
      />
      <div class="flex gap-1 text-sky-500/80">
        <span class="text-2xl font-bold">
          {{ headText }}
        </span>
        <span
          v-if="middleText"
          class="text-2xl font-bold"
        >
          {{ middleText }}
        </span>
      </div>
      <Icon
        class="text-sky-500/80"
        name="i-ic-round-circle"
        :width="18"
        :height="18"
      />
    </div>
    <div class="w-fit flex justify-between items-end">
      <div class="text-3xl font-bold text-sky-500/80 mr-4">
        {{ tailText }}
      </div>
      <div class="text-5xl font-bold text-sky-500/80">
        {{ String(numberText).length < 4 ? '0'.concat(String(numberText)) : numberText }}
      </div>
    </div>
  </div>
</template>

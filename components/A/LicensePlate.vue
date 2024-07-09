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
    class="w-fit h-fit rounded-lg bg-white p-1"
    :class="customClass"
  >
    <div class="border-4 border-sky-500/80 rounded-lg px-2 py-1">
      <div class="w-full flex justify-around items-center gap-1">
        <Icon
          class="text-sky-500/80"
          name="i-tabler-pentagon-filled"
          :width="18"
          :height="18"
        />
        <div class="flex gap-1 text-sky-500/80">
          <span class="text-xl sm:text-2xl font-bold">
            {{ headText }}
          </span>
          <span
            v-if="middleText"
            class="text-xl sm:text-2xl font-bold"
          >
            {{ middleText }}
          </span>
        </div>
        <Icon
          class="text-sky-500/80"
          name="i-tabler-circle-filled"
          :width="18"
          :height="18"
        />
      </div>
      <div class="w-fit flex justify-between items-end">
        <div class="text-xl sm:text-3xl font-bold text-sky-500/80 mr-4">
          {{ tailText }}
        </div>
        <div class="text-4xl sm:text-5xl font-bold text-sky-500/80">
          {{ String(numberText).length < 4 ? '0'.concat(String(numberText)) : numberText }}
        </div>
      </div>
    </div>
  </div>
</template>

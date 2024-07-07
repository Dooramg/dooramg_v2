<script setup lang="ts">
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
import { DatePicker as VCalendarDatePicker } from 'v-calendar'
import type { DatePickerDate, DatePickerRangeObject } from 'v-calendar/dist/types/src/use/datePicker.d.ts'
import 'v-calendar/dist/style.css'

const { locale } = useLocale()

const props = defineProps({
  modelValue: {
    type: [Date, Object] as PropType<DatePickerDate | DatePickerRangeObject | null>,
    default: null,
  },
})

const emit = defineEmits(['update:model-value', 'close'])

const date = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:model-value', value)
    emit('close')
  },
})

const breakpoints = useBreakpoints(breakpointsTailwind)
const smallerThanSm = breakpoints.smaller('sm')

const attrs = {
  'transparent': true,
  'borderless': true,
  'color': 'primary',
  'is-dark': { selector: 'html', darkClass: 'dark' },
  'first-day-of-week': 2,
}
</script>

<template>
  <VCalendarDatePicker
    v-if="date && (date as DatePickerRangeObject)?.start && (date as DatePickerRangeObject)?.end"
    v-model.range="date"
    :columns="smallerThanSm ? 1 : 2"
    :rows="smallerThanSm ? 2 : 1"
    :locale="locale === 'ko' ? 'ko' : 'en'"
    v-bind="{ ...attrs, ...$attrs }"
  />
  <VCalendarDatePicker
    v-else
    v-model="date"
    :locale="locale === 'ko' ? 'ko' : 'en'"
    v-bind="{ ...attrs, ...$attrs }"
  />
</template>

<style>
:root {
  --vc-gray-50: rgb(var(--color-neutral-50));
  --vc-gray-100: rgb(var(--color-neutral-100));
  --vc-gray-200: rgb(var(--color-neutral-200));
  --vc-gray-300: rgb(var(--color-neutral-300));
  --vc-gray-400: rgb(var(--color-neutral-400));
  --vc-gray-500: rgb(var(--color-neutral-500));
  --vc-gray-600: rgb(var(--color-neutral-600));
  --vc-gray-700: rgb(var(--color-neutral-700));
  --vc-gray-800: rgb(var(--color-neutral-800));
  --vc-gray-900: rgb(var(--color-neutral-900));
}

.vc-primary {
  --vc-accent-50: rgb(var(--color-orange-50));
  --vc-accent-100: rgb(var(--color-orange-100));
  --vc-accent-200: rgb(var(--color-orange-200));
  --vc-accent-300: rgb(var(--color-orange-300));
  --vc-accent-400: rgb(var(--color-orange-400));
  --vc-accent-500: rgb(var(--color-orange-500));
  --vc-accent-600: rgb(var(--color-orange-600));
  --vc-accent-700: rgb(var(--color-orange-700));
  --vc-accent-800: rgb(var(--color-orange-800));
  --vc-accent-900: rgb(var(--color-orange-900));
}
</style>

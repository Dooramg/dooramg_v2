<script setup lang="ts">
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
import { sub, format, isSameDay, type Duration } from 'date-fns'

const { t, locale } = useLocale()

const breakpoints = useBreakpoints(breakpointsTailwind)
const smallerThanSm = breakpoints.smaller('sm')

const selectedDate = defineModel('searchMonth', {
  type: Object,
  default: () => ({ start: sub(new Date(), { days: 14 }), end: new Date() }),
})

const ranges = [
  { label: t('texts.last7Days'), duration: { days: 7 } },
  { label: t('texts.last14Days'), duration: { days: 14 } },
  { label: t('texts.last30Days'), duration: { days: 30 } },
  { label: t('texts.last3Months'), duration: { months: 3 } },
  { label: t('texts.last6Months'), duration: { months: 6 } },
  { label: t('texts.lastYear'), duration: { years: 1 } },
]

const isRangeSelected = (duration: Duration) => {
  return isSameDay(selectedDate.value.start, sub(new Date(), duration)) && isSameDay(selectedDate.value.end, new Date())
}

const selectRange = (duration: Duration) => {
  selectedDate.value = { start: sub(new Date(), duration), end: new Date() }
}
</script>

<template>
  <DGPopover :popper="{ placement: 'bottom-start' }">
    <AButton
      icon-name="i-heroicons-calendar-days-20-solid"
      :button-text="`${format(selectedDate.start, locale === 'ko' ? 'yy년 M월 d일' : 'MMM d, yy')} ~ ${format(selectedDate.end, locale === 'ko' ? 'yy년 M월 d일' : 'MMM d, yy')}`"
      button-size="xl"
    />
    <template #panel="{ close }">
      <div class="flex flex-col sm:flex-row items-center sm:divide-x divide-gray-200 dark:divide-gray-800">
        <div
          v-if="!smallerThanSm"
          class="flex flex-col py-4"
        >
          <AButton
            v-for="(range, index) in ranges"
            :key="index"
            class="rounded-none px-6 text-sm"
            :class="[isRangeSelected(range.duration) ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50']"
            :button-text="range.label"
            button-color="gray"
            button-variant="ghost"
            button-truncate
            @click="selectRange(range.duration)"
          />
        </div>
        <div
          v-else
          class="flex gap-2"
        >
          <AButton
            v-for="(range, index) in ranges.slice(2, 5)"
            :key="index"
            class="rounded-none text-sm"
            :class="[isRangeSelected(range.duration) ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50']"
            :button-text="range.label"
            button-color="gray"
            button-variant="ghost"
            button-size="xl"
            button-truncate
            @click="selectRange(range.duration)"
          />
        </div>
        <DGDivider v-if="smallerThanSm" />
        <AVCalendar
          v-model="selectedDate"
          @close="close"
        />
      </div>
    </template>
  </DGPopover>
</template>

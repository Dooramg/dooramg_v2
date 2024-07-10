<script setup lang="ts">
import { format } from 'date-fns'

const { locale } = useLocale()

const selectedDate = defineModel('searchMonth', {
  type: String,
  default: '',
})

const emit = defineEmits(
  ['update:calendar'],
)

const selectCalendarDate = ref(new Date())

const updateCalendarDate = (selectDate: Date) => {
  selectCalendarDate.value = selectDate
  selectedDate.value = format(selectDate, 'yyyy')
  emit('update:calendar')
}
</script>

<template>
  <DGPopover :popper="{ placement: 'bottom-start' }">
    <AButton
      icon-name="i-heroicons-calendar-days-20-solid"
      :button-text="`${format(selectCalendarDate, locale === 'ko' ? 'yyyy' : 'yyyy')}`"
      button-size="xl"
    />
    <template #panel="{ close }">
      <AVCalendar
        v-model="selectedDate"
        @close="close"
        @update:model-value="updateCalendarDate"
      />
    </template>
  </DGPopover>
</template>

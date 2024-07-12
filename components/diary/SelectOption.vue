<script setup lang="ts">
const { t } = useLocale()

const selectOption = defineModel('selectOption', {
  type: String,
  default: '',
})

defineEmits([
  'update:select-option',
])

const diaryOption = ref([
  {
    label: t('management.type.fuel'),
    value: 'MTC001',
  },
  {
    label: t('management.type.drive'),
    value: 'MTC002',
  },
])
</script>

<template>
  <div>
    <div
      class="w-full flex items-center justify-end flex-wrap gap-4"
      :class="!selectOption ? 'flex-col items-stretch' : 'flex-row'"
    >
      <p class="text-2xl font-bold">
        {{ $t('management.title') }}
      </p>
      <div class="flex-auto" />
      <DGRadioGroup
        v-model="selectOption"
        :options="diaryOption"
        color="amber"
        :legend="$t('management.legend')"
        @update:model-value="(code:string) => $emit('update:select-option', code)"
      />
    </div>
    <p
      v-if="!selectOption"
      class="w-full text-center text-2xl font-bold mt-10"
    >
      {{ $t('management.legend') }}
    </p>
  </div>
</template>

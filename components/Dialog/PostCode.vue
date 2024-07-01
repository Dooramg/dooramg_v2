<script setup lang="ts">
withDefaults(
  defineProps<{
    searchKeyword?: string
  }>(),
  {
    searchKeyword: '',
  },
)

const emits = defineEmits([
  'address:select',
  'close',
])

const dialogTrigger = defineModel('dialogTrigger', {
  type: Boolean,
  default: false,
})

const selectAddress = (address: string) => {
  emits('address:select', address)
  emits('close')
}
</script>

<template>
  <ADialog
    :dialog-trigger="dialogTrigger"
    :title="$t('user.searchAddress')"
    dialog-title-class="text-xl font-bold"
    hide-double-button
    @close-dialog="emits('close')"
  >
    <DaumPostCode
      :search-word="searchKeyword"
      @select-address="selectAddress"
    />
    <div class="mt-4">
      <p
        v-for="(text, index) in $tm('user.notSearchAddress')"
        :key="index"
        class="text-sm"
      >
        {{ $rt(text) }}
      </p>
    </div>
  </ADialog>
</template>

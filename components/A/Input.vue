<script setup lang="ts">
withDefaults(
  defineProps<{
    inputColor?: string
    inputPlaceholder?: string
    clearable?: boolean
    useTrailing?: boolean
    leadingIconName?: string
    iconSize?: number
  }>(),
  {
    inputColor: 'amber',
    inputPlaceholder: '',
    clearable: false,
    useTrailing: false,
    leadingIconName: '',
    iconSize: 24,
  },
)

const inputData = defineModel('inputData', {
  type: String,
  default: '',
})
</script>

<template>
  <DGInput
    v-model="inputData"
    :color="inputColor"
    :placeholder="inputPlaceholder"
    :ui="clearable ? { icon: { trailing: { pointer: '' } } } : {}"
  >
    <template
      v-if="leadingIconName"
      #leading
    >
      <Icon
        :name="leadingIconName"
        :size="`${iconSize}`"
      />
    </template>
    <template
      v-if="clearable || useTrailing"
      #trailing
    >
      <slot name="trailing-slot" />
      <AButton
        v-if="clearable"
        v-show="inputData"
        button-variant="ghost"
        :button-padding="false"
        use-leading
        icon-name="line-md:menu-to-close-alt-transition"
        @click="() => inputData = ''"
      />
    </template>
  </DGInput>
</template>

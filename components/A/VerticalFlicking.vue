<script setup lang="ts">
import Flicking from '@egjs/vue3-flicking'
import { AutoPlay } from '@egjs/flicking-plugins'
import '@egjs/vue3-flicking/dist/flicking.css'

withDefaults(
  defineProps<{
    verticalData: SerializeObject
    flickingClass?: string
  }>(),
  {
    flickingClass: '',
  },
)

defineEmits([
  'click:flicking',
])

const plugin = [
  new AutoPlay({
    animationDuration: 2000,
    direction: 'NEXT',
    stopOnHover: true,
  }),
]

const option = {
  inputType: ['touch', 'mouse'],
  circular: true,
  horizontal: false,
  deceleration: 0.004,
}
</script>

<template>
  <Flicking
    :class="flickingClass"
    :plugins="plugin"
    :options="option"
  >
    <div
      v-for="item, index in verticalData"
      :key="index + 1"
    >
      <p
        class="px-2 py-4 truncate cursor-pointer"
        @click="$emit('click:flicking', item.id)"
      >
        {{ $t('board.community.noticeTag', { text: item.title }) }}
      </p>
    </div>
  </Flicking>
</template>

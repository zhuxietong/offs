<template>
  <view class="f-group">
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
import { provide, reactive, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    direction?: 'h' | 'v'
    float?: 'right' | 'left'
    showRequiredMark?: boolean
    padding?: string
    labelWidth?: string
    labelStyle?: any
  }>(),
  {
    direction: 'h',
    float: 'right',
    labelWidth: uni.upx2px(140) + 'px',
    labelStyle:{},
  },
)

// @ts-ignore
const group = reactive<FormGroupKeys>({
  cellDirection: props.direction,
  padding: props.padding,
  labelWidth: props.labelWidth,
})

const labelStyle = reactive(props.labelStyle)

provide('group', group)
provide('groupLabelStyle', labelStyle)

if (props.showRequiredMark !== undefined) {
  const showRequiredMark = ref(props.showRequiredMark)
  provide('showRequiredMark', showRequiredMark)
}
</script>

<style lang="scss">
.f-group {
  border-radius: 7pt;
  background-color: white;
  padding: 0 28upx;
  overflow: visible;
  margin-bottom: 32upx;
}
</style>

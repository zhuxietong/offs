<template>
  <view class="me-scale">
    <view :style="{ marginTop: marginTop }" ref="dummy" class="me-scale-dummy"></view>
    <view class="me-scale-content">
      <slot></slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{ scale?: string | number }>(), { scale: 1 })
let scaleValue = ref<number>(parseFloat(`${props.scale}`) || 1)

const marginTop = ref(`${scaleValue.value * 100}%`)
watch(
  () => props.scale,
  (val: string | number) => {
    let value = parseFloat(`${props.scale}`) || 1
    marginTop.value = `${value * 100}%`
  },
)
</script>

<style>
.me-scale {
  width: 100%;
  position: relative;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.me-scale-dummy {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.me-scale-content {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  /*right:0;*/
  /*bottom: 0;*/
  width: 100%;
  height: 100%;
}
</style>

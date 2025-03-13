<template>
  <me-animation
    ref="back"
    v-model="isShow"
    type="fade"
    :init-style="{ position: 'fixed', top: '0px', left: '0px', bottom: '0px', right: '0px', zIndex: 999 }"
    @touchmove.stop.prevent="moveHandle"
  >
    <view
      @click="backTouch"
      style="width: 100%; height: 100%; background-color: rgba(10, 10, 10, 0.45)"
      @touchmove.stop.prevent="moveHandle"
    ></view>
  </me-animation>
  <template v-if="mode === 'sheet'">
    <me-animation
      ref="content"
      v-model="isShow"
      :timing="timing"
      type="up_fixed"
      :init-style="sheetStyle"
      @touchmove.stop.prevent="moveHandle"
    >
      <view
        style="position: absolute; top: 0; left: 0; bottom: 0; right: 0"
        @touchmove.stop.prevent="moveHandle"
      ></view>
      <view class="sheet-container" @touchmove.stop.prevent="moveHandle" @click="() => {}">
        <view style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: -1">
          <slot name="background">
            <view style="width: 100%; height: 100%; background-color: white"></view>
          </slot>
        </view>

        <slot name="default"> </slot>
        <safe-bottom></safe-bottom>
      </view>
    </me-animation>
  </template>
  <template v-else>
    <me-animation
      ref="content"
      v-model="isShow"
      :timing="timing"
      name="pop"
      :init-style="alertStyle"
      @touchmove.stop.prevent="moveHandle"
    >
      <view
        style="position: absolute; top: 0; left: 0; bottom: 0; right: 0"
        @click="backTouch"
        @touchmove.stop.prevent="moveHandle"
      ></view>
      <view class="alert-container" @touchmove.stop.prevent="moveHandle" @click="() => {}">
        <view style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: -1">
          <slot name="background">
            <view style="width: 100%; height: 100%; background-color: white"></view>
          </slot>
        </view>
        <slot name="default"> </slot>
      </view>
    </me-animation>
  </template>
</template>

<script lang="ts" setup>
import MeAnimation from './animation.vue'
import { ref, watch } from 'vue'
import SafeBottom from './safe-bottom.vue'

const emits = defineEmits(['onClosed'])
const props = withDefaults(
  defineProps<{
    mode?: 'sheet' | 'alert'
    obj?: any
    tag?: string | 'modal' | 'dialog'
    sheetStyle?: CSSStyleDeclaration | string | object
    alertStyle?: CSSStyleDeclaration | string | object
    enableBackTouchClose?: boolean
  }>(),
  {
    enableBackTouchClose: true,
    mode: 'sheet',
    tag: 'modal',
    sheetStyle: ()=>{
      return {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        position: 'fixed',
        maxHeight: '100vh',
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 1000,
        boxSizing: 'border-box',
      }
    },
    alertStyle:
      'align-items: center;position: fixed;left: 0;bottom: 0;right: 0;top:0;display: flex;flex-direction: column;justify-content:center;z-index:1000;box-sizing: border-box;',
  },
)

const isShow = ref(false)
const back = ref()
const content = ref()

const enableBgTouch = ref(props.enableBackTouchClose)
let ani_type = 'fade'
let ani_timing = 'ease-in'

switch (props.mode) {
  case 'alert':
    ani_type = 'fade'
    ani_timing = 'ease-in'
    break
  case 'sheet':
    ani_type = 'up_fix'
    ani_timing = 'ease-out'
    break
  default:
    break
}

const animationType = ref(ani_type)
const timing = ref<any>(ani_timing)

watch(
  () => props.mode,
  (val) => {
    switch (val) {
      case 'alert':
        animationType.value = 'fade'
        timing.value = 'ease-in'
        break
      case 'sheet':
        animationType.value = 'up_fix'
        timing.value = 'ease-out'
        break
      default:
        break
    }
  },
)

const appear = () => {
  // isShow.value = true
  content.value.appear()
  back.value.appear()
}
const dismiss = () => {
  // isShow.value = false
  content.value.dismiss()
  back.value.dismiss()
  setTimeout(() => {
    emits('onClosed')
  }, 250)
}
const backTouch = () => {
  if (enableBgTouch.value) {
    dismiss()
  }
}
const moveHandle = () => {}

defineExpose({
  hide: dismiss,
  show:appear,
})
</script>

<style lang="scss">
.sheet-container {
  margin: 0;
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-top-right-radius: 14px;
  border-top-left-radius: 14px;
  /*background-color: #008CA1;*/
  position: relative;
  padding: 0;
  padding-bottom: env(safe-area-inset-bottom);

}

.alert-container {
  margin: 0;
  box-sizing: border-box;
  overflow: hidden;
  width: 86%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-radius: var(--offs-radius-large);
  max-width: 420px;
  margin-top: -70tp;
  min-height: 50px;
  /*background-color: #008CA1;*/
  position: relative;
  padding: 0;
}

.add-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-color: #008ca122;
  color: var(--offs-color-primary1);
  margin: 5pt;
  padding: 19pt 10pt;
  border-radius: 3px;
  font-size: 15pt;
}

.action-button {
  font-size: 12pt;
  border-radius: 2px;
  padding: 7pt 15pt;
  color: white;
  line-height: 1;
  background-color: #00919f;
  box-sizing: border-box;
  height: auto;
}

.bottom-just {
  height: env(safe-area-inset-bottom)
}
</style>

<template>
  <me-cmp-animation
    @touchmove.stop.prevent="moveHandle"
    v-model="visible"
    ref="view"
    name="fade"
    :duration="100"
    :init-style="dialogStyle as any"
  >
    <view class="me-cmp-loading" @touchmove.stop.prevent="moveHandle" v-if="loading">
      <view style="padding: 16rpx 20rpx; font-size: 30rpx" v-if="loadingMsg">{{ loadingMsg }}</view>
      <me-cmp-indicator v-if="loading" />
    </view>
    <view class="me-cmp-error" :style="style" @touchmove.stop.prevent="moveHandle" v-if="failed">
      <view style="padding: 16rpx 20rpx; font-size: 30rpx">{{ errorMsg }}</view>
    </view>
  </me-cmp-animation>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { UI } from '../../props'

const moveHandle = () => {}
const view = ref<any>()

const props = withDefaults(
  defineProps<{
    theme?: UI.ThemeType
    initStyle?: any
    initLoading?: boolean
  }>(),
  {
    theme: 'gray',
    initStyle: {
      position: 'fixed',
      top: '0px',
      left: '0px',
      bottom: '0px',
      right: '0px',
      zIndex: '20',
    },
  },
)
const visible = ref(props.initLoading || false)

const Themes = {
  white: {
    color: '#888888',
    backgroundColor: '#ffffff',
    fontSize: '28upx',
  },
  gray: {
    color: '#999',
    backgroundColor: '#f8f8f8',
    fontSize: '28upx',
  },
  dark: {
    color: '#888888',
    backgroundColor: '#444444',
    fontSize: '28upx',
  },
}

const loading = ref(props.initLoading || false)

const style = Object.assign({}, Themes[props.theme || 'gray'], props.initStyle)

const dialogStyle = ref<CSSStyleDeclaration>(style)

const failed = ref(false)
const errorMsg = ref('')
const loadingMsg = ref('')
const show = ref(props.initLoading)

// export interface LoadingIndicator {
const start = (info?: { message: string; ext: any } | string) => {
  view.value?.appear()
  show.value = true
  loading.value = true
  loadingMsg.value = (typeof info === 'string' ? info : info?.message) || ''
}
const end = (
  success: boolean,
  message?: string | { message?: string; errMsg?: string; ext: any },
) => {
  loading.value = false
  if (success) {
    view.value?.dismiss()
    show.value = false
  } else {
    failed.value = true
    console.log('msg)', message)
    errorMsg.value =
      (typeof message === 'string' ? message : message?.message || message?.errMsg) || ''
  }
}
defineExpose({
  start,
  end,
})
onMounted(() => {
  if(props.initLoading){
    start()
  }
})
</script>

<style scoped>
.me-cmp-loading {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.me-cmp-error {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>

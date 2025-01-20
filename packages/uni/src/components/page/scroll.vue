<template>
  <view class="me-page-detail-background">
    <slot name="background"></slot>
  </view>
  <scroll-view class="me-page-scroll" scroll-y>
    <view
      id="navbar"
      v-show="showNav"
      style="position: fixed; z-index: 101; top: 0; left: 0; right: 0"
    >
      <slot name="nav-bar">
        <me-navbar
          :background="nav?.background"
          :color="nav?.color"
          :font-size="nav?.fontSize"
          :title="title"
        >
          <template #left>
            <slot name="nav-left">
              <view>
                <me-icon name="back_border"></me-icon>
              </view>
            </slot>
          </template>
        </me-navbar>
      </slot>
    </view>
    <view class="me-page-detail-content" :style="{ paddingTop: `${showNav ? navHeight : 0}px` }">
      <slot></slot>
      <view v-if="inTabContainer" style="height: 49px"></view>
      <me-cmp-safe-bottom v-if="inTabContainer" />
    </view>
    <template v-if="status === 'loading'">
      <slot name="loading">
        <view class="me-page-detail-loading">
          <me-cmp-indicator />
        </view>
      </slot>
    </template>
    <template v-if="status === 'error'">
      <slot name="error">
        <view class="me-page-detail-error">
          <view
            style="font-weight: normal; font-size: 28rpx; color: 'var(--offs-color-text2)'"
          ></view>
        </view>
      </slot>
    </template>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UI } from '../../props'

const props = withDefaults(
  defineProps<{
    nav?: Partial<UI.NavProps>
    title?: string
    showNav?: boolean
    initStatus?: 'loading' | 'error' | 'success'
    inTabContainer?: boolean
  }>(),
  {
    nav: undefined,
    title: '',
    showNav: true,
    initStatus: 'loading',
  },
)

const status = ref(props.initStatus)

const navHeight = ref(_Window.navigationBarHeight)

const ladingInstance: LoadingActive = {
  start(info?: { message: string; ext: unknown } | string) {
    status.value = 'loading'
  },
  end(success: boolean, message?: string | { message?: string; errMsg?: string; ext: any }) {
    status.value = success ? 'success' : 'error'
  },
}

defineExpose({
  ...ladingInstance,
})

// const instance = getCurrentInstance();
// const bodyStyle = reactive<Partial<CSSStyleDeclaration>>({
//   paddingTop: '0',
// });
// onMounted(() => {
//     setTimeout(()=>{
//       const query = uni.createSelectorQuery().in(instance?.proxy);
//       query
//           .select('#navbar')
//           .boundingClientRect((data) => {
//             bodyStyle.paddingTop = `${data.height}`
//             console.log('得到布局位置信息' + JSON.stringify(data));
//             console.log('节点离页面顶部的距离为' + data.top);
//           })
//           .exec();
//     },200)
// });
</script>
<style lang="scss">

page {
  background-color: var(--offs-color-fill1);
  overflow: hidden;
}
.html {
  overflow: hidden;
  height: 100vh;
}
.me-page-detail-loading {
  position: fixed;
  z-index: 10;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  background-color: var(--offs-color-fill1);
}

.me-page-detail-error {
  position: fixed;
  z-index: 10;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  background-color: var(--offs-color-fill1);
}

.me-page-scroll {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 2;
  background-color: transparent;
}

.me-page-detail-background {
  position: absolute;
  z-index: -1;
  width: 100%;
}

.me-page-detail-content {
  position: absolute;
  z-index: 2;
  width: 100%;
}
</style>

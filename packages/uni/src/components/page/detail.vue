<template>
  <view class="me-page-detail">
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
              <view @click.stop="onBack">
                <me-icon name="back_border"></me-icon>
              </view>
            </slot>
          </template>
        </me-navbar>
      </slot>
    </view>
    <view class="me-page-detail-background">
      <slot name="background">
      </slot>
    </view>
    <scroll-view scroll-y class="me-page-detail-content" :style="{ top: `${showNav ? navHeight : 0}px` }">
      <slot></slot>
      <view v-if="inTabContainer" style="height: 49px"></view>
      <me-cmp-safe-bottom v-if="inTabContainer" />
    </scroll-view>
    <template v-if="status === 'loading'">
      <slot name="loading">
        <view class="me-page-detail-loading" :style="{...backStyle}">
          <me-cmp-indicator />
        </view>
      </slot>
    </template>
    <template v-if="status === 'error'">
      <slot name="error">
        <view class="me-page-detail-error">
          <view
            style="font-weight: normal; font-size: 28rpx; color: 'var(--offs-color-dark5)'"
          ></view>
        </view>
      </slot>
    </template>
  </view>
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
    background?:string
  }>(),
  {
    nav: undefined,
    title: '',
    showNav: true,
    initStatus: 'loading',
  },
)

const onBack = ()=>{
  // @ts-ignore
  _To.back()
}

const backStyle = props.background ? {background:props.background} : {}
console.log('----olllls',backStyle
)

const status = ref(props.initStatus)

const navHeight = ref(_Window.navigationBarHeight)

const ladingInstance: LoadingActive = {
  start(_info?: { message: string; ext: unknown } | string) {
    status.value = 'loading'
  },
  end(success: boolean, _message?: string | { message?: string; errMsg?: string; ext: any }) {
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
  background-color: var(--offs-color-light1);
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
  background-color: var(--offs-color-light2);
}

.me-page-detail {
  position: relative;
  width: 100%;
  flex-grow: 1;
  overflow: visible;
}

.me-page-detail-background {
  position: fixed;
  z-index: 1;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: 100vh;
}

.me-page-detail-content {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  width: 100%;
}
</style>

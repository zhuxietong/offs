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
              <view>
                <me-icon name="back_border"></me-icon>
              </view>
            </slot>
          </template>
        </me-navbar>
      </slot>
    </view>
    <view class="me-page-detail-background">
      <slot name="background"></slot>
    </view>
    <view class="me-page-detail-content" :style="{ paddingTop: `${showNav ? navHeight : 0}px` }">
      <slot></slot>
    </view>
    <me-cmp-loading ref="loading" :init-loading="true"/>
  </view>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {UI} from '../../props'

withDefaults(
    defineProps<{
      nav?: Partial<UI.NavProps>
      title?: string
      showNav?: boolean
      notLoad?: boolean //没有加载事件
    }>(),
    {
      nav: undefined,
      title: '',
      showNav: true,
      notLoad: false,
    },
)

const navHeight = ref(_Window.navigationBarHeight)
const loading = ref<LoadingActive>()

const ladingInstance: LoadingActive = {
  start(info?: { message: string; ext: unknown } | string) {
    loading.value?.start(info)
  },
  end(success: boolean, message?: string | { message?: string; errMsg?: string; ext: any }) {
    loading.value?.end(success, message)
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
<style scoped>
.me-page-detail {
  position: relative;
  width: 100%;
  flex-grow: 1;
}
.me-page-detail-background{
  position: absolute;
  z-index: 0;
  width: 100%;
}
.me-page-detail-content{
  z-index: 2;
  width: 100%;
}
</style>

<template>
  <view
    style="
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: stretch;
    "
  >
    <view @click="toggle">
      <slot name="head" :open="isOpen"></slot>
    </view>
    <view class="ui-folder-content" :animation="animation.data" :style="folderStyle">
      <view class="fcontent">
        <slot></slot>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>


/*
 通过v-model控制开合
 */
import { ref, reactive, watch, onMounted, getCurrentInstance } from 'vue'

const props = withDefaults(defineProps<{ initOpen?: boolean }>(), { initOpen: true })
const { proxy }: any = getCurrentInstance()
const animation = reactive({
  data: {}
})

const contentHeight = ref<string | number>(0)

const isOpen = ref(props.initOpen)

const toggle = () => {
  isOpen.value = !isOpen.value
}

defineExpose({
  toggle
})

let openStyle = 'height:auto;opacity:1'
let closeStyle = 'height:0;opacity:0'

let folderStyle = ref(isOpen.value ? openStyle : closeStyle)

watch(isOpen, (val) => {
  let ani = uni.createAnimation({
    duration: 220,
    timingFunction: 'ease'
  })
  if (val) {
    ani.opacity(1).height(contentHeight.value).step()
  } else {
    ani.opacity(0).height(0).step()
  }
  animation.data = ani.export()
})
const updateBound = () => {
  const query = uni.createSelectorQuery().in(proxy)
  query
    .select('.fcontent')
    .boundingClientRect((data: any) => {
      contentHeight.value = data.height | 0
      let openValue = isOpen.value
      if (openValue) {
        folderStyle.value = `height:${data.height}px;opacity:1;`
      }
    })
    .exec()
}

onMounted(() => {
  updateBound()
})
</script>

<style lang="scss">
.ui-folder-content {
  overflow-y: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.ui-folder-close {
  height: 0;
}

.ui-folder-open {
  height: auto;
}
</style>

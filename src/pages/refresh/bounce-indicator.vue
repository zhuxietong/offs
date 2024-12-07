<template>
  <view style="height: 80rpx;display: flex;flex-direction: row;align-items: center;justify-content: center">
    <view class="sk-bounce">
      <view
        class="sk-bounce-dot"
        :class="{ 'animation-active': isActive }"
        :style="{
        backgroundColor: color,
        transform: `scale(${dotScale})`,
      }"
      ></view>
      <view
        class="sk-bounce-dot"
        :class="{ 'animation-active': isActive }"
        :style="{
        backgroundColor: color,
        transform: `scale(${dotScale})`,
      }"
      ></view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
// 'default': '哎呀，用点力继续下拉！',
//   'release-to-refresh': '拉疼我啦，松手刷新~~',
//   'loading': '正在努力刷新中...',
//   'complete': '刷新成功啦~'

const props = withDefaults(
  defineProps<{
    status: 'default' | 'release-to-refresh' | 'loading' | 'complete' | 'go-f2'
    color?: string
    value?: number // 控制动画的值 0-1
  }>(),
  {
    value: 0,
  },
)

const color = ref(props.color || '#cccccc')

// 计算是否激活动画
const isActive = ref(false)

watch(
  () => props.status,
  (newVal) => {
    if (newVal === 'loading') {
      isActive.value = true
    } else {
      isActive.value = false
    }
  },
)
// 计算点的缩放大小
const dotScale = computed(() => {
  switch (props.status) {
    case 'default':
      return 0.7
    case 'release-to-refresh':
      return 0.89
    case 'loading':
      return 0.9
    case 'complete':
      return 0.7
    case 'go-f2':
      return 0.7
  }
  // 将 0-1 的值映射为 0.4-1 的缩放范围
  // return 0.4 + props.value * 0.6
})
</script>

<style lang="scss">
$--sk-size: 40px;
$--sk-color: #333;

.sk-bounce {
  width: 26px;
  height: 26px;
  position: relative;
}

.sk-bounce-dot {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #cccccc;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.3s ease;
}

.sk-bounce-dot.animation-active {
  animation: sk-bounce 2s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
}

.sk-bounce-dot:nth-child(2).animation-active {
  animation-delay: -1s;
}

@keyframes sk-bounce {
  0%,
  100% {
    transform: scale(0);
  }
  45%,
  55% {
    transform: scale(1);
  }
}
</style>

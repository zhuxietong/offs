<template>
  <view :id="elId" class="v-tabs">
    <scroll-view
      id="scrollContainer"
      :scroll-x="scroll"
      :scroll-left="scroll ? scrollLeft : 0"
      :scroll-with-animation="scroll"
      :style="{ position: fixed ? 'fixed' : 'relative', zIndex: 1993, width: '100%' }"
    >
      <view class="v-tabs__container" :style="containerStyle_">
        <view
          :class="['v-tabs__container-item', { disabled: !!v.disabled }]"
          v-for="(v, i) in tabs"
          :key="i"
          :style="itemStyle_(i)"
          @click="change(i)"
        >
          {{ field ? v[field] : v }}
        </view>
        <view
          v-if="isPills"
          :class="['v-tabs__container-pills', { animation: lineStyle?.animation && isMounted }]"
          :style="pillStyle_"
        ></view>
        <view
          v-else
          :class="['v-tabs__container-line', { animation: lineStyle?.animation && isMounted }]"
          :style="lineStyle_"
        ></view>
      </view>
    </scroll-view>
    <view class="v-tabs__placeholder" :style="holderStyle_"></view>
  </view>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onMounted, ref, watch } from 'vue'

export interface TabStyle {
  background?: string
  color?: string
  height?: string
  padding?: string
}

export interface NormalActiveStyle {
  color?: string
  fontSize?: string
  background?: string
}

export interface ItemStyle {
  padding?: string
}

export interface LineStyle {
  height?: string
  radius?: string
  color?: string
  scale?: string
  animation?: boolean
  background?: string
}

export interface PillStyle {
  height?: string
  radius?: string
  color?: string
  scale?: string
}

const tint: string = _UISetting.colors.primary
const fontColor: string = _UISetting.colors.front_normal
const props: any = withDefaults(
  defineProps<{
    modelValue?: number
    tabs: any[]
    scroll?: boolean
    fixed?: boolean
    tabStyle?: TabStyle
    normalStyle?: NormalActiveStyle
    activeStyle?: NormalActiveStyle
    itemStyle?: ItemStyle
    lineStyle?: LineStyle
    pillStyle?: PillStyle
    field?: string
    bold?: boolean
    pills?: boolean
    gap?: number
  }>(),
  {
    scroll: true,
    bold: true,
    pills: false,
    gap: 10,
    tabStyle: {
      height: uni.upx2px(100) + 'px',
      background: '#ffffff',
    },
    normalStyle: {
      fontSize: uni.upx2px(24) + 'px',
    },
    activeStyle: {
      fontSize: uni.upx2px(28) + 'px',
    },
    lineStyle: {
      height: uni.upx2px(4) + 'px',
      animation: true,
    },
    pillStyle: {
      radius: uni.upx2px(8) + 'px',
    },
    itemStyle: {
      padding: `${uni.upx2px(8)}px ${uni.upx2px(22)}px`,
    },
  } as any,
)
let emit = defineEmits(['update:modelValue', 'change'])

const elId = ref('')
const lineWidth = ref(30)
const currentWidth = ref(0)
const lineLeft = ref(0)
const pillsLeft = ref(0)
const scrollLeft = ref(0)
const containerWidth = ref(0)
const current = ref(props.modelValue || 0)
const isMounted = ref(false)

watch(
  () => props.modelValue,
  (val) => {
    if (val !== current.value) {
      current.value = val
    }
  },
)

const isPills = computed(() => {
  return props.pills || false
})

const containerStyle_ = computed(() => {
  let style: any = {
    display: props.scroll ? 'inline-flex' : 'flex',
    gap: '20rpx',
    whiteSpace: props.scroll ? 'nowrap' : 'normal',
    background: props.tabStyle?.background || '#ffffff00',
  }
  if (props.tabStyle.height) {
    style.height = props.tabStyle.height
  }
  if (props.tabStyle?.padding) {
    style.padding = props.tabStyle.padding
  }
  return style
})
// const fontSize = uni.upx2px(28) + 'px'

const itemStyle_ = (i: number) => {
  const isSelect = value.value == i
  console.log('isSelect', isSelect ? props.activeStyle.fontSize : props.normalStyle.fontSize)
  let style: any = {
    fontSize: isSelect ? props.activeStyle.fontSize : props.normalStyle.fontSize,
    fontWeight: props.bold && value.value == i ? 'bold' : '',
    justifyContent: props.scroll ? 'center' : 'center',
    flex: props.scroll ? '' : 1,
    textAlign: 'center',
    padding: props.itemStyle?.padding || `${uni.upx2px(8)}px ${uni.upx2px(24)}px`,
  }
  if (isPills.value) {
    style.color = (isSelect ? props.activeStyle?.color : props.normalStyle.color) || fontColor
  } else {
    style.color = isSelect ? props.activeStyle?.color || tint : fontColor
  }
  return style
}
const lineStyle_ = computed(() => {
  let style: any = {
    background: props.lineStyle?.color || tint,
    width: lineWidth.value + 'px',
    height: props.lineStyle?.height,
    borderRadius: props.lineStyle?.radius,
    left: lineLeft.value + 'px',
    transform: `translateX(-${lineWidth.value / 2}px)`,
  }
  return style
})

const pillStyle_ = computed(() => {
  let index = value.value
  let gapOffX = props.gap * index
  let style: any = {
    background: props.pillStyle?.color || tint,
    borderRadius: props.pillStyle?.radius || uni.upx2px(10) + 'px',
    left: pillsLeft.value + gapOffX + 'px',
    width: currentWidth.value + 'px',
    // height: props.tabStyle?.height
  }

  return style
})

const holderStyle_ = computed(() => {
  let style: any = {
    height: props.fixed ? props.tabStyle.height : '0',
    padding: props.tabStyle.padding || '0',
  }
  return style
})

const lineScale_ = () => {
  return (props.lineStyle || { scale: 0.5 }).scale || 0.5
}
const change = (index: number) => {
  const isDisabled = props.tabs[index].disabled
  if (value.value !== index && !isDisabled) {
    value.value = index
    emit('change', index)
  }
}
const reset = (index: number) => {
  value.value = index
  emit('change', index)
}

// @ts-ignore
const { proxy: ws } = getCurrentInstance()
// 获取左移动位置
const getTabItemWidth = () => {
  let query = uni
    .createSelectorQuery()
    // #ifndef MP-ALIPAY
    .in(ws)
  // #endif
  // 获取容器的宽度
  query
    .select(`#scrollContainer`)
    .boundingClientRect((data: any) => {
      if (!containerWidth.value && data) {
        containerWidth.value = data.width
      }
    })
    .exec()
  // #ifdef APP-PLUS
  query = uni
    .createSelectorQuery()
    // #ifndef MP-ALIPAY
    .in(ws)
  // #endif
  // #endif
  // 获取所有的 tab-item 的宽度
  query
    .selectAll('.v-tabs__container-item')
    .boundingClientRect((data: any) => {
      if (!data) {
        return
      }
      let lineLeft_ = 0
      let currentWidth_ = 0

      if (data) {
        for (let i = 0; i < data.length; i++) {
          if (i < value.value) {
            lineLeft_ += data[i].width
          } else if (i == value.value) {
            currentWidth_ = data[i].width
          } else {
            break
          }
        }
      }

      // 当前滑块的宽度
      currentWidth.value = currentWidth_
      // 缩放后的滑块宽度
      lineWidth.value = currentWidth_ * lineScale_() * 1
      // 滑块作移动的位置
      lineLeft.value = lineLeft_ + currentWidth_ / 2
      // 胶囊距离左侧的位置
      pillsLeft.value = lineLeft_
      // 计算滚动的距离左侧的位置
      if (props.scroll) {
        scrollLeft.value = lineLeft.value - containerWidth.value / 2
      }
    })
    .exec()
}
const randomString = (len: number | undefined) => {
  len = len || 32
  let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  let maxPos = $chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

const value = computed<number>({
  get() {
    return current.value
  },
  set(value: number) {
    current.value = value
    emit('update:modelValue', value)
    getTabItemWidth()
  },
})
watch(
  () => props.tabs,
  () => [
    nextTick(() => {
      getTabItemWidth()
    }),
  ],
)
watch(
  () => props.modelValue,
  (val: any) => [
    nextTick(() => {
      getTabItemWidth()
    }),
  ],
)

onMounted(() => {
  elId.value = 'xfjpeter_' + randomString(undefined)
  nextTick(() => {
    getTabItemWidth()
  })
  setTimeout(() => {
    isMounted.value = true
  }, 1500)
})

defineExpose({
  change,
  reset,
})
</script>

<style lang="scss" scoped>
.v-tabs {
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;

  ::-webkit-scrollbar {
    display: none;
  }

  &__container {
    min-width: 100%;
    position: relative;
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    box-sizing: border-box;

    &-item {
      display: flex;
      align-items: center;
      height: 100%;
      position: relative;
      z-index: 10;
      // padding: 0 11px;
      transition: all 0.3s;
      white-space: nowrap;
      box-sizing: border-box;

      text-align: center;

      &.disabled {
        opacity: 0.5;
        color: #999;
      }
    }

    &-line {
      position: absolute;
      bottom: 0;
    }

    &-pills {
      position: absolute;
      box-sizing: border-box;
      z-index: 9;
    }

    &-line,
    &-pills {
      box-sizing: border-box;
      height: 100%;

      &.animation {
        transition: all 0.3s linear;
      }
    }
  }
}
</style>

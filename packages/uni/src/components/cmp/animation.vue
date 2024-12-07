<template>
  <view :style="styleDisplay as any" :animation="animation">
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
import { watch, ref, onMounted } from 'vue'
import { CssUntil } from '../../utils/css'

type AnimationName = 'fade' | 'up' | 'up_fixed' | 'drop' | 'drop_fixed' | 'left' | 'pop'

enum Animations {
  fade = 'fade',
  up = 'up',
  up_fixed = 'up_fixed',
  drop = 'drop',
  drop_fixed = 'drop_fixed',
  left = 'left',
  pop = 'pop',
}

type Timing = 'linear' | 'ease' | 'ease-in' | 'ease-in-out' | 'ease-out' | 'step-start' | 'step-end'

// interface Props {
// 	show?: boolean,
// 	name?: AnimationName,
// 	timing?: Timing,
// 	display?: string,
// 	duration?: number,
// 	initStyle?: string
// }

const props = withDefaults(
  defineProps<{
    name?: AnimationName
    timing?: Timing
    duration?: number
    zIndex?: number
    modelValue?: boolean
    initStyle?: CSSStyleDeclaration | string | { [key: string]: any }
  }>(),
  {
    modelValue: false,
    name: 'fade',
    timing: 'ease',
    zIndex: 100,
    duration: 280,
  },
)
const isShow = ref(props.modelValue || false)

const initStyle: CSSStyleDeclaration =
  typeof props.initStyle === 'string'
    ? CssUntil.stringToCss(<string>props.initStyle)
    : <CSSStyleDeclaration>props.initStyle

const styleDisplay = ref<CSSStyleDeclaration>(<CSSStyleDeclaration>{})
const zIndex = initStyle.zIndex || props.zIndex || 1
const animation = ref({})

const updateStyle = () => {
  switch (props.name) {
    case Animations.fade:
      if (isShow.value) {
        styleDisplay.value = Object.assign({ opacity: 1 }, initStyle)
      } else {
        styleDisplay.value = Object.assign(
          {
            opacity: 0,
            width: 0,
            height: 0,
            overflow: 'hidden',
          },
          initStyle,
        )
      }
      break
    case Animations.up:
      if (isShow.value) {
        styleDisplay.value = Object.assign({}, initStyle, { transform: 'translateY(0)' })
      } else {
        styleDisplay.value = Object.assign({}, initStyle, { transform: 'translateY(100%)' })
      }
      break
    case Animations.up_fixed:
      if (isShow.value) {
        styleDisplay.value = Object.assign({}, initStyle, { bottom: '0' })
      } else {
        styleDisplay.value = Object.assign({}, initStyle, { bottom: '-100vh' })
      }
      break
    case Animations.drop:
      if (isShow.value) {
        styleDisplay.value = Object.assign({}, initStyle, { transform: 'translateY(0)' })
      } else {
        styleDisplay.value = Object.assign({}, initStyle, { transform: 'translateY(-100%)' })
      }
      break
    case Animations.drop_fixed:
      if (isShow.value) {
        styleDisplay.value = Object.assign({}, initStyle, { top: '0' })
      } else {
        styleDisplay.value = Object.assign({}, initStyle, { top: '-100vh' })
      }
      break
    case Animations.left:
      if (isShow.value) {
        styleDisplay.value = Object.assign({}, initStyle, { transform: 'translateX(0)' })
      } else {
        styleDisplay.value = Object.assign({}, initStyle, { transform: 'translateX(-100%)' })
      }
      break
    case Animations.pop:
      if (isShow.value) {
        styleDisplay.value = Object.assign({}, initStyle, { opacity: '1', zIndex: props.zIndex })
      } else {
        styleDisplay.value = Object.assign({}, initStyle, { opacity: '0', zIndex: -1000 })
      }
      break
  }
}
updateStyle()
// watch(() => props.initStyle, (e) => {
//   updateStyle()
// })
const emit = defineEmits(['update:modelValue'])

const isInit = ref(false)

const mp_style = ref('')

watch(styleDisplay, (val) => {
  mp_style.value = CssUntil.cssToString(<CSSStyleDeclaration>val)
})

watch(
  () => props.modelValue,
  (val) => {
    isShow.value = val
  },
)
watch(isShow, (val, oldValue) => {
  const show = val || false
  if (show !== oldValue) {
    emit('update:modelValue', val)
    updateAnimation()
  }
})

const toggle = () => {
  isShow.value = !isShow.value
}

const updateAnimation = () => {
  const isOpen: boolean = isShow.value
  const tp = props.name
  const timing = props.timing
  const duration = props.duration

  switch (tp) {
    case Animations.fade:
      if (isOpen) {
        const ani = uni.createAnimation({
          duration: duration,
          timingFunction: timing,
        })
        styleDisplay.value = Object.assign({}, initStyle, { opacity: 0 })
        mp_style.value = CssUntil.cssToString(<CSSStyleDeclaration>styleDisplay.value)
        ani.opacity(1).step()
        animation.value = ani.export()
        setTimeout(() => {
          styleDisplay.value = Object.assign({}, initStyle, { opacity: '1' })
          mp_style.value = CssUntil.cssToString(<CSSStyleDeclaration>styleDisplay.value)
        }, duration)
      } else {
        const ani = uni.createAnimation({
          duration: duration,
          timingFunction: timing,
        })
        styleDisplay.value = Object.assign({}, initStyle, { opacity: '1' })
        mp_style.value = CssUntil.cssToString(<CSSStyleDeclaration>styleDisplay.value)

        ani.opacity(0).step()
        animation.value = ani.export()
        setTimeout(() => {
          styleDisplay.value = Object.assign({}, initStyle, {
            opacity: '0',
            width: '0',
            height: '0',
            overflow: 'hidden',
          })
          mp_style.value = CssUntil.cssToString(<CSSStyleDeclaration>styleDisplay.value)
        }, duration)
      }
      break
    case Animations.up:
      if (isOpen) {
        const ani = uni.createAnimation({
          duration: duration,
          timingFunction: timing,
          transformOrigin: '0 100% 0',
        })
        ani.translateY(0).step()
        animation.value = ani.export()
      } else {
        const ani = uni.createAnimation({
          duration: duration,
          timingFunction: timing,
          transformOrigin: '0 0 0',
        })
        // @ts-ignore
        ani.translateY('100%').step()
        animation.value = ani.export()
      }
      break
    case Animations.up_fixed:
      if (isOpen) {
        const ani = uni.createAnimation({
          duration: duration,
          timingFunction: timing,
          // transformOrigin:"0 100% 0"
        })
        ani.bottom(0).step()
        animation.value = ani.export()
      } else {
        const ani = uni.createAnimation({
          duration: duration,
          timingFunction: timing,
          // transformOrigin:"0 0 0"
        })
        // @ts-ignore
        ani.bottom('-100vh').step()
        animation.value = ani.export()
      }
      break
    case Animations.drop:
      if (isOpen) {
        const ani = uni.createAnimation({
          duration: duration,
          timingFunction: timing,
          transformOrigin: '0 -100% 0',
        })
        ani.translateY(0).step()
        animation.value = ani.export()
      } else {
        const ani = uni.createAnimation({
          duration: duration,
          timingFunction: timing,
          transformOrigin: '0 0 0',
        })
        // @ts-ignore
        ani.translateY('-100%').step()
        animation.value = ani.export()
      }

      break
    case Animations.drop_fixed:
      if (isOpen) {
        const ani = uni.createAnimation({
          duration: duration,
          timingFunction: timing,
          // transformOrigin:"0 -100% 0"
        })
        ani.top(0).step()
        animation.value = ani.export()
      } else {
        const ani = uni.createAnimation({
          duration: duration,
          timingFunction: timing,
          // transformOrigin:"0 0 0"
        })
        // @ts-ignore
        ani.top('-100vh').step()
        animation.value = ani.export()
      }
      break
    case Animations.left:
      if (isOpen) {
        const ani = uni.createAnimation({
          duration: duration,
          timingFunction: timing,
          transformOrigin: '-100% 0 0',
        })
        ani.translateX(0).step()
        animation.value = ani.export()
      } else {
        const ani = uni.createAnimation({
          duration: duration,
          timingFunction: timing,
          transformOrigin: '0 0 0',
        })
        // @ts-ignore
        ani.translateX('-100%').step()
        animation.value = ani.export()
      }
      break
    case Animations.pop:
      if (isOpen) {
        styleDisplay.value = Object.assign({}, initStyle, { opacity: '0', zIndex: zIndex })

        const ani = uni.createAnimation({
          duration: duration,
          timingFunction: timing,
        })
        ani.opacity(0.1).scale(0.93, 0.93).step({ duration: 25 })
        ani.opacity(0.3).scale(1.04, 1.04).step({ duration: 125 })
        ani.opacity(1).scale(1, 1).step({ duration: 100 })
        animation.value = ani.export()
      } else {
        styleDisplay.value = Object.assign({}, initStyle, { opacity: '1', zIndex: zIndex })

        const ani = uni.createAnimation({
          duration: duration,
          timingFunction: timing,
        })
        // ani.opacity(1).scale(1, 1).step({duration: 100})
        // ani.opacity(0.3).scale(1.02, 1.02).step({duration: 125})
        ani.opacity(0).scale(0.91, 0.91).step({ duration: duration })

        setTimeout(() => {
          styleDisplay.value = Object.assign({}, initStyle, { opacity: '0', zIndex: -1000 })
        }, duration)
        animation.value = ani.export()
      }
      break
  }
  isInit.value = true
}
const appear = () => {
  isShow.value = true
}
const dismiss = () => {
  isShow.value = false
}

defineExpose({
  toggle,
  dismiss,
  appear,
})

onMounted(() => {})
</script>

<style></style>

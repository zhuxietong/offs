<template>
  <view
    :class="{ 'me-section-group': true, 'me-section-shadow': showShadow }"
    :style="{ ...groupStyle, borderRadius: radius, padding: inset }"
  >
    <slot></slot>
  </view>
</template>
<script lang="ts" setup>
import { computed, CSSProperties, provide,withDefaults,defineProps } from 'vue'

interface RowStyle {
  padding?: string
}

interface ContentStyle {
  color?: string
  fontSize?: string
  float?: 'left' | 'right'
}

interface SectionGroupProps {
    labelStyle?: Partial<CSSProperties>
    showShadow?: boolean
    radius?: 'none' | 'default' | number
    rowStyle?: RowStyle
    contentStyle?: ContentStyle
    groupStyle?: Partial<CSSProperties>
    inset?: string
  }
const props = withDefaults(
  defineProps<SectionGroupProps>(),
  {
    labelStyle: ()=><Partial<CSSProperties>>{
      color: '#262626',
      width: uni.upx2px(180) + 'px',
    },
    radius: 'default',
    groupStyle: ()=><Partial<CSSProperties>>{},
    rowStyle: ()=><RowStyle>{},
  },
)

const radius = computed(() => {
  switch (props.radius) {
    case 'default':
      return _offsStyle.radius.mid
    case 'none':
      return 0
    default:
      return uni.upx2px(<number>props.radius) + 'px'
  }
})

const groupRowStyle = props.rowStyle || {}
const groupLabelStyle = props.labelStyle || {}
const groupContentStyle = props.contentStyle || {}

provide('groupRowStyle', groupRowStyle)
provide('groupLabelStyle', groupLabelStyle)
provide('groupContentStyle', groupContentStyle)
</script>

<style lang="scss">
.me-section-group {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  box-sizing: border-box;
  background-color: white;
}

.me-section-shadow {
  box-shadow:
    4pt 4pt 4pt #aaa1,
    4pt -4pt 4pt #aaa1,
    -4pt 4pt 4pt #aaa1,
    -4pt -4pt 4pt #aaa1;
}
</style>

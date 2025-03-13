<template>
  <view v-if="vertical" @click="clickRouter" class="me-section-row me-section-v" :style="trueRowStyle">
    <view style="display: flex; flex-direction: row; align-items: center">
      <slot name="icon"></slot>
      <slot name="label">
        <view class="me-section-label" :style="trueLabelStyle">{{ label }}</view>
      </slot>
      <view v-if="indicator" style="padding-left: 20rpx">
        <me-icon name="next" style="font-size: 24upx; color: #aaaaaa"></me-icon>
      </view>
    </view>
    <view class="me-section-content" :style="trueContentStyle">
      <slot></slot>
    </view>
  </view>
  <view v-else @click="clickRouter" class="me-section-row" :style="trueRowStyle">
    <slot name="icon"></slot>
    <slot name="label">
      <view class="me-section-label" :style="trueLabelStyle">{{ label }}</view>
    </slot>
    <view class="me-section-content" :style="trueContentStyle">
      <slot></slot>
    </view>
    <view v-if="indicator" style="padding-left: 20rpx">
      <me-icon name="next" style="font-size: 24upx; color: #aaaaaa"></me-icon>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';

const emit = defineEmits(['change', 'click']);


interface LabelStyle {
  color?: string;
  width?: string;
  fontSize?: string;
  fontWeight?: string;
}

interface RowStyle {
  padding?: string;
}

interface ContentStyle {
  color?: string;
  fontSize?: string;
  float?: 'left' | 'right';
}

const props = withDefaults(
  defineProps<{
    label:string
    indicator?: boolean
    float?: 'left' | 'right'
    labelStyle?: LabelStyle
    contentStyle?: ContentStyle
    rowStyle?: RowStyle
    // @ts-ignore
    router?: PathRoute | NameRoute | _RouteName
    vertical?: boolean
  }>(),
  { indicator: false, vertical: false },
);

let groupRowStyle = inject('groupRowStyle', {});
let groupLabelStyle = inject('groupLabelStyle', {});
let groupContentStyle = inject('groupContentStyle', {});

const clickRouter = (e) => {

  if (props.router) {
  }
  try {
    emit('click', e);
  } catch (e) {

  }
};

const trueLabelStyle = computed(() => {
  let myStyle: object = props.labelStyle || {};
  let groupStyle: object = groupLabelStyle;
  let sty:any = Object.assign(
    {
      color: _offsStyle.color.dark1,
      fontSize: uni.upx2px(30) + 'px',
      width: uni.upx2px(180) + 'px',
    },
    groupStyle,
    myStyle,
  );
  if (props.vertical) {
    try {
      delete sty?.width;
    } catch (e) {
    }
  }
  return sty;
});

const trueRowStyle = computed(() => {
  let myStyle: any = props.rowStyle || {};
  let groupStyle: any = groupRowStyle || {};
  return Object.assign(
    {
      flexDirection: props.vertical ? 'column' : 'row',
      alignItems: props.vertical ? 'stretch' : 'center',
      color: _offsStyle.color.dark2,
      fontSize: uni.upx2px(28) + 'px',
    },
    groupStyle,
    myStyle,
  );
});

const trueContentStyle = computed(() => {
  let myStyle: any = props.contentStyle || {};
  let groupStyle: any = groupContentStyle || {};

  let obj = Object.assign(
    {
      color: _offsStyle.color.dark2,
      fontSize: uni.upx2px(28) + 'px',
    },
    groupStyle,
    myStyle,
  );
  let float = props.float || obj.float || 'left';
  delete obj['float'];
  if (float === 'right') {
    obj.justifyContent = 'flex-end';
  } else {
    obj.justifyContent = 'flex-start';
  }
  return obj;
});
</script>

<style lang="scss">
.one-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.me-section-v {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
}

.me-section-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: nowrap;
  align-items: center;
  padding: 20rpx 0;
  position: revert;
}

.me-section-label {
  font-size: 28rpx;
  padding-right: 20rpx;
  flex-grow: 0;
  flex-shrink: 0;
  @extend .one-line;
}

.me-section-content {
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
}

/*  #ifndef  MP-WEIXIN  */

.me-section-row {
  position: relative;

  &:after {
    content: '';
    position: absolute;
    width: 100%;
    bottom: -0.5pt;
    left: 0;
    right: 0;
    height: 0.5pt;
    background-color: #d9d9d9;
    transform: scaleY(0.5);
  }
}

.me-section-row:last-child {
  &:after {
    display: none;
  }
}

/* #endif */

/*  #ifdef  MP-WEIXIN  */

me-section-row > .me-section-row {
  position: relative;

  &:after {
    content: '';
    position: absolute;
    width: 100%;
    bottom: -0.5pt;
    left: 0;
    right: 0;
    height: 0.5pt;
    background-color: #d9d9d9;
    transform: scaleY(0.5);
  }
}

me-section-row:last-child {
  .me-section-row {
    &:after {
      display: none;
    }
  }
}

/*  #endif  */
</style>

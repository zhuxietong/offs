<template>
  <view class="form-item-root"
        style="position: relative">
    <view
      :class="{
        'form-item': true,
        'no-line': noLine,
        'v-item': labelPosition === 'top',
        'h-item': labelPosition === 'left',
      }"
      :style="itemStyle"
    >
      <view class="item-label" v-if="label">
        <view class="item-label-content">
          <view class="item-label-text" :style="labelStyle">{{ label }}</view>
          <view style="justify-content: center; display: flex; align-items: center" v-if="showMark">
            <span style="color: #9c2715; margin-top: 6upx; margin-left: 6upx">*</span>
          </view>
        </view>
        <view class="item-label-tag" v-if="tag">{{ tag }}</view>
      </view>
      <view v-if="labelPosition === 'top'" style="height: 20rpx"></view>
      <view :class="['form-item-content']" style="display: flex;flex-direction: column;align-items: stretch">
        <slot></slot>
      </view>
      <slot name="indicator">
        <me-icon
          v-if="indicator"
          style="color: #cccccc; font-size: 12pt; transform: scale(0.8); margin-left: 8pt"
          name="next"
        ></me-icon>
      </slot>
    </view>
    <view class="form-tip" :class="{ absolute_tip: !lasted, relative_tip: lasted }" v-if="showTip">
      <view class="tip-line"></view>
      <view style="transform: scale(0.9)">
        <view class="tip-text">{{ statusMsg }}</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, withDefaults, defineProps, CSSProperties } from 'vue'
import { useFormItem } from './useFormItem'
import type { MeForm } from './type'

const props = withDefaults(defineProps<MeForm.ItemProps>(), {
  labelPosition: 'left',
  itemStyle: () => ({}) as CSSProperties,
  labelStyle: () => ({}) as CSSProperties,
  valueStyle: () => ({}) as CSSProperties,
  indicator: false,
})

const { labelStyle, label, statusMsg, status, required } = useFormItem(props)

const showMark = computed(() => required.value && props.showRequiredMark)
const showTip = computed(
  () => statusMsg.value !== '' && (status.value === 'error' || status.value === 'empty'),
)
</script>

<style lang="scss">
.form-item-root {
  position: relative;
}

.absolute_tip {
  position: absolute;
  height: 25px;
  bottom: -25px;
  right: 0;
  left: 0;
}

.relative_tip {
  position: relative;
  height: 25px;
  width: 100%;
}

.tip-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 1rpx;
  transform: scaleY(0.5);
  background-color: #ff2a4a !important;
}

.form-tip {
  > view {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    padding-top: 2upx;

    > .tip-text {
      height: 44upx;
      font-size: 24upx;
      font-weight: 400;
      color: rgba(255, 41, 73, 1);
    }
  }
}

/*  #ifndef  MP-WEIXIN  */

.form-item-root {
  > .form-item {
    position: relative;

    &:after {
      content: '';
      position: absolute;
      width: 100%;
      bottom: -0.5pt;
      left: 0;
      right: 0;
      height: 0.5pt;
      background-color: #c0c0c0;
      transform: scaleY(0.5);
    }
  }

  > .no-line {
    position: relative;

    &:after {
      content: '';
      position: absolute;
      width: 100%;
      bottom: -0.5pt;
      left: 0;
      right: 0;
      height: 0.5pt;
      background-color: transparent;
      transform: scaleY(0.5);
    }
  }
}

.form-item-root:last-child {
  > .form-item {
    position: relative;

    &:after {
      display: none;
      //content: "XXXX";
      //position: absolute;
      //width: 100%;
      //bottom: -0.5pt;
      //left: 0;
      //right: 0;
      //height: 30px;
      //background-color: transparent;
      //transform: scaleY(0.5);
    }
  }
}

f-item {
  .form-item-root {
    .form-item {
      position: relative;
    }

    .no-line::after {
      background-color: transparent !important;
      transform: scaleY(0.5);
    }

    .form-item::after {
      content: '';
      position: absolute;
      width: 100%;
      bottom: -0.5pt;
      left: 0;
      right: 0;
      height: 0.5pt;
      background-color: #c0c0c0;
      transform: scaleY(0.5);
    }
  }
}

f-item:last-child {
  .form-item-root {
    .form-item {
      position: relative;
    }

    //.form-item::after{
    //	content: "";
    //	position: absolute;
    //	width: 100%;
    //	bottom: -1px;
    //	left: 0;
    //	right: 0;
    //	height: 1px;
    //	background-color: transparent;
    //	transform: scaleY(0.5);
    //}
  }
}

/*  #endif  */

/* #ifdef H5 */
/* #endif */
/* #ifndef H5 */
/* #endif */

.v-item {
  flex-direction: column;
  align-items: stretch;
}

.h-item {
  flex-direction: row;
  align-items: center;
}

.form-item {
  display: flex;
  position: relative;
  flex-grow: 1;
  flex-shrink: 1;
  padding: 16rpx 0;
  //padding-bottom: 14rpx;

  /* #ifdef  MP-WEIXIN */
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #e1e1e1;
    transform: scaleY(0.5);
  }

  &.no-line:after {
    content: '';
    position: absolute;
    width: 100%;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background-color: transparent;
    transform: scaleY(0.5);
  }

  /* #endif */

  > .item-label {
    flex-grow: 0;
    flex-shrink: 0;
    width: 180upx;
    height: 64upx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-right: 16rpx;

    > .item-label-content {
      flex-grow: 0;
      flex-shrink: 0;
      width: 160upx;
      height: 64upx;
      font-size: 26upx;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: rgba(32, 43, 67, 1);
      margin-right: 20upx;
      line-height: 25rpx;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-items: stretch;

      > view:nth-child(2) {
        //position: relative;
        width: 10px;
        height: 100%;

        > view {
          //position: absolute;
          //top: 0;
          //left: 0;
          //bottom: 0;
          //right: 0;
          line-height: 100%;
          font-size: 24upx;
          font-weight: 400;
          color: rgba(255, 26, 60, 1);
          padding-left: 5px;
          margin-top: -2px;
        }
      }
    }
  }

  > .form-item-content {
    flex-grow: 1;
    flex-shrink: 1;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    //display: flex;
    //flex-direction: row;
    //align-items: center;
    //justify-content: flex-start;
    //&.left{
    //  justify-content: flex-start;
    //  >view,uni-view{
    //    flex-grow: 1;
    //  }
    //}
    //&.center{
    //  justify-content: center;
    //}
    //&.right{
    //  justify-content: flex-end;
    //}
  }
}

.form-item:last-child {
  //:after {
  //   position: static;
  //    background-color: transparent;
  //}
}

f-item:last-child {
  border-bottom-color: transparent;
}
</style>

<template>
  <view class="form-cell-root" style="position: relative;">
    <view :class="{'form-cell':true,'no-line':noLine,'v-cell':direction === 'v','h-cell':direction === 'h'}"
          :style="{padding:padding}">
      <view class="cell-label" v-if="cell.label" :style="{width:fieldLabelWidth}">
        <view class="cell-label-content" :style="{width:fieldLabelWidth}">
          <view class="cell-label-text" :style="thisLabelStyle">{{ cell.label }}</view>
          <view style="justify-content: center;display: flex;align-items: center" v-if="showMark">
            <span style="color: #9c2715;margin-top: 6upx;margin-left: 6upx">*</span></view>
        </view>
        <view class="cell-label-tag" v-if="tag">{{ tag }}</view>
      </view>
      <view v-if="direction === 'v'" style="height: 20rpx"></view>
      <view :class="['form-cell-content']">
        <slot></slot>
      </view>
      <slot name="indicator">
        <me-icon v-if="cell.indicator" style="color: #cccccc;font-size: 12pt;transform: scale(0.8);margin-left: 8pt"
                 name="next"></me-icon>
      </slot>
    </view>
    <view class="form-tip" :class="{absolute_tip:!lasted,relative_tip:lasted}" v-if="showTip">
      <view class="tip-line"></view>
      <view style="transform: scale(0.9)">
        <view class="tip-text">{{ cell.tip }}</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>

import {computed, inject, provide, reactive, ref, watch} from "vue";
import {CheckResult} from "./Field";

const props = withDefaults(defineProps<{
  labelWidth?: any,
  tag?: string,
  lasted?: boolean,
  labelStyle?: any
  direction?: 'h' | 'v',// label和字段组建的排列方式，h为横向布局，v为纵向布局
  showRequiredMark?: boolean,
  indicator?: boolean
  float?: 'left' | 'right' | 'center'//字段内容贴靠位置
  padding?: string
  noLine?: boolean
}>(), {
  tag: '',
  noLine: false,
  lasted: false,
  showRequiredMark: undefined,
  indicator: false,
  labelStyle: <CSSStyleDeclaration>{}
})

let group = inject<FormGroupKeys>('group', {})
const direction = ref(props.direction || group.cellDirection || 'h')
const showRequiredMark = inject('showRequiredMark', false)
const groupLabelStyle = inject('groupLabelStyle', {})
const formLabelStyle = inject('formLabelStyle', {})
const changeTip = inject<any>('changeTip', 'none')

const thisLabelStyle = computed(() => {
  if (props.labelStyle) {
    if (Object.keys(props.labelStyle).length > 0) {
      return props.labelStyle
    }
  }
  if (groupLabelStyle) {
    if (Object.keys(groupLabelStyle).length > 0) {
      return groupLabelStyle
    }
  }
  if (formLabelStyle) {
    return formLabelStyle
  }
  return {}
})

const fieldLabelWidth = computed(() => {
  return props.labelWidth || group.labelWidth || uni.upx2px(140) + 'px'
})

const padding = computed(() => {
  return props.padding || group.padding || `${uni.upx2px(36)}px 0`
})

const cell = reactive({
  required: true,
  label: '',
  tip: '',
  float: props.float || 'left',
  indicator: props.indicator || false// eg:/static/icon/indicator  |  {src:string}
})

provide('cell', cell)

const showMark = computed(() => {
  if (!cell.required) {
    return false
  }
  if (props.showRequiredMark == undefined) {
    // @ts-ignore
    return showRequiredMark.value
  } else {
    return props.showRequiredMark
    // if(showRequiredMark.value){
    // 	return true
    // }
  }

  return false

})
const tip = ref<CheckResult | undefined>(undefined)
const showTip = ref(false)
watch(tip, (val) => {
  console.log("---ss---iiii-vv", changeTip.value)

  // @ts-ignore
  if (changeTip.value === 'none') {
    return
  }
  if (val) {
    console.log("---ss---iiii-vv", val)

    if (!val.ok) {
      cell.tip = val.message
      showTip.value = true
    } else {
      cell.tip = ''
      showTip.value = false
    }
  } else {
    cell.tip = ''
    showTip.value = false
  }

})
provide('tip', tip)


</script>

<style lang="scss">

.form-cell-root {
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
  background-color: #FF2A4A !important;
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
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(255, 41, 73, 1);
    }
  }
}

/*  #ifndef  MP-WEIXIN  */

.form-cell-root {

  > .form-cell {
    position: relative;

    &:after {
      content: "";
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
      content: "";
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

.form-cell-root:last-child {
  > .form-cell {
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


f-cell {
  .form-cell-root {
    .form-cell {
      position: relative;
    }

    .no-line::after {
      background-color: transparent !important;
      transform: scaleY(0.5);
    }


    .form-cell::after {
      content: "";
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

f-cell:last-child {
  .form-cell-root {
    .form-cell {
      position: relative;
    }

    //.form-cell::after{
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


.v-cell {
  flex-direction: column;
  align-items: stretch;
}

.h-cell {
  flex-direction: row;
  align-items: center;
}

.form-cell {
  display: flex;
  position: relative;
  flex-grow: 1;
  flex-shrink: 1;
  padding: 16rpx 0;
  //padding-bottom: 14rpx;

  /* #ifdef  MP-WEIXIN */
  &:after {
    content: "";
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
    content: "";
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


  > .cell-label {
    flex-grow: 0;
    flex-shrink: 0;
    width: 180upx;
    height: 64upx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-right: 16rpx;


    > .cell-label-content {
      flex-grow: 0;
      flex-shrink: 0;
      width: 160upx;
      height: 64upx;
      font-size: 26upx;
      font-family: PingFangSC-Regular, PingFang SC;
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


  > .form-cell-content {
    flex-grow: 1;
    flex-shrink: 1;
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

.form-cell:last-child {
  //:after {
  //   position: static;
  //    background-color: transparent;
  //}
}

f-cell:last-child {
  border-bottom-color: transparent;
}
</style>

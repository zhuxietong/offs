<template>
  <view class="ui-nav-root">
    <view class="ui-nav">
      <view class="nav-backGround">
        <slot name="background">
          <view
              :style="{
              width: '100%',
              height: '100%',
              background: background,
            }"
          ></view>
        </slot>
      </view>
      <view class="ui-nav-body" :style="{ color: '#ffffff' }">
        <view class="ui-status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
        <view class="ui-nav-content" :style="{ height: navContentHeight + 'px', color: color }">
          <view class="nav-left-items">
            <slot name="left">
              <view @click.stop="back">
                <me-icon name="back_border"></me-icon>
              </view>
            </slot>
          </view>
          <slot name="title">
            <view class="nav-title">
              <view :style="{ fontSize: fontSize }">{{ title }}</view>
            </view>
          </slot>
          <view class="nav-right-items">
            <slot name="right"></slot>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';

const props = withDefaults(defineProps<{
  color?: string;
  background?: string;
  fontSize?: number | string;
  title?: string;
}>(), {});

const color = computed(() => {
  return props.color || _UISetting.navProps?.color;
});

const background = computed(() => {
  return props.background || _UISetting?.navProps?.background;
});

const fontSize = computed(() => {
  return props.fontSize || _UISetting.navProps.fontSize;
});

// let titleWidth = ref<number>(_Window.width - 2 * _Window.menuButtonRect.width - 20)
// const navBarHeight = ref<number>(_Window.navigationContentHeight + _Window.navigationBarHeight)
const statusBarHeight = ref<number>(_Window.statusBarHeight);
const navContentHeight = ref<number>(_Window.navigationContentHeight);

const back = () => {
  _To.back(1);
};
</script>

<style lang="scss">
.ui-nav-root {
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.ui-nav-content {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.ui-nav {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  z-index: 98;
}

.nav-backGround {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.ui-nav-body {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.nav-title {
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-weight: bolder;
  font-size: 30rpx;
}

.nav-left-items {
  position: absolute;
  left: 30upx;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
}

.nav-right-items {
  position: absolute;
  right: 30upx;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: right;
}

.ui-navbar {
  width: 100vw;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  flex-wrap: nowrap;
  z-index: 100;
}

.ui-navbar-items {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.ui-navbar-center {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.ui-navbar-left {
  margin-left: 15px;
  font-size: 30rpx;
  z-index: 2;
}

.ui-navbar-title {
  float: top;
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>

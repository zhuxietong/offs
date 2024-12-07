<template>
  <div
    class="juhua-loading"
    :class="{
      'juhua-loading-white': theme === 'white',
      'juhua-loading-gray': theme === 'gray',
      'juhua-loading-dark': theme === 'dark',
    }"
  >
    <div class="jh-circle1 jh-circle-ios"></div>
    <div class="jh-circle2 jh-circle-ios"></div>
    <div class="jh-circle3 jh-circle-ios"></div>
    <div class="jh-circle4 jh-circle-ios"></div>
    <div class="jh-circle5 jh-circle-ios"></div>
    <div class="jh-circle6 jh-circle-ios"></div>
    <div class="jh-circle7 jh-circle-ios"></div>
    <div class="jh-circle8 jh-circle-ios"></div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

type IndicatorTheme = 'white' | 'gray' | 'dark';

const props = withDefaults(defineProps<{ theme?: IndicatorTheme }>(), { theme: 'gray' });

const theme = ref<IndicatorTheme>(props.theme);
</script>

<style lang="scss">
.juhua-loading-white {
  > .jh-circle-ios::before {
    background-color: #ffffffaa;
  }
}

.juhua-loading-gray {
  > .jh-circle-ios::before {
    background-color: #888888aa;
  }
}

.juhua-loading-dark {
  > .jh-circle-ios::before {
    background-color: #333333;
  }
}

.juhua-loading {
  position: relative;
  margin: 0 auto;
  width: 44upx;
  height: 44upx;
}

.juhua-loading .jh-circle-ios {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.juhua-loading .jh-circle-ios:before {
  content: '';
  display: block;
  margin: 5% auto;
  width: 12.5%;
  height: 28%;
  border-radius: 4upx;
  -webkit-animation: jh-circleFadeDelay-ios 1.05s infinite ease-in-out both;
  animation: jh-circleFadeDelay-ios 1.05s infinite ease-in-out both;
}

.juhua-loading .jh-circle1 {
  -webkit-transform: rotate(0deg);
  -ms-transform: rotate(0deg);
  transform: rotate(0deg);
}

.juhua-loading .jh-circle2 {
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

.juhua-loading .jh-circle3 {
  -webkit-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  transform: rotate(90deg);
}

.juhua-loading .jh-circle4 {
  -webkit-transform: rotate(135deg);
  -ms-transform: rotate(135deg);
  transform: rotate(135deg);
}

.juhua-loading .jh-circle5 {
  -webkit-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}

.juhua-loading .jh-circle6 {
  -webkit-transform: rotate(225deg);
  -ms-transform: rotate(225deg);
  transform: rotate(225deg);
}

.juhua-loading .jh-circle7 {
  -webkit-transform: rotate(270deg);
  -ms-transform: rotate(270deg);
  transform: rotate(270deg);
}

.juhua-loading .jh-circle8 {
  -webkit-transform: rotate(315deg);
  -ms-transform: rotate(315deg);
  transform: rotate(315deg);
}

.juhua-loading .jh-circle1:before {
  -webkit-animation-delay: -1.05s;
  animation-delay: -1.05s;
}

.juhua-loading .jh-circle2:before {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.juhua-loading .jh-circle3:before {
  -webkit-animation-delay: -0.75s;
  animation-delay: -0.75s;
}

.juhua-loading .jh-circle4:before {
  -webkit-animation-delay: -0.6s;
  animation-delay: -0.6s;
}

.juhua-loading .jh-circle5:before {
  -webkit-animation-delay: -0.45s;
  animation-delay: -0.45s;
}

.juhua-loading .jh-circle6:before {
  -webkit-animation-delay: -0.3s;
  animation-delay: -0.3s;
}

.juhua-loading .jh-circle7:before {
  -webkit-animation-delay: -0.15s;
  animation-delay: -0.15s;
}

.juhua-loading .jh-circle8:before {
  -webkit-animation-delay: -0s;
  animation-delay: -0s;
}

@-webkit-keyframes jh-circleFadeDelay-ios {
  0%,
  39%,
  100% {
    opacity: 0.3;
  }
  40% {
    opacity: 1;
  }
}

@keyframes jh-circleFadeDelay-ios {
  0%,
  39%,
  100% {
    opacity: 0.3;
  }
  40% {
    opacity: 1;
  }
}
</style>

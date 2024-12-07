<template>
  <me-page-detail
    ref="detail"
    title="你好"
    :showNav="true"
    :nav="{
      background: '#f1f1f1',
    }"
  >
    <view class="content">
      <view class="top-bk">
        <image
          src="/static/home-bk.png"
          style="width: 100%; height: 120vw; background: linear-gradient(#69dbb4, #f7f8fa)"
        />
      </view>
      <view :style="{ paddingTop: navigationBarHeight + 'px', zIndex: 2 }">
        <view
          style="
            padding: 24rpx;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          "
        >
          <view style="color: #061522; font-size: 36rpx; padding: 4px 12px">智慧居家</view>
          <me-tab
            pills
            :pill-style="{
              radius: '30px',
              height: '60px',
            }"
            :tab-style="{ background: 'transparent' }"
            :fixed="false"
            :tabs="tabs"
          >
          </me-tab>
          <view style="background-color: white; border-radius: 10px; height: 300px"></view>
          <view>

          </view>
        </view>
      </view>
    </view>
  </me-page-detail>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { ref } from 'vue'
import { Fetch, useFetch, useNavigation } from '@offs/uni'

const { navigationBarHeight } = useNavigation()
const detail = ref<LoadingActive>()

// const time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
// const title = ref('pages')
const { data } = useFetch('/data', {
  method: 'GET',
  dialog: detail,
})

const tabs = ref(['今日', '一周', '当月'])
// const tabIndex = ref(0)
</script>

<style lang="scss" scoped>
.top-bk {
  height: 300px;
  width: 100%;
  position: absolute;
  z-index: 1;
}

page {
  background-color: #f7f8fa;
  //background: linear-gradient(#69DBB4, #F7F8FA);
}

.content {
  position: relative;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>

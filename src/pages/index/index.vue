<template>
  <view>
    <button @click="showModal">show</button>
  </view>
  <time-select v-model="time">
    <template #default="{ value }">
      <view style="color: var(--offs-color-dark4); font-size: 26rpx">{{ value }}</view>
    </template>
  </time-select>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { onMounted, ref } from 'vue'
import { Fetch, useFetch, useNavigation } from '@offs/uni'
import TimeSelect from '@/components/time-select.vue'

const { navigationBarHeight } = useNavigation()
const detail = ref<LoadingActive>()

const time = ref(dayjs().format('YYYY年MM月'))
// const time = ref('')


const modal = ref<any>()
// const time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
// const title = ref('pages')
const { data } = useFetch('/data', {
  method: 'GET',
  dialog: detail,
})

onMounted(() => {})
const toRefresh = () => {
  _To.push('pages_refresh_index')
}

const showModal = () => {
  console.log('------------ss', modal.value)
  modal.value.show()
}
const hideModal = () => {
  modal.value.hide()
}

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

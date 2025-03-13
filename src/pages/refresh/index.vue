<template>
  <button>TO</button>
  <me-page-refresh ref="paging" v-model="dataList" :get="queryList">
    <view class="item" v-for="(item, index) in dataList" :key="index">
      <view class="item-title">{{ item.id }}</view>
      <view class="item-detail">{{ item.name }}</view>
      <view class="item-line"></view>
    </view>
  </me-page-refresh>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Fetch } from '@offs/uni'

const paging = ref(null)
const item = ref<any>({})

const tabIndex = ref(0)
const tabList = ref(['测试1', '测试2', '测试3', '测试4'])
// v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
const dataList = ref([])

const to = () => {
  // _To.push({name:'index'})
}

watch(dataList, (value) => {})

// @query所绑定的方法不要自己调用！！需要刷新列表数据时，只需要调用paging.value.reload()即可
const queryList = (param: any) => {
  return _api('list').then((e: any) => {
    return e.data.list
  })
  // return Fetch<any[]>('/list',{
  //   extract:(e)=>e.data.list,
  // })
}
const pros = {
  query: queryList,
}
</script>

<style>
.item {
  position: relative;
  height: 150rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0rpx 30rpx;
}

.item-detail {
  padding: 5rpx 15rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
  color: white;
  background-color: #007aff;
}

.item-line {
  position: absolute;
  bottom: 0rpx;
  left: 0rpx;
  height: 1px;
  width: 100%;
  background-color: #eeeeee;
}
</style>

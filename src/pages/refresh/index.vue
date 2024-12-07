<!-- 自定义下拉刷新与上拉加载演示(vue) -->
<template>
  <refresh ref="paging" v-model="dataList" @query="queryList">
    <view class="item" v-for="(item,index) in dataList" :key="index">
      <view class="item-title">{{item.title}}</view>
      <view class="item-detail">{{item.detail}}</view>
      <view class="item-line"></view>
    </view>
  </refresh>
</template>

<script setup>
import { ref,watch } from 'vue';
import request from './req.js';
import Refresh from '@/pages/refresh/refresh.vue'


const paging = ref(null);

const tabIndex = ref(0);
const tabList = ref(['测试1','测试2','测试3','测试4']);
// v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
const dataList = ref([]);


const tabsChange = (index) => {
  tabIndex.value = index;
  // 当切换tab或搜索时请调用组件的reload方法，请勿直接调用：queryList方法！！
  paging.value.reload();
}

watch(dataList,(value)=>{
  console.log('---dataList',value)
})

// @query所绑定的方法不要自己调用！！需要刷新列表数据时，只需要调用paging.value.reload()即可
const queryList = (pageNo, pageSize) => {
  // 组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
  // 这里的pageNo和pageSize会自动计算好，直接传给服务器即可
  // 模拟请求服务器获取分页数据，请替换成自己的网络请求
  const params = {
    pageNo: pageNo,
    pageSize: pageSize,
    type: tabIndex.value + 1
  }
  request.queryList(params).then(res => {
    // 将请求的结果数组传递给z-paging
    paging.value.complete(res.data.list);
  }).catch(res => {
    // 如果请求失败写paging.value.complete(false);
    // 注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
    // 在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
    paging.value.complete(false);
  })
}
const pros = {
  query:queryList,
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
  background-color: #007AFF;
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

<template>
  <view>
    <button @click="showModal">show</button>
  </view>
  <time-select v-model="time">
    <template #default="{ value }">
      <view style="color: var(--offs-color-dark4); font-size: 26rpx">{{ value }}</view>
    </template>
  </time-select>
  <me-fm-form ref="form">
    <me-fm-item :checker="[{min:4,message:'至少 4 个字符串'},{max:10,message:'最多10个字符'}]">
      <me-fm-text-input name="name" label="名称" v-model="formData.name"></me-fm-text-input>
    </me-fm-item>
    <me-fm-item :checker="/\w{2,}/">
      <me-fm-text-input name="job" label="职位" v-model="formData.job"></me-fm-text-input>
    </me-fm-item>
    <me-fm-item>
      <me-fm-text-area name="desc" label="描述" v-model="formData.desc"></me-fm-text-area>
    </me-fm-item>
  </me-fm-form>
  <view style="padding: 40rpx">
    <view class="offs-btn primary" @click="onSubmit">submit</view>
  </view>

</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { onMounted, reactive, ref } from 'vue'
import { Fetch, useFetch, useNavigation } from '@offs/uni'
import TimeSelect from '@/components/time-select.vue'

const form = ref()


const formData = reactive<{
  name?:string,
  desc?:string
  job?:string
}>({
  name:'zhuxietong',
  desc:'i im a developer',
  job:'developer'
})

const { navigationBarHeight } = useNavigation()
const detail = ref<LoadingActive>()

const onSubmit = ()=>{
  form.value.valid().then((r:any)=>{
    console.log("-OK---KKKS",r)
  }).catch((e:any)=>{
    console.log("-Err--kkwe",e)
  })
}

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

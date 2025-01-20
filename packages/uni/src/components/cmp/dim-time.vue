<template>
  <view style="display: inline-flex" v-if="modelValue" @click.stop="show">
    <slot :value="modelValue">
      <view style="font-weight: bold;display: flex;flex-direction: row;align-items: center;margin-left: 16rpx;background-color: var(--offs-color-primary1);border-radius: 8rpx;color: #FFFFFF; font-size: 24rpx;padding: 6rpx 8rpx 6rpx 12rpx">
        {{ modelValue }}
        <me-icon name="next" style="font-size: 24rpx;margin-top: 4rpx;margin-left: 10rpx;transform: scale(0.8)"/>
      </view>
    </slot>
  </view>
  <view
    v-else
    @click.stop="show"
    style="display: inline-flex; font-size: 26rpx; color: var(--offs-color-dark4)"
    >选择时间
  </view>
  <me-cmp-modal ref="modal" mode="alert" @before-show="onModalShow">
    <view>
      <view
        style="
          font-weight: bold;
          margin-top: 30rpx;
          margin-bottom: 20rpx;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          color: var(--offs-color-dark2);
        "
      >
        {{ title || '时间选择' }}
      </view>

      <view
        style="
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          padding: 20rpx;
        "
      >
        <me-tab
          :tabs="dimensions"
          center
          style="width: 340rpx; margin-left: 26rpx"
          :tab-style="{ background: 'transparent' }"
          :pill-style="{ radius: '16rpx', height: '80rpx', color: '#ffffff', padding: '0 10rpx' }"
          :active-style="{
            background: 'var(--offs-color-primary1)',
            fontSize: '28rpx',
            color: '#ffffff',
          }"
          :normal-style="{ background: 'transparent', fontSize: '28rpx', color: '#363636' }"
          field="label"
          v-model="dimIndex"
          pills
        ></me-tab>
      </view>
      <!-- 时间选择区 -->
      <view style="padding: 40rpx">
        <picker-view
          :value="pickerSelectedIndices"
          style="width: 100%; height: 160px"
          @change="onPickerChange"
        >
          <!-- 年份选择列 -->
          <picker-view-column v-if="showYear">
            <view class="picker-item" v-for="(year, index) in yearRange" :key="index">
              {{ year }}年
            </view>
          </picker-view-column>

          <!-- 月份选择列 -->
          <picker-view-column v-if="showMonth">
            <view class="picker-item" v-for="month in 12" :key="month"> {{ month }}月</view>
          </picker-view-column>

          <!-- 日期选择列 -->
          <picker-view-column v-if="showDay">
            <view class="picker-item" v-for="day in daysInMonth" :key="day"> {{ day }}日</view>
          </picker-view-column>
        </picker-view>
      </view>
      <view
        style="
          margin-bottom: 30rpx;
          margin-top: 20rpx;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 40rpx;
        "
      >
        <view class="offs-btn normal" @click="close">关闭</view>
        <view class="offs-btn primary" @click="confirm">确定</view>
      </view>
    </view>
  </me-cmp-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const emits = defineEmits(['update:modelValue'])
const props = defineProps<{
  title?: string
  modelValue: string // YYYY年 ｜ YYYY年MM月 ｜ YYYY年MM月DD日
}>()

// 定义维度选项
interface DimensionOption {
  label: string
  value: string
}

const dimensions: DimensionOption[] = [
  { label: '年度', value: 'year' },
  { label: '月度', value: 'month' },
  { label: '按天', value: 'day' },
]

// 当前选中的维度索引
const dimIndex = ref(0)

// 当前选中的维度值
let currentDimension = ref(dimensions[dimIndex.value].value)

watch(dimIndex, (val) => {
  currentDimension.value = dimensions[val].value
})

// 创建固定长度的 selectedIndices���始终存储年份、月份和日期的选择
const selectedIndices = ref<number[]>([0, 0, 0])

// 保存初始状态
let initialDimIndex = ref(dimIndex.value)
let initialSelectedIndices = ref([...selectedIndices.value])
let initialDimension = ref(currentDimension.value)

// 在 modal 显示时，保存当前的状态
const onModalShow = () => {
  // 保存初始维度索引和选中索引的副本
  initialDimIndex.value = dimIndex.value
  initialSelectedIndices.value = [...selectedIndices.value]
  initialDimension.value = currentDimension.value
}

// 根据当前维度，计算 picker-view 应该展示的 indices
const pickerSelectedIndices = computed(() => {
  const indices: any[] = []
  if (showYear.value) {
    indices.push(selectedIndices.value[0])
  }
  if (showMonth.value) {
    indices.push(selectedIndices.value[1])
  }
  if (showDay.value) {
    indices.push(selectedIndices.value[2])
  }
  return indices
})

// 监听 picker-view 的 change 事件，更新 selectedIndices 中对应的值
const onPickerChange = (e) => {
  const val = e.detail.value
  let index = 0
  if (showYear.value) {
    selectedIndices.value[0] = val[index] || 0
    index++
  }
  if (showMonth.value) {
    selectedIndices.value[1] = val[index] || 0
    index++
  }
  if (showDay.value) {
    selectedIndices.value[2] = val[index] || 0
    index++
  }
}

const modal = ref()

// 是否显示年份选择
const showYear = computed(() => ['year', 'month', 'day'].includes(currentDimension.value))

// 是否显示月份选择
const showMonth = computed(() => ['month', 'day'].includes(currentDimension.value))

// 是否显示日期选择
const showDay = computed(() => currentDimension.value === 'day')

// 年份范围（前5年到当前年）
const yearRange = computed(() => {
  const currentYear = new Date().getFullYear()
  const years: number[] = []
  const startYear = currentYear - 5
  for (let i = startYear; i <= currentYear; i++) {
    years.push(i)
  }
  return years
})

// 计算当月天数
const daysInMonth = computed(() => {
  const yearIndex = selectedIndices.value[0] || 0
  const monthIndex = selectedIndices.value[1] || 0
  const year = yearRange.value[yearIndex] || new Date().getFullYear()
  const month = monthIndex + 1
  return new Date(year, month, 0).getDate()
})

const show = () => {
  modal.value?.show()
}

const close = () => {
  // 先关闭弹窗
  modal.value?.hide()

  // 恢复维度选择
  dimIndex.value = initialDimIndex.value
  currentDimension.value = dimensions[initialDimIndex.value].value

  // 恢复选中的年月日
  selectedIndices.value = [...initialSelectedIndices.value]

  // 如果有 modelValue，则根据 modelValue 重新设置状态
  if (props.modelValue) {
    const yearMatch = props.modelValue.match(/(\d{4})年/)
    const monthMatch = props.modelValue.match(/(\d{1,2})月/)
    const dayMatch = props.modelValue.match(/(\d{1,2})日/)

    // 确定当前维度
    if (dayMatch) {
      currentDimension.value = 'day'
      dimIndex.value = dimensions.findIndex((dim) => dim.value === 'day')
    } else if (monthMatch) {
      currentDimension.value = 'month'
      dimIndex.value = dimensions.findIndex((dim) => dim.value === 'month')
    } else if (yearMatch) {
      currentDimension.value = 'year'
      dimIndex.value = dimensions.findIndex((dim) => dim.value === 'year')
    }

    // 解析数值
    const year = parseInt(yearMatch ? yearMatch[1] : '') || new Date().getFullYear()
    const month = parseInt(monthMatch ? monthMatch[1] : '') || 1
    const day = parseInt(dayMatch ? dayMatch[1] : '') || 1

    // 获取索引
    const yearIndex = yearRange.value.indexOf(year)
    const monthIndex = month - 1
    const dayIndex = day - 1

    // 更新 selectedIndices
    if (yearIndex !== -1) selectedIndices.value[0] = yearIndex
    if (monthIndex >= 0) selectedIndices.value[1] = monthIndex
    if (dayIndex >= 0) selectedIndices.value[2] = dayIndex
  }
}

const confirm = () => {
  const selectedYearIndex = selectedIndices.value[0] || 0
  const selectedMonthIndex = selectedIndices.value[1] || 0
  const selectedDayIndex = selectedIndices.value[2] || 0

  const selectedYear = yearRange.value[selectedYearIndex] || new Date().getFullYear()
  const selectedMonth = selectedMonthIndex + 1
  const selectedDay = selectedDayIndex + 1

  let result = ''
  if (currentDimension.value === 'year') {
    result = `${selectedYear}年`
  } else if (currentDimension.value === 'month') {
    result = `${selectedYear}年${String(selectedMonth).padStart(2, '0')}月`
  } else if (currentDimension.value === 'day') {
    result = `${selectedYear}年${String(selectedMonth).padStart(2, '0')}月${String(selectedDay).padStart(2, '0')}日`
  }
  emits('update:modelValue', result)
  modal.value.hide()
}

// 当 props.modelValue 改变时，更新 selectedIndices 和 currentDimension
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) return
    const yearMatch = newVal.match(/(\d{4})年/)
    const monthMatch = newVal.match(/(\d{1,2})月/)
    const dayMatch = newVal.match(/(\d{1,2})日/)

    // 确定当前维度
    if (dayMatch) {
      currentDimension.value = 'day'
      dimIndex.value = dimensions.findIndex((dim) => dim.value === 'day')
    } else if (monthMatch) {
      currentDimension.value = 'month'
      dimIndex.value = dimensions.findIndex((dim) => dim.value === 'month')
    } else if (yearMatch) {
      currentDimension.value = 'year'
      dimIndex.value = dimensions.findIndex((dim) => dim.value === 'year')
    }

    // 解析数值
    const year = parseInt(yearMatch ? yearMatch[1] : '') || new Date().getFullYear()
    const month = parseInt(monthMatch ? monthMatch[1] : '') || 1
    const day = parseInt(dayMatch ? dayMatch[1] : '') || 1

    // 获取索引
    const yearIndex = yearRange.value.indexOf(year)
    const monthIndex = month - 1
    const dayIndex = day - 1

    // 更新 selectedIndices
    if (yearIndex !== -1) selectedIndices.value[0] = yearIndex
    if (monthIndex >= 0) selectedIndices.value[1] = monthIndex
    if (dayIndex >= 0) selectedIndices.value[2] = dayIndex
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
.picker-item {
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: bold;
}


</style>

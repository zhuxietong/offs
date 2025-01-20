<template>
  <z-paging
    v-bind="{ ...$attrs, ...props }"
    ref="paging"
    :auto-hide-loading-after-first-loaded="false"
    v-model="dataList"
    @query="doQuery"
  >
    <!-- 需要固定在顶部不滚动的view放在slot="top"的view中，如果需要跟着滚动，则不要设置slot="top" -->
    <!-- 注意！此处的z-tabs为独立的组件，可替换为第三方的tabs，若需要使用z-tabs，请在插件市场搜索z-tabs并引入，否则会报插件找不到的错误 -->
    <template #top>
      <slot name="top" />
    </template>
    <!-- 自定义下拉刷新view(如果use-custom-refresher为true且不设置下面的slot="refresher"，此时不用获取refresherStatus，会自动使用z-paging自带的下拉刷新view) -->

    <!-- 注意注意注意！！字节跳动小程序中自定义下拉刷新不支持slot-scope，将导致custom-refresher无法显示 -->
    <!-- 如果是字节跳动小程序，请参照sticky-demo.vue中的写法，此处使用slot-scope是为了减少data中无关变量声明，降低依赖 -->
    <template #refresher="{ refresherStatus }">
      <!-- 此处的custom-refresh为demo中自定义的组件，非z-paging的内置组件，请在实际项目中自行创建。这里插入什么view，下拉刷新就显示什么view -->
      <!--        <custom-refresher :status="refresherStatus" />-->
      <slot name="refresher" :refresherStatus="refresherStatus">
        <me-cmp-bounce-indicator :status="refresherStatus" :color="refreshIndicatorColor"/>
      </slot>
    </template>
    <!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
    <slot />
    <!-- 自定义没有更多数据view -->
    <template #loadingMoreNoMore>
      <!-- 此处的custom-nomore为demo中自定义的组件，非z-paging的内置组件，请在实际项目中自行创建。这里插入什么view，没有更多数据就显示什么view -->
      <slot name="loadingMoreNoMore">
        <view
          style="
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            padding: 5pt 40pt;
          "
        >
          <view
            style="height: 0.5pt; width: 24%; background-color: #cccccc; transform: scaleY(0.5)"
          ></view>
          <view style="color: #999999; font-size: 28rpx; transform: scale(0.9)">没有更多数据</view>
          <view
            style="height: 0.5pt; width: 24%; background-color: #cccccc; transform: scaleY(0.5)"
          ></view>
        </view>
      </slot>
    </template>
    <template v-slot:loadingMoreLoading>
      <view
        style="
          width: 100%;
          padding: 16rpx;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        "
      >
        <me-cmp-indicator></me-cmp-indicator>
      </view>
      <div class="safe-bottom"></div>
    </template>
    <template #loading>
      <slot name="loading">
        <view class="refresh-default-loading">
          <me-cmp-indicator />
        </view>
      </slot>
    </template>
  </z-paging>
</template>

<script setup lang="ts">
import { ref, useAttrs,watch,computed } from 'vue';

const emit = defineEmits(['update:modelValue']);


const props = defineProps<{
  get: (param: { [k: string]: any }) => Promise<any[]>
  modelValue: any[],
  refreshIndicatorColor?:'#cccccc'
}>();

const outData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
const dataList = ref<any[]>([]);

watch(dataList, (value) => {
  outData.value = value;
  console.log('---outData', value);
}, { deep: true });


const $attrs = useAttrs();

const doQuery = async (page, size) => {
  props
    .get({ page, size })
    .then((list: any) => {
      paging.value?.complete(list);
    })
    .catch(() => {
      paging.value?.complete(false);
    });
};

defineOptions({
  inheritAttrs: false,
});

const paging = ref<any>(null);

const reload = () => {
  paging.value?.reload(false);
};

// v-model绑定的这个变量不要在分页请求结束中自己赋值！！！

defineExpose({
  reload,
  complete: (data: any) => {
    paging.value?.complete(data);
  },
});
</script>

<style>
.refresh-default-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--offs-color-light2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>

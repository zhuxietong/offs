<template>
<view style="margin-top: 20rpx;width: 100%">
  <textarea
    class="fm-text-area"
    :style="valueStyle"
    :value="value"
    :placeholder-style="placeholderStyle"
    :auto-height="autoHeight"
    :placeholder="placeholder"
    :maxlength="maxLimitNum"
    @blur="onBlur"
    @input="onChange"
  />
</view>
</template>

<script setup lang="ts">

import type { MeForm } from '../type'
import { useFormField } from '../useFormField'
import { computed } from 'vue'

const props = withDefaults(defineProps<MeForm.FieldProps & {autoHeight:boolean}>(),{
  formCheckTriggers: ()=>['focus','blur','change'] as MeForm.FormCheckTrigger[],
  autoHeight:false,
  required:true
})
const emit = defineEmits(['update:modelValue'])
const {$change,value,onBlur,valueStyle,placeholderStyle,placeholder,checkers} = useFormField(props,{emit,interaction:'input'})

const maxLimitNum = computed(()=>{
  const maxChecker:any = checkers.filter((e:any)=> typeof e === 'object' && e.max)[0]
  if(maxChecker){
    return maxChecker.max as number
  }
  return 100000000
})

const onChange = $change((value)=>{
  return value.detail.value
})

</script>

<style scoped lang="scss">

.fm-text-area{
  border: solid 1px var(--offs-color-light4);
  padding: 14rpx;
  width: 100%;
  box-sizing: border-box;
  border-radius: var(--offs-radius-small);
}

</style>

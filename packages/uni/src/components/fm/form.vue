
<template>
  <view style="padding: 20rpx">
    <slot></slot>
  </view>
</template>

<script lang="ts" setup>
import { defineProps, defineExpose, withDefaults, defineEmits, onMounted } from 'vue'
import type { MeForm } from './type'
import { useForm } from './useForm'

const props = withDefaults(defineProps<MeForm.FromProps>(), {})
const emit = defineEmits(['change'])
const { valid } = useForm(props,{emit})


onMounted(()=>{
  console.log('-ssss--form',emit)
})

defineExpose({
  valid,
})
</script>

<style lang="scss"></style>


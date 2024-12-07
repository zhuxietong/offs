<style lang="scss">
</style>

<template>
  <div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { provide, reactive, ref } from 'vue'
import { Field, FormCheck } from './Field'

const props = withDefaults(
  defineProps<{
    showRequiredMark?: boolean
    changeTip?: 'none' | 'submit' | 'change'
  }>(),
  { changeTip: 'none' },
)

const form_fields = reactive<Field[]>([])
provide('f_fields', form_fields)

const changeTip = ref(props.changeTip)
provide('changeTip', changeTip)

if (props.showRequiredMark !== undefined) {
  const showRequiredMark = ref(props.showRequiredMark)
  provide('showRequiredMark', showRequiredMark)
}

const parser = (tip: 'none' | 'toast' | 'tips') => {
  let check = new FormCheck(form_fields as any)
  return check.parser(tip)
}
const asyncParser = (tip: 'none' | 'toast' | 'tips') => {
  let check = new FormCheck(form_fields as any)
  return check.asyncParser(tip)
}

const valid = () => {
  let check = new FormCheck(form_fields as any)
  return check.valid()
}

defineExpose({
  parser,
  asyncParser,
  valid,
})
</script>

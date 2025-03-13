<template>
  <input
    v-model="value"
    @input="doInput"
    @blur="onBlur"
    :style="{...valueStyle}"
    :placeholder-style="placeholderStyle"
    :placeholder="placeholder"
  />
</template>
<script setup lang="ts">
import { useFormField } from '../useFormField'
import { MeForm } from '../type'

const emit = defineEmits(['update:modelValue'])
const props = withDefaults(defineProps<MeForm.FieldProps>(),{
  formCheckTriggers: ()=>['focus','blur','change'] as MeForm.FormCheckTrigger[],
  required: true
})

const {$change,value,onBlur,valueStyle,placeholderStyle,placeholder} = useFormField(props,{emit,interaction:'input'})

const doInput = $change((value)=>{
  return value.detail.value
})

</script>

<style scoped lang="scss"></style>

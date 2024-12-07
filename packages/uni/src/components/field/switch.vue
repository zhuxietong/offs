<template>
  <switch :checked="initBool" :color="color" style="transform: scale(0.7)" @change="changeValue" />
</template>

<script lang="ts" setup>
import { defineComponent, inject, ref, watch } from 'vue'
import { Checker, CheckTrigger, Field, Interact } from '../form/Field'
import { BoolValue } from '@offs/core'

// import {BoolValue, BoolValueType} from "../../core/Bool";
defineComponent({ name: 'me-field-switch' })

const emits = defineEmits(['update:modelValue', 'onChange'])
export type BoolValueType = '0|1' | 'true|false'

const props = withDefaults(
  defineProps<{
    modelValue: any
    holderStyle?: CSSStyleDeclaration
    valueStyle?: CSSStyleDeclaration
    check?: Checker
    name?: string
    label?: string
    color?: string
    valueType?: BoolValueType
    ext?: any
  }>(),
  {
    color: '#4c83ea',
    name: '',
    label: '',
    check: () => {
      return true
    },
    valueType: 'true|false',
  },
)
let field = new Field({
  name: props.name,
  label: props.label,
  check: props.check,
  checkTrigger: [CheckTrigger.focus, CheckTrigger.blur, CheckTrigger.change],
  interact: Interact.input,
})

const tip: any = inject('tip', {})
field.updateTip = (result) => {
  tip.value = result
}
const f_fields = inject<any>('f_fields', [])
f_fields.push(field)

field.value = props.modelValue
const value = props.modelValue

const initBool = ref<boolean>(<boolean>BoolValue.parser(value, 'true|false'))

watch(
  () => props.modelValue,
  (val) => {
    // console.log('-----DD',instance.proxy.$forceUpdate())
    console.log('000000dds-sdddd', val, <boolean>BoolValue.parser(val, 'true|false'))
    initBool.value = <boolean>BoolValue.parser(val, 'true|false')
  },
)

const cell = inject<FieldKeys>('cell', {})
cell.label = field.label
cell.required = field.required

const changeValue = (e: any) => {
  field.value = BoolValue.parser(e.detail.value, props.valueType || 'true|false')
  tip.value = field.doCheck(CheckTrigger.change)
  initBool.value = BoolValue.parser(e.detail.value, props.valueType || 'true|false')
  emits('update:modelValue', field.value)
  emits('onChange', { value: field.value, field, ext: props.ext })
}
</script>

<style lang="scss"></style>

import { CSSProperties, provide, ref, reactive, onMounted, onUnmounted } from 'vue'
import type {MeForm} from './type'
import { DisposeBag, PublishSub } from '@offs/core'

export class FormValidError extends Error {
  errors: Array<{ name: string; error: Error }>

  constructor(message: string, errors?: Array<{ name: string; error: Error }>) {
    super(message)
    this.name = 'FormValidError'
    this.errors = errors || []
  }
}

export const useForm = (props: MeForm.FromProps,option:{
  emit:any
}) => {
  const emit = option.emit
  const values = ref({})
  const formFields = reactive<MeForm.Field[]>([])
  const labelStyle = ref<CSSProperties>(props.labelStyle || {})
  const placeholderStyle = ref<CSSProperties>(props.placeholderStyle || {})
  const valueStyle = ref<CSSProperties>(props.valueStyle || {})
  const itemStyle = ref<CSSProperties>(props.itemStyle || {})
  const subscribe = new PublishSub<{name:string,value:any}>()
  provide('subscribe', subscribe)
  const bag = new DisposeBag()
  subscribe.subscribe(({name,value}) => {
    if(emit){
      emit('change', name, value)
    }
  })



  const emitChange = (name: string, value: any) => {
    subscribe.value = {name,value}
  }
  provide('emitChange', emitChange)
  provide('formLabelStyle', labelStyle)
  provide('formValueStyle', valueStyle)
  provide('formItemStyle', itemStyle)
  provide('formFields', formFields)
  provide('formItemPlaceholderStyle',placeholderStyle)



  const valid = async (option?:{ tip?: MeForm.ErrorTip }) => {
    const errors: Array<{ name: string; error: Error }> = []
    let result: { [k: string]: any } = {}
    for (const field of formFields) {
      if (!field.hidden) {
        try {
          const data = await field.mergeData(option)
          result = { ...result, ...data }
        } catch (e: any) {
          errors.push({ name: field.props.name, error: e })
        }
      }
    }
    if (errors.length > 0) {
      throw new FormValidError('表单校验失败', errors)
    }
    return result
  }

  const onChange = (name: string, value: any) => {
    values.value[name] = value
  }

  onMounted(() => {

  })

  onUnmounted(() => {
    bag.dispose()
  })

  return {
    values,
    valid,
    onChange,
  }
}

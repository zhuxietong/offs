import { computed, CSSProperties, inject, ref, type Ref } from 'vue'
import { isEmpty, LazyPromise } from '@offs/core'
import type {MeForm} from './type'
import { CssUntil } from '../../utils/css'


const runOneChecker = async (value: any, _checker: MeForm.Checker, props: MeForm.FullFieldProps) => {
  let checker: any = _checker
  if (typeof checker === 'function') {
    let r: any = checker(value)
    if (r instanceof LazyPromise) {
      try {
        r = await r
      } catch (e: any) {
        throw new Error(e.message)
      }
    }
  }

  if (typeof _checker === 'string' || _checker instanceof RegExp) {
    checker = {
      reg: checker,
    }
  }

  if (typeof checker === 'object' && !(checker instanceof RegExp)) {
    const limit:
      | { min: number; message?: string }
      | { max: number; message?: string }
      | { reg: string | RegExp; message?: string } = checker
    if ('min' in limit) {
      const min = limit.min
      if (typeof value === 'number' && value < min) {
        throw new Error(limit.message || `${props.label}最小值为${min}`)
      }
      if (typeof value === 'string' && value.length < min) {
        throw new Error(limit.message || `${props.label}不能少于${min}个字符`)
      }
      if (Array.isArray(value) && value.length < min) {
        throw new Error(limit.message || `${props.label}至少选择${min}个`)
      }
    }
    if ('max' in limit) {
      const max = limit.max
      if (typeof value === 'number' && value > max) {
        throw new Error(limit.message || `${props.label}最大值为${max}`)
      }
      if (typeof value === 'string' && value.length > max) {
        throw new Error(limit.message || `${props.label}不能多于${max}个字符`)
      }
      if (Array.isArray(value) && value.length > max) {
        throw new Error(limit.message || `${props.label}最多选择${max}个`)
      }
    }
    if ('reg' in limit) {
      const reg = limit.reg instanceof RegExp ? limit.reg : new RegExp(limit.reg)
      if (!reg.test(`${value}`)) {
        throw new Error(limit.message || `${props.label}格式不正确`)
      }
    }
  }
  return true
}

export const useFieldProps = (
  props: MeForm.FullFieldProps,
  options: {
    interaction:'select' | 'input'
    emit: any,
    checker?: MeForm.Checker | MeForm.Checker[],
  },
) => {
  const label = inject<Ref<string>>('label', ref(''))
  const required = inject<Ref<boolean>>('required', ref(false))
  const status = inject<Ref<MeForm.CheckStatus>>('status', ref('success'))
  const statusMsg = inject<Ref<string>>('statusMsg', ref(''))
  const emitChange = inject('emitChange', (_name: string, _value: any) => {})
  const formItemPlaceholderStyle = inject<Ref<CSSProperties>>('formItemPlaceholderStyle', ref<CSSProperties>({}))

  label.value = props.label || ''
  required.value = props.required || false

  const interaction = options.interaction || 'select'
  const placeholder = props.placeholder || (interaction === 'select' ? '请选择' : '请输入') + label.value
  const stateMsgError = label.value + '无效'
  const stateMsgEmpty = label.value + '不能为空'
  const itemChecker = inject('checker', [])

  const checkers: MeForm.Checker[] = (
    Array.isArray(itemChecker) ? itemChecker : [itemChecker]
  ).filter((checker) => checker !== undefined)

  const emit = options.emit

  const value = computed({
    get: () => {
      const getTransform = (v: any) => {
        if (typeof props.transform === 'function') {
          return props.transform(v)
        }
        if (props.transform === 'number') {
          if (typeof v === 'number') {
            return v
          }
          return Number(`${v}`)
        }
        if (props.transform === 'string') {
          return `${v}`
        }
        if (props.transform === 'boolean') {
          if (v === 'false') {
            return false
          }
          if (v === 'true') {
            return true
          }
          if (v === '') {
            return false
          }
          if (v === '0') {
            return false
          }
          if (v === '1') {
            return true
          }
          return Boolean(v)
        }
        return v
      }
      return getTransform(props.modelValue)
    },
    set: (v: any) => {
      emitChange(props.name, v)
      emit('update:modelValue', v)
    },
  })

  function needCheck(trigger?: MeForm.FormCheckTrigger) {
    if(trigger === 'submit'){
      return true
    }
    if(trigger === undefined) {
      return false
    }
    let validTriggers = props.formCheckTriggers ||  []
    validTriggers = [...validTriggers, 'blur']
    const uniqueTriggers = [...new Set(validTriggers)]
    return uniqueTriggers.indexOf(trigger) !== -1
  }

  async function runAllChecker(value: any, trigger?: MeForm.FormCheckTrigger) {
    if (!needCheck(trigger)) {
      return
    }
    if (options.checker) {
      if (Array.isArray(options.checker)) {
        checkers.push(...options.checker)
      } else {
        checkers.push(options.checker)
      }
    }

    for (let i = 0; i < checkers.length; i++) {
      try {
        await runOneChecker(value, checkers[i], props)
      } catch (e: any) {
        throw new Error(e.message)
      }
    }
  }


  const onBlur = async () => {
    const result = value.value
    if (isEmpty(result)  && props.required) {
      status.value = 'empty'
      statusMsg.value = stateMsgEmpty
      return undefined
    }

    runAllChecker(result, 'blur').then(() => {}).catch((e:any) => {
      status.value = 'error'
      statusMsg.value = e.message
    })
  }

  const $change = (input: MeForm.OnInput,trigger:MeForm.FormCheckTrigger = 'change') => {
    return async (val: any) => {
      let result: any = undefined
      try {
        result = input(val)
        if (result instanceof LazyPromise) {
          result = await result
        }
        value.value = result
      } catch (e: any) {
        status.value = 'error'
        statusMsg.value = e.message
        return undefined
      }
      console.log("dd----o00000",result,props.required)

      if (isEmpty(result) && props.required) {
        console.log("----o00000",result,props.required)
        status.value = 'empty'
        statusMsg.value = stateMsgEmpty
        return undefined
      }
      try {
        await runAllChecker(result, trigger)
        status.value = 'success'
        statusMsg.value = ''
      }catch (e:any) {
        status.value = 'error'
        statusMsg.value = e.message
      }
      return result
    }
  }

  const placeholderStyle = computed(() => {
    return  CssUntil.cssToString({
      ...formItemPlaceholderStyle.value,
      ...props.placeholderStyle,
    })

  })

  return {
    status,
    statusMsg,
    label,
    required,
    interaction,
    placeholder,
    placeholderStyle,
    stateMsgError,
    stateMsgEmpty,
    checkers,
    value,
    runAllChecker,
    onBlur,
    $change,
  }
}

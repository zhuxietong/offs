import { isEmpty, LazyPromise } from '@offs/core'
import { useFieldProps } from './useFieldProps'
import { computed, CSSProperties, inject, reactive, ref, Ref,Reactive } from 'vue'
import type {MeForm} from './type'

export const useFormField = (
  props: MeForm.FullFieldProps,
  _option: {
    emit:any,
    submitTransform?: (v: any) => LazyPromise<any> | any
    checker?: MeForm.Checker | MeForm.Checker[],
    interaction:'select' | 'input'
  },
) => {
  const formFields = inject<Reactive<MeForm.Field[]>>('formFields', reactive<MeForm.Field[]>([]))
  const {
    $change,
    checkers,
    value,
    placeholderStyle,
    placeholder ,
    status,
    statusMsg,
    onBlur,
    runAllChecker
  } = useFieldProps(props, {
    checker: _option?.checker,
    emit: _option?.emit,
    interaction: _option.interaction
  })

  const fromValueStyle = inject<Ref<CSSProperties>>('formValueStyle', ref<CSSProperties>({}))

  const valueStyle = computed(() => {
    return {
      ...fromValueStyle.value,
      ...props.labelStyle,
    }
  })

  const submitValue = async (tip?:MeForm.ErrorTip) => {
    if(isEmpty(value.value) && !(props.hidden) && props.required){
      if (tip === 'error-mark'){
        status.value = 'error'
        statusMsg.value = '`${props.label || props.name}不能为空`'
      }
      throw new Error(`${props.label || props.name}不能为空`)
    }

    try {
      await runAllChecker(value.value,'submit')
    }catch (e:any) {
      if (tip === 'error-mark'){
        status.value = 'error'
        statusMsg.value = `${props.label || props.name}不能为空`
      }
      throw e
    }


    const willSubmit = props?.submitTransform || _option?.submitTransform
    if (willSubmit) {
      if (typeof willSubmit === 'function') {
        const result = willSubmit(value.value)
        if (result instanceof LazyPromise) {
          return await result
        } else {
          return result
        }
      }
      if (willSubmit === 'number') {
        return Number(value.value)
      }
      if (willSubmit === 'string') {
        return `${value.value}`
      }
      if (willSubmit === 'boolean') {
        if (value.value === 'false') {
          return false
        }
        if (value.value === 'true') {
          return true
        }
        if (value.value === '') {
          return false
        }
        if (value.value === '0') {
          return false
        }
        if (value.value === '1') {
          return true
        }
        return Boolean(value.value)
      }
    }
    return value.value
  }

  const field: MeForm.Field = {
    props: props,
    get value() {
      return value.value
    },
    get hidden() {
      return props.hidden || false
    },
    mergeData: (option?:{tip?:MeForm.ErrorTip}) => {
      return new LazyPromise(async (resolve, reject) => {
        try {
          const v = await submitValue(option?.tip)
          resolve({
            [props.name]: v,
          })
        } catch (e) {
          reject(e)
        }
      })
    }
  }
  formFields.push(field)

  return {
    value,
    field,
    valueStyle,
    placeholderStyle,
    placeholder,
    checkers,
    onBlur,
    $change,
  }
}

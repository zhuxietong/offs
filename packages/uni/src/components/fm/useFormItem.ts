import { computed, inject, provide, ref } from 'vue'
import type { MeForm } from './type'

export const useFormItem = (props: MeForm.ItemProps) => {
  const status = ref<MeForm.CheckStatus>('success')
  const statusMsg = ref<string>('')
  const required = ref<boolean>(false)
  const label = ref<string>('')
  const hidden = ref<boolean>(props.hidden || false)
  const formLabelStyle = inject('formLabelStyle', ref({}))
  const formItemStyle = inject('formItemStyle', ref({}))

  const labelStyle = computed(() => {
    return {
      ...formLabelStyle.value,
      ...props.labelStyle,
    }
  })

  const itemStyle = computed(() => {
    return {
      ...formItemStyle.value,
      ...props.itemStyle,
    }
  })


  provide('label', label)
  provide('status', status)
  provide('statusMsg', statusMsg)
  provide('checker', props.checker || [])
  return {
    status,
    statusMsg,
    required,
    hidden,
    label,
    labelStyle,
    itemStyle,
  }
}

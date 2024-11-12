import { createGlobalState } from '@vueuse/core'
import { ref } from 'vue'

export const useBreadcrumbs = createGlobalState(() => {
  return ref<string[]>([])
})

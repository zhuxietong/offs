import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

// eslint-disable-next-line no-unused-vars
export const useParam = <T extends object>(callBack?: (param: Partial<T>,query:Partial<T>,json:Partial<T>) => void) => {
  const query = ref<Partial<T>>({})
  const json = ref<Partial<T>>({})
  const param = ref<Partial<T>>({})
  onLoad((op: any) => {
    let jsonObj: any = {}
    let queryObj: any = {}

    try {
      jsonObj = JSON.parse(decodeURIComponent(op.json))
      json.value = jsonObj
    } catch (e) {}
    try {
      queryObj = { ...op }
      delete queryObj.json
      query.value = queryObj
    } catch (e) {}
    param.value = { ...jsonObj, ...queryObj }
    callBack?.(param.value as any,query.value as any,json.value as any)
  })
  return {
    query,
    param,
    json,
  }
}

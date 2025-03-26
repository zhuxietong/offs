import { onLoad } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'

// eslint-disable-next-line no-unused-vars
export const useParam = <T extends object>(
  callBack?: (param: Partial<T>, query: Partial<T>, json: Partial<T>) => void,
) => {
  const query = ref<Partial<T>>({})
  const json = ref<Partial<T>>({})
  const param = ref<Partial<T>>({})

  onLoad((op?: AnyObject) => {
    let jsonObj: any = {}
    let queryObj: any = {}

    // 对op中的所有字符串值进行decodeURIComponent处理
    const decodedOp: { [k: string]: any } = {}
    for (const key in op) {
      if (typeof op[key] === 'string') {
        if (key === 'json') {
          decodedOp[key] = JSON.parse(decodeURIComponent(op[key]))
          continue
        }
        decodedOp[key] = decodeURIComponent(op[key])
      } else {
        decodedOp[key] = op[key]
      }
    }

    try {
      // 使用处理后的json字段
      if (decodedOp.json) {
        jsonObj = JSON.parse(decodedOp.json)
        json.value = jsonObj
      }
    } catch (e) {}

    try {
      queryObj = { ...decodedOp }
      delete queryObj.json
      query.value = queryObj
    } catch (e) {}

    param.value = { ...jsonObj, ...queryObj }
    callBack?.(param.value as any, query.value as any, json.value as any)
  })

  return {
    query,
    param,
    json,
  }
}

export const useMountedParam = <T extends object>(
  callBack?: (param: Partial<T>, query: Partial<T>, json: Partial<T>) => void,
) => {
  const query = ref<Partial<T>>({})
  const json = ref<Partial<T>>({})
  const param = ref<Partial<T>>({})

  onLoad((op?: AnyObject) => {
    let jsonObj: any = {}
    let queryObj: any = {}

    // 对op中的所有字符串值进行decodeURIComponent处理
    const decodedOp: { [k: string]: any } = {}
    for (const key in op) {
      if (typeof op[key] === 'string') {
        if (key === 'json') {
          decodedOp[key] = JSON.parse(decodeURIComponent(op[key]))
          continue
        }
        decodedOp[key] = decodeURIComponent(op[key])
      } else {
        decodedOp[key] = op[key]
      }
    }

    try {
      // 使用处理后的json字段
      if (decodedOp.json) {
        jsonObj = JSON.parse(decodedOp.json)
        json.value = jsonObj
      }
    } catch (e) {}

    try {
      queryObj = { ...decodedOp }
      delete queryObj.json
      query.value = queryObj
    } catch (e) {}

    param.value = { ...jsonObj, ...queryObj }
  })

  onMounted(() => {
    callBack?.(param.value as any, query.value as any, json.value as any)
  })

  return {
    query,
    param,
    json,
  }
}

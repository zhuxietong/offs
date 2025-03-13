import { ExposedPromise, getValue, offsRequestConfig } from '@offs/core'

/**
 * 运行方法代替真实请求的模拟
 */
async function simulateFetchWrap(jsonFunc: () => Promise<any> | object) {
  return {
    json: typeof jsonFunc === 'function' ? jsonFunc : () => new Promise((r) => {
      r(jsonFunc)
    }),
    ok: true,
  } as Response
}

function fetch(url: string, option: OffsUniFetchOption): Promise<any> {
  return new ExposedPromise((resolve, reject) => {
    // @ts-ignore
    uni.request({
      url,
      timeout: option.timeout,
      // @ts-ignore
      method: option.method,
      header: option.headers,
      data: option.data,
      success: (res) => {
        resolve({
          ok: res?.statusCode === 200,
          status: res.statusCode,
          json: async () => {
            return res.data
          },
        })
      },
      fail: (err) => {
        console.log('--ddd--sksk', err)
        reject(err)
      },
    })
  })
}

/**
 * 超时请求的包裹，超时后会抛出异常
 * simulateFunc 为模拟请求的方法，传入该方法时会调用模拟方法
 */
async function fetchWithTimeout(
  url: string,
  option: OffsUniFetchOption,
  timeout?: number,
  simulate?: (...args: any) => Promise<any>,
): Promise<Response> {
  if (simulate) {

    return await simulateFetchWrap(simulate)
  }
  try {
    // @ts-ignore
    return await fetch(url, { ...option, timeout })
  } catch (error) {
    // @ts-ignore
    if (error.name === 'AbortError') {
      throw new Error('timeout')
    }
    throw error
  } finally {
  }
}

/**
 * Fetch Json请求的包装
 * @param {string} url - 请求的URL, [get,@data,query]
 * @param option
 */
export function Fetch<T>(url: string, option?: OffsUniFetchOption): Promise<T> {
  const ops: OffsUniFetchOption = option || {}

  const FetchIntercept = offsRequestConfig.intercept

  if (ops.method) {
    {
      // @ts-ignore
      ops.method = option?.method || offsRequestConfig.defaultInit.method
    }
  }

  let lastOption = FetchIntercept.before(url, ops)
  if (ops.before) {
    lastOption = ops.before(url, ops)
  }

  return new Promise(async (resolve, reject) => {
    try {
      // console.log('lastOption', lastOption);
      const response = await fetchWithTimeout(
        lastOption.url,
        lastOption.init,
        ops.timeout || offsRequestConfig.timeout,
        option?.request as any
      )
      if (!response.ok) {
        reject(`HTTP error! status: ${response?.status}`)
        return
      }
      try {
        let raw = (await response.json()) as T
        if (option?.log) {
          console.log('OffsCoreFetch response json', raw, lastOption)
        }
        ops.onGetRootJson?.(raw)
        if (ops.after) {
          await ops.after(ops, raw)
        } else {
          raw = (await FetchIntercept.after(ops, raw)) as any
        }
        let data = raw

        if (ops.extract) {

          if (typeof ops.extract === 'function') {
            data = ops.extract(raw)
          } else {
            data = getValue(raw, ops.extract)
          }
        } else {
        }
        resolve(data)
      } catch (e) {
        if (option?.log) {
          console.log('OffsCoreFetch catch error', e, lastOption)
        }
        if (ops.onFailed) {
          await ops.onFailed(ops, e)
        } else {
          FetchIntercept.failed(ops, e)
        }
        reject(e)
      }
    } catch (e) {
      reject(e)
    }
  })
}

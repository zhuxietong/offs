// uniKy.ts

// 类型定义
export interface UniKyRequest {
  url: string
  method: string
  headers: Record<string, string>
  body?: any
  timeout?: number
}

export interface UniKyOptions {
  prefixUrl?: string
  timeout?: number
  headers?: Record<string, string>
  retry?: number
  method?: string
  data?: any
  searchParams?: Record<string, any> | URLSearchParams | string
  hooks?: {
    beforeRequest?: Array<
      (
        request: UniKyRequest,
        options: UniKyOptions,
      ) => UniKyRequest | void | Promise<UniKyRequest | void>
    >
    afterResponse?: Array<
      (
        response: UniKyResponse,
        request: UniKyRequest,
        options: UniKyOptions,
      ) => any | void | Promise<any | void>
    >
  }

  [key: string]: any
}

export interface UniKyResponse<T = any> {
  data: T
  statusCode: number
  header: Record<string, string>
  cookies: string[]
  ok: boolean
  redirected: boolean
  url: string
}

export interface UniKyPromise<T = any> extends Promise<T> {
  json<R = T>(): Promise<R>
}

export interface UniKyInstance {
  <T = any>(url: string, options?: UniKyOptions): UniKyPromise<T>
  get: <T = any>(url: string, options?: UniKyOptions) => UniKyPromise<T>
  post: <T = any>(url: string, options?: UniKyOptions) => UniKyPromise<T>
  put: <T = any>(url: string, options?: UniKyOptions) => UniKyPromise<T>
  delete: <T = any>(url: string, options?: UniKyOptions) => UniKyPromise<T>
  patch: <T = any>(url: string, options?: UniKyOptions) => UniKyPromise<T>
  head: <T = any>(url: string, options?: UniKyOptions) => UniKyPromise<T>
  options: <T = any>(url: string, options?: UniKyOptions) => UniKyPromise<T>
  create: (defaultOptions: UniKyOptions) => UniKyInstance
  extend: (options: UniKyOptions) => UniKyInstance
}

// 创建一个基础类实现所有方法
class UniKyBase {
  protected defaultOptions: UniKyOptions

  constructor(options: UniKyOptions = {}) {
    this.defaultOptions = {
      prefixUrl: '',
      timeout: 60000,
      headers: {},
      retry: 0,
      hooks: {
        beforeRequest: [],
        afterResponse: [],
      },
      ...options,
    }
  }

  protected async request<T = any>(url: string, options: UniKyOptions = {}): Promise<T> {
    const mergedOptions = this.mergeOptions(options)
    const fullUrl = this.getFullUrl(url, mergedOptions)

    // 创建请求对象
    let request: UniKyRequest = {
      url: fullUrl,
      method: (options.method || 'GET').toUpperCase(),
      headers: mergedOptions.headers || {},
      body: options.data,
      timeout: mergedOptions.timeout,
    }

    // 执行请求前拦截器
    if (mergedOptions.hooks?.beforeRequest?.length) {
      for (const hook of mergedOptions.hooks.beforeRequest) {
        const result = await hook(request, mergedOptions)
        // 如果拦截器返回了新的请求对象，则使用它
        if (result !== undefined && result !== null) {
          request = result
        }
        // 如果拦截器没有返回值(void)，则继续使用当前的请求对象
      }
    }

    // 转换为 uni.request 需要的格式
    const requestOptions: UniApp.RequestOptions = {
      url: request.url,
      method: request.method as
        | 'GET'
        | 'POST'
        | 'PUT'
        | 'DELETE'
        | 'CONNECT'
        | 'HEAD'
        | 'OPTIONS'
        | 'TRACE',
      header: request.headers,
      data: request.body,
      timeout: request.timeout,
    }

    // 发起请求
    try {
      let retries = mergedOptions.retry || 0
      let response: UniKyResponse

      while (true) {
        try {
          response = await this.makeRequest(requestOptions, request.url)
          break
        } catch (error) {
          if (retries <= 0) {
            throw error
          }
          retries--
        }
      }

      // 执行响应后拦截器
      if (mergedOptions.hooks?.afterResponse?.length) {
        let processedResponse = response
        for (const hook of mergedOptions.hooks.afterResponse) {
          const result = await hook(processedResponse, request, mergedOptions)
          // 如果拦截器返回了新的响应对象，则使用它
          if (result !== undefined && result !== null) {
            processedResponse = result
          }
          // 如果拦截器没有返回值(void)，则继续使用当前的响应对象
        }
        return processedResponse.data
      }

      return response.data
    } catch (error) {
      throw error
    }
  }

  protected makeRequest(options: UniApp.RequestOptions, originalUrl: string): Promise<UniKyResponse> {
    return new Promise((resolve, reject) => {
      uni.request({
        ...options,
        success: (res) => {
          const response: UniKyResponse = {
            data: res.data,
            statusCode: res.statusCode,
            header: res.header,
            cookies: res.cookies || [],
            ok: res.statusCode >= 200 && res.statusCode < 300,
            redirected: res.statusCode === 301 || res.statusCode === 302,
            url: originalUrl,
          }

          // 处理非2xx状态码
          if (response.ok) {
            resolve(response)
          } else {
            reject(response)
          }
        },
        fail: (err) => {
          reject({
            ...err,
            ok: false,
            statusCode: 0,
            header: {},
            cookies: [],
            redirected: false,
            url: originalUrl,
            data: null,
          })
        },
      })
    })
  }

  protected mergeOptions(options: UniKyOptions): UniKyOptions {
    // 创建新的 hooks 对象，确保不修改原始对象
    const mergedHooks = {
      beforeRequest: [
        ...(this.defaultOptions.hooks?.beforeRequest || []),
      ],
      afterResponse: [
        ...(this.defaultOptions.hooks?.afterResponse || []),
      ],
    }

    // 添加传入的 hooks
    if (options.hooks?.beforeRequest) {
      if (Array.isArray(options.hooks.beforeRequest)) {
        mergedHooks.beforeRequest.push(...options.hooks.beforeRequest);
      } else {
        // 如果不是数组，转换为数组
        mergedHooks.beforeRequest.push(options.hooks.beforeRequest as any);
      }
    }

    if (options.hooks?.afterResponse) {
      if (Array.isArray(options.hooks.afterResponse)) {
        mergedHooks.afterResponse.push(...options.hooks.afterResponse);
      } else {
        // 如果不是数组，转换为数组
        mergedHooks.afterResponse.push(options.hooks.afterResponse as any);
      }
    }

    return {
      ...this.defaultOptions,
      ...options,
      headers: {
        ...this.defaultOptions.headers,
        ...options.headers,
      },
      hooks: mergedHooks,
    }
  }

  protected addSearchParams(
    url: string,
    searchParams?: Record<string, string> | URLSearchParams | string,
  ): string {
    if (!searchParams) {
      return url
    }

    const urlObject = new URL(url, 'http://example.com') // 使用基础URL以处理相对路径

    if (typeof searchParams === 'string') {
      // 如果是字符串，直接附加
      urlObject.search = searchParams.startsWith('?') ? searchParams : `?${searchParams}`
    } else if (searchParams instanceof URLSearchParams) {
      // 如果是 URLSearchParams 实例
      searchParams.forEach((value, key) => {
        urlObject.searchParams.append(key, value)
      })
    } else {
      // 如果是对象
      for (const [key, value] of Object.entries(searchParams)) {
        urlObject.searchParams.append(key, value)
      }
    }

    // 返回完整的URL，但移除基础URL部分
    return urlObject.pathname + urlObject.search + urlObject.hash
  }

  protected getFullUrl(url: string, options: UniKyOptions): string {
    const prefixUrl = options.prefixUrl ? options.prefixUrl.replace(/\/$/, '') : ''

    // 处理 searchParams
    url = this.addSearchParams(url, options.searchParams)

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }

    const normalizedUrl = url.startsWith('/') ? url : `/${url}`
    return `${prefixUrl}${normalizedUrl}`
  }

  // 创建具有 json 方法的 Promise
  protected createUniKyPromise<T>(promise: Promise<T>): UniKyPromise<T> {
    const uniKyPromise = promise as UniKyPromise<T>

    uniKyPromise.json = function<R = T>() {
      return this.then(data => {
        if (typeof data === 'string') {
          try {
            return JSON.parse(data)
          } catch (e) {
            return data as unknown as R
          }
        }
        return data as unknown as R
      })
    }

    return uniKyPromise
  }

  get<T = any>(url: string, options: UniKyOptions = {}): UniKyPromise<T> {
    return this.createUniKyPromise(this.request<T>(url, { ...options, method: 'GET' }))
  }

  post<T = any>(url: string, options: UniKyOptions = {}): UniKyPromise<T> {
    return this.createUniKyPromise(this.request<T>(url, { ...options, method: 'POST' }))
  }

  put<T = any>(url: string, options: UniKyOptions = {}): UniKyPromise<T> {
    return this.createUniKyPromise(this.request<T>(url, { ...options, method: 'PUT' }))
  }

  delete<T = any>(url: string, options: UniKyOptions = {}): UniKyPromise<T> {
    return this.createUniKyPromise(this.request<T>(url, { ...options, method: 'DELETE' }))
  }

  patch<T = any>(url: string, options: UniKyOptions = {}): UniKyPromise<T> {
    return this.createUniKyPromise(this.request<T>(url, { ...options, method: 'PATCH' }))
  }

  head<T = any>(url: string, options: UniKyOptions = {}): UniKyPromise<T> {
    return this.createUniKyPromise(this.request<T>(url, { ...options, method: 'HEAD' }))
  }

  options<T = any>(url: string, options: UniKyOptions = {}): UniKyPromise<T> {
    return this.createUniKyPromise(this.request<T>(url, { ...options, method: 'OPTIONS' }))
  }
}

// 使用函数工厂模式创建符合 UniKyInstance 接口的实例
function createUniKy(defaultOptions: UniKyOptions = {}): UniKyInstance {
  const base = new UniKyBase(defaultOptions)

  // 创建主函数
  const uniKyFunction = <T = any>(url: string, options: UniKyOptions = {}): UniKyPromise<T> => {
    return base['createUniKyPromise'](base['request']<T>(url, options))
  }

  // 添加所有方法
  uniKyFunction.get = base.get.bind(base)
  uniKyFunction.post = base.post.bind(base)
  uniKyFunction.put = base.put.bind(base)
  uniKyFunction.delete = base.delete.bind(base)
  uniKyFunction.patch = base.patch.bind(base)
  uniKyFunction.head = base.head.bind(base)
  uniKyFunction.options = base.options.bind(base)

  // 添加 create 方法
  uniKyFunction.create = (options: UniKyOptions): UniKyInstance => {
    // 深度合并 hooks
    const mergedHooks = {
      beforeRequest: [
        ...(defaultOptions.hooks?.beforeRequest || []),
      ],
      afterResponse: [
        ...(defaultOptions.hooks?.afterResponse || []),
      ],
    }

    // 添加传入的 hooks
    if (options.hooks?.beforeRequest) {
      if (Array.isArray(options.hooks.beforeRequest)) {
        mergedHooks.beforeRequest.push(...options.hooks.beforeRequest);
      } else {
        // 如果不是数组，转换为数组
        mergedHooks.beforeRequest.push(options.hooks.beforeRequest as any);
      }
    }

    if (options.hooks?.afterResponse) {
      if (Array.isArray(options.hooks.afterResponse)) {
        mergedHooks.afterResponse.push(...options.hooks.afterResponse);
      } else {
        // 如果不是数组，转换为数组
        mergedHooks.afterResponse.push(options.hooks.afterResponse as any);
      }
    }

    return createUniKy({
      ...defaultOptions,
      ...options,
      hooks: mergedHooks,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      }
    })
  }

  // 添加 extend 方法
  uniKyFunction.extend = (options: UniKyOptions): UniKyInstance => {
    return uniKyFunction.create(options)
  }

  return uniKyFunction
}

// 默认导出实例
export const uniKy = createUniKy()

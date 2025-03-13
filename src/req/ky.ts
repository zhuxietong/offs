// uniKy.ts

// 类型定义
export interface UniKyRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: any;
  timeout?: number;
}

export interface UniKyOptions {
  prefixUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
  retry?: number;
  searchParams?: Record<string, string | number | boolean> | URLSearchParams | string;
  hooks?: {
    beforeRequest?: Array<(request: UniKyRequest, options: UniKyOptions) => UniKyRequest | void | Promise<UniKyRequest | void>>;
    afterResponse?: Array<(response: UniKyResponse, request: UniKyRequest, options: UniKyOptions) => any | void | Promise<any | void>>;
  };
  [key: string]: any;
}

export interface UniKyResponse<T = any> {
  data: T;
  statusCode: number;
  header: Record<string, string>;
  cookies: string[];
  ok: boolean;
  redirected: boolean;
  url: string;
}

export interface UniKyInstance {
  get: <T = any>(url: string, options?: UniKyOptions) => Promise<T>;
  post: <T = any>(url: string, options?: UniKyOptions) => Promise<T>;
  put: <T = any>(url: string, options?: UniKyOptions) => Promise<T>;
  delete: <T = any>(url: string, options?: UniKyOptions) => Promise<T>;
  patch: <T = any>(url: string, options?: UniKyOptions) => Promise<T>;
  head: <T = any>(url: string, options?: UniKyOptions) => Promise<T>;
  options: <T = any>(url: string, options?: UniKyOptions) => Promise<T>;
  create: (defaultOptions: UniKyOptions) => UniKyInstance;
  extend: (options: UniKyOptions) => UniKyInstance;
  json: <T = any>(data?: any) => Promise<T>;
}

class UniKy implements UniKyInstance {
  private defaultOptions: UniKyOptions;

  constructor(options: UniKyOptions = {}) {
    this.defaultOptions = {
      prefixUrl: '',
      timeout: 60000,
      headers: {},
      retry: 0,
      hooks: {
        beforeRequest: [],
        afterResponse: []
      },
      ...options
    };
  }

  private async request<T = any>(url: string, options: UniKyOptions = {}): Promise<T> {
    const mergedOptions = this.mergeOptions(options);
    const fullUrl = this.getFullUrl(url, mergedOptions);

    // 创建请求对象
    let request: UniKyRequest = {
      url: fullUrl,
      method: (options.method || 'GET').toUpperCase(),
      headers: mergedOptions.headers || {},
      body: options.data,
      timeout: mergedOptions.timeout
    };

    // 执行请求前拦截器
    if (mergedOptions.hooks?.beforeRequest?.length) {
      for (const hook of mergedOptions.hooks.beforeRequest) {
        const result = await hook(request, mergedOptions);
        // 如果拦截器返回了新的请求对象，则使用它
        if (result !== undefined && result !== null) {
          request = result;
        }
        // 如果拦截器没有返回值(void)，则继续使用当前的请求对象
      }
    }

    // 转换为 uni.request 需要的格式
    const requestOptions: UniApp.RequestOptions = {
      url: request.url,
      method: request.method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'HEAD' | 'OPTIONS' | 'TRACE',
      header: request.headers,
      data: request.body,
      timeout: request.timeout
    };

    // 发起请求
    try {
      let retries = mergedOptions.retry || 0;
      let response: UniKyResponse;

      while (true) {
        try {
          response = await this.makeRequest(requestOptions, request.url);
          break;
        } catch (error) {
          if (retries <= 0) {
            throw error;
          }
          retries--;
        }
      }

      // 执行响应后拦截器
      if (mergedOptions.hooks?.afterResponse?.length) {
        let processedResponse = response;
        for (const hook of mergedOptions.hooks.afterResponse) {
          const result = await hook(processedResponse, request, mergedOptions);
          // 如果拦截器返回了新的响应对象，则使用它
          if (result !== undefined && result !== null) {
            processedResponse = result;
          }
          // 如果拦截器没有返回值(void)，则继续使用当前的响应对象
        }
        return processedResponse.data;
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  private makeRequest(options: UniApp.RequestOptions, originalUrl: string): Promise<UniKyResponse> {
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
            url: originalUrl
          };

          // 处理非2xx状态码
          if (response.ok) {
            resolve(response);
          } else {
            reject(response);
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
            data: null
          });
        }
      });
    });
  }

  private mergeOptions(options: UniKyOptions): UniKyOptions {
    return {
      ...this.defaultOptions,
      ...options,
      headers: {
        ...this.defaultOptions.headers,
        ...options.headers
      },
      hooks: {
        beforeRequest: [
          ...(this.defaultOptions.hooks?.beforeRequest || []),
          ...(options.hooks?.beforeRequest || [])
        ],
        afterResponse: [
          ...(this.defaultOptions.hooks?.afterResponse || []),
          ...(options.hooks?.afterResponse || [])
        ]
      }
    };
  }

  private addSearchParams(url: string, searchParams?: Record<string, string> | URLSearchParams | string): string {
    if (!searchParams) {
      return url;
    }

    const urlObject = new URL(url, 'http://example.com'); // 使用基础URL以处理相对路径

    if (typeof searchParams === 'string') {
      // 如果是字符串，直接附加
      urlObject.search = searchParams.startsWith('?') ? searchParams : `?${searchParams}`;
    } else if (searchParams instanceof URLSearchParams) {
      // 如果是 URLSearchParams 实例
      searchParams.forEach((value, key) => {
        urlObject.searchParams.append(key, value);
      });
    } else {
      // 如果是对象
      for (const [key, value] of Object.entries(searchParams)) {
        urlObject.searchParams.append(key, value);
      }
    }

    // 返回完整的URL，但移除基础URL部分
    return urlObject.pathname + urlObject.search + urlObject.hash;
  }

  private getFullUrl(url: string, options: UniKyOptions): string {
    const prefixUrl = options.prefixUrl ? options.prefixUrl.replace(/\/$/, '') : '';

    // 处理 searchParams
    url = this.addSearchParams(url, options.searchParams);

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
    return `${prefixUrl}${normalizedUrl}`;
  }

  get<T = any>(url: string, options: UniKyOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  post<T = any>(url: string, options: UniKyOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'POST' });
  }

  put<T = any>(url: string, options: UniKyOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'PUT' });
  }

  delete<T = any>(url: string, options: UniKyOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }

  patch<T = any>(url: string, options: UniKyOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'PATCH' });
  }

  head<T = any>(url: string, options: UniKyOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'HEAD' });
  }

  options<T = any>(url: string, options: UniKyOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'OPTIONS' });
  }

  create(defaultOptions: UniKyOptions = {}): UniKyInstance {
    return new UniKy(defaultOptions);
  }

  extend(options: UniKyOptions = {}): UniKyInstance {
    return new UniKy(this.mergeOptions(options));
  }

  json<T = any>(data?: any): Promise<T> {
    return Promise.resolve(data);
  }
}

// 默认导出实例
const uniKy = new UniKy();
export default uniKy;

import { deepMerge } from './deepMerge';
import { getValue } from './type';

async function fetchWithTimeout(
  url: string,
  option: RequestInit,
  timeout: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, { ...option, signal: controller.signal });
  } catch (error) {
    // @ts-ignore
    if (error.name === 'AbortError') {
      throw new Error('timeout');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const FetchIntercept = {
  timeout: 20000,
  before: (url: string, init: RequestInit) => {
    return { url, init };
  },
  after: (_option: OffsCoreFetchOption<any>, resp: any) => {
    return new Promise((resolve) => {
      resolve(resp);
    });
  },
  failed: (_option: OffsCoreFetchOption<any>, err: any) => {
    console.error(err);
  },
};

const defaultInit: Partial<RequestInit> = {
  method: 'get',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

function parserOption(str: string, option?: OffsCoreFetchOption) {
  const match = str.match(/^\[(.*?)\](.*)/);
  if (!match) return { url: str.trim(), setting: {
    init: {
      ...defaultInit,
      method:option?.method || (option?.body ? "post" : undefined) || defaultInit.method
    }} };

  const [, bracketContent, url] = match;
  const parts = bracketContent.split(',').map((part) => part.trim());
  const init: RequestInit = deepMerge({}, defaultInit, option?.init || {});
  const setting: OffsCoreFetchOption = { ...option };

  parts.forEach((part) => {
    if (['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'].includes(part.toUpperCase())) {
      init.method = (part.toUpperCase() as RequestInit['method']) || option?.method || defaultInit.method;
    } else if (part.startsWith('@')) {
      if (!setting.extract) {
        setting.extract = part.slice(1);
      }
    }
  });

  setting.init = init;
  return { setting, url: url.trim() };
}

/**
 * Fetch Json请求的包装
 * @param {string} url - 请求的URL, [get,@data,query]
 * @param option
 */
export function Fetch<T>(url: string, option?: OffsCoreFetchOption): Promise<T> {


  const ops = option || {}

  const { url: _url, setting } = parserOption(url, ops);
  const headers = setting.init?.headers || {};
  const init = setting.init || {};
  if(!init.method){{
    init.method = option?.method || defaultInit.method;
  }}

  /**
   * 根据指定的编码对请求体进行编码
   * @param {Body} body - 请求体
   * @returns {any} - 编码后的请求体
   */
  const encodeBody = (body: Body): any => {
    const encoding =
      setting?.encoding ??
      (/json/.test((headers as Record<string, string>)['Content-Type'])
        ? 'json'
        : undefined);
    if (typeof body === 'object') {
      return encoding === 'json'
        ? JSON.stringify(body)
        : new URLSearchParams(body as any).toString();
    }
    return body;
  };

  let urlString = _url;
  if (ops.query) {
    const query = new URLSearchParams(ops.query as any).toString();
    urlString += (urlString.includes('?') ? '&' : '?') + query;
  }
  if (ops.body) {
    init.body = encodeBody((ops.body || {}) as any);
    if(!init.method){{
      init.method = 'post';
    }}
  }
  let lastOption = FetchIntercept.before(urlString, init);
  if (ops.before) {
    lastOption = ops.before(urlString, init);
  }


  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      // console.log('lastOption', lastOption);
      const response = await fetchWithTimeout(
        lastOption.url,
        lastOption.init,
        ops.timeout || FetchIntercept.timeout,
      );
      if (!response.ok) {
        reject(`HTTP error! status: ${response.status}`);
        return;
      }
      try {
        let raw = (await response.json()) as T;
        if (ops.after) {
          await ops.after(ops, raw);
        } else {
          raw = (await FetchIntercept.after(ops, raw)) as any;
        }
        let data = raw;
        if (setting.extract) {
          if (typeof setting.extract === 'function') {
            data = setting.extract(raw);
          } else {
            data = getValue(raw, setting.extract);
          }
        } else {
        }
        resolve(data);
      } catch (e) {
        if (ops.failed) {
          await ops.failed(ops, e);
        } else {
          FetchIntercept.failed(ops, e);
        }
        reject(e);
      }
    } catch (e) {
      reject(e);
    }
  });
}

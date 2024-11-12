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
    const response = await fetch(url, { ...option, signal: controller.signal });
    return response;
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
  after: (_option: BaseFetchOption<any>, resp: any) => {
    return new Promise((resolve) => {
      resolve(resp);
    });
  },
  failed: (_option: BaseFetchOption<any>, err: any) => {
    console.error(err);
  },
};
type ExtractFunc<T> = (_resp: any) => T;

export type BaseFetchOption<T = any> = {
  init?: RequestInit;
  extract?: ExtractFunc<T> | string;
  encoding?: 'json' | 'query';
  query?: { [k: string]: any };
  body?: { [k: string]: any };
  timeout?: number;
  before?: (typeof FetchIntercept)['before'];
  after?: (typeof FetchIntercept)['after'];
  failed?: (typeof FetchIntercept)['failed']
  tips?:
    | {
        success?: string;
        error?: string;
      }
    | string;
};

const defaultInit: Partial<RequestInit> = {
  method: 'get',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

function parserOption(str: string, option: BaseFetchOption) {
  const match = str.match(/^\[(.*?)\](.*)/);
  if (!match) return { url: str.trim(), setting: {} };

  const [, bracketContent, url] = match;
  const parts = bracketContent.split(',').map((part) => part.trim());
  const init: RequestInit = deepMerge({}, defaultInit, option.init || {});
  const setting: BaseFetchOption = { ...option };

  parts.forEach((part) => {
    if (['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'].includes(part.toUpperCase())) {
      init.method = (part.toUpperCase() as RequestInit['method']) || defaultInit.method;
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
 * @param opiton
 */
export function Fetch<T>(url: string, opiton: BaseFetchOption): Promise<T> {
  const { url: _url, setting } = parserOption(url, opiton);
  const headers = setting.init?.headers || {};
  const init = setting.init || {};

  /**
   * 根据指定的编码对请求体进行编码
   * @param {Body} body - 请求体
   * @returns {any} - 编码后的请求体
   */
  const encodeBody = (body: Body): any => {
    const encoding =
      setting?.encoding ??
      (/application\/json/.test((headers as Record<string, string>)['Content-Type'])
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
  if (opiton.query) {
    const query = new URLSearchParams(opiton.query as any).toString();
    urlString += (urlString.includes('?') ? '&' : '?') + query;
  }
  if (opiton.body) {
    init.body = encodeBody((opiton.body || {}) as any);
  }
  let lastOption = FetchIntercept.before(urlString, init);
  if (opiton.before) {
    lastOption = opiton.before(urlString, init);
  }

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      console.log('lastOption', lastOption);
      const response = await fetchWithTimeout(
        lastOption.url,
        lastOption.init,
        opiton.timeout || FetchIntercept.timeout,
      );
      if (!response.ok) {
        reject(`HTTP error! status: ${response.status}`);
        return;
      }
      try {
        let raw = (await response.json()) as T;
        if (opiton.after) {
          await opiton.after(opiton, raw);
        } else {
          raw = (await FetchIntercept.after(opiton, raw)) as any;
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
        if (opiton.failed) {
          await opiton.failed(opiton, e);
        } else {
          FetchIntercept.failed(opiton, e)
        }
        reject(e);
      }
    } catch (e) {
      reject(e);
    }
  });
}

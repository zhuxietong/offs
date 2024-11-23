import { deepMerge } from './deepMerge';
import { getValue } from './type';
import OffsRequestConfig from "./requestConfig";
import {offsRequestConfig} from "../index";

/**
 * 运行方法代替真实请求的模拟
 */
async function simulateFetchWrap(jsonFunc: () => Promise<any>) {
  return {
    json: jsonFunc,
    ok: true,
  } as Response;
}

/**
 * 超时请求的包裹，超时后会抛出异常
 * simulateFunc 为模拟请求的方法，传入该方法时会调用模拟方法
 */
async function fetchWithTimeout(
  url: string,
  option: RequestInit,
  timeout: number,
  simulateFunc?: (...args: any) => Promise<any>,
): Promise<Response> {
  if (simulateFunc) {
    return await simulateFetchWrap(simulateFunc);
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout || 30000);
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






export function parserFetchOption(str: string, option?: OffsCoreFetchOption) {

  const defaultInit = offsRequestConfig.defaultInit;

  const match = str.match(/^\[(.*?)\](.*)/);
  if (!match)
    return {
      url: str.trim(),
      setting: {
        init: {
          ...defaultInit,
          method:
            option?.method ||
            (option?.body ? 'post' : undefined) ||
            defaultInit.method,
        },
      } as OffsCoreFetchOption<any>,
    };

  const [, bracketContent, url] = match;
  const parts = bracketContent.split(',').map((part) => part.trim());
  const init: RequestInit = deepMerge({}, defaultInit, option?.init || {});
  const setting: OffsCoreFetchOption = { ...option };

  parts.forEach((part) => {
    if (['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'].includes(part.toUpperCase())) {
      init.method =
        (part.toUpperCase() as RequestInit['method']) ||
        option?.method ||
        defaultInit.method;
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
  const ops = option || {};
  const FetchIntercept = OffsRequestConfig.intercept;


  const { url: _url, setting } = parserFetchOption(url, ops);
  const headers = setting.init?.headers || {};
  const init = setting.init || {};
  if (!init.method) {
    {
      init.method = option?.method || offsRequestConfig.defaultInit.method;
    }
  }

  /**
   * 根据指定的编码对请求体进行编码
   * @param {Body} body - 请求体
   * @returns {any} - 编码后的请求体
   */
  const encodeBody = (body: Body): any => {
    const encoding =
      setting?.encoding ??
      (/json/.test((headers as Record<string, string>)['Content-Type']) ? 'json' : undefined);
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
    if (!init.method) {
      {
        init.method = 'post';
      }
    }
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
        ops.timeout || offsRequestConfig.timeout,
      );
      if (!response.ok) {
        reject(`HTTP error! status: ${response.status}`);
        return;
      }
      try {
        let raw = (await response.json()) as T;
        if (option?.log) {
          console.log('OffsCoreFetch response json', raw, lastOption);
        }
        ops.onGetRootJson?.(raw);
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
        if (option?.log) {
          console.log('OffsCoreFetch catch error', e, lastOption);
        }
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

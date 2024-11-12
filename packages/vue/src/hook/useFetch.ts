import { deepMerge, getValue, FetchIntercept } from '@offs/core';

// @ts-ignore
import { onMounted, ref } from 'vue';
// import { useRoute } from 'vue-router';

/**
 * 提取值的函数类型定义
 */
export type ExtractValueFunction = (resp: any) => any;

/**
 * Fetch请求初始化选项的类型定义，扩展自RequestInit
 */
export type FetchRequestInit = Omit<RequestInit, 'body'> & {
  body?: any;
};

/**
 * 请求参数的获取方式，param代表从路由参数获取，query代表从查询参数获取，函数代表自定义获取方式，extractRule表示提取规则
 * extractRule表示提取规则于extractValues函数的第二个参数相同
 */
export type FetchGetter =
  | (() => any)
  | { type?: 'param' | 'query'; extractRule?: string }
  | 'query'
  | 'param';

// const getterFunc = (getter: FetchGetter): object | undefined => {
//   if (typeof getter === 'function') {
//     return getter();
//   } else if (typeof getter === 'object') {
//     const type = getter.type || 'query';
//     const route = useRoute();
//     return type === 'param'
//       ? extractValues(route.params, getter.extractRule)
//       : extractValues(route.query, getter.extractRule);
//   }
//
//   return undefined;
// };

/**
 * Fetch请求设置的类型定义
 * @template T - 响应的类型
 */
export type FetchSetting<
  T = any,
  B = any,
  Ext extends { [k: string]: any } = { [k: string]: any },
> = {
  encoding?: 'json' | 'query';
  extract?: string | string[] | ExtractValueFunction;
  convert?: (resp: any) => T;
  manual?: boolean;
  onResponse?: (resp: T, body?: B) => void;
  onSuccess?: (resp: T, body?: B) => void;
  onFailed?: (resp: T, body: B) => void;
  init?: FetchRequestInit;
  request?: (body?: B) => Promise<T>;
  body?: { [k: string]: any } | FetchGetter;
  query?: { [k: string]: any } | FetchGetter;
  useBodyAsQuery?: boolean;
} & Ext;

/**
 * 从输入字符串中提取Fetch信息
 * @param {string} input - 包含Fetch信息的输入字符串
 * @returns {{ setting: FetchSetting, url: string }} - 提取的Fetch设置和URL
 */
export function extractFetchInfo(input: string): { setting: FetchSetting; url: string } {
  const match = input.match(/^\[(.*?)\](.*)/);
  if (!match) return { url: input.trim(), setting: {} };

  const [, bracketContent, url] = match;
  const parts = bracketContent.split(',').map((part) => part.trim());
  const init: RequestInit = {};
  const setting: FetchSetting = {};

  parts.forEach((part) => {
    if (['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'].includes(part.toUpperCase())) {
      init.method = part.toUpperCase() as RequestInit['method'];
    } else if (part.startsWith('@')) {
      setting.extract = part.slice(1);
    } else if (['query', 'body'].includes(part)) {
      setting.bodyPosition = part as 'body' | 'query';
    }
  });

  setting.init = init;
  return { setting, url: url.trim() };
}

/**
 * Fetch请求的默认初始化选项
 */
const defaultInit: RequestInit = {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
};

// type HostGet = (url: string) => string;
// let hostGet: HostGet = (_url) => {
//   return '';
// };
//
// export const setHookHost = (getBlock: HostGet) => {
//   hostGet = getBlock;
// };

/**
 * 自定义的Fetch请求钩子
 * @template Resp - 响应的类型
 * @template Body - 请求体的类型
 * @param {string} url - Fetch请求的URL
 * @param {FetchSetting} [setting] - 可选的Fetch请求设置
 * @returns {{ data: Ref<Resp>, loading: Ref<boolean>, run: (body?: Body) => Promise<any> }} - 数据、加载状态和运行函数
 */
export const useFetch:UseFetchFunction = <Resp = any, Body = any>(url: string, setting?: FetchSetting) => {
  const data = ref<Resp>([] as Resp);
  const loading = ref(false);
  // const run = (body?: Body) => {
  //   return fetch(url, setting?.init || {})
  // }
  // return {data,loding,run}

    /**
   * 根据指定的编码对请求体进行编码
   * @param {Body} body - 请求体
   * @returns {any} - 编码后的请求体
   */
  const encodeBody = (body: Body): any => {
    const encoding =
      setting?.encoding ??
      (/application\/json/.test((defaultInit.headers as Record<string, string>)['Content-Type'])
        ? 'json'
        : undefined);
    if (typeof body === 'object') {
      return encoding === 'json'
        ? JSON.stringify(body)
        : new URLSearchParams(body as any).toString();
    }
    return body;
  };

  /**
   * 执行Fetch请求
   * @param {Body} [body] - 可选的请求体
   * @returns {Promise<any>} - Fetch响应
   */
  const run = (body?: Body) => {
    loading.value = true;
    const { url: urlStringPath, setting: fSetting } = extractFetchInfo(url);

    const newSetting = deepMerge(fSetting, setting || {}) as FetchSetting;

    const options = deepMerge({}, defaultInit, newSetting.init || {});
    delete options.extract;

    if (setting?.useBodyAsQuery) {
      options.query = deepMerge((newSetting.query as object) || {}, body || {});
    }

    let urlString = `${urlStringPath}`;
    const queryObj = options.query || {}
    if (Object.keys(queryObj).length > 0) {
      const query = new URLSearchParams(queryObj as any).toString();
      urlString += (urlString.includes('?') ? '&' : '?') + query;
    }
    if (body) {
      if(newSetting.init?.method?.toUpperCase() === 'post')
      options.body = encodeBody(body);
    }
    if (setting?.useBodyAsQuery) {
      delete options.body;
    }
    const success = (json: any) => {
      let value = json;
      try {
        newSetting.onResponse?.(json, body);
      } catch (e) {}
      if (typeof newSetting.extract === 'function') {
        value = newSetting.extract(json);
      } else if (typeof newSetting.extract === 'string') {
        value = getValue(json, newSetting.extract);
      } else if (Array.isArray(newSetting.extract)) {
        for (const key of newSetting.extract) {
          value = getValue(json, key);
          if (value) break;
        }
      }
      if (newSetting.convert) value = newSetting.convert(value);
      data.value = value;
      newSetting.onSuccess?.(value, body);
      loading.value = false;
      return value;
    };

    if (setting?.request) {
      const request = setting!.request!;
      return new Promise((resolve, reject) => {
        options.body = body;
        request(body)
          .then((json) => {
            resolve(success(json));
          })
          .catch((e) => {
            console.error(e);
            loading.value = false;
            newSetting.onFailed?.(e, body);
            reject(e);
          });
      });
    }

    const { url: _url, init: _init } = FetchIntercept.before(urlString, options);
    console.warn('-',_init)
    return fetch(_url, _init)
      .then(async (res) => {
        try {
          return await res.json();
        } catch (e) {
          throw new Error('useFetch json parse error');
        }
      })
      .then((json) => {
        return success(json);
      })
      .catch((e) => {
        console.error(e);
        loading.value = false;
        newSetting.onFailed?.(e, body);
      });
  };

  onMounted(() => {
    if (!setting?.manual) run((setting?.init?.body as Body) || (setting?.body as Body)).then(()=>{

    }).catch( () => {});
  });
  return { data, loading, run };
};


import { useParam } from '../hook/useParam';
import { Fetch } from '../utils/request';

// @ts-ignore
import { onMounted, ref } from 'vue';
import { extractValues } from '@offs/core';

/**
 * 提取值的函数类型定义
 */
export type ExtractValueFunction = (resp: any) => any

/**
 * Fetch请求初始化选项的类型定义，扩展自RequestInit
 */
// @ts-ignore
export type FetchRequestInit = Omit<RequestInit, 'body'> & {
  body?: any
}

/**
 * 请求参数的获取方式，param代表从路由参数获取，query代表从查询参数获取，函数代表自定义获取方式，extractRule表示提取规则
 * extractRule表示提取规则于extractValues函数的第二个参数相同
 */
export type FetchGetter =
  | (() => any)
  | { type?: 'param' | 'query'; extractRule?: string }
  | 'query'
  | 'param'

/**
 * 自定义的Fetch请求钩子
 * @template Resp - 响应的类型
 * @template Body - 请求体的类型
 * @param {string} url - Fetch请求的URL
 * @param {OffsUniUseFetchOption} [options] - 可选的Fetch请求设置
 * @returns {{ data: Ref<Resp>, loading: Ref<boolean>, run: (body?: Body) => Promise<any> }} - 数据、加载状态和运行函数
 */
// eslint-disable-next-line no-undef
export const useFetch = <Resp = any, Body = any>(url: string, options?: OffsUniUseFetchOption) => {

  const data = ref<Resp>([] as Resp);
  const loading = ref(false);
  // const run = (body?: Body) => {
  //   return fetch(url, setting?.init || {})
  // }
  // return {data,loding,run}

  let op = {};

  const getQueryParams = () => {
    if (typeof options?.route === 'function') {
      // @ts-ignore
      return options.route(op);
    }
    if (typeof options?.route === 'string') {
      return extractValues(op, options.route);
    }
    return undefined;
  };

  /**
   * 执行Fetch请求
   * @param {Body} [body] - 可选的请求体
   * @returns {Promise<any>} - Fetch响应
   */
  const run = (body?: Body) => {
    console.log("-ssssss-ss--ss--ss",body)

    loading.value = true;
    const userGetRootUser = options?.onGetRootJson;
    let rootJson: any = undefined;
    if (options) {
      options.onGetRootJson = (json: any) => {
        if (userGetRootUser) {
          userGetRootUser(json);
        }
        rootJson = json;
      };
    }

    const dialog = () => {
      // eslint-disable-next-line no-undef
      return (options?.dialog?.value || options?.dialog) as (LoadingActive | undefined);
    };
    const ext = getQueryParams() || {};
    if (!options) {
      options = {} as any;
    }
    options!.data = { ...ext, ...options!.data, ...(body || {}) };
    try {
      dialog()?.start?.();

    }catch (e) {

    }
    return Fetch(url, options)
      .then((rep) => {
        let value = rep;
        try {
          if (options?.convert) {
            value = options?.convert(rep);
          }
        } catch (e) {
        }
        // @ts-ignore
        data.value = value;
        options?.onSuccess?.(value, rootJson);
        try {
          dialog()?.end?.(true);
        }catch (e) {

        }
        loading.value = false;
      })
      .catch((e) => {
        try {
          dialog()?.end?.(false, e);
        }catch (e) {

        }
        loading.value = false;
        options?.onFailed?.(e, body);
      });
  };

  useParam((param) => {
    op = param;
  });

  onMounted(() => {
    if (!options?.manual)
      run(options?.data as Body)
        .then(() => {
        })
        .catch(() => {
        });
  });

  return { data, loading, run };
};

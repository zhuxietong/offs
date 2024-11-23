import { Fetch } from '../utils/request';

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
 * @param {OffsVueFetchOption} [setting] - 可选的Fetch请求设置
 * @returns {{ data: Ref<Resp>, loading: Ref<boolean>, run: (body?: Body) => Promise<any> }} - 数据、加载状态和运行函数
 */
export const useFetch = <Resp = any, Body = any>(url: string, options?: OffsVueFetchOption) => {
  const data = ref<Resp>([] as Resp);
  const loading = ref(false);
  // const run = (body?: Body) => {
  //   return fetch(url, setting?.init || {})
  // }
  // return {data,loding,run}

  /**
   * 执行Fetch请求
   * @param {Body} [body] - 可选的请求体
   * @returns {Promise<any>} - Fetch响应
   */
  const run = (body?: Body) => {
    loading.value = true;

    const userGetRootUser = options?.onGetRootJson;
    let rootJson: any = undefined;
    if(options){
      options.onGetRootJson = (json: any) => {
        if (userGetRootUser) {
          userGetRootUser(json);
        }
        rootJson = json;
      };
    }
    return Fetch(url, options)
      .then((rep) => {
        let value = rep;
        try {
          if (options?.convert) {
            value = options?.convert(rep);
          }
        } catch (e) {}
        data.value = value;
        options?.onSuccess?.(value, rootJson);
        loading.value = false;
      })
      .catch((e) => {
        console.error(e);
        loading.value = false;
        options?.onFailed?.(e, body);
      });
  };

  onMounted(() => {
    if (!options?.manual)
      run((options?.init?.body as Body) || (options?.body as Body))
        .then(() => {})
        .catch(() => {});
  });
  return { data, loading, run };
};

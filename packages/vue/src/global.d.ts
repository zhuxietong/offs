declare global {
  export type PaginationParam = {
    sizeKey?: string;
    pageKey?: string;
    defaultSize?: number;
    totalKey?: string;
    listKey?: string;
    beginPage?: number | string; //default 1
    pagination?: {
      [k: string]: any;
    };
  };




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


  // 定义 UseFetchReturn 类型，表示 useFetch 函数的返回值
  export type UseFetchReturn<Resp, Body> = {
    data: Ref<Resp>;
    loading: Ref<boolean>;
    run: (body?: Body) => Promise<Response>;
  };


  // 定义 useFetch 函数的类型
  export type UseFetchFunction = <Resp = any, Body = any>(
    url: string,
    setting?: FetchSetting,
  ) => UseFetchReturn<Resp, Body>;

}
// 确保这个文件被 TypeScript 处理
export {};

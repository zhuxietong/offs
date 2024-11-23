import { FetchIntercept } from './utils/fetch';

declare global {
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

  export type OffsCoreFetchOption<T = any> = {
    init?: RequestInit;
    method?: RequestInit['method'];
    //than 抛出的提取字段方法/节点字符串
    extract?: ExtractFunc<T> | string;
    encoding?: 'json' | 'query';
    query?: { [k: string]: any };
    body?: { [k: string]: any };
    log?: boolean;
    timeout?: number;
    onGetRootJson?: (json: any) => any;
    before?: (typeof FetchIntercept)['before'];
    after?: (typeof FetchIntercept)['after'];
    failed?: (typeof FetchIntercept)['failed'];
    request?: (body?: any) => Promise<T>;
    tips?:
      | {
          success?: string;
          error?: string;
        }
      | string;
  };

  export type OffsCoreFetchType = <U extends string, T>(
    url: U,
    option?: OffsCoreFetchOption<T>,
  ) => Promise<T>;
}

// 确保这个文件被 TypeScript 处理
export {};

import type { UIWindow } from './utils/window'
import { FetchIntercept } from '@offs/core/src/utils/fetch'
import type { Ref, Component, VNode } from 'vue'
import offsStyle from './style'
import { MeForm } from './components/fm/type'

declare global {
  const _Window: UIWindow
  const _Tops: (
    upx: number,
    isCustomNav?: boolean = false,
  ) => { origin: number; body: number; tabHeight: number }

  export interface FormInstance<T extends object> {
    valid:(option?:{tip?:MeForm.ErrorTip})=>T
  }

  const _offsStyle: typeof offsStyle

  const _HUD: (info: string) => LoadingActive

  interface _PaginationOptions {
    page_size_key: string
    page_index_key: string
    page_size: number
    page_begin: number
  }

  interface ME {
    ROUTES: { name: string; path: string }[]
    style: _PageStyle
    pagination: _PaginationOptions
  }

  export type _UserEvent = 'login' | 'logout' | 'expired'

  interface _LoginKey {
    token: string
    id: string
    username?: string
    mobile?: string
    info?: any

    [k: string]: any
  }

  export type TabItem = {
    title?: string
    icon: string
    iconSize?: string
    selectIcon?: string
    page?: Component | (() => VNode)
  }

  export interface LoadingActive {
    start(info?: { message: string; ext: any } | string)

    end(success: boolean, message?: string | { message?: string; errMsg?: string; ext: any })

    value?: LoadingActive
  }

  interface _Icon {
    icon: string
    name: string

    [k: string]: any
  }

  interface _PageStyle {
    [k: string]: any

    theme: 'gray' | 'dark' | 'white'
    indicatorTheme: 'gray' | 'dark' | 'white'
    tint: string
    fontColor: string
    backgroundColor: string
    radius: string
    navigation: {
      tint: string
      background?: string
      fontSize: string
    }
    dialog: {
      cancelColor: string
      confirmColor: string
      defaultColor: string
      buttonRadius: string
      sheetBackground: string
      alertBackground: string
    }
    emptyImage: {
      height: number | string
      width: number | string
      src: any
    }
    errorImage: {
      height: number | string
      width: number | string
      src: any
    }
  }

  export type PaginationParam = {
    sizeKey?: string
    pageKey?: string
    defaultSize?: number
    totalKey?: string
    listKey?: string
    beginPage?: number | string //default 1
    pagination?: {
      [k: string]: any
    }
  }

  /**
   * 提取值的函数类型定义
   */
  export type ExtractValueFunction = (resp: any) => any

  /**
   * Fetch请求初始化选项的类型定义，扩展自RequestInit
   */
  // eslint-disable-next-line no-undef
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
  /**
   * Fetch请求设置的类型定义
   * @template T - 响应的类型
   */
  export type OffsUniFetchOption<T = any, B = any> = {
    method?: 'GET' | 'POST' | 'OPTIONS' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD'
    //than 抛出的提取字段方法/节点字符串
    extract?: (source: any) => T | string
    data?: { [k: string]: any }
    headers?: { [k: string]: any }
    log?: boolean
    timeout?: number
    onGetRootJson?: (json: any) => any
    before?: (typeof FetchIntercept)['before']
    after?: (typeof FetchIntercept)['after']
    request?: ((body?: any) => Promise<T>) | { [k: string]: any }
    manual?: boolean
    /**
     * 会话控件
     */
    dialog?: LoadingActive | Ref<LoadingActive | undefined>
    onResponse?: (resp: T, body?: B) => void
    onSuccess?: (resp: T, body?: B) => void
    onFailed?: (resp: T, body: B) => void
    convert?: (resp: any) => T
  }

  type RouteParamGetter = () => { [k: string]: string | boolean | object | number }

  export type OffsUniUseFetchOption<T = any, B = any> = {
    /**附带路由参数提取到 uni.request 的 data 中
     * true 时表示获取路由的所有查询参数
     * string 时表示获取路由的指定查询参数，string 的配置逻辑是 @offs/core 中 的extractValues方法的第二个参数
     * 函数时表示自定义提取方式
     **/
    route?: true | string | RouteParamGetter
  } & OffsUniFetchOption<T, B>

  export type OffsPagingFetchOption<T, B> = OffsUniFetchOption<T, B, PaginationParam>

  // 定义 UseFetchReturn 类型，表示 useFetch 函数的返回值
  export type UseFetchReturn<Resp, Body> = {
    data: Ref<Resp>
    loading: Ref<boolean>
    run: (body?: Body) => Promise<Response>
  }

  // 定义 useFetch 函数的类型
  export type UseFetchFunction = <Resp = any, Body = any>(
    url: string,
    // eslint-disable-next-line no-undef
    setting?: OffsVueFetchOption,
  ) => UseFetchReturn<Resp, Body>

  export type OffsVueFetchFunction<T extends string> = <T extends string>(
    url: T,
  ) => {
    // eslint-disable-next-line no-undef
    setting: OffsVueFetchOption
    url: T
    readonly get: any
    readonly post: any
    readonly delete: any
    readonly put: any
    readonly manual: any
    readonly create: any
    extract(extract: string | string[] | ExtractValueFunction): any
    // eslint-disable-next-line no-undef
    option(op: OffsVueFetchOption): any
    use<R>(): UseFetchReturn<R, any>
  }
}
// 确保这个文件被 TypeScript 处理
export {}

// src/index.ts
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./components.d.ts" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./global.d.ts" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="/vue-extensions.d.ts" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="/props.d.ts" />

import installCmp from './install'
import { Dayjs } from '@offs/core'

export type * from './components.d.ts'
export type * from './global.d.ts'
export type * from './vue-extensions.d.ts'
export type * from './props.ts'

export { Fetch } from './utils/request'
export { useFetch } from './hook/useFetch'
export { DeepAssign } from './utils/merge'
export { useNavigation } from './hook/useNavigation'
export { OffsNode } from './utils/node'
export { useParam } from './hook/useParam'
export { UNI_HUD } from './utils/loading'
export { useStorage } from './hook/useStorage'

// @ts-ignore
import { App, Plugin } from 'vue'

import { uniInitGlobal } from './install_global'

export const offsModule: Plugin<any> = {
  install: (app: any, _options: any) => {
    uniInitGlobal()
    // @ts-ignore
    installCmp.install(app)
    // Object.assign(requestConfig, options);
    app.config.globalProperties.$time = (_t: string, _type?: 'cn' | 'en') => {
      return Dayjs.prettyTime(_t, _type || 'cn')
    }
    app.config.globalProperties.$day = (_t: string, _type?: 'cn' | 'en') => {
      return Dayjs.prettyDay(_t, _type || 'en')
    }
    app.config.globalProperties.$tf = (_t: string, _f?: string) => {
      return Dayjs.format(_t, _f || 'YYYY-MM-DD HH:mm:ss')
    }
    app.config.globalProperties.$int = (v: any) => {
      return parseInt(`${v}`)
    }
    app.config.globalProperties.$upx = (v: any) => {
      // eslint-disable-next-line no-undef
      return uni.upx2px(v)
    }
  },
}
export default offsModule

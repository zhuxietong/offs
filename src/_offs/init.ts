import type { App } from 'vue'
import offsModule from '@offs/uni'
import { offsRequestConfig } from '@offs/core'

export function initOffs(app: App<Element>) {
  // @ts-ignore
  app.use(offsModule)
  // DB.uniInitGlobal()
  offsRequestConfig.intercept.before = (url, init) => {
    console.log('before request')
    return { url: 'http://localhost:9511' + url, init }
  }
  offsRequestConfig.intercept.after = (init, resp) => {
    console.log('after request', resp)

    if (resp.result === -1) {
      throw new Error(`接口错误：${resp.msg || '未知错误result:' + resp.result}`)
    }
    return resp
    // console.log('before request')
  }
}

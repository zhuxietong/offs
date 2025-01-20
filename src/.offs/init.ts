import type { App } from 'vue'
import offsModule from '@offs/uni'
import { offsRequestConfig } from '@offs/core'

export function initOffs(app: App<Element>) {
  // @ts-ignore
  app.use(offsModule)
  // DB.uniInitGlobal()
  offsRequestConfig.intercept.before = (url, init) => {
    console.log('before request')
    // return JSON.stringify(body)
    return { url: 'http://192.168.3.105:9100' + url, init }
    // return {url: 'http://localhost:9511' + url, init};
  }
}

import { initOffs } from '@/_offs/init'
import { createSSRApp } from 'vue'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  initOffs(app)

  return {
    app,
  }
}

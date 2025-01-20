import { initOffs } from '@/.offs/init.ts'
import { createSSRApp } from 'vue'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  initOffs(app)

  return {
    app,
  }
}

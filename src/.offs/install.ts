import type { App } from 'vue';
import offsModule from '@offs/uni';
import { offsRequestConfig } from '@offs/core';
import offsPart from './gen/offs-ext-components';
import globalInstall from './gen/global.install';

function initOffs(app: App<Element>) {
  // @ts-ignore
  app.use(offsModule);
  app.use(offsPart);
  globalInstall(); // 注入全局变量
  offsRequestConfig.intercept.before = (url, init) => {
    console.log('before request');
    return { url: 'http://localhost:3111' + url, init };
  };
}

export default initOffs;

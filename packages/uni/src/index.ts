// src/index.ts
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./components.d.ts" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./global.d.ts" />

import { install_comps } from './install';

export type * from './components.d.ts';
export type * from './global.d.ts';
export { Fetch } from './utils/request';
export { useFetch } from './hook/useFetch';
// @ts-ignore
import { App, Plugin } from 'vue';

const OffsUniPlugin: Plugin<any> = {
  install: (app: any, _options: any) => {
    install_comps(app);
    // Object.assign(requestConfig, options);
    app.config.globalProperties.$time = (_t: string, _type?: 'cn' | 'en') => {
      // return Dayjs.prettyTime(t, type || 'cn');
    };
    app.config.globalProperties.$day = (_t: string, _type?: 'cn' | 'en') => {
      // return Dayjs.prettyDay(t, type || 'en');
    };
    app.config.globalProperties.$tf = (_t: string, _f?: string) => {
      // return Dayjs.format(t, f || 'YYYY-MM-DD HH:mm:ss');
    };
    app.config.globalProperties.$int = (v: any) => {
      return parseInt(`${v}`);
    };
  },
};

export default OffsUniPlugin;

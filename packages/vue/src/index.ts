// src/index.ts
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./components.d.ts" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./global.d.ts" />

// export type * from './components.d.ts';
// export type * from './global.d.ts';

import {Dayjs} from '@offs/core';
import {useSize} from './hook/useSize';
import {useFetch} from './hook/useFetch';
// @ts-ignore
import {App, Plugin} from 'vue';
import usePaginationFetch from './hook/usePaginationFetch';
import usePageFetch from './hook/usePageFetch';
import {type OffsVueFetch, useOffsVueFetch} from './hook/vueFetch';

import requestConfig from './config/request';
import type {PaginationConfig} from './config/request';

export {
  useFetch,
  useSize,
  usePaginationFetch,
  usePageFetch,
  useOffsVueFetch,
  OffsVueFetch,
  requestConfig as config,
};

type OffsVueInitOption = {
  pagination: (_url: string) => PaginationConfig;
};
const OffsVuePlugin: Plugin<OffsVueInitOption> = {
  install: (app: App, options: OffsVueInitOption) => {
    // Object.assign(requestConfig, options);
    requestConfig.pagination = options.pagination;
    app.config.globalProperties.$time = (t: string, type?: 'cn' | 'en') => {
      return Dayjs.prettyTime(t, type || 'cn');
    };
    app.config.globalProperties.$day = (t: string, type?: 'cn' | 'en') => {
      return Dayjs.prettyDay(t, type || 'en');
    };
    app.config.globalProperties.$tf = (t: string, f?: string) => {
      return Dayjs.format(t, f || 'YYYY-MM-DD HH:mm:ss');
    };
    app.config.globalProperties.$int = (v: any) => {
      return parseInt(`${v}`);
    };
  },
};

export default OffsVuePlugin;

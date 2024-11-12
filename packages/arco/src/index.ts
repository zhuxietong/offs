// src/index.ts
// @ts-ignore

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./components.d.ts" />
export type * from './components.d.ts';

import { App, Plugin } from 'vue';

import { useBreadcrumbs } from './hook/useBreadcrumbs';

import SideMenu from './components/side-menu.vue';
import PagingTable from './components/paging-table.vue';

export { useBreadcrumbs };

type OffsArcoInitOption = {
  [k: string]: any;
};

const OffsArcoPlugin: Plugin<OffsArcoInitOption> = {
  install: (app: App, _options: OffsArcoInitOption) => {
    app.component('CoSideMenu', SideMenu);
    app.component('CoPagingTable', PagingTable);
  },
};

export default OffsArcoPlugin;

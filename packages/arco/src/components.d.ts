import { Component, VNode } from 'vue';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    CoSideMenu: typeof import('./components/side-menu.vue').default;
    CoPagingTable: typeof import('./components/paging-table.vue').default;
  }
}

declare global {
  export type MenuTree = {
    key: string;
    title: string;
    icon?: Component | (() => VNode);
    children?: MenuTree[];
  };

  export type PagingTableRef<T extends object> = {
    updateFilter: (filter: Record<string, any>) => void;
    refresh: (firstPage?: boolean) => void;
    list: any[];
  };
}
// 确保这个文件被 TypeScript 处理
export {};

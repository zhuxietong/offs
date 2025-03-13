export {};

declare module '@vue/runtime-core' {
export interface GlobalComponents {
  MeIcon: typeof import('./components/icon/index.vue')['default']
}
}

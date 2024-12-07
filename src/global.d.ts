export {}
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    CoDemo: typeof import('./pages/index/demo.vue')['default']
    CoNavbar: typeof import('../packages/uni/src/components/navbar.vue')['default']
  }
}

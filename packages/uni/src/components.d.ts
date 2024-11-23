export {}
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    MeSection: typeof import('./components/section/section.vue')['default']
    MeSectionRow: typeof import('./components/section/section-row.vue')['default']
    MePaging: typeof import('./components/paging.vue')['default']
    MeDetail: typeof import('./components/detail.vue')['default']
  }
}

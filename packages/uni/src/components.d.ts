export {}
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    MeNavbar: typeof import('./components/navbar.vue')['default']
    MeCmpIndicator: typeof import('./components/cmp/indicator.vue')['default']
    MeCmpFold: typeof import('./components/cmp/fold.vue')['default']
    MeCmpDimTime: typeof import('./components/cmp/dim-time.vue')['default']
    MeCmpSectionRow: typeof import('./components/cmp/section-row.vue')['default']
    MeCmpAnimation: typeof import('./components/cmp/animation.vue')['default']
    MeCmpSafeBottom: typeof import('./components/cmp/safe-bottom.vue')['default']
    MeCmpBounceIndicator: typeof import('./components/cmp/bounce-indicator.vue')['default']
    MeCmpLoading: typeof import('./components/cmp/loading.vue')['default']
    MeCmpModal: typeof import('./components/cmp/modal.vue')['default']
    MeCmpSectionGroup: typeof import('./components/cmp/section-group.vue')['default']
    MePageLoad: typeof import('./components/page/load.vue')['default']
    MePageScroll: typeof import('./components/page/scroll.vue')['default']
    MePageRefresh: typeof import('./components/page/refresh.vue')['default']
    MePageDetail: typeof import('./components/page/detail.vue')['default']
    MeFormGroup: typeof import('./components/form/group.vue')['default']
    MeFormAdd: typeof import('./components/form/add.vue')['default']
    MeFormField: typeof import('./components/form/field.vue')['default']
    MeFormCell: typeof import('./components/form/cell.vue')['default']
    MeForm: typeof import('./components/form/form.vue')['default']
    MeTab: typeof import('./components/tab.vue')['default']
    MeFieldSwitch: typeof import('./components/field/switch.vue')['default']
    MePaging: typeof import('./components/paging.vue')['default']
  }
}
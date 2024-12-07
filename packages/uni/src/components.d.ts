export {}
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    MeNavbar: typeof import('./components/navbar.vue')['default']
    MeCmpIndicator: typeof import('./components/cmp/indicator.vue')['default']
    MeCmpFold: typeof import('./components/cmp/fold.vue')['default']
    MeCmpAnimation: typeof import('./components/cmp/animation.vue')['default']
    MeCmpLoading: typeof import('./components/cmp/loading.vue')['default']
    MePageDetail: typeof import('./components/page/detail.vue')['default']
    MeFormGroup: typeof import('./components/form/group.vue')['default']
    MeFormAdd: typeof import('./components/form/add.vue')['default']
    MeFormField: typeof import('./components/form/field.vue')['default']
    MeFormCell: typeof import('./components/form/cell.vue')['default']
    MeForm: typeof import('./components/form/form.vue')['default']
    MeTab: typeof import('./components/tab.vue')['default']
    MeFieldSwitch: typeof import('./components/field/switch.vue')['default']
    MePaging: typeof import('./components/paging.vue')['default']
    MeIcon: typeof import('./components/icon/icon.vue')['default']
  }
}
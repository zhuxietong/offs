import { App } from 'vue';

// 自动生成的全局组件注册文件
import MeNavbar from './components/navbar.vue';
import MeCmpIndicator from './components/cmp/indicator.vue';
import MeCmpFold from './components/cmp/fold.vue';
import MeCmpAnimation from './components/cmp/animation.vue';
import MeCmpLoading from './components/cmp/loading.vue';
import MePageDetail from './components/page/detail.vue';
import MeFormGroup from './components/form/group.vue';
import MeFormAdd from './components/form/add.vue';
import MeFormField from './components/form/field.vue';
import MeFormCell from './components/form/cell.vue';
import MeForm from './components/form/form.vue';
import MeTab from './components/tab.vue';
import MeFieldSwitch from './components/field/switch.vue';
import MePaging from './components/paging.vue';
import MeIcon from './components/icon/icon.vue';

export default {
  install(app: App) {
    app.component('MeNavbar', MeNavbar);
    app.component('MeCmpIndicator', MeCmpIndicator);
    app.component('MeCmpFold', MeCmpFold);
    app.component('MeCmpAnimation', MeCmpAnimation);
    app.component('MeCmpLoading', MeCmpLoading);
    app.component('MePageDetail', MePageDetail);
    app.component('MeFormGroup', MeFormGroup);
    app.component('MeFormAdd', MeFormAdd);
    app.component('MeFormField', MeFormField);
    app.component('MeFormCell', MeFormCell);
    app.component('MeForm', MeForm);
    app.component('MeTab', MeTab);
    app.component('MeFieldSwitch', MeFieldSwitch);
    app.component('MePaging', MePaging);
    app.component('MeIcon', MeIcon);
  },
};
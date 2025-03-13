import { App } from 'vue';

// 自动生成的全局组件注册文件
import MeNavbar from './components/navbar.vue';
import MeCmpIndicator from './components/cmp/indicator.vue';
import MeCmpScale from './components/cmp/scale.vue';
import MeCmpFold from './components/cmp/fold.vue';
import MeCmpDimTime from './components/cmp/dim-time.vue';
import MeCmpAnimation from './components/cmp/animation.vue';
import MeCmpSafeBottom from './components/cmp/safe-bottom.vue';
import MeCmpBounceIndicator from './components/cmp/bounce-indicator.vue';
import MeCmpLoading from './components/cmp/loading.vue';
import MeCmpModal from './components/cmp/modal.vue';
import MePageLoad from './components/page/load.vue';
import MePageScroll from './components/page/scroll.vue';
import MePageRefresh from './components/page/refresh.vue';
import MePageDetail from './components/page/detail.vue';
import MeFormGroup from './components/form/group.vue';
import MeFormAdd from './components/form/add.vue';
import MeFormField from './components/form/field.vue';
import MeFormCell from './components/form/cell.vue';
import MeFormForm from './components/form/form.vue';
import MeSectionGroup from './components/section/group.vue';
import MeSectionRow from './components/section/row.vue';
import MeIndicatorBounce from './components/indicator/bounce.vue';
import MeFmItem from './components/fm/item.vue';
import MeFmTextArea from './components/fm/text/area.vue';
import MeFmTextInput from './components/fm/text/input.vue';
import MeFmForm from './components/fm/form.vue';
import MeTab from './components/tab.vue';
import MeFieldSwitch from './components/field/switch.vue';
import MePaging from './components/paging.vue';

export default {
  install(app: App) {
    app.component('MeNavbar', MeNavbar);
    app.component('MeCmpIndicator', MeCmpIndicator);
    app.component('MeCmpScale', MeCmpScale);
    app.component('MeCmpFold', MeCmpFold);
    app.component('MeCmpDimTime', MeCmpDimTime);
    app.component('MeCmpAnimation', MeCmpAnimation);
    app.component('MeCmpSafeBottom', MeCmpSafeBottom);
    app.component('MeCmpBounceIndicator', MeCmpBounceIndicator);
    app.component('MeCmpLoading', MeCmpLoading);
    app.component('MeCmpModal', MeCmpModal);
    app.component('MePageLoad', MePageLoad);
    app.component('MePageScroll', MePageScroll);
    app.component('MePageRefresh', MePageRefresh);
    app.component('MePageDetail', MePageDetail);
    app.component('MeFormGroup', MeFormGroup);
    app.component('MeFormAdd', MeFormAdd);
    app.component('MeFormField', MeFormField);
    app.component('MeFormCell', MeFormCell);
    app.component('MeFormForm', MeFormForm);
    app.component('MeSectionGroup', MeSectionGroup);
    app.component('MeSectionRow', MeSectionRow);
    app.component('MeIndicatorBounce', MeIndicatorBounce);
    app.component('MeFmItem', MeFmItem);
    app.component('MeFmTextArea', MeFmTextArea);
    app.component('MeFmTextInput', MeFmTextInput);
    app.component('MeFmForm', MeFmForm);
    app.component('MeTab', MeTab);
    app.component('MeFieldSwitch', MeFieldSwitch);
    app.component('MePaging', MePaging);
  },
};
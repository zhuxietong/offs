// src/vue-extensions.d.ts
import { DefineComponent } from 'vue'
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $time: (t: string, type?: 'cn' | 'en') => string;
    $day: (t: string, type?: 'cn' | 'en') => string;
    $tf: (t: string, f?: string) => string;
    $int: (v: any) => number;
  }
}


declare module '*.vue' {
  const component: DefineComponent<{}, {}, any>
  export default component
}

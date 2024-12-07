// @ts-ignore
import { Window } from './utils/window';
import { Pages } from './utils/navigation';
import { UNI_HUD } from './utils/loading';
import { PublishSub } from '@offs/core';
import { IconName, iconsFor, indexIcon, randomIcon } from './components/icon/type';
import {UISetting} from "./props";

export const uniInitGlobal = () => {
  console.log('uniInitGlobal',Window);

  // @ts-ignore
  globalThis._UISetting = new UISetting()


  // @ts-ignore
  globalThis._Window = new Window();
  const PG = new Pages();


  // @ts-ignore
  globalThis._Tops = (upx: number, isCustomNav?: boolean = false) => {

    let tabJust: number = isCustomNav ? _Window.navigationBarHeight : 0
    // #ifdef  H5
    tabJust = _Window.navigationBarHeight
    // #endif
    const bodyJust: number = uni.upx2px(upx) + tabJust
    return {
      origin: tabJust,
      body: bodyJust,
      tabHeight: uni.upx2px(upx)
    }
  }

  // @ts-ignore
  globalThis._Pages = PG;
  // @ts-ignore
  globalThis._To = {
    // @ts-ignore
    reLunch(route: PathRoute | NameRoute | _RouteName, ext?: RouterExt) {
      PG.restart(route, ext);
    },
    // @ts-ignore
    replace(route: PathRoute | NameRoute | _RouteName, ext?: RouterExt) {
      PG.replace(route, ext);
    },
    // @ts-ignore
    push(route: PathRoute | NameRoute | _RouteName, ext?: RouterExt) {
      PG.push(route, ext);
    },
    // @ts-ignore
    tab(route: PathRoute | NameRoute | _RouteName, ext?: RouterExt) {
      PG.tab(route, ext);
    },
    back(step: number) {
      PG.back(step);
    },

    callBack(key: string, obj: any) {
      PG.callBack(key, obj);
    },
    emit(key: string, obj: any) {
      PG.emit(key, obj);
    },
  };

  // @ts-ignore
  // globalThis._App = new AppBag();


  // @ts-ignore
  // globalThis._CSS = Css;

  // @ts-ignore
  globalThis._this = () => {
    // @ts-ignore
    const { proxy } = getCurrentInstance();

    return proxy;
  };

  // @ts-ignore
  globalThis._PaginationConfig = (url: string) => {
    return _ME.pagination;
  };
  // @ts-ignore
  globalThis._HUD = (info) => {
    return new UNI_HUD(info);
  };

  // @ts-ignore
  // globalThis._Push = new PushManager();

  // @ts-ignore
  globalThis._Tops = (upx: number, isCustomNav?: boolean = false) => {
    let tabJust: number = isCustomNav ? _Window.navigationBarHeight : 0;
    // @ts-ignore
    // #ifdef  H5
    tabJust = _Window.navigationBarHeight;
    // @ts-ignore
    // #endif
    const bodyJust: number = uni.upx2px(upx) + tabJust;

    console.log('000uuuuuuuuu', tabJust);
    return {
      origin: tabJust,
      body: bodyJust,
      // @ts-ignore
      tabHeight: uni.upx2px(upx),
    };
  };
  // @ts-ignore
  globalThis._ParserRouteJson = (str: string) => {
    // #ifdef H5
    try {
      return JSON.parse(str);
    } catch (e) {
      return {};
    }
    // #endif
    // #ifndef H5
    try {
      // console.log("str:",str)
      // console.log("decode",decodeURIComponent(str))
      JSON.parse(decodeURIComponent(str));
    } catch (e) {
      // console.log("---err",e)
      return {};
    }
    // #endif
  };

  // Object.assign(model,JSON.parse(decodeURIComponent(op.json)))

  // @ts-ignore
  globalThis._demo = {
    icon(i?: number): IconName {
      if (typeof i === 'undefined') {
        return randomIcon();
      }
      return indexIcon(<number>i);
    },
    icons(num: number, source?: string[]): _Icon[] {
      return iconsFor(num, source);
    },
  };

  // @ts-ignore
  // globalThis._Store = new Store();
  // @ts-ignore
  globalThis._Diff = {
    onLoadJson(item: any) {
      // #ifdef APP-PLUS
      return item;
      // #endif
      // #ifndef APP-PLUS
      return JSON.parse(item);
      // #endif
    },
  };

  // @ts-ignore
  globalThis._User = {
    login(user: _LoginKey) {
      try {
        // @ts-ignore
        uni.setStorageSync('_User', JSON.stringify(user));
        this.event.onNext('login');
      } catch (e) {}
    },
    logout() {
      this.temp = undefined;
      try {
        // @ts-ignore
        uni.removeStorageSync('_User');
        try {
          delete this.temp;
        } catch (e) {}
        this.event.onNext('logout');
      } catch (e) {
        // error
      }
    },
    event: new PublishSub<_UserEvent>(),
    get current(): any {
      try {
        // @ts-ignore
        const value = uni.getStorageSync('_User');
        if (value) {
          return JSON.parse(value);
        }
      } catch (e) {
        return undefined;
      }
    },
    get token(): string {
      let temp: any = this.temp;
      if (!temp) {
        temp = this.current;
        this.temp = temp;
      }
      return temp?.token;
    },
    get isLogin(): boolean {
      return Boolean(this.token);
    },
    get id(): string {
      let temp: any = this.temp;
      if (!temp) {
        temp = this.current;
        this.temp = temp;
      }
      return temp?.id || temp?.uid || '';
    },
  };
};

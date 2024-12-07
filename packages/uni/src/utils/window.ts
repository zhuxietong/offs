export interface UIRect {
  top: number;
  left: number;
  height: number;
  width: number;
}

export interface UIInsets {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface UIWindow {
  height: number;
  width: number;
  safeAreaInsets: UIInsets;
  statusBarHeight: number;
  navigationContentHeight: number;
  navigationBarHeight: number;
  menuButtonRect: UIRect;
  tabBarHeight: number;
  windowTop: number;
}

export class Window implements UIWindow {
  windowInstance?: UIWindow = undefined;

  constructor() {
    console.log('init Window');
  }
  get $window(): UIWindow {
    if (this.windowInstance !== undefined) {
      return <UIWindow>this.windowInstance;
    }
    // @ts-ignore
    const { windowWidth, windowHeight, statusBarHeight, platform, safeAreaInsets } =
      // @ts-ignore
      uni.getWindowInfo();
    let rect: UIRect = { top: 0, left: 0, height: 0, width: 0 };

    // APP-PLUS || H5 ||APP-PLUS

    // #ifdef MP-WEIXIN
    // @ts-ignore
    const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
    console.log('menuButtonInfo', menuButtonInfo);
    rect = {
      top: menuButtonInfo.top,
      left: menuButtonInfo.width,
      height: menuButtonInfo.height,
      width: menuButtonInfo.width,
    };
    // #endif

    const window: UIWindow = {
      width: windowWidth,
      height: windowHeight,
      safeAreaInsets: <UIInsets>safeAreaInsets,
      menuButtonRect: rect,
      statusBarHeight: <number>statusBarHeight,
      navigationBarHeight: 44 + <number>statusBarHeight,
      navigationContentHeight: 44,
      tabBarHeight: 0,
      windowTop: 0,
    };
    this.windowInstance = window;
    return window;
  }

  get height(): number {
    return this.$window.height;
  }

  get width(): number {
    return this.$window.width;
  }

  get navigationBarHeight(): number {
    return this.$window.navigationBarHeight;
  }

  get navigationContentHeight(): number {
    return this.$window.navigationContentHeight;
  }

  get safeAreaInsets(): UIInsets {
    return this.$window.safeAreaInsets;
  }

  get statusBarHeight(): number {
    return this.$window.statusBarHeight;
  }

  get tabBarHeight(): number {
    // @ts-ignore
    const { windowBottom, safeAreaInsets } = uni.getWindowInfo() || {
      windowBottom: 0,
      safeAreaInsets: { bottom: 0 },
    };
    return windowBottom + (safeAreaInsets?.bottom || 0);
  }

  get windowTop(): number {
    // #ifdef H5
    return this.navigationBarHeight;
    // #endif
    // #ifndef H5
    return 0;
    // #endif
  }

  get menuButtonRect(): UIRect {
    return this.$window.menuButtonRect;
  }
}

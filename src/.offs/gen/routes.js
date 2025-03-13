// 初始化全局_ME对象
if (typeof globalThis._ME === 'undefined') {
  globalThis._ME = {
    ROUTES: [],
    style: {}
  };
}

// 更新路由配置
globalThis._ME.ROUTES = [
  {
    "name": "pages_refresh_index",
    "path": "pages/refresh/index",
    "style": {
      "navigationBarTitleText": "uni-app",
      "navigationBarBackgroundColor": "#F7F8FA",
      "navigationBarTextStyle": "black",
      "navigationStyle": "custom"
    }
  },
  {
    "name": "pages_index_index",
    "path": "pages/index/index",
    "style": {
      "navigationBarTitleText": "uni-app",
      "navigationBarBackgroundColor": "#F7F8FA",
      "navigationBarTextStyle": "black",
      "navigationStyle": "custom"
    }
  }
];
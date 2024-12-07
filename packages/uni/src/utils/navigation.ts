export type RouteJumpType = 'push' | 'replace' | 'reLaunch' | 'switchTab';

if (!String.prototype.startsWith)
  String.prototype.startsWith = function (val) {
    if (this.substr(0, '13'.length) === val) {
      return true;
    }
    return false;
  };

function makeQuery(queryObject: object) {
  let query = Object.entries(queryObject)
    .reduce((result, entry) => {
      // @ts-ignore
      result.push(entry.join('='));
      return result;
    }, [])
    .join('&');
  query = encodeURI(query);
  return `${query}`;
}

function findRouter(name: string) {
  let pages_: any[] = [];
  // try {
  //     pages_ = ROUTES
  // }catch (e) {
  //
  // }
  try {
    // @ts-ignore
    if (_ME.ROUTES) {
      // @ts-ignore
      pages_ = _ME.ROUTES;
    }
  } catch (e) {}

  for (const item of pages_) {
    try {
      if (item.name === name) {
        item.url = '/' + item.path;
        return item;
      }
    } catch (e) {}
  }
  return undefined;
}

export interface PageInstance {
  style: _PageStyle;
  on?: { [k: string]: (e: any) => void };

  [k: string]: any;
}

export interface RouterExt {
  on: { [k: string]: (e: any) => void };
  events: { [k: string]: (e: any) => void };
  success: (e: any) => void;
}

export class Pages {
  get current(): PageInstance {
    // @ts-ignore
    const pages: any = getCurrentPages();
    const last = pages.length;
    const page: any = <PageInstance>pages[last - 1] || {};
    if (page.style == undefined) {
      page.style = _ME.style;
    }
    return page;
  }

  back(step: number = 1) {
    // @ts-ignore
    uni.navigateBack({
      delta: step,
    });
  }

  get currentPage() {
    // @ts-ignore
    const pages = getCurrentPages();
    const page = pages[pages.length - 1];
    return page;
  }

  get currentChannel() {
    // @ts-ignore
    return this.currentPage.getOpenerEventChannel();
  }

  callBack(key: string, obj: any) {
    this.currentChannel.emit(key, obj);
  }

  emit(key: string, obj: any) {
    // @ts-ignore
    const pages = getCurrentPages();

    if (pages.length > 1) {
      const page: any = pages[pages.length - 2];
      const on = page.on || {};
      const func = on[key];
      if (typeof func === 'function') {
        func(obj);
      }
    }
  }

  parser(obj: string | { name: string } | { path: string } | { url: string }) {
    switch (typeof obj) {
    case 'string':
      // eslint-disable-next-line no-case-declarations
      const str = <string>obj;
      if (str.startsWith('/')) {
        return { url: obj };
      } else {
        return findRouter(str);
      }
    case 'object':
      // eslint-disable-next-line no-case-declarations
      const dict = <any>obj;
      if (dict.url) {
        return obj;
      }
      if (dict.name) {
        const router = findRouter(dict.name);
        if (router) {
          return { url: '/' + router.path };
        }
      }
      if (dict.path) {
        return { url: '/' + dict.path };
      }
      break;
    default:
      return undefined;
    }
  }

  _next(obj: any, more: any, type: RouteJumpType = 'push') {
    const router = this.parser(obj);
    if (router) {
      obj = obj || {};
      const { json } = obj;
      const { query } = obj;
      if (json) {
        let queryStr = '';
        // #ifdef APP-PLUS
        queryStr = '?json=' + JSON.stringify(json);
        // #endif
        // #ifndef APP-PLUS
        queryStr = '?json=' + encodeURIComponent(JSON.stringify(json));
        // #endif
        if (query) {
          queryStr = queryStr + '&' + makeQuery(query);
          delete router.query;
        }
        router.url = router.url + queryStr;
        delete router.json;
      } else {
        if (query) {
          router.url = router.url + '?' + makeQuery(query);
          delete router.query;
        }
      }
      const routerObj = Object.assign(router, more || {});
      try {
        if (type === 'push') {
          // @ts-ignore
          let on = this.currentPage.on || {};
          on = Object.assign({}, on, router.on);
          // @ts-ignore
          this.currentPage.on = on;
          // @ts-ignore
          uni.navigateTo(routerObj);
        } else if (type === 'replace') {
          // @ts-ignore
          uni.redirectTo(routerObj);
        } else if (type === 'switchTab') {
          // @ts-ignore
          uni.switchTab(routerObj);
        } else if (type === 'reLaunch') {
          // @ts-ignore
          uni.reLaunch(routerObj);
        }
      } catch (e) {}
    }
  }

  push(router: string | { url: string } | { path: string } | { name: string }, more?: RouterExt) {
    this._next(router, more, 'push');
  }

  tab(router: string | { url: string } | { path: string } | { name: string }, more?: RouterExt) {
    this._next(router, more, 'switchTab');
  }

  replace(
    router: string | { url: string } | { path: string } | { name: string },
    more?: RouterExt,
  ) {
    this._next(router, more, 'replace');
  }

  restart(
    router: string | { url: string } | { path: string } | { name: string },
    more?: RouterExt,
  ) {
    this._next(router, more, 'reLaunch');
  }
}

//JSON.parse(decodeURIComponent(option.item));

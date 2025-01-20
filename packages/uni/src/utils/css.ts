export type CssKey = 'position' | 'color' | 'backgroundColor' | 'display' | string;

export interface CssKeyValue {
  [key: CssKey]: any;
}

export interface CssOptions extends CssKeyValue {
  color?: 'red' | 'white' | 'blue' | 'green' | string;
  position?: 'fixed' | 'static' | 'float' | 'absolute';
  padding?: any;
  backgroundColor?: any;
}

const CssOptionDefault = {
  color: '#222222',
  backgroundColor: '#ffffff',
  position: 'static',
  padding: 0,
};

export interface CssMap extends CssOptions {
  update: (options: CssOptions) => void;
  str: string;
}

export function Css(value: string | object): CssMap {
  let raw = {};
  switch (typeof value) {
  case 'object':
    raw = <CSSStyleDeclaration>value;
    break;
  case 'string':
    raw = CssUntil.stringToCss(<string>value);
    break;
  default:
    break;
  }
  return <CssMap>new Proxy(raw, {
    get: function (target: object, property, receiver) {
      if (property == 'update') {
        return function (value: CssOptions) {
          Object.assign(target, value);
        };
      }
      if (property == 'str') {
        return CssUntil.cssToString(target);
      }
      // @ts-ignore
      return Reflect.get(target, property, receiver) || CssOptionDefault[property] || '';
    },
    set: function (target, property, value, receiver) {
      return Reflect.set(target, property, value, receiver);
    },
  });
}

export class CssUntil {
  static stringToCss(str: string): CSSStyleDeclaration {
    function centerLineFormat(raw: string) {
      const string = raw + '';
      return string.replace(/(-[a-z])/g, ($1) => {
        return $1
          .replace(/-/g, () => {
            return '';
          })
          .toUpperCase();
      });
    }

    function cssFrom(str: string) {
      const attr = str.match(/[\w-#$\\(\\)]+:\s*[\w-#$\\(\\)]+/g);
      const values: { [k: string]: string } = {};
      if (attr) {
        for (const item of attr) {
          let k = item.replace(/:\s*[\w-#$\\(\\)]+/g, '');
          k = k.replace(/^\s/g, '').replace(/\s$/g, '');
          let v:any = item.replace(/[\w-#$\\(\\)]+:/g, '');
          v = v.replace(/^\s/g, '').replace(/\s$/g, '');
          if(/\\d/.test(v)){
            v = parseInt(v);
          }
          values[k] = v;
        }
      }
      return values;
    }

    // @ts-ignore
    return <CSSStyleDeclaration>cssFrom(centerLineFormat(str));
  }

  static cssToString(obj: CSSStyleDeclaration | object): string {
    // @ts-ignore
    const css: CSSStyleDeclaration = obj || {};

    function centerLineFormat(raw: string) {
      const string = raw + '';
      return string.replace(/([A-Z])/g, ($1) => {
        return '-' + $1.toLowerCase();
      });
    }

    const values:string[] = [];
    for (const key in css) {
      const styleKey = centerLineFormat(key);
      const value = css[key];
      if (value !== undefined) {
        values.push(`${styleKey} : ${value}`);
      }
    }
    return values.join(';');
  }
}

export class CssInsert {
  boundary = [0, 576, 768, 992, 1200, 1400, 100000];
  fontSize = [0.95, 1, 1, 1.05, 1.1, 1.15, 1.2];

  initRem() {
    this.insertMediaCss((i) => `html{font-size:${this.fontSize[i]}px}`, 'f-rem');
  }

  insertMediaCss(block: (index: number) => string, id: string = 'f-media') {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('style');
      el.setAttribute('id', id);
      el.setAttribute('type', 'text/css');
      const head = document.head || document.getElementsByTagName('head')[0];
      head.appendChild(el);
    }

    const boundary = this.boundary;
    const range = (start: number, end: number) =>
      new Array(end - start).fill(start).map((_, i) => start + i);
    const medias = [];
    for (const lower of range(0, boundary.length - 1)) {
      const css = `@media screen and (min-width: ${boundary[lower]}px) and (max-width: ${boundary[lower + 1]}px) {\n${block(lower)}\n}`;
      // @ts-ignore
      medias.push(css);
    }
    const txt = el.innerHTML || '';
    const style = medias.join('\n');
    if (txt.indexOf(style) > 0) {
      return;
    }
    el.innerHTML = (el.innerHTML || '') + `\n${style}\n`;
  }

  public static insert(style: string, cls: string) {
    try {
      let new_element = document.getElementById(cls);
      if (!new_element) {
        const css_str = `.${cls}{\n${style}\n}`;
        new_element = document.createElement('style');
        new_element.setAttribute('id', cls);
        new_element.setAttribute('type', 'text/css');
        new_element.innerHTML = css_str;
        const head = document.head || document.getElementsByTagName('head')[0];
        head.appendChild(new_element);
        return new_element;
      }
      return undefined;
    } catch (e) {
      return undefined;
    }
  }

  public static append(style: any, id: string = 'f-style') {
    // const tp = typeof style
    // let str = style;
    // if (tp === 'object') {
    //   // @ts-ignore
    //   str = new Proxy(CssProxy, style).style;
    // }

    const css_str = `\n${style}\n`;
    try {
      let new_element = document.getElementById(id);
      if (!new_element) {
        new_element = document.createElement('style');
        new_element.setAttribute('id', id);
        new_element.setAttribute('type', 'text/css');
        new_element.innerHTML = css_str;
        const head = document.head || document.getElementsByTagName('head')[0];
        head.appendChild(new_element);
      }
      const txt = new_element.innerHTML || '';
      if (txt.indexOf(style) > 0) {
        return;
      }
      new_element.innerHTML = (new_element.innerHTML || '') + css_str;
      return css_str;
    } catch (e) {
      return undefined;
    }
  }
}

export const CssProxy = {
  get: (target: any, key: any, _receiver: any) => {
    const css = (v: any) => {
      return (
        Object.entries(v)
          .map(([k, v]) => {
            k = k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
            return `${k}:${v}`;
          })
          .join(';') + ';'
      );
    };
    if (key === 'css') {
      return css(target);
    }
    if (key === 'class') {
      return (cls: any) => {
        return `.${cls}{\n${css(target)}\n}`;
      };
    }
    if (key === 'insert') {
      return (cls: any) => {
        return CssInsert.insert(css(target), cls);
      };
    }
    if (key === 'append') {
      return (cls: any, id: string = 'f-style') => {
        CssInsert.append(css(cls), id);
      };
    }
    return target[key];
  },
};

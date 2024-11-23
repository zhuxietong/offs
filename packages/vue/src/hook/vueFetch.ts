import { useFetch } from './useFetch';

export class OffsVueFetch<T extends string> {
  setting: OffsVueFetchOption = {};
  url: T;

  constructor(url: T) {
    this.url = url;
  }

  get get() {
    if (this.setting) {
      this.setting.init!.method = 'get';
    }
    return this;
  }

  get post() {
    if (this.setting) {
      this.setting.init!.method = 'get';
    }
    return this;
  }

  get delete() {
    if (this.setting) {
      this.setting.init!.method = 'get';
    }
    return this;
  }

  get put() {
    if (this.setting) {
      this.setting.init!.method = 'get';
    }
    return this;
  }

  get manual() {
    if (this.setting) {
      this.setting.me = 'get';
      this.setting.manual = true;
    }
    return this;
  }

  get create() {
    if (this.setting) {
      this.setting.init!.method = 'get';
    }
    return this;
  }

  extract(extract: string | string[] | ExtractValueFunction) {
    this.setting.extract = extract;
    return this;
  }

  option(op:OffsVueFetchOption) {
    this.setting = {
      ...this.setting,
      ...op
    }
    return this;
  }



  use<R>():UseFetchReturn<R, any> {
    return useFetch(this.url, this.setting) as any
  }
}

export function useOffsVueFetch<T extends string>(url: T) {
  return new OffsVueFetch<T>(url);
}

// const {loading,run,data} = OffsVueFetch('sd').get.option({
// }).extract('').use();

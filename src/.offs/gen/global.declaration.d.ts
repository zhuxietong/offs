declare global {
  var _theme: { backgroundColor: string; color: string; };
  var _api: (url: string, options?: any) => Promise<any>;
}

export {};

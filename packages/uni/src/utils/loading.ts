// @ts-ignore

// eslint-disable-next-line no-undef
export class UNI_HUD implements LoadingActive {
  info?: { loading?: string; err?: string } | undefined;
  tipErr = true;

  constructor(info: { loading?: string; err?: string } | undefined) {
    this.info = info;
  }

  end(success: boolean, msg?: string) {
    if (this.info?.err) {
      msg = this.info.err;
    }
    if (success) {
      // @ts-ignore
      uni.hideLoading();
    } else {
      if (this.tipErr) {
        // @ts-ignore
        uni.showToast({
          title: msg || '',
          icon: 'error',
          duration: 2000,
        });
      }
    }
  }

  start(info?: { message: string; ext: any } | string) {
    if (this.info?.loading) {
      info = this.info.loading;
    }
    switch (typeof info) {
    case 'string':
      // @ts-ignore
      uni.showLoading({
        title: <string>info,
        mask: true,
      });
      break;
    case 'object':
      // eslint-disable-next-line no-case-declarations
      const { msg } = <{ msg?: string }>info;
      // @ts-ignore
      uni.showLoading({
        title: msg || '',
        mask: true,
      });
      break;
    default:
      // @ts-ignore
      uni.showLoading({
        title: '加载中',
        mask: true,
      });
      break;
    }
  }
}

// eslint-disable-next-line no-undef
export class UNI_HUD implements LoadingActive {
  info?: any
  tipErr = true

  constructor(info?: { message: string; ext: any } | string) {
    this.info = info
  }

  end(success: boolean, msg?: string) {
    if (success) {
      // @ts-ignore
      uni.hideLoading()
    } else {
      if (this.tipErr) {
        // @ts-ignore
        uni.showToast({
          title: msg || '',
          icon: 'error',
          duration: 2000,
        })
      }
    }
  }

  start(info?: { message: string; ext: any } | string) {
    switch (typeof info) {
    case 'string':
      // @ts-ignore
      uni.showLoading({
        title: <string>info,
        mask: true,
      })
      break
    case 'object':
      // eslint-disable-next-line no-case-declarations
      const { message } = <{ message?: string }>info
      // @ts-ignore
      uni.showLoading({
        title: message || '',
        mask: true,
      })
      break
    default:
      // @ts-ignore
      uni.showLoading({
        title: '加载中',
        mask: true,
      })
      break
    }
  }
}

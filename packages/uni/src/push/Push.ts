import { PublishSub } from "@offs/core"
export class PushManager {
  receive: PublishSub<any> = new PublishSub<any>()

  constructor() {
    const ws = this
    // @ts-ignore
    uni.onPushMessage((res) => {
      ws.receive.onNext(res)
    })
  }

  getPushClientId(): Promise<any> {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      uni.getPushClientId({
        success: (res) => {
          resolve(res)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  }

  static push() {

  }
}

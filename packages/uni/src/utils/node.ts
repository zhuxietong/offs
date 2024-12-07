// @ts-ignore

import {getCurrentInstance} from 'vue'


export const OffsNode = {
  get: (selector: string, target?: any | null): Promise<{ width: number, height: number }> => {
    // @ts-ignore
    const {proxy} = getCurrentInstance()
    // @ts-ignore
    return new Promise<{ width: number, height: number }>((resolve, reject) => {
      // @ts-ignore
      uni
        .createSelectorQuery()
        .in(proxy || target)
        .select(selector)
        .boundingClientRect((data) => {
          switch (typeof data) {
          case 'object':
            if (Array.isArray(data)) {
              // @ts-ignore
              resolve(data[0])
            } else {
              // @ts-ignore
              resolve(data)
            }
            break
          default:
            // @ts-ignore
            resolve(data)
            break
          }
        })
        .exec()
    })
  }
}

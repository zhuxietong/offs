// @ts-ignore

import { getCurrentInstance } from 'vue';


export const OffsNode = {
  get: (selector: string, target?: any | null): Promise<{ width: number, height: number,left:number,right:number,top:number,bottom:number }> => {
    // @ts-ignore
    const { proxy } = getCurrentInstance();
    // @ts-ignore
    return new Promise<{ width: number, height: number }>((resolve, reject) => {
      // @ts-ignore
      uni
        .createSelectorQuery()
        .in(proxy || target)
        .select(selector)
        .boundingClientRect((data) => {
          if(!data){
            reject(new Error(`${selector} 节点不存在`))
            return
          }
          switch (typeof data) {
          case 'undefined':
            reject(new Error('节点不存在'));
            break
          case 'object':
            if (Array.isArray(data)) {
              // @ts-ignore
              resolve(data[0]);
            } else {
              // @ts-ignore
              resolve(data);
            }
            break;
          default:
            // @ts-ignore
            resolve(data);
            break;
          }
        })
        .exec();
    });
  },
};

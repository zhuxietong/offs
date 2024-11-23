import { RetryPromise } from './promise';

/**
 * 检测某个场景下时不需要waiting时，返回 next，
 * 如果检测一致需要等待，超过RetryPromise逻辑的规则抛出异常时则返回 failed
 * continueWaiting 因为会不断的检测，在RetryPromise 没返回时会一直被挂起。continueWaiting 返回 cancel
 * @param target 关联的目标对象
 * @param needWaiting 检测函数
 * @param scene 场景
 * @param option 重试配置
 */
export function continueWaiting(
  target: any,
  needWaiting: () => Promise<boolean>,
  scene: string = 'default',
  option?: {
    repeat: number;
    interval: number;
  },
): Promise<'cancel' | 'failed' | 'next'> {
  // @ts-ignore
  const verifyPromiseSet: Record<string, RetryPromise<any>> = target.verifyPromiseSet || {};
  const verifyPromise: RetryPromise<any> | undefined = verifyPromiseSet[scene];
  verifyPromise?.resolve('cancel');

  const newVerifyPromise = new RetryPromise(
    async (resolve, reject) => {
      try {
        const need = await needWaiting();
        if (need) {
          reject('has');
        } else {
          resolve(true);
        }
      } catch (e) {
        resolve(true);
      }
    },
    option || {
      repeat: 10000,
      interval: 1000,
    },
  );

  // @ts-ignore
  verifyPromiseSet[scene] = newVerifyPromise;
  // @ts-ignore
  target.verifyPromiseSet = verifyPromiseSet;

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    try {
      const v = await newVerifyPromise;
      if (v === 'cancel') {
        resolve('cancel');
      } else {
        resolve('next');
      }
    } catch (e) {
      resolve('failed');
    }
  });
}

export const continueWaitingClear = (target: any, scene?: string) => {
  // @ts-ignore
  const verifyPromiseSet: Record<string, RetryPromise<any>> = target.verifyPromiseSet || {};
  if (scene) {
    const verifyPromise: RetryPromise<any> | undefined = verifyPromiseSet[scene];
    verifyPromise?.resolve('cancel');
  } else {
    for (const key in verifyPromiseSet) {
      verifyPromiseSet[key].resolve('cancel');
    }
  }
};

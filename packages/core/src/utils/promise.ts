export class LazyPromise<T> implements Promise<T> {
  id: any;
  private executor: (
    resolve: (value: T | PromiseLike<T>) => void,
    reject: (reason?: any) => void
  ) => void;
  private promise: Promise<T> | null = null;

  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void
    ) => void,
    id?: any
  ) {
    this.executor = executor;
    this.id = id;
  }

  private ensurePromise(): Promise<T> {
    if (!this.promise) {
      this.promise = new Promise<T>(this.executor);
    }
    return this.promise;
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.ensurePromise().then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null
  ): Promise<T | TResult> {
    return this.ensurePromise().catch(onrejected);
  }

  finally(onfinally?: (() => void) | null): Promise<T> {
    return this.ensurePromise().finally(onfinally);
  }

  [Symbol.toStringTag] = 'LazyPromise';
}

export class ExposedPromise<T> implements Promise<T> {
  private _promise: Promise<T>;
  public resolve!: (value: T | PromiseLike<T>) => void;
  public reject!: (reason?: any) => void;

  constructor(
    executor?: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void
    ) => void
  ) {
    this._promise = new Promise<T>((resolve, reject) => {
      // 暴露 resolve 和 reject 方法
      this.resolve = resolve;
      this.reject = reject;

      // 如果提供了执行器函数，调用它
      if (executor) {
        try {
          executor(resolve, reject);
        } catch (error) {
          reject(error);
        }
      }
    });
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2> {
    return this._promise.then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
  ): Promise<T | TResult> {
    return this._promise.catch(onrejected);
  }

  finally(onfinally?: (() => void) | undefined | null): Promise<T> {
    return this._promise.finally(onfinally);
  }

  [Symbol.toStringTag]: string = 'ExposedPromise';
}

export class RetryPromise<T> extends ExposedPromise<T> {
  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void
    ) => void,
    options: { interval: number; repeat: number }
  ) {
    // 包装原始的executor，添加重试逻辑
    const retryExecutor = async (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void
    ) => {
      let lastError: any;

      // 尝试执行repeat次
      for (let attempt = 0; attempt < options.repeat; attempt++) {
        try {
          // 创建一个新的Promise来包装executor
          await new Promise<T>((innerResolve, innerReject) => {
            executor(innerResolve, innerReject);
          }).then(resolve);

          // 如果执行成功，直接返回
          return;
        } catch (error) {
          lastError = error;

          // 如果不是最后一次尝试，则等待interval毫秒
          if (attempt < options.repeat - 1) {
            await new Promise((r) => setTimeout(r, options.interval));
          }
        }
      }

      // 如果所有尝试都失败了，则reject最后一个错误
      reject(lastError);
    };

    super(retryExecutor);
  }
}

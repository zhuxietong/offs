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
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): Promise<TResult1 | TResult2> {
    return this._promise.then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?:
      | ((reason: any) => TResult | PromiseLike<TResult>)
      | undefined
      | null
  ): Promise<T | TResult> {
    return this._promise.catch(onrejected);
  }

  finally(onfinally?: (() => void) | undefined | null): Promise<T> {
    return this._promise.finally(onfinally);
  }

  [Symbol.toStringTag]: string = 'ExposedPromise';
}

export class RetryPromise<T> extends ExposedPromise<T> {
  private isResolved: boolean = false;

  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void
    ) => void,
    options: { interval: number; repeat: number }
  ) {
    // 首先调用 super() 并传入一个空的executor
    // @ts-ignore
    super((resolve, reject) => {});

    // 现在可以安全地使用 this
    const retryWithInterval = async () => {
      let lastError: any;

      for (let attempt = 0; attempt < options.repeat; attempt++) {
        if (this.isResolved) {
          return;
        }

        try {
          await new Promise<T>((innerResolve, innerReject) => {
            executor(innerResolve, innerReject);
          }).then((value) => {
            this.isResolved = true;
            this.resolve(value);
          });
          return;
        } catch (error) {
          lastError = error;

          if (this.isResolved || attempt >= options.repeat - 1) {
            break;
          }

          await new Promise((r) => setTimeout(r, options.interval));
        }
      }

      if (!this.isResolved) {
        this.reject(lastError);
      }
    };

    // 重写原始的resolve方法
    const originalResolve = this.resolve;
    this.resolve = (value: T | PromiseLike<T>) => {
      this.isResolved = true;
      originalResolve(value);
    };

    // 启动重试逻辑
    retryWithInterval();
  }
}


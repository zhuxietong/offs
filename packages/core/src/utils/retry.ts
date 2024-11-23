// 使用函数重载来支持不同的装饰器调用方式
export function Retry(interval: number, attempts: number) {
  // 方法装饰器
  // @ts-ignore
  function methodDecorator(target: any, context: ClassMethodDecoratorContext) {
    return function (this: any, ...args: any[]) {
      return retryWrapper(this, target, interval, attempts, args);
    };
  }

  // 兼容旧版装饰器语法
  // @ts-ignore
  function legacyMethodDecorator(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (this: any, ...args: any[]) {
      return retryWrapper(this, originalMethod, interval, attempts, args);
    };

    return descriptor;
  }

  // 通用重试逻辑
  async function retryWrapper(
    context: any,
    method: any,
    interval: number,
    attempts: number,
    args: any[],
  ) {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        const result = await method.apply(context, args);
        return result;
      } catch (error) {
        lastError = error as Error;
        console.warn(`Attempt ${attempt} failed: ${error}`);

        if (attempt < attempts) {
          await new Promise((resolve) => setTimeout(resolve, interval));
        }
      }
    }

    // 如果所有尝试都失败，则抛出最后一个错误
    if (lastError) {
      throw lastError;
    }
  }

  // 根据参数数量返回不同的装饰器
  return function (this: any, ...args: any[]) {
    if (args.length === 3 && typeof args[2] === 'object') {
      // @ts-ignore
      return legacyMethodDecorator.apply(this, args);
    }
    // @ts-ignore
    return methodDecorator.apply(this, args);
  } as any;
}

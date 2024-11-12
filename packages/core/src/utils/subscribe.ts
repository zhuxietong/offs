/**
 * 生成一个UUID（通用唯一标识符）。
 * @returns {string} UUID字符串。
 */
function uuid() {
  const hexDigits = '0123456789abcdef'
  const s = Array.from({ length: 36 }, (_, i) =>
    i === 14
      ? '4'
      : i === 19
        ? hexDigits.substring(
          ((Math.random() * 0x10) & 0x3) | 0x8,
          ((Math.random() * 0x10) & 0x3) | (0x8 + 1)
        )
        : hexDigits.substring(
          Math.floor(Math.random() * 0x10),
          Math.floor(Math.random() * 0x10) + 1
        )
  )
  s[8] = s[13] = s[18] = s[23] = '-'
  return s.join('')
}

/**
 * 表示一个DisposeBag类。
 * @class
 */
export class DisposeBag {
  observers: DisposableObject<any>[] = []
  private _valid: boolean = true
  disposedBlock: (bag: DisposeBag) => void = () => {
  }

  /**
   * 释放所有观察者并将包标记为无效。
   */
  dispose() {
    this._valid = false
    this.observers.forEach((observer) => observer.dispose())
  }

  /**
   * 将包标记为有效。
   */
  open() {
    this._valid = true
  }

  /**
   * 检查包是否有效。
   * @returns {boolean} 如果包有效则返回true，否则返回false。
   */
  get valid(): boolean {
    return this._valid
  }
}

/**
 * 表示一个BagWrap类。
 * @class
 */
class BagWrap {
  bag?: DisposeBag
  id: string = uuid()
}

/**
 * 订阅块的类型定义。
 * @callback SubscribeBlock
 * @param {T} _ - 要处理的值。
 * @template T
 */
export type SubscribeBlock<T> = (_: T) => void;

/**
 * 表示一个PublishSub类。
 * @class
 * @template T
 */
export default class PublishSub<T> {
  bags: BagWrap[] = []
  rawValue?: T
  dispatchHook: (value: T) => void = () => {
  }
  private tempDisposableObject?: DisposableObject<T>

  constructor(value?: T) {
    this.rawValue = value
  }

  /**
   * 向订阅添加过滤器。
   * @param {function(T): boolean} check - 过滤函数。
   * @returns {this} 当前实例以便链式调用。
   */
  public filter(check: (val: T) => boolean): this {
    const disposeObject = this.tempDisposableObject || new DisposableObject<T>()
    disposeObject.filterBlock = check
    this.tempDisposableObject = disposeObject
    return this
  }

  /**
   * 使用回调订阅PublishSub。
   * @param {SubscribeBlock<T>} onNext - 在新值时执行的回调。
   * @returns {DisposableObject<T>} 订阅的可释放对象。
   */
  public subscribe(onNext: SubscribeBlock<T>): DisposableObject<T> {
    const ob = this.tempDisposableObject || new DisposableObject<T>()
    ob.block = onNext
    const bag = new BagWrap()
    ob.ID = bag.id
    ob.didSetBag = (bg) => {
      bg?.open()
      bag.bag = bg
      if (bg) {
        bg.observers.push(ob)
      } else {
        this.bags = this.bags.filter((e) => e.id !== bag.id)
      }
    }
    this.bags.push(bag)
    this.tempDisposableObject = undefined
    return ob
  }

  get value(): T {
    return this.rawValue as T
  }

  set value(val: T) {
    this.onNext(val)
  }

  /**
   * 向所有订阅者发布新值。
   * @param {T} value - 新值。
   * @returns {this} 当前实例以便链式调用。
   */
  public onNext(value: T): this {
    this.rawValue = value
    this.dispatchHook(value)
    this.bags
      .filter((e) => e.bag?.valid)
      .forEach((item) => {
        item.bag?.observers
          .filter((observer) => observer.ID === item.id)
          .forEach((observer) => {
            if (!observer.filterBlock || observer.filterBlock(value)) {
              observer.block(value)
            }
          })
      })
    return this
  }

  disposeHook: () => void = () => {
  }

  /**
   * 释放PublishSub。
   */
  dispose = () => {
    this.bags = []
    this.disposeHook()
  }
}

/**
 * 表示一个DisposableObject类。
 * @class
 * @template T
 */
export class DisposableObject<T> {
  filterBlock?: (val: T) => boolean
  block: (type: T) => void = () => {
  }
  ID: string = ''
  didSetBag: (bag?: DisposeBag, obj?: this) => void = () => {
  }
  bag?: DisposeBag
  private _valid: boolean = true

  /**
   * 设置对象的DisposeBag。
   * @param {DisposeBag} [bag] - DisposeBag实例。
   */
  setBag(bag?: DisposeBag) {
    this.didSetBag(bag, this)
    this.bag = bag
  }

  /**
   * 检查对象是否有效。
   * @returns {boolean} 如果对象有效则返回true，否则返回false。
   */
  get valid(): boolean {
    return this._valid
  }

  /**
   * 将对象与DisposeBag关联。
   * @param {DisposeBag} by - DisposeBag实例。
   * @returns {this} 当前实例以便链式调用。
   */
  public disposedBy(by: DisposeBag): this {
    this._valid = true
    this.setBag(by)
    return this
  }

  /**
   * 释放对象并将其与任何DisposeBag解除关联。
   * @returns {this} 当前实例以便链式调用。
   */
  public dispose() {
    this._valid = false
    this.setBag(undefined)
    return this
  }
}

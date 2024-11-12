export default class Queue<T> {
  private items: T[] = [];

  // 向队列尾部添加一个元素
  set value(item: T) {
    this.items.push(item);
  }

  // 从队列头部获取并移除一个元素
  get value(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items.shift();
  }

  // 检查队列是否为空
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  // 获取队列的长度
  size(): number {
    return this.items.length;
  }

  // 查看队列头部元素但不移除
  peek(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[0];
  }

  // 清空队列
  clear(): void {
    this.items = [];
  }
}

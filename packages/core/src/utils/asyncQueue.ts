export type AsyncTask<T> = () => Promise<T>;

export class AsyncQueue<T> {
  private queue: AsyncTask<T>[] = [];
  private running: boolean = false;
  private concurrency: number;

  constructor(concurrency: number = 1) {
    this.concurrency = concurrency;
  }

  // 添加任务到队列
  add(task: AsyncTask<any>): void {
    this.queue.push(task);
    this.run();
  }

  // 获取队列长度
  get length(): number {
    return this.queue.length;
  }

  // 清空队列
  clear(): void {
    this.queue = [];
  }

  // 执行队列中的任务
  private async run(): Promise<void> {
    if (this.running) {
      return;
    }

    this.running = true;

    while (this.queue.length > 0) {
      const tasks = this.queue.splice(0, this.concurrency).map((task) => this.executeTask(task));

      await Promise.all(tasks);
    }

    this.running = false;
  }

  // 执行单个任务
  private async executeTask(task: AsyncTask<T>): Promise<void> {
    try {
      await task();
    } catch (error) {
      console.error('Task execution failed:', error);
    }
  }
}

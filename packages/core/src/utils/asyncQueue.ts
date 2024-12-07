export type AsyncTask<T> = () => Promise<T>

export class AsyncQueue<T> {
  private queue: AsyncTask<T>[] = []
  private running: boolean = false
  private concurrency: number

  constructor(concurrency: number = 1) {
    this.concurrency = concurrency
  }

  // 添加任务到队列
  add(task: AsyncTask<any>): void {
    this.queue.push(task)
    this.run().then(() => {})
  }

  // 获取队列长度
  get length(): number {
    return this.queue.length
  }

  // 清空队列
  clear(): void {
    this.queue = []
  }

  // 执行队列中的任务
  private async run(): Promise<void> {
    if (this.running) {
      return
    }

    this.running = true

    while (this.queue.length > 0) {
      const tasks = this.queue.splice(0, this.concurrency).map((task) => this.executeTask(task))

      await Promise.all(tasks)
    }

    this.running = false
  }

  // 执行单个任务
  private async executeTask(task: AsyncTask<T>): Promise<void> {
    try {
      await task()
    } catch (error) {
      console.error('Task execution failed:', error)
    }
  }
}

export function queueMap<T, C>(inputs: T[], block: (input: T) => Promise<C>): Promise<C[]> {
  let list = inputs
  let n = list.length
  let result: { index: number; result: C }[] = []
  return new Promise((resolve, reject) => {
    if (list.length < 1) {
      resolve([])
      return
    }
    let status = 0
    const check = (resp: { ok: boolean; index: number; result?: C; error?: string }) => {
      if (status !== 0) {
        return
      }
      if (!resp.ok) {
        status = -1
        reject(resp.error)
      }
      if (resp.ok) {
        n = n - 1
        // @ts-ignore
        result.push({ index: resp.index, result: resp.result })
      }
      if (n < 1) {
        status = 1
        let list = result.sort(
          (a: { index: number; result: C }, b: { index: number; result: C }) => {
            return a.index - b.index
          },
        )
        resolve(
          list.map((e) => {
            return e.result
          }),
        )
      }
    }
    let index = 0
    let arr = list.map((one) => {
      let i = index
      index = index + 1
      return { num: i, input: one }
    })
    for (const { num, input } of arr) {
      let promise = block(input)
      promise
        .then((one) => {
          check({ index: num, result: one, ok: true })
        })
        .catch((err) => {
          check({ index: num, result: undefined, ok: false })
        })
    }
  })
}

// let demo = await asyncQueue([4,1,2],(input)=>{
//     return new Promise<string>((resolve, reject) => {
//         setTimeout(()=>{
//             resolve(input * 100 + '')
//         },input * 1000)
//     })
// })

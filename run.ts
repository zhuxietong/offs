import * as console from "node:console";

/**
 * @description 按权重概率返回一个对象的key值
 * 该方法传入一个Record<string,number> 对象。对象所有值相加为 n，没项值v/n 作为概率返回key值
 */
export function randomKey<T extends string>(obj: Record<T, number>): T {
  const total = Object.values(obj).reduce((a, b) => a + b, 0)
  const random = Math.random() * total
  let sum = 0
  for (const key in obj) {
    sum += obj[key]
    if (random <= sum) {
      return key
    }
  }
  return Object.keys(obj)[0] as T
}

console.log(randomKey({ a: 20, b:20})) // c
/**
 * 检查给定的参数是否是对象。
 *
 * @param obj - 要检查的值。
 * @returns 如果值是对象则返回 true，否则返回 false。
 */
function isObject(obj: any): obj is Record<string, any> {
  return obj !== null && typeof obj === 'object'
}

/**
 * 深度合并多个源对象到一个结果对象中。
 *
 * @param sources - 要合并的源对象。
 * @returns 一个新的对象，是所有源对象深度合并的结果。
 */
export function deepMerge(...sources: { [k: string]: any }[]): { [k: string]: any } {
  const result: any = {}

  sources.forEach((source) => {
    if (!isObject(source)) return

    Object.keys(source).forEach((key) => {
      const sourceValue = source[key]
      const targetValue = result[key]

      if (isObject(targetValue) && isObject(sourceValue)) {
        result[key] = deepMerge(targetValue, sourceValue)
      } else if (isObject(sourceValue)) {
        result[key] = deepMerge({}, sourceValue)
      } else {
        result[key] = sourceValue
      }
    })
  })

  return result
}
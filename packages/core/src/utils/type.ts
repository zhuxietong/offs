export enum Type {
  list = 'list', // 列表类型
  dict = 'dict', // 字典类型
  number = 'number', // 数字类型
  string = 'string', // 字符串类型
  bool = 'bool', // 布尔类型
  undefined = 'undefined', // 未定义类型
  null = 'null', // 空类型
  func = 'func', // 函数类型
  reg = 'reg', // 正则表达式类型
}

/**
 * 检查值是否为正则表达式
 * @param value - 要检查的值
 * @returns {boolean} 如果值是正则表达式则返回true，否则返回false
 */
function isRegExp(value: any) {
  return Object.prototype.toString.call(value) === '[object RegExp]'
}

/**
 * 获取实例的类型
 * @param instance - 要检查的实例
 * @returns {Type} 实例的类型
 */
export function type(instance: any) {
  if (instance === null) return Type.null
  if (instance === undefined) return Type.undefined
  if (typeof instance === 'function') return Type.func
  if (isRegExp(instance)) return Type.reg
  if (Array.isArray(instance)) return Type.list

  switch (typeof instance) {
  case 'string':
    return Type.string
  case 'number':
    return Type.number
  case 'boolean':
    return Type.bool
  case 'object':
    return Type.dict
  default:
    return Type.dict
  }
}

type NodePath = any[] | string

/**
 * 获取对象中指定路径的值
 * @param obj - 要查询的对象
 * @param node - 路径，可以是数组或字符串
 * @returns {any} 指定路径的值
 */
export const getValue = (obj: any, node?: NodePath | undefined) => {
  if (!node) return obj

  const nodes = typeof node === 'string' ? node.split('.') : node
  if (typeof obj === 'undefined') return undefined

  let value = obj
  for (const key of nodes) {
    value = value?.[key]
    if (typeof value === 'undefined') return undefined
  }
  return value
}

export type AllType =
  | 'string'
  | 'object'
  | 'number'
  | 'list'
  | 'dict'
  | 'func'
  | 'reg'
  | 'bigint'
  | 'boolean'
  | 'function'
  | 'symbol'
  | 'undefined'
  | 'null'
export const $type = (value: any): AllType => {
  const t = typeof value
  if (t === 'object' && Array.isArray(value)) {
    return 'list'
  }
  return t
}

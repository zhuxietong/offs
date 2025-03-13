/**
 * 判断一个值是否为空
 * @param value 需要判断的值
 * @returns boolean - true表示为空，false表示非空
 */
export const isEmpty = (value: unknown): boolean => {
  // 判断 null 或 undefined
  if (value === null || value === undefined) {
    return true;
  }

  // 判断字符串
  if (typeof value === 'string') {
    return value.trim().length === 0;
  }

  // 判断数组
  if (Array.isArray(value)) {
    return value.length === 0;
  }

  // 判断对象
  if (value instanceof Object && !(value instanceof Date)) {
    return Object.keys(value).length === 0;
  }

  // 判断数字 - 可选，看具体需求是否需要将 0 视为空
  if (typeof value === 'number') {
    return false; // 或者 return value === 0;
  }

  // 判断布尔值
  if (typeof value === 'boolean') {
    return false; // 布尔值一般不视为空
  }

  return false;
};

// // 使用示例：
// const examples = [
//   isEmpty(null),              // true
//   isEmpty(undefined),         // true
//   isEmpty(''),               // true
//   isEmpty('  '),            // true
//   isEmpty([]),              // true
//   isEmpty({}),              // true
//   isEmpty(0),               // false
//   isEmpty(false),           // false
//   isEmpty(new Date()),      // false
//   isEmpty('hello'),         // false
//   isEmpty([1, 2, 3]),      // false
//   isEmpty({ name: 'test' }) // false
// ];
//
// console.log(examples)

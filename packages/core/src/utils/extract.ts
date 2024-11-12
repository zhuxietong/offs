/**
 * @description $ $
 * @author zxt
 * @date: 2024/8/7
 * @copyright
 */

/**
 * @description 提取对象中的值
 * 提取规则是一个字符串，提取字段项通过,分隔
 * 规则示例1："a=b|d|o('age'),c",提取b字段为a或d或o字段的值，优先级按b > d > o，c是 c=c的简写,如果规则项的尾部包含()包裹表示具有默认值，即a值提取为空时a='age'
 * 规则示例2："[a]=b|d|o,c" 中提取的a字段以[]包裹表示如果提取的a值如果是一个对象的数组，需要对数组项的对象进行递归提取，如果a字段的提取值为对象需要对该对象进行递归提取
 * @param {{[k:string]:any}} obj - 要提取的对象
 * @param {string} rule - 提取规则字符串
 * @returns {{[k:string]:any}} 提取后的对象
 */
export function extractValues(obj?: { [k: string]: any }, rule?: string): { [k: string]: any } | undefined {

  if (!rule) {
    return obj;
  }
  const result: { [k: string]: any } = {};

  const ruleItems = rule.split(',');

  for (const item of ruleItems) {
    let [target, sources] = item.split('=');
    let isRecursive = false;

    // 检查是否需要递归提取
    if (target.startsWith('<') && target.endsWith('>')) {
      target = target.slice(1, -1);
      isRecursive = true;
    }

    // 如果没有指定源，则源与目标相同
    if (!sources) {
      sources = target;
    }

    const sourceFields = sources.split('|');
    let value: any;
    let defaultValue: string | number | undefined;

    for (const field of sourceFields) {
      const match = field.match(/^(\w+)(?:\((['"]?)([^'"]*)\2\))?$/);
      if (match) {
        const [, fieldName, , fieldDefaultValue] = match;
        if (obj) {
          value = obj[fieldName];
        }
        if (value !== undefined) {
          break;
        }
        if (fieldDefaultValue !== undefined) {
          defaultValue = isNaN(Number(fieldDefaultValue)) ? fieldDefaultValue : Number(fieldDefaultValue);
        }
      }
    }

    // 如果没有找到值，使用默认值
    if (value === undefined && defaultValue !== undefined) {
      value = defaultValue;
    }

    // 递归提取
    if (isRecursive && value !== undefined) {
      if (Array.isArray(value)) {
        value = value.map(item => {
          if (typeof item === 'object' && item !== null) {
            return extractValues(item, rule);
          }
          return item;
        });
      } else if (typeof value === 'object' && value !== null) {
        value = extractValues(value, rule);
      }
    }

    if (value !== undefined) {
      // 使用不带默认值的字段名作为结果的键
      const resultKey = target.split('(')[0];
      result[resultKey] = value;
    }
  }

  return result;
}

// // 示例用法
// const obj = {
//   b: 1,
//   d: 2,
//   o: { age: 30 },
//   c: 3,
//   list: [{ b: 10 }, { b: 20 }],
//   page: 5
// };
//
// console.log(extractValues(obj, "a=b|d|o('age'),<list>,row('page')"));
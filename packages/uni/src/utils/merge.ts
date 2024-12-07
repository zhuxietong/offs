export function DeepAssign(target, ...source: any[]) {
  function noRepeat(arr) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        //如果相等
        if (arr[i] == arr[j]) {
          arr.splice(j, 1);
          j--;
        }
      }
    }
    return arr;
  }

  if (target === undefined) {
    target = {};
  }
  let keys: any[] = Object.keys(target);
  for (const obj of source) {
    keys = keys.concat(Object.keys(obj));
  }
  noRepeat(keys);
  for (const key of keys) {
    let value = target[key];
    const values: any[] = [];
    if (`${typeof value}` == 'object') {
      values.push(value);
    }
    let hasObject = false;
    for (const obj of source) {
      const source_value = obj[key];
      if (typeof source_value === 'object') {
        values.push(source_value);
      }
      if (source_value !== undefined) {
        value = source_value;
      }
    }

    if (values.length > 0) {
      hasObject = true;
    }
    if (hasObject) {
      let first = values[0];
      if (values.length > 1) {
        values.slice(0, 1);
        for (const one of values) {
          first = DeepAssign(first, one);
        }
        target[key] = first;
      } else {
        target[key] = first;
      }
    } else {
      target[key] = value;
    }
  }
  return target;
}

/**
 * 根据对象的节点属性字符串获取值
 */
export function getPropertyByString(obj: any, propString: string): any {
  const propArray = propString.split('.');
  let result = obj;
  for (const prop of propArray) {
    if (result && typeof result === 'object' && prop in result) {
      result = result[prop];
    } else {
      return undefined;
    }
  }
  return result;
}

// 根据优先级获取对象属性的方法
export function getPropertyByPriority(obj: any, propStrings: string[]): any {
  // 遍历优先级数组中的每个属性名字符串
  for (const propString of propStrings) {
    // 调用 getPropertyByString 方法获取属性值
    const value = getPropertyByString(obj, propString);
    // 如果属性值不为空，则返回该值
    if (value !== null && value !== undefined) {
      return value;
    }
  }
  // 如果所有属性值都为空，则返回 null
  return null;
}

export type VariableType =
  | 'array'
  | 'object'
  | 'boolean'
  | 'string'
  | 'number'
  | 'function'
  | 'undefined'
  | 'null'
  | 'symbol'
  | 'unknown';

/**
 * 判断变量的类型。
 * @param variable - 要检查类型的变量。
 * @returns - 返回字符串，表示变量的类型。
 */
export function checkVariableType(variable: any): VariableType {
  const type = typeof variable;
  switch (type) {
  case 'boolean':
  case 'string':
  case 'number':
  case 'function':
  case 'undefined':
    return type;
  case 'object':
    return variable === null ? 'null' : Array.isArray(variable) ? 'array' : 'object';
  default:
    return 'unknown';
  }
}

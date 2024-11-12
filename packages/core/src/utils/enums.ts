/**
 * @description 提供枚举类型的工具函数，用于处理枚举项的集合和访问
 * @template K 枚举项的键类型，必须是字符串
 * @template T 枚举项的类型，必须包含键和值
 * @author ztx
 * @date: 2024/8/6
 * @copyright: 2024, All rights reserved
 */

type ItemType<K extends string> = {
  value: K; // 枚举项的键
  label: string; // 枚举项的标签
};

export type EnumObject<K extends string, T extends ItemType<K>> = {
  get: (key: T['value']) => T | undefined;
  set: Record<K, T>;
  arr: T[];
  one: (key: T['value']) => T;
};
/**
 * 创建一个枚举工具函数
 * @template K 枚举项的键类型，必须是字符串
 * @template T 枚举项的类型，必须包含键和值
 * @param {T[]} items - 枚举项的数组
 * @returns {{ get: (key: T['value']) => T | undefined, set: Record<K, T>, arr: T[], one: (key: T['value']) => T }} 枚举工具函数
 */
const useEnums = <K extends string, T extends ItemType<K>>(items: T[]) => {
  // 将枚举项数组转换为键值对对象
  const set = items.reduce(
    (acc, item) => {
      acc[item.value] = item;
      return acc;
    },
    {} as Record<K, T>,
  );

  /**
   * 根据键获取枚举项
   * @param {T['value']} key - 枚举项的键
   * @returns {T | undefined} 枚举项，如果不存在则返回 undefined
   */
  const get = (key: T['value']): T | undefined => set[key];

  /**
   * 根据键获取枚举项，如果不存在则返回第一个枚举项
   * @param {T['value']} key - 枚举项的键
   * @returns {T} 枚举项，如果不存在则返回第一个枚举项
   */
  const one = (key: T['value']): T => set[key] || items[0];

  return { get, set, arr: items, one } as EnumObject<K, T>;
};
export default useEnums;

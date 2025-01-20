import { type Ref, ref, watch, onUnmounted, getCurrentInstance } from 'vue'

// 定义支持的存储值类型
type StorageValueType = string | number | boolean | object | Array<any> | undefined

// 存储全局的 ref 映射
const refMap = new Map<string, Ref<StorageValueType>>()

// 存储订阅关系: key -> Map<组件ID, callback>
const eventBus = new Map<string, Map<string, (value: StorageValueType) => void>>()

/**
 * 序列化数据
 */
const serialize = (value: StorageValueType): string | null => {
  if (value === undefined) return null
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return String(value)
  return JSON.stringify(value)
}

/**
 * 反序列化数据
 */
const deserialize = (value: string, type: string): StorageValueType => {
  if (type === 'string') return value
  if (type === 'number') return Number(value)
  if (type === 'boolean') return value === 'true'
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

/**
 * 触发更新
 */
const notifySubscribers = (key: string, value: StorageValueType, excludeId?: string) => {
  const subscribers = eventBus.get(key)
  if (subscribers) {
    subscribers.forEach((callback, id) => {
      // 排除触发更新的组件自身
      if (id !== excludeId) {
        callback(value)
      }
    })
  }
}

/**
 * 清理特定组件的存储监听
 */
const clearComponentStorage = (key: string, componentId: string) => {
  const subscribers = eventBus.get(key)
  if (subscribers) {
    // 只移除特定组件的监听器
    subscribers.delete(componentId)

    // 如果没有任何监听器了，则清理这个 key 的所有资源
    if (subscribers.size === 0) {
      eventBus.delete(key)
      refMap.delete(key)
    }
  }
}

export function useStorage<K extends string, T extends StorageValueType>(
  key: K,
  initialValue: T
): Ref<T> {
  // 获取当前组件实例
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error('useStorage 必须在组件中使用')
  }
  const componentId = instance.uid.toString()
  console.warn('-------------componentId:', componentId)

  // 获取或创建 ref
  let storedValue: Ref<T>
  if (refMap.has(key)) {
    storedValue = refMap.get(key) as Ref<T>
  } else {
    // 获取初始值的类型
    const valueType = typeof initialValue

    // 获取存储的值
    let storageValue: T
    try {
      const item = uni.getStorageSync(key)
      storageValue = item ? deserialize(item, valueType) as T : initialValue
    } catch (error) {
      console.error('从 Storage 读取数据失败:', error)
      storageValue = initialValue
    }

    // 创建响应式数据
    storedValue = ref<T>(storageValue) as Ref<T>
    refMap.set(key, storedValue)
  }

  // 确保 key 的订阅者 Map 存在
  if (!eventBus.has(key)) {
    eventBus.set(key, new Map())
  }

  // 添加值变化的监听器
  const updateValue = (newValue: StorageValueType) => {
    if (storedValue.value !== newValue) {
      storedValue.value = newValue as T
    }
  }

  // 为当前组件添加监听器
  const subscribers = eventBus.get(key)!
  subscribers.set(componentId, updateValue)

  // 监听数据变化自动存储或删除
  watch(
    storedValue,
    (newValue) => {
      try {
        if (newValue === undefined) {
          uni.removeStorageSync(key)
        } else {
          const serializedValue = serialize(newValue)
          if (serializedValue !== null) {
            uni.setStorageSync(key, serializedValue)
          }
        }
        // 通知其他订阅者（排除自身）
        notifySubscribers(key, newValue, componentId)
      } catch (error) {
        console.error('操作 Storage 失败:', error)
      }
    },
    { deep: true }
  )

  // 在组件卸载时自动清理当前组件的监听器
  onUnmounted(() => {
    clearComponentStorage(key, componentId)
  })

  return storedValue
}

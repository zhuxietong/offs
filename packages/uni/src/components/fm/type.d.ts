import { LazyPromise } from '@offs/core'
import { ComputedRef, CSSProperties } from 'vue'

export namespace MeForm {
  /**
   * 表示表单字段值值的类型
   */
  type Value = number | string | boolean | object | undefined | null
  /**
   * 定义表单中标签的位置。
   * - 'top': 标签位于输入字段上方。
   * - 'left': 标签位于输入字段左侧。
   */
  type LabelPosition = 'top' | 'left'
  /**
   * 定义表单中值的位置。
   * - 'left': 值位于左侧。
   * - 'right': 值位于右侧。
   */
  type ValuePosition = 'left' | 'right'

  type ErrorTip = 'toast' | 'error-mark'

  /**
   * 定义表单检查的触发器。
   * - 'submit': 表单提交时触发检查。
   * - 'valueChange': 值变化时触发检查。
   */
  type FormCheckTrigger = 'submit' | 'change' | 'blur'

  /**
   * 表单检查的状态。
   * - 'success': 检查成功。
   * - 'error': 检查出错。
   * - 'empty': 检查结果为空。
   */
  type CheckStatus = 'success' | 'error' | 'empty'

  /**
   * 表单检查的结果。
   * - 'success': 检查成功。
   * - 'error': 检查出错。
   * - 'warning': 检查警告。
   * - true: 检查成功（布尔值）。
   * - false: 检查出错（布尔值）。
   * - void: 无结果。
   */
  type CheckResult = 'success' | 'error' | 'warning' | true | false | void

  /**
   * 表单检查函数类型。
   * @param _value - 要检查的值。
   * @returns 检查结果或解析为结果的 LazyPromise。
   */
  type CheckFunc = (
    _value: any,
  ) => CheckResult | LazyPromise<{ result: CheckResult; message: string } | boolean>

  /**
   * 表示检查器，可以是函数、正则表达式、字符串或带有最小/最大值的对象。
   */
  type Checker =
    | CheckFunc
    | RegExp
    | string
    | { min: number; message?: string }
    | { max: number; message?: string }
    | { reg: string | RegExp; message?: string }

  /**
   * 值转换函数类型。
   * @param value - 要转换的值。
   * @returns 转换后的值或解析为转换值的 LazyPromise。
   */
  type ValueTransformFunc = (value: any) =>
    | CheckResult
    | LazyPromise<
        | {
            result: CheckResult
            message: string
          }
        | boolean
      >

  /**
   * 表单错误
   */
  export interface ValidErrorType extends Error {
    errors: Array<{
      name: string
      error: Error
    }>
  }

  /**
   * 输入事件处理函数类型。
   * @param value - 输入值。
   * @param trigger - 表单检查的触发器。
   * @returns 检查结果或解析为结果的 LazyPromise。
   */
  export type OnInput = (value: any) => Value | LazyPromise<Value>

  /**
   * 表示表单属性的接口。
   */
  export interface FromProps {
    labelPosition: LabelPosition
    itemStyle?: CSSProperties
    labelStyle?: CSSProperties
    valueStyle?: CSSProperties
    placeholderStyle?: CSSProperties
    valuePosition: ValuePosition
    formCheckTriggers: FormCheckTrigger[]
  }

  /**
   * 表示表单实例的接口。
   * @template T - 表单值的类型。
   */
  export interface From<T extends { [k: string]: any }> {
    props: FromProps
    onChange: (name: string, value: any, values: T) => void

    valid(): Promise<{ [k: string]: CheckResult }>
  }

  /**
   * 表示表单项属性的接口。
   */
  export type ItemProps = {
    /**
     * 标签位置
     */
    labelPosition?: LabelPosition
    /**
     * 表单项基础样式
     */
    itemStyle?: CSSProperties
    /**
     * 标签的样式。
     */
    labelStyle?: CSSProperties
    /**
     * 值的样式。
     */
    valueStyle?: CSSProperties
    /**
     * 值的位置。
     */
    valuePosition?: ValuePosition
    /**
     * 检查器。
     */
    checker?: Checker | Checker[]
    /**
     * 是否隐藏。
     */
    hidden?: boolean
    /**
     * 是否显示必填指示器。
     */
    indicator?: boolean
    /**
     * 是否显示必填标记。
     */
    showRequiredMark?: boolean
    tag?: string
    /**
     * 是否是最后一项。
     */
    lasted?: boolean
    /**
     * 是否显示分割线。
     */
    noLine?: boolean
  }

  /**
   * 表示表单字段属性的接口。
   */
  export type FieldProps = {
    name: string
    label?: string
    placeholder?: string
    required?: boolean
    /**
     * 占位符的样式。
     */
    placeholderStyle?: CSSProperties
    formCheckTriggers?: FormCheckTrigger[]
    transform?: ValueTransformFunc | 'number' | 'string' | 'boolean'
    submitTransform?: ValueTransformFunc | 'number' | 'string' | 'boolean'
    mergeData?: (value: any) => LazyPromise<{ [k: string]: any }>
    modelValue: any
  }

  /**
   * 表示表单字段的完整属性类型，包括项属性。
   */
  export type FullFieldProps = FieldProps & ItemProps

  export type Field = {
    props: FullFieldProps
    value: ComputedRef<any>
    hidden: boolean
    mergeData: (option?:{tip?:ErrorTip}) => LazyPromise<{ [k: string]: any }>
  }
}

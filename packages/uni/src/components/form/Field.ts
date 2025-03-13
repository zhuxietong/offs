// @ts-ignore
import { PublishSub, DisposeBag } from '@offs/core'
import { queueMap } from '@offs/core'

type AllType =
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
const $type = (value: any): AllType => {
  const t = typeof value
  if (t === 'object' && Array.isArray(value)) {
    return 'list'
  }
  return t
}

export class DebugBool {
  value: boolean
  name: string
  debug: boolean = false

  constructor(ok: boolean, name: string) {
    this.value = ok
    this.name = name
  }

  get ok(): boolean {
    return this.value
  }

  set ok(val) {
    if (this.debug) {
      debugger
    }
    this.value = val
  }

  update(ok: boolean) {
    if (this.debug) {
      debugger
    }
    this.value = ok
    return ok
  }
}

const regs = {
  company: /^([\u4e00-\u9fa5]+)?([\(\（])?[\u4e00-\u9fa5]+([\）\)])?([\u4e00-\u9fa5]+)?$/,
  nickname: /[\u4e00-\u9fa5]*[a-z]*[A-Z]*\d*-*_*\s*/,
  email: /^([a-zA-Z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
  username: /^([\u4e00-\u9fa5]{1,20}|[a-zA-Z\.\s]{1,20})$/,
  mobile: /^[1][3,4,5,7,8,9][0-9]{9}$/,
  desc: /^\.{4,}$/,
}

export interface NumberLimit {
  min: number
  max: number
  minTip: string
  maxTip: string
}

export type BaseFieldProps = {
  modelValue: any
  holderStyle?: CSSStyleDeclaration
  valueStyle?: CSSStyleDeclaration
  check?: Checker
  name: string
  label: string
  placeholder?: string
  textAlign?: 'left' | 'right' | 'center'
}

type CheckerFunc = (value: any) => boolean
export type Checker =
  | string
  | RegExp
  | NumberLimit
  | CheckerFunc
  | '[company]'
  | '[email]'
  | '[username]'
  | '[mobile]'
  | '[desc]'
  | ''

export interface CheckResult {
  value?: any
  message: string
  ok: boolean
}

export enum CheckTrigger {
  change = 'change',
  preCheck = 'preCheck',
  focus = 'focus',
  blur = 'blur',
  submit = 'submit',
}

export enum Interact {
  input = 'input',
  select = 'select',
  setting = 'setting',
}

function interactName(interact: Interact) {
  switch (interact) {
    case Interact.input:
      return '输入'
    case Interact.select:
      return '选择'
    case Interact.setting:
      return '设置'
    default:
      return '输入'
  }
}

export interface FieldProps {
  name: string
  label: string
  check: Checker
  required: boolean
  placeholder: string
  checkTrigger: CheckTrigger[]
  interact: Interact
  disabled: boolean
  valueGen: ValueGen
}

export interface FieldInit {
  name: string
  label: string
  required?: boolean
  placeholder?: string | undefined
  checkTrigger?: CheckTrigger[]
  interact?: Interact
  check?: Checker
  blankTip?: string
  errorTip?: string
  disabled?: boolean
  valueGen?: ValueGen
  debug?: boolean
  transform?: (val: any) => { [k: string]: any }
}

export interface FieldSetting {
  name?: string
  label?: string
  valueType?: any
  required?: boolean
  placeholder?: string
  checkTrigger?: CheckTrigger[]
  interact?: Interact
  check?: Checker
  blankTip?: string
  errorTip?: string
  disabled?: boolean
}

export type ValueGen = (rawValue: any) => any
export type UpdateTip = (result: CheckResult | undefined) => any

export class LazyPromise<T> implements PromiseLike<T> {
  private promise: Promise<T> | null = null

  constructor(executor: () => Promise<T>) {
    // @ts-ignore
    this.LazyPromise = true
    // 初始化 then 方法
    this.then = (onfulfilled, onrejected) => {
      if (!this.promise) {
        this.promise = executor()
      }
      return this.promise.then(onfulfilled, onrejected)
    }

    // 初始化 catch 方法
    this.catch = (onrejected) => {
      if (!this.promise) {
        this.promise = executor()
      }
      return this.promise.catch(onrejected)
    }

    // 初始化 finally 方法
    this.finally = (onfinally) => {
      if (!this.promise) {
        this.promise = executor()
      }
      return this.promise.finally(onfinally)
    }
  }

  public then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    // Placeholder, will be overwritten in constructor
    return this.promise!.then(onfulfilled, onrejected)
  }

  public catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
  ): Promise<T | TResult> {
    // Placeholder, will be overwritten in constructor
    return this.promise!.catch(onrejected)
  }

  public finally(onfinally?: (() => void) | null): Promise<T> {
    // Placeholder, will be overwritten in constructor
    return this.promise!.finally(onfinally)
  }
}

// // 创建 LazyPromise 实例
// const lazyPromise = new LazyPromise<string>(() => {
//   console.log('Executor called');
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve('Hello, World!');
//     }, 2000);
//   });
// });

export class Field implements FieldProps {
  name = ''
  label = ''
  check: Checker = ''
  required = true
  placeholder = ''
  checkTrigger = [CheckTrigger.change]
  interact = Interact.input
  blankTip?: boolean | string
  errorTip?: boolean | string
  debug: boolean = false
  bag: DisposeBag = new DisposeBag()
  transform?: (val: any) => { [k: string]: any }
  private _value?: any
  get value() {
    return this._value
  }

  set value(val) {
    this._value = val
    // console.log("DD=====lll====",this._value)
    this.$value.onNext(val)
  }

  private _preField?: Field
  set preField(val: Field | undefined) {
    if (this._preField !== undefined) {
      val?.$value
        .subscribe((_e: any) => {
          this.value = {}
        })
        .disposedBy(this.bag)
    }
    this._preField = val
  }

  get preField(): Field | undefined {
    return this._preField
  }

  valueGen: ValueGen = (val) => {
    return val
  }
  disabled: boolean = false
  tipEle?: any
  tureSubmitValue?: any
  updateTip: UpdateTip = (_result: CheckResult | undefined) => {} //提交时触发该方法
  $value: PublishSub<any>

  update(result: any) {
    this.updateTip(result)
  }

  preFieldValue(tip: boolean = true): any {
    if (!this.preField) {
      return undefined
    }
    const field = this.preField
    const r = field.doCheck(CheckTrigger.preCheck)
    if (r) {
      if (r?.ok === false) {
        r.message = r.message.replace(/^请/, '请先')
        if (tip) {
          // @ts-ignore
          uni.showToast({
            title: r.message,
            icon: 'none',
          })
        }
      }
    }
    if (r?.ok === true) {
      return field.submitValue()
    }
    return undefined
  }

  submitValue(): any | LazyPromise<any> {
    const r = this.valueGen(this.value)
    return r
  }

  get formData() {
    if (this.transform) {
      return this.transform(this.submitValue())
    }
    const result = {}
    result[`${this.name}`] = this.submitValue()
    return result
  }

  constructor(init: FieldInit) {
    const {
      name,
      check,
      checkTrigger,
      errorTip,
      blankTip,
      disabled,
      debug: debug,
      transform,
    } = init
    let { label, required, placeholder, interact } = init
    this.transform = transform
    this.$value = new PublishSub<any>()
    label = label || '内容'
    if (disabled !== undefined) {
      this.disabled = disabled
    }

    let isList = false
    if (typeof check === 'object') {
      try {
        if ((<NumberLimit>check).max) {
          isList = true
        }
      } catch (e) {}
    } else if (typeof check === 'string') {
      if (/^(\d+)~(\d+)$/g.test(<string>check)) {
        isList = true
      }
    }
    if (isList) {
      interact = interact || Interact.select
    }

    interact = interact || Interact.input
    required = required != undefined ? required : true
    placeholder = placeholder || '请' + interactName(interact) + label
    this.label = label
    this.name = name || 'xx'
    this.check = check || ''
    this.required = required
    this.interact = interact
    this.placeholder = placeholder
    this.checkTrigger = checkTrigger || [CheckTrigger.change]
    this.errorTip = errorTip || `${label}无效`
    this.blankTip = blankTip || placeholder
    this.debug = debug || false
  }

  needCheck(trigger: CheckTrigger): boolean {
    if (trigger == CheckTrigger.submit) {
      return true
    }
    if (trigger == CheckTrigger.preCheck) {
      return true
    }
    for (const one of this.checkTrigger) {
      if (one == trigger) {
        return true
      }
    }
    return false
  }

  doCheck(trigger: CheckTrigger): CheckResult | undefined {
    const value = this.value
    if (!this.needCheck(trigger)) {
      return undefined
    }

    let ok = new DebugBool(true, this.name)
    ok.debug = this.debug
    const required = this.required
    let result = value

    switch (typeof value) {
      case 'undefined':
        if (!required) {
          return undefined
        }
        break
      default:
        break
    }

    result = this.value
    let check = this.check

    switch (typeof check) {
      case 'string':
        if (/^\[(.+)\]$/.test(<string>check)) {
          const names = /^\[(.+)\]$/g.exec(<string>check) || []
          if (names.length > 0) {
            try {
              const regName = names[1]
              // @ts-ignore
              const fastReg = regs[regName]
              if (fastReg) {
                check = fastReg
              }
            } catch (e) {}
          }
        } else if (`${check}` === '>0') {
          check = <NumberLimit>{
            min: 1,
            max: 10,
            minTip: `${this.placeholder}`,
            maxTip: `最多${interactName(this.interact)}`,
          }
        } else if (/^(\d+)~(\d+)$/g.test(<string>check)) {
          const names: any = /^(\d+)~(\d+)$/g.exec(<string>check) || []
          if (names.length > 2) {
            try {
              const nums = names.slice(1, 3).map((e: string): number => {
                return parseInt(e)
              })
              check = <NumberLimit>{
                min: nums[0],
                max: nums[1],
                minTip: `请至少${interactName(this.interact)}${nums[0]}个${this.label}`,
                maxTip: `最多${interactName(this.interact)}${nums[1]}个${this.label}`,
              }
              this.check = check
            } catch (e) {}
          }
        } else {
          check = new RegExp(<string>check)
        }
        break
      case 'function':
        // @ts-ignore
        ok.ok = check(value)
        break
      default:
        break
    }

    switch ($type(value)) {
      case 'undefined':
        ok.ok = false
        break
      case 'list':
        if (typeof check === 'object') {
          // @ts-ignore
          if (check.max) {
            const limit = <NumberLimit>check
            if (result.length > limit.max) {
              return { ok: ok.update(false), message: limit.maxTip }
            }
            if (result.length < limit.min) {
              return { ok: ok.update(false), message: limit.minTip }
            }
          }
        } else if (typeof check === 'function') {
          ok.ok = check(value)
        } else {
          if ((<any[]>this.value).length < 1) {
            ok.ok = false
          }
        }
        break
      case 'object':
        if (typeof check === 'object') {
          // @ts-ignore
          if (check.max) {
            const limit = <NumberLimit>check
            if (result.length > limit.max) {
              return { ok: false, message: limit.maxTip }
            }
            if (result.length < limit.min) {
              return { ok: false, message: limit.minTip }
            }
          }
        } else if (typeof check === 'function') {
          ok.ok = check(value)
        } else {
          if ((<any[]>this.value).length < 1) {
            ok.ok = false
          }
        }
        break

      case 'string':
        if ($type(check) === 'reg') {
          ok.ok = (<RegExp>check).test(<string>value)
        }
        break
      case 'function':
        // @ts-ignore
        ok = check(value)
        break
    }
    console.warn(this.name, value)

    let badTip: any = this.errorTip || ''
    if (value === undefined) {
      badTip = this.blankTip
    }

    if ($type(value) === 'object') {
      if (Object.keys(value).length < 1) {
        badTip = this.blankTip
      }
    }
    if ($type(value) === 'list') {
      if (value.length < 1) {
        badTip = this.blankTip
      }
    }
    if ($type(value) === 'string') {
      if ((<string>value).length < 1) {
        badTip = this.blankTip
      }
    }

    return {
      ok: ok.ok,
      message: ok.ok ? 'success' : badTip,
      value: this.submitValue(),
    }
  }
}

export class FormCheck {
  allFields: Field[] = []

  findField(name: string): Field | undefined {
    for (const field of this.allFields) {
      if (field.name === name) {
        return field
      }
    }
    return undefined
  }

  constructor(fields: Field[] | null) {
    if (fields) {
      this.allFields = <Field[]>fields
    }
  }

  submitNames(
    fieldNames: string[],
    autoTip: boolean = true,
  ): {
    ok: boolean
    message: string
    values: { [k: string]: any }
  } {
    const fields: Field[] = []
    for (const field of this.allFields) {
      for (const name of fieldNames) {
        if (field.name === name) {
          fields.push(field)
        }
      }
    }
    return this.submitFields(fields, autoTip)
  }

  submitFields(
    fields: Field[],
    _autoTip = true,
  ): {
    ok: boolean
    message: string
    values: { [k: string]: any }
  } {
    const values: { [k: string]: any } = {}
    for (const field of fields) {
      const check = field.doCheck(CheckTrigger.submit)
      if (check) {
        if (!check.ok) {
          return { ok: false, message: check.message, values: {} }
        } else {
          values[`${field.name}`] = check.value
        }
      }
    }

    return { ok: true, values, message: 'success' }
  }

  async asyncParser(
    tip: 'none' | 'toast' | 'tips' = 'toast',
    loadingText?: string,
  ): Promise<{
    ok: boolean
    values: any
    msg?: string
  }> {
    const result = this.parser(tip)
    return new Promise(async (resolve, reject) => {
      if (!result.ok) {
        reject(result.msg)
        return
      }
      const values = result.values
      const keys = Object.keys(values || {})
      const asyncList: { name: string; value: LazyPromise<any> }[] = []

      for (const key of keys) {
        const value = values[key]
        try {
          if (value.constructor) {
            if (value.LazyPromise) {
              asyncList.push({
                name: key,
                value,
              })
            } else if (`${value.constructor.name}` === 'LazyPromise') {
              asyncList.push({
                name: key,
                value,
              })
            } else {
            }
          } else {
            console.log('------has nos', value)
          }
        } catch (e) {}
      }

      try {
        const values = result.values

        if (asyncList.length > 0) {
          // @ts-ignore
          uni.showLoading({
            title: loadingText ?? '正在上传',
          })
          const res = await queueMap<
            { name: string; value: LazyPromise<any> },
            {
              name: string
              value: any
            }
          >(asyncList, ({ name, value }) => {
            return new Promise(async (resolve_, reject_) => {
              try {
                // let one = await value.run()
                const one = await value
                console.log('-0000000888', one)
                resolve_({ name, value: one })
              } catch (e) {
                reject_(e)
              }
            })
          })
          for (const re of res) {
            values[re.name] = re.value
          }
        }

        resolve({ ok: true, values, msg: 'success' })
      } catch (e) {
        // @ts-ignore
        uni.showToast({
          icon: 'none',
          title: '上传失败',
        })
        reject(e)
      }
    })
  }

  parser(tip: 'none' | 'toast' | 'tips' = 'toast'): { ok: boolean; values: any; msg?: string } {
    const fields = this.allFields
    const values: { [k: string]: any } = {}
    const err_tips: string[] = []

    if (tip === 'none' || tip === 'toast') {
      for (const field of fields) {
        // console.warn("A0001",field.name)
        const check = field.doCheck(CheckTrigger.submit)
        if (check) {
          if (!check.ok) {
            if (tip === 'toast') {
              // @ts-ignore
              uni.showToast({
                title: check.message,
                icon: 'error',
                duration: 1200,
              })
            }
            return { ok: false, msg: check.message, values: {} }
          } else {
            values[`${field.name}`] = field.submitValue()
          }
        }
      }
      return { ok: true, values, msg: 'success' }
    }
    let ok = true
    for (const field of fields) {
      const check = field.doCheck(CheckTrigger.submit)
      if (check) {
        if (!check.ok) {
          err_tips.push(check.message)
          field.update(check)
          ok = false
        } else {
          values[`${field.name}`] = field.submitValue()
        }
      }
    }
    if (!ok) {
      // @ts-ignore
      uni.showToast({
        title: '请检查提交内容',
        icon: 'error',
      })
    }

    return { ok: ok, values, msg: ok ? 'success' : err_tips.join('|') }
  }

  valid(options?: { tip?: 'none' | 'toast' | 'cell' }): Promise<{ [k: string]: any }> {
    const ops = { tip: 'none', ...options }
    return new Promise(async (resolve, reject) => {
      const fields = this.allFields
      const errors: string[] = []

      const validFields: Field[] = []
      const errorFields: Field[] = []
      for (const field of fields) {
        const check = field.doCheck(CheckTrigger.submit)
        if (ops.tip === 'cell') {
          field.updateTip(check)
        }
        if (check) {
          if (!check.ok) {
            errors.push(check.message)
            errorFields.push(field)
          } else {
            validFields.push(field)
          }
        }
      }
      if (errorFields.length > 0) {
        reject(errors)
        return
      }
      let result = {}
      if (errorFields.length < 1 && validFields.length > 0) {
        for (const field of validFields) {
          result = { ...result, ...field.formData }
        }
      }

      const keys = Object.keys(result)
      for (const key of keys) {
        const value = result[key]
        if (value.constructor) {
          if (`${value.constructor.name}` === 'LazyPromise') {
            try {
              result[key] = await value.run()
            } catch (e: any) {
              errors.push(e.message)
            }
          }
        }
      }
      if (errorFields.length > 0) {
        reject(errors)
        return
      }
      resolve(result)
    })
  }
}

export function runCheckDemo() {
  const email = new Field({ name: 'email', label: '邮箱', check: '[email]' })
  email.value = 'zhuxietong@me.com'
  const userName = new Field({ name: 'username', label: '姓名', check: '\\S{3}' })
  userName.value = 'la3'

  const tags = new Field({ name: 'tags', label: '标签', check: '2~3' })
  tags.value = 'goods'

  const from = new FormCheck([email, userName, tags])

  const v = from.submitNames(['email', 'username', 'tags'])
  console.log('---s', v)
}

// runCheckDemo()

import type { CheckTrigger, Interact } from '#/components/form/Field'

export {}
declare global {


  interface _Form {
    findField(name: string): any | undefined

    parser(tip?: 'none' | 'toast' | 'tips'): { ok: boolean, values: any, msg?: string }

    asyncParser(tip?: 'none' | 'toast' | 'tips'): Promise<{ ok: boolean, values: any, msg?: string }>

    valid(options?: { tip: "none" | "toast" | "cell" }): Promise<{ [k: string]: any }>
  }

  export interface NumberLimit {
    min: number
    max: number
    minTip: string
    maxTip: string
  }

  type CheckFunc = (...val: any) => boolean
  export type Checker =
    | string
    | RegExp
    | NumberLimit
    | CheckFunc
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

  export type ValueGen = (rawValue: any) => any
  export type UpdateTip = (result: CheckResult | undefined) => any

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


  export interface FieldKeys {
    required?: boolean
    tip?: string
    label?: string
    float?: 'left' | 'right'
    indicator?: boolean
  }

  export interface FormGroupKeys {
    cellDirection?: 'v' | 'h'
    padding?: string,
    labelWidth?: string
  }

}

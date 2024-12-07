<template>
  <view :style="gridStyle">
    <view v-for="(item, i) in model.list" :key="i">
      <slot name="item" :item="item" :index="i">
        <view>{{ item }}</view>
      </slot>
    </view>
    <view v-if="model.list.length < max" @click="onAdd">
      <slot name="add">
        <view> +</view>
      </slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, defineComponent, inject, reactive } from 'vue'
import { Checker, CheckTrigger, Field, Interact, LazyPromise } from './Field'
import { $type, queueMap } from '@offs/core'

let emits = defineEmits(['update:modelValue'])
defineComponent({ name: 'f-date' })

type URLString = string
type URLGetter = (val: any) => Promise<URLString>

type MediaType = 'image' | 'video'

const props = withDefaults(
  defineProps<{
    modelValue: any
    name: string
    label: string
    check?: Checker
    needCut?: boolean
    sizeType?: 'original' | 'compressed'
    sourceType?: 'album' | 'camera'
    borderRadius?: string | any
    borderColor?: string
    column?: number
    gap?: string
    max?: number
    urlGetter?: URLGetter
    medias?: MediaType[]
  }>(),
  {
    column: 4,
    gap: '20rpx 20rpx',
    max: 8,
  },
)

const checker = (val) => {
  if ($type(val) === 'list') {
    return val.length > 0
  }
  return false
}

let field = new Field({
  name: props.name,
  label: props.label,
  check: props.check || checker,
  checkTrigger: [CheckTrigger.focus, CheckTrigger.blur, CheckTrigger.change],
  interact: Interact.select,
})

const _range = (i: number) => {
  let list: number[] = []
  let index = 0
  do {
    list.push(index)
    index = index + 1
  } while (index < i)
  return list
}

const gridStyle = computed<any>(() => {
  let frs = _range(props.column)
    .map(() => {
      return '1fr'
    })
    .join(' ')
  return <CSSStyleDeclaration>{
    gridTemplateColumns: frs,
    gridGap: props.gap,
    display: 'grid',
  }
})

let list: any[] = <any[]>props.modelValue || []
const model = reactive<{
  list: any[]
}>({ list: list })

const tip: any = inject('tip', {})
field.updateTip = (result) => {
  tip.value = result
}

const f_fields = inject<any>('f_fields', [])
f_fields.push(field)

const value = props.modelValue
field.value = value
const getter = props.urlGetter

field.valueGen = (rawValue) => {
  function isFinishUpload() {
    switch ($type(rawValue)) {
      case 'list':
        return false
      default:
        break
    }
    return true
  }

  if (isFinishUpload()) {
    return rawValue
  }

  return new LazyPromise<any[]>(() => {
    return new Promise<any[]>(async (resolve, reject) => {
      let list: any[] = rawValue
      try {
        let result = await queueMap(list, (input: any) => {
          return new Promise(async (resolve1, reject1) => {
            let src = input

            if (typeof input === 'object') {
              src === input.src
            }
            if (`${src}`.startsWith('http')) {
              resolve1(input)
            } else {
              // @ts-ignore
              try {
                if (getter !== undefined) {
                  let src = await getter(input)
                  resolve1(src)
                } else {
                  reject1('未设置图片上传方法')
                }
              } catch (e) {
                reject1(e)
              }
            }
          })
        })
        resolve(result)
      } catch (e) {
        if (reject) {
          reject(e)
        }
      }
    })
  })
}

const cell = inject<FieldKeys>('cell', {})
cell.label = field.label
cell.required = field.required
// @ts-ignore
cell.float = props.float ? props.float : cell.float || 'left'

const onAdd = () => {}
</script>

<style lang="scss"></style>

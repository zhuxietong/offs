<template>
  <div>
    <a-table
      :size="size"
      :columns="columns"
      :row-key="rowKey"
      :show-header="showHeader"
      :sticky-header="stickyHeader"
      :bordered="bordered"
      :loading="loading"
      :data="tableData"
      :scroll="scroll"
      :row-selection="rowSelection"
      :pagination="{
        ...pagination,
        size: size
      }"
      @page-change="changePage"
      @page-size-change="changeSize"
    />
  </div>
</template>

<script setup lang="ts">
import type { TableBorder, TableColumnData, TableRowSelection } from '@arco-design/web-vue'
import { usePageFetch } from '@offs/vue'
import type { FetchSetting } from '@offs/vue/src/hook/useFetch'


type TableProps = Partial<{
  columns: TableColumnData[]
  loading: boolean
  rowKey: string
  bordered: TableBorder | boolean
  pagePosition: 'top' | 'tl' | 'tr' | 'bottom' | 'bl' | 'br'
  size: 'mini' | 'medium' | 'large' | 'small'
  showHeader: boolean
  stickyHeader: number | boolean
  rowSelection: TableRowSelection | undefined
  scroll?:
    | {
        x?: string | number | undefined
        y?: string | number | undefined
        minWidth?: string | number | undefined
        maxHeight?: string | number | undefined
      }
    | undefined
}>
type RequiredTableProps<T extends { [k: string]: any }> = {
  source: {
    url: string
    setting?: FetchSetting<T, Body, PaginationParam>
  }
}

const props = withDefaults(defineProps<TableProps & RequiredTableProps<any>>(), {
  size: 'medium',
  bordered: {
    // @ts-ignore
    cell: true
  },
  showHeader: true,
  stickyHeader: false,
  rowKey: 'id',
  pagePosition: 'bottom'
})

const {
  filter,
  loading,
  reload,
  changePage,
  tableData,
  changeSize,
  pagination
} = usePageFetch(props.source.url, props.source.setting || {})


defineExpose({
  reset: () => {
    //清除过滤字段
    filter.value = {}
    reload()
  },
  reload: (params: { [k: string]: any }) => {
    filter.value = params
    reload(params as any)
  }
})
</script>

<style scoped></style>

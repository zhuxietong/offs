<template>
  <div>
    <a-table
      :size="(size as any)"
      :columns="columns"
      :row-key="rowKey"
      :show-header="showHeader"
      :sticky-header="stickyHeader"
      :bordered="bordered"
      :loading="loading"
      :data="tableData"
      :scroll="scroll"
      :row-selection="rowSelection"
      :onSelectionChange="onSelectionChange"
      :pagination="(loadMode === 'one-load' ? true : {
        ...pagination,
      }) as any"
      @page-change="changePageIndex"
      @page-size-change="changePageSize"
    />
  </div>
</template>

<script setup lang="ts">
import type { TableBorder, TableRowSelection } from '@arco-design/web-vue';
import { defineProps, defineEmits, defineExpose, withDefaults, watch } from 'vue';
import usePaging from '../hook/usePaging';

const emit = defineEmits(['update:data']);

type TableProps = Partial<{
  columns: any[];
  data?: any[];
  loading: boolean;
  rowKey: string;
  bordered: TableBorder | boolean;
  pagePosition: 'top' | 'tl' | 'tr' | 'bottom' | 'bl' | 'br';
  size: 'mini' | 'medium' | 'large' | 'small';
  showHeader: boolean;
  stickyHeader: number | boolean;
  rowSelection: TableRowSelection | undefined;
  scroll?:
    | {
        x?: string | number | undefined;
        y?: string | number | undefined;
        minWidth?: string | number | undefined;
        maxHeight?: string | number | undefined;
      }
    | undefined;
  onExpandedChange?: ((rowKeys: (string | number)[]) => any) | undefined;
  onSelectAll?: ((checked: boolean) => any) | undefined;
  onSelectionChange?: ((rowKeys: (string | number)[]) => any) | undefined;
  onSorterChange?: ((dataIndex: string, direction: string) => any) | undefined;
  onFilterChange?: ((dataIndex: string, filteredValues: string[]) => any) | undefined;
}>;
type PagingTableProps<T extends { [k: string]: any }> = {
  pageSize?: number;
  pageSizeKey?: string;
  pageKey?: string;
  loadMode?: 'one-load' | 'page-load';
  manual?: boolean;
  request: (params: { [k: string]: any }) => Promise<{
    total: number;
    list: T[];
  }>;
};

const props = withDefaults(defineProps<TableProps & PagingTableProps<any>>(), {
  size: 'medium',
  bordered: {
    // @ts-ignore
    cell: true,
  },
  showHeader: true,
  stickyHeader: false,
  rowKey: 'id',
  loadMode: 'page-load',
  pagePosition: 'bottom',
});

const { loading, refresh, updateFilter, changePage, tableData, changeSize, pagination } = usePaging(
  props.request,
  {
    manual: props.manual,
    pageKey: props.pageKey,
    sizeKey: props.pageSizeKey,
  },
);

watch(tableData, (val) => {
  try {
    if(props.data) {
      emit('update:data', val);
    }
  }catch (e) {

  }
});


const changePageIndex = (page:number) => {
  if(props.loadMode === 'one-load') {
    return;
  }
  changePage(page);
};
const changePageSize = (size: number) => {
  if(props.loadMode === 'one-load') {
    return;
  }
  changeSize(size);
};


defineExpose({
  refresh,
  updateFilter,
  get list() {
    return tableData.value;
  },
});
</script>

<style scoped></style>

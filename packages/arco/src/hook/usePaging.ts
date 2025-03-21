import { onMounted, ref, computed } from 'vue'
import { PaginationConfig, offsRequestConfig } from '@offs/core'

export type PaginationParam = {
  sizeKey?: string
  pageKey?: string
  defaultSize?: number
  totalKey?: string
  listKey?: string
  beginPage?: number | string //default 1
  pagination?: {
    [k: string]: any
  }
}

const configBlock = (_url: string): PaginationParam => {
  return offsRequestConfig.pagination(_url)
}

export type PagingOption = Partial<PaginationConfig> & {
  manual?: boolean
}

function usePaging<Row>(
  // eslint-disable-next-line no-unused-vars
  request: (_param: { [k: string]: any }) => Promise<{
    total: any
    list: Row[]
  }>,
  option: PagingOption,
) {
  const globalSetting = configBlock('')
  const pageKey: string = option?.pageKey || globalSetting.pageKey || 'page'
  const pageSizeKey: string = option?.sizeKey || globalSetting.sizeKey || 'size'

  const size = ref(option?.defaultSize || globalSetting.defaultSize)

  const pageBegin =
    (option?.beginPage != undefined ? option.beginPage : undefined) ||
    (globalSetting.beginPage != undefined ? globalSetting.beginPage : undefined) ||
    0
  const page = ref<number | string>(1)

  const filter = ref<{ [k: string]: any } | undefined>(undefined)

  const total = ref(0)

  const loading = ref(false)

  const tableData = ref<Row[]>([])

  async function loadData(param?: { [k: string]: any }) {
    loading.value = true
    let pageIndex: number = page.value as number
    if ((pageBegin as number) < 1) {
      pageIndex = pageIndex - 1
    }

    return request({
      [pageKey]: pageIndex,
      [pageSizeKey]: size.value,
      ...param,
    })
      .then(({ list, total: count }) => {
        if (typeof count === 'number') {
          total.value = count
        } else if (typeof count === 'string') {
          try {
            total.value = parseInt(count)
          } catch (_e: unknown) {}
        }

        // @ts-expect-error
        tableData.value = [...list] as Row[]

        console.log('-ssd----cursor', pageIndex, pageBegin)
        // if (`${cursor}` === `${pageBegin}`) {
        //   console.log('cursor', cursor, pageBegin);
        //   if (Array.isArray(list)) {
        //     // @ts-ignore
        //     tableData.value = [...list] as Row[];
        //   }
        // } else {
        //   console.log('-----cursor', cursor, pageBegin,);
        //
        //   // @ts-ignore
        //   tableData.value = [...(tableData.value || []), ...(list as any[])] as Row[];
        // }
      })
      .catch(() => {})
      .finally(() => {
        loading.value = false
      })
  }

  const changeSize = (_size: number) => {
    size.value = _size
    loadData(filter.value as any)
      .then(() => {})
      .catch(() => {})
  }
  const changePage = (_page: number) => {
    page.value = _page
    loadData(filter.value as any)
      .then(() => {})
      .catch(() => {})
  }
  const changePagination = (_page?: number, _size?: number) => {
    if (_size) size.value = _size
    if (_page) page.value = _page
    loadData(filter.value as any)
      .then(() => {})
      .catch(() => {})
  }

  onMounted(() => {
    if (!option?.manual) {
      loadData(filter.value as any)
        .then(() => {})
        .catch(() => {})
    }
  })

  const pagination = computed(() => {
    let pageIndex: number = page.value as number
    if (pageIndex <= 0) {
      pageIndex = 1
    }

    return {
      total: total.value,
      current: pageIndex,
      pageSize: size.value || 10,
      showTotal: true,
      // showJumper: true,
      // showPageSize: true,
      // ...(setting?.pagination || {}),
    }
  })
  const refresh = (firstPage?: boolean) => {
    if (firstPage) {
      // @ts-ignore
      page.value = pageBegin
    }
    return loadData(filter.value as any)
  }

  const updateFilter = (param: { [k: string]: any }) => {
    filter.value = param
    page.value = pageBegin
    return loadData(param)
  }
  return {
    updateFilter,
    refresh,
    loading,
    size,
    page,
    filter,
    changePagination,
    tableData,
    total,
    changePage,
    changeSize,
    pagination,
  }
}

export default usePaging

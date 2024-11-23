import { onMounted, ref, computed } from 'vue';
import { PaginationConfig, offsRequestConfig } from '@offs/core';

export type PaginationParam = {
  sizeKey?: string;
  pageKey?: string;
  defaultSize?: number;
  totalKey?: string;
  listKey?: string;
  beginPage?: number | string; //default 1
  pagination?: {
    [k: string]: any;
  };
};

const configBlock = (_url: string): PaginationParam => {
  return offsRequestConfig.pagination(_url);
};

export type PagingOption = Partial<PaginationConfig> & {
  manual?: boolean;
};

function usePaging<Row>(
  // eslint-disable-next-line no-unused-vars
  request: (_param: { [k: string]: any }) => Promise<{
    total: any;
    list: Row[];
  }>,
  option: PagingOption,
) {
  const globalSetting = configBlock('');
  const pageKey: string = option?.pageKey || globalSetting.pageKey || 'page';
  const pageSizeKey: string = option?.pageKey || globalSetting.sizeKey || 'size';

  const size = ref(option?.defaultSize || globalSetting.defaultSize);

  const pageBegin =
    (option?.beginPage != undefined ? option.beginPage : undefined) ||
    (globalSetting.beginPage != undefined ? globalSetting.beginPage : undefined) ||
    0;
  const page = ref<number | string>(pageBegin);

  const filter = ref<{ [k: string]: any } | undefined>(undefined);

  const total = ref(0);

  const loading = ref(false);

  const tableData = ref<Row[]>([]);

  async function loadData(param?: { [k: string]: any }) {
    loading.value = true;
    const pageIndex = page.value;
    return request({
      [pageKey]: page.value,
      [pageSizeKey]: size.value,
      ...param,
    })
      .then(({ list, total: count }) => {
        if (typeof count === 'number') {
          total.value = count;
        } else if (typeof count === 'string') {
          try {
            total.value = parseInt(count);
          } catch (e) {}
        }
        try {
        } catch (e) {
          /* empty */
        }
        if (`${pageIndex}` === `${pageBegin}`) {
          if (Array.isArray(list)) {
            tableData.value = [...list];
          }
        } else {
          tableData.value = [...(tableData.value || []), ...(list as any[])];
        }
      })
      .catch(() => {})
      .finally(() => {
        loading.value = false;
      });
  }

  const changeSize = (_size: number) => {
    size.value = _size;
    loadData(filter.value as any)
      .then(() => {})
      .catch(() => {});
  };
  const changePage = (_page: number) => {
    page.value = _page;
    loadData(filter.value as any)
      .then(() => {})
      .catch(() => {});
  };
  const changePagination = (_page?: number, _size?: number) => {
    if (_size) size.value = _size;
    if (_page) page.value = _page;
    loadData(filter.value as any)
      .then(() => {})
      .catch(() => {});
  };

  onMounted(() => {
    if (!option?.manual) {
      loadData(filter.value as any)
        .then(() => {})
        .catch(() => {});
    }
  });

  const pagination = computed(() => {
    return {
      total: total.value,
      current: page.value,
      pageSize: size.value || 10,
      showTotal: true,
      // showJumper: true,
      // showPageSize: true,
      // ...(setting?.pagination || {}),
    };
  });
  const refresh = (firstPage?: boolean) => {
    if (firstPage){
      // @ts-ignore
      page.value = pageBegin;
    }
    return loadData(filter.value as any);
  };

  const updateFilter = (param: { [k: string]: any }) => {
    filter.value = param;
    page.value = pageBegin;
    return loadData(param);
  };
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
  };
}

export default usePaging;

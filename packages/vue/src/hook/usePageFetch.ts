import { useFetch, type FetchSetting } from './useFetch';
import { onMounted, ref, watch, computed } from 'vue';
import { getValue } from '@offs/core';
import config from '../config/request';

const configBlock = (_url: string): PaginationParam => {
  return config.pagination(_url);
};

function extractListNodeString(input: string): string | undefined {
  const match = input.match(/@([\w\d-\\.]+)/);
  return match ? match[1] : undefined;
}

function extractURl(input: string): string {
  const bracketIndex = input.indexOf(']');
  if (bracketIndex === -1) {
    // 如果没有找到 ']'，返回整个字符串
    return input;
  } else {
    // 返回 ']' 之后的子字符串
    return input.slice(bracketIndex + 1).trim();
  }
}

const usePageFetch = <
  Row extends { [k: string]: any } = { [k: string]: any },
  Body extends {
    [k: string]: any;
  } = { [k: string]: any },
>(
    url: string,
    setting?: FetchSetting<Row, Body, PaginationParam>,
  ) => {
  const globalSetting = configBlock(extractURl(url));

  const pageKey = setting?.pageKey || globalSetting.pageKey;
  const pageSizeKey = setting?.pageKey || globalSetting.sizeKey;
  const totalKey = setting?.totalKey || globalSetting.totalKey;
  const listKey = setting?.listKey || extractListNodeString(url) || globalSetting.listKey;

  const size = ref(setting?.defaultSize || globalSetting.defaultSize);

  const pageBegin = setting?.beginPage || globalSetting.beginPage || 1;
  const page = ref<number | string>(pageBegin);

  const filter = ref<{ [k: string]: any } | undefined>(undefined);

  const total = ref(0);

  const tableData = ref<Row[]>([]);

  const {
    data,
    run: fetchRun,
    loading,
  } = useFetch<Row[], Body & PaginationParam>(url, {
    ...setting,
    extract: listKey,
    manual: true,
    onResponse: (resp, body) => {
      try {
        total.value = parseInt(`${getValue(resp, totalKey || 'total')}`);
      } catch (e) {
        /* empty */
      }
      setting?.onResponse?.(resp, body);
    },
    convert: (resp) => {
      if (setting?.convert) {
        return setting.convert(resp);
      }
      return resp;
    },
    onSuccess: (resp, body) => {
      if (body?.[`${pageKey}`] + '' === `${pageBegin}`) {
        if(Array.isArray(resp)){
          tableData.value = [...resp];
        }
      } else {
        tableData.value = [...(tableData.value || []), ...resp];
      }
      setting?.onSuccess && setting!.onSuccess(resp, body);
    },
  });

  const run = (param?: Body & { [k: string]: any }) => {
    const pageInfo = {
      [pageKey || 'page']: page.value,
      [pageSizeKey || 'size']: size.value,
    };

    return fetchRun({
      ...param,
      ...pageInfo,
    } as any);
  };

  const changeSize = (_size: number) => {
    size.value = _size;
    run(filter.value as any)
      .then(() => {})
      .catch(() => {});
  };
  const changePage = (_page: number) => {
    page.value = _page;
    run(filter.value as any)
      .then(() => {})
      .catch(() => {});
  };
  const changePagination = (_page?: number, _size?: number) => {
    if (_size) size.value = _size;
    if (_page) page.value = _page;
    run(filter.value as any)
      .then(() => {})
      .catch(() => {});
  };


  onMounted(() => {
    if (!setting?.manual) {
      run(filter.value as any)
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

  const reload = (param?: Body & { [k: string]: any }) => {
    // @ts-ignore
    page.value = pageBegin;
    return run(param);
  };

  return {
    data,
    reload,
    run,
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
};

export default usePageFetch;
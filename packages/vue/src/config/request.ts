/**
 * 分页参数配置
 */
export type PaginationConfig = {
  /** 分页大小key */
  sizeKey: string;
  /** 页码key */
  pageKey: string;
  /** 默认分页大小 */
  defaultSize: number;
  /** 总条数key */
  totalKey: string;
  /** 数据列表key,可以以逗号分隔多个 */
  listKey: string;
  /** 开始页码 */
  beginPage: number;
};

export const paginationConfig: PaginationConfig = {
  pageKey: 'page',
  sizeKey: 'size',
  defaultSize: 10,
  totalKey: 'total',
  listKey: 'data,list',
  beginPage: 1,
};

export const dynamicPaginationConfig = (_url: string): PaginationConfig => {
  return paginationConfig;
};

const requestConfig = {
  pagination: dynamicPaginationConfig,
};

export default requestConfig;

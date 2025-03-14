/// <reference path="./global.d.ts" />
export type * from './global.d.ts'

export { extractValues } from './utils/extract'
export { deepMerge } from './utils/deepMerge'
export { getValue, type, $type } from './utils/type'
export { default as useEnums, type EnumObject } from './utils/enums'
export { default as Queue } from './utils/queue'
export { default as PublishSub, DisposeBag } from './utils/subscribe'
export { Dayjs } from './utils/dayjs'
export { LazyPromise, ExposedPromise, RetryPromise } from './utils/promise'
export { AsyncQueue, queueMap, type AsyncTask } from './utils/asyncQueue'

export { Fetch, parserFetchOption } from './utils/fetch'
export { Retry } from './utils/retry'
export { continueWaitingClear, continueWaiting } from './utils/continueWaiting'
export { BoolValue } from './utils/bool'
export { isEmpty } from './utils/isEmpty'

export { default as offsRequestConfig, type PaginationConfig, dynamicPaginationConfig } from './utils/requestConfig'

// import { extractValues } from './utils/extract';
// import { deepMerge } from './utils/deepMerge';
// import { getValue, type } from './utils/type';
// import useEnums from './utils/enums';
// import PublishSub, { DisposeBag } from './utils/subscribe';

// export default {
//   deepMerge,
//   getValue,
//   useEnums,
//   type,
//   PublishSub,
//   DisposeBag,
//   extractValues,
// };

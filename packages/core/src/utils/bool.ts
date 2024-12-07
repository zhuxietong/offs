import { $type } from './type'

export type BoolValueType = '0|1' | 'true|false'

export class BoolValue {
  static parser(value: any, type: BoolValueType): any {
    switch ($type(value)) {
    case 'boolean':
      switch (type) {
      case '0|1':
        return value ? 1 : 0
      case 'true|false':
        return value
      }
      break
    case 'number':
      if (value == 0) {
        switch (type) {
        case 'true|false':
          return false
        case '0|1':
          return 0
        }
      } else {
        switch (type) {
        case '0|1':
          return 1
        case 'true|false':
          return true
        }
      }
      break
    case 'string':
      if (`${value}` == '0' || `${value}` == 'false') {
        switch (type) {
        case 'true|false':
          return false
        case '0|1':
          return 0
        }
      } else {
        switch (type) {
        case 'true|false':
          return true
        case '0|1':
          return 1
        }
      }
    }
    return true
  }
}

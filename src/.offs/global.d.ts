declare global {
  type TreeItem = {
    title: string;
    value?: string | number;
    icon?: string | number;
    children?: TreeItem[];
  }
  StoreKey = 'user' | 'search'

}

export {};
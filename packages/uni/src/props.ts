export {};
export declare namespace UI {
  type RadiusType = 'small' | 'media' | 'large';
  type ThemeType = 'dark' | 'gray' | 'white';
  type Radius = Record<RadiusType, string>;

  type NavProps = {
    color?: string;
    background?: string;
    fontSize?: number | string;
    title?: string;
  };
}

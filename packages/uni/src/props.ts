export {};
export declare namespace UI {
  type BaseColors =
    | 'primary'
    | 'success'
    | 'warning'
    | 'error'
    | 'line'
    | 'front_deep'
    | 'front_normal'
    | 'front_weak'
    | 'front_disabled'
    | 'background_white'
    | 'background_default'
    | 'background_light'
    | 'background_gray'
    | 'background_weight';
  type Colors = Record<BaseColors, string>;
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

export class UISetting {
  radius: UI.Radius = {
    small: '4px',
    media: '8px',
    large: '12px',
  };

  colors: UI.Colors = {
    primary: '#165DFF',
    success: '#00B42A',
    warning: '#FF7D00',
    error: '#F53F3F',
    line: '#E5E6EB',
    front_deep: '#1D2129',
    front_normal: '#4E5969',
    front_disabled: '#C9CDD4',
    front_weak: '#86909C',
    background_white: '#ffffff',
    background_default: '#F7F8FA',
    background_light: '#F2F3F5',
    background_gray: '#E5E6EB',
    background_weight: '#C9CDD4',
  };
  navProps: UI.NavProps = {
    color: '#262626',
    background: '#ffffff',
    fontSize: '16px',
    title: '',
  };
}

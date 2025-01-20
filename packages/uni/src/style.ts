// @ts-nocheck
// This file is auto-generated by vite-plugin-offs-style
const offsStyle = {
  "radius": {
    "small": "4rpx",
    "mid": "8rpx",
    "large": "12rpx"
  },
  "color": {
    "primary1": "#4BAE7A",
    "primary2": "#63C08F",
    "primary3": "#7ACDA1",
    "primary4": "#B8DFCB",
    "primary5": "#ECF6F1",
    "light1": "#FFFFFF",
    "light2": "#F8F9FE",
    "light3": "#E8E9F1",
    "light4": "#D4D6DD",
    "light5": "#C5C6CC",
    "dark1": "#1F2024",
    "dark2": "#2F3036",
    "dark3": "#494A50",
    "dark4": "#71727A",
    "dark5": "#8F9098",
    "success1": "#298267",
    "success2": "#3AC0A0",
    "success3": "#3AC0A0",
    "warning1": "#E86339",
    "warning2": "#FFB37C",
    "warning3": "#FFF4E4",
    "error1": "#ED3241",
    "error2": "#FF616D",
    "error3": "#FFE2E5",
    "line1": "#E5E6EB"
  },
  "img": {
    "empty": "static/img/empty.png",
    "error": "static/img/error.png"
  },
  "nav": {
    "background": "#F7F8FA",
    "color": "#1D2129",
    "font_size": "16px"
  }
} as const;

if (typeof window !== 'undefined') {
  window._offsStyle = offsStyle;
} else if (typeof globalThis !== 'undefined') {
  globalThis._offsStyle = offsStyle;
}

export default offsStyle;

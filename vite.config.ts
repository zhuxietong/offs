// @ts-ignore
import {injectOffsUniModule} from "./src/_offs/inject.js";

import options from "./src/_offs/config.js"

import {defineConfig} from "vite";
import path from 'path';

import uni from "@dcloudio/vite-plugin-uni";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  server: {
    port: 9101, // 设置开发服务器的端口号
    host: '0.0.0.0', // 可选：允许外部设备访问
    watch: {
      // 添加对 packages 文件夹的监听
      ignored: ['!**/packages/**'],
    },
  },
  define: {
    _ME: injectOffsUniModule(options)
  },
  resolve: {
    alias: {
      '@offs/uni': path.resolve(__dirname, 'packages/uni/src'), // 指定库的路径
      '@offs/core': path.resolve(__dirname, 'packages/core/src') // 指定库的路径
    },
  },
  base: "./", // 确保路径相对
});

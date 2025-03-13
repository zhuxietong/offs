import { offsStylePlugin, offsRouterPlugin, offsComponentPlugin } from './plugin/index';
import { defineConfig } from 'vite';
import path from 'path';

import uni from '@dcloudio/vite-plugin-uni';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    offsStylePlugin({ outDir: 'src' }),
    offsRouterPlugin({}),
    offsComponentPlugin({
      copyFiles:['style.scss', 'init.ts','global.d.ts','project.global.ts','ky.api.ts'],
    })
  ],
  server: {
    port: 9103, // 设置开发服务器的端口号
    host: '0.0.0.0', // 可选：允许外部设备访问
    fs: {
      allow: [
        // 允许访问项目根目录以外的路径
        '/Users/zhuxietong/Desktop/offs/packages',
        path.resolve(__dirname, 'node_modules/@offs/uni/src'),
      ],
    },
    watch: {
      ignored: [
        '!/Users/zhuxietong/Desktop/offs/packages/uni',
        `!${path.resolve(__dirname, 'node_modules/@offs/uni/src/**')}`,
        `${path.resolve(__dirname, 'src/.offs/gen')}`,
      ],
      followSymlinks: true,
      usePolling: true,
      interval: 200,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "src/uni.scss";
        `,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 指定库的路径
      '@offs/uni': path.resolve(__dirname, 'node_modules/@offs/uni/src'), // 指定库的路径
      // '@offs/uni': path.resolve('/Users/zhuxietong/Desktop/offs/packages/uni/src') // 指定库的路径
    },
  },
});

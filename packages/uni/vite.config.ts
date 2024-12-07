import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    // @ts-ignore
    dts({
      include: ['src/**/*.ts', 'src/**/*.d.ts', 'src/vue-extensions.d.ts', 'src/**/*.vue'],
      outDir: 'dist/types',
      copyDtsFiles: true
    }),
  ],
  resolve: {
    alias: {
      '#': path.resolve(__dirname, 'src'), // 指定库的路径
    },
  },
  preprocessorOptions: {
    scss: {
      additionalData: `@use "./src/components/form/form.scss" as *;
      @use "./src/style.scss" as *;`
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'OffsUni',
      fileName: (format) => `offs-uni.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue', 'vue-router', '@offs/core', '@dcloudio/uni-app', 'dayjs'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          '@offs/core': 'OffsCore',
          dayjs: 'dayjs',
        },
        exports: 'named',
      },
    },
    sourcemap: true,
    minify: 'terser',
    emptyOutDir: false,
  },
});

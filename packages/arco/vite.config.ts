import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue(),
    // @ts-ignore
    dts({
      entryRoot: 'src',
      outDir: 'dist/types',
      include: ['src/**/*.ts', 'src/**/*.d.ts'],
      tsconfigPath: './tsconfig.json',
      copyDtsFiles: true,
      beforeWriteFile: (filePath, content) => {
        // 可以在这里修改生成的类型声明文件内容
        return {
          filePath,
          content
        }
      }
    }),

  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'OffsCore',
      fileName: (format) => `offs-arco.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue', 'vue-router', '@offs/core',"@offs/vue", 'dayjs'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          '@offs/core': 'OffsCore',
          '@offs/Vue': 'OffsVue',
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

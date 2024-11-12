import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue(),
    // @ts-ignore
    dts({
      include: ['src/**/*.ts', 'src/**/*.d.ts', 'src/vue-extensions.d.ts', 'src/**/*.vue'],
      outDir: 'dist/types',
      copyDtsFiles: true,

    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'OffsVue',
      fileName: (format) => `offs-vue.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue', 'vue-router', '@offs/core', 'dayjs'],
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

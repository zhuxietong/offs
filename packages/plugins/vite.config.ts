import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'


export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.d.ts'],
      outDir: 'dist/types',
      copyDtsFiles: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'OffsPlugins',
      fileName: (format) => `offs-plugins.${format}.js`,
      formats: ['es', 'cjs'], // 确保生成 ESM 和 CommonJS 格式
    },
    rollupOptions: {
      output: {
        globals: {
          '@offs/plugins': 'OffPlugins'
        }
      }
    }
  }
})

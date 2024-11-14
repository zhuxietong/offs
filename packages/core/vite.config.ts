import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.d.ts', 'src/vue-extensions.d.ts', 'src/**/*.vue'],
      copyDtsFiles: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'OffsCore',
      fileName: (format) => `offs-core.${format}.js`
    },
    rollupOptions: {
      external: ['vue', '@offs/core'],
      output: {
        globals: {
          vue: 'Vue',
          '@offs/core': 'OffsCore'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  }
})
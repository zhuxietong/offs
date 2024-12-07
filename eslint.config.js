import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import tsEslint from '@typescript-eslint/eslint-plugin'
export default [
  {
    rules: {
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-explicit-any': 'off',
      'no-namespace': 'off',
    },
  },
  {
    // 指定语言选项
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    // 启用 Vue 插件
    plugins: {
      vue: pluginVue,
      '@typescript-eslint': tsEslint,
    },
    // 全局配置
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },
  // 针对 TypeScript 和 Vue 文件的规则
  {
    files: ['**/*.{ts,mts,tsx,vue}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-namespace': 'off',
      "no-async-promise-executor": "off",
    },
  },
  // 忽略文件配置
  {
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },
  // 导入其他配置
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  skipFormatting,
]

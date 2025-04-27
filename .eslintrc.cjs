/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  globals: {
    $: 'readonly' // 这里的 "readonly" 表示全局变量 `$` 是只读的
  },
  ignorePatterns: ['public/*', 'src/static/*'], // 忽略public目录下的所有文件
  parserOptions: {
    ecmaVersion: 'latest',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    'no-unused-vars': 'off',
    'no-case-declarations': 'off',
    'no-constant-condition': 'off'
  }
}

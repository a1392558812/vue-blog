/*
 * @Author: Awen 1392558812@qq.com
 * @Date: 2022-06-17 10:43:38
 * @LastEditors: Awen 1392558812@qq.com
 * @LastEditTime: 2022-06-17 13:33:18
 * @FilePath: \vue-blog\.eslintrc.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = {
  root: true,

  env: {
    node: true,
    jquery: true
  },

  extends: ['plugin:vue/vue3-essential', '@vue/standard'],

  parserOptions: {
    parser: 'babel-eslint'
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'new-cap': 'off',
    'vue/no-v-model-argument': 0,
    // 关闭驼峰命名规则
    'vue/multi-word-component-names': 0
  },

  extends: ['plugin:vue/essential', '@vue/standard']
}

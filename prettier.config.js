/*
 * @Author: Awen 1392558812@qq.com
 * @Date: 2022-06-17 11:31:12
 * @LastEditors: Awen 1392558812@qq.com
 * @LastEditTime: 2022-06-17 11:42:51
 * @FilePath: \vue-blog\prettier.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = {
  tabWidth: 2, // 一个tab代表几个空格数，默认就是2
  useTabs: false, // 启用tab取代空格符缩进，默认为false
  semi: false, // 行尾是否使用分号，默认为true
  singleQuote: true, // 字符串是否使用单引号，默认为false，即使用双引号，建议设true，即单引号
  quoteProps: 'as-needed', // 给对象里的属性名是否要加上引号，默认为as-needed，即根据需要决定，如果不加引号会报错则加，否则不加
  trailingComma: 'es5', // 是否使用尾逗号，有三个可选值"<none|es5|all>"
  jsxSingleQuote: false, // 在jsx里是否使用单引号，你看着办
  bracketSpacing: true // 对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
}
<template>
  <div class="width100 overflow-y-auto tribute-main">
    <tribute class="tribute" />
    <asyncTribute class="tribute" />
    <pre class="overflow-y-auto pre">
      {
        // 开始查找的符号或字符串
        trigger: '@',

        // 异步加载时间（自己新添的）
        searchDebounce:0,

        // @提到的目标元素
        iframe: null,

        // 在弹出菜单中为活动项添加的类
        selectClass: 'highlight',

        // 菜单容器class
        containerClass: 'tribute-container',

        // 菜单列表item的类
        itemClass: '',

        // select插入回调
        selectTemplate: function (item) {
          return '@' + item.original.value;
        },

        // menu中item模板
        menuItemTemplate: function (item) {
          return item.string;
        },

        // 无匹配模板显示该模板
        // 默认隐藏
        noMatchTemplate: null,

        // 为菜单指定另一个父容器
        // 容器必须是菜单正确显示的定位元素，即“position:relative`
        // /默认容器是body
        menuContainer: document.body,

        // 对象中要搜索的列（接受函数或字符串）
        lookup: 'key',

        // 默认情况下包含要插入内容的列
        fillAttr: 'value',

        // emmmmmmm,values
        values: [],

        // 当您的值函数为异步时，将显示一个可选的加载模板
        loadingItemTemplate: null,

        // 指定触发器字符串之前是否需要空格
        requireLeadingSpace: true,

        // 指定是否允许在@中间使用空格
        allowSpaces: false,

        // 可选地为替换文本指定自定义后缀
        // （如果未定义，则默认为空白）
        replaceTextSuffix: '\n',

        // 确定menu何时被定为. 设为flase且与menuContainer结合使用创建行内menu
        // (defaults to true)
        positionMenu: true,

        // 按下空格键时，选择当前匹配项
        spaceSelectsMatch: false,

        // turn tribute into an autocomplete自动填充
        autocompleteMode: false,

        // Customize the elements used to wrap matched strings within the results list
        // 在结果列表中自定义用于包装匹配字符串的元素
        // defaults to <span></span> if undefined
        searchOpts: {
          pre: '<span>',
          post: '</span>',
          skip: false // true will skip local search, useful if doing server-side search
        },

        // Limits the number of items in the menu
        menuItemLimit: 25,

        // specify the minimum number of characters that must be typed before menu appears
        menuShowMinLength: 0
      }
    </pre>
  </div>
</template>

<script>
import asyncTribute from './components/async-tribute/index.vue'
import tribute from './components/tribute/index.vue'
export default {
  name: 'view-demo-mention-function',
  components: {
    asyncTribute,
    tribute
  },
  setup() {
    return {}
  }
}
</script>

<style scoped lang="scss">
.tribute-main {
  height: 100vh;
  .tribute {
    padding: 20px 50px;
    border: 1px solid #ff0000;
  }
  .pre {
    max-height: 500px;
    max-width: 800px;
    border: 1px solid #ff0000;
    font-size: 16px;
  }
}
</style>

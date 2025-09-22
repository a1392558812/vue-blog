<template>
  <div class="h-screen overflow-auto bg-gradient-to-br from-indigo-50 to-purple-50">
    <div class="w-[1200px] mx-auto px-4 py-12">
      <!-- 页面标题 -->
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          @提及功能的同步和异步实现方式
        </h1>
      </div>

      <div class="w-full overflow-y-auto">
        <!-- 同步提及组件 -->
        <div class="mb-10 bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">同步提及功能</h2>
          <tribute class="tribute" />
        </div>

        <!-- 异步提及组件 -->
        <div class="mb-10 bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">异步提及功能</h2>
          <asyncTribute class="tribute" />
        </div>

        <!-- 配置说明 -->
        <div class="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">配置参数说明</h2>
          <pre class="overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-200 font-mono text-sm max-h-96">
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
      </div>
    </div>
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
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>

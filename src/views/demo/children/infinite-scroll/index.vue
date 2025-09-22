<template>
  <div class="h-screen overflow-auto bg-gradient-to-br from-indigo-50 to-purple-50">
    <div class="w-[1200px] mx-auto px-4 py-12">
      <!-- 页面标题 -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          无限滚动演示
        </h1>
      </div>

      <div class="infinite-scroll-wrap flex flex-col md:flex-row gap-8">
        <!-- 滚动信息卡片 -->
        <div class="bg-white p-6 rounded-xl shadow-md w-full md:w-1/4">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">滚动信息</h2>
          <div class="space-y-3 text-gray-700">
            <div class="flex items-center gap-2">
              <span class="text-indigo-600 font-medium w-24">X坐标:</span>
              <span class="bg-gray-100 px-3 py-1 rounded-full">{{ scrollInfo.x }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-indigo-600 font-medium w-24">Y坐标:</span>
              <span class="bg-gray-100 px-3 py-1 rounded-full">{{ scrollInfo.y }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-indigo-600 font-medium w-24">滚动状态:</span>
              <span class="bg-gray-100 px-3 py-1 rounded-full">
                {{ scrollInfo.isScrolling ? '正在滚动' : '已停止' }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-indigo-600 font-medium w-24">触及方向:</span>
              <span class="bg-gray-100 px-3 py-1 rounded-full">{{ scrollInfo.arrivedState }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-indigo-600 font-medium w-24">滚动方向:</span>
              <span class="bg-gray-100 px-3 py-1 rounded-full">{{ scrollInfo.directions }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-indigo-600 font-medium w-24">数据总量:</span>
              <span class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-semibold">
                {{ dataList.length }} 条
              </span>
            </div>
          </div>
        </div>

        <!-- 无限滚动区域 -->
        <div class="w-full md:w-3/4">
          <div class="bg-white p-6 rounded-xl shadow-md mb-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold text-gray-800">无限滚动列表</h2>
              <button @click="refreshList"
                class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200">
                刷新数据
              </button>
            </div>
            <div class="text-sm text-gray-500 mb-4">
              向下滚动到底部加载更多数据...
            </div>
            <div ref="infiniteScroll" class="overflow-auto infinite-scroll bg-gray-50 rounded-lg">
              <div class="infinite-scroll-item" v-for="(item, index) in dataList" :key="index">
                <div
                  class="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between">
                  <span class="font-medium text-gray-800">{{ item.name }}</span>
                  <span class="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">
                    #{{ index + 1 }}
                  </span>
                </div>
              </div>
              <div v-if="loading" class="flex items-center justify-center p-6">
                <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mr-3"></div>
                <span class="text-gray-600">加载中...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useInfiniteScroll, useScroll } from '@vueuse/core'

let dataIndex = 0
const getData = () => {
  return new Promise((resolve) => {
    const list = []
    for (let index = dataIndex; index < dataIndex + 20; index++) {
      list.push({
        name: `新数据-${index + 1}`
      })
    }
    dataIndex += 10
    setTimeout(() => {
      resolve(list)
    }, 1500)
  })
}
export default {
  name: 'view-demo-infinite-scroll',
  setup() {
    const infiniteScroll = ref(null)
    const loading = ref(true)
    const dataList = ref([])
    const getList = () => {
      loading.value = true
      getData().then((res) => {
        dataList.value = dataList.value.concat(res)
        loading.value = false
      })
    }

    const refreshList = () => {
      dataIndex = 0
      dataList.value = []
      getList()
    }

    useInfiniteScroll(
      infiniteScroll,
      () => {
        // load more
        if (!loading.value) {
          getList()
        }
      },
      { distance: 10 }
    )
    getList()
    return {
      infiniteScroll,
      dataList,
      loading,
      scrollInfo: useScroll(infiniteScroll),
      refreshList
    }
  }
}
</script>

<style scoped lang="scss">
.infinite-scroll-wrap {
  height: 100%;

  .infinite-scroll {
    height: 500px;

    .infinite-scroll-item {
      width: 100%;
    }
  }
}

/* 自定义滚动条样式 */
.infinite-scroll::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.infinite-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.infinite-scroll::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.infinite-scroll::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

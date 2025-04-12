<template>
  <div class="infinite-scroll-wrap">
    <div>
      <div>X坐标{{ scrollInfo.x }},Y坐标{{ scrollInfo.y }}</div>
      <div>是否正在滚动{{ scrollInfo.isScrolling }}</div>
      <div>触及方向{{ scrollInfo.arrivedState }}</div>
      <div>滚动方向{{ scrollInfo.directions }}</div>
    </div>
    <div ref="infiniteScroll" class="overflow-auto infinite-scroll">
      <div class="infinite-scroll-item" v-for="(item, index) in dataList" :key="index">
        <div>{{ item.name }}</div>
      </div>
      <div v-if="loading" class="flex items-center justify-center">加载中.....</div>
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
    useInfiniteScroll(
      infiniteScroll,
      () => {
        // load more
        getList()
      },
      { distance: 10 }
    )
    getList()
    return {
      infiniteScroll,
      dataList,
      loading,
      scrollInfo: useScroll(infiniteScroll)
    }
  }
}
</script>

<style scoped lang="scss">
.infinite-scroll-wrap {
  height: 100vh;
  .infinite-scroll {
    height: 500px;
    width: 300px;
    border: 1px solid #000;
    .infinite-scroll-item {
      width: 350px;
      padding: 10px 20px;
      font-size: 16px;
      .mock-image {
      }
    }
  }
}
</style>

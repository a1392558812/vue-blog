<template>
    <div ref="infiniteScroll" class="infinite-wrap overflow-y-auto">
        <div class="text-label flex align-items-center justify-content-center">瀑布流高度会等比缩放</div>
        <div style="margin-bottom: 20px" class="flex align-items-center justify-content-center">
            <div style="margin-right: 20px">当前瀑布流类型: </div>
            <div class="scroll-item cursor-pointer" v-for="(item, index) in componentsList" @click="handleSelect(item, index)" :key="item.name" :style="{ background: index === currentComponentIndex ? '#ef475d' : '' }">{{ item.label }}</div>
        </div>
        <component :is="componentsList[currentComponentIndex].name" :frame="[[1,1,2,3,3],[1,1,4,4,5]]" v-if="list.length" :useFit="false" :gap="20" ref="infiniteGrid" class="container" :sizeRange="[200, Infinity]">
            <div class="item flex flex-direction-column justify-content-center" v-for="(item, index) in list" :style="item.style" :key="index">
                <div style="margin-bottom: 10px">第{{ index }}个</div>
                <div style="margin-bottom: 10px">默认style</div>
                <div style="margin-bottom: 10px" v-for="key in Object.keys(item.style)" :key="`${key}-${index}`">{{ key }}: {{ item.style[key] }}</div>
            </div>
        </component>
        <div class="text-label flex align-items-center justify-content-center" v-if="loading">loading...</div>
    </div>
</template>
<script>
import { JustifiedInfiniteGrid, MasonryInfiniteGrid, FrameInfiniteGrid, PackingInfiniteGrid } from '@egjs/vue3-infinitegrid'
import { ref } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'

import { randomXtoY, getRandomColor } from '@/common/util/methods'

export default {
  components: {
    JustifiedInfiniteGrid,
    MasonryInfiniteGrid,
    FrameInfiniteGrid,
    PackingInfiniteGrid
  },
  setup () {
    const list = ref([])
    const componentsList = ref([
      {
        name: 'JustifiedInfiniteGrid',
        label: '动态定高',
        getWidth: () => `${randomXtoY(100, 300)}px`,
        getHeight: () => `${randomXtoY(100, 300)}px`
      },
      {
        name: 'MasonryInfiniteGrid',
        label: '动态定宽',
        getWidth: () => '300px',
        getHeight: () => `${randomXtoY(300, 500)}px`
      },
      {
        name: 'FrameInfiniteGrid',
        label: '动态比例',
        getWidth: () => `${randomXtoY(100, 300)}px`,
        getHeight: () => `${randomXtoY(100, 300)}px`
      },
      {
        name: 'PackingInfiniteGrid',
        label: '比例缩放',
        getWidth: () => `${randomXtoY(100, 300)}px`,
        getHeight: () => `${randomXtoY(100, 300)}px`
      }
    ])
    const currentComponentIndex = ref(0)

    const infiniteScroll = ref(null)
    const infiniteGrid = ref(null)

    const loading = ref(false)

    const getList = () => {
      if (loading.value) return
      loading.value = true
      setTimeout(() => {
        console.log('getList')
        const length = list.value.length
        const listArr = []

        for (let i = 0; i < 30; i++) {
          listArr.push({
            groupKey: length + i,
            style: {
              width: componentsList.value[currentComponentIndex.value].getWidth(),
              height: componentsList.value[currentComponentIndex.value].getHeight(),
              background: getRandomColor()
            },
            key: length + i
          })
        }

        list.value = list.value.concat(listArr)
        loading.value = false
      }, 2500)
    }

    const handleSelect = (item, index) => {
      if (currentComponentIndex.value === index) return
      if (loading.value === true) return
      currentComponentIndex.value = index
      list.value = []
      getList()
    }

    getList()

    useInfiniteScroll(
      infiniteScroll,
      () => {
        // load more
        getList()
      },
      { distance: 10 }
    )
    return {
      list,
      handleSelect,
      currentComponentIndex,
      componentsList,
      infiniteScroll,
      infiniteGrid,
      loading
    }
  }
}
</script>
<style scoped lang="scss">
.infinite-wrap {
    height: 100vh;
    padding: 0 20px;
    .scroll-item {
        margin-right: 10px;
        padding: 3px 10px;
        border-radius: 10px;
    }
    .container {
        min-height: calc(100% + 10px);
        .item {
            border: 1px solid #000;
            transition: all 0.5s;
        }
    }
    .text-label {
        padding: 20px 0;
        font-size: 16px;
    }
}
</style>

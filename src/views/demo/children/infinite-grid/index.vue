<template>
    <div ref="infiniteScroll" class="infinite-wrap overflow-y-auto">
        <div class="text-label flex align-items-center justify-content-center">瀑布流高度会等比缩放</div>
        <JustifiedInfiniteGrid v-if="list.length" :useFit="false" :gap="20" ref="infiniteGrid" class="container" :sizeRange="[200, Infinity]">
            <div class="item flex flex-direction-column justify-content-center" v-for="(item, index) in list" :style="item.style" :key="index">
                <div style="margin-bottom: 10px">第{{ index }}个</div>
                <div style="margin-bottom: 10px">默认style</div>
                <div style="margin-bottom: 10px" v-for="key in Object.keys(item.style)" :key="`${key}-${index}`">{{ key }}: {{ item.style[key] }}</div>
            </div>
        </JustifiedInfiniteGrid>
        <div class="text-label flex align-items-center justify-content-center" v-if="loading">loading...</div>
    </div>
</template>
<script>
import { JustifiedInfiniteGrid } from '@egjs/vue3-infinitegrid'
import { ref } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'

import { randomXtoY } from '@/common/methods'

export default {
  components: {
    JustifiedInfiniteGrid
  },
  setup () {
    const list = ref([])

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
        const bgColor = () => `#${randomXtoY(0, 16).toString(16)}${randomXtoY(0, 16).toString(16)}${randomXtoY(0, 16).toString(16)}${randomXtoY(0, 16).toString(16)}${randomXtoY(0, 16).toString(16)}${randomXtoY(0, 16).toString(16)}`
        for (let i = 0; i < 30; i++) {
          listArr.push({
            groupKey: length + i,
            style: { width: `${randomXtoY(100, 300)}px`, height: `${randomXtoY(100, 300)}px`, background: bgColor() },
            key: length + i
          })
        }
        list.value = list.value.concat(listArr)
        loading.value = false
      }, 2500)
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

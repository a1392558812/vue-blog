<template>
    <div class="flex flex-direction-column relative virtual-scroller">
        <div class="flex align-items-center justify-content-center virtual-scroller-header">
            <div style="margin-right: 10px">当前记录条数: {{ list.length }}</div>
            <button v-if="loading">加载中...</button>
            <template v-else>
                <button class="virtual-scroller-header-btn" @click="onSetList">重置列表为<input class="num-input" @click.stop="() => {}" v-model.number="listNum"/>条</button>
                <button class="virtual-scroller-header-btn" @click="onScrollTo">滚动到第<input class="num-input" @click.stop="() => {}" v-model.number="scrollToIndex"/>条</button>
                <button class="virtual-scroller-header-btn" @click="onAddList">添加<input class="num-input" @click.stop="() => {}" v-model.number="addListNum"/>条记录</button>
            </template>
        </div>
        <div class="flex-1 overflow-y-hidden">
            <DynamicScroller ref="scrollerRef" :items="list" :min-item-size="500" :buffer="1000" class="scroller" @scroll-end="onScrollEnd">
                <template #before>
                    <div style="margin-bottom: 20px" class="dynamic-scroller-slot flex align-items-center justify-content-center">🥵插槽头部🥵</div>
                </template>
                <template v-slot="{ item, index, active }">
                    <DynamicScrollerItem :item="item" :active="active" :size-dependencies="[ item.width, item.hegiht ]" :data-index="index">
                        <div class="dynamic-scroller-item flex align-items-center justify-content-center">
                            <div :id="`item-${index}`" class="dynamic-scroller-item-content" :key="item.id" :style="{width: `${item.width}px`, height: `${item.height}px`, background: item.background}" >
                                <div>width: {{ item.width }}</div>
                                <div>hegiht: {{ item.hegiht }}</div>
                                <div>id: {{ item.id }}</div>
                                <div>background: {{ item.background }}</div>
                                <div>index: {{ index }}</div>
                                <div>active: {{ active }}</div>
                                <button @click="onSetSize(item, index)">重置当前size,变高点</button>
                            </div>
                        </div>
                    </DynamicScrollerItem>
                </template>
                <template #after>
                    <div style="margin-top: 20px" class="dynamic-scroller-slot flex align-items-center justify-content-center">🥵{{ loading ? 'loading....' : '插槽底部' }}🥵</div>
                </template>
            </DynamicScroller>
        </div>
        <div class="flex align-items-center justify-content-center virtual-scroller-bottom">
            #footer
        </div>
        <toast ref="toastRef"/>
    </div>
</template>
<script>
import { ref } from 'vue'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

import toast from '@/components/common/toast/index.vue'

import { randomXtoY, getRandomColor } from '@/common/methods'
import guid from '@/common/util/guid'
import { isNumber } from '@/common/util/typeCheck'

const getWidth = () => randomXtoY(400, 800)
const getHeight = () => randomXtoY(300, 550)

const listCreate = (num = 30) => {
  const list = []
  for (let i = 0; i < num; i++) {
    list.push({
      height: getHeight(),
      width: getWidth(),
      id: guid(),
      background: getRandomColor()
    })
  }
  return list
}
export default {
  components: {
    DynamicScroller,
    DynamicScrollerItem,
    toast
  },
  setup () {
    const list = ref([])
    const loading = ref(false)
    const scrollToIndex = ref(0)
    const listNum = ref(10)
    const addListNum = ref(1)

    const scrollerRef = ref(null)
    const toastRef = ref(null)

    const getList = (num, init = false) => {
      return new Promise((resolve) => {
        if (loading.value) return resolve()
        loading.value = true
        setTimeout(() => {
          if (init) {
            list.value = listCreate(num)
          } else {
            list.value = list.value.concat(listCreate(num))
          }
          loading.value = false
          resolve()
        }, 1000)
      })
    }

    getList(10).then()

    return {
      list,
      loading,
      scrollerRef,
      toastRef,
      scrollToIndex,
      listNum,
      addListNum,
      onSetSize: (row, index) => {
        list.value[index].width = getWidth()
        list.value[index].height = randomXtoY(600, 1000)
        list.value[index].background = getRandomColor()
      },
      onScrollEnd: () => {
        toastRef.value.addToast({ content: '即将滚动到底部' })
      },
      onScrollTo: () => {
        if (scrollToIndex.value === null) return

        if (!isNumber(+scrollToIndex.value) || Number.isNaN(+scrollToIndex.value)) {
          alert('请输入数字')
          return
        }

        const index = +scrollToIndex.value

        if (index > list.value.length - 1 || index < 0) {
          alert('请输入正确数字范围')
          return
        }

        scrollerRef.value.scrollToItem(index)
      },
      onSetList: () => {
        if (listNum.value === null) return

        if (!isNumber(+listNum.value) || Number.isNaN(+listNum.value)) {
          alert('请输入数字')
          return
        }
        getList(+listNum.value, true).then()
      },
      onAddList: () => {
        if (listNum.value === null) return

        if (!isNumber(+listNum.value) || Number.isNaN(+listNum.value)) {
          alert('请输入数字')
          return
        }
        getList(addListNum.value).then(() => {
          scrollerRef.value.scrollToItem(list.value.length - 1)
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
.virtual-scroller {
    height: 100vh;
    .virtual-scroller-header {
        padding: 30px;
        border-bottom: 1px solid #000;
        .virtual-scroller-header-btn {
            margin-right: 30px;
            .num-input {
                width: 5em;
                padding: 5px 10px;
            }
        }
    }
    .scroller {
        height: 100%;
        background: #FB7299;
        .dynamic-scroller-item-content {
            margin: 10px;
            padding: 10px;
            border: 1px solid #000;
        }
        .loading-more {
            height: 800px;
        }
        .dynamic-scroller-slot {
            padding: 50px;
            border: 1px solid #000;
            background: skyblue;
        }
    }
    .virtual-scroller-bottom {
        padding: 30px;
        border-top: 1px solid #000;
    }
}
</style>

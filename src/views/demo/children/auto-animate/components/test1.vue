<template>
  <div>
    <button @click="addItem">添加一个item</button>
    <div ref="content" class="flex items-center flex-wrap">
      <div
        class="item cursor-pointer"
        @click="deleteItem(index)"
        v-for="(item, index) in list"
        :key="item"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import { useAutoAnimate } from '@formkit/auto-animate/vue'
export default {
  name: 'auto-animate-test1',
  setup() {
    const [content] = useAutoAnimate({ duration: 200 })
    const list = ref([0, 1, 2, 3, 4])
    const addItem = () => {
      list.value.push(list.value.length)
    }
    const deleteItem = (index) => {
      list.value = list.value.filter((item, itemIndex) => itemIndex !== index)
    }
    return {
      content,
      list,
      addItem,
      deleteItem
    }
  }
}
</script>
<style scoped lang="scss">
.item {
  padding: 5px 10px;
  font-size: 16px;
  border: 1px solid #000;
  margin: 10px;
}
</style>

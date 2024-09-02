<template>
  <div>
    <button @click="toggleExpand">不定高展开</button>
    <div ref="content" style="background: red">
      <div v-if="ifExpand" :style="expandStyle">当前随机高度: {{ expandStyle }}</div>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import { useAutoAnimate } from '@formkit/auto-animate/vue'

import { randomXtoY } from '@/common/util/methods'
export default {
  name: 'auto-animate-test2',
  setup() {
    const [content] = useAutoAnimate({ duration: 300 })
    const expandStyleFun = () => ({ height: `${randomXtoY(50, 300)}px` })
    const ifExpand = ref(false)
    const expandStyle = ref(expandStyleFun())
    const iframe = ref(null)

    const toggleExpand = () => {
      ifExpand.value = !ifExpand.value
      if (ifExpand.value) {
        Object.assign(expandStyle.value, expandStyleFun())
      }
    }

    return {
      iframe,
      content,
      ifExpand,
      expandStyle,
      toggleExpand
    }
  }
}
</script>

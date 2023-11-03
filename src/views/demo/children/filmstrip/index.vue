<template>
    <div class="reveal-viewport">
        <div ref="reveal" class="reveal">
            <!-- Any section element inside of this container is displayed as a slide -->
            <div class="slides">
                <component v-for="(component, index) in sectionComponents" :is="component" :key="index" :baseUrl="baseUrl" />
            </div>
        </div>
    </div>
</template>
<script>
import Reveal from 'reveal.js'

import Highlight from 'reveal.js/plugin/highlight/highlight.esm.js'
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js'
import CustomMath from 'reveal.js/plugin/math/math.esm.js'
import notes from 'reveal.js/plugin/notes/notes.esm.js'
import search from 'reveal.js/plugin/search/search.esm.js'
import Zoom from 'reveal.js/plugin/zoom/zoom.esm.js'

import importFun from '@/common/util/importFile'
import { baseUrlFun } from '@/common/methods'

import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/black.css'
import 'reveal.js/plugin/highlight/monokai.css'

import { onMounted, ref } from 'vue'

const sectionMap = importFun(/\.vue$/g)(require.context('./components', true, /\.vue$/)) // 利用柯里化先生成引入函数

const sectionComponents = []
for (const component in sectionMap) {
  sectionComponents.push(component)
}

sectionComponents.sort((pre, next) => (+pre.replace(/\D/g, '')) - (+next.replace(/\D/g, '')))

export default {
  components: {
    ...sectionMap
  },
  setup () {
    const reveal = ref(null)
    const baseUrl = baseUrlFun()
    onMounted(() => {
      const deck = new Reveal({
        controls: true,
        progress: true,
        center: true,
        hash: false,
        // Learn about plugins: https://revealjs.com/plugins/
        plugins: [Markdown, Zoom, Highlight, CustomMath, search, notes]
      })
      deck.initialize().then(() => {
        console.log('ready-mount')
      })
    })
    return {
      reveal,
      sectionComponents: ref(sectionComponents),
      baseUrl
    }
  }
}
</script>
<style scoped lang="scss">
.reveal {
    width: 100vw;
    height: 100vh;
}
</style>

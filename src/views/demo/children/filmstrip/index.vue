<template>
  <div class="reveal-viewport">
    <div ref="reveal" class="reveal">
      <!-- Any section element inside of this container is displayed as a slide -->
      <div class="slides">
        <component
          @showNotes="toggleNotes"
          @showHelp="showHelp"
          v-for="(component, index) in sectionComponents"
          :is="component"
          :key="index"
          :baseUrl="baseUrl"
        />
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

import { isNumber } from '@/common/util/typeCheck'
import { baseUrlFun } from '@/common/util/methods'

import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/black.css'
import 'reveal.js/plugin/highlight/monokai.css'

import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

let sectionMap = import.meta.glob('./components/*.vue', { eager: true })

const sectionComponents = []
const componentsMap = {}

for (const componentPath in sectionMap) {
  const pathList = componentPath.split('/')
  const componentName = pathList[pathList.length - 1].split('.')[0]
  componentsMap[componentName] = sectionMap[componentPath].default
  sectionComponents.push(componentName)
}
sectionMap = null

sectionComponents.sort((pre, next) => +pre.replace(/\D/g, '') - +next.replace(/\D/g, '')) // 按照组件名中的数字大小排序

export default {
  name: 'view-demo-filmstrip',
  components: componentsMap,
  setup() {
    const router = useRouter()
    const route = useRoute()
    const reveal = ref(null)
    const baseUrl = baseUrlFun()
    let showNotes = false // 是否显示笔记

    const toggleNotes = () => {
      showNotes = !showNotes
      console.log('showNotes:', deck.getSlideNotes())
      deck.configure({ showNotes })
    }

    let deck
    onMounted(() => {
      deck = new Reveal({
        controls: true,
        progress: true,
        center: true,
        hash: false,
        plugins: [Markdown, Zoom, Highlight, CustomMath, search, notes]
      })
      deck.initialize().then(() => {
        // 初始化如果路由有记录，滚动到记录点
        if (route.query.page) {
          deck.slide(...route.query.page.split('-'))
        }
      })
      deck.configure({
        keyboard: {
          27: (data) => {
            console.log('esc', data, deck.isOverview())
            deck.toggleHelp(false)
            deck.toggleOverview()
          }, // do something custom when ESC is pressed
          13: (data) => {
            deck.prev()
            console.log('enter按下', data)
          }, // go to the next slide when the ENTER key is pressed
          32: (data) => {
            console.log('space按下', data)
            deck.next()
          },
          83: (data) => {
            console.log('S按下', data)
            toggleNotes()
          }
        }
      })
      deck.on('customevent', () => {
        console.log('自定义触发')
      })
      deck.on('slidechanged', ({ indexh, indexv }) => {
        const params = isNumber(indexv) ? `${indexh}-${indexv}` : `${indexh}`
        router.push(`/demo/filmstrip?page=${params}`)
      })
    })
    return {
      reveal,
      sectionComponents: ref(sectionComponents),
      baseUrl,
      showHelp: () => {
        deck.toggleHelp()
      },
      toggleNotes
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

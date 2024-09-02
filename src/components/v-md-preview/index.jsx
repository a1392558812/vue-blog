import { defineAsyncComponent } from 'vue'
import { baseUrlFun, asyncLoadJs } from '@/common/util/methods.js'
import loadingComponent from '@/components/loading/loading.vue'

const wrapComponent = (
  <div style="min-height: 800px; font-size: 12px; font-weight: bold" class="width100 relative">
    <slot />
  </div>
)

export default defineAsyncComponent({
  loader: () => {
    return new Promise((resolve) => {
      const url = baseUrlFun() + 'demo-static/markdown-priview-vuecode/xiyueta/index.js'
      setTimeout(() => {
        const result = import('./v-md-preview.vue')
        asyncLoadJs(url).then(() => {
          resolve(result)
        })
      }, 500)
    })
  },
  errorComponent: () => {
    return (
      <wrapComponent class="flex align-items-center justify-content-center">
        <div style="font-size: 2.2rem; font-weight: 600; line-height: 1.25; color: var(--global-markdown-body-text-color)">
          加载错误，刷新浏览器试试
        </div>
      </wrapComponent>
    )
  },
  loadingComponent: () => {
    return (
      <wrapComponent>
        <loadingComponent style="background-color: transparent" showModal={true}>
          <div
            style="font-weight: bold"
            class="width100 height100 flex align-items-center justify-content-center"
          >
            加载中...
          </div>
        </loadingComponent>
      </wrapComponent>
    )
  }
})

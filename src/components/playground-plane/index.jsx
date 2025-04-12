import { defineAsyncComponent } from 'vue'
import loadingComponent from '@/components/loading/loading.vue'

export default defineAsyncComponent({
  loader: () => {
    return new Promise((resolve) => {
      const result = import('./playground-plane.vue')
      setTimeout(() => {
        resolve(result)
      }, 10000)
    })
  },
  errorComponent: () => <div>加载错误</div>,
  loadingComponent: () => {
    return (
      <div
        style="font-size: 12px; font-weight: 900; height: 100%;"
        class="flex w-[100%] items-center justify-center"
      >
        <div class="w-[100%] h-[100%] relative loading-wrap">
          <loadingComponent style="background: transparent" showModal={true}>
            <div class="w-[100%] h-[100%] flex items-center justify-center">
              加载中...
            </div>
          </loadingComponent>
        </div>
      </div>
    )
  }
})

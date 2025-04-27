import { defineAsyncComponent } from 'vue'
import loadingComponent from '@/components/loading/loading.vue'

export default defineAsyncComponent({
  loader: () => {
    return new Promise((resolve) => {
      const result = import('./playground-plane.vue')
      setTimeout(() => {
        resolve(result)
      }, 1000)
    })
  },
  errorComponent: () => <div>加载错误</div>,
  loadingComponent: () => {
    return (
      <div class="flex w-[100%] items-center justify-center text-[12px] font-900 h-[100%]">
        <div class="w-[100%] h-[100%] relative">
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

import { defineAsyncComponent } from 'vue'
import loadingComponent from '@/components/loading/loading.vue'

export default defineAsyncComponent({
  loader: () => {
    return new Promise(resolve => {
      const result = import('./playground-plane.vue')
      setTimeout(() => {
        resolve(result)
      }, 1000)
    })
  },
  errorComponent: () => <div>加载错误</div>,
  loadingComponent: () => {
    return (
        <div style="font-size: 12px; font-weight: 900; height: 100%;" class="flex width100 align-items-center justify-content-center">
            <div class="width100 height100 relative loading-wrap">
                <loadingComponent style="background: transparent" showModal={true}>
                    <div class="width100 height100 flex align-items-center justify-content-center">加载中...</div>
                </loadingComponent>
            </div>
        </div>
    )
  }
})

<template>
    <Suspense>
        <playgroundPlane v-bind="$attrs"/>
        <template #fallback>
            <div style="font-size: 12px; font-weight: 900; height: 330px;" class="flex width100 align-items-center justify-content-center">
                <div class="width100 height100 relative loading-wrap">
                    <loadingComponent style="background: transparent" :showModal="true" >
                        <div class="width100 height100 flex align-items-center justify-content-center">加载中...</div>
                    </loadingComponent>
                </div>
            </div>
        </template>
    </Suspense>
</template>
<script>
import { defineAsyncComponent } from 'vue'
import loadingComponent from '@/components/loading/loading.vue'
export default {
  components: {
    loadingComponent,
    playgroundPlane: defineAsyncComponent({
      loader: () => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(import('./playground-plane'))
          }, 0)
        })
      }
    })
  },
  setup (props, { attrs }) {
    console.log('attrs', attrs)
  }
}
</script>

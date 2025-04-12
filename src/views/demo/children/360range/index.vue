<template>
  <div class="w-[100%] h-[100%] relative panorama-wrap">
    <vr-component @select-marker="selectMarker" />
    <toast ref="toastRefDom" />
  </div>
</template>
<script>
import vr from './components/vr.vue'
import toast from '@/components/toast/index.vue'
import { ref } from 'vue'
export default {
  name: 'view-demo-360range',
  components: {
    vrComponent: vr,
    toast
  },
  setup() {
    const toastRefDom = ref(null)
    const selectMarker = ({ e, marker, data }) => {
      console.log('e, marker, data', { e, marker, data, value: toastRefDom.value })
      toastRefDom.value.addToast({
        content: `${marker.config.tooltip.toastContent}-marker标记被点击`
      })
    }
    return {
      toastRefDom,
      selectMarker
    }
  }
}
</script>
<style scoped lang="scss">
.panorama-wrap {
  height: 100vh;
}
</style>

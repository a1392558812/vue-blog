<template>
  <div class="width100 height100 relative panorama-wrap">
    <vrComponent @select-marker="selectMarker"/>
    <toast ref="toastRefDom"/>
  </div>
</template>
<script>
import vr from './components/vr.vue'
import toast from '@/components/common/toast/index.vue'
import { ref } from 'vue'
export default {
  components: {
    vrComponent: vr,
    toast
  },
  setup () {
    const toastRefDom = ref(null)
    const selectMarker = ({ e, marker, data }) => {
      console.log('e, marker, data', e, marker, data, toastRefDom.value)
      toastRefDom.value.addToast({
        content: `点击标记的内容：${marker.data.content}`
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
.panorama-wrap{
  height: 100vh;
}

</style>

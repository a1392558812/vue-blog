<template>
  <div class="overflow-hidden panorama">
    <iframe class="w-[100%] h-[100%]" :src="iframeSrc"></iframe>
  </div>
</template>
<script>
import { baseUrlFun } from '@/common/util/methods.js'
export default {
  name: 'view-demo-panorama',
  setup() {
    return {
      iframeSrc: `${baseUrlFun()}demo-static/vtour/tour.html`
    }
  }
}
</script>
<style scoped lang="scss">
.panorama {
  width: 100vw;
  height: 100vh;
}
</style>

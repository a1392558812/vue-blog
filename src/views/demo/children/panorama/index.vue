<template>
  <div class="overflow-hidden panorama">
    <iframe class="width100 height100" :src="iframeSrc"></iframe>
  </div>
</template>
<script>
import { baseUrlFun } from '@/common/methods.js'
export default {
  setup () {
    return {
      iframeSrc: `${baseUrlFun()}demo-static/vtour/tour.html`
    }
  }
}
</script>
<style scoped lang="scss">
.panorama{
  width: 100vw;
  height: 100vh;
}
</style>

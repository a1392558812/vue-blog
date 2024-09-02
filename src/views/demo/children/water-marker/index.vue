<template>
  <div
    v-water-marker="{
      text: '毫无意义的水印🐮🐮🐮🐮',
      textColor: 'rgba(255, 45, 26, 0.3)',
      size: 250
    }"
    class="width100"
    style="height: 100vh"
  ></div>
</template>
<script>
import waterMarker from '@/directive/waterMarker'

export default {
  name: 'view-demo-water-marker',
  directives: {
    waterMarker
  }
}
</script>

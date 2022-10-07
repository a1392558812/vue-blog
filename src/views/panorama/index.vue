<template>
  <div class="overflow-hidden panorama">
    <iframe class="width100 height100" :src="iframeSrc"></iframe>
  </div>
</template>
<script>
export default {
  setup () {
    const baseUrl = window.location.origin + window.location.pathname
    return {
      iframeSrc: `${baseUrl}vtour/tour.html`
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

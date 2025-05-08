<template>
  <div class="flex items-center justify-center my-signature">
    <svg>
      <image :href="signatureSvg" width="100%" height="100%" />
    </svg>
  </div>
</template>
<script setup>
import signatureSvg from '@/static/my-signature/signature.svg'
</script>
<style scoped>
.my-signature {
  width: 100vw;
  height: 100vh;
}
</style>

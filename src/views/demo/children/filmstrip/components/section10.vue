<template>
  <section data-auto-animate data-auto-animate-easing="cubic-bezier(0.770, 0.000, 0.175, 1.000)">
    <div class="r-hstack justify-center">
      <div
        data-id="box1"
        data-auto-animate-delay="0"
        style="background: cyan; width: 150px; height: 100px; margin: 10px"
      ></div>
      <div
        data-id="box2"
        data-auto-animate-delay="0.1"
        style="background: magenta; width: 150px; height: 100px; margin: 10px"
      ></div>
      <div
        data-id="box3"
        data-auto-animate-delay="0.2"
        style="background: yellow; width: 150px; height: 100px; margin: 10px"
      ></div>
    </div>
    <h2 style="margin-top: 20px">Auto-Animate使用</h2>
  </section>
</template>
<script setup>
defineOptions({ name: 'view-demo-filmstrip-section10' })
</script>

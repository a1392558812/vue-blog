<template>
  <section id="section28">
    <h2>打印为PDF</h2>
    <p class="cursor-pointer print-btn" @click="goToPrint">打印为Pdf一下</p>
    <div
      class="fixed flex align-items-center justify-content-center section-toast"
      @click="toastShow = false"
      v-if="toastShow"
    >
      <div class="section-toast-btn cursor-pointer" @click="onPrint">开始打印</div>
    </div>
  </section>
</template>
<script setup>
import { onMounted, ref, nextTick } from 'vue'

defineOptions({ name: 'view-demo-filmstrip-section28' })

const toastShow = ref(false)

const result = window.location.href.split('/?')[1]
if (result) {
  // 携带参数认为非初始化打开
  const printStr = result.split('#/')[0]
  if (printStr === 'print-pdf') {
    console.log('可以打印')
    onMounted(() => {
      $('#page').css('overflow', 'visible')
      toastShow.value = true
    })
  } else {
    const { origin, pathname, hash } = window.location
    console.log('不可以打印', window.location, origin, pathname, hash)
    window.location.href = origin + pathname + hash
  }
}

const onPrint = () => {
  toastShow.value = false
  nextTick().then(() => window.print())
}

const goToPrint = () => {
  if (typeof window.print !== 'undefined') {
    const { origin, pathname, hash } = window.location
    console.log('origin, pathname, hash', origin, pathname, hash, window.location)
    const printUrl = origin + pathname + '?print-pdf' + hash
    window.location.href = printUrl
  } else {
    alert('当前浏览器不支持打印功能！')
  }
}
</script>
<style scoped lang="scss">
.section-toast {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  left: 0;
  top: 0;
  .section-toast-btn {
    padding: 15px 30px;
    border-radius: 10px;
    color: #000;
    background: #fff;
    border: 1px solid #eee;
  }
}
.print-btn {
  padding: 10px 20px;
  border: 1px solid #eee;
  border-radius: 5px;
}
</style>

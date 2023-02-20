<template>
  <div class="overflow-auto relative parallax-scroll-content">
    <div class="absolute box">
      <div class="absolute box-50-50 box1"></div>
      <div class="absolute box-50-50 box2"></div>
      <div class="absolute box-50-50 box3"></div>
      <div class="absolute box-50-50 box4"></div>
      <div class="absolute box-50-50 box5"></div>
      <div class="absolute box-50-50 box6"></div>
      <div class="absolute box-50-50 box7"></div>
    </div>
    <div class="scroll-roll"></div>
    <div class="fixed tips" v-if="index">当前第{{ index }}动画完成</div>
  </div>
</template>
<script>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, ref, onUnmounted } from 'vue'

export default {
  setup () {
    const index = ref(0)
    const onComplete = (value) => {
      index.value = +value
      console.log(`第${value}个完成`)
    }
    const onRepeat = () => {
      console.log('onRepeat')
    }
    const onReverseComplete = () => {
      console.log('onReverseComplete动画反转')
    }
    onMounted(() => {
      gsap.registerPlugin(ScrollTrigger)
      gsap.timeline({
        scrollTrigger: {
          trigger: '.scroll-roll',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          markers: true
        }
      })
        .fromTo('.box1', { y: 0, x: 0, rotate: 0, ease: 'none' }, { x: '90vw', y: '100vh', rotate: 360 * 10, ease: 'none', onReverseComplete, onComplete: () => { onComplete(1) }, onRepeat }, '+=0')
        .fromTo('.box2', { y: 0, x: 0, rotate: 0, ease: 'none' }, { x: '90vw', y: '100vh', rotate: 360 * 10, ease: 'none', onReverseComplete, onComplete: () => { onComplete(2) }, onRepeat }, '+=0')
        .fromTo('.box3', { y: 0, x: 0, rotate: 0, ease: 'none' }, { x: '90vw', y: '100vh', rotate: 360 * 10, ease: 'none', onReverseComplete, onComplete: () => { onComplete(3) }, onRepeat }, '+=0')
        .fromTo('.box4', { y: 0, x: 0, rotate: 0, ease: 'none' }, { x: '90vw', y: '100vh', rotate: 360 * 10, ease: 'none', onReverseComplete, onComplete: () => { onComplete(4) }, onRepeat }, '+=0')
        .fromTo('.box5', { y: 0, x: 0, rotate: 0, ease: 'none' }, { x: '90vw', y: '100vh', rotate: 360 * 10, ease: 'none', onReverseComplete, onComplete: () => { onComplete(5) }, onRepeat }, '+=0')
        .fromTo('.box6', { y: 0, x: 0, rotate: 0, ease: 'none' }, { x: '90vw', y: '100vh', rotate: 360 * 10, ease: 'none', onReverseComplete, onComplete: () => { onComplete(6) }, onRepeat }, '+=0')
        .fromTo('.box7', { y: 0, x: 0, rotate: 0, ease: 'none' }, { x: '90vw', y: '100vh', rotate: 360 * 10, ease: 'none', onReverseComplete, onComplete: () => { onComplete(7) }, onRepeat }, '+=0')
    })
    onUnmounted(() => {
      const triggers = ScrollTrigger.getAll()
      triggers.forEach((trigger) => {
      // 把 ScrollTrigger 绑定的动画消除
        trigger.kill()
      })
      // 消除绑定 MatchMedia();
      ScrollTrigger.clearMatchMedia()
    })
    return {
      index
    }
  }
}
</script>
<style lang="scss">
#app,#page{
  height: auto!important;;
}
.parallax-scroll-content{
  width: 100vw;
  .scroll-roll{
    width: 1px;
    height: 200vh;
  }
  .box{
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
  }
  .box-50-50{
    width: 100px;
    height: 100px;
  }
  .box1{
    top: 0;
    background: red;
  }
  .box2{
    top: 100px;
    background: orange;
  }
  .box3{
    top: 200px;
    background: yellow;
  }
  .box4{
    top: 300px;
    background: green;
  }
  .box5{
    top: 400px;
    background: skyblue;
  }
  .box6{
    top: 500px;
    background: blue;
  }
  .box7{
    top: 600px;
    background: purple;
  }
  .tips{
    top: 50%;
    left: 50%;
    font-size: 16px;
    transition: transform(-50%,-50%);
  }
}

</style>

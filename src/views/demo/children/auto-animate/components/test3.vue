<template>
    <div>
        <button @click="toggle">切换</button>
        <div class="relative width100" ref="parent">
            <div class="absolute" v-for="(item, index) in styleList" :data-index="index" :style="item[currentIndex]" :key="`${currentIndex}-${index}`"></div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import { getTransitionSizes } from '@formkit/auto-animate'
const currentIndex = ref(0)
const lastIndex = ref(0)
const styleList = ref([
  [
    { width: '100px', height: '100px', left: '0px', top: '0px', background: 'red', zIndex: 3 },
    { width: '100px', height: '200px', left: '10px', top: '10px', background: 'rgba(85,155,53,1)', zIndex: 3, borderRadius: '40px' },
    { width: '200px', height: '100px', left: '20px', top: '0px', background: 'red', zIndex: 3, borderRadius: '10px' }
  ],
  [
    { width: '200px', height: '200px', left: '0px', top: '0px', background: 'green', zIndex: 2 },
    { width: '50px', height: '50px', left: '90px', top: '0px', background: 'green', zIndex: 2 },
    { width: '200px', height: '300px', left: '180px', top: '30px', background: 'green', zIndex: 2 }
  ],
  [
    { width: '400px', height: '400px', left: '0px', top: '0px', background: 'yellow', zIndex: 1 },
    { width: '200px', height: '200px', left: '30px', top: '60px', background: 'pink', zIndex: 1, borderRadius: '999999px' },
    { width: '100px', height: '400px', left: '20px', top: '20px', background: 'yellow', zIndex: 1, borderRadius: '40px' }
  ]
])

const [parent] = useAutoAnimate((el, action, oldCoords, newCoords) => {
  console.log('el, action, oldCoords, newCoords', el.dataset.index, { el, action, oldCoords, newCoords })
  let keyframes
  // supply a different set of keyframes for each action
  if (action === 'add') {
    keyframes = [
      styleList.value[el.dataset.index][lastIndex.value],
      styleList.value[el.dataset.index][currentIndex.value]
    ]
  }
  // keyframes can have as many "steps" as you prefer
  // and you can use the 'offset' key to tune the timing
  if (action === 'remove') {
    keyframes = [
      { display: 'none' },
      { display: 'none' }
    ]
  }
  if (action === 'remain') {
    // for items that remain, calculate the delta
    // from their old position to their new position
    const deltaX = oldCoords.left - newCoords.left
    const deltaY = oldCoords.top - newCoords.top
    // use the getTransitionSizes() helper function to
    // get the old and new widths of the elements
    const [widthFrom, widthTo, heightFrom, heightTo] = getTransitionSizes(el, oldCoords, newCoords)
    // set up our steps with our positioning keyframes
    const start = { transform: `translate(${deltaX}px, ${deltaY}px)` }
    const mid = { transform: `translate(${deltaX * -0.15}px, ${deltaY * -0.15}px)`, offset: 0.75 }
    const end = { transform: 'translate(0, 0)' }
    // if the dimensions changed, animate them too.
    if (widthFrom !== widthTo) {
      start.width = `${widthFrom}px`
      mid.width = `${widthFrom >= widthTo ? widthTo / 1.05 : widthTo * 1.05}px`
      end.width = `${widthTo}px`
    }
    if (heightFrom !== heightTo) {
      start.height = `${heightFrom}px`
      mid.height = `${heightFrom >= heightTo ? heightTo / 1.05 : heightTo * 1.05}px`
      end.height = `${heightTo}px`
    }
    keyframes = [start, mid, end]
  }
  // return our KeyframeEffect() and pass
  // it the chosen keyframes.
  return new KeyframeEffect(el, keyframes, { duration: 600, easing: 'ease-out' })
})

function toggle () {
  lastIndex.value = currentIndex.value
  if (currentIndex.value === 2) {
    currentIndex.value = 0
    return
  }
  currentIndex.value = currentIndex.value + 1
}
</script>
<style scoped lang="scss">

</style>

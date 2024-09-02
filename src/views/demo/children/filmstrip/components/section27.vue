<template>
  <section>
    <h2>🥵🐮显示笔记注释提醒</h2>
    <p @click="showNotes" data-notes="Something important">
      <span @click="showNotes">按下s键显示笔记</span>
    </p>
    <p class="cursor-pointer" data-notes="Something important">
      <span @click="showNotes">点击显示笔记</span>
    </p>
    <aside class="notes">🥵🥵🥵🥵🥵🥵🥵🥵🥵🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮笔记1<br /></aside>
    <aside class="notes">🥵🥵🥵🥵🥵🥵🥵🥵🥵🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮笔记2<br /></aside>
    <aside class="notes">🥵🥵🥵🥵🥵🥵🥵🥵🥵🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮笔记3<br /></aside>
    <aside class="notes">
      <h1 style="color: #000">鲁迅先生</h1>
      <img :src="baseUrl + 'demo-static/filmstrip/luxun-images/luxun.jpg'" />
    </aside>
  </section>
</template>
<script setup>
defineOptions({ name: 'view-demo-filmstrip-section27' })

defineProps({
  baseUrl: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['showNotes'])
const showNotes = () => {
  console.log('showNotes')
  emit('showNotes', {})
}
</script>

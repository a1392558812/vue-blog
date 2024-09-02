<template>
  <section>
    <p>按下B暂停播放演示</p>
    <p><span class="cursor-pointer" @click="showNotes">显示快捷键</span></p>
  </section>
</template>
<script setup>
defineOptions({ name: 'view-demo-filmstrip-section31' })

const emit = defineEmits(['showNotes'])
const showNotes = () => {
  emit('showHelp', {})
}
</script>

<template>
  <div class="flex-shrink-0 cell-item-link">
    <span>{{ tagText }}</span>
  </div>
</template>
<script setup>
defineOptions({ name: 'components-link-tag' })
defineProps({
  tagText: {
    type: String,
    default: '链接'
  }
})
</script>
<style scoped>
.cell-item-link {
  margin: 0 5px;
  height: 1.5em;
  border-radius: 5px;
  padding: 0 8px;
  white-space: nowrap;
  text-indent: 0;
  background-color: skyblue;
  color: var(--global-primary-button-text-color);
}
</style>

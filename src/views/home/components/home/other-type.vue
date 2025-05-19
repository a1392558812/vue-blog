<template>
  <div class="pl-[20px] pr-[20px] py-[20px]">
    <div class="mb-[5px] text-[var(--global-text-color)]">链接： {{ htmlMD }}</div>
    <div class="mb-[5px] text-[var(--global-text-color)]">文件名： {{ downloadName }}</div>
    <div class="mb-[5px] text-[var(--global-text-color)] downLoad-wrap flex">
      <a
        class="block bg-[var(--global-primary-color)] text-[var(--global-primary-button-text-color)] no-underline leading-[1] text-[14px] px-[15px] py-[8px] rounded-[5px]"
        :href="htmlMD"
        :download="downloadName"
        >下载</a
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'OtherType',
  props: {
    downloadName: {
      type: String,
      default: ''
    },
    htmlMD: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss"></style>

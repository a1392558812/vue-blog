<template>
  <div class="other-type">
    <div class="downLoad-cell">
      链接： {{ htmlMD }}
    </div>
    <div class="downLoad-cell">
      文件名： {{ downloadName }}
    </div>
    <div class="downLoad-cell downLoad-wrap flex">
      <a class="display-block downLoad" :href="htmlMD" :download="downloadName">下载</a>
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

<style scoped lang="scss">
  .other-type{
    padding: 20px;
    .downLoad-cell{
      margin-bottom: 5px;
      color: var(--global-text-color);
    }
    .downLoad-wrap{
      .downLoad{
        text-decoration: none;
        color: var(--global-text-color);
        background-color: var(--global-border-color);
        line-height: 1;
        font-size: 14px;
        padding: 8px 15px;
        border-radius: 5px;
      }
    }
  }
</style>

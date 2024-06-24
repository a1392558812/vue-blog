<template>
  <div class="width100 height100 bg-white overflow-auto">
    <div class="demo-view">
      <div class="line-height-1 demo-view-item" v-for="(item, index) in demoList" :key="index">
        <a class="cursor-pointer" :href="`/#${item.path}`" target="\_blank">{{ `${index + 1}、 ` + item.name }}</a>
      </div>
    </div>
  </div>
</template>
<script>
import { demoMenuList } from '@/router/create-demo-list'
export default {
  setup () {
    return {
      demoList: demoMenuList()
    }
  }
}
</script>
<style lang="scss" scoped>
.demo-view{
  padding: 20px 10px;
  margin-bottom: 150px;
  .demo-view-item{
    font-size: 16px;
    padding: 10px 0;
    color: var(--global-primary-color);
    a {
      color: var(--global-primary-color);
    }
  }
}
</style>

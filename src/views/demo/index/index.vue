<template>
  <div class="width100 height100 overflow-auto">
    <div class="demo-view">
      <div class="line-height-1 demo-view-item" v-for="(item, index) in demoList" :key="index">
        <a class="cursor-pointer" @click="navigatorTo(item.path)">{{ `${index + 1}、 ` + item.name }}</a>
      </div>
    </div>
  </div>
</template>
<script>
import { demoMenuList } from '@/router/create-demo-list'
export default {
  setup () {
    return {
      demoList: demoMenuList(),
      navigatorTo: (path) => window.open(`./#${path}`)
    }
  }
}
</script>
<style lang="scss" scoped>
.demo-view{
  padding: 10px;
  .demo-view-item{
    font-size: 16px;
    padding: 5px 0;
    color: var(--global-primary-color);
    a {
      color: var(--global-primary-color);
    }
  }
}
</style>

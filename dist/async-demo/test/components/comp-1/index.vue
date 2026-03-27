<template>
  <div class="child-1">子组件1</div>
  <div class="child-2">子组件1</div>
</template>
<style scoped>
.child-1 {
  color: red;
}
</style>

<style scoped lang="scss">
@use './async-demo/static/scss/theme.scss';

.child-2 {
  color: $color;
}
</style>
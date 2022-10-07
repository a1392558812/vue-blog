<template>
  <div>
    <div class="" v-for="(item, index) in linkList">

    </div>
  </div>
</template>
<script>
export default {
  props: {
    type: Array,
    default: () => []
  },
  setup (props) {
    const linkList = props.linkList
  }

}
</script>

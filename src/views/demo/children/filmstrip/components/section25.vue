<template>
  <section>
    <h2></h2>
    <p>
      HTML中的特殊字符指的是:
      <q cite="https://a1392558812.github.io/github-page/"
        >一些普通字符在HTML中具有特殊含义,需要进行特殊处理或转义</q
      >
      才能正确地显示在网页上。
    </p>
    <blockquote cite="https://a1392558812.github.io/github-page/">
      &ldquo;HTML中的特殊字符指的是一些普通字符在HTML中具有特殊含义,需要进行特殊处理或转义才能正确地显示在网页上。&rdquo;
    </blockquote>
  </section>
</template>
<script setup>
defineOptions({ name: 'view-demo-filmstrip-section25' })

defineProps({
  baseUrl: {
    type: String,
    default: ''
  }
})
</script>

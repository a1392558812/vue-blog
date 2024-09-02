<template>
  <section data-transition="slide" data-background="#4d7e65" data-background-transition="zoom">
    <h2>动态加载远程js和css</h2>
    <p>狠狠的加载🥵🥵🥵🥵</p>
    <pre><code class="hljs javascript" data-line-numbers>{{ jsStr }}</code></pre>
  </section>
</template>
<script setup>
import { ref } from 'vue'

defineOptions({ name: 'view-demo-filmstrip-section19' })

const jsStr = ref(
  `const asyncLoadJs = (url) => {
    return new Promise((resolve, reject) => {
        let script = document.createElement('script')
        script.type = 'text/javascript';
        script.src = url;
        document.body.appendChild(script);
        script.onload = () => {
            resolve();
        }
        script.onerror = () => {
            reject();
        }
    })
}

const asyncLoadCss = (link) => {
    return new Promise((resolve, reject) => {
        let link = document.createElement('link')
        link.href = link
        link.rel = 'stylesheet'
        link.type = 'text/css'
        document.body.appendChild(link);
        link.onload = () => {
            resolve();
        }
        link.onerror = () => {
            reject();
        }
    })
}`
)
</script>

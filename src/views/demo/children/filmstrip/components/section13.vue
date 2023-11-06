<template>
    <section data-markdown>
        <textarea data-template v-html="htmlStr"></textarea>
    </section>
</template>
<script setup>
import { ref } from 'vue'

const str = `
## Markdown

Markdown是一种纯文本格式的标记语言。按下'S'看笔记

通过简单的标记语法，它可以使普通文本内容具有一定的格式。\r\n` +
    '\r\n```html []\r\n' +
    `<section data-markdown>
    ## Markdown

    Markdown是一种纯文本格式的标记语言。
    通过简单的标记语法，它可以使普通文本内容具有一定的格式。
</section>` +
    '\r\n```' +
    '\r\nNote:你一定在看罢（恼！）🐮🐮🐮🐮🐮🐮哼哼哼，啊啊啊啊啊啊啊啊啊啊啊啊啊'
const htmlStr = ref(str)
</script>

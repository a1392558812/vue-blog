<template>
    <section data-markdown data-separator="^\n\n\n" data-separator-vertical="^\n\n" data-separator-notes="^Note:" data-charset="iso-8859-15">{{ htmlStr }}</section>
</template>
<script setup>
import { ref } from 'vue'
//  The data-charset attribute is optional and specifies which charset to use when loading the external file.
const str = `
## Markdown

Markdown是一种纯文本格式的标记语言。按下'S'看笔记

通过简单的标记语法，它可以使普通文本内容具有一定的格式。\n` +
    '\n```html []\n' +
    `<section data-markdown>
    ## Markdown

    Markdown是一种纯文本格式的标记语言。
    通过简单的标记语法，它可以使普通文本内容具有一定的格式。
</section>` +
    '\n```' +
    '\nNote:' +
    '\r你一定在看罢（恼！）哼哼哼，啊啊啊啊啊啊啊啊啊啊啊啊啊'
const htmlStr = ref(str)
</script>

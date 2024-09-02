<template>
  <section data-state="customevent">
    <!--
            Reveal.on( 'customevent', function() { // 自定义事件触发
                console.log( '"customevent" has fired' );
            } );
         -->
    <p>插件使用</p>
    <pre>
            <code class="javascript" data-trim contenteditable style="font-size: 18px;">{{ htmlStr }}</code>
        </pre>
  </section>
</template>
<script setup>
import { ref } from 'vue'

defineOptions({ name: 'view-demo-filmstrip-section30' })

const htmlStr = ref(`
import { VueHtmlToPaper } from 'vue-html-to-paper'
  export default {
    directives: {
      "html-to-paper": VueHtmlToPaper 
    },
    methods: {
      print() {
        // 打印内容
        this.$htmlToPaper('printContent')
      },
    }
  }

<template>
  <div>
    <div id="printContent">
      <!-- 打印内容 -->
    </div>
    <button @click="print">打印</button>
  </div>
</template>

`)
</script>

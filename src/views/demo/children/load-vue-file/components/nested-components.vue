
<script lang="jsx">
import * as Vue from 'vue'
import { loadModule } from 'vue3-sfc-loader'

const input1 = '<template><div style="border: 1px solid red; margin: 5px; padding: 5px"><div style="color: red;">这里是main</div><foo/></div></template>' +
'<script>' +
'import foo from "./foo.vue";' +
'export default {' +
'components: {foo,},created() {console.log("main created")},mounted() {console.log("main mounted")}}' +
'<' +
'/script>'
const input2 = '<template><div style="border: 1px solid green; margin: 5px; padding: 5px"><div style="color: green;">我是foo组件</div><bar/></div></template>' +
'<script>' +
'import bar from "./bar.vue";' +
'export default {' +
'components: {bar,},created() {console.log("foo created")},mounted() {console.log("foo mounted")}}' +
'<' +
'/script>'
const input3 = '<template><div class="bar-comp">bar组件在此</div></template>' +
'<script>' +
'import "./style.css";' +
'export default {' +
'components: {},created() {console.log("bar created")},mounted() {console.log("bar mounted")}}' +
'<' +
'/script>'
const styleCss = '.bar-comp { color: blue; border: 1px solid blue; margin: 5px; padding: 5px; }'
export default {
  setup () {
    const inputValue1 = Vue.ref(input1)
    const inputValue2 = Vue.ref(input2)
    const inputValue3 = Vue.ref(input3)
    const inputValue4 = Vue.ref(styleCss)

    const config = Vue.computed(() => {
      return {
        files: {
          '/main.vue': inputValue1.value,
          '/foo.vue': inputValue2.value,
          '/bar.vue': inputValue3.value,
          '/style.css': inputValue4.value
        }
      }
    })
    const comp = Vue.computed(() => {
      const result = Vue.defineAsyncComponent(() => loadModule('/main.vue', {
        moduleCache: {
          vue: Vue
        },
        getFile (url) {
          return config.value.files[url]
        },
        addStyle (textContent) {
          const style = Object.assign(document.createElement('style'), { textContent })
          const ref = document.head.getElementsByTagName('style')[0] || null
          document.head.insertBefore(style, ref)
        },
        handleModule: async function (type, getContentData, path, options) {
          switch (type) {
            case '.css':
              options.addStyle(await getContentData(false))
              return null
          }
        }
      }))
      console.log('computed-result', result)
      return result
    })

    return {
      inputValue1,
      inputValue2,
      inputValue3,
      inputValue4,
      ifShowComponents: Vue.ref(false),
      comp
    }
  },
  render () {
    const comp = this.comp
    const myComponent = <comp/>

    return (
      <div class='toggle-load'>
        <div style={{ fontWeight: 'bold', color: '#FB7299' }} class="content">组件嵌套</div>
        <div>可F12打开控制台查看console内容</div>
        <div class='content'>
            <div>请编辑main组件内容: </div>
            <textarea class='content-input' vModel={this.inputValue1}/>
        </div>
        <div class='content'>
            <div>请编辑foo组件内容: </div>
            <textarea class='content-input' vModel={this.inputValue2}/>
        </div>
        <div class='content'>
            <div>请编辑bar组件内容: </div>
            <textarea class='content-input' vModel={this.inputValue3}/>
        </div>
        <div class='content'>
            <div>请编辑bar组件css内容: </div>
            <textarea class='content-input' vModel={this.inputValue4}/>
        </div>
        <div class='content'>
            {this.ifShowComponents
              ? <div>{myComponent}</div>
              : <div>
                    <div>编写完点击生成</div>
                    <button onClick={() => { this.ifShowComponents = true }}>生成组件</button>
                </div>
            }
        </div>
      </div>
    )
  }
}

</script>
<style scoped lang="scss">
.content{
    padding: 10px;
    border: 1px solid #000;
    margin-bottom: 10px;
}
.toggle-load{
    font-size: 16px;
    padding: 10px;
    border: 1px solid #000;
}
.content-input{
    padding: 5px 10px;
    width: 500px;
    height: 100px;
    resize: none;
}
</style>

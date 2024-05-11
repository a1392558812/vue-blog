<script lang="jsx">
import * as Vue from 'vue'
import { loadModule } from 'vue3-sfc-loader'
export default {
  setup () {
    const currentComponent = Vue.ref('a')
    const inputValue1 = Vue.ref('<template><div class="test-a">a组件字符串内容</div></template><style scoped>.test-a{ color: red }</style>')
    const inputValue2 = Vue.ref('<template><div class="test-b">b组件字符串内容</div></template><style scoped>.test-b{ color: green }</style>')
    const comp = Vue.computed(() => {
      const loadUrl = `/${currentComponent.value}.vue` // hack写法，否则无法进行响应式
      const result = Vue.defineAsyncComponent(() => loadModule(loadUrl, {
        moduleCache: {
          vue: Vue
        },
        getFile (url) {
          return ({
            '/a.vue': inputValue1.value,
            '/b.vue': inputValue2.value
          })[url] || Promise.reject(new Error('error status'))
        },
        addStyle (textContent) {
          const style = Object.assign(document.createElement('style'), { textContent })
          const ref = document.head.getElementsByTagName('style')[0] || null
          document.head.insertBefore(style, ref)
        }
      }))
      console.log('computed-result', result)
      return result
    })

    const toggleCurrentComponent = () => {
      currentComponent.value = currentComponent.value === 'a' ? 'b' : 'a'
      console.log('currentComponent', currentComponent.value)
    }
    return {
      toggleCurrentComponent,
      currentComponent,
      inputValue1,
      inputValue2,
      ifShowComponents: Vue.ref(false),
      comp
    }
  },
  render () {
    const comp = this.comp
    const myComponent = <comp key={this.currentComponent}/>

    return (
      <div class='toggle-load'>
        <div style={{ fontWeight: 'bold', color: '#FB7299' }} class="content">模块切换演示</div>
        <div class='content'>
            <div>请编辑a组件内容: </div>
            <textarea class='content-input' vModel={this.inputValue1}/>
        </div>
        <div class='content'>
            <div>请编辑b组件内容: </div>
            <textarea class='content-input' vModel={this.inputValue2}/>
        </div>
        <div class='content'>
            {this.ifShowComponents
              ? <div>
                    <button onClick={() => { this.toggleCurrentComponent() }}>toggle切换</button>
                    <div>当前dynamic component: 【{this.currentComponent}】</div>
                    {myComponent}
                </div>
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

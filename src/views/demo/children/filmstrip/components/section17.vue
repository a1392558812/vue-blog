<template>
    <section id="themes">
        <h2>Themes</h2>
        <div>
            <p>切换主题</p>
            <br/>
            <p><a href="#/themes" style="margin-right: 30px;" class="display-inline-block" v-for="(item, index) in themeList" :key="index" @click="onSetTheme(item)">{{ item.theme }}</a></p>
        </div>
    </section>
</template>
<script>
import { ref } from 'vue'

import { asyncLoadCss } from '@/common/util/async-load'
import routerSwitenLoading from '@/components/router-switch-loading/index'
const { startLoading, endLoading } = routerSwitenLoading()

export default {
  props: {
    baseUrl: {
      type: String,
      default: ''
    }
  },
  setup (props, context) {
    const loading = ref(false)
    const themeList = ref([
      { theme: 'Black', maskWrapStyle: { backgroundColor: 'rgba(0,0,0,.8)' }, loadingTextStyle: { color: '#fff' }, key: 'black' },
      { theme: 'White', maskWrapStyle: { backgroundColor: 'rgba(0,0,0,.8)' }, loadingTextStyle: { color: '#fff' }, key: 'white' },
      { theme: 'League', maskWrapStyle: { backgroundColor: 'rgba(0,0,0,.8)' }, loadingTextStyle: { color: 'pink' }, key: 'league' },
      { theme: 'Sky', maskWrapStyle: { backgroundColor: 'rgba(0,0,0,.8)' }, loadingTextStyle: { color: 'skyblue' }, key: 'sky' },
      { theme: 'Beige', maskWrapStyle: { backgroundColor: 'rgba(0,0,0,.8)' }, loadingTextStyle: { color: 'rgb(226, 167, 78)' }, key: 'beige' },
      { theme: 'Simple', maskWrapStyle: { backgroundColor: 'rgba(0,0,0,.8)' }, loadingTextStyle: { color: 'rgb(226, 108, 78)' }, key: 'simple' },
      { theme: 'Serif', maskWrapStyle: { backgroundColor: 'rgba(0,0,0,.8)' }, loadingTextStyle: { color: 'rgb(157, 226, 78)' }, key: 'serif' },
      { theme: 'Blood', maskWrapStyle: { backgroundColor: 'rgba(0,0,0,.8)' }, loadingTextStyle: { color: 'rgb(78, 226, 226)' }, key: 'blood' },
      { theme: 'Night', maskWrapStyle: { backgroundColor: 'rgba(0,0,0,.8)' }, loadingTextStyle: { color: 'rgb(147, 104, 248)' }, key: 'night' },
      { theme: 'Moon', maskWrapStyle: { backgroundColor: 'rgba(0,0,0,.8)' }, loadingTextStyle: { color: 'rgb(248, 104, 159)' }, key: 'moon' },
      { theme: 'Solarized', maskWrapStyle: { backgroundColor: 'rgba(0,0,0,.8)' }, loadingTextStyle: { color: 'rgb(230, 255, 89)' }, key: 'solarized' }
    ])
    console.log('props', props, context)
    return {
      themeList,
      loading,
      onSetTheme (row) {
        console.log('row', row)
        if (loading.value) return
        loading.value = true
        startLoading({
          text: `加载中${row.theme}主题中...`,
          loadingTextStyle: row.loadingTextStyle,
          maskWrapStyle: row.maskWrapStyle
        })
        asyncLoadCss(props.baseUrl + `demo-static/filmstrip/theme/${row.key}.css`).then(() => {
          loading.value = false
          endLoading()
        }, err => {
          startLoading({
            text: '加载失败，请点击重新加载',
            loadingTextStyle: row.loadingTextStyle,
            maskWrapStyle: row.maskWrapStyle,
            loadingIconSlotFun: () => null
          })
          setTimeout(() => {
            loading.value = false
            endLoading()
          }, 1500)
          console.log('加载失败', err)
        })
        return false
      }
    }
  }
}
</script>

<template>
    <div class="play-ground-plane dark" :style="{ width: playGroundPlaneWidth }">
        <div class="play-ground-plane-wrap" :style="{ width: playGroundPlaneWidth }">
            <div class="header flex align-items-center justify-content-space-between">
                <svg xmlns="http://www.w3.org/2000/svg" width="54" height="14" viewBox="0 0 54 14">
                    <g fill="none" fill-rule="evenodd" transform="translate(1 1)">
                        <circle cx="6" cy="6" r="6" fill="#FF5F56" stroke="#E0443E" stroke-width=".5"></circle>
                        <circle cx="26" cy="6" r="6" fill="#FFBD2E" stroke="#DEA123" stroke-width=".5"></circle>
                        <circle cx="46" cy="6" r="6" fill="#27C93F" stroke="#1AAB29" stroke-width=".5"></circle>
                    </g>
                </svg>
                <div class="header-icon flex align-items-center">
                    <svg
                        class="cursor-pointer header-icon-item"
                        @click="reloadPage"
                        fill="currentColor"
                        width="1.7em"
                        height="1.7em"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
                        />
                        <path d="M0 0h24v24H0z" fill="none" />
                    </svg>
                    <svg
                        @click="navigatorToHome"
                        class="cursor-pointer header-icon-item"
                        width="1.7em"
                        height="1.7em"
                        viewBox="0 0 24 24"
                        fill="currentColor">
                        <path d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6 c0,0,1.4,0,2.8,1.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4 c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3 C22,6.1,16.9,1.4,10.9,2.1z"
                        />
                    </svg>
                </div>
            </div>
            <Repl
              class="vue-repl"
              ref="replRef"
              :theme="theme"
              :style="{ height: playGroundPlaneReplHeight }"
              :editor="Monaco"
              @keydown.ctrl.s.prevent
              @keydown.meta.s.prevent
              :ssr="false"
              :store="store"
              :showTsConfig="true"
              :showImportMap="true"
              :showCompileOutput="true"
              :autoResize="true"
              :clearConsole="false"
              :preview-options="{
                headHTML,
                bodyHTML,
                customCode: {
                    importCode: `import { initCustomFormatter } from 'vue'`,
                    useCode: `initCustomFormatter()`,
                },
              }"
            />
        </div>
    </div>
</template>

<script>
import Monaco from '@vue/repl/monaco-editor'
import { ref, onMounted, computed } from 'vue'
import { Repl, useVueImportMap, useStore } from '@vue/repl'

export default {
  props: {
    headHTML: {
      type: String,
      default: '<div>解析🐮🍺代码中...</div>'
    },
    bodyHTML: {
      type: String,
      default: '<div style="padding: 10px; margin-top: 20px; border-top: 1px solid #eee">Awenのplay-ground</div>'
    },
    defaultTemplate: { // 默认App.vue文件创建模板
      type: String,
      default: '<template/>'
    },
    defaultNewSFC: { // 默认新文件创建模板
      type: String,
      default: '<template/>'
    },
    /**
     * 'aaa.vue': '<template>666</template>',
     * 'bbb.vue': '<template>777</template>'
     */
    componentsFiles: { // 文件列表
      type: Object,
      default: () => ({})
    },
    playGroundPlaneWidth: {
      type: String,
      default: '7600px'
    },
    playGroundPlaneReplHeight: {
      type: String,
      default: '370px'
    }
  },
  components: {
    Repl
  },
  setup (props) {
    const replRef = ref(null)

    const { productionMode, vueVersion, importMap, defaultVersion } = useVueImportMap({
      runtimeDev: `https://cdn.jsdelivr.net/npm/vue@3.4.27/dist/vue.esm-browser.js?time=${new Date().getTime()}`
    })
    console.log('useVueImportMap', productionMode, vueVersion, importMap, defaultVersion)

    const sfcOptions = computed(() => ({
      script: {
        inlineTemplate: productionMode.value,
        isProd: productionMode.value,
        propsDestructure: true
      },
      style: {
        isProd: productionMode.value
      },
      template: {
        isProd: productionMode.value,
        compilerOptions: {
          isCustomElement: (tag) => tag === 'mjx-container'
        }
      }
    })
    )

    const store = useStore(
      {
        builtinImportMap: importMap,
        vueVersion: vueVersion || defaultVersion,
        template: ref({
          welcomeSFC: props.defaultTemplate,
          newSFC: props.defaultNewSFC
        }),
        sfcOptions
      },
      ''
    )

    if (Object.keys(props.componentsFiles).length) {
      store.setFiles(props.componentsFiles)
    }

    const setVH = () => {
      document.documentElement.style.setProperty('--vh', window.innerHeight + 'px')
    }

    const reloadPage = () => {
      console.log('reloadPage', replRef.value)
      replRef.value?.reload()
    }

    window.addEventListener('resize', setVH)
    setVH()
    onMounted(() => {
      window.process = { env: {} }
    })
    return {
      theme: ref('dark'), // ''dark' | 'light''
      replRef,
      Monaco,
      store,
      Repl,
      navigatorToHome: () => {
        window.open('/')
      },
      reloadPage
    }
  }
}

</script>

<style lang="scss" scoped>
    $borderRadius: 8px;
    .dark {
      color-scheme: dark;
    }
    .play-ground-plane {
        font-size: 13px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
            Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        margin: 0;
        --base: #444;
        --nav-height: 50px;
        .play-ground-plane-wrap {
            .header {
                display: flex;
                padding: 0 20px;
                height: var(--nav-height);
                background-color: #1a1a1a;
                border: 1px solid #ddd;
                border-bottom: 1px solid #383838;
                border-radius: $borderRadius $borderRadius 0 0;
                .header-icon {
                    color: #666;
                    .header-icon-item {
                        margin: 0 0 0 10px;
                        &:hover {
                            color: #fff;
                        }
                    }
                }
            }
            .vue-repl {
                border: 1px solid #ddd;
                border-top: none;
                border-radius: 0 0 $borderRadius $borderRadius;
                button {
                    border: none;
                    outline: none;
                    cursor: pointer;
                    margin: 0;
                    background-color: transparent;
                }
            }
        }
    }
</style>

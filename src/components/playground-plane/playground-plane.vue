<template>
  <div
    ref="replWrapRef"
    class="play-ground-plane dark"
    :style="{ width: playGroundPlaneWidth, height: playGroundPlaneReplHeight }"
  >
    <div
      class="play-ground-plane-wrap"
      :style="{ width: playGroundPlaneWidth, height: playGroundPlaneReplHeight }"
    >
      <div class="header flex items-center justify-between">
        <svg xmlns="http://www.w3.org/2000/svg" width="54" height="14" viewBox="0 0 54 14">
          <g fill="none" fill-rule="evenodd" transform="translate(1 1)">
            <circle cx="6" cy="6" r="6" fill="#FF5F56" stroke="#E0443E" stroke-width=".5"></circle>
            <circle cx="26" cy="6" r="6" fill="#FFBD2E" stroke="#DEA123" stroke-width=".5"></circle>
            <circle cx="46" cy="6" r="6" fill="#27C93F" stroke="#1AAB29" stroke-width=".5"></circle>
          </g>
        </svg>
        <div class="header-icon flex items-center">
          <div
            style="height: 1.7em"
            v-if="isSupported && memory"
            class="flex items-center relative memory-icon-wrap"
          >
            <svg
              class="cursor-pointer header-icon-item"
              style="
                width: 1.45em;
                height: 1.45em;
                vertical-align: middle;
                fill: currentColor;
                overflow: hidden;
              "
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="7138"
            >
              <path
                d="M349.866667 263.111111h411.022222v497.777778h-497.777778v-497.777778H349.866667z m482.133333 446.065778h71.111111a35.555556 35.555556 0 1 0 0-71.111111h-71.111111V547.555556h71.111111a35.555556 35.555556 0 1 0 0-71.111112h-71.111111v-90.453333h71.111111a35.555556 35.555556 0 1 0 0-71.111111h-71.111111v-51.768889q0-29.468444-20.821333-50.289778t-50.289778-20.821333h-51.768889v-71.111111a35.555556 35.555556 0 1 0-71.111111 0v71.111111h-90.453333v-71.111111a35.555556 35.555556 0 1 0-71.111112 0v71.111111h-90.453333v-71.111111a35.555556 35.555556 0 1 0-71.111111 0v71.111111h-51.768889q-29.468444 0-50.289778 20.821333t-20.821333 50.289778v51.768889h-71.111111a35.555556 35.555556 0 0 0 0 71.111111h71.111111v90.453333h-71.111111a35.555556 35.555556 0 0 0 0 71.111112h71.111111v90.510222h-71.111111a35.555556 35.555556 0 1 0 0 71.111111h71.111111v51.712q0 29.468444 20.821333 50.289778t50.289778 20.821333h51.768889v71.111111a35.498667 35.498667 0 1 0 71.111111 0v-71.111111h90.453333v71.111111a35.498667 35.498667 0 1 0 71.111112 0v-71.111111h90.453333v71.111111a35.498667 35.498667 0 1 0 71.111111 0v-71.111111h51.768889q29.468444 0 50.289778-20.821333t20.821333-50.289778v-51.712zM369.777778 618.666667v-213.333334c0-19.626667 15.928889-35.555556 35.555555-35.555555h213.333334c19.626667 0 35.555556 15.928889 35.555555 35.555555v213.333334c0 19.626667-15.928889 35.555556-35.555555 35.555555h-213.333334a35.555556 35.555556 0 0 1-35.555555-35.555555z m213.333333-35.555556v-142.222222h-142.222222v142.222222h142.222222z"
                p-id="7139"
              ></path>
            </svg>
            <div class="absolute align-center-x memory-icon">
              <div class="whitespace-nowrap cursor-pointer header-icon-item">
                Used: {{ sizeFixed(memory.usedJSHeapSize) }}
              </div>
              <div class="whitespace-nowrap cursor-pointer header-icon-item">
                Allocated: {{ sizeFixed(memory.totalJSHeapSize) }}
              </div>
              <div class="whitespace-nowrap cursor-pointer header-icon-item">
                Limit: {{ sizeFixed(memory.jsHeapSizeLimit) }}
              </div>
              <div class="whitespace-nowrap cursor-pointer header-icon-item">FPS: {{ fps }}</div>
            </div>
          </div>

          <div style="height: 1.7em" title="全屏切换">
            <svg
              v-show="isFullscreen"
              class="cursor-pointer header-icon-item"
              @click="toggleFullscreen"
              style="
                width: 1.7em;
                height: 1.7em;
                vertical-align: middle;
                fill: currentColor;
                overflow: hidden;
              "
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4443"
            >
              <path
                d="M213.333333 682.666667h128v128h85.333334V597.333333H213.333333v85.333334z m128-341.333334h-128v85.333334h213.333334V213.333333h-85.333334v128z m256 469.333334h85.333334v-128h128v-85.333334H597.333333v213.333334z m85.333334-469.333334v-128h-85.333334v213.333334h213.333334v-85.333334h-128z"
                p-id="4444"
              ></path>
            </svg>
            <svg
              v-show="!isFullscreen"
              class="cursor-pointer header-icon-item"
              @click="toggleFullscreen"
              style="
                width: 1.7em;
                height: 1.7em;
                vertical-align: middle;
                fill: currentColor;
                overflow: hidden;
              "
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="3063"
            >
              <path
                d="M298.666667 597.333333h-85.333334v213.333334h213.333334v-85.333334h-128v-128z m-85.333334-170.666666h85.333334v-128h128v-85.333334H213.333333v213.333334z m512 298.666666h-128v85.333334h213.333334V597.333333h-85.333334v128z m-128-512v85.333334h128v128h85.333334V213.333333H597.333333z"
                p-id="3064"
              ></path>
            </svg>
          </div>

          <div style="height: 1.7em" title="刷新">
            <svg
              class="cursor-pointer header-icon-item"
              @click="reloadPage"
              fill="currentColor"
              width="1.7em"
              height="1.7em"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
              />
              <path d="M0 0h24v24H0z" fill="none" />
            </svg>
          </div>

          <div style="height: 1.7em" title="我的github主页">
            <svg
              class="cursor-pointer header-icon-item"
              @click="navigatorToHome"
              width="1.7em"
              height="1.7em"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6 c0,0,1.4,0,2.8,1.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4 c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3 C22,6.1,16.9,1.4,10.9,2.1z"
              />
            </svg>
          </div>
        </div>
      </div>
      <Repl
        class="vue-repl"
        ref="replRef"
        :theme="theme"
        :style="{ height: `calc(${playGroundPlaneReplHeight} - var(--nav-height))` }"
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
            importCode: `import { initCustomFormatter } from 'vue';${customCode.importCode}`,
            useCode: `initCustomFormatter(); console.log('奥利给，猛猛学Vue', app);${customCode.useCode}`
          }
        }"
      />
    </div>
  </div>
</template>

<script>
import Monaco from '@vue/repl/monaco-editor'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Repl, useVueImportMap, useStore } from '@vue/repl'
import { baseUrlFun } from '@/common/util/methods.js'
import { useFullscreen, useMemory, useFps } from '@vueuse/core'
const baseUrl = baseUrlFun()

export default {
  name: 'components-playground-plane',
  props: {
    headHTML: {
      type: String,
      default:
        `<script src="${baseUrl + 'demo-static/playground-plane/@unocss/runtime/preset-icons.global.js'}"><` +
        '/script>' +
        `<script src="${baseUrl + 'demo-static/playground-plane/@unocss/runtime/mini.global.js'}"><` +
        '/script>' +
        `<script src="${baseUrl + 'demo-static/playground-plane/@unocss/runtime/uno.global.js'}"><` +
        '/script>' +
        `<script>
            window.__unocss = {
              presets: [
                () =>
                  window.__unocss_runtime.presets.presetIcons({
                    scale: 1.2,
                    cdn: 'https://esm.sh/',
                  }),
              ],
            }
        <` +
        '/script>' +
        `<script src="${baseUrl + 'demo-static/playground-plane/@unocss/runtime/core.global.js'}"><` +
        '/script>' +
        '<script src="" data-text="此处添加script脚本标签或者"><' +
        '/script>' +
        '<link href="" data-text="此处添加link标签引入资源"/>'
    },
    bodyHTML: {
      type: String,
      default:
        '<div style="padding: 10px; margin-top: 20px; border-top: 1px solid #eee">Awenのplay-ground</div>'
    },
    defaultTemplate: {
      // 默认App.vue文件创建模板
      type: String,
      default: '<template><div></div><template/>'
    },
    defaultNewSFC: {
      // 默认新文件创建模板
      type: String,
      default: '<template><div></div><template/>'
    },
    /**
     * 'aaa.vue': '<template>666</template>',
     * 'bbb.vue': '<template>777</template>'
     */
    componentsFiles: {
      // 文件列表
      type: Object,
      default: () => ({})
    },
    playGroundPlaneWidth: {
      type: String,
      default: '960px'
    },
    playGroundPlaneReplHeight: {
      type: String,
      default: '520px'
    },
    vueImportMap: {
      type: Object,
      default: () => ({
        runtimeDev: baseUrl + 'demo-static/playground-plane/vue@3.4.27/dist/vue.esm-browser.js',
        runtimeProd: baseUrl + 'demo-static/playground-plane/vue@3.4.27/dist/vue.esm-browser.js'
      })
    },
    otherImportsMap: {
      type: Object,
      default: () => ({
        'vue-demi': baseUrl + 'demo-static/playground-plane/vue-demi/lib/index.mjs',
        '@vueuse/core': baseUrl + 'demo-static/playground-plane/@vueuse/core@10.1.0/index.mjs',
        '@vueuse/shared': baseUrl + 'demo-static/playground-plane/@vueuse/shared@10.1.0/index.mjs'
      })
    },
    customCode: {
      type: Object,
      default: () => ({
        importCode: '',
        useCode: ''
      })
    }
  },
  components: {
    Repl
  },
  setup(props) {
    const replWrapRef = ref(null)
    const replRef = ref(null)
    const { isFullscreen, enter, exit, toggle: toggleFullscreen } = useFullscreen(replWrapRef)
    const fps = useFps()

    const { isSupported, memory } = useMemory()
    const sizeFixed = (v) => {
      const kb = v / 1024 / 1024
      return `${kb.toFixed(2)} MB`
    }

    const { productionMode, vueVersion, importMap, defaultVersion } = useVueImportMap(
      props.vueImportMap
    )
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
    }))

    Object.keys(props.otherImportsMap).forEach((key) => {
      importMap.value.imports[key] = props.otherImportsMap[key]
    })

    // 创建一个新的 store 实例，用于管理应用的状态
    const store = useStore(
      {
        builtinImportMap: importMap, // 设置内置的模块导入映射
        vueVersion: vueVersion || defaultVersion, // 设置 Vue 的版本，或者如果未指定则使用默认版本
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
      replRef.value?.reload()
    }

    window.addEventListener('resize', setVH)
    setVH()

    onMounted(() => {
      window.process = { env: {} }
      console.log('[@vue/repl]-main', {
        importMap,
        sfcOptions,
        store,
        replRef,
        useFullscreen: { isFullscreen, enter, exit, toggle: toggleFullscreen }
      })
    })

    onUnmounted(() => {
      window.removeEventListener('resize', setVH)
    })

    return {
      isSupported,
      memory,
      fps,
      sizeFixed,
      theme: ref('dark'), // ''dark' | 'light''
      replRef,
      replWrapRef,
      Monaco,
      store,
      Repl,
      isFullscreen,
      toggleFullscreen,
      navigatorToHome: () => {
        window.open('https://github.com/a1392558812/myShare')
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
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
        .memory-icon-wrap {
          &:hover {
            .memory-icon {
              display: block;
              z-index: 99999;
            }
          }
          .memory-icon {
            padding: 10px 15px;
            background-color: #2b2b2b;
            border-radius: $borderRadius;
            display: none;
            top: calc(100% + 5px);
            transition: all 0.3s;
            &:after {
              content: '';
              display: block;
              position: absolute;
              top: 0;
              left: calc(50% - 5px);
              transform: translateY(-70%);
              width: 0;
              height: 0;
              border-style: solid;
              border-width: 0 10px 12px 10px;
              border-color: transparent transparent #2b2b2b transparent;
            }
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

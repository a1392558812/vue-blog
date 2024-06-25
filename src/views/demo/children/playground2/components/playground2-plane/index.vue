
<template>
    <div>
        <div class="toggle-btn-wrap">
            <div class="toggle-btn" :style="editMode === 'preview' ? { background: 'pink' } : {}" @click="editMode = 'preview'">preview模式</div>
            <div class="toggle-btn" :style="editMode === 'edit' ? { background: 'pink' } : {}" @click="editMode = 'edit'">edit模式</div>
            <div v-if="editMode === 'edit'" class="toggle-btn">
                <label style="margin-right: 10px">编辑器宽度: {{ contentWrapWidth }}%</label>
                <input style="width: 40px" type="number" :value="contentWrapWidth" @input="onInput" />
            </div>
        </div>
        <div class="iframe-wrap">
            <div v-if="editMode === 'edit'" class="content-wrap" :style="{ width: `${contentWrapWidth}%` }">
                <div class="textarea-warp">
                    <div class="textarea-title">template</div>
                    <textarea class="textarea-item" v-model="templateValueComputed" />
                </div>
                <div class="textarea-warp">
                    <div class="textarea-title">script</div>
                    <textarea class="textarea-item" v-model="scriptValueComputed" />
                </div>
                <div class="textarea-warp">
                    <div class="textarea-title">css</div>
                    <textarea class="textarea-item" v-model="cssValueComputed" />
                </div>
                <div class="textarea-warp">
                    <div class="textarea-title">imports</div>
                    <textarea class="textarea-item" v-model="importsComputed" />
                </div>
            </div>
            <iframe :style="{ flex: 1 }" class="iframe-item" ref="iframeRef"></iframe>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, watch, defineProps, defineEmits, nextTick, onUnmounted } from 'vue'

const props = defineProps({
  mode: {
    type: String,
    default: 'edit' // preview edit
  },
  templateValue: {
    type: String,
    default: '<div></div>'
  },
  cssValue: {
    type: String,
    default: ''
  },
  scriptValue: {
    type: String,
    default: 'export default { setup() {} }'
  },
  imports: {
    type: Object,
    default: () => ({
      vue: 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
    })
  },
  beforeAppMount: {
    type: String,
    default: ';console.log("🐮 --- beforeAppMount");'
  },
  afterAppMount: {
    type: String,
    default: ';console.log("🐮 --- afterAppMount", app);'
  }
})

const emit = defineEmits(['update:templateValue', 'update:scriptValue', 'update:cssValue', 'update:imports'])

const editMode = ref('')
const iframeRef = ref(null)
const contentWrapWidth = ref(50)

let blob = ''
let iframeRefBlob = ''

const templateValueComputed = computed({
  get () {
    return props.templateValue
  },
  set (val) {
    emit('update:templateValue', val)
  }
})
const scriptValueComputed = computed({
  get () {
    return props.scriptValue
  },
  set (val) {
    emit('update:scriptValue', val)
  }
})
const cssValueComputed = computed({
  get () {
    return props.cssValue
  },
  set (val) {
    emit('update:cssValue', val)
  }
})
const importsComputed = computed({
  get () {
    return JSON.stringify(props.imports)
  },
  set (val) {
    emit('update:imports', JSON.parse(val))
  }
})

const onInput = (e) => {
  const val = +e.target.value
  if (!val) {
    contentWrapWidth.value = 0
    return
  }
  if (val > 100) {
    contentWrapWidth.value = 100
    return
  }
  if (val < 0) {
    contentWrapWidth.value = 0
    return
  }
  contentWrapWidth.value = val
}

const destroyBlob = () => {
  URL.revokeObjectURL(blob)
  URL.revokeObjectURL(iframeRefBlob)
  blob = ''
  iframeRefBlob = ''
}

watch(
  () => [
    props.templateValue,
    props.scriptValue,
    props.cssValue,
    props.imports,
    props.beforeAppMount,
    props.afterAppMount
  ],
  (newList, oldList) => {
    nextTick().then(() => {
      destroyBlob()
      blob = URL.createObjectURL(new Blob([props.scriptValue], { type: 'text/javascript;charset=UTF-8' }))
      iframeRefBlob = URL.createObjectURL(new Blob(
        [
                    `<style>
html, body{ padding: 0; margin: 0 }
${props.cssValue}
</style>
<script type="importmap">
  {
    "imports": ` + JSON.stringify(props.imports) + `
  }
</` + `script>

<div id="app"></div>

<script type="module">
  import { createApp } from 'vue'
  import option from '${blob}'

  ;${props.beforeAppMount};

  ;const app = createApp({
    template: '${props.templateValue.replace(/\n/g, '')}',
    ...option
  })

  ;${props.afterAppMount};

  ;app.mount('#app')
<` + '/script>'
        ],
        { type: 'text/html;charset=UTF-8' }
      ))

      console.log('watch-data', { newList, oldList, blob, iframeRefBlob })

      iframeRef.value.src = iframeRefBlob
    })
  },
  { immediate: true }
)

watch(() => props.mode, (newV, oldV) => {
  if (newV !== oldV) {
    editMode.value = newV
  }
}, { immediate: true })

onUnmounted(() => {
  destroyBlob()
})

</script>
<style scoped lang="scss">
    .toggle-btn-wrap {
      display: flex;
      margin-bottom: 10px;
      .toggle-btn {
        font-size: 14px;
        line-height: 1;
        padding: 0 10px;
        height: 30px;
        border: 1px solid #000;
        cursor: pointer;
        margin-right: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .iframe-wrap {
      width: 100%;
      display: flex;
      .content-wrap {
        display: flex;
        flex-direction: column;
        margin-right: 20px;
        border: 1px solid #000;
        .textarea-warp {
          width: 100%;
          border-bottom: none;
          .textarea-title {
            width: 100%;
            padding: 10px 20px;
            font-size: 16px;
            line-height: 1;
            box-sizing: border-box;
            border: none;
            border-bottom: 1px solid #000;
          }
          .textarea-item {
            padding: 10px;
            display: block;
            resize: none;
            width: 100%;
            height: 350px;
            overflow: auto;
            flex-shrink: 0;
            box-sizing: border-box;
            border: none;
            border-bottom: 1px solid #000;
            &:focus-visible {
              outline: none;
              border-bottom: 1px solid #000;
            }
          }
        }
      }
      .iframe-item {
        flex-shrink: 0;
        min-width: 0;
        padding: 0;
        margin: 0;
        display: block;
        border-width: 1px;
        flex-shrink: 0;
        box-sizing: border-box;
        border: 1px solid #000;
      }
    }
</style>

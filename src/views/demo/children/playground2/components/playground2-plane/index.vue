<template>
  <div class="w-full h-full flex flex-col">
    <!-- 模式切换按钮 -->
    <div class="toggle-btn-wrap shrink-0 flex items-center p-2 gap-2">
      <button
        class="toggle-btn px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 flex items-center justify-center"
        :class="
          editMode === 'preview'
            ? 'bg-purple-600 text-white shadow-md'
            : 'bg-white text-gray-700 border-[1px] border-solid border-gray-300 hover:bg-gray-50'
        "
        @click="editMode = 'preview'"
      >
        预览模式
      </button>
      <button
        class="toggle-btn px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 flex items-center justify-center"
        :class="
          editMode === 'edit'
            ? 'bg-purple-600 text-white shadow-md'
            : 'bg-white text-gray-700 border-[1px] border-solid border-gray-300 hover:bg-gray-50'
        "
        @click="editMode = 'edit'"
      >
        编辑模式
      </button>
      <div v-if="editMode === 'edit'" class="toggle-btn flex items-center gap-2">
        <label class="text-sm text-gray-600">编辑器宽度: {{ contentWrapWidth }}%</label>
        <input
          class="w-12 h-8 px-2 border-[1px] border-solid border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          type="number"
          :value="contentWrapWidth"
          @input="onInput"
        />
      </div>
    </div>

    <!-- 编辑器和预览区域 -->
    <div class="iframe-wrap flex flex-1 w-full">
      <div
        v-if="editMode === 'edit'"
        class="content-wrap flex flex-col mr-4 rounded-lg overflow-hidden border-[1px] border-solid border-gray-200 shadow-sm"
        :style="{ width: `${contentWrapWidth}%` }"
      >
        <!-- Template 编辑区 -->
        <div class="textarea-warp w-full">
          <div
            class="textarea-title bg-gray-100 px-4 py-2 font-medium text-gray-700 border-b border-gray-200"
          >
            template
          </div>
          <textarea
            class="textarea-item w-[calc(100%-20px*2)] h-[119px] py-3 px-[20px] bg-white border-b border-gray-200 focus:outline-none resize-none font-mono text-sm"
            v-model="templateValueComputed"
          />
        </div>

        <!-- Script 编辑区 -->
        <div class="textarea-warp w-full">
          <div
            class="textarea-title bg-gray-100 px-4 py-2 font-medium text-gray-700 border-b border-gray-200"
          >
            script
          </div>
          <textarea
            class="textarea-item w-[calc(100%-20px*2)] h-[119px] py-3 px-[20px] bg-white border-b border-gray-200 focus:outline-none resize-none font-mono text-sm"
            v-model="scriptValueComputed"
          />
        </div>

        <!-- CSS 编辑区 -->
        <div class="textarea-warp w-full">
          <div
            class="textarea-title bg-gray-100 px-4 py-2 font-medium text-gray-700 border-b border-gray-200"
          >
            css
          </div>
          <textarea
            class="textarea-item w-[calc(100%-20px*2)] h-[119px] py-3 px-[20px] bg-white border-b border-gray-200 focus:outline-none resize-none font-mono text-sm"
            v-model="cssValueComputed"
          />
        </div>

        <!-- Imports 编辑区 -->
        <div class="textarea-warp w-full">
          <div
            class="textarea-title bg-gray-100 px-4 py-2 font-medium text-gray-700 border-b border-gray-200"
          >
            imports
          </div>
          <textarea
            class="textarea-item w-[calc(100%-20px*2)] h-[119px] py-3 px-[20px] border-none bg-white focus:outline-none resize-none font-mono text-sm"
            v-model="importsComputed"
          />
        </div>
      </div>

      <!-- 预览iframe -->
      <iframe
        :style="{ flex: 1 }"
        class="iframe-item rounded-lg border-[1px] border-solid border-gray-200 shadow-sm bg-white"
        ref="iframeRef"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'

defineOptions({ name: 'view-demo-playground2-plane' })

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

const emit = defineEmits([
  'update:templateValue',
  'update:scriptValue',
  'update:cssValue',
  'update:imports'
])

const editMode = ref('')
const iframeRef = ref(null)
const contentWrapWidth = ref(50)

let blob = ''
let iframeRefBlob = ''

const templateValueComputed = computed({
  get() {
    return props.templateValue
  },
  set(val) {
    emit('update:templateValue', val)
  }
})
const scriptValueComputed = computed({
  get() {
    return props.scriptValue
  },
  set(val) {
    emit('update:scriptValue', val)
  }
})
const cssValueComputed = computed({
  get() {
    return props.cssValue
  },
  set(val) {
    emit('update:cssValue', val)
  }
})
const importsComputed = computed({
  get() {
    return JSON.stringify(props.imports)
  },
  set(val) {
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
      blob = URL.createObjectURL(
        new Blob([props.scriptValue], { type: 'text/javascript;charset=UTF-8' })
      )
      iframeRefBlob = URL.createObjectURL(
        new Blob(
          [
            `<style>
html, body{ padding: 0; margin: 0 }` +
              (props.cssValue ? '\n' + props.cssValue : '') +
              `</style>
<script type="importmap">
  {
    "imports": ` +
              JSON.stringify(props.imports) +
              `
  }
</` +
              `script>

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
<` +
              '/script>'
          ],
          { type: 'text/html;charset=UTF-8' }
        )
      )

      iframeRef.value.src = iframeRefBlob
    })
  },
  { immediate: true }
)

watch(
  () => props.mode,
  (newV, oldV) => {
    if (newV !== oldV) {
      editMode.value = newV
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  destroyBlob()
})
</script>

<style scoped lang="scss">
/* 自定义滚动条样式 */
.textarea-item::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.textarea-item::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.textarea-item::-webkit-scrollbar-thumb {
  background: rgba(79, 70, 229, 0.5);
  border-radius: 3px;
}

.textarea-item::-webkit-scrollbar-thumb:hover {
  background: rgba(79, 70, 229, 0.7);
}
</style>

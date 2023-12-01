<template>
  <div class="md-preview">
    <v-md-preview
      ref="mdPreview"
      :toolbar="toolbar"
      v-model="text"
      :disabled-menus="[]"
      default-show-toc
      autofocus
      :left-toolbar="leftToolbar"
      height="100vh"
      @upload-image="onUploadImage"
      @fullscreen-change="onFullscreenChange"
      @save="onSave"/>
  </div>
</template>
<script>
import { nextTick, ref } from 'vue'
import { useFullscreen } from '@vueuse/core'
import FileSaver from 'file-saver'

import vMdPreview from '@kangc/v-md-editor/lib/codemirror-editor'
import '@kangc/v-md-editor/lib/style/codemirror-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index'
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css'
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index'
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css'
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index'
import createHighlightLinesPlugin from '@kangc/v-md-editor/lib/plugins/highlight-lines/index'
import '@kangc/v-md-editor/lib/plugins/highlight-lines/highlight-lines.css'
import createAlignPlugin from '@kangc/v-md-editor/lib/plugins/align'

// highlightjs
import hljs from 'highlight.js'

// codemirror 编辑器的相关资源
import Codemirror from 'codemirror'
// mode
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/css/css'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/vue/vue'
// edit
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/matchbrackets'
// placeholder
import 'codemirror/addon/display/placeholder'
// active-line
import 'codemirror/addon/selection/active-line'
// scrollbar
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/scroll/simplescrollbars.css'
// style
import 'codemirror/lib/codemirror.css'

import { fileToBase64Async } from '@/common/methods'
import guid from '@/common/util/guid'

vMdPreview.Codemirror = Codemirror
vMdPreview.use(githubTheme, { Hljs: hljs })
vMdPreview.use(createEmojiPlugin())
vMdPreview.use(createTodoListPlugin())
vMdPreview.use(createLineNumbertPlugin())
vMdPreview.use(createHighlightLinesPlugin())
vMdPreview.use(createAlignPlugin())

export default {
  components: {
    vMdPreview
  },
  setup () {
    const text = ref('要不写点啥... ...')
    const mdPreview = ref(null)
    const { toggle } = useFullscreen(mdPreview)
    return {
      text,
      mdPreview,
      leftToolbar: ref('undo redo clear | h bold italic strikethrough quote | emoji | todo-list | customToolbar1 | ul ol table hr | link image code | save'),
      toolbar: {
        customToolbar1: {
          title: '自定义工具栏',
          icon: 'v-md-icon-tip',
          menus: [
            {
              name: 'menu1',
              text: '着重文字',
              action (editor) {
                editor.insert((selected) => {
                  const prefix = ' `'
                  const suffix = '` '
                  const placeholder = '请输入文本'
                  const content = selected || placeholder
                  return {
                    text: `${prefix}${content}${suffix}`,
                    selected: content
                  }
                })
              }
            },
            {
              name: 'menu2',
              text: '生成快捷目录',
              action (editor) {
                editor.insert(() => {
                  text.value = `[[toc]] \n\n${text.value}`
                })
              }
            }
          ]
        }
      },
      onSave: (text) => {
        FileSaver.saveAs(new Blob([text]), 'my-markdown.md')
      },
      onFullscreenChange: (isFullscreen) => {
        toggle(isFullscreen)
      },
      onUploadImage: (event, insertImage, files) => {
        fileToBase64Async(files[0]).then(res => {
          const id = `id_${guid()}`
          mdPreview.value.insert(() => {
            return {
              // 要插入的文本
              text: `![image][${id}]`,
              // 插入后要选中的文本
              selected: ''
            }
          })
          nextTick().then(() => {
            text.value = `${text.value} \n\n[${id}]: ${res}`
          })
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
.md-preview {
    height: 100vh;
}
</style>

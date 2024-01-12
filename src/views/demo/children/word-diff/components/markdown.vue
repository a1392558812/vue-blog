<script>
import { ref } from 'vue'
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import hljs from 'highlight.js'
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index'
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index'
import '@kangc/v-md-editor/lib/style/preview.css'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css'
VMdPreview.use(githubTheme, { Hljs: hljs })
VMdPreview.use(createCopyCodePlugin())
VMdPreview.use(createLineNumbertPlugin())

export default {
  name: 'Markdown',
  components: {
    VMdPreview
  },
  props: {
    markdownText: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const preview = ref(null) // markdown引用

    return {
      preview
    }
  },
  render () {
    return (
        <v-md-preview ref='preview' text={this.markdownText}/>
    )
  }
}
</script>

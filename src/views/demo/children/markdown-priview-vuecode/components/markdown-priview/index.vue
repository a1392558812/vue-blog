<script lang="jsx">
import vMdPreview from '@/components/v-md-preview/index.js'

export default {
  name: 'Markdown',
  components: {
    vMdPreview
  },
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    htmlMD: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    return {}
  },
  render () {
    return (
      <>
        <div class='title flex align-items-center justify-content-center'>
          { this.title }
        </div>
        <div class='relative markdown' v-loading={this.loading}>
            {
                this.loading
                  ? null
                  : <v-md-preview
                      class='width100'
                      text={this.htmlMD}/>
            }
        </div>
      </>
    )
  }
}
</script>

<style scoped lang="scss">
    .markdown {
      width: 100%;
      padding-bottom: 100px;
    }
    .title {
      box-sizing: border-box;
      color: var(--global-text-color);
      padding: 20px 30px;
      font-size: 18px;
      font-weight: 600;
    }
</style>

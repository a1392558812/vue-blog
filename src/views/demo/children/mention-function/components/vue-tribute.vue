<script lang="jsx">
import { defineComponent, watch, onMounted, onBeforeUnmount, nextTick, ref, unref } from 'vue'
// import Tribute from 'tributejs/src/index'
import Tribute from '@/static/tribute/index'
export default defineComponent({
  name: 'vue-tribute',
  props: {
    options: {
      type: Object,
      default: () => ({
        collection: [{ values: [] }]
      }),
      required: true
    }
  },
  setup(props, context) {
    if (typeof Tribute === 'undefined') {
      throw new Error('[vue-tribute] cannot locate tributejs.')
    }

    const root = ref(null)
    const el = ref(null)

    const attachTribute = (el, options = props.options) => {
      if (!el.value) return

      const tribute = new Tribute(unref(options))
      context.emit('initTribute', tribute)
      tribute.attach(el.value)
      el.value.tributeInstance = tribute
    }

    onMounted(() => {
      el.value = root.value ? $(root.value).children()[0] : null
      if (!el.value) {
        throw new Error('[vue-tribute] 包裹组件下无插槽内容组件')
      }

      attachTribute(el)

      el.value.addEventListener('tribute-replaced', (e) => {
        e.target?.dispatchEvent(new Event('input', { bubbles: true }))
      })
    })

    const detachTribute = (el) => {
      if (!el.value?.tributeInstance) return

      el.value.tributeInstance.detach(el.value)
      el.value.tributeInstance = undefined
      delete el.value.dataset.tribute
    }

    onBeforeUnmount(() => {
      detachTribute(el)
    })

    watch(
      () => props.options,
      async (newOptions) => {
        if (el.value?.tributeInstance) {
          await nextTick()
          detachTribute(el)
          await nextTick()
          attachTribute(el, { ...newOptions })
        }
      },
      { deep: true }
    )

    return () => (
      <div class="v-tribute" ref={root}>
        {[context.slots.default ? context.slots.default()[0] : null].filter(Boolean)}
      </div>
    )
  }
})
</script>

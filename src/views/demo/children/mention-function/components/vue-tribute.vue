<template>
  <div class="v-tribute w-full" ref="root">
    <slot></slot>
  </div>
</template>

<script>
import { defineComponent, watch, onMounted, onBeforeUnmount, nextTick, ref, unref } from 'vue'
// import Tribute from 'tributejs/src/index'
import Tribute from '@/static/tribute/index'
export default defineComponent({
  name: 'vue-tribute',
  props: {
    options: {
      type: Object,
      default: () => ({ collection: [{ values: [] }] }),
      required: true
    }
  },
  emits: ['initTribute'],
  setup(props, { emit, slots }) {
    if (typeof Tribute === 'undefined') {
      throw new Error('[vue-tribute] cannot locate tributejs.')
    }

    const root = ref(null)
    const el = ref(null)

    const attachTribute = (el, options = props.options) => {
      if (!el.value) return

      const tribute = new Tribute(unref(options))
      emit('initTribute', tribute)
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

    return {
      root
    }
  }
})
</script>

<style scoped lang="scss">
.v-tribute {
  display: inline-block;
  position: relative;
}

/* 自定义tribute下拉菜单样式 */
.tribute-container {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 100;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  max-height: 300px;
  overflow-y: auto;
}

.tribute-list-item {
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tribute-list-item:hover,
.tribute-list-item.highlight {
  background-color: #f7fafc;
}

.tribute-list-item img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.tribute-list-item-inner {
  flex: 1;
}

/* 搜索匹配高亮 */
.tribute-container span {
  background-color: #ebf8ff;
  color: #2b6cb0;
  font-weight: 500;
  padding: 0 2px;
  border-radius: 2px;
}
</style>

import { createApp } from 'vue'
const isDOM = (dom) => {
  if (typeof HTMLElement === 'object') {
    return dom instanceof HTMLElement
  } else {
    return dom && typeof dom === 'object' && dom.nodeType === 1 && typeof dom.nodeName === 'string'
  }
}

export default function createLoadingLikeDirective(Comp) {
  let instance
  return {
    mounted(el, binding) {
      const app = createApp(Comp, { showModal: binding.value })
      instance = app.mount(document.createElement('div'))
      el.instance = instance
      append(el)
    },
    updated(el, binding) {
      if (binding.value !== binding.oldValue) {
        instance.setShowModal(binding.value)
      }
    },
    unmounted(el, binding) {
      remove(el)
    }
  }
  function append(el) {
    el.appendChild(el.instance.$el)
  }
  function remove(el) {
    isDOM(el.instance.$el) && el.removeChild(el.instance.$el)
  }
}

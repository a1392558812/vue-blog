import { render, createVNode } from 'vue'
import toastComponent from './index.vue'

let instance

function getInstance() {
  if (instance) return
  const divNode = document.createElement('div')
  instance = createVNode(toastComponent)

  // 渲染实例
  render(instance, divNode)

  // 插入子节点
  document.body.appendChild(divNode)
}

export default function tosat() {
  getInstance()
  return instance.component.exposed
}

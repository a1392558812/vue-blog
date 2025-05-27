import { createApp } from 'vue'
import toastComponent from './index.vue'

let instance

function getInstance() {
  if (instance) return

  const divNode = document.createElement('div')
  instance = <toastComponent />

  createApp({
    name: 'router-switch-loading',
    render() { return instance }
  }).mount(divNode)

  // 插入子节点
  document.body.appendChild(divNode)
}

export default function tosat() {
  getInstance()
  return instance.component.exposed
}

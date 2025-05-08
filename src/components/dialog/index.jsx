import { createApp } from 'vue'
import dialog from './dialog.vue'
let instance
function mountComponent(RootComponent, options) {
  console.log('mountComponent', RootComponent, options)
  let warp = {
    render() {
      return <RootComponent {...options} />
    }
  }
  if (options.contentContent && Object.keys(options.contentContent).length) {
    warp = {
      components: {
        Content: options.contentContent
      },
      render() {
        return (
          <RootComponent {...options}>
            {{
              content: () => <Content />
            }}
          </RootComponent>
        )
      }
    }
  }
  const app = createApp(warp)
  const root = document.createElement('div')
  document.body.appendChild(root)
  return {
    instance: app.mount(root),
    app,
    unmount() {
      app.unmount()
      document.body.removeChild(root)
    }
  }
}

const mountContent = (options = {}) => {
  let flag // 是否不存在实例
  if (!instance) {
    flag = true
  } else {
    flag = !instance.instance
  }
  if (flag) {
    instance = mountComponent(dialog, Object.assign({ dialogABool: true }, options))
    return instance
  } else {
    instance.unmount()
    instance = null
    return mountContent(options)
  }
}

export default mountContent

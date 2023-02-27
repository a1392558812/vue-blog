export const asyncLoadJs = (url) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    document.head.appendChild(script)
    script.onload = (res) => {
      console.log('加载.', res)
      resolve()
    }
    script.onerror = (e) => {
      reject(new Error(e))
    }
  })
}
export const asyncLoadCss = (linkUrl) => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.href = linkUrl
    link.rel = 'stylesheet'
    link.type = 'text/css'
    document.head.appendChild(link)
    link.onload = () => {
      resolve()
    }
    link.onerror = (e) => {
      reject(new Error(e))
    }
  })
}

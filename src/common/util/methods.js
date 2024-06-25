import axios from 'axios'

/* 下载 */
export const downFileByAxios = (href) => {
  axios({
    method: 'get',
    url: href,
    // 必须显式指明响应类型是一个Blob对象，这样生成二进制的数据，才能通过window.URL.createObjectURL进行创建成功
    responseType: 'blob'
  }).then((res) => {
    if (!res) {
      return
    }
    // 将lob对象转换为域名结合式的url
    const blobUrl = window.URL.createObjectURL(res.data)
    const link = document.createElement('a')
    document.body.appendChild(link)
    link.style.display = 'none'
    link.href = blobUrl
    // 设置a标签的下载属性，设置文件名及格式，后缀名最好让后端在数据格式中返回
    link.download = '下载'
    // 自触发click事件
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)
  })
}

/* markdown类型 */
export const markdownTypeCheck = (type) => {
  return [
    'md',
    'js',
    'ts',
    'jsx',
    'html',
    'py'
  ].filter(item => item === type).length
}

/* image图片类型 */
export const imgTypeCheck = (type) => {
  return [
    'jpg',
    'png',
    'gif',
    'jpeg'
  ].filter(item => item === type).length
}

/* html结构转json结构 */
export const htmlToJson = ($dt, ifRender = false, ifShow = false) => {
  // h3标签为文件夹名称
  const $h3 = $dt.children('h3')
  if ($h3.length === 0) {
    const $a = $dt.children('a')
    // 返回该书签的名称和网址组成的对象
    return $a.length > 0
      ? Object.freeze({
        name: $a.text(),
        href: $a.attr('href'),
        ...($a.attr('icon') ? { icon: $a.attr('icon') } : {})
      })
      : null
  }
  const h3 = $h3.text()
  const arr = []
  const obj = { ifRender: false, ifShow: false }
  // 获取下一级dt标签集合
  const $dl = $dt.children('dl')
  const $dtArr = $dl.children('dt')
  for (let i = 0; i < $dtArr.length; i++) {
    // 遍历下一级dt标签
    const tmp = htmlToJson($dtArr.eq(i))
    // 将返回的对象push至子文件数组
    arr.push(tmp)
  }
  // 创建文件夹与子文件数组的键值对
  obj.name = h3
  obj.child = arr
  // 返回该对象
  return obj
}

/* 获取x~y的随机整数 */
export const randomXtoY = (x, y) => Math.round(Math.random() * (y - x) + x)

/* 获取页面baseUrl */
export const baseUrlFun = () => window.location.origin + window.location.pathname

/* File转base64 */
export const fileToBase64Async = (file) => {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      resolve(e.target.result)
    }
  })
}

/* 生成随机背景色 */
export const getRandomColor = (flag = true) => {
  const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
  if (flag) {
    let str = '#'
    for (let i = 0; i < 6; i++) {
      const random = Math.floor(Math.random() * arr.length)
      str += arr[random]
    }
    return str
  } else {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    return `rgb(${r},${g},${b})`
  }
}

/* 异步加载js */
export const asyncLoadJs = (url) => {
  const attrName = 'data-loadtype'
  const attrValue = 'asyncloadjs'
  return new Promise((resolve, reject) => {
    if (!document) {
      return reject(new Error('document not find'))
    }

    let script = document.querySelector(`script[src="${url}"][${attrName}="${attrValue}"]`)
    if (script) {
      script.parentNode.removeChild(script)
      console.log(`asyncLoadJs异步加载script标签更新: ${url}`)
      script = null
    }

    script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    script.setAttribute(`${attrName}`, `${attrValue}`)
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

/* 异步加载css */
export const asyncLoadCss = (linkUrl) => {
  const attrName = 'data-loadtype'
  const attrValue = 'asyncloadcss'
  return new Promise((resolve, reject) => {
    if (!document) {
      return reject(new Error('document not find'))
    }

    let link = document.querySelector(`link[href="${linkUrl}"][${attrName}="${attrValue}"]`)
    if (link) {
      link.parentNode.removeChild(link)
      console.log(`asyncLoadCss异步加载link标签更新: ${linkUrl}`)
      link = null
    }

    link = document.createElement('link')
    link.href = linkUrl
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.setAttribute(`${attrName}`, `${attrValue}`)
    document.head.appendChild(link)
    link.onload = () => {
      resolve()
    }
    link.onerror = (e) => {
      reject(new Error(e))
    }
  })
}

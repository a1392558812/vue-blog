/* 导入目录下全部*.xxx格式文件 */
const importAll = (reg = /\.vue$/g) => {
  return context => {
    const map = {}
    for (const key of context.keys()) {
      const keyArr = key.split('/')
      keyArr.shift() // 移除.
      map[keyArr.join('.').replace(reg, '')] = context(key).default
    }

    return map
  }
}

export default importAll

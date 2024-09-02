export const selectTemplate = (item) => {
  let dataStr = ''
  Object.keys(item.original).forEach((key) => {
    dataStr += `data-${key}=${item.original[key]} `
  })
  return `<span contenteditable="false" ${dataStr}>
            <a href="https://github.com/a1392558812/myShare" title="Awen的github" target="_blank">${item.original.value}</a>
          </span>`
}
export const noMatchTemplate = () => '<div class="tribute-list-item-inner">暂无匹配数据┭┮﹏┭┮</div>'
export const menuItemTemplate = (item) => `<div class='flex tribute-list-item-inner'>
<img src="${item.original.avatar_url}">
<div class="tribute-list-item-info">
  <p>姓名：${item.string}</p>
  <p>手机号：${item.original.phone}</p>
</div>
</div>`

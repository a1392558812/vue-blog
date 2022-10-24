const proportion = 150 / 200
function addWaterMarker (str, parentNode, font, textColor, size = 500) {
  // 水印文字，父元素，字体，文字颜色
  const can = document.createElement('canvas')
  parentNode.appendChild(can)
  can.width = size
  can.height = size * proportion
  can.style.display = 'none'
  const cans = can.getContext('2d')
  cans.rotate((-20 * Math.PI) / 180)
  cans.font = font || '16px Microsoft JhengHei'
  cans.fillStyle = textColor || 'rgba(180, 180, 180, 0.3)'
  cans.textAlign = 'left'
  cans.textBaseline = 'Middle'
  cans.fillText(str, can.width / 10, can.height / 2)
  parentNode.style.backgroundImage = 'url(' + can.toDataURL('image/png') + ')'
}

const waterMarker = {
  mounted: function (el, binding) {
    console.log('waterMarker-bind')
    addWaterMarker(binding.value.text, el, binding.value.font, binding.value.textColor, binding.value.size)
  }
}

export default waterMarker

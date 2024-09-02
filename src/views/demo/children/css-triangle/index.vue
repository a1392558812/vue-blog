<template>
  <div class="flex align-items-stretch justify-content-center css-triangle">
    <div class="css-triangle-filed">
      <div class="css-triangle-params">
        <span>方向：</span>
        <select v-model="params.direction">
          <option
            v-for="(item, index) in [
              { label: '上', value: 'top' },
              { label: '下', value: 'bottom' },
              { label: '左', value: 'left' },
              { label: '右', value: 'right' }
            ]"
            :value="item.value"
            :key="index"
          >
            {{ item.label }}
          </option>
        </select>
      </div>
      <div class="css-triangle-params">
        <span>宽：</span>
        <input
          class="css-triangle-input"
          type="number"
          :value="params.width"
          @input="
            function (e) {
              onInput(e, 'width')
            }
          "
          placeholder="请输入三角形的宽"
        />
      </div>
      <div class="css-triangle-params">
        <span>高：</span>
        <input
          class="css-triangle-input"
          type="number"
          :value="params.height"
          @input="
            function (e) {
              onInput(e, 'height')
            }
          "
          placeholder="请输入三角形的高"
        />
      </div>
      <div class="css-triangle-params">
        <span>旋转角度：</span>
        <input
          class="css-triangle-input"
          type="number"
          :value="params.angle"
          @input="
            function (e) {
              onInput(e, 'angle')
            }
          "
          placeholder="请输入三角形的高"
        />
      </div>
      <div class="css-triangle-params" style="margin-bottom: 0">
        <pre class="width100"><code class="display-block width100">{{ triangleStyle }}</code></pre>
      </div>
    </div>
    <div class="flex align-items-center justify-content-center css-triangle-output-wrap">
      <div class="css-triangle-output" :style="triangleStyle"></div>
    </div>
    <div>
      <div style="margin-bottom: 10px">
        <div :style="boxStyle"></div>
      </div>
      <div>
        <pre><code>{{ boxStyle }}</code></pre>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, reactive } from 'vue'

defineOptions({ name: 'view-demo-css-triangle' })

const boxStyle = {
  width: 0,
  height: 0,
  border: '100px solid',
  borderColor: '#FFA500 #ff0000 #008000 #808080'
}

const params = reactive({
  width: 50,
  height: 50,
  direction: 'bottom',
  angle: 0
})

const onInput = (e, type) => {
  if (!e.target.value) {
    params[type] = 0
    e.target.value = 0
  }
  if (type === 'angle') {
    if (+e.target.value > 360) {
      params.angle = 360
      e.target.value = 360
      return
    }
    if (+e.target.value < 0) {
      params.angle = 0
      e.target.value = 0
      return
    }
    params.angle = (+e.target.value).toFixed(0)
    e.target.value = (+e.target.value).toFixed(0)
  }
  if (type === 'width' || type === 'height') {
    if (+e.target.value > 100) {
      params[type] = 100
      e.target.value = 100
      return
    }
    if (+e.target.value < 0) {
      params[type] = 0
      e.target.value = 0
      return
    }
    params[type] = (+e.target.value).toFixed(0)
    e.target.value = (+e.target.value).toFixed(0)
  }
}

const triangleStyle = computed(() => {
  let borderWidth = ''
  let borderColor = ''
  switch (params.direction) {
    case 'top':
      borderWidth = `0 ${params.width}px ${params.height}px ${params.width}px`
      borderColor = 'transparent transparent red transparent'
      break
    case 'bottom':
      borderWidth = `${params.height}px ${params.width}px 0 ${params.width}px`
      borderColor = 'red transparent transparent  transparent'
      break
    case 'left':
      borderWidth = `${params.height}px ${params.width}px ${params.height}px 0`
      borderColor = 'transparent red transparent  transparent'
      break
    case 'right':
      borderWidth = `${params.height}px 0 ${params.height}px ${params.width}px`
      borderColor = 'transparent transparent transparent red'
      break
  }
  return {
    display: 'inline-block',
    width: '0',
    height: '0',
    borderStyle: 'solid',
    transform: `rotate(${params.angle}deg)`,
    borderWidth,
    borderColor
  }
})
</script>
<style scoped lang="scss">
.css-triangle {
  .css-triangle-filed {
    max-width: 400px;
    margin-right: 10px;
    .css-triangle-input {
      max-width: 3em;
    }
  }
  .css-triangle-params {
    padding: 10px;
    border: 1px solid #000;
    margin-bottom: 10px;
    code {
      white-space: break-spaces;
    }
  }
  .css-triangle-output-wrap {
    width: 300px;
    border: 1px solid #000;
    margin-right: 10px;
  }
}
</style>

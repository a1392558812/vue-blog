<template>
    <div class="flex justify-content-center align-items-stretch">
        <div class="form-input">
            <div class="flex align-items-center form-filed" v-for="(item, index) in [
                { label: 'box宽', key: 'width'},
                { label: 'box高', key: 'height'},
                { label: '滚动条宽度', key: 'scrollWidth'},
                { label: '滚动条圆角', key: 'borderRadius'},
                { label: '滚动条边框厚度', key: 'borderWidth'},
            ]" :key="index">
                <div>{{ item.label }}：</div>
                <input :value="params[item.key]" type="number" @input="function(e) { onInput(e, item.key) }"/>
            </div>
            <div class="flex align-items-center form-filed" v-for="(item, index) in [
                { label: '滚动条轨道颜色', key: 'scrollbarTrackColor'},
                { label: '滚动条滑块颜色', key: 'scrollbarThumbColor'},
                { label: '滚动条滑块边框颜色', key: 'borderColor'},
            ]" :key="index">
                <div>{{ item.label }}：</div>
                <input :value="params[item.key]" type="color" @input="function(e) { onInputColor(e, item.key) }"/>
            </div>
        </div>
        <div class="overflow-auto css-scrollbar">
            <pre :style="{ width: `${2 * params.width}px`, height: `${2 * params.height}px` }"><code>{{ css }}</code></pre>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useStyleTag } from '@vueuse/core'

const params = reactive({
  width: 350,
  height: 450,
  scrollWidth: 40,
  borderRadius: 20,
  borderWidth: 7,
  scrollbarTrackColor: '#ff0000',
  scrollbarThumbColor: '#00ff00',
  borderColor: '#0000ff'
})

const createCss = ({ width, height, scrollWidth, borderRadius, scrollbarTrackColor, scrollbarThumbColor, borderWidth, borderColor }) =>
`.css-scrollbar {
  width: ${width}px;
  height: ${height}px;
}

.css-scrollbar::-webkit-scrollbar {
  width: ${scrollWidth}px;
  height: ${scrollWidth}px;
}

.css-scrollbar::-webkit-scrollbar-track {
  background: ${scrollbarTrackColor};
  border-radius: ${borderRadius}px;
}

.css-scrollbar::-webkit-scrollbar-thumb {
  background: ${scrollbarThumbColor};
  border-radius: ${borderRadius}px;
  border: ${borderWidth}px solid ${borderColor};
}`

const { css } = useStyleTag(createCss(params))

const onInput = (e, type) => {
  if (!e.target.value) {
    params[type] = 0
    e.target.value = 0
    css.value = createCss(params)
    return
  }
  if (+e.target.value < 0) {
    console.log('onInput', +e.target.value)
    params[type] = 0
    e.target.value = 0
    css.value = createCss(params)
    return
  }
  params[type] = (+e.target.value).toFixed(0)
  e.target.value = (+e.target.value).toFixed(0)
  css.value = createCss(params)
}

const onInputColor = (e, type) => {
  params[type] = e.target.value
  css.value = createCss(params)
}

</script>

<style scoped lang="scss">
    .css-scrollbar {
        border: 1px solid #000;
        padding: 10px;
    }
    .form-input {
        padding: 10px;
        border: 1px solid #000;
        margin-right: 10px;
        .form-filed {
            margin-bottom: 10px;
        }
    }
</style>

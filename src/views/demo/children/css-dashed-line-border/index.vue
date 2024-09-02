<template>
    <div class="flex justify-content-center align-items-stretch">
        <div class="box-form">
            <div v-for="(item, index) in [
                { label: 'box宽', key: 'boxWidth'},
                { label: 'box高', key: 'boxHeight'},
                { label: '边框缩短长度', key: 'width'},
                { label: '边框虚线长度', key: 'backgroundSizeLong'},
                { label: '边框起始位置偏移量', key: 'position'},
                { label: '边框厚度', key: 'thickness'},
                { label: '虚线中实线占比', key: 'borderRate'},
            ]" :key="index" class="flex align-items-center form-filed">
                <div>{{ item.label }}：</div>
                <input :value="params[item.key]" type="number" @input="function(e) { onInput(e, item.key) }"/>
            </div>
            <div class="flex align-items-center form-filed">
                <div>虚线颜色：</div>
                <input v-model="params.borderColor" type="color" />
            </div>
        </div>
        <div class="flex flex-wrap output-from">
            <pre v-for="(item, index) in [
                { label: 'htmlTemplate', value: htmlTemplate },
                { label: '.border-wrap', value: boxStyle },
                { label: '.border-top', value: borderTopStyle },
                { label: '.border-left', value: borderLeftStyle },
                { label: '.border-bottom', value: borderBottomStyle },
                { label: '.border-right', value: borderRightStyle },
            ]" :key="index" class="output-from-filed"><code class="display-block width100">{{ item.label }} {{ item.value }}</code></pre>
        </div>
        <div class="flex align-items-center justify-content-center output-result">
            <div :style="boxStyle" class="relative border-box-wrap">
                <div :style="borderTopStyle"></div>
                <div :style="borderLeftStyle"></div>
                <div :style="borderBottomStyle"></div>
                <div :style="borderRightStyle"></div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive, computed } from 'vue'

const htmlTemplate = `
/* html结构 */
<div class="border-wrap">
    <div class="border-top"></div>
    <div class="border-left"></div>
    <div class="border-bottom"></div>
    <div class="border-right"></div>
</div>`

const params = reactive({
  boxWidth: 200,
  boxHeight: 200,
  width: 10,
  backgroundSizeLong: 15,
  position: 5,
  thickness: 1,
  borderRate: 50,
  borderColor: '#ff0000'
})

const boxStyle = computed(() => ({
  width: `${params.boxWidth}px`,
  height: `${params.boxHeight}px`,
  position: 'reactive'
}))

const borderTopStyle = computed(() => ({
  width: `calc(100% - ${params.width}px)`,
  left: `${params.position}px`,
  top: 0,
  height: `${params.thickness}px`,
  backgroundImage: `linear-gradient(to right, ${params.borderColor} 0%, ${params.borderColor} ${params.borderRate}%, transparent ${params.borderRate}%, transparent 100%)`,
  backgroundSize: `${params.backgroundSizeLong}px ${params.thickness}px`,
  backgroundRepeat: 'repeat-x',
  position: 'absolute'
}))

const borderLeftStyle = computed(() => ({
  width: `${params.thickness}px`,
  left: 0,
  top: `${params.position}px`,
  height: `calc(100% - ${params.width}px)`,
  backgroundImage: `linear-gradient(to top, ${params.borderColor} 0%, ${params.borderColor} ${params.borderRate}%, transparent ${params.borderRate}%, transparent 100%)`,
  backgroundSize: `${params.thickness}px ${params.backgroundSizeLong}px`,
  backgroundRepeat: 'repeat-y',
  position: 'absolute'
}))

const borderBottomStyle = computed(() => ({
  width: `calc(100% - ${params.width}px)`,
  left: `${params.position}px`,
  bottom: 0,
  height: `${params.thickness}px`,
  backgroundImage: `linear-gradient(to right, ${params.borderColor} 0%, ${params.borderColor} ${params.borderRate}%, transparent ${params.borderRate}%, transparent 100%)`,
  backgroundSize: `${params.backgroundSizeLong}px ${params.thickness}px`,
  backgroundRepeat: 'repeat-x',
  position: 'absolute'
}))

const borderRightStyle = computed(() => ({
  width: `${params.thickness}px`,
  top: `${params.position}px`,
  right: 0,
  height: `calc(100% - ${params.width}px)`,
  backgroundImage: `linear-gradient(to top, ${params.borderColor} 0%, ${params.borderColor} ${params.borderRate}%, transparent ${params.borderRate}%, transparent 100%)`,
  backgroundSize: `${params.thickness}px ${params.backgroundSizeLong}px`,
  backgroundRepeat: 'repeat-y',
  position: 'absolute'
}))

const onInput = (e, type) => {
  if (!e.target.value) {
    params[type] = 1
    e.target.value = 1
    return
  }
  if (+e.target.value <= 0) {
    console.log('onInput', +e.target.value)
    params[type] = 1
    e.target.value = 1
    return
  }
  params[type] = (+e.target.value).toFixed(0)
  e.target.value = (+e.target.value).toFixed(0)
}
</script>
<style scoped lang="scss">
    .box-form {
        padding: 10px;
        margin-right: 10px;
        border: 1px solid #000;
    }
    .form-filed {
        margin-bottom: 10px;
    }
    .border-box-wrap {
      margin-right: 10px;
    }
    .output-result {
        padding: 0 30px;
        border: 1px solid #000 ;
        margin-right: 10px;
    }
    .output-from {
        border: 1px solid #000;
        width: 684px;
        margin-right: 10px;
        .output-from-filed {
            width: 300px;
            padding: 10px;
            border: 1px solid #000;
            margin: 10px;
            code {
                white-space: break-spaces;
            }
        }
    }
</style>

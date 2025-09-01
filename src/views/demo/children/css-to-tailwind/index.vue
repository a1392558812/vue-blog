<template>
  <div class="flex flex-wrap" style="padding: 10px">
    <div class="shrink-0 filed">
      <div>输入css代码</div>
      <textarea class="w-[100%]" style="height: 300px; resize: none" v-model="cssCode" />
    </div>

    <div class="shrink-0 filed">
      <div>输入css-主题代码（JSON格式,若无需配置改为"{}"即可）</div>
      <textarea class="w-[100%]" style="height: 300px; resize: none" v-model="customTheme" />
    </div>

    <div class="shrink-0 filed" style="width: 1200px">
      <div>输出css代码</div>
      <div class="w-[100%] overflow-auto" style="height: 300px">
        <div v-for="(item, index) in result" style="margin-bottom: 10px; padding: 10px" :key="index">
          <div v-for="(key, keyIndex) in Object.keys(item)" :key="`${index}-${keyIndex}`">
            <div class="w-[100%]" style="word-wrap: break-word">{{ key }}: {{ item[key] }}</div>
            <div v-if="key === 'resultVal'">
              <button @click="onCopy(item[key])">复制</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <toast ref="toastRefDom" />
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { CssToTailwindTranslator } from 'css-to-tailwind-translator'
import toast from '@/components/toast/index.vue'
import { useClipboard } from '@vueuse/core'

const { copy, copied, isSupported } = useClipboard()
const toastRefDom = ref(null)

const cssCode = ref(`
@media (min-width: 1800px) {
  .content-body {
    width: 288px;
    height: 50%;
    margin: 0 !important;
    transform: rotate(99deg);
    backdrop-filter: blur(99999px);
    box-shadow: 10px 10px 5px #888888;
  }
}
.main {
  width: 100%;
}
`)

const customTheme = ref(`
{
  "media":{
    "@media (min-width: 1800px)":"3xl"
  },
  "backdrop-blur":{
    "99999px":"super-big"
  },
  "rotate":{
    "99deg":"crooked"
  },
  "width":{
    "288px":"w-custom"
  },
  "box-shadow":{
    "10px 10px 5px #888888":"box-shadow-custom"
  }
}
`)

const result = computed(() => {
  try {
    const conversionResult = CssToTailwindTranslator(cssCode.value, {
      customTheme: JSON.parse(customTheme.value)
    })
    console.log('conversionResult', conversionResult)
    if (conversionResult && conversionResult.code === 'OK') {
      return conversionResult.data
    } else {
      return [['代码输入格式有误']]
    }
  } catch (e) {
    return [['主题输入格式有误']]
  }
})

const onCopy = (toCopyStr) => {
  console.log('onCopy', toCopyStr)
  if (!isSupported) {
    return alert('浏览器不支持复制功能')
  }
  copy(toCopyStr).then(() => {
    toastRefDom.value.addToast({
      contentWrapStyle: { background: 'rgba(0, 0, 0, 0.8)', color: '#fff' },
      contentStyle: { color: '#fff' },
      content: copied.value ? `复制成功` : `复制失败`
    })
  })

}
</script>
<style lang="scss" scoped>
.filed {
  width: 600px;
  border: 1px solid #000;
}
</style>

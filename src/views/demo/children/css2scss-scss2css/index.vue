<template>
  <div class="h-screen overflow-auto">
    <div>
      <button class="w-[100px] h-[50px] mr-[20px]" @click="mode = 'scssToCss'">scssToCss</button>
      <button class="w-[100px] h-[50px]" @click="mode = 'cssToScss'">cssToScss</button>
    </div>
    <div v-if="mode === 'scssToCss'" class="w-[1200px] flex flex-col items-center justify-center">
      <div class="w-full my-[20px] p-[20px] border-[1px] border-solid border-[#000]">scssToCss</div>
      <div class="w-full flex items-center justify-between">
        <textarea
          class="w-[500px] h-[400px]"
          v-model="scssCode"
          placeholder=""
          placeholder-class="textarea-placeholder"
        />
        <div>
          <button class="w-[50px]" @click="onCompile">生成</button>
        </div>
        <code
          class="w-[500px] h-[400px] flex flex-col p-[20px] border-[1px] border-solid border-[#000]"
        >
          <div class="shrink-0 px-[20px] border-[1px] border-solid border-[#000] mb-[20px]">
            编译结果
          </div>
          <pre class="flex-1 shrink-0 overflow-auto">{{ resultCss }}</pre>
        </code>
      </div>
    </div>

    <div v-if="mode === 'cssToScss'" class="w-[1200px] flex flex-col items-center justify-center">
      <div class="w-full my-[20px] p-[20px] border-[1px] border-solid border-[#000]">cssToScss</div>
      <div class="w-full flex items-center justify-between">
        <textarea
          class="w-[500px] h-[400px]"
          v-model="cssCode"
          placeholder=""
          placeholder-class="textarea-placeholder"
        />
        <div>
          <button class="w-[50px]" @click="onReCompile">生成</button>
        </div>
        <code
          class="w-[500px] h-[400px] flex flex-col p-[20px] border-[1px] border-solid border-[#000]"
        >
          <div class="shrink-0 px-[20px] border-[1px] border-solid border-[#000] mb-[20px]">
            编译结果
          </div>
          <pre class="flex-1 shrink-0 overflow-auto">{{ resultScss }}</pre>
        </code>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { compileString } from 'sass'
import { ref } from 'vue'
import css2pre from 'css2pre/lib/css2pre'

const mode = ref('scssToCss')

const scssCode = ref(`
 .test1 {
  .test2 {
    color: red;
    .test3 {
       color: blue;
       .test4 {
           color: green;
          .test5 {
               color: yellow;
          }
       }
    }
  }
 }
`)
const cssCode = ref(`
 .test1 .test2 {
  color: red;
}
.test1 .test2 .test3 {
  color: blue;
}
.test1 .test2 .test3 .test4 {
  color: green;
}
.test1 .test2 .test3 .test4 .test5 {
  color: yellow;
}

.test1 .test2 {
  color: red;
}
.test1 .test2 .test3 {
  color: blue;
}
.test1 .test2 .test3 .test4 {
  color: green;
}
.test1 .test2 .test3 .test4 .test5 {
  color: yellow;
}

.test1 .test2 {
  color: red;
}
.test1 .test2 .test3 {
  color: blue;
}
.test1 .test2 .test3 .test4 {
  color: green;
}
.test1 .test2 .test3 .test4 .test5 {
  color: yellow;
}
`)

const resultCss = ref('')
const resultScss = ref('')

const onCompile = () => {
  try {
    const result = compileString(scssCode.value, { style: 'expanded' })
    resultCss.value = result.css
  } catch (error) {
    resultCss.value = `${error}`
  }
}
const onReCompile = () => {
  try {
    const result = css2pre(resultCss.value).to('scss')
    resultScss.value = result
  } catch (error) {
    resultScss.value = `${error}`
  }
}
</script>

## testtest

> asdasdas

`985623114`


## markdown展示vue3代码块

我就问你9527

<vue3-sfc>
<vue3-file name="app.vue">
<template>
  <div class="test">
    <test1 style="margin-bottom: 10px"></test1>
    <test2 style="margin-bottom: 10px"></test2>
    <div style="background: yellow; border: 1px solid #eee">{{ msg }}</div>
    <div style="background: skyblue; border: 1px solid #eee" @click="count = count + 1.1">(点击自增<span>{{ count }}</span>次)</div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue"
import type { Ref } from "vue"
import test1 from "./test1.vue"
import test2 from "./test2.vue"
const count:Ref<number> = ref(1)
const msg = ref("🥵测试markdown")
</script>
<style>
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
.test {
  color: red;
}
</style>
</vue3-file>222-test字符串
  
  111-test字符串
<vue3-file name="test1.vue">
<template>
  <div
    class="resizable-component"
    :ref="getTargetRef"
    :style="{
      width: slotDomData.width,
      height: slotDomData.height
    }">
    <span style="font-size: 12px">自由拖拽改变宽高</span>
    <div
      class="draggable-handle"
      @mousedown="startDragging"
      @touchstart="startDragging"
    ></div>
  </div>
</template>
<script setup>
import useChageWidthHeight from './useChageWidthHeight.js'
const { getTargetRef, startDragging, slotDomData  } = useChageWidthHeight('100px', '100px')
</script>
<style scoped>
.resizable-component {
  position: relative;
  border: 1px solid #ccc;
  overflow: hidden;
}
.draggable-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  bottom: 0;
  right: 0;
  background-color: #3498db;
  color: #fff;
  cursor: pointer;
  user-select: none;
}
</style>
</vue3-file>?



<vue3-file name="test2.vue">
<template>
  <div style="background: pink; border: 1px solid #eee">这个是test2组件</div>
</template>
</vue3-file>
<vue3-file name="useChageWidthHeight.js">
import { ref } from 'vue'
export default (width = '0px', height = '0px') => {
  const slotDomData = ref({
    wrapRef: null,
    isDragging: false,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    width,
    height
  })
  const getTargetRef = (el) => {
    slotDomData.value.wrapRef = el
  }
  const startDragging = (event) => {
    event.preventDefault()
    slotDomData.value.isDragging = true
    slotDomData.value.startX = event.clientX || event.touches[0].clientX
    slotDomData.value.startY = event.clientY || event.touches[0].clientY
    slotDomData.value.startWidth = slotDomData.value.wrapRef.offsetWidth
    slotDomData.value.startHeight = slotDomData.value.wrapRef.offsetHeight
    document.addEventListener('mousemove', handleDragging)
    document.addEventListener('touchmove', handleDragging)
    document.addEventListener('mouseup', stopDragging)
    document.addEventListener('touchend', stopDragging)
  }

  const handleDragging = (event) => {
    if (!slotDomData.value.isDragging) return
    const deltaX = (event.clientX || event.touches[0].clientX) - slotDomData.value.startX
    const deltaY = (event.clientY || event.touches[0].clientY) - slotDomData.value.startY
    slotDomData.value.width = Math.max(50, slotDomData.value.startWidth + deltaX) + 'px'
    slotDomData.value.height = Math.max(50, slotDomData.value.startHeight + deltaY) + 'px'
  }

  const stopDragging = (event) => {
    slotDomData.value.isDragging = false
    document.removeEventListener('mousemove', handleDragging)
    document.removeEventListener('touchmove', handleDragging)
    document.removeEventListener('mouseup', stopDragging)
    document.removeEventListener('touchend', stopDragging)
  }
  return { getTargetRef, startDragging, slotDomData }
}
</vue3-file>
</vue3-sfc>111

```js 
var a = 6
```

`asd`

```html
<div class="wrapper">
    <input id="exp1" class="exp"  type="checkbox" />
    <div class="text">
        <label class="btn" for="exp1"></label>
        <div>
        在下面的图片中，有三个红色的正方形。其中有两个向左浮动，一个向右浮动。要注意到第二个向左浮动的正方形被放在第一个向左浮动的正方形的右边。如果还有更多的正方形这样浮动，它们会继续向右堆放，直到填满容器一整行，之后换行至下一行。</div>
    </div>
</div>
```


[百度](http://baidu.com)


- 列表内容
+ 列表内容
* 列表内容


表头|表头|表头
---|:--:|---:
内容|内容|内容
内容|内容|内容

第二行分割表头和内容。
- 有一个就行，为了对齐，多加了几个
文字默认居左
-两边加：表示文字居中
-右边加：表示文字居右
注：原生的语法两边都要用 | 包起来。此处省略

注意：- + * 跟内容之间都要有一个空格

---
----
***
*****

**这是加粗的文字**
*这是倾斜的文字*`
***这是斜体加粗的文字***
~~这是加删除线的文字~~



```template-vue
<template>
    <div @click="count++">{{ count }}</div> 
</template>

<script>
import { ref } from 'vue'
export default {
    setup() {
        const count = ref(0)
        return {
            count
        }
    }
}
</script>
```

<iframe width="100%" height="500px" frameborder="1" scrolling="auto" src="https://code.juejin.cn/pen/7342752640843841548"></iframe>

### 123123啊实打实啊实打实啊实打实啊实打实啊实打实啊实打实啊实打实啊实打实啊实打实啊实打实啊实打实啊实打实

#### 123123

```html
<div>123123</div>
<script>
    alert(000)
</script>
```

```javascript
const aa = () => {
    return () => ({})
}
const bb = () => new Promise(resolve => resolve(1))
```

```json
{
    "aa": "1231231111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"
}
```
![image][img_0]

* 个人分享 [github地址： https://github.com/a1392558812/myShare](https://github.com/a1392558812/myShare)

```vue-template
<template>
    <div>333</div>
</template>
```

* 在我的后园，可以看见墙外有两株树，一株是枣树，还有一株也是枣树。
## testtest1

* 在我的后园，可以看见墙外有两株树，一株是枣树，还有一株也是枣树。
## testtest2

```vue-template
<template>
    <div>111</div>
</template>
```

* 在我的后园，可以看见墙外有两株树，一株是枣树，还有一株也是枣树。
## testtest3

* 在我的后园，可以看见墙外有两株树，一株是枣树，还有一株也是枣树。
## testtest4

* 在我的后园，可以看见墙外有两株树，一株是枣树，还有一株也是枣树。
## testtest5

* 在我的后园，可以看见墙外有两株树，一株是枣树，还有一株也是枣树。
## testtest6

```vue-template
<template>
    <div>2222</div>
</template>
```

111223


<div></div>

## testtest7
## testtest
[img_0]: 123123

[img_0]: 123123
## testtest7
### testtest8
#### testtest9
##### testtest10
###### testtest11
## testtest7
## testtest7
## testtest7
## testtest7
## testtest7
## testtest7
## testtest7
## testtest7
## testtest7
## testtest7
## testtest7
## testtest7
## testtest7

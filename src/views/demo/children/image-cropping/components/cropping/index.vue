<template>
  <div class="flex flex-col">
    <div class="flex gap-2">
      <div class="bg-white rounded-xl w-[500px] shadow-md p-4 mb-6">
        <div
          class="w-full aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
          <vueCropper ref="cropperRef" :img="fileList[0] ? fileList[0].path : ''" :info="false" :fixed="false"
            :fixedNumber="[1, 1]" :autoCropWidth="vueCropperOption.autoCropWidth"
            :autoCropHeight="vueCropperOption.autoCropHeight" :autoCrop="vueCropperOption.autoCrop"
            :canMove="vueCropperOption.canMove" :canMoveBox="vueCropperOption.canMoveBox" :outputSize="1"
            :outputType="vueCropperOption.outputType" :centerBox="vueCropperOption.centerBox"
            :limitMinSize="vueCropperOption.limitMinSize" @cropMoving="onCropMoving" @imgMoving="onImgMoving"
            @realTime="onRealTime"></vueCropper>
          <div v-if="!fileList[0]?.path" class="text-center text-gray-500">
            <p>请选择一张图片开始裁剪</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl w-[500px] shadow-md p-6" v-if="fileList[0] ? fileList[0].path : ''">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">裁剪设置</h2>

        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <span class="text-gray-700 w-24">图片质量:</span>
            <input type="range" :max="100" :min="10" v-model="vueCropperOption.outputSize"
              class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            <span class="text-gray-600 min-w-12 text-right">{{ +vueCropperOption.outputSize / 100 }}</span>
          </div>

          <div class="flex items-center space-x-2">
            <span class="text-gray-700 w-24">图片格式:</span>
            <select v-model="vueCropperOption.outputType"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="jpg">image/jpg</option>
              <option value="png">image/png</option>
              <option value="jpeg">image/jpeg</option>
              <option value="webp">image/webp</option>
            </select>
          </div>

          <div class="flex items-center space-x-2">
            <span class="text-gray-700 w-24">裁剪框宽：</span>
            <input
              class="flex-1 px-3 py-2 border-1 border-solid border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              type="number" v-model="vueCropperOption.cropW" @input="onCropperSizeChange" />
          </div>

          <div class="flex items-center space-x-2">
            <span class="text-gray-700 w-24">裁剪框高：</span>
            <input
              class="flex-1 px-3 py-2 border-1 border-solid border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              type="number" v-model="vueCropperOption.cropH" @input="onCropperSizeChange" />
          </div>

          <div class="flex items-center space-x-2">
            <span class="text-gray-700 w-24">缩放比例：</span>
            <input type="number" v-model="vueCropperOption.scaling" @input="onScaling"
              class="flex-1 px-3 py-2 border-1 border-solid border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            <span class="text-gray-500 text-sm">(比例切勿太大，以免卡死)</span>
          </div>

          <div class="text-gray-600 text-sm p-3 bg-gray-50 rounded-lg">
            结果生成图片的宽 x 高：{{ vueCropperOption.cropW * vueCropperOption.scaling }}px * {{ vueCropperOption.cropH *
              vueCropperOption.scaling }}px
          </div>

          <div class="flex flex-wrap gap-3 pt-2">
            <button @click="$refs.cropperRef.changeScale(-1)"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              缩小
            </button>
            <button @click="$refs.cropperRef.changeScale(1)"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              放大
            </button>
            <button @click="$refs.cropperRef.rotateLeft()"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              左旋
            </button>
            <button @click="$refs.cropperRef.rotateRight()"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              右旋
            </button>
            <button @click="confirmCropper"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
              确定裁剪
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl w-[500px]" v-if="resultImage.path">
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">裁剪预览</h2>
          <a class="block w-full aspect-square bg-gray-50 rounded-lg border-1 border-solid border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            target="_blank" title="预览" :href="resultImage.path">
            <img :src="resultImage.path" class="w-full h-full object-contain" />
          </a>
          <div class="mt-4 text-gray-600 text-sm p-3 bg-gray-50 rounded-lg">
            图片的宽 x 高：{{ vueCropperOption.cropW * vueCropperOption.scaling }}px * {{ vueCropperOption.cropH *
              vueCropperOption.scaling }}px
          </div>
          <button @click="onDownload"
            class="w-full mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm">
            下载图片
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, watch } from 'vue'
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'

const emit = defineEmits(['update:fileList'])

const props = defineProps({
  fileList: {
    type: Array,
    default: () => []
  }
})

const cropperRef = ref(null)

const vueCropperOption = reactive({
  ifShow: false,
  autoCropWidth: 200,
  autoCropHeight: 200,
  cropW: 200,
  cropH: 200,
  outputType: 'png',
  outputSize: 100,
  canMove: true,
  canMoveBox: true,
  centerBox: true,
  autoCrop: true,
  imageSize: 50,
  limitMinSize: 65,
  scaling: 1
})

const resultImage = reactive({
  path: ''
})

watch(
  () => props.fileList,
  (newVal, oldVal) => {
    if (newVal && newVal.length) {
      vueCropperOption.outputType = newVal[0].type.split('/')[1] || 'png'
    }
  },
  {
    immediate: true
  }
)

const onScaling = (e) => {
  const scaling = +e.target.value
  vueCropperOption.scaling = scaling <= 0 ? 0 : scaling
}

const confirmCropper = (e) => {
  cropperRef.value.getCropBlob((data) => {
    let tempFilePaths = window.URL.createObjectURL(data)
    let img = new Image()
    img.src = tempFilePaths
    img.onerror = () => alert('生成图片失败')
    img.onload = () => {
      let canvas = document.createElement('canvas')
      canvas.width = vueCropperOption.cropW * +vueCropperOption.scaling
      canvas.height = vueCropperOption.cropH * +vueCropperOption.scaling
      let ctx = canvas.getContext('2d')
      if (data.type === 'image/png') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        (blob) => {
          window.URL.revokeObjectURL(resultImage.path || '')
          window.URL.revokeObjectURL(tempFilePaths)
          img = null
          ctx = null
          canvas = null
          if (!blob) {
            alert('生成图片失败')
          }
          resultImage.path = window.URL.createObjectURL(blob)
        },
        data.type,
        +vueCropperOption.outputSize / 100
      )
    }
  })
}

const onCropMoving = (e) => {
  console.log('onCropMoving', e)
}
const onRealTime = (e) => {
  vueCropperOption.cropW = cropperRef.value.cropW
  vueCropperOption.cropH = cropperRef.value.cropH
}

const onImgMoving = (e) => {
  console.log('onImgMoving', e)
}

const onCropperSizeChange = () => {
  let cropW = +vueCropperOption.cropW
  let cropH = +vueCropperOption.cropH

  const imgAxis = cropperRef.value.getImgAxis()
  if (imgAxis.x1 < 0) {
    imgAxis.x1 = 0
  }
  if (imgAxis.x2 > 500) {
    imgAxis.x2 = 500
  }
  if (imgAxis.y1 < 0) {
    imgAxis.y1 = 0
  }
  if (imgAxis.y2 > 500) {
    imgAxis.y2 = 500
  }
  const maxCropW = imgAxis.x2 - imgAxis.x1
  const maxCropH = imgAxis.y2 - imgAxis.y1

  if (cropW > maxCropW) {
    cropW = maxCropW
  }
  if (cropH > maxCropH) {
    cropH = maxCropH
  }

  if (!cropW) {
    cropW = 0
  }
  if (!cropH) {
    cropH = 0
  }

  cropperRef.value.changeCrop(cropW, cropH)
  vueCropperOption.cropW = cropW
  vueCropperOption.cropH = cropH
}

const onDownload = () => {
  const link = document.createElement('a')
  link.download = `image.${vueCropperOption.outputType}`
  link.href = resultImage.path
  link.click()
}
</script>

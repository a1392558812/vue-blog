<template>
  <div class="flex">
    <div class="mr-[20px]">
      <div class="w-[500px] h-[500px]">
        <vueCropper
          ref="cropperRef"
          :img="fileList[0] ? fileList[0].path : ''"
          :info="false"
          :fixed="false"
          :fixedNumber="[1, 1]"
          :autoCropWidth="vueCropperOption.autoCropWidth"
          :autoCropHeight="vueCropperOption.autoCropHeight"
          :autoCrop="vueCropperOption.autoCrop"
          :canMove="vueCropperOption.canMove"
          :canMoveBox="vueCropperOption.canMoveBox"
          :outputSize="1"
          :outputType="vueCropperOption.outputType"
          :centerBox="vueCropperOption.centerBox"
          :limitMinSize="vueCropperOption.limitMinSize"
          @cropMoving="onCropMoving"
          @imgMoving="onImgMoving"
          @realTime="onRealTime"
        ></vueCropper>
      </div>

      <div class="" v-if="fileList[0] ? fileList[0].path : ''">
        <div>
          <span>图片质量: </span>
          <input type="range" :max="100" :min="10" v-model="vueCropperOption.outputSize" />
          {{ +vueCropperOption.outputSize / 100 }}
        </div>
        <div>
          <span>图片格式: </span>
          <select v-model="vueCropperOption.outputType">
            <option value="jpg">image/jpg</option>
            <option value="png">image/png</option>
            <option value="jpeg">image/jpeg</option>
            <option value="webp">image/webp</option>
          </select>
        </div>
        <div>
          <span>裁剪框宽：</span>
          <input
            class="mr-[20px]"
            type="number"
            v-model="vueCropperOption.cropW"
            @input="onCropperSizeChange"
          />
        </div>
        <div>
          <span>裁剪框高：</span>
          <input
            class="mr-[20px]"
            type="number"
            v-model="vueCropperOption.cropH"
            @input="onCropperSizeChange"
          />
        </div>
        <div>
          <span>裁剪生成的图片缩放比例：</span>
          <input type="number" v-model="vueCropperOption.scaling" @input="onScaling" />
          <span>(比例切勿太大，以免卡死)</span>
        </div>
        <div>
          结果生成图片的宽 x 高：{{ vueCropperOption.cropW * vueCropperOption.scaling }}px *
          {{ vueCropperOption.cropH * vueCropperOption.scaling }}px
        </div>

        <div class="">
          <button @click="$refs.cropperRef.changeScale(-1)" class="">背景图缩小</button>
          <button class="" @click="$refs.cropperRef.changeScale(1)">背景图放大</button>
          <button @click="$refs.cropperRef.rotateLeft()">背景图左旋</button>
          <button @click="$refs.cropperRef.rotateRight()">背景图右旋</button>
          <button @click="confirmCropper">确定</button>
        </div>
      </div>
    </div>
    <div v-if="resultImage.path">
      <a
        class="block w-[300px] h-[300px] overflow-auto border-[1px] border-solid border-[#000]"
        target="_blank"
        title="预览"
        :href="resultImage.path"
      >
        <img :src="resultImage.path" class="w-full h-full object-contain" />
      </a>
      <div>
        图片的宽 x 高：{{ vueCropperOption.cropW * vueCropperOption.scaling }}px *
        {{ vueCropperOption.cropH * vueCropperOption.scaling }}px
        <button @click="onDownload">下载</button>
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
  console.log('onScaling', e)
  const scaling = +e.target.value
  vueCropperOption.scaling = scaling <= 0 ? 0 : scaling
}

const confirmCropper = (e) => {
  console.log('confirmCropper')
  cropperRef.value.getCropBlob((data) => {
    let tempFilePaths = window.URL.createObjectURL(data)
    let img = new Image()
    img.src = tempFilePaths
    img.onerror = () => alert('生成图片失败')
    img.onload = () => {
      console.log('img', img, data.type)

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
          console.log('blob', blob)
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

  console.log('onCropperSizeChange')
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

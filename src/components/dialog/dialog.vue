<template>
  <div
    v-if="ifShow"
    class="fixed left-[0] top-[0] w-screen h-screen bg-[rgba(0,_0,_0,_0.6)]"
    @click="dialogOutClose"
  >
    <div
      class="p-[10px] rounded-[10px] absolute left-2/4 top-2/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#fff] flex flex-col items-center justify-center"
      @click.stop="() => {}"
    >
      <div
        v-if="showHeader"
        class="w-full flex flex-shrink-0 justify-between mb-[10px] text-[20px]"
      >
        {{ title }}
      </div>
      <slot name="content">
        <div class="flex-1">{{ content }}</div>
      </slot>
      <div v-if="showFooter" class="mt-[10px] w-full flex flex-shrink-0 justify-end">
        <div
          class="px-[20px] py-[10px] rounded-[5px] bg-[#f5f5f5] cursor-pointer border-[1px] border-solid border-[#ccc] ml-[10px]"
          @click="dialogConfirm"
        >
          确定
        </div>
        <div
          class="px-[20px] py-[10px] rounded-[5px] bg-[#f5f5f5] cursor-pointer border-[1px] border-solid border-[#ccc] ml-[10px]"
          @click="dialogClose"
        >
          关闭
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'custom-dialog'
})

const props = defineProps({
  showHeader: {
    // 是否显示头部
    type: Boolean,
    default: true
  },
  showFooter: {
    // 是否显示底部
    type: Boolean,
    default: true
  },
  dialogABool: {
    // 是否默认打开
    type: Boolean,
    default: false
  },
  maskClose: {
    // 点击遮罩是否可以关闭
    type: Boolean,
    default: true
  },
  open: {
    // 自定义打开事件
    type: Function
  },
  confirm: {
    // 自定义确认事件
    type: Function
  },
  close: {
    // 自定义关闭事件
    type: Function
  },
  title: {
    // 标题
    type: String,
    default: '这是一个标题'
  },
  content: {
    // 内容
    type: String,
    default: '这是一个内容'
  }
})

const emit = defineEmits(['open', 'close'])

const ifShow = ref(props.dialogABool)

const dialogConfirm = () => {
  if (props.confirm) {
    props.confirm(closeCallback)
  } else {
    console.log('默认的确认逻辑')
    closeCallback()
  }
}
const dialogClose = () => {
  if (props.close) {
    props.close(closeCallback)
  } else {
    defaultClose()
  }
  emit('close')
}
const dialogOutClose = () => {
  if (props.maskClose) {
    defaultClose()
  }
}

const defaultClose = () => {
  console.log('默认的关闭逻辑')
  closeCallback()
}

const closeCallback = () => {
  ifShow.value = false
}

defineExpose({
  dialogClose
})
</script>

<style scoped lang="scss"></style>

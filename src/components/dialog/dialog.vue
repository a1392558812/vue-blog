<template>
  <div v-if="ifShow" class="dialog-wrap" @click="dialogOutClose">
    <div class="dialog" @click.stop="() => {}">
      <div v-if="showHeader" class="header">{{ title }}</div>
      <slot name="content">
        <div class="content">{{ content }}</div>
      </slot>
      <div v-if="showFooter" class="footer">
        <div class="footer-btn" @click="dialogConfirm">确定</div>
        <div class="footer-btn" @click="dialogClose">关闭</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineComponent, ref } from 'vue'

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

<style scoped lang="scss">
.dialog-wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  .dialog {
    padding: 10px;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 800px;
    height: 500px;
    background: #fff;
    z-index: 1100;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .header {
      width: 100%;
      display: flex;
      flex-shrink: 0;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 20px;
    }
    .content {
      flex: 1;
    }
    .footer {
      margin-top: 10px;
      width: 100%;
      display: flex;
      flex-shrink: 0;
      justify-content: flex-end;
      .footer-btn {
        padding: 10px 20px;
        border-radius: 5px;
        background: #f5f5f5;
        cursor: pointer;
        border: 1px solid #ccc;
        margin-left: 10px;
      }
    }
  }
}
</style>

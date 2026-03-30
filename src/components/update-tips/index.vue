<template>
  <div
    v-if="offlineReady || needRefresh"
    class="w-full h-full fixed top-0 left-0 z-50 flex flex-col items-center justify-center bg-[rgba(0,0,0,0.8)]"
  >
    <div v-if="offlineReady">现在App已离线工作</div>
    <div v-else class="mb-[150px] text-[50px] font-900 text-[var(--global-primary-color)]">
      <span>{{ title || '内容有更新' }}</span>
    </div>
    <div class="flex items-center justify-center">
      <commonmBtn class="mr-[20px]" v-if="needRefresh" @btnClick="handleUpdate">
        重新加载
      </commonmBtn>
      <commonmBtn @btnClick="close">关闭</commonmBtn>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import commonmBtn from '@/components/commonm-btn/index.vue'

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
  onRegisteredSW(swUrl, r) {
    console.log('[PWA] Service Worker 注册成功', { swUrl, r })
  },
  onNeedRefresh() {
    console.log('[PWA] 发现新内容，需要刷新')
  },
  onOfflineReady() {
    console.log('[PWA] 应用已准备好离线工作')
  },
  onRegistered() {
    console.log('[PWA] Service Worker 注册成功')
  },
  onRegisterError(error) {
    console.log('[PWA] Service Worker 注册失败', error)
  }
})

const handleUpdate = () => {
  updateServiceWorker(false).then(() => {
    window.location.reload()
  })
}

/**
 * 根据 PWA 状态计算提示标题
 */
const title = computed(() => {
  if (offlineReady.value) return '应用已准备好离线工作'
  if (needRefresh.value) return '有新内容可用，点击重新加载按钮更新'
  return ''
})

/**
 * 关闭更新提示
 */
function close() {
  // 重置状态
  offlineReady.value = false
  needRefresh.value = false
}
</script>

<style scoped></style>

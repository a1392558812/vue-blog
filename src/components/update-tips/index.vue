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
      <commonmBtn class="mr-[20px]" v-if="needRefresh" @btnClick="updateServiceWorker()">
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

/**
 * 定期检查更新的时间间隔（毫秒）
 * 这里设置为每小时检查一次
 */
const period = 60 * 60 * 1000

/**
 * 使用 PWA 注册钩子函数
 * 该函数会注册 Service Worker 并监听其状态变化
 */
const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
  onRegisteredSW(swUrl, r) {
    r &&
      setInterval(async () => {
        if (r.installing || !navigator) return

        if ('connection' in navigator && !navigator.onLine) return

        const resp = await fetch(swUrl, {
          cache: 'no-store',
          headers: {
            cache: 'no-store',
            'cache-control': 'no-cache'
          }
        })

        if (resp?.status === 200) await r.update()
      }, period)
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

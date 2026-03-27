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
 * Service Worker 激活状态
 */
const swActivated = ref(false)

/**
 * 注册定期同步检查
 * 该函数会每小时检查一次 Service Worker 是否有更新
 * @param {string} swUrl - Service Worker 文件的 URL
 * @param {ServiceWorkerRegistration} r - Service Worker 注册对象
 */
function registerPeriodicSync(swUrl, r) {
  // 如果时间间隔小于等于 0，则不进行定期检查
  if (period <= 0) return
  console.log(`[PWA] 注册定期同步检查`)

  // 设置定时器，定期检查更新
  setInterval(async () => {
    // 如果设备离线，则跳过检查
    if ('onLine' in navigator && !navigator.onLine) return

    // 发起请求检查 Service Worker 文件是否有更新
    const resp = await fetch(swUrl, {
      cache: 'no-store', // 不使用缓存
      headers: {
        cache: 'no-store',
        'cache-control': 'no-cache' // 强制不使用缓存
      }
    })

    // 如果请求成功，触发 Service Worker 更新
    if (resp?.status === 200) await r.update()
  }, period)
}

/**
 * 使用 PWA 注册钩子函数
 * 该函数会注册 Service Worker 并监听其状态变化
 */
const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
  /**
   * Service Worker 注册成功后的回调
   * @param {string} swUrl - Service Worker 文件的 URL
   * @param {ServiceWorkerRegistration} r - Service Worker 注册对象
   */
  onRegisteredSW(swUrl, r) {
    console.log('Service Worker 注册成功')
    if (period <= 0) return

    // 检查 Service Worker 的状态
    if (r?.active?.state === 'activated') {
      console.log('[PWA] Service Worker 已经激活')
      swActivated.value = true
      // 注册定期同步检查
      registerPeriodicSync(swUrl, r)
    } else if (r?.installing) {
      console.log('[PWA] Service Worker 正在安装')
      // 监听 Service Worker 状态变化
      r.installing.addEventListener('statechange', (e) => {
        /** @type {ServiceWorker} */
        const sw = e.target
        // 更新激活状态
        swActivated.value = sw.state === 'activated'
        // 如果激活成功，注册定期同步检查
        if (swActivated.value) registerPeriodicSync(swUrl, r)
      })
    } else {
      console.log('[PWA] 未找到 Service Worker')
    }
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

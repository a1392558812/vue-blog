<template>
  <div
    v-if="needRefresh"
    class="w-full h-full fixed top-0 left-0 z-50 flex flex-col items-center justify-center bg-[rgba(0,0,0,0.8)]"
  >
    <div class="mb-[150px] text-[50px] font-900 text-[var(--global-primary-color)]">
      <span>{{ title || '内容有更新' }}</span>
    </div>
    <div class="flex items-center justify-center">
      <commonmBtn class="mr-[20px]" v-if="needRefresh" @btnClick="updateServiceWorker">
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

// check for updates every hour
const period = 60 * 60 * 1000

const swActivated = ref(false)

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 * @param {string} swUrl
 * @param {ServiceWorkerRegistration} r
 */
function registerPeriodicSync(swUrl, r) {
  if (period <= 0) return
  console.log(`[PWA] registerPeriodicSync`)
  setInterval(async () => {
    if ('onLine' in navigator && !navigator.onLine) return

    const resp = await fetch(swUrl, {
      cache: 'no-store',
      headers: {
        cache: 'no-store',
        'cache-control': 'no-cache'
      }
    })

    if (resp?.status === 200) await r.update()
  }, period)
}

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
  immediate: true,
  onRegisteredSW(swUrl, r) {
    console.log('onRegisteredSW')
    if (period <= 0) return
    if (r?.active?.state === 'activated') {
      console.log('[PWA] Service worker already activated')
      swActivated.value = true
      registerPeriodicSync(swUrl, r)
    } else if (r?.installing) {
      console.log('[PWA] Service worker installing')
      r.installing.addEventListener('statechange', (e) => {
        /** @type {ServiceWorker} */
        const sw = e.target
        swActivated.value = sw.state === 'activated'
        if (swActivated.value) registerPeriodicSync(swUrl, r)
      })
    } else {
      console.log('[PWA] Service worker not found')
    }
  },
  onNeedRefresh() {
    console.log('[PWA] onNeedRefresh')
  },
  onOfflineReady() {
    console.log('[PWA] onOfflineReady')
  },
  onRegistered() {
    console.log('[PWA] onRegistered')
  },
  onRegisterError(error) {
    console.log('[PWA] onRegisterError', error)
  }
})

const title = computed(() => {
  if (offlineReady.value) return 'App ready to work offline'
  if (needRefresh.value) return 'New content available, click on reload button to update.'
  return ''
})

function close() {
  offlineReady.value = false
  needRefresh.value = false
}
</script>

<style scoped></style>
